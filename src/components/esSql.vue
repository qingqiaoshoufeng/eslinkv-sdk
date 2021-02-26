<template>
  <div class="sql-editor">
    <textarea ref="textarea" :placeholder="placeholder" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/display/placeholder';
import 'codemirror/theme/eclipse.css';
import { sqlKeys } from './sqlKeys';

export default {
  name: 'sql-editor',
  props: {
    value: String,
    // 是否只读，默认否
    readOnly: {
      type: Boolean,
      default: false
    },
    placeholder: String
  },
  data () {
    return {
      sqlEditor: null,
      options: {
        tabSize: 2,
        lineNumbers: true,
        line: true,
        mode: { name: 'text/x-mysql' },
        theme: 'eclipse',
        styleActiveLine: true,
        lineWrapping:'wrap',
        smartIndent: true,
        hintOptions: {
          completeSingle: false
        }
      }
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.initSqlEditor();
      this.sqlEditor.setOption('readOnly', this.readOnly);
    });
  },
  methods: {
    initSqlEditor () {
      const options = {
        ...this.options
      };
      this.sqlEditor = CodeMirror.fromTextArea(this.$refs['textarea'], options);
      this.sqlEditor.setValue(this.value);
      this.sqlEditor.on('inputRead', () => {
        this.sqlEditor.showHint();
      });
      this.sqlEditor.on('focus', () => {
        this.$emit('focus');
      });
      this.sqlEditor.on('change', (cm) => {
        this.$emit('changed', cm.getValue());
        this.$emit('input', cm.getValue());
      });
      this.sqlEditor.on('blur', (cm) => {
        this.$emit('blur', cm.getValue());
      });
      sqlKeys.forEach((words) => {
        CodeMirror.resolveMode('text/x-mysql').keywords[words] = true;
      });
    },
    changeWidth(data){
      document.querySelector('.CodeMirror-scroll').style.width=data
    }
  },
  watch: {
    value: {
      handler (value) {
        const sqlValue = this.sqlEditor.getValue();
        if (value !== sqlValue) {
          this.sqlEditor.setValue(value);
        }
      }
    }
  }
};
</script>
<style>
  .CodeMirror-hints {
    z-index: 9999;
  }
  .CodeMirror-code {
    font-family: Fira code, monospace;
  }
</style>
