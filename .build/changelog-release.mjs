import cp from 'child_process'
import { printChangelog } from './helpers.mjs'

// Use git diff --staged to check staged changes for release
cp.exec('git diff --staged --name-status src/_icons', function(err, ret) {
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
