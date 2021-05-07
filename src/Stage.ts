import { Util } from './Util';
import { Factory } from './Factory';
import { Container, ContainerConfig } from './Container';
import { Konva } from './Global';
import { SceneCanvas, HitCanvas } from './Canvas';
import { GetSet, Vector2d } from './types';
import { Shape } from './Shape';
import { Layer } from './Layer';
import { DD } from './DragAndDrop';
import { _registerNode } from './Global';
import * as PointerEvents from './PointerEvents';

export interface StageConfig extends ContainerConfig {
  container: HTMLDivElement | string;
}

// CONSTANTS
var STAGE = 'Stage',
  STRING = 'string',
  PX = 'px',
  MOUSEOUT = 'mouseout',
  MOUSELEAVE = 'mouseleave',
  MOUSEOVER = 'mouseover',
  MOUSEENTER = 'mouseenter',
  MOUSEMOVE = 'mousemove',
  MOUSEDOWN = 'mousedown',
  MOUSEUP = 'mouseup',
  // TODO: add them into "on" method docs and into site docs
  POINTERMOVE = 'pointermove',
  POINTERDOWN = 'pointerdown',
  POINTERUP = 'pointerup',
  POINTERCANCEL = 'pointercancel',
  LOSTPOINTERCAPTURE = 'lostpointercapture',
  CONTEXTMENU = 'contextmenu',
  CLICK = 'click',
  DBL_CLICK = 'dblclick',
  TOUCHSTART = 'touchstart',
  TOUCHEND = 'touchend',
  TAP = 'tap',
  DBL_TAP = 'dbltap',
  TOUCHMOVE = 'touchmove',
  TOUCHCANCEL = 'touchcancel',
  WHEEL = 'wheel',
  CONTENT_MOUSEOUT = 'contentMouseout',
  CONTENT_MOUSEOVER = 'contentMouseover',
  CONTENT_MOUSEMOVE = 'contentMousemove',
  CONTENT_MOUSEDOWN = 'contentMousedown',
  CONTENT_MOUSEUP = 'contentMouseup',
  CONTENT_CONTEXTMENU = 'contentContextmenu',
  CONTENT_CLICK = 'contentClick',
  CONTENT_DBL_CLICK = 'contentDblclick',
  CONTENT_TOUCHSTART = 'contentTouchstart',
  CONTENT_TOUCHEND = 'contentTouchend',
  CONTENT_DBL_TAP = 'contentDbltap',
  CONTENT_TAP = 'contentTap',
  CONTENT_TOUCHMOVE = 'contentTouchmove',
  CONTENT_WHEEL = 'contentWheel',
  RELATIVE = 'relative',
  KONVA_CONTENT = 'konvajs-content',
  UNDERSCORE = '_',
  CONTAINER = 'container',
  MAX_LAYERS_NUMBER = 5,
  EMPTY_STRING = '',
  EVENTS = [
    [MOUSEENTER, '_pointerenter'],
    [MOUSEDOWN, '_pointerdown'],
    [MOUSEMOVE, '_pointermove'],
    [MOUSEUP, '_pointerup'],
    [MOUSELEAVE, '_pointerleave'],
    [TOUCHSTART, '_pointerdown'],
    [TOUCHMOVE, '_pointermove'],
    [TOUCHEND, '_pointerup'],
    [TOUCHCANCEL, '_pointercancel'],
    [MOUSEOVER, '_pointerover'],
    [WHEEL, '_wheel'],
    [CONTEXTMENU, '_contextmenu'],
    [POINTERDOWN, '_pointerdown'],
    [POINTERMOVE, '_pointermove'],
    [POINTERUP, '_pointerup'],
    [POINTERCANCEL, '_pointercancel'],
    [LOSTPOINTERCAPTURE, '_lostpointercapture'],
  ];

const NO_POINTERS_MESSAGE = `Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);`;

export const stages: Stage[] = [];

