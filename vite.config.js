import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html', // 기본 index.html
        mainhtml: './src/pages/main.html',
        typeTesthtml: './src/pages/typeTest.html',
        typeTestStarthtml: './src/pages/typeTestStart.html',
        typeTestResulthtml: './src/pages/typeTestResult.html',
        memoryGamehtml: './src/pages/memoryGame.html',
        memoryGameStarthtml: './src/pages/memoryGameStart.html',
        worldcupGamehtml: './src/pages/worldcupGame.html',
        findGamehtml: './src/pages/findGame.html',
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});
