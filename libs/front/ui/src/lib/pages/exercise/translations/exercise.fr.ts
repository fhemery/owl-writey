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
        nbIterations: {
          label: "Nombre d'itérations",
          error: {
            required: "Le nombre d'itérations est obligatoire",
            min: "Le nombre d'itérations doit être supérieur à 1",
          },
        },
        wordsLimit: {
          label: 'Limite de mots',
          error: {
            min: 'La limite de mots doit être supérieure à 1',
          },
        },
        authorCanAnswer: {
          label: "L'auteur peut écrire une suite à son propre textes",
        },
        initialText: {
          label: 'Texte initial',
          help: "Le texte de départ de l'exercice",
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
  },
};
