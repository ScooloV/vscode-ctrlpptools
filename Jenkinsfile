/** This pipeline build thevsCode install package.

   @details
   The vsCode install package can be used in 2 ways.
     + install the pcakage localy (and test it)
     + publishthe packaga on ms-market-lace

    @warning
    Package building works only on windows nodes. Linux throw allways a exeption.
    But it shall be enougth to buld it on windows.
    It shall be possible to install *.vsix package also on linux/mac platforms.
        
   @dependencies On build node musst be node.js installed.
*/

// job properties
// kepp only last 10 jobs - free space on master
properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10'))
           ])

// pipe self
lock(label: 'test-farm') {
  node('winServer16-slave001'){
    try {
      stage("Get project"){
        echo 'Pulling...' + env.BRANCH_NAME
        checkout scm
      }
    
      stage("Install required dependencies"){
        bat 'npm install -g vscode'
        bat 'npm install -g vsce'
        bat 'npm install'
      }
      
      stage("Create  package"){
        bat "vsce package"
      }
      
      // ever think is fine (0 false positive) we can publibat package
      stage("Deploy"){
        archiveArtifacts artifacts: '*.vsix'
        if ( env.BRANCH_NAME == 'master'){
          
          /// @todo some how publibat master on ms marketplace
          echo 'Publibat on master'
        }
        else
        {
          echo 'Publibating on $BRANCH_NAME are not allowed'
        }
        echo 'Hit: use \'code --install-extension ctrl-0.0.1.vsix --force\' to install package localy'
      }
    }  catch (exc) {
        currentBuild.result = 'FAILURE'
        throw exc
    }  finally {
        // archive logs.
        // @warning Log file exist only when somethin goes wrong in install stage. That means in
        //          good case throw this step a warning "‘*.log’ doesn’t match anything..."               
        archiveArtifacts artifacts: '*.log', allowEmptyArchive: true
        // clean up ws
       deleteDir()
    }
  }
}