const EVENTS_MAP = {
  mouse: {
    pointerout: 'mouseout',
    pointerleave: 'mouseleave',
    pointerover: 'mouseover',
    pointerenter: 'mouseenter',
    pointermove: 'mousemove',
    pointerdown: 'mousedown',
    pointerup: 'mouseup',
    pointercancel: 'mousecancel',
    pointerclick: 'click',
    pointerdblclick: 'dblclick',
  },
  touch: {
    pointerout: 'touchout',
    pointerleave: 'touchleave',
    pointerover: 'touchover',
    pointerenter: 'touchenter',
    pointermove: 'touchmove',
    pointerdown: 'touchstart',
    pointerup: 'touchend',
    pointerclick: 'tap',
    pointerdblclick: 'dbltap',
  },
  pointer: {
    pointerout: 'pointerout',
    pointerleave: 'pointerleave',
    pointerover: 'pointerover',
    pointerenter: 'pointerenter',
    pointermove: 'pointermove',
    pointerdown: 'pointerdown',
    pointerup: 'pointerup',
    pointerclick: 'pointerclick',
    pointerdblclick: 'pointerdblclick',
  },
};

const getEventType = (type) => {
  if (type.indexOf('pointer') >= 0) {
    return 'pointer';
  }
  if (type.indexOf('touch') >= 0) {
    return 'touch';
  }
  return 'mouse';
};

const getEventsMap = (eventType: string) => {
  const type = getEventType(eventType);
  if (type === 'pointer') {
    return Konva.pointerEventsEnabled && EVENTS_MAP.pointer;
  }
  if (type === 'touch') {
    return EVENTS_MAP.touch;
  }
  if (type === 'mouse') {
    return EVENTS_MAP.mouse;
  }
};

function checkNoClip(attrs: any = {}) {
  if (attrs.clipFunc || attrs.clipWidth || attrs.clipHeight) {
    Util.warn(
      'Stage does not support clipping. Please use clip for Layers or Groups.'
    );
  }
  return attrs;
}

/**
 * Stage constructor.  A stage is used to contain multiple layers
 * @constructor
 * @memberof Konva
 * @augments Konva.Container
 * @param {Object} config
 * @param {String|Element} config.container Container selector or DOM element
 * @@nodeParams
 * @example
 * var stage = new Konva.Stage({
 *   width: 500,
 *   height: 800,
 *   container: 'containerId' // or "#containerId" or ".containerClass"
 * });
 */

export class Stage extends Container<Layer> {
  content: HTMLDivElement;
  pointerPos: Vector2d | null;
  _pointerPositions: (Vector2d & { id?: number })[] = [];
  _changedPointerPositions: (Vector2d & { id: number })[] = [];

  bufferCanvas: SceneCanvas;
  bufferHitCanvas: HitCanvas;
  _mouseTargetShape: Shape;
  _touchTargetShape: Shape;
  _pointerTargetShape: Shape;
  _mouseClickStartShape: Shape;
  _touchClickStartShape: Shape;
  _pointerClickStartShape: Shape;
  _mouseClickEndShape: Shape;
  _touchClickEndShape: Shape;
  _pointerClickEndShape: Shape;

  _mouseDblTimeout: any;
  _touchDblTimeout: any;
  _pointerDblTimeout: any;

  constructor(config: StageConfig) {
    super(checkNoClip(config));
    this._buildDOM();
    this._bindContentEvents();
    stages.push(this);
    this.on('widthChange.konva heightChange.konva', this._resizeDOM);
    this.on('visibleChange.konva', this._checkVisibility);
    this.on(
      'clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva',
      () => {
        checkNoClip(this.attrs);
      }
    );
    this._checkVisibility();
  }

  _validateAdd(child) {
    const isLayer = child.getType() === 'Layer';
    const isFastLayer = child.getType() === 'FastLayer';
    const valid = isLayer || isFastLayer;
    if (!valid) {
      Util.throw('You may only add layers to the stage.');
    }
  }

