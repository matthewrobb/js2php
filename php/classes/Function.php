<?php
class Func extends Object {
  public $name = "";
  public $className = "[object Function]";

  /**
   * Instantiate is an optional method that can be specified if calling `new` on
   * this function should instantiate a different `this` than `new Object()`
   * @var callable
   */
  public $instantiate = null;
  public $bound = null;
  public $boundArgs = null;

  static $protoObject = null;
  static $classMethods = null;
  static $callStack = array();

  function __construct() {
    parent::__construct();
    $this->proto = self::$protoObject;
    $args = func_get_args();
    if (gettype($args[0]) === 'string') {
      $this->name = array_shift($args);
    }
    $this->fn = array_shift($args);
    $this->meta = (count($args) === 1) ? $args[0] : array();
    $prototype = new Object('constructor', $this);
    $this->set('prototype', $prototype);
  }

  function construct() {
    if ($this->instantiate !== null) {
      $instantiate = $this->instantiate;
      $obj = $instantiate();
    } else {
      $obj = new Object();
      $obj->proto = $this->get('prototype');
    }
    $result = $this->apply($obj, func_get_args());
    return is_primitive($result) ? $obj : $result;
  }

  function call($context = null) {
    $args = array_slice(func_get_args(), 1);
    return $this->apply($context, $args);
  }

  function apply($context, $args) {
    if ($this->bound !== null) {
      $context = $this->bound;
    }
    if ($context === null || $context === Null::$null) {
      $context = Object::$global;
    } else
    //primitives (boolean, number, string) should be wrapped in object
    if (!($context instanceof Object)) {
      $context = objectify($context);
    }
    if ($this->boundArgs) {
      $args = array_merge($this->boundArgs, $args);
    }
    $arguments = self::makeArgs($args, $this);
    array_unshift($args, $arguments);
    array_unshift($args, $context);
    self::$callStack[] = $this;
    $result = call_user_func_array($this->fn, $args);
    array_pop(self::$callStack);
    return $result;
  }

  function get_name() {
    return $this->name;
  }

  function set_name($value) {
    return $value;
  }

  function get_length() {
    $r = new ReflectionObject($this->fn);
    $m = $r->getMethod('__invoke');
    $arity = $m->getNumberOfParameters();
    $arity = ($arity <= 2) ? 0 : $arity - 2;
    if ($this->boundArgs) {
      $bound = count($this->boundArgs);
      $arity = ($bound >= $arity) ? 0 : $arity - $bound;
    }
    return (float)$arity;
  }

  function set_length($value) {
    return $value;
  }

  static function initProtoObject() {
    $methods = array(
      'bind' => function($this_, $arguments, $context) {
          $fn = new Func($this_->name, $this_->fn, $this_->meta);
          $fn->bound = $context;
          $args = func_get_args();
          if (count($args) > 3) {
            $fn->boundArgs = array_slice($args, 3);
          }
          return $fn;
        },
      'call' => function($this_, $arguments) {
          $args = $arguments->args;
          $context = array_shift($args);
          return $this_->apply($context, $args);
        },
      'apply' => function($this_, $arguments, $context, $args) {
          //convert Arr object to native array()
          $args = $args->toArray();
          return $this_->apply($context, $args);
        },
      'toString' => function($this_) {
          if ($GLOBALS['source_'] && $this_->source_id) {
            $meta = $this_->meta;
            $source = $GLOBALS['source_'][$meta->id];
            return substr($source, $meta->start, $meta->end - $meta->start + 1);
          }
          return 'function ' . $this_->name . '() { [native code] }';
        }
    );
    self::$protoObject = new Object();
    self::$protoObject->setMethods($methods, true, false, true);
  }

  static function makeArgs($args, $callee) {
    $obj = new Object();
    $obj->args = $args;
    $obj->callee = $callee;
    $len = count($args);
    for ($i = 0; $i < $len; $i++) {
      $obj->set($i, $args[$i]);
    }
    $obj->set('length', (float)$len);
    $obj->data->callee = new Property($callee, true, false, true);
    return $obj;
  }
}

Object::initProtoMethods();

Func::$classMethods = array(
);

Func::initProtoObject();
