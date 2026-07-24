---
name: version-control-git
description: >-
  Passos operacionais do livro 'Version Control with Git' — comandos Git, branching, merge, rebase e workflows.
---

# Version Control with Git Powerful Tools and Techniques for - Prem Kumar Ponuthorai and Jon Loeliger — Passos Operacionais

Skill baseada no livro "Version Control with Git Powerful Tools and Techniques for - Prem Kumar Ponuthorai and Jon Loeliger" (EN). Contem passos praticos e
sequencias operacionais extraidos da obra.

Use quando o usuario pedir orientacao pratica sobre: Git, versionamento, branching, merge, rebase.

---

## 1. Debian/Ubuntu


## 2. Other Binary Distributions

- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.

## 3. Preparing to Work with Git

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:

## 4. Working with a Local Repository


### 4.1 Creating an initial repository

1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
1. Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
1. Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- Each tag is represented by a parallelogram. Each tag can point to, at most, one commit.
- Main porcelain commands (high-level commands for routine Git operations)
- Ancillary commands (commands that help query Git’s internal data store)

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 4.2 Adding a file to your repository

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 4.3 Making another commit

1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Commit them as usual.
1. Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.
1. Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.
- Each tag is represented by a parallelogram. Each tag can point to, at most, one commit.
- The name of the person who placed the new version into the repository (the committer) and the time when it was committed
- A description of the reason for this revision (the commit message)

> Often, when there is discord between a tool and a project, the developers simply create a new tool. Indeed, in the world of software, the temptation to create new tools can be deceptively easy and inviting. In the face of many existing version control systems, the decision to create another one shouldn’t be made casually. However, given a critical need, a bit of insight, and a healthy dose of moti


> One of the key aspects of a version control system is knowing who changed files and, if at all possible, why. Git enforces a change log on every commit that changes a file. The information stored in that change log is left up to the developer, project requirements, management, convention, and so on. Git ensures that changes will not happen mysteriously to files under version control because there 


### 4.4 Viewing your commits

1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
1. Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- A branch can reflect the stages of your project development lifecycle—for example, the stable, development, release candidate, and production release stages. This can provide clarity and streamline the workflow among teams in a systematic and coordinated manner.
- More often than not, a branch is also used to represent a specific product release. If you want to start a new-release version of your project but you know that some of your customers may want to stick with an older-release version, you have the option to maintain the older-release version as a separate branch for backward compatibility.
- A branch provides you an option to iterate and work on a specific feature or to research a fix for a bug in your project in an isolated development environment. This enables you to create multiple feature branches that encapsulate well-defined concepts or ideas that you can consolidate via a merge prior to cutting a release. Git’s branching system is robust yet inexpensive; thus this approach is encouraged and is not considered overkill when working with small changes in each branch you create. The word _feature_ simply indicates that each branch in the repository has a particular purpose.
- As an output in a matrix format, stating which commits are present in each listed branch’s respective columns.
- With its one-line commit message. As mentioned earlier, Git assigns the branch name to the most recent commit; thus previous commits on the same branch will have the same branch name with a special trailing character: a caret (`^`).

### 4.5 Viewing commit differences

1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Commit them as usual.
1. Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.
- Each tag is represented by a parallelogram. Each tag can point to, at most, one commit.
- The name of the person who placed the new version into the repository (the committer) and the time when it was committed

> One of the key aspects of a version control system is knowing who changed files and, if at all possible, why. Git enforces a change log on every commit that changes a file. The information stored in that change log is left up to the developer, project requirements, management, convention, and so on. Git ensures that changes will not happen mysteriously to files under version control because there 


> With atomic transactions, a number of different but related changes are performed either all together or not at all. This property ensures that the version control database is not left in a partially changed or corrupted state while an update or commit is happening. Git implements atomic transactions by recording complete, discrete repository states that cannot be broken down into individual or sm


### 4.6 Removing and renaming files in your repository

