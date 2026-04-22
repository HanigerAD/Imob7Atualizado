FROM node:14.17.5

RUN mkdir -p /home/utils
RUN chmod -R +x /home/utils

RUN mkdir -p /home/temp

WORKDIR /home/app

EXPOSE 4200
EXPOSE 49153

CMD [ "sh", "/home/utils/command.sh" ]