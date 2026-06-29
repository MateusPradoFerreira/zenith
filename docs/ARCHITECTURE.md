# ARCHITECTURE.md

## Visão Geral

Este projeto utiliza Angular e RxJS com uma arquitetura orientada a facades.

A organização do código prioriza:

- separação clara por feature
- encapsulamento do contexto funcional dentro da própria feature
- concentração de regras e fluxos de acesso por meio de facades
- reaproveitamento de código compartilhado em áreas comuns bem definidas

Cada feature deve conter, dentro de si, os models relacionados e tudo o que for necessário para seu funcionamento.

## Princípios Arquiteturais

### 1. Organização por feature

O sistema deve ser organizado prioritariamente por feature, e não por tipo técnico global.
Cada feature representa um contexto funcional ou módulo do sistema.

Tudo o que pertence ao contexto daquela feature deve permanecer dentro dela sempre que não houver motivo real para compartilhamento global.

### 2. Arquitetura orientada a facades

As facades são o ponto principal de orquestração da feature.
Elas devem concentrar o fluxo de comunicação entre views, services e estado derivado da feature, reduzindo acoplamento direto nas camadas de interface.

As views devem preferir interagir com facades em vez de espalhar regras de negócio nos componentes.

### 3. Escopo local antes de compartilhamento global

Antes de mover qualquer código para uma área compartilhada, deve-se considerar se ele realmente pertence a mais de uma feature.

Se algo atende apenas uma feature, deve permanecer dentro dela.
Se algo atende múltiplas features de forma estável e coerente, pode ser promovido para `common`.

### 4. Coesão por model dentro da feature

Cada feature representa um conjunto de models relacionados.
Dentro da feature, a estrutura deve permitir localizar facilmente tudo o que pertence a cada model.

Models, services, facades e views devem seguir convenções consistentes de nome e agrupamento para reduzir ambiguidade.

## Estrutura Principal de Pastas

O projeto se organiza nas seguintes áreas principais:

- `common`
- `core`
- `features`

### `common`

Contém código compartilhado entre todas as features do sistema.

Devem ficar em `common` elementos como:

- serviços compartilhados
- tipos compartilhados
- componentes compartilhados
- layouts compartilhados
- operadores compartilhados
- utilitários reutilizáveis de uso transversal

Tudo o que estiver em `common` deve ter vocação clara de reaproveitamento amplo no sistema.

### `core`

Contém o código central de configuração e estrutura geral da aplicação.

`core` deve concentrar elementos centrais da aplicação, como configuração global, inicialização, integrações estruturais e definições que sustentam o funcionamento geral do sistema.

Dentro de `core`, existe uma lib interna chamada `pollaris`, localizada em:

```text
src
└── app
    └── core
        └── lib
            └── pollaris
```

A `pollaris` é uma peça importante da arquitetura atual do projeto.
Ela existe para padronizar comportamentos recorrentes, reduzir escrita repetitiva e estabelecer uma base comum para states, services e facades.

Sua função principal não é representar uma feature de negócio, mas oferecer abstrações reutilizáveis que sustentam a implementação das features.

### `features`

Contém a lista de features ou módulos do sistema.
Cada pasta dentro de `features` representa uma feature.

Cada feature deve conter, dentro de si, os models relacionados e tudo o que faz aquela feature funcionar.

## Estrutura Interna de uma Feature

Cada feature deve usar o nome da própria feature como nome da pasta principal.

Exemplo:

```text
financial
├── facades
│   ├── payable.facade.ts
│   └── receivable.facade.ts
├── models
│   ├── payable.model.ts
│   └── receivable.model.ts
├── services
│   ├── payable.service.ts
│   └── receivable.service.ts
└── views
    ├── payable
    │   ├── payable-form
    │   └── payable-list
    └── receivable
        ├── receivable-form
        └── receivable-list
```

## Convenções de Organização Dentro da Feature

### Pastas técnicas no plural

No geral, as pastas de agrupamento técnico devem usar nomes no plural, como:

- `services`
- `models`
- `facades`

Essas pastas agrupam arquivos relacionados a múltiplos models da mesma feature.

### Convenção de nomes de arquivos

Os arquivos devem seguir o padrão:

- `[model].[tipo].ts`

Exemplos:

- `payable.model.ts`
- `receivable.service.ts`
- `cash-flow.facade.ts`

Quando o nome do model for composto, ele deve ser escrito com hífen.

Exemplo:

```text
cash-flow.model.ts
cash-flow.service.ts
cash-flow.facade.ts
```

### Organização especial de `views`

A pasta `views` tem uma organização diferente das demais.
Dentro de `views`, deve existir um agrupamento por model.

Ou seja, cada model deve ter sua própria pasta dentro de `views`, contendo os componentes visuais relacionados a ele.

Exemplo:

```text
views
├── payable
│   ├── payable-form
│   └── payable-list
└── receivable
    ├── receivable-form
    └── receivable-list
```

