pm2 pm2 delete angels
pm2 save

git pull
yarn
yarn build

pm2 startup systemd
pm2 status
pm2 start "yarn start" --name angels
pm2 save