1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
1. Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
1. Calculate the diff between that combined version and Bob’s latest version, and patch that in.
1. Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- Main porcelain commands (high-level commands for routine Git operations)
- Ancillary commands (commands that help query Git’s internal data store)
- Low-level commands (plumbing commands for internal Git operations)

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


## 5. Working with a Shared Repository


### 5.1 Making a local copy of the repository

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


## 6. Configuration Files


### 6.1 Hierarchy of configuration files

1. `core.editor` configuration option
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- The name of a tree object that actually identifies the associated files
- The name of the person who composed the new version (the author) and the time when it was composed

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> A tool that manages and tracks different versions of software or other content is referred to generically as a version control system (VCS), a source code manager (SCM), a revision control system (RCS), and several other permutations of the words _revision_ , _version_ , _code_ , _content_ , _control_ , _management_ , and _system_. Although the authors and users of each tool might debate esoterics


### 6.2 Configuring an alias

1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
1. Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
1. Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- Each tag is represented by a parallelogram. Each tag can point to, at most, one commit.
- Main porcelain commands (high-level commands for routine Git operations)
- Ancillary commands (commands that help query Git’s internal data store)

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


## 7. Git Object Store

- `GIT_EDITOR` environment variable
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 8. Index


## 9. Content-Addressable Database


## 10. Git Tracks Content

- `GIT_EDITOR` environment variable
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 11. Pathname Versus Content

- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.

## 12. Packfiles


## 13. Inside the .git Directory

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Commit them as usual.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 14. Blob Objects and Hashes

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 15. Tree Object and Files

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 16. A Note on Git’s Use of SHA1

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 17. Tree Hierarchies

- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:

## 18. Commit Objects

- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 19. Tag Objects


## 20. Branch Names

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Someone creates a new branch off the `main` branch to fix bug `pr-1`, calling the new branch `bug/pr-1`.
- The same developer adds the line “Fix Problem Report 1” to a file in the `bug/pr-1` branch.
- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 21. Dos and Don’ts in Branch Names

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 22. Working in Branches

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.

## 23. Creating Branches

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 24. Listing Branch Names

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Someone creates a new branch off the `main` branch to fix bug `pr-1`, calling the new branch `bug/pr-1`.
- The same developer adds the line “Fix Problem Report 1” to a file in the `bug/pr-1` branch.
- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 25. Viewing Branches and Their Commits

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 26. Switching (Checking Out) Branches


### 26.1 A basic example of checking out a branch

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 26.2 Checking out when you have uncommitted changes

- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Main porcelain commands (high-level commands for routine Git operations)
- The name of the person who composed the new version (the author) and the time when it was composed
- The name of the person who placed the new version into the repository (the committer) and the time when it was committed
- A branch provides you an option to iterate and work on a specific feature or to research a fix for a bug in your project in an isolated development environment. This enables you to create multiple feature branches that encapsulate well-defined concepts or ideas that you can consolidate via a merge prior to cutting a release. Git’s branching system is robust yet inexpensive; thus this approach is encouraged and is not considered overkill when working with small changes in each branch you create. The word _feature_ simply indicates that each branch in the repository has a particular purpose.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 26.3 Git checkout: Working with files versus branches

1. `GIT_EDITOR` environment variable
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Main porcelain commands (high-level commands for routine Git operations)
- Ancillary commands (commands that help query Git’s internal data store)

> Because Git is a distributed revision control system, it is vital to obtain absolute assurance that data integrity is maintained and is not somehow being altered. How do you know the data hasn’t been altered in transition from one developer to the next? Or from one repository to the next? Or, for that matter, that the data in a Git repository is even what it purports to be?


> Git uses a common cryptographic hash function, called Secure Hash Function (SHA1), to name and identify objects within its database. Though perhaps not absolute, in practice it has proven to be solid enough to ensure integrity and trust for all of Git’s distributed repositories.


## 27. Merging Changes into a Different Branch

- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 28. Creating and Checking Out a New Branch

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 29. Detached HEAD


## 30. Deleting Branches

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 31. Absolute Commit Names

- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 32. Refs and Symrefs

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 33. Relative Commit Names

- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 34. Viewing Old Commits

- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 35. Commit Graphs


### 35.1 Using gitk to view the commit graph

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


## 36. Commit Ranges

- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 37. Using git commit --all

- `GIT_EDITOR` environment variable
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Commit them as usual.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.

## 38. Writing Commit Log Messages

- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 39. Preparing for a Merge

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 40. Merging Two Branches

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 41. A Merge with a Conflict

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 42. Locating Conflicted Files

- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.

## 43. Inspecting Conflicts


### 43.1 git diff with conflicts

1. `GIT_EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- Main porcelain commands (high-level commands for routine Git operations)

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> A tool that manages and tracks different versions of software or other content is referred to generically as a version control system (VCS), a source code manager (SCM), a revision control system (RCS), and several other permutations of the words _revision_ , _version_ , _code_ , _content_ , _control_ , _management_ , and _system_. Although the authors and users of each tool might debate esoterics


### 43.2 git log with conflicts

1. `GIT_EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Each tag is represented by a parallelogram. Each tag can point to, at most, one commit.
- Main porcelain commands (high-level commands for routine Git operations)

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> There are many facets to “distributed development,” and Linus wanted a new VCS that would cover most of them. It had to allow parallel as well as independent and simultaneous development in private repositories without the need for constant synchronization with a central repository, which could form a development bottleneck. It had to allow multiple developers in multiple locations even if some of


## 44. How Git Keeps Track of Conflicts

