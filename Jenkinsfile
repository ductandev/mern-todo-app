// CD pipeline — được GitHub Actions trigger sau khi CI pass.
// Deploy TOÀN BỘ app stack (backend + frontend + mongo + proxy) về đúng commit SHA.
// Jenkins credentials cần cấu hình:
//   SSH_KEY - SSH private key vào VPS
//   VPS_IP  - địa chỉ IP của VPS
pipeline {
    agent any

    parameters {
        string(name: 'GIT_COMMIT_SHA', defaultValue: '', description: 'Commit SHA cần deploy (rỗng = HEAD của main)')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        DEPLOY_PATH = '/root/mern-todo-app'
    }

    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'SSH_KEY', keyFileVariable: 'KEY', usernameVariable: 'SSH_USER'),
                    string(credentialsId: 'VPS_IP', variable: 'VPS_IP')
                ]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i \${KEY} \${SSH_USER}@\${VPS_IP} '
                            set -e
                            cd ${DEPLOY_PATH}
                            git fetch origin main

                            # Deploy đúng commit đã pass CI thay vì HEAD trôi nổi của branch
                            if [ -n "${params.GIT_COMMIT_SHA}" ]; then
                                git reset --hard "${params.GIT_COMMIT_SHA}"
                            else
                                git reset --hard origin/main
                            fi

                            docker compose up -d --build --remove-orphans
                        '
                    """
                }
            }
        }

        stage('Verify') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'SSH_KEY', keyFileVariable: 'KEY', usernameVariable: 'SSH_USER'),
                    string(credentialsId: 'VPS_IP', variable: 'VPS_IP')
                ]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i \${KEY} \${SSH_USER}@\${VPS_IP} '
                            set -e
                            cd ${DEPLOY_PATH}
                            docker compose ps

                            # Chờ backend healthy rồi mới kết luận deploy thành công
                            for i in \$(seq 1 12); do
                                if curl -fsS http://127.0.0.1:8300/api/test/buildTest >/dev/null 2>&1; then
                                    echo "Backend healthy."
                                    exit 0
                                fi
                                echo "Chờ backend... (\$i/12)"
                                sleep 10
                            done
                            echo "Backend không healthy sau 2 phút" >&2
                            exit 1
                        '
                    """
                }
            }
        }

        stage('Cleanup') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'SSH_KEY', keyFileVariable: 'KEY', usernameVariable: 'SSH_USER'),
                    string(credentialsId: 'VPS_IP', variable: 'VPS_IP')
                ]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i \${KEY} \${SSH_USER}@\${VPS_IP} '
                            docker image prune -f
                        '
                    """
                }
            }
        }
    }
}
