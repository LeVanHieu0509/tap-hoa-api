git pull
yarn
yarn build

pm2 startup systemd
pm2 start "yarn start"
pm2 save
pm2 status