- `GIT_EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.

## 45. Finishing Up a Conflict Resolution

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 46. Aborting or Restarting a Merge

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `EDITOR` environment variable
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- The same developer adds the line “Fix Problem Report 1” to a file in the `bug/pr-1` branch.
- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 47. Degenerate Merges


## 48. Normal Merges


### 48.1 Recursive merges


### 48.2 Octopus merges


## 49. Specialty Merges


### 49.1 Ours and subtree merges

1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
1. Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- Main porcelain commands (high-level commands for routine Git operations)
- Ancillary commands (commands that help query Git’s internal data store)
- Low-level commands (plumbing commands for internal Git operations)

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


## 50. Applying Merge Strategies

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.

## 51. Merge Drivers

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.

## 52. Merges and Git’s Object Model

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 53. Squash Merges


## 54. Why Not Just Merge Each Change One by One?

- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.
- [Installing Git](preface01.html#sec-note-on-examples-in-the-book)
- [A Note on Inclusive Language](preface01.html#idm45353995157104)

## 55. Using git rebase -i

- `GIT_EDITOR` environment variable
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 56. rebase Versus merge

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 57. Use Case: Interrupted Workflow


### 57.1 Viewing the stashed context

1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Commit them as usual.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


> A tool that manages and tracks different versions of software or other content is referred to generically as a version control system (VCS), a source code manager (SCM), a revision control system (RCS), and several other permutations of the words _revision_ , _version_ , _code_ , _content_ , _control_ , _management_ , and _system_. Although the authors and users of each tool might debate esoterics


## 58. Use Case: Updating Local Work in Progress with Upstream Changes

- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- [Conventions Used in This Book](preface01.html#sec-pre-Conventions-Used-in-This-Book)

## 59. Use Case: Converting Stashed Changes Into a Branch

- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- [Conventions Used in This Book](preface01.html#sec-pre-Conventions-Used-in-This-Book)

## 60. Bare and Development Repositories

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 61. Repository Clones


## 62. Remotes


## 63. Tracking Branches

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 64. Referencing Other Repositories

- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.

## 65. Referring to Remote Repositories

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:

## 66. The refspec

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Commit them as usual.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 67. Creating an Authoritative Repository

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Someone creates a new branch off the `main` branch to fix bug `pr-1`, calling the new branch `bug/pr-1`.
- The same developer adds the line “Fix Problem Report 1” to a file in the `bug/pr-1` branch.
- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.

## 68. Make Your Own Origin Remote

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 69. Developing in Your Repository

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.

## 70. Pushing Your Changes

- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 71. Adding a New Developer

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 72. Getting Repository Updates


### 72.1 The fetch step

1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Commit them as usual.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


> A tool that manages and tracks different versions of software or other content is referred to generically as a version control system (VCS), a source code manager (SCM), a revision control system (RCS), and several other permutations of the words _revision_ , _version_ , _code_ , _content_ , _control_ , _management_ , and _system_. Although the authors and users of each tool might debate esoterics


### 72.2 The merge or rebase step

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 72.3 Should you merge or rebase?

1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
1. Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
1. Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- A branch can reflect the stages of your project development lifecycle—for example, the stable, development, release candidate, and production release stages. This can provide clarity and streamline the workflow among teams in a systematic and coordinated manner.
- More often than not, a branch is also used to represent a specific product release. If you want to start a new-release version of your project but you know that some of your customers may want to stick with an older-release version, you have the option to maintain the older-release version as a separate branch for backward compatibility.
- A branch provides you an option to iterate and work on a specific feature or to research a fix for a bug in your project in an isolated development environment. This enables you to create multiple feature branches that encapsulate well-defined concepts or ideas that you can consolidate via a merge prior to cutting a release. Git’s branching system is robust yet inexpensive; thus this approach is encouraged and is not considered overkill when working with small changes in each branch you create. The word _feature_ simply indicates that each branch in the repository has a particular purpose.
- You can use the forward slash (`/`) to create a hierarchical name scheme. However, the name cannot end with a slash.

> Often, when there is discord between a tool and a project, the developers simply create a new tool. Indeed, in the world of software, the temptation to create new tools can be deceptively easy and inviting. In the face of many existing version control systems, the decision to create another one shouldn’t be made casually. However, given a critical need, a bit of insight, and a healthy dose of moti


> Because Git is a distributed revision control system, it is vital to obtain absolute assurance that data integrity is maintained and is not somehow being altered. How do you know the data hasn’t been altered in transition from one developer to the next? Or from one repository to the next? Or, for that matter, that the data in a Git repository is even what it purports to be?


## 73. Cloning a Repository

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 74. Alternate Histories


## 75. Non-Fast-Forward Pushes


## 76. Fetching the Alternate History

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Commit them as usual.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 77. Merging Histories


## 78. Merge Conflicts

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.

## 79. Pushing a Merged History

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 80. Using git remote

- `GIT_EDITOR` environment variable
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 81. Using git config

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 82. Using Manual Editing

- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [Quick Introduction to Using Git](ch01.html#sec-gs-quick-introduction)

## 83. Creating Tracking Branches

- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 84. Ahead and Behind

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [The Git Command Line](ch01.html#sec-gs-The-Git-Command-Line)

## 85. Repositories with Controlled Access

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 86. Repositories with Anonymous Read Access


### 86.1 Publishing repositories using git-daemon

1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
1. Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
1. [Quick Introduction to Using Git](ch01.html#sec-gs-quick-introduction)

> There are many facets to “distributed development,” and Linus wanted a new VCS that would cover most of them. It had to allow parallel as well as independent and simultaneous development in private repositories without the need for constant synchronization with a central repository, which could form a development bottleneck. It had to allow multiple developers in multiple locations even if some of


> Linus was determined to ensure that a new VCS was fast and efficient. In order to support the sheer volume of update operations that would be made on the Linux kernel alone, he knew that both individual update operations and network transfer operations would have to be very fast. To save space and thus transfer time, compression and “delta” techniques would be needed. Using a distributed model ins


### 86.2 Publishing repositories using an HTTP daemon

1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
1. Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
1. [Quick Introduction to Using Git](ch01.html#sec-gs-quick-introduction)

> There are many facets to “distributed development,” and Linus wanted a new VCS that would cover most of them. It had to allow parallel as well as independent and simultaneous development in private repositories without the need for constant synchronization with a central repository, which could form a development bottleneck. It had to allow multiple developers in multiple locations even if some of


> Linus was determined to ensure that a new VCS was fast and efficient. In order to support the sheer volume of update operations that would be made on the Linux kernel alone, he knew that both individual update operations and network transfer operations would have to be very fast. To save space and thus transfer time, compression and “delta” techniques would be needed. Using a distributed model ins


### 86.3 Publishing repositories using Smart HTTP

1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
1. Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
1. [Quick Introduction to Using Git](ch01.html#sec-gs-quick-introduction)

> There are many facets to “distributed development,” and Linus wanted a new VCS that would cover most of them. It had to allow parallel as well as independent and simultaneous development in private repositories without the need for constant synchronization with a central repository, which could form a development bottleneck. It had to allow multiple developers in multiple locations even if some of


> Linus was determined to ensure that a new VCS was fast and efficient. In order to support the sheer volume of update operations that would be made on the Linux kernel alone, he knew that both individual update operations and network transfer operations would have to be very fast. To save space and thus transfer time, compression and “delta” techniques would be needed. Using a distributed model ins


### 86.4 Publishing repositories via Git and HTTP daemons

- A branch provides you an option to iterate and work on a specific feature or to research a fix for a bug in your project in an isolated development environment. This enables you to create multiple feature branches that encapsulate well-defined concepts or ideas that you can consolidate via a merge prior to cutting a release. Git’s branching system is robust yet inexpensive; thus this approach is encouraged and is not considered overkill when working with small changes in each branch you create. The word _feature_ simply indicates that each branch in the repository has a particular purpose.

> There are many facets to “distributed development,” and Linus wanted a new VCS that would cover most of them. It had to allow parallel as well as independent and simultaneous development in private repositories without the need for constant synchronization with a central repository, which could form a development bottleneck. It had to allow multiple developers in multiple locations even if some of


> Git uses a common cryptographic hash function, called Secure Hash Function (SHA1), to name and identify objects within its database. Though perhaps not absolute, in practice it has proven to be solid enough to ensure integrity and trust for all of Git’s distributed repositories.


## 87. Repositories with Anonymous Write Access

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 88. Shared Repository Structure


## 89. Distributed Repository Structure


## 90. Changing Public History

- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.

## 91. Separate Commit and Publish Steps

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 92. No One True History

- Someone creates a new branch off the `main` branch to fix bug `pr-1`, calling the new branch `bug/pr-1`.
- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.
- [Essential Know-How](preface01.html#sec-pre-Essential-Know-Hows)
- [Installing Git](preface01.html#sec-note-on-examples-in-the-book)
- [A Note on Inclusive Language](preface01.html#idm45353995157104)
- [Acknowledgments](preface01.html#sec-pre-Acknowledgments)
- [Git Components](ch01.html#chap-Git-Components)

## 93. Upstream and Downstream Flows

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 94. The Maintainer and Developer Roles

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Commit them as usual.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 95. Maintainer–Developer Interaction


## 96. Role Duality


## 97. Your Own Workspace

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 98. Where to Start Your Repository

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:

## 99. Converting to a Different Upstream Repository

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.

## 100. Using Multiple Upstream Repositories

- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.
- [Quick Introduction to Using Git](ch01.html#sec-gs-quick-introduction)

## 101. Forking Projects


### 101.1 To fork or not?

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 101.2 Reconciling forks


### 101.3 Forking projects at GitHub

1. `core.editor` configuration option
1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
1. Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


## 102. Example Hooks

- [Installing Git](preface01.html#sec-note-on-examples-in-the-book)

## 103. Creating Your First Hook

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.

## 104. Commit-Related Hooks


## 105. Patch-Related Hooks


## 106. Push-Related Hooks


## 107. Other Local Repository Hooks

- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.

## 108. Why Submodules?


## 109. Working with Submodules


### 109.1 Adding a submodule

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 109.2 Cloning a repository

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 109.3 submodule add versus submodule init

1. The same developer adds the line “Fix Problem Report 1” to a file in the `bug/pr-1` branch.
1. Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.

### 109.4 Changing submodules from within a superproject

1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Pull from the `gitweb.git` project using the ours strategy:
1. In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
1. Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- Each branch name with its one-line commit message from the most recent commit in that branch, which can be helpful as a quick reference

> Because Git is a distributed revision control system, it is vital to obtain absolute assurance that data integrity is maintained and is not somehow being altered. How do you know the data hasn’t been altered in transition from one developer to the next? Or from one repository to the next? Or, for that matter, that the data in a Git repository is even what it purports to be?


### 109.5 Pulling submodule updates

- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.

### 109.6 Pulling updates of a superproject that uses a submodule

1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Someone creates a new branch off the `main` branch to fix bug `pr-1`, calling the new branch `bug/pr-1`.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- The name of a tree object that actually identifies the associated files
- The name of the person who composed the new version (the author) and the time when it was composed

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> A tool that manages and tracks different versions of software or other content is referred to generically as a version control system (VCS), a source code manager (SCM), a revision control system (RCS), and several other permutations of the words _revision_ , _version_ , _code_ , _content_ , _control_ , _management_ , and _system_. Although the authors and users of each tool might debate esoterics


## 110. Adding a Subproject

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 111. Pulling Subproject Updates


## 112. Changing the Subproject from Within the Superproject

- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Commit them as usual.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.

## 113. Date-Based Checkout


### 113.1 Date-based checkout cautions


## 114. Retrieve an Old Version of a File

- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Start with the most recent revision from Cal that _both_ Alice and Bob have. In this case, that’s Cal’s most recent revision, `Q`, which has been merged into both Bob’s and Alice’s branches.
- Calculate the diff between that revision and the most recent revision that Alice merged from Bob, and patch that in.
- Calculate the diff between that combined version and Bob’s latest version, and patch that in.
- Someone creates a new branch off the `main` branch to fix bug `pr-1`, calling the new branch `bug/pr-1`.
- The same developer adds the line “Fix Problem Report 1” to a file in the `bug/pr-1` branch.
- Meanwhile, another developer fixes bug `pr-3` in the `main` branch, adding the line “Fix Problem Report 3” to the same file in the `main` branch.

## 115. The git fsck Command

- `GIT_EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Commit them as usual.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:

