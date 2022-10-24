<?php

function execCommand(string $command) {
  exec($command, $output, $status);

  $result = '';
  foreach($output as $value) {
    $result .= $value;
  }

  return [$result, $status];
}

$user = $argv[1];             #IAM username
$otp = $argv[2];              #OTP code
$env = $argv[3];              #dev || col || prod
$imageVersion = $argv[4];     #image version to deploy es: 1.0.0
$action = $argv[5];           #all || image (only push image) || login (to login in k8s console) || deploy (to deploy the containers)
$awsAccountId = [
  'dev' => '848729353763',
  'col' => '137642333557',
  'prod' => '998992220769'
];
$awsClusterName = [
  'dev' => 'eks-mitd-dev',
  'col' => 'eks-mitd-test',
  'prod' => 'eks-mitd-prod'
];

$loginResult = execCommand("aws sts get-session-token --serial-number arn:aws:iam::{$awsAccountId[$env]}:mfa/{$user} --token-code {$otp}");
if ($loginResult[1] !== 0) {
  print_r('AWS STS failed' . PHP_EOL);
  exit;
}

print_r('AWS STS success' . PHP_EOL);

$credentials = json_decode($loginResult[0], true);
$exportAccessKeyId = 'export AWS_ACCESS_KEY_ID=' . $credentials['Credentials']['AccessKeyId'];
$exportAccessKeySecret = 'export AWS_SECRET_ACCESS_KEY=' . $credentials['Credentials']['SecretAccessKey'];
$exportAccessToken = 'export AWS_SESSION_TOKEN=' . $credentials['Credentials']['SessionToken'];

$updateEksConfigCommand = "aws eks update-kubeconfig --region eu-central-1 --name {$awsClusterName[$env]}";
$updateEksConfigResult = execCommand($exportAccessKeyId . ' && ' . $exportAccessKeySecret . ' && ' . $exportAccessToken . ' && ' . $updateEksConfigCommand);

if ($updateEksConfigResult[1] !== 0) {
  print_r('AWS update kubeconfig failed' . PHP_EOL);
  exit;
}
print_r('AWS update kubeconfig success' . PHP_EOL);

$getLoginPasswordCommand = "aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin {$awsAccountId[$env]}.dkr.ecr.eu-central-1.amazonaws.com";
$loginEcrResult = execCommand($exportAccessKeyId . ' && ' . $exportAccessKeySecret . ' && ' . $exportAccessToken . ' && ' . $getLoginPasswordCommand);

if ($loginEcrResult[1] !== 0) {
  print_r('ECR login failed' . PHP_EOL);
  exit;
}

print_r('ECR login succeed' . PHP_EOL);

if ($action === 'image' || $action === 'all') {
  $buildDockerImageResult = execCommand("cd " . __DIR__ . "/../ && docker image build . -t drupal:{$imageVersion}");
  if ($buildDockerImageResult[1] !== 0) {
    print_r('Docker image build failed' . PHP_EOL);
    exit;
  }

  print_r('Docker image build succeed' . PHP_EOL);

  $tagDockerImageResult = execCommand("docker tag drupal:{$imageVersion} {$awsAccountId[$env]}.dkr.ecr.eu-central-1.amazonaws.com/drupal:{$imageVersion}");
  if ($tagDockerImageResult[1] !== 0) {
    print_r('Docker image tag failed' . PHP_EOL);
    exit;
  }

  print_r('Docker image tag succeed' . PHP_EOL);

  $pushDockerImageCommand = "docker push {$awsAccountId[$env]}.dkr.ecr.eu-central-1.amazonaws.com/drupal:{$imageVersion}";
  $pushDockerImageResult = execCommand($exportAccessKeyId . ' && ' . $exportAccessKeySecret . ' && ' . $exportAccessToken . ' && ' . $pushDockerImageCommand);
  if ($tagDockerImageResult[1] !== 0) {
    print_r('Docker image push failed' . PHP_EOL);
    exit;
  }

  print_r('Docker image push succeed' . PHP_EOL);
}

if ($action === 'login' || $action === 'all' || $action === 'deploy') {
  $loginK8sCommand = "aws sts assume-role --role-arn \"arn:aws:iam::{$awsAccountId[$env]}:role/k8sDrupal\" --role-session-name Drupal";
  $loginK8sResult = execCommand($exportAccessKeyId . ' && ' . $exportAccessKeySecret . ' && ' . $exportAccessToken . ' && ' . $loginK8sCommand);

  if ($loginK8sResult[1] !== 0) {
    print_r('K8S login failed' . PHP_EOL);
    exit;
  }

  print_r('K8S login succeed' . PHP_EOL);

  $credentials = json_decode($loginK8sResult[0], true);
  $exportAccessKeyId = 'export AWS_ACCESS_KEY_ID=' . $credentials['Credentials']['AccessKeyId'];
  $exportAccessKeySecret = 'export AWS_SECRET_ACCESS_KEY=' . $credentials['Credentials']['SecretAccessKey'];
  $exportAccessToken = 'export AWS_SESSION_TOKEN=' . $credentials['Credentials']['SessionToken'];
}

if ($action === 'deploy' || $action === 'all') {
  $manifestPath = __DIR__ . "/{$env}/drupal-manifest.yml";
  $fileContent = str_replace('{IMAGE_VERSION}', $imageVersion, file_get_contents($manifestPath));

  $deployManifestPath = __DIR__ . "/{$env}/drupal-manifest-{$imageVersion}.yml";
  file_put_contents($deployManifestPath, $fileContent);

  $manifestApplyCommand = "kubectl apply -f {$deployManifestPath} -n drupal";
  $manifestApplyResult = execCommand($exportAccessKeyId . ' && ' . $exportAccessKeySecret . ' && ' . $exportAccessToken . ' && ' . $manifestApplyCommand);
  if ($manifestApplyResult[1] !== 0) {
    print_r('K8S deploy failed' . PHP_EOL);
    exit;
  }

  print_r('K8S deploy success' . PHP_EOL);
}

if ($action === 'login' || $action === 'deploy' || $action === 'all') {
  print_r($exportAccessKeyId . PHP_EOL);
  print_r($exportAccessKeySecret . PHP_EOL);
  print_r($exportAccessToken . PHP_EOL);
}