Isso significa que o model `payable` possui uma pasta própria dentro de `views`, e nela ficam seus componentes de formulário e listagem.

## Pollaris

## Visão Geral da Lib

A `pollaris` é uma lib interna do projeto localizada em `src/app/core/lib/pollaris`.

Hoje, grande parte da estrutura da aplicação gira em torno dela.
Seu objetivo principal é definir classes abstratas, tipagens reutilizáveis e contratos-base para padronização arquitetural e redução de código repetitivo.

De forma geral, a `pollaris` centraliza contratos e implementações-base que ajudam a manter consistência entre features, especialmente no uso de estado local de registros, acesso REST, facades e formulários tipados.

O ponto principal de entrada da lib é o arquivo `index.ts`, que reúne os tipos e classes-base mais importantes.

### Principais elementos expostos no `index.ts`

O `index.ts` da `pollaris` expõe principalmente:

- `PllID`
- `PllRecord`
- `PllRecordId`
- `PllPagination`
- `PllPaginatedResponse`
- `PllRecordState`
- `PllRestService`
- `PllFacade`
- `PllQueryFacade`

## Tipagens e contratos-base da `pollaris`

Antes das classes principais, a `pollaris` define alguns contratos genéricos que sustentam toda a hierarquia.

### `PllID`

`PllID` é o alias do identificador primário dos registros.
Hoje ele é definido como `string`.

Esse tipo existe para padronizar a assinatura de métodos que trabalham com identidade de registro, como:

- `get`
- `delete`
- `remove`
- `openToUpdate`

### `PllRecord`

`PllRecord` é o contrato genérico mais amplo da lib.
Ele representa um objeto arbitrário baseado em chave e valor.

Na prática, ele é a base usada quando a `pollaris` precisa representar um conjunto de dados genérico, como:

- models de registro
- parâmetros de filtro
- contexto de transformação de formulário

### `PllRecordId`

`PllRecordId` é um refinamento de `PllRecord` que exige a presença de `id: PllID`.

Esse é o contrato mínimo exigido para quase todas as classes principais da `pollaris`.
Isso acontece porque a arquitetura da lib pressupõe que o registro possa ser:

- armazenado em state por `id`
- buscado individualmente
- atualizado
- removido

Sempre que uma classe usa o genérico `TRecordModel extends PllRecordId`, ela está exigindo que o model tenha identificador estável.

### `PllPagination`

`PllPagination` é a tipagem de metadados de paginação.
Ela padroniza:

- `page`
- `size`
- `total`
- `sort`

Esse contrato aparece principalmente em fluxos de listagem, repositórios e query facades.

### `PllPaginatedResponse<TRecordModel>`

`PllPaginatedResponse<TRecordModel>` representa o retorno padronizado de consultas paginadas.
Ele sempre combina:

- `data`, como lista de registros do tipo informado
- `pagination`, com os metadados da busca

Esse tipo conecta a camada de consulta da arquitetura, permitindo que `service`, `repository` e `query facade` falem a mesma linguagem de retorno.

## `PllRecordState`

`PllRecordState` é a abstração usada para manter um estado local de registros por model.

Sua principal função é armazenar registros em memória de forma padronizada, permitindo:

- leitura de um registro por `id`
- inserção de um ou vários registros
- atualização de um ou vários registros
- remoção de registros
- limpeza completa do estado

Na prática, ele é usado principalmente em fluxos de formulário para evitar requisições desnecessárias.
Quando um registro já foi carregado anteriormente, ele pode ser reutilizado a partir do state, reduzindo chamadas repetidas ao backend.

Arquiteturalmente, `PllRecordState` funciona como o cache local de registros da feature.
Seu contrato genérico é:

```ts
PllRecordState<TRecordModel extends PllRecordId>
```

Isso significa que o state só pode armazenar registros compatíveis com a estrutura mínima exigida pela lib.

Internamente, essa classe usa `signal` e `computed` do Angular para manter um `Map<PllID, TRecordModel>` reativo.
Ou seja, embora a API pública pareça um repositório simples em memória, a implementação já nasce preparada para consumo reativo na aplicação.

Exemplo:

```ts
@Injectable({ providedIn: "root" })
export class ScheduleCategoryState extends PllRecordState<ScheduleCategory> {}
```

Nesse caso, o state da feature passa a armazenar registros de `ScheduleCategory` para reutilização local, especialmente em fluxos de formulário e edição.

## `PllRestService`

`PllRestService` é a base para os serviços REST dos models.

Ele concentra as operações HTTP comuns e padroniza a forma como os serviços da aplicação interagem com endpoints de registro.

Entre as operações-base disponíveis estão:

- `get`
- `post`
- `postMany`
- `put`
- `putMany`
- `delete`
- `deleteMany`

O objetivo dessa abstração é evitar repetição de implementação em cada service de feature, mantendo uma interface previsível para operações CRUD e em lote.

Seu contrato abstrato mínimo é:

