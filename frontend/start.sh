#!/bin/bash

# Atualizar dependências
npm install react-native@0.73.6 react-native-gesture-handler@~2.14.0 react-native-reanimated@~3.6.2

# Instalar dependências de desenvolvimento
npm install --save-dev @types/react-native

# Iniciar o projeto
export DISPLAY=:1
export CI=1
npx expo start --web --port 19006