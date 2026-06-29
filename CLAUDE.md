# CLAUDE.md — Zenith

O OnDoctor é uma plataforma SaaS para gestão de vida pessoal. O sistema centraliza processos financeiros e de agenda em um único ambiente, oferecendo recursos como inbox, agenda, despesas, receitas, recorrencia.

O objetivo do Zenith é otimizar a organização pessoal dos usuarios.

---

## AVISO IMPERATIVO PRA IA (LER PRIMEIRO)

Este é um projeto **SPEC-driven v2**. A documentação em `docs/` **não é para humanos** — é para VOCÊ (IA) ter contexto rico quando retomar, continuar ou mexer em qualquer parte do projeto.

**PROIBIDO** ler arquivos Nível 1+ (features, SPECs) sem **confirmação explícita do usuário**.
**OBRIGATÓRIO** seguir o protocolo de escalação do `docs/RULES.md` §4.

---

## Primeira ação obrigatória em QUALQUER sessão

Antes de qualquer código, qualquer resposta substantiva:

1. Ler este `CLAUDE.md`
2. Ler `docs/RULES.md` (processo completo — fonte da verdade)
3. Ler `docs/INDEX.md` (mapa de features do projeto)
4. Listar `docs/active/` (SPECs ativas na branch local — pode estar vazio em main)
5. Confirmar por texto que leu:
   > *"Li CLAUDE.md, docs/RULES.md v2, docs/INDEX.md (X features). Active local: [lista]. Como posso ajudar?"*
6. Aguardar o prompt do usuário e seguir o protocolo de escalação do RULES §4.

**Se houver SPEC ativa e o prompt conectar ao escopo dela:** pode ler `docs/active/SPEC-X/main.md` (contrato) após confirmar classificação. **NÃO** leia `state.md` ou `memory.md` da SPEC sem ANTES informar o usuário e pedir confirmação.

---

## Stack

Angular 19.2 (@angular/core, common, forms, router, animations)
TypeScript ~5.7.2
RxJS ~7.8
Zone.js ~0.15
Plataforma alvo adicional: Electron (build dedicado via build:electron)

Tailwind CSS 4.1 (@tailwindcss/postcss, postcss, tailwindcss-animate, tailwind-merge)
Spartan NG (@spartan-ng/brain, @spartan-ng/cli) — componentes headless
Angular CDK 19.2
class-variance-authority + clsx — variantes/composição de classes
Ícones: @ng-icons (core + lucide) e lucide-angular

## Comandos



---

## Processo SPEC-driven v2 — resumo

Fonte da verdade: [docs/RULES.md](docs/RULES.md). Resumo operacional:

1. **Documentação é para a IA**, não para humanos. Única exceção: `main.md` de cada SPEC (contrato humano-validado).
2. **Estrutura:**
   - `docs/features/<area>.md` — estado VIVO de cada área do código
   - `docs/active/SPEC-<id>/` — 3 arquivos: main (contrato), state (log), memory (cérebro vivo)
   - `docs/future/`, `docs/archive/`, `docs/discard/` — ciclo de vida
   - `docs/INDEX.md` — mapa de features (gerado pelo CI)
3. **IDs de SPEC = timestamp** (`SPEC-YYYYMMDD-HHMM-slug`). Nunca sequencial. Nunca reutilizar.
4. **Invariante:** `docs/active/` em `main` é sempre VAZIO. SPECs ativas vivem APENAS em branches.
5. **Toda SPEC se vincula a 1+ feature.** Feature nova nasce com a SPEC que a introduz.
6. **Timestamps obrigatórios em TUDO:** checkbox, célula de status, decisão, atualização. Commit hash quando houver código.
7. **Ao concluir SPEC**, todas as features tocadas DEVEM ser atualizadas no mesmo PR (R.7). `audit-docs.sh` bloqueia PR sem isso.
8. **Classificação obrigatória de prompt:** continuidade / nova SPEC / livre. Em ambiguidade, PERGUNTAR — nunca assumir.
9. **Protocolo de escalação de leitura:**
   - Nível 0 (CLAUDE + RULES + INDEX): sempre, automático
   - Nível 1 (features + main da SPEC): sob CONFIRMAÇÃO do dev
   - Nível 2 (state + memory da SPEC): sob PERGUNTA EXPLÍCITA
   - Nível 3 (archive de outras SPECs): só se raciocínio histórico for necessário
10. **Append-only no `state.md`**; sobrescrever no `memory.md`; atualizar `features/<X>.md` ao arquivar SPEC.

---

## Convenções de código

---

## Arquitetura

A arquitetura detalhada esta documentada em:

```text
docs/ARCHITECTURE.md
```

---