```ts
export abstract class PllRestService<TRecordModel extends PllRecordId> {
  abstract baseRoute: string;
  abstract pathRoute: string;
}
```

Esses membros abstratos são obrigatórios porque a classe-base precisa saber:

- qual é a rota-base da API
- qual é o caminho relativo do recurso

Com isso, a `pollaris` consegue implementar os métodos HTTP comuns uma única vez e deixar apenas a configuração específica na classe concreta.

Exemplo:

```ts
export type ScheduleCategoryViewParams = {
  status?: "ACTIVE" | "INACTIVE" | "ALL";
  type?: ScheduleCategoryType | "ALL";
};

@Injectable()
export class ScheduleCategoryService extends PllRestService<ScheduleCategory> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "schedule-categories";

  getAllByFilter(params: ScheduleCategoryViewParams): Observable<PllPaginatedResponse<ScheduleCategory>> {
    return this.http.get<PllPaginatedResponse<ScheduleCategory>>(`${this.baseRoute}/${this.pathRoute}`, { params });
  }
}
```

Nesse padrão, o service herda operações REST comuns da `pollaris` e adiciona apenas os métodos específicos do model quando necessário, como filtros de listagem.

## `PllFacade`

`PllFacade` é a base principal de gerenciamento de registros de um model.

Ela recebe um `state` e um `service` para:

- buscar registros
- persistir alterações
- sincronizar o state local
- centralizar o fluxo entre interface, estado e acesso remoto

Além disso, `PllFacade` também concentra a integração com os modais responsáveis pelas ações de:

- criar
- editar
- deletar

Outro papel importante dessa facade é definir o schema do formulário, incluindo suas validações.

Na prática, `PllFacade` representa a camada de orquestração do model na feature.
Ela reduz acoplamento entre componentes e serviços, e mantém o fluxo de cadastro e edição centralizado em uma base comum.

Seu contrato genérico é:

```ts
PllFacade<
  TRecordModel extends PllRecordId,
  TComponent extends BaseFormComponentDirective<TRecordModel>
>
```

Isso mostra dois pontos importantes:

- o model da facade precisa obedecer ao contrato de registro com `id`
- o componente visual associado precisa ser compatível com a diretiva-base de formulário da aplicação

Os membros abstratos obrigatórios dessa classe são:

- `state`
- `service`
- `recordSchema`
- `header`
- `component`
- `dialogSize`
- `dialogAlign`
- `closeOnSave`

Esses membros existem porque a facade não cuida apenas de persistência.
Ela também precisa conhecer o componente de formulário, o schema do form e o comportamento do modal para conseguir orquestrar o fluxo completo.

Exemplo:

```ts
@Injectable({ providedIn: "root" })
export class ScheduleCategoryFacade extends PllFacade<ScheduleCategory, ScheduleCategoryFormComponent> {
  override state = inject(ScheduleCategoryState);
  override service = inject(ScheduleCategoryService);

  override header: string = "Categoria de Agendamento";
  override component: Type<any> = ScheduleCategoryFormComponent;
  override dialogSize: DialogContentVariants["size"] = "md";
  override dialogAlign: DialogContentVariants["align"] = "center";
  override closeOnSave: boolean = true;

  override recordSchema: PllFormSchemaConfig<ScheduleCategory> = {
    fields: {
      id: { value: null },
      name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
      color: { value: "VIOLET", validators: [Validators.required] },
      active: { value: true },
      type: {
        value: "SCHEDULE",
        onChange: (value, form) => {
          if (value !== "SCHEDULE") form.controls.name.disable();
        },
      },
    },
  };
}
```

Esse exemplo mostra a facade conectando:

- o `state` responsável pelo cache local
- o `service` responsável pelas chamadas remotas
- o componente de formulário aberto em modal
- o schema do formulário com validações e regras reativas

## `PllQueryFacade`

`PllQueryFacade` é a base usada para fluxos de listagem e consulta de dados.

Ela é voltada ao cenário de busca, filtro e paginação, e contém:

- o schema do formulário de filtros
- uma referência ao service utilizado
- uma `queryFn` responsável por executar a busca dos dados

Seu papel é padronizar a lógica de listagem e consulta, especialmente em componentes que dependem de formulários de filtro.

Enquanto `PllFacade` está mais associada ao gerenciamento de um registro e seus fluxos de formulário, `PllQueryFacade` está associada ao consumo de coleções e resultados de consulta.

Seu contrato genérico é:

```ts
PllQueryFacade<
  TRecordQueryModel extends PllRecordId,
  TRecordQueryParams extends PllRecord
>
```

Isso separa claramente:

- o tipo do registro retornado pela consulta
- o tipo dos parâmetros usados para executar a consulta

Os membros abstratos obrigatórios são:

- `service`
- `queryFn`
- `filterSchema`

Na prática, isso significa que a query facade precisa declarar:

- qual service participa da consulta
- qual função executa a busca
- como é o schema tipado do formulário de filtros

Na definição da `QueryFacade`, a convenção do projeto é criar dois tipos auxiliares antes da classe:

