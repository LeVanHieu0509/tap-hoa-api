
git pull
rm -Rf node-modules
rm -Rf dist
yarn
yarn build

pm2 restart angels