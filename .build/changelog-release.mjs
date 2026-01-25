import cp from 'child_process'
import { printChangelog } from './helpers.mjs'

// Get the latest version tag
cp.exec('git describe --tags --abbrev=0', function(err, latestTag) {
  if (err) {
    // If no tags exist, compare with first commit
    latestTag = ''
  } else {
    latestTag = latestTag.trim()
  }

  // Compare current HEAD with the latest tag to find changes
  const command = latestTag 
    ? `git diff ${latestTag} HEAD --name-status src/_icons`
    : 'git log --name-status --pretty=format: src/_icons'

  cp.exec(command, function(err, ret) {
    // Also check staged changes
    const stagedCommand = 'git diff --cached --name-status src/_icons'
    cp.exec(stagedCommand, function(stagedErr, stagedRet) {
      // Combine both results
      const combinedRet = ret + '\n' + (stagedRet || '')
      
      let newIcons = [], modifiedIcons = [], renamedIcons = []

      combinedRet.replace(/A\s+src\/_icons\/([a-z0-9-]+)\.svg/g, function(m, fileName) {
        if (!newIcons.includes(fileName)) {
          newIcons.push(fileName)
        }
      })

      combinedRet.replace(/M\s+src\/_icons\/([a-z0-9-]+)\.svg/g, function(m, fileName) {
        if (!modifiedIcons.includes(fileName)) {
          modifiedIcons.push(fileName)
        }
      })

      combinedRet.replace(/R[0-9]+\s+src\/_icons\/([a-z0-9-]+)\.svg\s+src\/_icons\/([a-z0-9-]+).svg/g, function(m, fileNameBefore, fileNameAfter) {
        const existingRename = renamedIcons.find(r => r[0] === fileNameBefore && r[1] === fileNameAfter)
        if (!existingRename) {
          renamedIcons.push([fileNameBefore, fileNameAfter])
        }
      })

      modifiedIcons = modifiedIcons.filter(function(el) {
        return newIcons.indexOf(el) < 0
      })

      printChangelog(newIcons, modifiedIcons, renamedIcons)
    })
  })
})