- `UQP`, para os parâmetros da query
- `UQR`, para o tipo de resposta consumido pela listagem

Exemplo:

```ts
export type PayableUQP = PayableViewParams;
export type PayableUQR = PayableViewResponse;

export class PayableQueryFacade extends PllQueryFacade<PayableUQR, PayableUQP> {}
```

Nesse padrão:

- `UQP` significa `use query params`
- `UQR` significa `use query response`

Essa convenção ajuda a deixar explícito, já no ponto de definição da facade, qual é o contrato de entrada da consulta e qual é o contrato de saída da listagem.

Exemplo:

```ts
export type ScheduleCategoryUQP = ScheduleCategoryViewParams;
export type ScheduleCategoryUQR = ScheduleCategory;

@Injectable({ providedIn: "root" })
export class ScheduleCategoryQueryFacade extends PllQueryFacade<ScheduleCategoryUQR, ScheduleCategoryUQP> {
  override service = inject(ScheduleCategoryService);
  override queryFn = (params: ScheduleCategoryUQP) => this.service.getAllByFilter(params);

  override filterSchema: PllFormSchemaConfig<ScheduleCategoryUQP> = {
    fields: {
      status: { value: "ACTIVE" },
      type: { value: "ALL" },
    },
  };
}
```

Nesse caso, a facade de consulta centraliza o formulário de filtros e a função de busca da listagem.

## Tipagens de formulário usadas pelas facades

Parte importante do funcionamento da `pollaris` está no módulo `forms`, porque `PllFacade` e `PllQueryFacade` dependem diretamente dele.

O contrato mais importante dessa camada é:

```ts
PllFormSchemaConfig<TSchemaModel extends PllRecord>
```

Esse tipo define o schema declarativo de um formulário, contendo:

- `fields`, com a configuração tipada de cada campo
- `validators`, com validadores no nível do formulário

Cada campo é descrito por `PllFormControl<TCtrValue, TFormValue>`, que pode declarar:

- `value`
- `disabled`
- `validators`
- `starters`
- `refiners`
- `onChange`

Arquiteturalmente, isso significa que a regra do formulário fica centralizada na facade em formato declarativo, em vez de dispersa pelo componente visual.

Exemplo:

```ts
const schema: PllFormSchemaConfig<ScheduleCategory> = {
  fields: {
    id: { value: null },
    name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] },
    color: { value: "VIOLET", validators: [Validators.required] },
    active: { value: true },
    type: {
      value: "SCHEDULE",
      onChange: (value, form) => {
        if (value !== "SCHEDULE") form.controls.name.disable();
      },
    },
  },
};
```

Esse exemplo mostra um `PllFormSchemaConfig` real declarando:

- valores iniciais
- validadores de campo
- refiners
- comportamento reativo com `onChange`

Todos esses elementos ficam dentro da pasta:

```text
src/app/core/lib/pollaris/forms
```

É nessa pasta que a `pollaris` concentra:

- os contratos de schema de formulário
- os starters
- os refiners
- as classes agregadoras usadas para consumo pelas features

## `PllFormSchema`

`PllFormSchema` é a implementação que materializa um `PllFormSchemaConfig` em um formulário Angular tipado.

Seu contrato é:

```ts
PllFormSchema<TSchemaModel extends PllRecord>
```

Essa classe funciona como a ponte entre:

- o schema declarativo definido pela facade
- o `FormGroup` efetivamente utilizado pelo fluxo de formulário
- o pipeline de transformação aplicado antes e depois do preenchimento

Na prática, `PllFormSchema` concentra quatro responsabilidades principais:

- construir o `FormGroup` com base no schema
- expor os `controls` e o `value` tipado do formulário
- aplicar `starters` quando os valores entram no form
- aplicar `refiners` antes do envio final

### Como o `PllFormSchema` monta o formulário

No momento da construção, a classe percorre `fields` e cria um `FormControl` para cada chave configurada.

Além de registrar `value`, `disabled` e `validators`, ela também conecta o `onChange` de cada campo ao `valueChanges` do controle correspondente.

Isso significa que o comportamento reativo do formulário também é definido no schema, e não apenas no componente visual.

### `setValue` e `patchValue`

`setValue` delega para `patchValue`, e `patchValue` é o ponto onde os `starters` entram em ação.

Antes de atualizar o formulário, a classe:

- combina os valores atuais com os novos dados recebidos
- monta um contexto contendo apenas os `starters` declarados
- executa a transformação por campo
- lança `PllFormStarterError` se houver erro
- só então faz `patchValue` no formulário

A `pollaris` trata a entrada do formulário como uma etapa de preparação de dados, e não como simples atribuição direta.

### `refine` e `handleSubmit`

`refine` trabalha sobre uma cópia do valor bruto atual do formulário.
Nessa etapa, a classe:

- coleta os `refiners` configurados
- executa as transformações por campo
- lança `PllFormRefinerError` se algum refinamento falhar
- retorna o valor refinado pronto para consumo

