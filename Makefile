MOD_NAME = d3-barchart

boil:
	@boil d3-graph


############### Test ################
REPORTER = tap
TEST_FILES = test/*.test.js

############### Docs ################
DOCS_TMPL_DIR = docs-tmpl
MOCHA_MD_DOCS = README_footer.md

############### Templates ################
## tmpl
TMPL_DIR = tmpl
TMPL_CONVERT_CMD = minstache <
# TMPL_CONVERT_CMD = component convert

############### Build ################
BUILD_DIR = build
BUILD_COMPILED = $(BUILD_DIR)/$(MOD_NAME).js
BUILD_COMPILED_MIN = $(BUILD_COMPILED:.js=.min.js)
BUILD_COMPILED_STANDALONE = $(BUILD_COMPILED:.js=.standalone.js)
BUILD_COMPILED_CSS = $(BUILD_COMPILED:.js=.css)

############### public ################
PUBLIC_DIR = public
PUBLIC_COMPILED = $(PUBLIC_DIR)/build.js
PUBLIC_COMPILED_MIN = $(PUBLIC_COMPILED:.js=.min.js)
PUBLIC_COMPILED_CSS = $(PUBLIC_COMPILED:.js=.css)
PUBLIC_ALL = $(PUBLIC_COMPILED) $(PUBLIC_COMPILED_CSS)
# PUBLIC_ALL = $(PUBLIC_COMPILED_MIN) $(PUBLIC_COMPILED) $(PUBLIC_COMPILED_CSS)

############### install ################
COMPONENTJS_CMD = @component build --use component-hogan --use component-json --out $(@D) --name $(basename $(@F))
# COMPONENTJS_CMD = @component build --use component-string --out $(@D) --name $(basename $(@F))
# COMPONENTJS_CMD = @component build --use component-html --out $(@D) --name $(basename $(@F))


######################################
# Release
######################################
# publish: clean public docs test-node lint
# publish: public docs test-node lint
publish: public docs lint

docs: build
	@grunt build
	@make clean-readme

lint:
	@./node_modules/.bin/jshint lib

######################################
# Tests
######################################
test: test-node test-saucelabs

test-node: npm-install-dev
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 2000 \
		$(TEST_FILES)

test-saucelabs: npm-install-dev components
	@grunt test

npm-install-dev: package.json
	@npm install

######################################
# Servers
######################################
# server: npm-install-dev public
server: public-quick
	@serve public
	@echo go to http://localhost:3000

server-test test-browser: npm-install-dev components
	@serve
	@echo go to http://localhost:3000/test

######################################
# Build
######################################

############## public ################
public: build $(PUBLIC_ALL)
public-quick: build-quick $(PUBLIC_ALL)

$(PUBLIC_COMPILED_MIN): $(BUILD_COMPILED_MIN)
	@cp -f $< $@

$(PUBLIC_COMPILED): $(BUILD_COMPILED)
	@cp -f $< $@

$(PUBLIC_COMPILED_CSS): $(BUILD_COMPILED_CSS)
	@cp -f $< $@

############## build ################
# build: templates components npm-install-dev $(BUILD_COMPILED_MIN)
# BUILD_DEPS = templates $(BUILD_COMPILED_MIN) $(BUILD_COMPILED_STANDALONE)
# BUILD_DEPS = $(BUILD_COMPILED_MIN)
BUILD_DEPS = templates $(BUILD_COMPILED_MIN)
build: clean components npm-install-dev $(BUILD_DEPS)
build-quick: clean-build $(BUILD_DEPS)

# @./node_modules/.bin/uglifyjs < $^ > $@
$(BUILD_COMPILED_MIN): $(BUILD_COMPILED)
	@./node_modules/uglify-js/bin/uglifyjs < $^ > $@

$(BUILD_COMPILED) $(BUILD_COMPILED_CSS):
	$(COMPONENTJS_CMD) $(MOD_NAME)

$(BUILD_COMPILED_STANDALONE):
	$(COMPONENTJS_CMD) --standalone $(MOD_NAME)

############## templates ################
templates:
	@for tmpl in $(wildcard $(TMPL_DIR)/*.tmpl); do \
		$(TMPL_CONVERT_CMD) $$tmpl > $$tmpl.js; \
	done
############## packages ################
components: component.json
	@component install --dev

######################################
# Docs
# run grunt readme
######################################
readme: readme-footer
	@grunt readme-concat

readme-footer:
	@[ -d $(DOCS_TMPL_DIR) ] || mkdir $(DOCS_TMPL_DIR)
	@make test-node REPORTER=markdown \
		| tail -n +2 \
		| head -n -2 \
		| sed 's/\# /\#\#\# /g' \
		| sed 's/TOC/API/g' \
		| sed 's/^d3-barchart\./#\#\#\#\# d3-barchart\./g' \
		| cat > $(DOCS_TMPL_DIR)/$(MOCHA_MD_DOCS)
	@echo '' >> $(DOCS_TMPL_DIR)/$(MOCHA_MD_DOCS)
	@echo '## License' >> $(DOCS_TMPL_DIR)/$(MOCHA_MD_DOCS)


######################################
# Housekeeping
######################################
size: build
	@echo "$(BUILD_COMPILED): `wc -c $(BUILD_COMPILED) | sed 's/ .*//'`"
	@echo "$(BUILD_COMPILED_MIN): `gzip -c $(BUILD_COMPILED_MIN) | wc -c`"

clean: clean-readme clean-build
	@rm -f *.log*
	@rm -rf components

clean-build:
	@rm -rf build $(PUBLIC_DIR)/build.* $(TMPL_DIR)/*.js

clean-readme:
	@find $(DOCS_TMPL_DIR) -maxdepth 1 -type f ! -iname '*.tmpl' -delete

.PHONY: readme clean clean-* npm-install-dev release test test-* size server *-quick