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
      newCharacter: {
        label: 'Nouveau personnage',
        name: 'Jane Doe',
      },
    },
    sidebar: {
      title: 'Table des matières',
      universe: {
        characters: 'Personnages',
      },
    },
    character: {
      title: 'Personnages',
      deleteConfirm: {
        title: 'Supprimer le personnage',
        text: "La suppression d'un personnage est irréversible. Êtes vous sûr(e) ?",
        result: {
          ok: 'Le personnage a bien été supprimé',
          error: 'Une erreur est survenue lors de la suppression du personnage',
        },
      },
      move: {
        left: {
          label: 'Remonter',
        },
        right: {
          label: 'Descendre',
        },
      },
      delete: {
        label: 'Supprimer',
      },
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
    scene: {
      deleteConfirm: {
        title: 'Supprimer la scène',
        text: "La suppression d'une scène est irréversible. Êtes vous sûr(e) de vouloir la supprimer ?",

        result: {
          ok: 'La scène a bien été supprimée',
          error: 'Une erreur est survenue lors de la suppression de la scène',
        },
      },
      move: {
        up: {
          label: 'Déplacer en haut',
        },
        down: {
          label: 'Déplacer en bas',
        },
      },
      transfer: {
        label: 'Transférer vers un autre chapitre',
        text: 'Sélectionnez le chapitre et la scène APRÈS LAQUELLE vous voulez transférer la scène',
        title: 'Transférer une scène',
        firstPosition: {
          label: 'Ajouter au début',
        },
      },
      goto: {
        label: 'Accéder à la scène',
      },
    },
    overview: {
      newChapter: 'Ajouter un chapitre',
      chapter: {
        move: {
          left: {
            label: 'Déplacer avant',
          },
          right: {
            label: 'Déplacer après',
          },
        },
        delete: {
          label: 'Supprimer',
        },
        go: {
          label: 'Voir',
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
