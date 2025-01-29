import { dashboardFr } from '../pages/dashboard/translations/dashboard.fr';
import { exerciseFr } from '../pages/exercise/translations/exercise.fr';

export const uiFr = {
  home: {
    header: {
      app: {
        name: 'Owl-Writey',
      },
      dashboardLink: 'Dashboard',
      loginLink: 'Connexion',
      registerLink: 'Inscription',
      logoutLink: 'Déconnexion',
    },
    footer: {
      text: "Owl-Writey, application d'écriture",
      copyright: 'Copyright HemIT 2025-',
      legal: {
        label: 'Mentions légales',
      },
      faq: {
        label: 'FAQ',
      },
      version: {
        label: 'Version {{version}}',
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
          required: 'Le mot de passe est obligatoire',
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
};
