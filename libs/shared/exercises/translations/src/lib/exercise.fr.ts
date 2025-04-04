export const exerciseFr = {
  exercise: {
    new: {
      title: 'Nouvel exercice',
    },
    form: {
      name: {
        label: 'Titre',
        help: 'Le titre de votre exercice',
        error: {
          required: 'Le titre est obligatoire',
          minlength: 'Le titre doit faire au moins 3 caractères',
        },
      },
      type: {
        label: 'Type',
        error: {
          required: 'Le type est obligatoire',
        },
      },
      submitButton: {
        label: 'Valider',
      },
      exquisiteCorpse: {
        description: {
          text: "L'exercice du cadavre exquis est un jeu d'écriture collectif. Chaque participant.e écrit un texte à partir des précédents",
        },
        nbIterations: {
          label: 'Nombre de tours',
          error: {
            min: 'Le nombre de tours doit être supérieur à 1',
          },
          help: "Le nombre de contributions des auteurices avant que l'exercice ne s'arrête. Laissez vide ou mettre \"0\" pour continuer indéfiniment ou jusqu'à ce que vous l'arrêtiez.",
        },
        iterationDuration: {
          label: "Durée d'un tour",
          help: 'Le temps dont dispose une Plume après avoir pris la main.',
          options: {
            fiveMinutes: '5 minutes',
            fifteenMinutes: '15 minutes',
            oneHour: '1 heure',
            oneDay: '1 jour',
            infinite: 'Infini',
          },
        },
        words: {
          label: 'Limites de mots',
          minWords: {
            label: 'Minimum de mots',
            error: {
              min: 'La limite de mots doit être supérieure à 1',
            },
          },
          maxWords: {
            label: 'Maximum de mots',
            error: {
              min: 'La limite de mots doit être supérieure à 1',
            },
          },
          error: {
            shouldHaveMaxWordsGreaterThanMinWords:
              'Le maximum de mots doit être supérieur au minimum',
          },
          help: {
            text: "Les nombres minimum et maximum de mots qu'une Plume doit écrire à son tour. Laissez vide pour n'imposer aucune limite.",
          },
        },
        authorCanAnswer: {
          label: "L'auteur peut écrire une suite à son propre textes",
        },
        initialText: {
          label: 'Écrivez le début de votre histoire :',
          help: "C'est le premier texte que verront vos participant.e.s. Il vous permet d'orienter l'histoire !",
          error: {
            required: 'Le texte initial est obligatoire',
            minlength: 'Le texte initial doit faire minimum 50 caractères',
          },
        },
      },
    },
    page: {
      loading: "Chargement de l'exercice en cours...",
    },
    toolbar: {
      link: {
        label: 'Partager',
      },
      leave: {
        label: "Quitter l'exercice",
      },
      edit: {
        label: 'Modifier',
      },
      delete: {
        label: 'Supprimer',
      },
      finish: {
        label: "Terminer l'exercice",
      },
    },
    participantList: {
      header: 'Participant(es): {{count}}',
      admin: 'Admin(e)',
    },
    share: {
      title: "Inviter d'autres Plumes",
      link: {
        label:
          "Envoi leur ce lien de partage pour qu'iels puissent rejoindre l'exercice",
        copy: 'Copier',
        copied: 'Lien copié dans le presse-papier !',
      },
      close: 'Fermer',
    },
    leave: {
      title: "Quitter l'exercice ?",
      message: 'Êtes-vous sûr de vouloir quitter cet exercice ?',
      result: {
        ok: "Vous avez bien quitté l'exercice",
        errorLastAdmin: "Vous êtes le dernier administrateur de l'exercice",
        unknownError: 'Une erreur est survenue',
      },
    },
    finish: {
      title: "Terminer l'exercice ?",
      message:
        "Une fois l'exercice terminé, vous ne pourrez plus y participer.",
      result: {
        ok: 'Exercice marqué comme Terminé',
        unknownError: 'Une erreur est survenue',
      },
    },
    delete: {
      title: "Supprimer l'exercice ?",
      message:
        'Êtes-vous sûr de vouloir supprimer cet exercice ? Tous les textes seront perdus.',
      result: {
        ok: 'Exercice supprimé',
        error: 'Une erreur est survenue',
      },
    },
    participate: {
      success: "Vous avez bien rejoint l'exercice !",
      error: 'Une erreur est survenue lors de votre participation',
    },
    exquisiteCorpse: {
      loading: "Chargement de l'exercice en cours...",
      finished: "L'exercice est terminé !",
      takeTurn: {
        label: 'À mon tour !',
        alreadyOngoing: 'Au tour de {{author}} !',
      },
      invite: {
        label:
          "Vous pouvez invitez une autre Plume en utilisant l'icône au-dessus : ",
      },
      yourTurn: {
        label: 'À vous de jouer !',
      },
      submitTurn: {
        label: 'Soumettre',
      },
      cancelTurn: {
        label: 'Rendre la main',
      },
    },
  },
};
