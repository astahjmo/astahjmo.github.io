# Neovim config from scratch

Minha config do neovim. Tudo em Lua, modular, sem vimscript.

## Estrutura

```
~/.config/nvim/
  init.lua
  lua/
    plugins.lua
    keymaps.lua
    options.lua
```

## Package manager: lazy.nvim

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)
```

## Plugins essenciais

- **telescope.nvim** - fuzzy finder pra tudo
- **treesitter** - syntax highlight real (AST-based)
- **lsp-zero** - LSP config sem dor de cabeca
- **nvim-cmp** - autocomplete
- **oil.nvim** - file explorer no buffer

## Keymaps que uso

```lua
vim.g.mapleader = " "
vim.keymap.set("n", "<leader>ff", "<cmd>Telescope find_files<cr>")
vim.keymap.set("n", "<leader>fg", "<cmd>Telescope live_grep<cr>")
vim.keymap.set("n", "<leader>e", "<cmd>Oil<cr>")
```

O segredo e manter simples. Menos plugins = menos problemas.
