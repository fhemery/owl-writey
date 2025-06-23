export const novelFr = {
  novel: {
    createPage: {
      title: 'Nouveau roman',
    },

    actions: {
      move: {
        label: 'Déplacer',
      },
      moveLeft: {
        label: 'Déplacer avant',
      },
      moveRight: {
        label: 'Déplacer après',
      },
      delete: {
        label: 'Supprimer',
      },
      go: {
        label: 'Voir',
      },
      words: {
        label: 'Mots',
      },
      sceneCount: {
        label: 'Scènes',
      },
      chapterCount: {
        label: 'Chapitres',
      },
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
      description: {
        placeholder: 'Détails du personnage',
      },
      color: {
        tooltip: 'Couleur du personnage',
      },
      deleteConfirm: {
        title: 'Supprimer le personnage',
        text: "La suppression d'un personnage est irréversible. Êtes-vous sûr(e) ?",
        result: {
          ok: 'Le personnage a bien été supprimé',
          error: 'Une erreur est survenue lors de la suppression du personnage',
        },
      },
      tags: {
        label: 'Tags',
        add: {
          ariaLabel: 'Ajouter un tag',
          placeholder: 'Ajouter un tag',
        },
        remove: {
          ariaLabel: 'Supprimer le tag {{tag}}',
        },
      },
    },
    chapter: {
      home: {
        label: 'Retour au roman',
      },
      title: {
        label: 'Chapitre',
      },
      scenes: {
        label: 'Scène(s)',
      },
      newScene: 'Nouvelle scène',
      outline: {
        placeholder: 'Entrez ici un résumé du chapitre',
      },
      words: {
        label: 'Mots',
      },
      previous: {
        label: 'Chapitre précédent : {{title}}',
      },
      next: {
        label: 'Chapitre suivant : {{title}}',
      },
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
      title: {
        chapterLabel: 'Chapitre',
        label: 'Scène',
      },
      home: {
        label: 'Retour au roman',
      },
      previous: {
        label: 'Scène précédente : {{title}}',
      },
      next: {
        label: 'Scène suivante : {{title}}',
      },
      outline: {
        label: 'Résumé :',
        placeholder: 'Entrez ici un résumé de la scène',
      },
      notes: {
        label: 'Notes :',
      },
      deleteConfirm: {
        title: 'Supprimer la scène',
        text: "La suppression d'une scène est irréversible. Êtes vous sûr(e) de vouloir la supprimer ?",

        result: {
          ok: 'La scène a bien été supprimée',
          error: 'Une erreur est survenue lors de la suppression de la scène',
        },
      },
      pov: {
        label: 'Point de vue',
        select: {
          label: 'Sélectionner {{name}}',
        },
        unselect: {
          label: 'Déselectionner',
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
    },
    settings: {
      export: {
        title: 'Exporter le roman',
        separator: {
          label: 'Séparateur entre les scènes',
        },
        includeSceneTitle: {
          label: 'Inclure le titre de la scène',
        },
        button: {
          label: 'Exporter',
        },
      },
      tab: {
        generalInfo: 'Informations générales',
        export: 'Export',
      },
    },
    overview: {
      newChapter: 'Ajouter un chapitre',
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
      toggleLeftPane: 'Afficher/Masquer le panneau de gauche',
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
