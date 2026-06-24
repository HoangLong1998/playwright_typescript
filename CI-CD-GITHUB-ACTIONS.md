# CI/CD với GitHub Actions - Kiến Thức Cốt Lõi

## 1. CI là gì?
**Continuous Integration (CI)** = tự động chạy test, lint, build mỗi khi push code.

- Mục đích: phát hiện lỗi sớm trước khi merge.
- Trigger: `push` vào branch hoặc tạo/update PR.

Ví dụ:
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

## 2. CD là gì?
**Continuous Deployment (CD)** = tự động deploy code lên môi trường (staging/production) sau khi CI xanh.

- Nếu chỉ có deployment tự động → Continuous Deployment.
- Nếu cần manual approve trước deploy → Continuous Delivery.

Ví dụ: merge vào `main` → CI chạy → nếu pass → deploy lên production.

## 3. Workflow GitHub Actions
File YAML trong `.github/workflows/` định nghĩa quy trình tự động.

### Cấu trúc cơ bản
```yaml
name: My Workflow

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:  # chạy manual từ UI

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

## 4. Các khái niệm chính

| Khái niệm | Ý nghĩa |
|-----------|---------|
| `on:` | Điều kiện kích hoạt workflow |
| `jobs:` | Các công việc cần chạy |
| `runs-on:` | Loại runner (ubuntu-latest, macos, windows) |
| `steps:` | Các bước trong job |
| `uses:` | Dùng action có sẵn |
| `run:` | Chạy lệnh shell |

## 5. Triggers (kích hoạt workflow)

```yaml
on:
  push:           # khi push code
    branches: [main, develop]
  pull_request:   # khi tạo/update PR
    branches: [main]
  schedule:       # chạy theo lịch (cron)
    - cron: '0 2 * * *'
  workflow_dispatch:  # chạy manual từ UI
```

## 6. Workflow CI cơ bản (Playwright)

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
```

## 7. Workflow CI + CD

```yaml
name: CI/CD

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  deploy:
    needs: test  # chạy sau khi `test` thành công
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploying to production..."
      # thêm lệnh deploy thực tế ở đây
```

## 8. Sử dụng Secrets
Để lưu mật khẩu, token, API key một cách an toàn:

1. Vào repo → `Settings` → `Secrets and variables` → `Actions`
2. Thêm secret (ví dụ: `SLACK_WEBHOOK_URL`)
3. Dùng trong workflow:
```yaml
env:
  SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 9. Notification (Slack/Email)

### Slack
```yaml
- name: Send Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        "text": "Test completed: ${{ job.status }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Email
```yaml
- name: Send email
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.SMTP_USERNAME }}
    password: ${{ secrets.SMTP_PASSWORD }}
    subject: "Test Report"
    body: "All tests passed!"
    to: ${{ secrets.EMAIL_TO }}
```

## 10. Best Practices

1. **Branch naming**: `feature/...`, `bugfix/...`, `hotfix/...`
2. **Protected main**: yêu cầu PR + CI xanh trước merge
3. **Meaningful commits**: viết message rõ ràng
4. **Cache dependencies**: dùng `actions/cache` để tăng tốc
5. **Matrix builds**: kiểm tra trên nhiều Node version
6. **Status badges**: thêm badge status vào README
7. **Deploy conditions**: chỉ deploy từ `main` hoặc release branch

## 11. Quy trình chuẩn (Full CI/CD Flow)

```
1. Tạo feature branch
2. Code + test local
3. Push lên remote
4. Tạo PR vào main
5. CI chạy trên PR (test, lint)
6. Review + approval
7. Merge vào main
8. CI chạy lại (xác nhận)
9. CD deploy tự động
10. Monitor + verify
```

## 12. Ví dụ đơn giản: Deploy GitHub Pages

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./playwright-report
```

## 13. Các action phổ biến

| Action | Mục đích |
|--------|---------|
| `actions/checkout` | Clone repo |
| `actions/setup-node` | Setup Node.js |
| `actions/cache` | Cache dependencies |
| `actions/upload-artifact` | Upload file |
| `actions/download-artifact` | Download file |
| `peaceiris/actions-gh-pages` | Deploy GH Pages |
| `docker/build-push-action` | Build & push Docker |

## 14. Debugging

- Kiểm tra logs ở tab `Actions` → chọn run
- Dùng `workflow_dispatch` để chạy manual
- Thêm `run: echo ${{ github.event }}` để debug variables
- Xem status badge: `https://github.com/USER/REPO/actions/workflows/FILE.yml/badge.svg`

## Tóm tắt
- **CI**: Test code mỗi khi push/PR
- **CD**: Deploy code tự động sau khi test pass
- **GitHub Actions**: Công cụ free để setup CI/CD
- **Workflow**: File YAML định nghĩa quy trình
- **Job**: Các bước cần làm
- **Step**: Từng lệnh chi tiết

---

**Bắt đầu**: Viết workflow CI đơn giản → test local → push → xem chạy → dần add CD.
