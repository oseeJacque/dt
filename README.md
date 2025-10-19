# Deaf-Translator Plugin

**PROJET PRIVÉ – USAGE INTERNE UNIQUEMENT**

## Description
Ce plugin fait partie du projet "Deaf-Translator", un produit visant à aider les personnes ayant un handicap auditif à s'intégrer dans la société en brisant les barrières de communication.

Le plugin permet de gérer les modélisations 3D créées avec Blender et exportées au format GLB. Il automatise le traitement et l'envoi de ces modèles par groupes, facilitant ainsi leur intégration dans l'application principale.

## Technologies utilisées
- React
- Vite
- Three.js / React Three Fiber
- Python (scripts d'automatisation)

## Structure du projet
```
deaf-translator/
├── dist/
├── node_modules/
├── public/
│   ├── alone.glb
│   ├── logo.png
│   ├── model.glb
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── Processing.tsx
│   │   └── Render.tsx
│   ├── lib/
│   │   ├── utils.ts
│   ├── providers/
│   ├── service/
│   │   ├── animation.service.ts
│   │   ├── api.ts
│   │   └── index.service.ts
│   ├── utils/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
├── .env
├── .eslintrc.cjs
├── .gitignore
├── components.json
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── script.py
├── tailwind.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Installation

```bash
# Cloner le dépôt privé (nécessite des autorisations d'accès)
git clone [URL_DU_DÉPÔT_PRIVÉ]
cd deaf-translator

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev
```

## Fonctionnalités principales

### Traitement des modèles 3D
Le plugin permet de charger et d'afficher des modèles 3D au format GLB. Le composant principal `Processing.tsx` gère le rendu et l'animation des modèles.

### Automatisation
Le script Python (`script.py`) analyse le dossier `public/` pour extraire les métadonnées des fichiers GLB. Ces métadonnées sont ensuite utilisées par le service d'animation pour préparer les modèles à l'envoi.

### Prétraitement des animations
Le module `utils/pre_processing.js` contient la fonction `handleFilter` qui prépare les animations pour l'envoi au service d'animation.

## Utilisation

### Rendu d'un modèle 3D
```jsx
import Processing from '@/components/Processing';

function App() {
  return (
    <div>
      <Processing />
    </div>
  );
}
```

### Automatisation du traitement des modèles

Pour traiter automatiquement tous les modèles GLB dans le dossier `public/`, décommentez la ligne suivante dans `Processing.tsx`:

```jsx
// automation() // TODO: Only for automation
```

Le script Python peut également être exécuté indépendamment pour mettre à jour la liste des fichiers GLB:

```bash
python script.py
```

## Configuration des animations

Les animations sont configurées dans le composant `Processing.tsx`. Par défaut, les animations sont lues à vitesse réduite (1/4) et ne sont pas en boucle:

```javascript
const mixer = new AnimationMixer(model.scene);
mixer.timeScale = 1 / 4

useEffect(() => {
  const action = mixer!.clipAction(model.animations[0]);
  action.loop = THREE.LoopOnce
  action.play();
}, [])
```

## Service d'animation

Le service d'animation (`animation.service.ts`) permet d'envoyer les modèles traités vers l'API. Il gère également les notifications de succès ou d'erreur via toast.

## Développement interne

Ce projet est développé en interne uniquement. Pour toute question concernant le développement ou l'accès au code source, veuillez contacter le responsable du projet.

## Contact

Pour toute question ou information supplémentaire concernant ce projet :

**Gilles Ahouantchede**  
Email: gillesahouantchede@gmail.com

## Confidentialité

Ce projet est propriétaire et confidentiel. Toute distribution, copie ou utilisation non autorisée est strictement interdite.