## 116. Reconnecting a Lost Commit

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 117. Examples Using git filter-repo


### 117.1 Installing git-filter-repo

1. [Installing Git](preface01.html#sec-note-on-examples-in-the-book)

### 117.2 Analyzing a repository

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 117.3 Path-based filtering


### 117.4 Content-based filtering


### 117.5 Commit message filtering

1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Commit them as usual.
1. Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.
- Each tag is represented by a parallelogram. Each tag can point to, at most, one commit.
- The name of the person who placed the new version into the repository (the committer) and the time when it was committed
- A description of the reason for this revision (the commit message)

> One of the key aspects of a version control system is knowing who changed files and, if at all possible, why. Git enforces a change log on every commit that changes a file. The information stored in that change log is left up to the developer, project requirements, management, convention, and so on. Git ensures that changes will not happen mysteriously to files under version control because there 


> With atomic transactions, a number of different but related changes are performed either all together or not at all. This property ensures that the version control database is not left in a partially changed or corrupted state while an update or commit is happening. Git implements atomic transactions by recording complete, discrete repository states that cannot be broken down into individual or sm


## 118. Migrating from a Git Version Control System

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.

## 119. Migrating from a Non-Git Version Control System

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.

## 120. A Note on Working with Large Repositories

- `GIT_EDITOR` environment variable
- `core.editor` configuration option
- `VISUAL` environment variable
- `EDITOR` environment variable
- Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- Commit them as usual.

## 121. Repository Before Git LFS and After Git LFS

- `GIT_EDITOR` environment variable
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 122. Installing Git LFS

- `GIT_EDITOR` environment variable
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 123. Tracking Large Objects with Git LFS


## 124. Useful Git LFS Techniques

- `GIT_EDITOR` environment variable
- Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
- Pull from the `gitweb.git` project using the ours strategy:
- In the future, you can continue to pull the latest changes from the `gitweb.git` project using the `subtree` strategy:
- Rename your old upstream branch. It is important to do this before you fetch because it allows a clean fetch of the new upstream history. Try something like `git branch save-origin-main origin/main`.
- Fetch from upstream to recover the current upstream content. A simple `git fetch` should be sufficient.
- Rebase your commits from the renamed branch onto the new upstream branch using a command like `cherry-pick` or `rebase`. This should be the command `git rebase --onto origin/main save-origin-main main`.
- Clean up and remove the temporary branch. Try using the command `git branch -D save-origin-main`.

## 125. Converting Existing Repositories to Use Git LFS


## 126. Repository View


## 127. Code


## 128. Issues


## 129. Pull Requests


### 129.1 Symbols


### 129.2 A

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 129.3 B

1. `GIT_EDITOR` environment variable
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 129.4 C

1. `core.editor` configuration option
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
1. Subtract `M~9` from `M~7` to get the commits shown in the third line of the figure.
1. Copy the current files from the `gitweb.git` project into the _gitweb_ subdirectory of your project.
1. Commit them as usual.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 129.5 D

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
1. Find everything leading up to and including `M~9`, as shown in the second line of the figure.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


### 129.6 E

1. `GIT_EDITOR` environment variable
1. `core.editor` configuration option
1. `VISUAL` environment variable
1. `EDITOR` environment variable
1. Begin with everything leading up to `M~7`, as shown in the first line of Figure 4-11.
- First, Git’s object store is based on the hashed computation of the _contents_ of its objects, not on the file or directory names from the user’s original file layout.
- Second, Git’s internal database efficiently stores every version of every file, not their differences as files go from one revision to the next.
- The blob object is at the “bottom” of the data structure; it references no other Git objects and is referenced only by tree objects. It can be considered a leaf node in relation to the tree object. In the figures that follow, each blob is represented by a rectangle.
- Tree objects point to blobs and possibly to other trees as well. Any given tree object might be pointed at by many different commit objects. Each tree is represented by a triangle. In [Chapter 15](ch15.xhtml#chap-Submodules), we will learn how a tree object can also point to a commit object, but for now, we will keep it simple.
- A circle represents a commit. A commit points to one particular tree that is introduced into the repository by the commit.

> No cautious, creative person starts a project nowadays without a backup strategy. Because data is ephemeral and can be lost easily—through an errant code change or a catastrophic disk crash, say—it is wise to maintain a living archive of all work.


> For text and code projects, the backup strategy typically includes version control, or tracking and managing revisions. Each developer can make several revisions per day, and the ever-increasing corpus serves simultaneously as repository, project narrative, communication medium, and team and product management tool. Given its pivotal role, version control is most effective when tailored to the wor


## Referencias


Table 2-1. Database comparison System | Index mechanism | Data store
---|---|---
Relational database | Indexed Sequential Access Method (ISAM) | Data records
Unix filesystem | Directories (_/path/to/file_) | Blocks of data
Git | _.git/objects/__`hash`_ , tree object contents | Blob objects, tree objects


Table 4-1. Difference between explicit and implicit commits | Explicit | Implicit
---|---|---
Identified via | Absolute commit name | Refs, symrefs, relative commit names
Example | `34043c95636aee319d606a7a380697cae4f1bfcc` | `HEAD`, `HEAD^2`, etc.