`handleSubmit` fica acima desse fluxo.
Ele primeiro executa `refine` e, depois, valida o próprio `FormGroup`.
Se o formulário estiver inválido, lança um erro simples de submissão inválida.

Com isso, o pipeline de submit da `pollaris` fica conceitualmente dividido em:

1. refinar o valor
2. validar o formulário
3. só então seguir para persistência

## `PllDataTransformHandle`

## Abstrações de transformação de dados

O comportamento de `starters` e `refiners` depende da camada `transformers`.

A abstração central dessa parte é:

```ts
export abstract class PllDataTransformer<TValue, TContext extends PllRecord> {
  abstract transform(value: TValue, context: TContext): TValue;
}
```

Ela define o contrato mínimo para qualquer transformação baseada em:

- valor atual do campo
- contexto completo do formulário

Em cima dela, a `pollaris` define duas abstrações mais específicas:

- `PllFormStarter`
- `PllFormRefiner`

`PllFormStarter` é aplicado quando o formulário recebe valores e precisa preparar ou normalizar dados de entrada.
`PllFormRefiner` é aplicado antes do submit, para refinar, sanitizar ou ajustar o valor final.

Ela também define um pipeline tipado para transformação de dados de formulário.

Acima dos transformers individuais, a classe `PllDataTransformHandle` atua como orquestradora desse pipeline.

Ela oferece principalmente dois pontos de operação:

- `transformRawValue`, para aplicar uma sequência de transformers sobre um único campo
- `transformContext`, para aplicar transformações em vários campos de um mesmo contexto

O papel dessa classe é padronizar a execução sequencial das transformações e consolidar erros por chave de campo.

Isso é importante porque o fluxo da `pollaris` não para no primeiro erro sem contexto.
Em vez disso, ele tenta devolver a estrutura de falhas de forma associada ao campo correspondente.

## Erros especializados da Pollaris

Além das classes de serviço, facade e formulário, a `pollaris` também padroniza a forma de representar erros de transformação.

### `PllDataTransformError<TContext>`

`PllDataTransformError<TContext>` é o erro-base de transformação.
Ele recebe um objeto `errors` tipado por contexto, no formato:

```ts
PllDataTransformErrorContext<TContext>
```

Ou seja, a estrutura do erro acompanha as mesmas chaves do contexto transformado.
Ela preserva a associação entre falha e campo afetado.

### `PllFormStarterError` e `PllFormRefinerError`

Essas duas classes especializam `PllDataTransformError` para os dois momentos do pipeline de formulário:

- `PllFormStarterError`, quando o problema acontece na entrada de dados
- `PllFormRefinerError`, quando o problema acontece no refinamento antes do submit

Essa separação ajuda a distinguir falhas de hidratação/preparação de dados de falhas de sanitização ou ajuste final.


## Exemplos concretos de `PllFormStarter` e `PllFormRefiner`

Na implementação atual da lib, existem exemplos concretos em:

- `src/app/core/lib/pollaris/forms/starters.ts`
- `src/app/core/lib/pollaris/forms/refiners.ts`

### Exemplo de `PllFormRefiner`

Um exemplo concreto é o `TrimRefiner`:

```ts
export class TrimRefiner extends PllFormRefiner<string, any> {
  override transform(string: string): string {
    if (!string) return string;
    return string.trim();
  }
}
```

Esse refiner é usado para normalizar texto antes do submit final do formulário.
Na prática, ele remove espaços excedentes do início e do fim da string.

### Exemplo de `PllFormStarter`

Um exemplo concreto é o `DateStarter`:

```ts
export class DateStarter extends PllFormStarter<Date, any> {
  override transform(date: Date): Date {
    if (!date) return date;
    return moment(date).toDate();
  }
}
```

Esse starter é usado quando o valor entra no formulário.
Na prática, ele padroniza o valor recebido como `Date` antes que o campo seja efetivamente preenchido no form.

### Classes agregadoras `Refiners` e `Starters`

Além das classes concretas, a `pollaris` também expõe classes agregadoras:

- `Refiners`, em `src/app/core/lib/pollaris/forms/refiners.ts`
- `Starters`, em `src/app/core/lib/pollaris/forms/starters.ts`

Essas classes funcionam como pontos centralizados de acesso a instâncias reutilizáveis, por exemplo:

```ts
export class Refiners {
  static trim = new TrimRefiner();
}

export class Starters {
  static toDate = new DateStarter();
}
```

Esse padrão existe para permitir um consumo parecido com o dos `Validators` do Angular.
Ou seja, em vez de instanciar manualmente cada transformer em toda facade, a feature pode reutilizar membros estáticos centralizados, como:

```ts
name: { value: null, validators: [Validators.required], refiners: [Refiners.trim] }
date: { value: null, starters: [Starters.toDate] }
```

Arquiteturalmente, isso dá aos `starters` e `refiners` a mesma ergonomia de uso que o projeto já espera dos `Validators` do Angular: uma API central, previsível e reutilizável.