  _checkVisibility() {
    if (!this.content) {
      return;
    }
    const style = this.visible() ? '' : 'none';
    this.content.style.display = style;
  }
  /**
   * set container dom element which contains the stage wrapper div element
   * @method
   * @name Konva.Stage#setContainer
   * @param {DomElement} container can pass in a dom element or id string
   */
  setContainer(container) {
    if (typeof container === STRING) {
      if (container.charAt(0) === '.') {
        var className = container.slice(1);
        container = document.getElementsByClassName(className)[0];
      } else {
        var id;
        if (container.charAt(0) !== '#') {
          id = container;
        } else {
          id = container.slice(1);
        }
        container = document.getElementById(id);
      }
      if (!container) {
        throw 'Can not find container in document with id ' + id;
      }
    }
    this._setAttr(CONTAINER, container);
    if (this.content) {
      if (this.content.parentElement) {
        this.content.parentElement.removeChild(this.content);
      }
      container.appendChild(this.content);
    }
    return this;
  }
  shouldDrawHit() {
    return true;
  }

  /**
   * clear all layers
   * @method
   * @name Konva.Stage#clear
   */
  clear() {
    var layers = this.children,
      len = layers.length,
      n;

    for (n = 0; n < len; n++) {
      layers[n].clear();
    }
    return this;
  }
  clone(obj?) {
    if (!obj) {
      obj = {};
    }
    obj.container =
      typeof document !== 'undefined' && document.createElement('div');
    return Container.prototype.clone.call(this, obj);
  }

  destroy() {
    super.destroy();

    var content = this.content;
    if (content && Util._isInDocument(content)) {
      this.container().removeChild(content);
    }
    var index = stages.indexOf(this);
    if (index > -1) {
      stages.splice(index, 1);
    }
    return this;
  }
  /**
   * returns absolute pointer position which can be a touch position or mouse position
   * pointer position doesn't include any transforms (such as scale) of the stage
   * it is just a plain position of pointer relative to top-left corner of the stage container
   * @method
   * @name Konva.Stage#getPointerPosition
   * @returns {Vector2d|null}
   */
  getPointerPosition(): Vector2d | null {
    const pos = this._pointerPositions[0] || this._changedPointerPositions[0];
    if (!pos) {
      Util.warn(NO_POINTERS_MESSAGE);
      return null;
    }
    return {
      x: pos.x,
      y: pos.y,
    };
  }
  _getPointerById(id?: number) {
    return this._pointerPositions.find((p) => p.id === id);
  }
  getPointersPositions() {
    return this._pointerPositions;
  }
  getStage() {
    return this;
  }
  getContent() {
    return this.content;
  }
  _toKonvaCanvas(config) {
    config = config || {};

    config.x = config.x || 0;
    config.y = config.y || 0;
    config.width = config.width || this.width();
    config.height = config.height || this.height();

    var canvas = new SceneCanvas({
      width: config.width,
      height: config.height,
      pixelRatio: config.pixelRatio || 1,
    });
    var _context = canvas.getContext()._context;
    var layers = this.children;

    if (config.x || config.y) {
      _context.translate(-1 * config.x, -1 * config.y);
    }

    layers.forEach(function (layer) {
      if (!layer.isVisible()) {
        return;
      }
      var layerCanvas = layer._toKonvaCanvas(config);
      _context.drawImage(
        layerCanvas._canvas,
        config.x,
        config.y,
        layerCanvas.getWidth() / layerCanvas.getPixelRatio(),
        layerCanvas.getHeight() / layerCanvas.getPixelRatio()
      );
    });
    return canvas;
  }

