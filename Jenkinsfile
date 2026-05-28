pipeline {
    agent any

    environment {
        DEPLOY_PATH = '/root/mern-todo-app'
        // VPS_IP = '159.223.68.xyz'
    }

    stages {
        stage('deploy') {
            steps {
                withCredentials(
                  [
                    sshUserPrivateKey(credentialsId: 'SSH_KEY', keyFileVariable: 'KEY', usernameVariable: 'SSH_USER'),
                    string(credentialsId:'VPS_IP', variable:'VPS_IP')
                  ]
                  ){
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${KEY} ${SSH_USER}@${VPS_IP} '
                        cd ${DEPLOY_PATH} && git pull
                        docker compose up -d --build --remove-orphans backend-express
                        '
                    """
                  }
            }
        }
    }
}
