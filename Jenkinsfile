pipeline {
    agent any

    environment {
        DEPLOY_PATH = '/root/mern-todo-app'
        VPS_IP = '159.223.35.47'
    }

    stages {
        stage('deploy') {
            steps {
                withCredentials(
                  [
                    sshUserPrivateKey(credentialsId: 'SSH_KEY_ID', keyFileVariable: 'KEY', usernameVariable: 'SSH_USER')
                  ]
                  ){
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${KEY} ${SSH_USER}@${VPS_IP} '
                          cd ${DEPLOY_PATH} && git pull
                          docker-compose down
                          docker-compose build
                          docker-compose up -d
                        '
                    """
                  }
            }
        }
    }
}