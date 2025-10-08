Ansible playbooks for SonarQube VM deployment

Overview
--------
This folder contains an Ansible inventory and a playbook to install SonarQube on an Ubuntu VM.

Files
-----
- inventory.ini: Example inventory where you add the VM IP/hostname and SSH user.
- playbooks/install_sonarqube.yml: Playbook that installs OpenJDK 17, PostgreSQL, SonarQube and configures a systemd service and nginx reverse proxy.

How to use
----------
1. Edit `inventory.ini` and replace `REPLACE_WITH_VM_IP` and `REPLACE_WITH_SSH_USER` with your VM values.
2. (Optional) Put your SSH private key path in the inventory entries with `ansible_ssh_private_key_file=/path/to/key`.
3. Run the playbook from this repo root:

```bash
ansible-playbook -i infrastructure/ansible/inventory.ini infrastructure/ansible/playbooks/install_sonarqube.yml
```

Notes
-----
- The playbook is written for Ubuntu/Debian-based VMs.
- Change the DB password and other variables as needed before running in production.
- If your VM is behind a firewall, make sure port 22 (SSH) is accessible from the machine running Ansible.
