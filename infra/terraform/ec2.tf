resource "aws_instance" "web" {
  ami           = "ami-048b77d5ca32f6d32"
  instance_type = "m7i-flex.large"

  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  associate_public_ip_address = true

  key_name = aws_key_pair.learning.key_name

  user_data = file("${path.module}/userdata.sh")

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
    encrypted   = true

    tags = {
      Name = "job-tracker-root"
    }
  }

  credit_specification {
    cpu_credits = "standard"
  }

  tags = {
    Name = "job-tracker-ec2"
  }
}