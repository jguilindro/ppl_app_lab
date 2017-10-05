# Modo de trabajo en ppl con git

Se usara cada rama por anadir una nueva funcionalidad(feauture) y una rama por cada arreglar un error(fix)

### Formato de rama feature

feature-nombre-nuevo-feature

### Formato rama fix

fix-nombre-fix


* Las ramas seran subidas a github solo en caso de que mas de una persona necesite trabajar en esta rama.

### Merge de las ramas

Para hacer merge se usara el comando(debera estar en la rama develop):

```sh
> git merge --no-ff nombre-rama
```

El comando obligara a crear un "merge commit"


### Borrar rama remota

Luego de que la funcionalidad en la rama haya sido terminada, se procedera a borrar la rama remota y la local:

__Borrar rama remota__
```sh
> git push origin --delete documentacion
```

__Borrar rama local remota__
```sh
> git branch -d -r origin/remoto
```

__Borrar rama__
```sh
> git branch -d rama
```

<!-- git clean -f -d -->
<!-- https://github.com/git-tips/tips -->
<!-- https://github.com/karan/joe -->
<!-- 
## squashing commit del merge
https://blog.gitprime.com/what-really-happens-when-you-squash-git-commits/
http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html
https://www.atlassian.com/git/tutorials/comparing-workflows
http://nvie.com/posts/a-successful-git-branching-model/
 -->