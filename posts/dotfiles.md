# Meus dotfiles

Tudo que uso no dia a dia. Arch + i3 + alacritty + zsh + neovim.

## Window Manager: i3

```ini
# ~/.config/i3/config
set $mod Mod4

bindsym $mod+Return exec alacritty
bindsym $mod+d exec rofi -show drun
bindsym $mod+q kill

bindsym $mod+h focus left
bindsym $mod+j focus down
bindsym $mod+k focus up
bindsym $mod+l focus right
```

Vim keys no WM. Consistencia total.

## Terminal: Alacritty

```toml
# ~/.config/alacritty/alacritty.toml
[font]
size = 12.0

[font.normal]
family = "JetBrains Mono"

[colors.primary]
background = "#0c0c0c"
foreground = "#e0e0e0"
```

## Shell: Zsh + starship

```bash
# ~/.zshrc
eval "$(starship init zsh)"
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

alias v="nvim"
alias g="git"
alias ls="eza --icons"
```

## Git

```ini
# ~/.gitconfig
[user]
  name = Astaroth
  email = astaroth@void.dev
[core]
  editor = nvim
[alias]
  s = status
  c = commit
  p = push
  l = log --oneline --graph
```

Todos os dotfiles num repo git. `stow` pra symlinks.