## Exemplo completo de model utilizado com a Pollaris

Exemplo:

```ts
export type ScheduleCategoryType = "SCHEDULE" | "PAYABLE" | "RECEIVABLE";

export class ScheduleCategory {
  id: PllID;
  name: string;
  active: boolean;
  color: Colors;
  type: ScheduleCategoryType;

  constructor(props: Partial<ScheduleCategory>) {
    Object.assign(this, props);
  }
}
```

Esse model representa o registro base consumido por:

- `ScheduleCategoryState`
- `ScheduleCategoryService`
- `ScheduleCategoryFacade`
- `ScheduleCategoryQueryFacade`

Esse encadeamento ilustra o padrão arquitetural esperado em features.

## Mock e utilitários auxiliares

A `pollaris` também possui estruturas auxiliares para mock e simulação de serviços, incluindo classes específicas para esse fim.

Esses elementos existem e fazem parte da arquitetura da lib. Porem, o foco principal permanece nas abstrações mais recorrentes de state, service, facade, query, formulário e transformação.

## Pontos a detalhar futuramente

Além das classes-base principais, a `pollaris` também contém:

- convenções de uso de `PllMockRestService`
- exemplos concretos de criação de `PllFormStarter` e `PllFormRefiner`
- estratégias de tratamento de erros especializados em componentes e facades

Essas partes também são relevantes para a arquitetura do projeto, mas ficarão documentadas com mais profundidade em uma etapa posterior.

## Diretivas Base de Componente

Além da `pollaris`, a aplicação também possui diretivas base de componente responsáveis por reduzir repetição de código e padronizar o fluxo das views.

Essas diretivas ficam em:

```text
src/app/common/directives
```

Atualmente, os dois elementos principais dessa camada são:

- `base-form-component.directive.ts`
- `base-listing-component.directive.ts`

## `BaseFormComponentDirective`

Em aberto nesta etapa.

## `BaseRecordListingComponentDirective`

`BaseRecordListingComponentDirective` é a diretiva base usada para componentes de listagem.

Seu objetivo é concentrar em um único lugar o fluxo comum de:

- configuração do formulário de filtros
- inicialização da tela
- execução da query de listagem
- preenchimento dos registros e da paginação
- abertura dos fluxos de criar, editar e deletar

Ela fica em:

```text
src/app/common/directives/base-listing-component.directive.ts
```

Arquiteturalmente, essa diretiva existe para evitar que cada componente de listagem reimplemente o mesmo encadeamento de carregamento, consulta e atualização de UI.

### Tipagens e contratos principais

O contrato genérico da diretiva é:

```ts
BaseRecordListingComponentDirective<
  TRecordQueryModel extends PllRecordId,
  TRecordQueryParams extends PllRecord,
  TComponent extends BaseFormComponentDirective<any>
>
```

Esses tipos representam:

- `TRecordQueryModel`: o tipo do registro retornado pela listagem
- `TRecordQueryParams`: o tipo do formulário de filtros e dos parâmetros da consulta
- `TComponent`: o componente de formulário usado pelos fluxos de criação e edição

Os dois contratos abstratos obrigatórios são:

```ts
abstract facade: PllFacade<any>;
abstract queryFacade: PllQueryFacade<TRecordQueryModel, TRecordQueryParams>;
```

Ou seja, a diretiva depende de:

- uma `facade`, para manejar criação, edição e deleção de registros
- uma `queryFacade`, para executar a listagem com base nos filtros

### Estado interno e tipagens expostas

Internamente, a diretiva mantém:

- `filter: PllFormSchema<TRecordQueryParams>`
- `values = model<TRecordQueryModel[]>([])`
- `pagination = model<PllPagination>(null)`
- `loading = signal<boolean>(false)`
- `processing = signal<boolean>(false)`

Esses elementos representam:

- o formulário tipado dos filtros
- os registros atualmente exibidos
- a paginação atual da listagem
- o estado de carregamento da tela
- o estado de processamento de ações como deleção

### Parâmetros de configuração mais comuns

Existem três informações de parametrização que são sobrescritas com frequência pelos componentes concretos:

```ts
columns = signal<HlmDataTableColumn[]>([]);
actionFn: HlmDataTableActionFc<TRecordQueryModel>;
selectionActionFn: HlmDataTableSelectionActionFc<TRecordQueryModel>;
```

O papel de cada uma é:

- `columns`: montar a estrutura de colunas da tabela
- `actionFn`: montar o menu de ações de cada item individual
- `selectionActionFn`: montar o menu de ações da seleção múltipla

Essas propriedades fazem parte da parametrização esperada da listagem.
Elas são diferentes dos elementos centrais do fluxo, que devem permanecer concentrados na diretiva.

### Regra geral de extensão

A implementação geral de listagem é feita na diretiva.

Por isso, deve-se evitar sobrescrever:

- métodos que controlam o fluxo base
- propriedades usadas pela orquestração principal da listagem

