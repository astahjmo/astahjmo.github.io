+++
title = 'Webserver - Hello world'
date = 2024-03-02T13:23:49-03:00
description = ''
+++


Antes de começar, eu preciso primeiramente entender o que estou fazendo para 
conseguir escrever de forma correta e marcar na minha cabeça os conhecimentos 
necessário para conseguir o que quero, que é chegar a um WebServer funcional

Para isso preciso primeiramente entender o que eu quero fazer e comecei desde o
básico que é entendendo o pilar de tudo, protocolos de rede como TCP/IP e UDP/IP
tanto como entender também Sockets que parece que vai ser fundamental para essa
jornada


Primeiro entender os protocolo TCP/IP e UDP/IP que é basicamente por onde
os dados vão ser trafegados, não preciso me estender muito nisso porque existe
o Wikipédia para isso [TCP/IP] e [UDP/IP] no resumo um é baseado em uma conexão
segura aonde o cliente manda uma requisição `SYN`, o servidor responde com `SYNC + ACK`, o cliente manda de novo
uma requisição `SYNC` e dai estabelece uma conexão three way handshake

Após isso a gente consegue transmitir todos os dados de uma vez em uma stream de bytes do que queremos, e o cliente 
espera o servidor responder ou fechar a conexão

No resumo para ter um hello world foi preciso abrir um socket de escuta, nomear ele com endereço IPV6 e atribuir uma porta
e após isso pendurar o servidor para escutar eventos nesse socket, assim que o socket receber algo, processar e manter isso 
em looping (foi basicamente o que fiz durante quase 5 horas)

Estado atual do código - [link](https://github.com/astahjmo/WebServer/commit/5de45d2a8418f1a99b399c99fdf72d77f6098b4a)
