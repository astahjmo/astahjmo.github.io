# Instalando Arch Linux do zero

Guia direto ao ponto. Sem enrolacao.

## Pre-requisitos

- USB bootavel com a ISO do Arch
- Conexao com internet
- Paciencia (pouca, se seguir esse guia)

## Particionamento

```bash
fdisk /dev/sda
```

Esquema basico:

| Particao | Tamanho | Tipo |
|----------|---------|------|
| /dev/sda1 | 512M | EFI |
| /dev/sda2 | 8G | Swap |
| /dev/sda3 | resto | Linux |

## Base install

```bash
mount /dev/sda3 /mnt
mkdir -p /mnt/boot/efi
mount /dev/sda1 /mnt/boot/efi

pacstrap /mnt base linux linux-firmware vim networkmanager
genfstab -U /mnt >> /mnt/etc/fstab
arch-chroot /mnt
```

## Pos-install

```bash
systemctl enable NetworkManager
bootctl install
```

Pronto. Arch instalado. O resto e customizacao.