O caminho preferencial de extensão não é reescrever o fluxo.
O caminho preferencial é:

- fornecer `facade` e `queryFacade`
- configurar `columns`, `actionFn` e `selectionActionFn` quando necessário
- sobrescrever os eventos de pipeline quando houver lógica dependente do componente concreto

### Eventos do pipeline

Durante o fluxo de listagem, a diretiva chama uma série de eventos.

Esses eventos são o ponto apropriado para customizações que dependem do componente concreto e não pertencem à diretiva em si.
Um exemplo típico é carregar valores usados em dropdowns quando o componente é iniciado.

Os eventos principais da diretiva são:

- `$evNgOnInit: EventObs<void>`
- `$evInitFilter: EventObs<void>`
- `$evUpdateUI: EventObs<PllPaginatedResponse<TRecordQueryModel>>`

O tipo `EventObs` e o helper `event(...)` vêm de `base-form-component.directive.ts` e são usados como base comum para pipelines customizados em componentes.

Exemplo de sobrescrita de evento:

```ts
override $evNgOnInit: EventObs<void> = event(
  switchMap(() => forkJoin({
    a: this.$getSecrecyOptions(),
    b: this.$getCenterOfCostOptions(),
    c: this.$getPlanOfAccountOptions(),
    d: this.$getBankAccountOptions(),
  })),
);
```

Nesse padrão, o componente adiciona um pipeline próprio ao momento de inicialização sem substituir o fluxo geral da diretiva.

### Fluxo geral da listagem

O fluxo da diretiva começa no `ngOnInit`.

De forma geral, a sequência é:

1. configurar o formulário de filtros com base em `queryFacade.filterSchema`
2. executar `$evNgOnInit`
3. executar `$evInitFilter`
4. chamar `$updateUI`

Esse desenho permite que o componente concreto injete comportamento antes da primeira atualização de tela, sem precisar reescrever a orquestração principal.

### O papel de `$updateUI`

`$updateUI` é um dos centros do fluxo da listagem.
Os elementos de fluxo recebem prefixo `$` para indicar que são partes encadeáveis em pipelines com RxJS.

Dentro de `$updateUI`, a diretiva:

1. executa `filter.handleSubmit()`
2. usa o valor resultante para chamar `queryFacade.useQuery(params)`
3. popula `values` com `response.data`
4. popula `pagination` com `response.pagination`
5. executa `$evUpdateUI(response)`

Esse método existe em duas formas:

- `updateUI()`, que dispara a execução e faz o `subscribe`
- `$updateUI()`, que expõe o fluxo como `Observable` para integração em outros encadeamentos RxJS

### Ações de criar, editar e deletar

Além da consulta da listagem, a diretiva também centraliza ações de registro usando a `facade`.

Os métodos principais são:

- `handleCreate()`
- `handleUpdate(rowData)`
- `handleDelete(rowData)`
- `handleDeleteMany(data)`

Esses métodos:

- abrem o modal configurado na `facade`
- executam deleções individuais ou múltiplas
- ao final, chamam `updateUI()` para sincronizar a tela

### Exemplo simples de implementação

Um caso simples aparece em `schedule-category-listing.component.ts`.

Nesse padrão, o componente fornece:

- `facade`
- `queryFacade`
- `columns`
- dados auxiliares do template, como `statusOptions`

Exemplo:

```ts
@Component({
  standalone: true,
  selector: "app-schedule-category-listing",
  host: {
    role: "div",
    "[class]": "_computedClass()",
  },
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: "./schedule-category-listing.component.html",
})
export class ScheduleCategoryListingComponent extends BaseRecordListingComponentDirective<ScheduleCategoryUQR, ScheduleCategoryUQP, ScheduleCategoryFormComponent> {
  override facade = inject(ScheduleCategoryFacade);
  override queryFacade = inject(ScheduleCategoryQueryFacade);

  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "Nome", class: "flex-1" },
  ]);

  statusOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Ativos", value: "ACTIVE" },
    { label: "Inativos", value: "INACTIVE" },
  ];
}
```

No template, o componente apenas consome o fluxo já pronto da diretiva;

### Exemplo mais customizado de implementação

Um caso mais completo aparece em `payable-listing.component.ts`.

Nele, além das configurações básicas, o componente sobrescreve:

- `actionFn`
- `selectionActionFn`
- `$evNgOnInit`

Também adiciona métodos auxiliares próprios, como:

- carregamento de opções para filtros
- ações específicas de domínio, como pagar, cancelar e reabrir
- formatação visual de dados

Esse exemplo mostra o uso esperado da diretiva:

- o fluxo geral continua na base
- a configuração da tabela acontece no componente
- a lógica de integração específica do componente entra pelos eventos e métodos próprios

Exemplo:

