# Job Tracker — AWS Infrastructure

Terraform configuration for provisioning the AWS infrastructure used to host the Job Tracker full-stack application.

## Tech Stack

- **Infrastructure as Code:** Terraform
- **Cloud Provider:** AWS
- **Compute:** EC2 (Amazon Linux 2023)
- **Networking:** VPC, Public Subnet, Internet Gateway, Route Table, Security Group
- **Containerization:** Docker & Docker Compose
- **Reverse Proxy:** Caddy with HTTPS
- **Application:** Next.js, NestJS, PostgreSQL, Redis

## Architecture

```text
Internet
    |
    v
Internet Gateway
    |
    v
VPC (10.0.0.0/16)
    |
    v
Public Subnet (10.0.1.0/24)
    |
    v
EC2 — m7i-flex.large
    |
    v
Docker Compose
    |
    +-- Caddy (HTTPS :443)
    +-- Next.js (:3000)
    +-- NestJS (:3001)
    +-- PostgreSQL (:5432)
    +-- Redis (:6379)
```

The EC2 Security Group allows public HTTP (80), HTTPS (443), and SSH (22) access restricted to a configurable IPv4 `/32` address.

Application services communicate over Docker's internal network. PostgreSQL, Redis, Next.js, and NestJS are not directly exposed to the internet.

## Prerequisites

- Terraform CLI
- AWS CLI with valid AWS credentials
- An AWS account with sufficient permissions
- An SSH key pair generated locally

## Deployment

Initialize Terraform:

```bash
terraform init
```

Validate configuration:

```bash
terraform fmt
terraform validate
```

Preview infrastructure changes:

```bash
terraform plan -var="ssh_cidr=YOUR_PUBLIC_IP/32"
```

Apply the configuration:

```bash
terraform apply -var="ssh_cidr=YOUR_PUBLIC_IP/32"
```

## Configuration Files

| File | Purpose |
|---|---|
| `main.tf` | AWS provider, Terraform requirements, outputs |
| `network.tf` | VPC, subnet, routing, Internet Gateway |
| `security-groups.tf` | Inbound and outbound firewall rules |
| `ec2.tf` | EC2 instance, AMI, instance type and storage |
| `ssh.tf` | AWS SSH key pair registration |
| `variables.tf` | Input variables and validation |
| `userdata.sh` | Initial EC2 bootstrap script |

## Current Limitations

- Terraform State is stored locally and must be protected and backed up.
- The current bootstrap script does not fully automate application deployment.
- Docker Compose and Caddy production configuration are maintained separately.
- The temporary `sslip.io` hostname depends on the EC2 public IP address.
- The AMI and instance type are currently configured for the Stockholm AWS region.
- PostgreSQL backups and CI/CD deployment automation are not yet configured.

## Security Notes

Never commit Terraform State files, private SSH keys, credentials, `.env` files or saved Terraform plans.

Always review `terraform plan` before applying infrastructure changes.

## Future Improvements

- Remote Terraform State with locking
- Automated server bootstrap
- CI/CD using GitHub Actions
- Automated PostgreSQL backups
- Stable domain and improved monitoring
