* stage a deployment of a top-level-module
* determine what needs to be ??? based on from/to COMMIT SHA

```bash
ystage run --from=${CI_COMMIT_BEFORE_SHA} --to=${CI_COMMIT_SHA} <npm script>
ystage exec --from=${CI_COMMIT_BEFORE_SHA} --to=${CI_COMMIT_SHA} <npm script>
ystage stage --from=${CI_COMMIT_BEFORE_SHA} --to=${CI_COMMIT_SHA} <path to staging folder>
```
