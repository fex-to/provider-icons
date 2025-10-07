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
    let newIcons = [], modifiedIcons = [], renamedIcons = []

    ret.replace(/A\s+src\/_icons\/([a-z0-9-]+)\.svg/g, function(m, fileName) {
      newIcons.push(fileName)
    })

    ret.replace(/M\s+src\/_icons\/([a-z0-9-]+)\.svg/g, function(m, fileName) {
      modifiedIcons.push(fileName)
    })

    ret.replace(/R[0-9]+\s+src\/_icons\/([a-z0-9-]+)\.svg\s+src\/_icons\/([a-z0-9-]+).svg/g, function(m, fileNameBefore, fileNameAfter) {
      renamedIcons.push([fileNameBefore, fileNameAfter])
    })

    modifiedIcons = modifiedIcons.filter(function(el) {
      return newIcons.indexOf(el) < 0
    })

    printChangelog(newIcons, modifiedIcons, renamedIcons)
  })
})
