
const exampleGitLog = `
commit cd7dc4d7bde3085b08973abd16ec1a5af995d9f7
Author: Grzegorz Klimek <kfiku.com@gmail.com>
Date:   Thu Feb 22 10:36:48 2018 +0100

    cleanup

 1 file changed, 1 deletion(-)

commit 38bb0c547f5542a5d8718a5c642af6f98b251ed8
Author: John Doe <john@localhost>
Date:   Thu Feb 22 10:36:32 2018 +0100

    move to lodash sortby

 3 files changed, 28 insertions(+), 13 deletions(-)

commit 7fff4c8ecf13acb82bccb27708616924c472610d
Author: Grzegorz Klimek <kfiku.com@gmail.com>
Date:   Thu Feb 22 10:19:33 2018 +0100

    add option to pass multiple dirs to search as args

 1 file changed, 44 insertions(+), 26 deletions(-)

commit 06ab6bdfc784976c3e15e67d19a2f6cdf5b40e36
Author: John Doe <john@localhost>
Date:   Thu Feb 22 10:19:11 2018 +0100

    add bin to link this cmd

 1 file changed, 4 insertions(+), 1 deletion(-)

commit 6c2eda32f9c3aa4d4ffc308dfd244ad38b8e9f49
Author: Grzegorz Klimek <kfiku.com@gmail.com>
Date:   Thu Feb 22 09:55:27 2018 +0100

    add option to use with command args

 1 file changed, 3 insertions(+), 3 deletions(-)

commit a8620c479baac038c1b35846ecec168b94d3afd1
Author: Grzegorz Klimek <kfiku.com@gmail.com>
Date:   Thu Feb 22 09:55:02 2018 +0100

    update depts

 2 files changed, 9 insertions(+), 9 deletions(-)

commit b5959f28cb9dec334b1d1cf312f3a1832745d2a7
Author: Grzegorz Klimek <kfiku.com@gmail.com>
Date:   Thu Feb 22 09:08:39 2018 +0100

    fix errors with multiline commits

 1 file changed, 2 insertions(+), 1 deletion(-)

commit 94b5b9fa1fe3e18676b048e4aefd0d2fb3261013
Author: Jan Kowalski <jan@localhost>
Date:   Thu Nov 23 11:25:21 2017 +0100

    remove unuser depts

 3 files changed, 1 insertion(+), 24 deletions(-)

commit 8e039651016f851c932b884f43da29ed11f742f7
Author: John Doe <john@localhost>
Date:   Thu Nov 23 11:22:42 2017 +0100

    fix proper parsing and summit commit stats

 3 files changed, 66 insertions(+), 44 deletions(-)

commit 807a473be260d5f5c6415083d84daebcab907db0
Author: Grzegorz Klimek <kfiku.com@gmail.com>
Date:   Mon Oct 30 08:58:30 2017 +0100

    add sort by lines added

 1 file changed, 5 insertions(+), 2 deletions(-)

commit 4327f1e80134180e7805b5bbb9dceb66337eb79f
Author: Jan Kowalski <jan@localhost>
Date:   Thu Sep 28 16:25:31 2017 +0200

    first commit

 5 files changed, 280 insertions(+)

commit 897933a72d24da22467a65b4c192b5d93169baaf
Author: Grzegorz Klimek <kfiku.com@gmail.com>
Date:   Thu Sep 28 14:14:32 2017 +0200

    Initial commit

 3 files changed, 82 insertions(+)
`

const exampleSingleGitLog = `
commit cd7dc4d7bde3085b08973abd16ec1a5af995d9f7
Author: Grzegorz Klimek <kfiku.com@gmail.com>
Date:   Thu Feb 22 10:36:48 2018 +0100

    cleanup

 1 file changed, 1 deletion(-)
`

const commitsObjects = [
  {
    authorEmail: 'kfiku.com@gmail.com',
    authorName: 'Grzegorz Klimek',
    date: 'Thu Feb 22 10:36:48 2018 +0100',
    message: 'cleanup',
    stats: {
      deletions: 1,
      filesChanged: 1,
      insertions: 0
    }
  }
]

const commitsObjectsMultiple = [
  {
    authorEmail: 'kfiku.com@gmail.com',
    authorName: 'Grzegorz Klimek',
    date: 'Thu Feb 22 10:36:48 2018 +0100',
    message: '1',
    stats: {
      deletions: 1,
      filesChanged: 1,
      insertions: 0
    }
  },
  {
    authorEmail: 'kfiku.com@gmail.com',
    authorName: 'Grzegorz Klimek',
    date: 'Thu Feb 22 10:36:48 2018 +0100',
    message: '2',
    stats: {
      deletions: 2,
      filesChanged: 1,
      insertions: 0
    }
  },
  {
    authorEmail: 'kfiku.com@gmail.com',
    authorName: 'Grzegorz Klimek',
    date: 'Thu Feb 22 10:36:48 2018 +0100',
    message: '3',
    stats: {
      deletions: 1,
      filesChanged: 1,
      insertions: 9
    }
  },
  {
    authorEmail: 'john@localhost',
    authorName: 'John Doe',
    date: 'Thu Feb 22 10:36:48 2018 +0100',
    message: 'jd1',
    stats: {
      deletions: 1,
      filesChanged: 1,
      insertions: 0
    }
  },
  {
    authorEmail: 'jan@localhost',
    authorName: 'Jan Kowalski',
    date: 'Thu Feb 22 10:36:48 2018 +0100',
    message: 'jk1',
    stats: {
      deletions: 3,
      filesChanged: 4,
      insertions: 1
    }
  },
  {
    authorEmail: 'jan@localhost',
    authorName: 'Jan Kowalski',
    date: 'Thu Feb 22 10:36:48 2018 +0100',
    message: 'jk2',
    stats: {
      deletions: 15,
      filesChanged: 2,
      insertions: 4
    }
  }
]

module.exports = {
  exampleGitLog,
  exampleSingleGitLog,
  commitsObjects,
  commitsObjectsMultiple
}
