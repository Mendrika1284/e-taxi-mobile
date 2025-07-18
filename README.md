# e-taxi-mobile

## Présentation
Application mobile de réservation et gestion de trajets en taxi, développée avec React Native (Expo), TypeScript et une navigation moderne. Elle permet aux utilisateurs de rechercher des trajets, visualiser des cartes, gérer leur profil et bénéficier d'une expérience fluide sur Android/iOS.

## Fonctionnalités principales
- Accueil personnalisé et informations contextuelles
- Recherche de trajets sur carte interactive (MapView)
- Gestion des marqueurs et itinéraires
- Offres spéciales et informations dynamiques
- Navigation fluide entre les écrans (React Navigation)

## Structure du projet
- `/src/components` : Composants UI réutilisables (boutons, etc.)
- `/src/screens` : Écrans principaux (Accueil, Recherche sur carte, etc.)
- `/src/navigation` : Configuration de la navigation (AppNavigator)
- `/assets` : Images, icônes, splash, etc.

## Stack technique
- React Native (Expo)
- TypeScript
- React Navigation
- react-native-maps, expo-location
- Redux Toolkit (gestion d'état)

## Lancer le projet
```bash
npm install
npm start
```

## Docker
Un Dockerfile est fourni pour builder/tester l'app dans un conteneur Node (usage CI/CD ou dev).

## Contexte
Ce projet mobile s'intègre avec le backend et le web pour offrir une solution complète de gestion de taxis.

---
**Auteur : RAKOTONIRINA Mendrika Itokiana**
