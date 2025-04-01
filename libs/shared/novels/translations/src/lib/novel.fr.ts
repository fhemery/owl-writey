export const novelFr = {
  novel: {
    createPage: {
      title: 'Nouveau roman',
    },
    defaults: {
      newChapter: {
        label: 'Nouveau chapitre',
      },
      newScene: {
        label: 'Nouvelle scène',
      },
    },
    sidebar: {
      title: 'Table des matières',
    },
    chapter: {
      deleteConfirm: {
        title: 'Supprimer le chapitre',
        text: "La suppression d'un chapitre est irréversible et entraîne la suppression de toutes ses scènes. Êtes vous sûr(e) de vouloir le supprimer ?",

        result: {
          ok: 'Le chapitre a bien été supprimé',
          error: 'Une erreur est survenue lors de la suppression du chapitre',
        },
      },
    },
    overview: {
      newChapter: 'Ajouter un chapitre',
      chapter: {
        delete: {
          label: 'Supprimer',
        },
      },
      noChapters: {
        label: "Aucun chapitre pour le moment. L'histoire commence ici :",
        button: 'Ajouter un chapitre',
      },
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
      header: {
        edit: 'Modifier les informations générales',
      },
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
