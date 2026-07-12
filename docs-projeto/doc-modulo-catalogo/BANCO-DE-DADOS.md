**USUARIO**

user\_id: (PK) automático

user\_tipo: super admin | admin | colaborador | parceiro | cliente

user\_permissoes: jsonb com as permissões

nome: string

email: string

senha: string encriptada



\---



**EMPRESA**

emp\_id: (PK) automático
colab\_id: relaciona a \[lista] de colaboradores a 1 empresa - N:1

parc\_id: relaciona a \[lista] de parceiros a 1 empresa - N:1

cli\_id: relaciona a \[lista] de clientes a 1 empresa - N:1
emp\_dados\_id: (FK) relaciona os dados a 1 empresa - 1:1
emp\_end\_id: (FK) relaciona o endereço a 1 empresa - 1:1

emp\_docs\_id: (FK) relaciona os documentos a 1 empresa - 1:1

emp\_redes\_id: (FK) relaciona as redes sociais a 1 empresa - 1:1

emp\_design\_id: (FK) relaciona o design 1 empresa - 1:1

emp\_dep\_id: (FK) relaciona a lista de departamentos 1 empresa - N:1

emp\_cargos\_id: (FK) relaciona a lista de cargos 1 empresa - N:1





**EMP\_DADOS**

emp\_dados\_id: (PK) automático

emp\_tipo: PF | PJ

razao: string

fantasia: string (usado como exibição na aplicação)

cnpj: string (SE PJ)

cpf: string (SE PF)

email: string

celular: string

fixo: string



**EMP\_ENDERECO**
emp\_end\_id: (PK) automático

rua: string

numero: number

complemento: string

bairro: string
cidade: string
uf: string
pais: string
cep: string



**EMP\_DOCUMENTOS**

emp\_doc\_id: (PK) automático

nome: string

doc: string (url do documento salvo no bucket específico: emp\_documentos)



**EMP\_REDES**

emp\_redes\_id: (PK) automático

instagram: string

linkedIn: string

youtube: string

site: string

facebook: string

tiktok: string



**EMP\_DESIGN**

emp\_design\_id: (PK) automático

logo: string (url do logo salvo no bucket específico: emp\_logo)



**EMP\_DEPARTAMENTOS**

emp\_dep\_id: (PK) automático

nome: string



**EMP\_CARGOS**

emp\_cargo\_id: (PK) automático

nome: string



\---



**COLABORADOR**

colab\_id: (PK) automático
user\_id: (FK) relaciona o colaborador a  1 usuário - 1:1

emp\_id: (FK) relaciona o colaborador a 1 empresa - 1:1
colab\_dados\_id: (FK) relaciona os dados a 1 colaborador - 1:1
colab\_end\_id: (FK) relaciona o endereço a 1 colaborador - 1:1

colab\_docs\_id: (FK) relaciona os documentos a 1 colaborador - 1:1

colab\_redes\_id: (FK) relaciona as redes sociais a 1 colaborador - 1:1





**COLAB\_DADOS**

colab\_dados\_id: (PK) automático

nome: string (copiado do campo nome da tabela usuário)

email: string (copiado do campo email da tabela usuário)

celular: string

fixo: string

ramal: string

tipo: string (copiado do campo user\_tipo da tabela usuário)

avatar: string (url da foto do usuário salva no bucket específico: colab\_avatares)


**COLAB\_ENDERECO**
colab\_end\_id: (PK) automático

rua: string

numero: number

complemento: string

bairro: string
cidade: string
uf: string
pais: string
cep: string


**COLAB\_DOCUMENTOS**

colab\_doc\_id: (PK) automático

nome: string

doc: string (url do documento salvo no bucket específico: colab\_documentos)



**COLAB\_REDES**

colab\_redes\_id: (PK) automático

instagram: string

linkedIn: string



\---



**PARCEIRO**

parc\_id: (PK) automático
user\_id: (FK) relaciona o parceiro a  1 usuário - 1:1

emp\_id: (FK) relaciona o parceiro a 1 empresa - 1:1
parc\_dados\_id: (FK) relaciona os dados a 1 parceiro - 1:1
parc\_end\_id: (FK) relaciona o endereço a 1 parceiro - 1:1

parc\_docs\_id: (FK) relaciona os documentos a 1 parceiro - 1:1

parc\_redes\_id: (FK) relaciona as redes sociais a 1 parceiro - 1:1





**PARC\_DADOS**

parc\_dados\_id: (PK) automático

parc\_tipo: PF | PJ

razao: string

fantasia: string (usado como exibição na aplicação)

cnpj: string (SE PJ)

cpf: string (SE PF)

email: string

celular: string

fixo: string

logo: string (url do logo salvo no bucket específico: logos\_parceiros)



**PARC\_ENDERECO**
parc\_end\_id: (PK) automático

rua: string

numero: number

complemento: string

bairro: string
cidade: string
uf: string
pais: string
cep: string



**PARC\_DOCUMENTOS**

parc\_doc\_id: (PK) automático

nome: string

doc: string (url do documento salvo no bucket específico: colab\_documentos)



**PARC\_REDES**

parc\_redes\_id: (PK) automático

instagram: string

linkedIn: string

youtube: string

site: string



\---



**CLIENTE**

cli\_id: (PK) automático
user\_id: (FK) relaciona o cliente a  1 usuário - 1:1 (Apenas quando usuário precisa de credenciais de acesso, caso contrário pode ser "")

emp\_id: (FK) relaciona o cliente a 1 empresa - 1:1
cli\_dados\_id: (FK) relaciona os dados a 1 cliente - 1:1
cli\_end\_id: (FK) relaciona o endereço a 1 cliente - 1:1

cli\_docs\_id: (FK) relaciona os documentos a 1 cliente - 1:1

cli\_redes\_id: (FK) relaciona as redes sociais a 1 cliente - 1:1





**CLI\_DADOS**

cli\_dados\_id: (PK) automático

cli\_tipo: PF | PJ

razao: string

fantasia: string (usado como exibição na aplicação)

cnpj: string (SE PJ)

cpf: string (SE PF)

email: string

celular: string

fixo: string

logo: string (url do logo salvo no bucket específico: logos\_clientes)



**CLI\_ENDERECO**
cli\_end\_id: (PK) automático

rua: string

numero: number

complemento: string

bairro: string
cidade: string
uf: string
pais: string
cep: string



**CLI\_DOCUMENTOS**

cli\_doc\_id: (PK) automático

nome: string

doc: string (url do documento salvo no bucket específico: cli\_documentos)



**CLI\_REDES**

cli\_redes\_id: (PK) automático

instagram: string

linkedIn: string

youtube: string

site: string





