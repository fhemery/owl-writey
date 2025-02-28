import { ApiResponseStatus, TestUserBuilder } from '@owl/back/test-utils';
import { ExerciseStatus, ExerciseToCreateDto } from '@owl/shared/contracts';

import { app, exerciseUtils, moduleTestInit } from './module-test-init';
import { ExerciseTestBuilder } from './utils/exercise-test-builder';

describe('GET /exercises/:id', () => {
  void moduleTestInit();

  describe('error cases', () => {
    it('should return 401 if the user is not logged', async () => {
      await app.logAs(null);

      const response = await exerciseUtils.getOne('1');
      expect(response.status).toBe(401);
    });

    it('should return 400 if type is not valid', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const response = await exerciseUtils.create({
        ...ExerciseTestBuilder.ExquisiteCorpse(),
        type: 'Not a valid type',
      } as unknown as ExerciseToCreateDto);
      expect(response.status).toBe(400);
    });

    it('should return 404 if user does not participate to exercise', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const { locationId } = await exerciseUtils.create(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      await app.logAs(TestUserBuilder.Bob());
      const response = await exerciseUtils.getOne(locationId ?? '');
      expect(response.status).toBe(404);
    });
  });

  describe('success cases', () => {
    it('should return 200 if exercise belongs to user', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise = ExerciseTestBuilder.ExquisiteCorpse();

      const { locationId } = await exerciseUtils.create(exercise);

      const { status, body } = await exerciseUtils.getOne(locationId ?? '');
      expect(status).toBe(200);
      expect(body?.name).toBe(exercise.name);
      expect(body?.id).toBe(locationId);
      expect(body?.status).toBe(ExerciseStatus.Ongoing);
    });

    it('should return hateoas link to delete, finish and participate if exercise belongs to user', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise = ExerciseTestBuilder.ExquisiteCorpse();

      const { locationId } = await exerciseUtils.create(exercise);

      const { status, body } = await exerciseUtils.getOne(locationId ?? '');
      expect(status).toBe(200);
      if (!body) {
        fail('Body is empty');
      }
      expect(body._links.self).toBe(`/api/exercises/${locationId}`);
      expect(body._links.delete).toBe(`/api/exercises/${locationId}`);
      expect(body._links.finish).toBe(`/api/exercises/${locationId}/finish`);
      expect(body._links.invite).toBe(
        `/api/exercises/${locationId}/participants`
      );
      expect(body._links.leave).toBeUndefined();
    });

    it('should not return hateoas link to delete, finish and participate if user is not admin', async () => {
      await app.logAs(TestUserBuilder.Alice());
      const exercise = ExerciseTestBuilder.ExquisiteCorpse();

      const { locationId } = await exerciseUtils.create(exercise);
      // TODO can we rewrite the tests to use the hateoas links?
      // Problem is we need to shoot to the right api path, which is empty in test.
      // But we might forget the base api path in the future...
      await app.logAs(TestUserBuilder.Bob());
      (await exerciseUtils.addParticipant(locationId ?? '')).expectStatus(
        ApiResponseStatus.NO_CONTENT
      );

      const { status, body } = await exerciseUtils.getOne(locationId ?? '');
      expect(status).toBe(200);
      if (!body) {
        fail('Body is empty');
      }
      expect(body._links.self).toBe(`/api/exercises/${locationId}`);
      expect(body._links.delete).toBeUndefined();
      expect(body._links.finish).toBeUndefined();
      expect(body._links.invite).toBeUndefined();
      expect(body._links.leave).toBe(
        `/api/exercises/${locationId}/participants/me`
      );
    });

    it('should set currentUser in the participants', async () => {
      const alice = TestUserBuilder.Alice();
      await app.logAs(alice);

      const id = await exerciseUtils.createAndGetId(
        ExerciseTestBuilder.ExquisiteCorpse()
      );
      const exercise = await exerciseUtils.get(id);

      expect(exercise.participants).toHaveLength(1);
      expect(exercise.participants[0].uid).toBe(alice.uid);
      expect(exercise.participants[0].name).toBe(alice.name);
      expect(exercise.participants[0].isAdmin).toBe(true);
    });

    it('should return a connect link to participants', async () => {
      await app.logAs(TestUserBuilder.Alice());

      const exercise = await exerciseUtils.createAndRetrieve(
        ExerciseTestBuilder.ExquisiteCorpse()
      );

      expect(exercise._links.connect).toBe(
        `/api/exercises/${exercise.id}/events`
      );
    });
  });
});