```ts
@Component({
  standalone: true,
  selector: "app-payable-listing",
  host: {
    role: "div",
    "[class]": "_computedClass()",
  },
  imports: [GlobalModule, HlmDataTableComponent],
  templateUrl: "./payable-listing.component.html",
})
export class PayableListingComponent extends BaseRecordListingComponentDirective<PayableUQR, PayableUQP, PayableFormComponent> {
  override facade = inject(PayableFacade);
  override queryFacade = inject(PayableQueryFacade);

  override columns: WritableSignal<HlmDataTableColumn[]> = signal([
    { header: "N° Doc.", class: "w-44" },
    { header: "Nome", class: "flex-1" },
    { header: "Conta Bancária", class: "w-42" },
    { header: "Centro de Custo", class: "w-42" },
    { header: "Plano de Conta", class: "w-42" },
    { header: "Valor", class: "w-36 justify-end" },
    { header: "Status", class: "w-36" },
    { header: "Emissão", class: "w-36" },
    { header: "Vencimento", class: "w-36" },
  ]);

  override actionFn: HlmDataTableActionFc<PayableUQR> = (data: PayableUQR) => ([
    { icon: "pencil-line", label: "Editar", command: () => this.handleUpdate(data) },
    { icon: "dollar-sign", label: "Pagar", command: () => this.handlePay(data.id), visible: data.status !== "PAID" },
    { separator: true, visible: data.status !== "PAID" },
    { icon: "circle-x", label: "Cancelar", command: () => this.handleCancel(data.id), visible: data.status !== "CANCELLED" && data.status !== "PAID" },
    { icon: "check", label: "Reabrir", command: () => this.handleReopen(data.id), visible: data.status === "CANCELLED" },
    { icon: "trash-2", label: "Excluir", command: () => this.handleDelete(data) },
  ]);

  override selectionActionFn: HlmDataTableSelectionActionFc<PayableUQR> = (data: PayableUQR[]) => ([
    { icon: "trash-2", label: "Excluir", command: () => this.handleDeleteMany(data) },
  ]);

  override $evNgOnInit: EventObs<void> = event(
    switchMap(() => forkJoin({
      a: this.$getSecrecyOptions(),
      b: this.$getCenterOfCostOptions(),
      c: this.$getPlanOfAccountOptions(),
      d: this.$getBankAccountOptions(),
    })),
  );
}
```

### Diretriz de uso

Ao criar uma nova listagem baseada nessa diretiva, a prioridade deve ser:

1. reutilizar o fluxo base da diretiva
2. sobrescrever apenas os pontos de parametrização previstos
3. usar eventos para integrar pipelines dependentes do componente

Essa regra existe para manter previsibilidade entre listagens diferentes e reduzir dispersão de comportamento pela aplicação.

## Regras de Escrita e Organização

### 1. Cada feature deve ser autocontida

Sempre que possível, cada feature deve reunir seus próprios models, facades, services e views.
O objetivo é que o contexto da feature possa ser entendido com o mínimo possível de navegação fora dela.

### 2. Nomenclatura deve ser consistente

Os nomes de pastas e arquivos devem seguir um padrão uniforme em todo o projeto.
Não se deve alternar entre estilos diferentes para representar o mesmo tipo de elemento.

### 3. Sobrescritas de membros abstratos devem usar `override`

Sempre que uma classe sobrescrever propriedades, métodos ou qualquer membro herdado de uma classe abstrata, a palavra-chave `override` deve ser utilizada explicitamente.

Essa regra existe para:

- deixar claro que aquele membro vem de uma abstração superior
- reforçar intenção arquitetural
- facilitar leitura e manutenção
- reduzir ambiguidades em hierarquias baseadas em classes abstratas

Exemplo:

```ts
@Injectable({ providedIn: "root" })
export class ScheduleCategoryState extends PllRecordState<ScheduleCategory> {}

@Injectable()
export class ScheduleCategoryService extends PllRestService<ScheduleCategory> {
  override baseRoute: string = environment.apiUrl;
  override pathRoute: string = "schedule-categories";
}
```

### 4. Injeção de dependência deve usar `inject`

A injeção de dependências deve ser feita com `inject`.
O projeto não deve usar injeção por construtor como padrão.

Essa regra existe para manter consistência de escrita entre services, facades, states e demais estruturas do projeto.

Exemplo esperado:

```ts
@Injectable({ providedIn: "root" })
export class ScheduleCategoryFacade extends PllFacade<ScheduleCategory, ScheduleCategoryFormComponent> {
  override state = inject(ScheduleCategoryState);
  override service = inject(ScheduleCategoryService);
}
```

Padrão a evitar:

```ts
constructor(
  private readonly state: ScheduleCategoryState,
  private readonly service: ScheduleCategoryService,
) {}
```

## Diretriz Final

Toda nova implementação, refatoração ou reorganização estrutural deve respeitar esta arquitetura.
Se surgir dúvida sobre onde um arquivo deve ficar, a decisão deve priorizar:

1. coesão da feature
2. previsibilidade da estrutura
3. centralidade das facades no fluxo da feature
4. menor dispersão possível de contexto
