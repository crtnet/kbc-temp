const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api'
  },
  prod: {
    apiUrl: 'https://api.kidsbook.com/api'
  }
};

export const getApiConfig = () => {
  return ENV.dev; // Mudar para ENV.prod em produção
};
