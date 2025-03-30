export const novelFr = {
  novel: {
    createPage: {
      title: 'Nouveau roman',
    },
    form: {
      title: {
        label: 'Titre du roman',
        error: {
          required: 'Le titre est obligatoire',
          minlength: 'Le titre doit faire au moins 3 caractères',
        },
      },
      description: {
        label: 'Description',
      },
      createButton: {
        label: 'Créer',
      },
      editButton: {
        label: 'Mettre à jour',
      },
      deleteButton: {
        label: 'Supprimer',
      },
    },
    main: {
      notFound: 'Roman non trouvé',
    },
    delete: {
      header: 'Supprimer {{name}}',
      text: "La suppression d'un roman est irréversible. Si vous êtes sûr(e) de vouloir supprimer ce roman, merci de taper son nom (<strong>{{name}}</strong>) ci-dessous.",
      form: {
        nameField: {
          label: 'Nom du roman',
        },
        submit: 'Confirmer',
        cancel: 'Annuler',
      },
      result: {
        ok: 'Le roman a bien été supprimé',
        error: 'Une erreur est survenue lors de la suppression du roman',
      },
    },
    edit: {
      result: {
        ok: 'Le roman a bien été mis à jour',
        error: 'Une erreur est survenue lors de la mise à jour du roman',
      },
    },
  },
};