  /**
   * get visible intersection shape. This is the preferred
   *  method for determining if a point intersects a shape or not
   * @method
   * @name Konva.Stage#getIntersection
   * @param {Object} pos
   * @param {Number} pos.x
   * @param {Number} pos.y
   * @returns {Konva.Node}
   * @example
   * var shape = stage.getIntersection({x: 50, y: 50});
   */
  getIntersection(pos: Vector2d) {
    if (!pos) {
      return null;
    }
    var layers = this.children,
      len = layers.length,
      end = len - 1,
      n;

    for (n = end; n >= 0; n--) {
      const shape = layers[n].getIntersection(pos);
      if (shape) {
        return shape;
      }
    }

    return null;
  }
  _resizeDOM() {
    var width = this.width();
    var height = this.height();
    if (this.content) {
      // set content dimensions
      this.content.style.width = width + PX;
      this.content.style.height = height + PX;
    }

    this.bufferCanvas.setSize(width, height);
    this.bufferHitCanvas.setSize(width, height);

    // set layer dimensions
    this.children.forEach((layer) => {
      layer.setSize({ width, height });
      layer.draw();
    });
  }
  add(layer: Layer, ...rest) {
    if (arguments.length > 1) {
      for (var i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
      }
      return this;
    }
    super.add(layer);

    var length = this.children.length;
    if (length > MAX_LAYERS_NUMBER) {
      Util.warn(
        'The stage has ' +
          length +
          ' layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group.'
      );
    }
    layer.setSize({ width: this.width(), height: this.height() });

    // draw layer and append canvas to container
    layer.draw();

    if (Konva.isBrowser) {
      this.content.appendChild(layer.canvas._canvas);
    }

    // chainable
    return this;
  }
  getParent() {
    return null;
  }
  getLayer() {
    return null;
  }

  hasPointerCapture(pointerId: number): boolean {
    return PointerEvents.hasPointerCapture(pointerId, this);
  }

  setPointerCapture(pointerId: number) {
    PointerEvents.setPointerCapture(pointerId, this);
  }

  releaseCapture(pointerId: number) {
    PointerEvents.releaseCapture(pointerId, this);
  }

