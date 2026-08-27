Este procedimento é para facilitar a recuperação dos dados 

Abra o pgAdmin 4 e siga este passo a passo direto para exportar o seu banco de dados:

Passo 1: Acessar a opção de Backup

No painel esquerdo (Object Explorer), expanda Servers e localize seu banco de dados.

Clique com o botão direito sobre o nome do banco de dados que deseja exportar.

Selecione a opção Backup....

Passo 2: Configurar o local e o formato do arquivo

Na aba General, preencha os campos:

Filename: Clique no ícone da pasta no canto direito para escolher o local onde deseja salvar e defina o nome do arquivo (exemplo: meu_banco.sql ou meu_banco.backup).

Format: Escolha o tipo de exportação conforme sua necessidade:

Plain: Gera um arquivo .sql em texto puro com os comandos SQL. É o mais recomendado se você quiser ler o arquivo ou rodar scripts em qualquer lugar.

Custom: Gera um arquivo binário compactado. É o mais indicado se o banco for muito grande e você vá restaurar usando o próprio pgAdmin.

Passo 3: Executar a exportação

Clique no botão Backup no canto inferior direito da janela.

Aguarde a notificação que aparecerá no canto inferior da tela. Quando o aviso mudar para "Process completed", seu arquivo de dump já estará salvo e pronto na pasta que você escolheu.