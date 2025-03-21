import { dashboardFr } from './modules/dashboard.fr';
import { eventsFr } from './modules/events.fr';
import { exerciseFr } from './modules/exercise.fr';
import { homeFr } from './modules/home.fr';
import { notFoundFr } from './modules/not-found.fr';

export const uiFr = {
  general: {
    ok: 'OK',
    yes: 'Oui',
    no: 'Non',
    exercises: {
      type: {
        ExquisiteCorpse: 'Cadavre exquis',
      },
    },
    time: {
      ago: 'Il y a {{time}}',
      left: 'Il reste {{time}}',
      units: {
        year: {
          singular: 'an',
          plural: 'ans',
        },
        month: {
          singular: 'mois',
          plural: 'mois',
        },
        week: {
          singular: 'week',
          plural: 'weeks',
        },
        day: {
          singular: 'jour',
          plural: 'jours',
        },
        hour: {
          singular: 'heure',
          plural: 'heures',
        },
        minute: {
          singular: 'minute',
          plural: 'minutes',
        },
        second: {
          singular: 'seconde',
          plural: 'secondes',
        },
      },
    },
  },
  auth: {
    title: 'Connexion',
    error: 'Erreur de connexion',
    form: {
      email: {
        label: 'Email',
      },
      password: {
        label: 'Mot de passe',
      },
      submitButton: {
        label: 'Connexion',
      },
    },
    register: {
      label: 'Pas de compte ?',
      link: 'Inscription',
    },
  },
  register: {
    title: 'Inscription',
    error:
      'Erreur à la création du compte. Peut-être que ce compte existe déjà ?',
    login: {
      label: 'Déjà un compte ?',
      link: 'Connexion',
    },
    form: {
      error: {
        passwordNotMatching: 'Les mots de passe ne correspondent pas',
      },
      email: {
        label: 'Email',
        error: {
          required: "L'email est obligatoire",
          invalid: "Le format de l'email est incorrect",
        },
      },
      name: {
        label: 'Pseudo',
        error: {
          required: 'Le pseudo est obligatoire',
          minlength: 'Le pseudo doit contenir au moins 3 caractères',
        },
      },
      password: {
        label: 'Mot de passe',
        error: {
          required: 'Le mot de passe est obligatoire',
          minlength: 'Le mot de passe doit contenir au moins 8 caractères',
        },
      },
      repeatPassword: {
        label: 'Répéter le mot de passe',
        error: {
          required: 'Champ obligatoire',
          minlength: 'Au moins 8 caractères',
        },
      },
      submitButton: {
        label: 'Inscription',
      },
    },
  },
  ...dashboardFr,
  ...exerciseFr,
  ...notFoundFr,
  ...eventsFr,
  ...homeFr,
};