  /**
   * returns an array of layers
   * @method
   * @name Konva.Stage#getLayers
   */
  getLayers() {
    return this.children;
  }
  _bindContentEvents() {
    if (!Konva.isBrowser) {
      return;
    }
    EVENTS.forEach(([event, methodName]) => {
      this.content.addEventListener(event, (evt) => {
        this[methodName](evt);
      });
    });
  }
  _pointerenter(evt) {
    this.setPointersPositions(evt);
    const events = getEventsMap(evt.type);
    this._fire(events.pointerenter, {
      evt: evt,
      target: this,
      currentTarget: this,
    });
  }
  _pointerover(evt) {
    this.setPointersPositions(evt);
    const events = getEventsMap(evt.type);
    this._fire(events.pointerover, {
      evt: evt,
      target: this,
      currentTarget: this,
    });
  }
  _getTargetShape(evenType) {
    let shape: Shape | null = this[evenType + 'targetShape'];
    if (shape && !shape.getStage()) {
      shape = null;
    }
    return shape;
  }
  _pointerleave(evt) {
    const events = getEventsMap(evt.type);
    const eventType = getEventType(evt.type);

    if (!events) {
      return;
    }
    this.setPointersPositions(evt);

    var targetShape = this._getTargetShape(eventType);
    var eventsEnabled = !DD.isDragging || Konva.hitOnDragEnabled;
    if (targetShape && eventsEnabled) {
      targetShape._fireAndBubble(events.pointerout, { evt: evt });
      targetShape._fireAndBubble(events.pointerleave, { evt: evt });
      this._fire(events.pointerleave, {
        evt: evt,
        target: this,
        currentTarget: this,
      });
      this[eventType + 'targetShape'] = null;
    } else if (eventsEnabled) {
      this._fire(events.pointerleave, {
        evt: evt,
        target: this,
        currentTarget: this,
      });
      this._fire(events.pointerout, {
        evt: evt,
        target: this,
        currentTarget: this,
      });
    }
    this.pointerPos = undefined;
    this._pointerPositions = [];
  }
  _pointerdown(evt: TouchEvent | MouseEvent | PointerEvent) {
    const events = getEventsMap(evt.type);
    const eventType = getEventType(evt.type);

    if (!events) {
      return;
    }
    this.setPointersPositions(evt);

    var triggeredOnShape = false;
    this._changedPointerPositions.forEach((pos) => {
      var shape = this.getIntersection(pos);
      DD.justDragged = false;
      // probably we are staring a click
      Konva.listenClickTap = true;

      // no shape detected? do nothing
      const hasShape = shape && shape.isListening();
      if (!hasShape) {
        return;
      }

      if (Konva.capturePointerEventsEnabled) {
        shape.setPointerCapture(pos.id);
      }

      // save where we started the click
      this[eventType + 'ClickStartShape'] = shape;

      shape._fireAndBubble(events.pointerdown, {
        evt: evt,
        pointerId: pos.id,
      });
      triggeredOnShape = true;

      // TODO: test in iframe
      // only call preventDefault if the shape is listening for events
      const isTouch = evt.type.indexOf('touch') >= 0;
      if (shape.preventDefault() && evt.cancelable && isTouch) {
        evt.preventDefault();
      }
    });

    // trigger down on stage if not already
    if (!triggeredOnShape) {
      this._fire(events.pointerdown, {
        evt: evt,
        target: this,
        currentTarget: this,
        pointerId: this._pointerPositions[0].id,
      });
    }
  }
  _pointermove(evt: TouchEvent | MouseEvent | PointerEvent) {
    const events = getEventsMap(evt.type);
    const eventType = getEventType(evt.type);
    if (!events) {
      return;
    }
    if (DD.isDragging && DD.node.preventDefault() && evt.cancelable) {
      evt.preventDefault();
    }
    this.setPointersPositions(evt);

    var eventsEnabled = !DD.isDragging || Konva.hitOnDragEnabled;
    if (!eventsEnabled) {
      return;
    }

    var processedShapesIds = {};
    let triggeredOnShape = false;
    var targetShape = this._getTargetShape(eventType);
    this._changedPointerPositions.forEach((pos) => {
      const shape = (PointerEvents.getCapturedShape(pos.id) ||
        this.getIntersection(pos)) as Shape;
      const pointerId = pos.id;
      const event = { evt: evt, pointerId };

      var differentTarget = targetShape !== shape;

      if (differentTarget && targetShape) {
        targetShape._fireAndBubble(events.pointerout, event, shape);
        targetShape._fireAndBubble(events.pointerleave, event, shape);
      }

      if (shape) {
        if (processedShapesIds[shape._id]) {
          return;
        }
        processedShapesIds[shape._id] = true;
      }

      if (shape && shape.isListening()) {
        triggeredOnShape = true;
        if (differentTarget) {
          shape._fireAndBubble(events.pointerover, event, targetShape);
          shape._fireAndBubble(events.pointerenter, event, targetShape);
          this[eventType + 'targetShape'] = shape;
        }
        shape._fireAndBubble(events.pointermove, event);
      } else {
        if (targetShape) {
          this._fire(events.pointerover, {
            evt: evt,
            target: this,
            currentTarget: this,
            pointerId,
          });
          this[eventType + 'targetShape'] = null;
        }
      }
    });

    if (!triggeredOnShape) {
      this._fire(events.pointermove, {
        evt: evt,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id,
      });
    }

    // content event
    this._fire(CONTENT_MOUSEMOVE, { evt: evt });
  }
  _pointerup(evt) {
    const events = getEventsMap(evt.type);
    const eventType = getEventType(evt.type);

    if (!events) {
      return;
    }
    this.setPointersPositions(evt);
    const clickStartShape = this[eventType + 'ClickStartShape'];
    const clickEndShape = this[eventType + 'ClickEndShape'];
    var processedShapesIds = {};
    let triggeredOnShape = false;
    this._changedPointerPositions.forEach((pos) => {
      const shape = (PointerEvents.getCapturedShape(pos.id) ||
        this.getIntersection(pos)) as Shape;

      if (shape) {
        shape.releaseCapture(pos.id);
        if (processedShapesIds[shape._id]) {
          return;
        }
        processedShapesIds[shape._id] = true;
      }

      const pointerId = pos.id;
      const event = { evt: evt, pointerId };

      let fireDblClick = false;
      if (Konva.inDblClickWindow) {
        fireDblClick = true;
        clearTimeout(this[eventType + 'DblTimeout']);
      } else if (!DD.justDragged) {
        // don't set inDblClickWindow after dragging
        Konva.inDblClickWindow = true;
        clearTimeout(this[eventType + 'DblTimeout']);
      }

      this[eventType + 'DblTimeout'] = setTimeout(function () {
        Konva.inDblClickWindow = false;
      }, Konva.dblClickWindow);

      if (shape && shape.isListening()) {
        triggeredOnShape = true;
        this[eventType + 'ClickEndShape'] = shape;
        shape._fireAndBubble(events.pointerup, event);

        // detect if click or double click occurred
        if (
          Konva.listenClickTap &&
          clickStartShape &&
          clickStartShape === shape
        ) {
          shape._fireAndBubble(events.pointerclick, event);

          if (fireDblClick && clickEndShape && clickEndShape === shape) {
            shape._fireAndBubble(events.pointerdblclick, event);
          }
        }
      } else {
        this[eventType + 'ClickEndShape'] = null;

        if (Konva.listenClickTap) {
          this._fire(events.pointerclick, {
            evt: evt,
            target: this,
            currentTarget: this,
            pointerId,
          });
        }

        if (fireDblClick) {
          this._fire(events.pointerdblclick, {
            evt: evt,
            target: this,
            currentTarget: this,
            pointerId,
          });
        }
      }
    });

    if (!triggeredOnShape) {
      this._fire(events.pointerup, {
        evt: evt,
        target: this,
        currentTarget: this,
        pointerId: this._changedPointerPositions[0].id,
      });
    }

    Konva.listenClickTap = false;

    // always call preventDefault for desktop events because some browsers
    // try to drag and drop the canvas element
    if (evt.cancelable) {
      evt.preventDefault();
    }
  }
  _contextmenu(evt) {
    this.setPointersPositions(evt);
    var shape = this.getIntersection(this.getPointerPosition());

    if (shape && shape.isListening()) {
      shape._fireAndBubble(CONTEXTMENU, { evt: evt });
    } else {
      this._fire(CONTEXTMENU, {
        evt: evt,
        target: this,
        currentTarget: this,
      });
    }
  }

  _wheel(evt) {
    this.setPointersPositions(evt);
    var shape = this.getIntersection(this.getPointerPosition());

    if (shape && shape.isListening()) {
      shape._fireAndBubble(WHEEL, { evt: evt });
    } else {
      this._fire(WHEEL, {
        evt: evt,
        target: this,
        currentTarget: this,
      });
    }
  }

  _pointercancel(evt: PointerEvent) {
    this.setPointersPositions(evt);
    const shape =
      PointerEvents.getCapturedShape(evt.pointerId) ||
      this.getIntersection(this.getPointerPosition());

    if (shape) {
      shape._fireAndBubble(POINTERUP, PointerEvents.createEvent(evt));
    }

    PointerEvents.releaseCapture(evt.pointerId);
  }

  _lostpointercapture(evt: PointerEvent) {
    PointerEvents.releaseCapture(evt.pointerId);
  }

  /**
   * manually register pointers positions (mouse/touch) in the stage.
   * So you can use stage.getPointerPosition(). Usually you don't need to use that method
   * because all internal events are automatically registered. It may be useful if event
   * is triggered outside of the stage, but you still want to use Konva methods to get pointers position.
   * @method
   * @name Konva.Stage#setPointersPositions
   * @param {Object} event Event object
   * @example
   *
   * window.addEventListener('mousemove', (e) => {
   *   stage.setPointersPositions(e);
   * });
   */
  setPointersPositions(evt) {
    var contentPosition = this._getContentPosition(),
      x = null,
      y = null;
    evt = evt ? evt : window.event;

    // touch events
    if (evt.touches !== undefined) {
      // touchlist has not support for map method
      // so we have to iterate
      this._pointerPositions = [];
      this._changedPointerPositions = [];
      Array.prototype.forEach.call(evt.touches, (touch: any) => {
        this._pointerPositions.push({
          id: touch.identifier,
          x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
          y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
        });
      });

      Array.prototype.forEach.call(
        evt.changedTouches || evt.touches,
        (touch: any) => {
          this._changedPointerPositions.push({
            id: touch.identifier,
            x: (touch.clientX - contentPosition.left) / contentPosition.scaleX,
            y: (touch.clientY - contentPosition.top) / contentPosition.scaleY,
          });
        }
      );
    } else {
      // mouse events
      x = (evt.clientX - contentPosition.left) / contentPosition.scaleX;
      y = (evt.clientY - contentPosition.top) / contentPosition.scaleY;
      this.pointerPos = {
        x: x,
        y: y,
      };
      this._pointerPositions = [{ x, y, id: Util._getFirstPointerId(evt) }];
      this._changedPointerPositions = [
        { x, y, id: Util._getFirstPointerId(evt) },
      ];
    }
  }
  _setPointerPosition(evt) {
    Util.warn(
      'Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.'
    );
    this.setPointersPositions(evt);
  }
  _getContentPosition() {
    if (!this.content || !this.content.getBoundingClientRect) {
      return {
        top: 0,
        left: 0,
        scaleX: 1,
        scaleY: 1,
      };
    }

    var rect = this.content.getBoundingClientRect();

    return {
      top: rect.top,
      left: rect.left,
      // sometimes clientWidth can be equals to 0
      // i saw it in react-konva test, looks like it is because of hidden testing element
      scaleX: rect.width / this.content.clientWidth || 1,
      scaleY: rect.height / this.content.clientHeight || 1,
    };
  }
  _buildDOM() {
    this.bufferCanvas = new SceneCanvas({
      width: this.width(),
      height: this.height(),
    });
    this.bufferHitCanvas = new HitCanvas({
      pixelRatio: 1,
      width: this.width(),
      height: this.height(),
    });

    if (!Konva.isBrowser) {
      return;
    }
    var container = this.container();
    if (!container) {
      throw 'Stage has no container. A container is required.';
    }
    // clear content inside container
    container.innerHTML = EMPTY_STRING;

    // content
    this.content = document.createElement('div');
    this.content.style.position = RELATIVE;
    this.content.style.userSelect = 'none';
    this.content.className = KONVA_CONTENT;

    this.content.setAttribute('role', 'presentation');

    container.appendChild(this.content);

    this._resizeDOM();
  }
  // currently cache function is now working for stage, because stage has no its own canvas element
  cache() {
    Util.warn(
      'Cache function is not allowed for stage. You may use cache only for layers, groups and shapes.'
    );
    return this;
  }
  clearCache() {
    return this;
  }
  /**
   * batch draw
   * @method
   * @name Konva.Stage#batchDraw
   * @return {Konva.Stage} this
   */
  batchDraw() {
    this.getChildren().forEach(function (layer) {
      layer.batchDraw();
    });
    return this;
  }

  container: GetSet<HTMLDivElement, this>;
}

Stage.prototype.nodeType = STAGE;
_registerNode(Stage);

/**
 * get/set container DOM element
 * @method
 * @name Konva.Stage#container
 * @returns {DomElement} container
 * @example
 * // get container
 * var container = stage.container();
 * // set container
 * var container = document.createElement('div');
 * body.appendChild(container);
 * stage.container(container);
 */
Factory.addGetterSetter(Stage, 'container');
