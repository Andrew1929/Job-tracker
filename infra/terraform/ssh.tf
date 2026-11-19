resource "aws_key_pair" "learning" {
  key_name   = "terraform-learning-key"
  public_key = file(pathexpand("~/.ssh/terraform-learning.pub"))
}