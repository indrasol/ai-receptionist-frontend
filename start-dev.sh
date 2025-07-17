# This script passes system environment variables to Vite
source ~/.zshrc

# Pass the environment variables to the Vite dev server

VITE_PROD_API_URL=$BASE_API_URL_PROD \
npm run dev
