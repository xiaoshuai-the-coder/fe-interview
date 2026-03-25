# 定义目录
SRC_DIR := ./hand-writing
TEST_DIR := $(SRC_DIR)/__tests__

# 用法：make create demo
.PHONY: create
create:
	@[ -n "$(filter-out $@,$(MAKECMDGOALS))" ] || { \
		echo "❌ 用法错误！"; \
		echo "👉 使用：make create 文件名"; \
		echo "👉 示例：make create demo"; \
		exit 1; \
	}

	# 获取文件名
	$(eval name := $(filter-out $@,$(MAKECMDGOALS)))
	@mkdir -p $(SRC_DIR) $(TEST_DIR)
	@touch $(SRC_DIR)/$(name).ts
	@touch $(TEST_DIR)/$(name).test.js
	@echo "✅ 创建成功！"
	@echo "  业务文件：$(SRC_DIR)/$(name).ts"
	@echo "  测试文件：$(TEST_DIR)/$(name).test.js"

tree:
	@echo "📁 生成项目目录结构（排除 node_modules & coverage）..."
	tree -I 'node_modules|coverage'
	
# 忽略多余参数（必须加这行）
%:
	@: