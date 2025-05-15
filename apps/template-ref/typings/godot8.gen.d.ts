// AUTO-GENERATED
/// <reference no-default-lib="true"/>
declare module "godot" {
    class WindowWrapper<Map extends Record<string, Node> = Record<string, Node>> extends MarginContainer<Map> {
        constructor(identifier?: any)
        readonly window_visibility_changed: Signal1<boolean>
        readonly window_close_requested: Signal0
        readonly window_size_changed: Signal0
    }
    /** A resource that holds all components of a 2D world, such as a canvas and a physics space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_world2d.html  
     */
    class World2D extends Resource {
        constructor(identifier?: any)
        /** The [RID] of this world's canvas resource. Used by the [RenderingServer] for 2D drawing. */
        get canvas(): RID
        
        /** The [RID] of this world's physics space resource. Used by the [PhysicsServer2D] for 2D physics, treating it as both a space and an area. */
        get space(): RID
        
        /** The [RID] of this world's navigation map. Used by the [NavigationServer2D]. */
        get navigation_map(): RID
        
        /** Direct access to the world's physics 2D space state. Used for querying current and potential collisions. When using multi-threaded physics, access is limited to [method Node._physics_process] in the main thread. */
        get direct_space_state(): PhysicsDirectSpaceState2D
    }
    /** A resource that holds all components of a 3D world, such as a visual scenario and a physics space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_world3d.html  
     */
    class World3D extends Resource {
        constructor(identifier?: any)
        /** The World3D's [Environment]. */
        get environment(): Environment
        set environment(value: Environment)
        
        /** The World3D's fallback environment will be used if [member environment] fails or is missing. */
        get fallback_environment(): Environment
        set fallback_environment(value: Environment)
        
        /** The default [CameraAttributes] resource to use if none set on the [Camera3D]. */
        get camera_attributes(): CameraAttributesPractical | CameraAttributesPhysical
        set camera_attributes(value: CameraAttributesPractical | CameraAttributesPhysical)
        
        /** The World3D's physics space. */
        get space(): RID
        
        /** The [RID] of this world's navigation map. Used by the [NavigationServer3D]. */
        get navigation_map(): RID
        
        /** The World3D's visual scenario. */
        get scenario(): RID
        
        /** Direct access to the world's physics 3D space state. Used for querying current and potential collisions. When using multi-threaded physics, access is limited to [method Node._physics_process] in the main thread. */
        get direct_space_state(): PhysicsDirectSpaceState3D
    }
    /** A 2D world boundary (half-plane) shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_worldboundaryshape2d.html  
     */
    class WorldBoundaryShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The line's normal, typically a unit vector. Its direction indicates the non-colliding half-plane. Can be of any length but zero. Defaults to [constant Vector2.UP]. */
        get normal(): Vector2
        set normal(value: Vector2)
        
        /** The distance from the origin to the line, expressed in terms of [member normal] (according to its direction and magnitude). Actual absolute distance from the origin to the line can be calculated as `abs(distance) / normal.length()`.  
         *  In the scalar equation of the line `ax + by = d`, this is `d`, while the `(a, b)` coordinates are represented by the [member normal] property.  
         */
        get distance(): float64
        set distance(value: float64)
    }
    /** A 3D world boundary (half-space) shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_worldboundaryshape3d.html  
     */
    class WorldBoundaryShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The [Plane] used by the [WorldBoundaryShape3D] for collision. */
        get plane(): Plane
        set plane(value: Plane)
    }
    /** Default environment properties for the entire scene (post-processing effects, lighting and background settings).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_worldenvironment.html  
     */
    class WorldEnvironment<Map extends Record<string, Node> = Record<string, Node>> extends Node<Map> {
        constructor(identifier?: any)
        /** The [Environment] resource used by this [WorldEnvironment], defining the default properties. */
        get environment(): Environment
        set environment(value: Environment)
        
        /** The default [CameraAttributes] resource to use if none set on the [Camera3D]. */
        get camera_attributes(): CameraAttributesPractical | CameraAttributesPhysical
        set camera_attributes(value: CameraAttributesPractical | CameraAttributesPhysical)
        
        /** The default [Compositor] resource to use if none set on the [Camera3D]. */
        get compositor(): Compositor
        set compositor(value: Compositor)
    }
    /** An X509 certificate (e.g. for TLS).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_x509certificate.html  
     */
    class X509Certificate extends Resource {
        constructor(identifier?: any)
        /** Saves a certificate to the given [param path] (should be a "*.crt" file). */
        save(path: string): GError
        
        /** Loads a certificate from [param path] ("*.crt" file). */
        load(path: string): GError
        
        /** Returns a string representation of the certificate, or an empty string if the certificate is invalid. */
        save_to_string(): string
        
        /** Loads a certificate from the given [param string]. */
        load_from_string(string_: string): GError
    }
    namespace XMLParser {
        enum NodeType {
            /** There's no node (no file or buffer opened). */
            NODE_NONE = 0,
            
            /** An element node type, also known as a tag, e.g. `<title>`. */
            NODE_ELEMENT = 1,
            
            /** An end of element node type, e.g. `</title>`. */
            NODE_ELEMENT_END = 2,
            
            /** A text node type, i.e. text that is not inside an element. This includes whitespace. */
            NODE_TEXT = 3,
            
            /** A comment node type, e.g. `<!--A comment-->`. */
            NODE_COMMENT = 4,
            
            /** A node type for CDATA (Character Data) sections, e.g. `<![CDATA[CDATA section]]>`. */
            NODE_CDATA = 5,
            
            /** An unknown node type. */
            NODE_UNKNOWN = 6,
        }
    }
    /** Provides a low-level interface for creating parsers for XML files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xmlparser.html  
     */
    class XMLParser extends RefCounted {
        constructor(identifier?: any)
        /** Parses the next node in the file. This method returns an error code. */
        read(): GError
        
        /** Returns the type of the current node. Compare with [enum NodeType] constants. */
        get_node_type(): XMLParser.NodeType
        
        /** Returns the name of a node. This method will raise an error if the currently parsed node is a text node.  
         *      
         *  **Note:** The content of a [constant NODE_CDATA] node and the comment string of a [constant NODE_COMMENT] node are also considered names.  
         */
        get_node_name(): string
        
        /** Returns the contents of a text node. This method will raise an error if the current parsed node is of any other type. */
        get_node_data(): string
        
        /** Returns the byte offset of the currently parsed node since the beginning of the file or buffer. This is usually equivalent to the number of characters before the read position. */
        get_node_offset(): int64
        
        /** Returns the number of attributes in the currently parsed element.  
         *      
         *  **Note:** If this method is used while the currently parsed node is not [constant NODE_ELEMENT] or [constant NODE_ELEMENT_END], this count will not be updated and will still reflect the last element.  
         */
        get_attribute_count(): int64
        
        /** Returns the name of an attribute of the currently parsed element, specified by the [param idx] index. */
        get_attribute_name(idx: int64): string
        
        /** Returns the value of an attribute of the currently parsed element, specified by the [param idx] index. */
        get_attribute_value(idx: int64): string
        
        /** Returns `true` if the currently parsed element has an attribute with the [param name]. */
        has_attribute(name: string): boolean
        
        /** Returns the value of an attribute of the currently parsed element, specified by its [param name]. This method will raise an error if the element has no such attribute. */
        get_named_attribute_value(name: string): string
        
        /** Returns the value of an attribute of the currently parsed element, specified by its [param name]. This method will return an empty string if the element has no such attribute. */
        get_named_attribute_value_safe(name: string): string
        
        /** Returns `true` if the currently parsed element is empty, e.g. `<element />`. */
        is_empty(): boolean
        
        /** Returns the current line in the parsed file, counting from 0. */
        get_current_line(): int64
        
        /** Skips the current section. If the currently parsed node contains more inner nodes, they will be ignored and the cursor will go to the closing of the current element. */
        skip_section(): void
        
        /** Moves the buffer cursor to a certain offset (since the beginning) and reads the next node there. This method returns an error code. */
        seek(position: int64): GError
        
        /** Opens an XML [param file] for parsing. This method returns an error code. */
        open(file: string): GError
        
        /** Opens an XML raw [param buffer] for parsing. This method returns an error code. */
        open_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): GError
    }
    /** An anchor point in AR space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xranchor3d.html  
     */
    class XRAnchor3D<Map extends Record<string, Node> = Record<string, Node>> extends XRNode3D<Map> {
        constructor(identifier?: any)
        /** Returns the estimated size of the plane that was detected. Say when the anchor relates to a table in the real world, this is the estimated size of the surface of that table. */
        get_size(): Vector3
        
        /** Returns a plane aligned with our anchor; handy for intersection testing. */
        get_plane(): Plane
    }
    namespace XRBodyModifier3D {
        enum BodyUpdate {
            /** The skeleton's upper body joints are updated. */
            BODY_UPDATE_UPPER_BODY = 1,
            
            /** The skeleton's lower body joints are updated. */
            BODY_UPDATE_LOWER_BODY = 2,
            
            /** The skeleton's hand joints are updated. */
            BODY_UPDATE_HANDS = 4,
        }
        enum BoneUpdate {
            /** The skeleton's bones are fully updated (both position and rotation) to match the tracked bones. */
            BONE_UPDATE_FULL = 0,
            
            /** The skeleton's bones are only rotated to align with the tracked bones, preserving bone length. */
            BONE_UPDATE_ROTATION_ONLY = 1,
            
            /** Represents the size of the [enum BoneUpdate] enum. */
            BONE_UPDATE_MAX = 2,
        }
    }
    /** A node for driving body meshes from [XRBodyTracker] data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrbodymodifier3d.html  
     */
    class XRBodyModifier3D<Map extends Record<string, Node> = Record<string, Node>> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** The name of the [XRBodyTracker] registered with [XRServer] to obtain the body tracking data from. */
        get body_tracker(): string
        set body_tracker(value: string)
        
        /** Specifies the body parts to update. */
        get body_update(): int64
        set body_update(value: int64)
        
        /** Specifies the type of updates to perform on the bones. */
        get bone_update(): int64
        set bone_update(value: int64)
    }
    namespace XRBodyTracker {
        enum BodyFlags {
            /** Upper body tracking supported. */
            BODY_FLAG_UPPER_BODY_SUPPORTED = 1,
            
            /** Lower body tracking supported. */
            BODY_FLAG_LOWER_BODY_SUPPORTED = 2,
            
            /** Hand tracking supported. */
            BODY_FLAG_HANDS_SUPPORTED = 4,
        }
        enum Joint {
            /** Root joint. */
            JOINT_ROOT = 0,
            
            /** Hips joint. */
            JOINT_HIPS = 1,
            
            /** Spine joint. */
            JOINT_SPINE = 2,
            
            /** Chest joint. */
            JOINT_CHEST = 3,
            
            /** Upper chest joint. */
            JOINT_UPPER_CHEST = 4,
            
            /** Neck joint. */
            JOINT_NECK = 5,
            
            /** Head joint. */
            JOINT_HEAD = 6,
            
            /** Head tip joint. */
            JOINT_HEAD_TIP = 7,
            
            /** Left shoulder joint. */
            JOINT_LEFT_SHOULDER = 8,
            
            /** Left upper arm joint. */
            JOINT_LEFT_UPPER_ARM = 9,
            
            /** Left lower arm joint. */
            JOINT_LEFT_LOWER_ARM = 10,
            
            /** Right shoulder joint. */
            JOINT_RIGHT_SHOULDER = 11,
            
            /** Right upper arm joint. */
            JOINT_RIGHT_UPPER_ARM = 12,
            
            /** Right lower arm joint. */
            JOINT_RIGHT_LOWER_ARM = 13,
            
            /** Left upper leg joint. */
            JOINT_LEFT_UPPER_LEG = 14,
            
            /** Left lower leg joint. */
            JOINT_LEFT_LOWER_LEG = 15,
            
            /** Left foot joint. */
            JOINT_LEFT_FOOT = 16,
            
            /** Left toes joint. */
            JOINT_LEFT_TOES = 17,
            
            /** Right upper leg joint. */
            JOINT_RIGHT_UPPER_LEG = 18,
            
            /** Right lower leg joint. */
            JOINT_RIGHT_LOWER_LEG = 19,
            
            /** Right foot joint. */
            JOINT_RIGHT_FOOT = 20,
            
            /** Right toes joint. */
            JOINT_RIGHT_TOES = 21,
            
            /** Left hand joint. */
            JOINT_LEFT_HAND = 22,
            
            /** Left palm joint. */
            JOINT_LEFT_PALM = 23,
            
            /** Left wrist joint. */
            JOINT_LEFT_WRIST = 24,
            
            /** Left thumb metacarpal joint. */
            JOINT_LEFT_THUMB_METACARPAL = 25,
            
            /** Left thumb phalanx proximal joint. */
            JOINT_LEFT_THUMB_PHALANX_PROXIMAL = 26,
            
            /** Left thumb phalanx distal joint. */
            JOINT_LEFT_THUMB_PHALANX_DISTAL = 27,
            
            /** Left thumb tip joint. */
            JOINT_LEFT_THUMB_TIP = 28,
            
            /** Left index finger metacarpal joint. */
            JOINT_LEFT_INDEX_FINGER_METACARPAL = 29,
            
            /** Left index finger phalanx proximal joint. */
            JOINT_LEFT_INDEX_FINGER_PHALANX_PROXIMAL = 30,
            
            /** Left index finger phalanx intermediate joint. */
            JOINT_LEFT_INDEX_FINGER_PHALANX_INTERMEDIATE = 31,
            
            /** Left index finger phalanx distal joint. */
            JOINT_LEFT_INDEX_FINGER_PHALANX_DISTAL = 32,
            
            /** Left index finger tip joint. */
            JOINT_LEFT_INDEX_FINGER_TIP = 33,
            
            /** Left middle finger metacarpal joint. */
            JOINT_LEFT_MIDDLE_FINGER_METACARPAL = 34,
            
            /** Left middle finger phalanx proximal joint. */
            JOINT_LEFT_MIDDLE_FINGER_PHALANX_PROXIMAL = 35,
            
            /** Left middle finger phalanx intermediate joint. */
            JOINT_LEFT_MIDDLE_FINGER_PHALANX_INTERMEDIATE = 36,
            
            /** Left middle finger phalanx distal joint. */
            JOINT_LEFT_MIDDLE_FINGER_PHALANX_DISTAL = 37,
            
            /** Left middle finger tip joint. */
            JOINT_LEFT_MIDDLE_FINGER_TIP = 38,
            
            /** Left ring finger metacarpal joint. */
            JOINT_LEFT_RING_FINGER_METACARPAL = 39,
            
            /** Left ring finger phalanx proximal joint. */
            JOINT_LEFT_RING_FINGER_PHALANX_PROXIMAL = 40,
            
            /** Left ring finger phalanx intermediate joint. */
            JOINT_LEFT_RING_FINGER_PHALANX_INTERMEDIATE = 41,
            
            /** Left ring finger phalanx distal joint. */
            JOINT_LEFT_RING_FINGER_PHALANX_DISTAL = 42,
            
            /** Left ring finger tip joint. */
            JOINT_LEFT_RING_FINGER_TIP = 43,
            
            /** Left pinky finger metacarpal joint. */
            JOINT_LEFT_PINKY_FINGER_METACARPAL = 44,
            
            /** Left pinky finger phalanx proximal joint. */
            JOINT_LEFT_PINKY_FINGER_PHALANX_PROXIMAL = 45,
            
            /** Left pinky finger phalanx intermediate joint. */
            JOINT_LEFT_PINKY_FINGER_PHALANX_INTERMEDIATE = 46,
            
            /** Left pinky finger phalanx distal joint. */
            JOINT_LEFT_PINKY_FINGER_PHALANX_DISTAL = 47,
            
            /** Left pinky finger tip joint. */
            JOINT_LEFT_PINKY_FINGER_TIP = 48,
            
            /** Right hand joint. */
            JOINT_RIGHT_HAND = 49,
            
            /** Right palm joint. */
            JOINT_RIGHT_PALM = 50,
            
            /** Right wrist joint. */
            JOINT_RIGHT_WRIST = 51,
            
            /** Right thumb metacarpal joint. */
            JOINT_RIGHT_THUMB_METACARPAL = 52,
            
            /** Right thumb phalanx proximal joint. */
            JOINT_RIGHT_THUMB_PHALANX_PROXIMAL = 53,
            
            /** Right thumb phalanx distal joint. */
            JOINT_RIGHT_THUMB_PHALANX_DISTAL = 54,
            
            /** Right thumb tip joint. */
            JOINT_RIGHT_THUMB_TIP = 55,
            
            /** Right index finger metacarpal joint. */
            JOINT_RIGHT_INDEX_FINGER_METACARPAL = 56,
            
            /** Right index finger phalanx proximal joint. */
            JOINT_RIGHT_INDEX_FINGER_PHALANX_PROXIMAL = 57,
            
            /** Right index finger phalanx intermediate joint. */
            JOINT_RIGHT_INDEX_FINGER_PHALANX_INTERMEDIATE = 58,
            
            /** Right index finger phalanx distal joint. */
            JOINT_RIGHT_INDEX_FINGER_PHALANX_DISTAL = 59,
            
            /** Right index finger tip joint. */
            JOINT_RIGHT_INDEX_FINGER_TIP = 60,
            
            /** Right middle finger metacarpal joint. */
            JOINT_RIGHT_MIDDLE_FINGER_METACARPAL = 61,
            
            /** Right middle finger phalanx proximal joint. */
            JOINT_RIGHT_MIDDLE_FINGER_PHALANX_PROXIMAL = 62,
            
            /** Right middle finger phalanx intermediate joint. */
            JOINT_RIGHT_MIDDLE_FINGER_PHALANX_INTERMEDIATE = 63,
            
            /** Right middle finger phalanx distal joint. */
            JOINT_RIGHT_MIDDLE_FINGER_PHALANX_DISTAL = 64,
            
            /** Right middle finger tip joint. */
            JOINT_RIGHT_MIDDLE_FINGER_TIP = 65,
            
            /** Right ring finger metacarpal joint. */
            JOINT_RIGHT_RING_FINGER_METACARPAL = 66,
            
            /** Right ring finger phalanx proximal joint. */
            JOINT_RIGHT_RING_FINGER_PHALANX_PROXIMAL = 67,
            
            /** Right ring finger phalanx intermediate joint. */
            JOINT_RIGHT_RING_FINGER_PHALANX_INTERMEDIATE = 68,
            
            /** Right ring finger phalanx distal joint. */
            JOINT_RIGHT_RING_FINGER_PHALANX_DISTAL = 69,
            
            /** Right ring finger tip joint. */
            JOINT_RIGHT_RING_FINGER_TIP = 70,
            
            /** Right pinky finger metacarpal joint. */
            JOINT_RIGHT_PINKY_FINGER_METACARPAL = 71,
            
            /** Right pinky finger phalanx proximal joint. */
            JOINT_RIGHT_PINKY_FINGER_PHALANX_PROXIMAL = 72,
            
            /** Right pinky finger phalanx intermediate joint. */
            JOINT_RIGHT_PINKY_FINGER_PHALANX_INTERMEDIATE = 73,
            
            /** Right pinky finger phalanx distal joint. */
            JOINT_RIGHT_PINKY_FINGER_PHALANX_DISTAL = 74,
            
            /** Right pinky finger tip joint. */
            JOINT_RIGHT_PINKY_FINGER_TIP = 75,
            
            /** Represents the size of the [enum Joint] enum. */
            JOINT_MAX = 76,
        }
        enum JointFlags {
            /** The joint's orientation data is valid. */
            JOINT_FLAG_ORIENTATION_VALID = 1,
            
            /** The joint's orientation is actively tracked. May not be set if tracking has been temporarily lost. */
            JOINT_FLAG_ORIENTATION_TRACKED = 2,
            
            /** The joint's position data is valid. */
            JOINT_FLAG_POSITION_VALID = 4,
            
            /** The joint's position is actively tracked. May not be set if tracking has been temporarily lost. */
            JOINT_FLAG_POSITION_TRACKED = 8,
        }
    }
    /** A tracked body in XR.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrbodytracker.html  
     */
    class XRBodyTracker extends XRPositionalTracker {
        constructor(identifier?: any)
        /** Sets flags about the validity of the tracking data for the given body joint. */
        set_joint_flags(joint: XRBodyTracker.Joint, flags: XRBodyTracker.JointFlags): void
        
        /** Returns flags about the validity of the tracking data for the given body joint (see [enum XRBodyTracker.JointFlags]). */
        get_joint_flags(joint: XRBodyTracker.Joint): XRBodyTracker.JointFlags
        
        /** Sets the transform for the given body joint. */
        set_joint_transform(joint: XRBodyTracker.Joint, transform: Transform3D): void
        
        /** Returns the transform for the given body joint. */
        get_joint_transform(joint: XRBodyTracker.Joint): Transform3D
        
        /** If `true`, the body tracking data is valid. */
        get has_tracking_data(): boolean
        set has_tracking_data(value: boolean)
        
        /** The type of body tracking data captured. */
        get body_flags(): int64
        set body_flags(value: int64)
    }
    /** A camera node with a few overrules for AR/VR applied, such as location tracking.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrcamera3d.html  
     */
    class XRCamera3D<Map extends Record<string, Node> = Record<string, Node>> extends Camera3D<Map> {
        constructor(identifier?: any)
    }
    /** A 3D node representing a spatially-tracked controller.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrcontroller3d.html  
     */
    class XRController3D<Map extends Record<string, Node> = Record<string, Node>> extends XRNode3D<Map> {
        constructor(identifier?: any)
        /** Returns `true` if the button with the given [param name] is pressed. */
        is_button_pressed(name: StringName): boolean
        
        /** Returns a [Variant] for the input with the given [param name]. This works for any input type, the variant will be typed according to the actions configuration. */
        get_input(name: StringName): any
        
        /** Returns a numeric value for the input with the given [param name]. This is used for triggers and grip sensors. */
        get_float(name: StringName): float64
        
        /** Returns a [Vector2] for the input with the given [param name]. This is used for thumbsticks and thumbpads found on many controllers. */
        get_vector2(name: StringName): Vector2
        
        /** Returns the hand holding this controller, if known. See [enum XRPositionalTracker.TrackerHand]. */
        get_tracker_hand(): XRPositionalTracker.TrackerHand
        
        /** Emitted when a button on this controller is pressed. */
        readonly button_pressed: Signal1<string>
        
        /** Emitted when a button on this controller is released. */
        readonly button_released: Signal1<string>
        
        /** Emitted when a trigger or similar input on this controller changes value. */
        readonly input_float_changed: Signal2<string, float64>
        
        /** Emitted when a thumbstick or thumbpad on this controller is moved. */
        readonly input_vector2_changed: Signal2<string, Vector2>
        
        /** Emitted when the interaction profile on this controller is changed. */
        readonly profile_changed: Signal1<string>
    }
    /** A tracked controller.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrcontrollertracker.html  
     */
    class XRControllerTracker extends XRPositionalTracker {
        constructor(identifier?: any)
    }
    /** A node for driving standard face meshes from [XRFaceTracker] weights.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrfacemodifier3d.html  
     */
    class XRFaceModifier3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** The [XRFaceTracker] path. */
        get face_tracker(): string
        set face_tracker(value: string)
        
        /** The [NodePath] of the face [MeshInstance3D]. */
        get target(): NodePath
        set target(value: NodePath | string)
    }
    namespace XRFaceTracker {
        enum BlendShapeEntry {
            /** Right eye looks outwards. */
            FT_EYE_LOOK_OUT_RIGHT = 0,
            
            /** Right eye looks inwards. */
            FT_EYE_LOOK_IN_RIGHT = 1,
            
            /** Right eye looks upwards. */
            FT_EYE_LOOK_UP_RIGHT = 2,
            
            /** Right eye looks downwards. */
            FT_EYE_LOOK_DOWN_RIGHT = 3,
            
            /** Left eye looks outwards. */
            FT_EYE_LOOK_OUT_LEFT = 4,
            
            /** Left eye looks inwards. */
            FT_EYE_LOOK_IN_LEFT = 5,
            
            /** Left eye looks upwards. */
            FT_EYE_LOOK_UP_LEFT = 6,
            
            /** Left eye looks downwards. */
            FT_EYE_LOOK_DOWN_LEFT = 7,
            
            /** Closes the right eyelid. */
            FT_EYE_CLOSED_RIGHT = 8,
            
            /** Closes the left eyelid. */
            FT_EYE_CLOSED_LEFT = 9,
            
            /** Squeezes the right eye socket muscles. */
            FT_EYE_SQUINT_RIGHT = 10,
            
            /** Squeezes the left eye socket muscles. */
            FT_EYE_SQUINT_LEFT = 11,
            
            /** Right eyelid widens beyond relaxed. */
            FT_EYE_WIDE_RIGHT = 12,
            
            /** Left eyelid widens beyond relaxed. */
            FT_EYE_WIDE_LEFT = 13,
            
            /** Dilates the right eye pupil. */
            FT_EYE_DILATION_RIGHT = 14,
            
            /** Dilates the left eye pupil. */
            FT_EYE_DILATION_LEFT = 15,
            
            /** Constricts the right eye pupil. */
            FT_EYE_CONSTRICT_RIGHT = 16,
            
            /** Constricts the left eye pupil. */
            FT_EYE_CONSTRICT_LEFT = 17,
            
            /** Right eyebrow pinches in. */
            FT_BROW_PINCH_RIGHT = 18,
            
            /** Left eyebrow pinches in. */
            FT_BROW_PINCH_LEFT = 19,
            
            /** Outer right eyebrow pulls down. */
            FT_BROW_LOWERER_RIGHT = 20,
            
            /** Outer left eyebrow pulls down. */
            FT_BROW_LOWERER_LEFT = 21,
            
            /** Inner right eyebrow pulls up. */
            FT_BROW_INNER_UP_RIGHT = 22,
            
            /** Inner left eyebrow pulls up. */
            FT_BROW_INNER_UP_LEFT = 23,
            
            /** Outer right eyebrow pulls up. */
            FT_BROW_OUTER_UP_RIGHT = 24,
            
            /** Outer left eyebrow pulls up. */
            FT_BROW_OUTER_UP_LEFT = 25,
            
            /** Right side face sneers. */
            FT_NOSE_SNEER_RIGHT = 26,
            
            /** Left side face sneers. */
            FT_NOSE_SNEER_LEFT = 27,
            
            /** Right side nose canal dilates. */
            FT_NASAL_DILATION_RIGHT = 28,
            
            /** Left side nose canal dilates. */
            FT_NASAL_DILATION_LEFT = 29,
            
            /** Right side nose canal constricts. */
            FT_NASAL_CONSTRICT_RIGHT = 30,
            
            /** Left side nose canal constricts. */
            FT_NASAL_CONSTRICT_LEFT = 31,
            
            /** Raises the right side cheek. */
            FT_CHEEK_SQUINT_RIGHT = 32,
            
            /** Raises the left side cheek. */
            FT_CHEEK_SQUINT_LEFT = 33,
            
            /** Puffs the right side cheek. */
            FT_CHEEK_PUFF_RIGHT = 34,
            
            /** Puffs the left side cheek. */
            FT_CHEEK_PUFF_LEFT = 35,
            
            /** Sucks in the right side cheek. */
            FT_CHEEK_SUCK_RIGHT = 36,
            
            /** Sucks in the left side cheek. */
            FT_CHEEK_SUCK_LEFT = 37,
            
            /** Opens jawbone. */
            FT_JAW_OPEN = 38,
            
            /** Closes the mouth. */
            FT_MOUTH_CLOSED = 39,
            
            /** Pushes jawbone right. */
            FT_JAW_RIGHT = 40,
            
            /** Pushes jawbone left. */
            FT_JAW_LEFT = 41,
            
            /** Pushes jawbone forward. */
            FT_JAW_FORWARD = 42,
            
            /** Pushes jawbone backward. */
            FT_JAW_BACKWARD = 43,
            
            /** Flexes jaw muscles. */
            FT_JAW_CLENCH = 44,
            
            /** Raises the jawbone. */
            FT_JAW_MANDIBLE_RAISE = 45,
            
            /** Upper right lip part tucks in the mouth. */
            FT_LIP_SUCK_UPPER_RIGHT = 46,
            
            /** Upper left lip part tucks in the mouth. */
            FT_LIP_SUCK_UPPER_LEFT = 47,
            
            /** Lower right lip part tucks in the mouth. */
            FT_LIP_SUCK_LOWER_RIGHT = 48,
            
            /** Lower left lip part tucks in the mouth. */
            FT_LIP_SUCK_LOWER_LEFT = 49,
            
            /** Right lip corner folds into the mouth. */
            FT_LIP_SUCK_CORNER_RIGHT = 50,
            
            /** Left lip corner folds into the mouth. */
            FT_LIP_SUCK_CORNER_LEFT = 51,
            
            /** Upper right lip part pushes into a funnel. */
            FT_LIP_FUNNEL_UPPER_RIGHT = 52,
            
            /** Upper left lip part pushes into a funnel. */
            FT_LIP_FUNNEL_UPPER_LEFT = 53,
            
            /** Lower right lip part pushes into a funnel. */
            FT_LIP_FUNNEL_LOWER_RIGHT = 54,
            
            /** Lower left lip part pushes into a funnel. */
            FT_LIP_FUNNEL_LOWER_LEFT = 55,
            
            /** Upper right lip part pushes outwards. */
            FT_LIP_PUCKER_UPPER_RIGHT = 56,
            
            /** Upper left lip part pushes outwards. */
            FT_LIP_PUCKER_UPPER_LEFT = 57,
            
            /** Lower right lip part pushes outwards. */
            FT_LIP_PUCKER_LOWER_RIGHT = 58,
            
            /** Lower left lip part pushes outwards. */
            FT_LIP_PUCKER_LOWER_LEFT = 59,
            
            /** Upper right part of the lip pulls up. */
            FT_MOUTH_UPPER_UP_RIGHT = 60,
            
            /** Upper left part of the lip pulls up. */
            FT_MOUTH_UPPER_UP_LEFT = 61,
            
            /** Lower right part of the lip pulls up. */
            FT_MOUTH_LOWER_DOWN_RIGHT = 62,
            
            /** Lower left part of the lip pulls up. */
            FT_MOUTH_LOWER_DOWN_LEFT = 63,
            
            /** Upper right lip part pushes in the cheek. */
            FT_MOUTH_UPPER_DEEPEN_RIGHT = 64,
            
            /** Upper left lip part pushes in the cheek. */
            FT_MOUTH_UPPER_DEEPEN_LEFT = 65,
            
            /** Moves upper lip right. */
            FT_MOUTH_UPPER_RIGHT = 66,
            
            /** Moves upper lip left. */
            FT_MOUTH_UPPER_LEFT = 67,
            
            /** Moves lower lip right. */
            FT_MOUTH_LOWER_RIGHT = 68,
            
            /** Moves lower lip left. */
            FT_MOUTH_LOWER_LEFT = 69,
            
            /** Right lip corner pulls diagonally up and out. */
            FT_MOUTH_CORNER_PULL_RIGHT = 70,
            
            /** Left lip corner pulls diagonally up and out. */
            FT_MOUTH_CORNER_PULL_LEFT = 71,
            
            /** Right corner lip slants up. */
            FT_MOUTH_CORNER_SLANT_RIGHT = 72,
            
            /** Left corner lip slants up. */
            FT_MOUTH_CORNER_SLANT_LEFT = 73,
            
            /** Right corner lip pulls down. */
            FT_MOUTH_FROWN_RIGHT = 74,
            
            /** Left corner lip pulls down. */
            FT_MOUTH_FROWN_LEFT = 75,
            
            /** Mouth corner lip pulls out and down. */
            FT_MOUTH_STRETCH_RIGHT = 76,
            
            /** Mouth corner lip pulls out and down. */
            FT_MOUTH_STRETCH_LEFT = 77,
            
            /** Right lip corner is pushed backwards. */
            FT_MOUTH_DIMPLE_RIGHT = 78,
            
            /** Left lip corner is pushed backwards. */
            FT_MOUTH_DIMPLE_LEFT = 79,
            
            /** Raises and slightly pushes out the upper mouth. */
            FT_MOUTH_RAISER_UPPER = 80,
            
            /** Raises and slightly pushes out the lower mouth. */
            FT_MOUTH_RAISER_LOWER = 81,
            
            /** Right side lips press and flatten together vertically. */
            FT_MOUTH_PRESS_RIGHT = 82,
            
            /** Left side lips press and flatten together vertically. */
            FT_MOUTH_PRESS_LEFT = 83,
            
            /** Right side lips squeeze together horizontally. */
            FT_MOUTH_TIGHTENER_RIGHT = 84,
            
            /** Left side lips squeeze together horizontally. */
            FT_MOUTH_TIGHTENER_LEFT = 85,
            
            /** Tongue visibly sticks out of the mouth. */
            FT_TONGUE_OUT = 86,
            
            /** Tongue points upwards. */
            FT_TONGUE_UP = 87,
            
            /** Tongue points downwards. */
            FT_TONGUE_DOWN = 88,
            
            /** Tongue points right. */
            FT_TONGUE_RIGHT = 89,
            
            /** Tongue points left. */
            FT_TONGUE_LEFT = 90,
            
            /** Sides of the tongue funnel, creating a roll. */
            FT_TONGUE_ROLL = 91,
            
            /** Tongue arches up then down inside the mouth. */
            FT_TONGUE_BLEND_DOWN = 92,
            
            /** Tongue arches down then up inside the mouth. */
            FT_TONGUE_CURL_UP = 93,
            
            /** Tongue squishes together and thickens. */
            FT_TONGUE_SQUISH = 94,
            
            /** Tongue flattens and thins out. */
            FT_TONGUE_FLAT = 95,
            
            /** Tongue tip rotates clockwise, with the rest following gradually. */
            FT_TONGUE_TWIST_RIGHT = 96,
            
            /** Tongue tip rotates counter-clockwise, with the rest following gradually. */
            FT_TONGUE_TWIST_LEFT = 97,
            
            /** Inner mouth throat closes. */
            FT_SOFT_PALATE_CLOSE = 98,
            
            /** The Adam's apple visibly swallows. */
            FT_THROAT_SWALLOW = 99,
            
            /** Right side neck visibly flexes. */
            FT_NECK_FLEX_RIGHT = 100,
            
            /** Left side neck visibly flexes. */
            FT_NECK_FLEX_LEFT = 101,
            
            /** Closes both eye lids. */
            FT_EYE_CLOSED = 102,
            
            /** Widens both eye lids. */
            FT_EYE_WIDE = 103,
            
            /** Squints both eye lids. */
            FT_EYE_SQUINT = 104,
            
            /** Dilates both pupils. */
            FT_EYE_DILATION = 105,
            
            /** Constricts both pupils. */
            FT_EYE_CONSTRICT = 106,
            
            /** Pulls the right eyebrow down and in. */
            FT_BROW_DOWN_RIGHT = 107,
            
            /** Pulls the left eyebrow down and in. */
            FT_BROW_DOWN_LEFT = 108,
            
            /** Pulls both eyebrows down and in. */
            FT_BROW_DOWN = 109,
            
            /** Right brow appears worried. */
            FT_BROW_UP_RIGHT = 110,
            
            /** Left brow appears worried. */
            FT_BROW_UP_LEFT = 111,
            
            /** Both brows appear worried. */
            FT_BROW_UP = 112,
            
            /** Entire face sneers. */
            FT_NOSE_SNEER = 113,
            
            /** Both nose canals dilate. */
            FT_NASAL_DILATION = 114,
            
            /** Both nose canals constrict. */
            FT_NASAL_CONSTRICT = 115,
            
            /** Puffs both cheeks. */
            FT_CHEEK_PUFF = 116,
            
            /** Sucks in both cheeks. */
            FT_CHEEK_SUCK = 117,
            
            /** Raises both cheeks. */
            FT_CHEEK_SQUINT = 118,
            
            /** Tucks in the upper lips. */
            FT_LIP_SUCK_UPPER = 119,
            
            /** Tucks in the lower lips. */
            FT_LIP_SUCK_LOWER = 120,
            
            /** Tucks in both lips. */
            FT_LIP_SUCK = 121,
            
            /** Funnels in the upper lips. */
            FT_LIP_FUNNEL_UPPER = 122,
            
            /** Funnels in the lower lips. */
            FT_LIP_FUNNEL_LOWER = 123,
            
            /** Funnels in both lips. */
            FT_LIP_FUNNEL = 124,
            
            /** Upper lip part pushes outwards. */
            FT_LIP_PUCKER_UPPER = 125,
            
            /** Lower lip part pushes outwards. */
            FT_LIP_PUCKER_LOWER = 126,
            
            /** Lips push outwards. */
            FT_LIP_PUCKER = 127,
            
            /** Raises the upper lips. */
            FT_MOUTH_UPPER_UP = 128,
            
            /** Lowers the lower lips. */
            FT_MOUTH_LOWER_DOWN = 129,
            
            /** Mouth opens, revealing teeth. */
            FT_MOUTH_OPEN = 130,
            
            /** Moves mouth right. */
            FT_MOUTH_RIGHT = 131,
            
            /** Moves mouth left. */
            FT_MOUTH_LEFT = 132,
            
            /** Right side of the mouth smiles. */
            FT_MOUTH_SMILE_RIGHT = 133,
            
            /** Left side of the mouth smiles. */
            FT_MOUTH_SMILE_LEFT = 134,
            
            /** Mouth expresses a smile. */
            FT_MOUTH_SMILE = 135,
            
            /** Right side of the mouth expresses sadness. */
            FT_MOUTH_SAD_RIGHT = 136,
            
            /** Left side of the mouth expresses sadness. */
            FT_MOUTH_SAD_LEFT = 137,
            
            /** Mouth expresses sadness. */
            FT_MOUTH_SAD = 138,
            
            /** Mouth stretches. */
            FT_MOUTH_STRETCH = 139,
            
            /** Lip corners dimple. */
            FT_MOUTH_DIMPLE = 140,
            
            /** Mouth tightens. */
            FT_MOUTH_TIGHTENER = 141,
            
            /** Mouth presses together. */
            FT_MOUTH_PRESS = 142,
            
            /** Represents the size of the [enum BlendShapeEntry] enum. */
            FT_MAX = 143,
        }
    }
    /** A tracked face.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrfacetracker.html  
     */
    class XRFaceTracker extends XRTracker {
        constructor(identifier?: any)
        /** Returns the requested face blend shape weight. */
        get_blend_shape(blend_shape: XRFaceTracker.BlendShapeEntry): float64
        
        /** Sets a face blend shape weight. */
        set_blend_shape(blend_shape: XRFaceTracker.BlendShapeEntry, weight: float64): void
        
        /** The array of face blend shape weights with indices corresponding to the [enum BlendShapeEntry] enum. */
        get blend_shapes(): PackedFloat32Array
        set blend_shapes(value: PackedFloat32Array | float32[])
    }
    namespace XRHandModifier3D {
        enum BoneUpdate {
            /** The skeleton's bones are fully updated (both position and rotation) to match the tracked bones. */
            BONE_UPDATE_FULL = 0,
            
            /** The skeleton's bones are only rotated to align with the tracked bones, preserving bone length. */
            BONE_UPDATE_ROTATION_ONLY = 1,
            
            /** Represents the size of the [enum BoneUpdate] enum. */
            BONE_UPDATE_MAX = 2,
        }
    }
    /** A node for driving hand meshes from [XRHandTracker] data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrhandmodifier3d.html  
     */
    class XRHandModifier3D<Map extends Record<string, Node> = Record<string, Node>> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** The name of the [XRHandTracker] registered with [XRServer] to obtain the hand tracking data from. */
        get hand_tracker(): string
        set hand_tracker(value: string)
        
        /** Specifies the type of updates to perform on the bones. */
        get bone_update(): int64
        set bone_update(value: int64)
    }
    namespace XRHandTracker {
        enum HandTrackingSource {
            /** The source of hand tracking data is unknown. */
            HAND_TRACKING_SOURCE_UNKNOWN = 0,
            
            /** The source of hand tracking data is unobstructed, meaning that an accurate method of hand tracking is used. These include optical hand tracking, data gloves, etc. */
            HAND_TRACKING_SOURCE_UNOBSTRUCTED = 1,
            
            /** The source of hand tracking data is a controller, meaning that joint positions are inferred from controller inputs. */
            HAND_TRACKING_SOURCE_CONTROLLER = 2,
            
            /** No hand tracking data is tracked, this either means the hand is obscured, the controller is turned off, or tracking is not supported for the current input type. */
            HAND_TRACKING_SOURCE_NOT_TRACKED = 3,
            
            /** Represents the size of the [enum HandTrackingSource] enum. */
            HAND_TRACKING_SOURCE_MAX = 4,
        }
        enum HandJoint {
            /** Palm joint. */
            HAND_JOINT_PALM = 0,
            
            /** Wrist joint. */
            HAND_JOINT_WRIST = 1,
            
            /** Thumb metacarpal joint. */
            HAND_JOINT_THUMB_METACARPAL = 2,
            
            /** Thumb phalanx proximal joint. */
            HAND_JOINT_THUMB_PHALANX_PROXIMAL = 3,
            
            /** Thumb phalanx distal joint. */
            HAND_JOINT_THUMB_PHALANX_DISTAL = 4,
            
            /** Thumb tip joint. */
            HAND_JOINT_THUMB_TIP = 5,
            
            /** Index finger metacarpal joint. */
            HAND_JOINT_INDEX_FINGER_METACARPAL = 6,
            
            /** Index finger phalanx proximal joint. */
            HAND_JOINT_INDEX_FINGER_PHALANX_PROXIMAL = 7,
            
            /** Index finger phalanx intermediate joint. */
            HAND_JOINT_INDEX_FINGER_PHALANX_INTERMEDIATE = 8,
            
            /** Index finger phalanx distal joint. */
            HAND_JOINT_INDEX_FINGER_PHALANX_DISTAL = 9,
            
            /** Index finger tip joint. */
            HAND_JOINT_INDEX_FINGER_TIP = 10,
            
            /** Middle finger metacarpal joint. */
            HAND_JOINT_MIDDLE_FINGER_METACARPAL = 11,
            
            /** Middle finger phalanx proximal joint. */
            HAND_JOINT_MIDDLE_FINGER_PHALANX_PROXIMAL = 12,
            
            /** Middle finger phalanx intermediate joint. */
            HAND_JOINT_MIDDLE_FINGER_PHALANX_INTERMEDIATE = 13,
            
            /** Middle finger phalanx distal joint. */
            HAND_JOINT_MIDDLE_FINGER_PHALANX_DISTAL = 14,
            
            /** Middle finger tip joint. */
            HAND_JOINT_MIDDLE_FINGER_TIP = 15,
            
            /** Ring finger metacarpal joint. */
            HAND_JOINT_RING_FINGER_METACARPAL = 16,
            
            /** Ring finger phalanx proximal joint. */
            HAND_JOINT_RING_FINGER_PHALANX_PROXIMAL = 17,
            
            /** Ring finger phalanx intermediate joint. */
            HAND_JOINT_RING_FINGER_PHALANX_INTERMEDIATE = 18,
            
            /** Ring finger phalanx distal joint. */
            HAND_JOINT_RING_FINGER_PHALANX_DISTAL = 19,
            
            /** Ring finger tip joint. */
            HAND_JOINT_RING_FINGER_TIP = 20,
            
            /** Pinky finger metacarpal joint. */
            HAND_JOINT_PINKY_FINGER_METACARPAL = 21,
            
            /** Pinky finger phalanx proximal joint. */
            HAND_JOINT_PINKY_FINGER_PHALANX_PROXIMAL = 22,
            
            /** Pinky finger phalanx intermediate joint. */
            HAND_JOINT_PINKY_FINGER_PHALANX_INTERMEDIATE = 23,
            
            /** Pinky finger phalanx distal joint. */
            HAND_JOINT_PINKY_FINGER_PHALANX_DISTAL = 24,
            
            /** Pinky finger tip joint. */
            HAND_JOINT_PINKY_FINGER_TIP = 25,
            
            /** Represents the size of the [enum HandJoint] enum. */
            HAND_JOINT_MAX = 26,
        }
        enum HandJointFlags {
            /** The hand joint's orientation data is valid. */
            HAND_JOINT_FLAG_ORIENTATION_VALID = 1,
            
            /** The hand joint's orientation is actively tracked. May not be set if tracking has been temporarily lost. */
            HAND_JOINT_FLAG_ORIENTATION_TRACKED = 2,
            
            /** The hand joint's position data is valid. */
            HAND_JOINT_FLAG_POSITION_VALID = 4,
            
            /** The hand joint's position is actively tracked. May not be set if tracking has been temporarily lost. */
            HAND_JOINT_FLAG_POSITION_TRACKED = 8,
            
            /** The hand joint's linear velocity data is valid. */
            HAND_JOINT_FLAG_LINEAR_VELOCITY_VALID = 16,
            
            /** The hand joint's angular velocity data is valid. */
            HAND_JOINT_FLAG_ANGULAR_VELOCITY_VALID = 32,
        }
    }
    /** A tracked hand in XR.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrhandtracker.html  
     */
    class XRHandTracker extends XRPositionalTracker {
        constructor(identifier?: any)
        /** Sets flags about the validity of the tracking data for the given hand joint. */
        set_hand_joint_flags(joint: XRHandTracker.HandJoint, flags: XRHandTracker.HandJointFlags): void
        
        /** Returns flags about the validity of the tracking data for the given hand joint (see [enum XRHandTracker.HandJointFlags]). */
        get_hand_joint_flags(joint: XRHandTracker.HandJoint): XRHandTracker.HandJointFlags
        
        /** Sets the transform for the given hand joint. */
        set_hand_joint_transform(joint: XRHandTracker.HandJoint, transform: Transform3D): void
        
        /** Returns the transform for the given hand joint. */
        get_hand_joint_transform(joint: XRHandTracker.HandJoint): Transform3D
        
        /** Sets the radius of the given hand joint. */
        set_hand_joint_radius(joint: XRHandTracker.HandJoint, radius: float64): void
        
        /** Returns the radius of the given hand joint. */
        get_hand_joint_radius(joint: XRHandTracker.HandJoint): float64
        
        /** Sets the linear velocity for the given hand joint. */
        set_hand_joint_linear_velocity(joint: XRHandTracker.HandJoint, linear_velocity: Vector3): void
        
        /** Returns the linear velocity for the given hand joint. */
        get_hand_joint_linear_velocity(joint: XRHandTracker.HandJoint): Vector3
        
        /** Sets the angular velocity for the given hand joint. */
        set_hand_joint_angular_velocity(joint: XRHandTracker.HandJoint, angular_velocity: Vector3): void
        
        /** Returns the angular velocity for the given hand joint. */
        get_hand_joint_angular_velocity(joint: XRHandTracker.HandJoint): Vector3
        
        /** If `true`, the hand tracking data is valid. */
        get has_tracking_data(): boolean
        set has_tracking_data(value: boolean)
        
        /** The source of the hand tracking data. */
        get hand_tracking_source(): int64
        set hand_tracking_source(value: int64)
    }
    namespace XRInterface {
        enum Capabilities {
            /** No XR capabilities. */
            XR_NONE = 0,
            
            /** This interface can work with normal rendering output (non-HMD based AR). */
            XR_MONO = 1,
            
            /** This interface supports stereoscopic rendering. */
            XR_STEREO = 2,
            
            /** This interface supports quad rendering (not yet supported by Godot). */
            XR_QUAD = 4,
            
            /** This interface supports VR. */
            XR_VR = 8,
            
            /** This interface supports AR (video background and real world tracking). */
            XR_AR = 16,
            
            /** This interface outputs to an external device. If the main viewport is used, the on screen output is an unmodified buffer of either the left or right eye (stretched if the viewport size is not changed to the same aspect ratio of [method get_render_target_size]). Using a separate viewport node frees up the main viewport for other purposes. */
            XR_EXTERNAL = 32,
        }
        enum TrackingStatus {
            /** Tracking is behaving as expected. */
            XR_NORMAL_TRACKING = 0,
            
            /** Tracking is hindered by excessive motion (the player is moving faster than tracking can keep up). */
            XR_EXCESSIVE_MOTION = 1,
            
            /** Tracking is hindered by insufficient features, it's too dark (for camera-based tracking), player is blocked, etc. */
            XR_INSUFFICIENT_FEATURES = 2,
            
            /** We don't know the status of the tracking or this interface does not provide feedback. */
            XR_UNKNOWN_TRACKING = 3,
            
            /** Tracking is not functional (camera not plugged in or obscured, lighthouses turned off, etc.). */
            XR_NOT_TRACKING = 4,
        }
        enum PlayAreaMode {
            /** Play area mode not set or not available. */
            XR_PLAY_AREA_UNKNOWN = 0,
            
            /** Play area only supports orientation tracking, no positional tracking, area will center around player. */
            XR_PLAY_AREA_3DOF = 1,
            
            /** Player is in seated position, limited positional tracking, fixed guardian around player. */
            XR_PLAY_AREA_SITTING = 2,
            
            /** Player is free to move around, full positional tracking. */
            XR_PLAY_AREA_ROOMSCALE = 3,
            
            /** Same as [constant XR_PLAY_AREA_ROOMSCALE] but origin point is fixed to the center of the physical space. In this mode, system-level recentering may be disabled, requiring the use of [method XRServer.center_on_hmd]. */
            XR_PLAY_AREA_STAGE = 4,
        }
        enum EnvironmentBlendMode {
            /** Opaque blend mode. This is typically used for VR devices. */
            XR_ENV_BLEND_MODE_OPAQUE = 0,
            
            /** Additive blend mode. This is typically used for AR devices or VR devices with passthrough. */
            XR_ENV_BLEND_MODE_ADDITIVE = 1,
            
            /** Alpha blend mode. This is typically used for AR or VR devices with passthrough capabilities. The alpha channel controls how much of the passthrough is visible. Alpha of 0.0 means the passthrough is visible and this pixel works in ADDITIVE mode. Alpha of 1.0 means that the passthrough is not visible and this pixel works in OPAQUE mode. */
            XR_ENV_BLEND_MODE_ALPHA_BLEND = 2,
        }
    }
    /** Base class for an XR interface implementation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrinterface.html  
     */
    class XRInterface extends RefCounted {
        constructor(identifier?: any)
        /** Returns the name of this interface (`"OpenXR"`, `"OpenVR"`, `"OpenHMD"`, `"ARKit"`, etc.). */
        get_name(): StringName
        
        /** Returns a combination of [enum Capabilities] flags providing information about the capabilities of this interface. */
        get_capabilities(): int64
        
        /** Returns `true` if this interface has been initialized. */
        is_initialized(): boolean
        
        /** Call this to initialize this interface. The first interface that is initialized is identified as the primary interface and it will be used for rendering output.  
         *  After initializing the interface you want to use you then need to enable the AR/VR mode of a viewport and rendering should commence.  
         *      
         *  **Note:** You must enable the XR mode on the main viewport for any device that uses the main output of Godot, such as for mobile VR.  
         *  If you do this for a platform that handles its own output (such as OpenVR) Godot will show just one eye without distortion on screen. Alternatively, you can add a separate viewport node to your scene and enable AR/VR on that viewport. It will be used to output to the HMD, leaving you free to do anything you like in the main window, such as using a separate camera as a spectator camera or rendering something completely different.  
         *  While currently not used, you can activate additional interfaces. You may wish to do this if you want to track controllers from other platforms. However, at this point in time only one interface can render to an HMD.  
         */
        initialize(): boolean
        
        /** Turns the interface off. */
        uninitialize(): void
        
        /** Returns a [Dictionary] with extra system info. Interfaces are expected to return `XRRuntimeName` and `XRRuntimeVersion` providing info about the used XR runtime. Additional entries may be provided specific to an interface.  
         *      
         *  **Note:**This information may only be available after [method initialize] was successfully called.  
         */
        get_system_info(): GDictionary
        
        /** If supported, returns the status of our tracking. This will allow you to provide feedback to the user whether there are issues with positional tracking. */
        get_tracking_status(): XRInterface.TrackingStatus
        
        /** Returns the resolution at which we should render our intermediate results before things like lens distortion are applied by the VR platform. */
        get_render_target_size(): Vector2
        
        /** Returns the number of views that need to be rendered for this device. 1 for Monoscopic, 2 for Stereoscopic. */
        get_view_count(): int64
        
        /** Triggers a haptic pulse on a device associated with this interface.  
         *  [param action_name] is the name of the action for this pulse.  
         *  [param tracker_name] is optional and can be used to direct the pulse to a specific device provided that device is bound to this haptic.  
         *  [param frequency] is the frequency of the pulse, set to `0.0` to have the system use a default frequency.  
         *  [param amplitude] is the amplitude of the pulse between `0.0` and `1.0`.  
         *  [param duration_sec] is the duration of the pulse in seconds.  
         *  [param delay_sec] is a delay in seconds before the pulse is given.  
         */
        trigger_haptic_pulse(action_name: string, tracker_name: StringName, frequency: float64, amplitude: float64, duration_sec: float64, delay_sec: float64): void
        
        /** Call this to find out if a given play area mode is supported by this interface. */
        supports_play_area_mode(mode: XRInterface.PlayAreaMode): boolean
        
        /** Returns an array of vectors that represent the physical play area mapped to the virtual space around the [XROrigin3D] point. The points form a convex polygon that can be used to react to or visualize the play area. This returns an empty array if this feature is not supported or if the information is not yet available. */
        get_play_area(): PackedVector3Array
        
        /** If this is an AR interface that requires displaying a camera feed as the background, this method returns the feed ID in the [CameraServer] for this interface. */
        get_camera_feed_id(): int64
        
        /** Returns `true` if this interface supports passthrough. */
        is_passthrough_supported(): boolean
        
        /** Returns `true` if passthrough is enabled. */
        is_passthrough_enabled(): boolean
        
        /** Starts passthrough, will return `false` if passthrough couldn't be started.  
         *      
         *  **Note:** The viewport used for XR must have a transparent background, otherwise passthrough may not properly render.  
         */
        start_passthrough(): boolean
        
        /** Stops passthrough. */
        stop_passthrough(): void
        
        /** Returns the transform for a view/eye.  
         *  [param view] is the view/eye index.  
         *  [param cam_transform] is the transform that maps device coordinates to scene coordinates, typically the [member Node3D.global_transform] of the current XROrigin3D.  
         */
        get_transform_for_view(view: int64, cam_transform: Transform3D): Transform3D
        
        /** Returns the projection matrix for a view/eye. */
        get_projection_for_view(view: int64, aspect: float64, near: float64, far: float64): Projection
        
        /** Returns the an array of supported environment blend modes, see [enum XRInterface.EnvironmentBlendMode]. */
        get_supported_environment_blend_modes(): GArray
        
        /** `true` if this is the primary interface. */
        get interface_is_primary(): boolean
        set interface_is_primary(value: boolean)
        
        /** The play area mode for this interface. */
        get xr_play_area_mode(): int64
        set xr_play_area_mode(value: int64)
        
        /** Specify how XR should blend in the environment. This is specific to certain AR and passthrough devices where camera images are blended in by the XR compositor. */
        get environment_blend_mode(): int64
        set environment_blend_mode(value: int64)
        
        /** On an AR interface, `true` if anchor detection is enabled. */
        get ar_is_anchor_detection_enabled(): boolean
        set ar_is_anchor_detection_enabled(value: boolean)
        
        /** Emitted when the play area is changed. This can be a result of the player resetting the boundary or entering a new play area, the player changing the play area mode, the world scale changing or the player resetting their headset orientation. */
        readonly play_area_changed: Signal1<int64>
    }
    /** Base class for XR interface extensions (plugins).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrinterfaceextension.html  
     */
    class XRInterfaceExtension extends XRInterface {
        constructor(identifier?: any)
        /** Returns the name of this interface. */
        /* gdvirtual */ _get_name(): StringName
        
        /** Returns the capabilities of this interface. */
        /* gdvirtual */ _get_capabilities(): int64
        
        /** Returns `true` if this interface has been initialized. */
        /* gdvirtual */ _is_initialized(): boolean
        
        /** Initializes the interface, returns `true` on success. */
        /* gdvirtual */ _initialize(): boolean
        
        /** Uninitialize the interface. */
        /* gdvirtual */ _uninitialize(): void
        
        /** Returns a [Dictionary] with system information related to this interface. */
        /* gdvirtual */ _get_system_info(): GDictionary
        
        /** Returns `true` if this interface supports this play area mode. */
        /* gdvirtual */ _supports_play_area_mode(mode: XRInterface.PlayAreaMode): boolean
        
        /** Returns the play area mode that sets up our play area. */
        /* gdvirtual */ _get_play_area_mode(): XRInterface.PlayAreaMode
        
        /** Set the play area mode for this interface. */
        /* gdvirtual */ _set_play_area_mode(mode: XRInterface.PlayAreaMode): boolean
        
        /** Returns a [PackedVector3Array] that represents the play areas boundaries (if applicable). */
        /* gdvirtual */ _get_play_area(): PackedVector3Array
        
        /** Returns the size of our render target for this interface, this overrides the size of the [Viewport] marked as the xr viewport. */
        /* gdvirtual */ _get_render_target_size(): Vector2
        
        /** Returns the number of views this interface requires, 1 for mono, 2 for stereoscopic. */
        /* gdvirtual */ _get_view_count(): int64
        
        /** Returns the [Transform3D] that positions the [XRCamera3D] in the world. */
        /* gdvirtual */ _get_camera_transform(): Transform3D
        
        /** Returns a [Transform3D] for a given view. */
        /* gdvirtual */ _get_transform_for_view(view: int64, cam_transform: Transform3D): Transform3D
        
        /** Returns the projection matrix for the given view as a [PackedFloat64Array]. */
        /* gdvirtual */ _get_projection_for_view(view: int64, aspect: float64, z_near: float64, z_far: float64): PackedFloat64Array
        /* gdvirtual */ _get_vrs_texture(): RID
        
        /** Called if this [XRInterfaceExtension] is active before our physics and game process is called. Most XR interfaces will update its [XRPositionalTracker]s at this point in time. */
        /* gdvirtual */ _process(): void
        
        /** Called if this [XRInterfaceExtension] is active before rendering starts. Most XR interfaces will sync tracking at this point in time. */
        /* gdvirtual */ _pre_render(): void
        
        /** Called if this is our primary [XRInterfaceExtension] before we start processing a [Viewport] for every active XR [Viewport], returns `true` if that viewport should be rendered. An XR interface may return `false` if the user has taken off their headset and we can pause rendering. */
        /* gdvirtual */ _pre_draw_viewport(render_target: RID): boolean
        
        /** Called after the XR [Viewport] draw logic has completed. */
        /* gdvirtual */ _post_draw_viewport(render_target: RID, screen_rect: Rect2): void
        
        /** Called if interface is active and queues have been submitted. */
        /* gdvirtual */ _end_frame(): void
        
        /** Returns a [PackedStringArray] with tracker names configured by this interface. Note that user configuration can override this list. */
        /* gdvirtual */ _get_suggested_tracker_names(): PackedStringArray
        
        /** Returns a [PackedStringArray] with pose names configured by this interface. Note that user configuration can override this list. */
        /* gdvirtual */ _get_suggested_pose_names(tracker_name: StringName): PackedStringArray
        
        /** Returns a [enum XRInterface.TrackingStatus] specifying the current status of our tracking. */
        /* gdvirtual */ _get_tracking_status(): XRInterface.TrackingStatus
        
        /** Triggers a haptic pulse to be emitted on the specified tracker. */
        /* gdvirtual */ _trigger_haptic_pulse(action_name: string, tracker_name: StringName, frequency: float64, amplitude: float64, duration_sec: float64, delay_sec: float64): void
        
        /** Return `true` if anchor detection is enabled for this interface. */
        /* gdvirtual */ _get_anchor_detection_is_enabled(): boolean
        
        /** Enables anchor detection on this interface if supported. */
        /* gdvirtual */ _set_anchor_detection_is_enabled(enabled: boolean): void
        
        /** Returns the camera feed ID for the [CameraFeed] registered with the [CameraServer] that should be presented as the background on an AR capable device (if applicable). */
        /* gdvirtual */ _get_camera_feed_id(): int64
        
        /** Return color texture into which to render (if applicable). */
        /* gdvirtual */ _get_color_texture(): RID
        
        /** Return depth texture into which to render (if applicable). */
        /* gdvirtual */ _get_depth_texture(): RID
        
        /** Return velocity texture into which to render (if applicable). */
        /* gdvirtual */ _get_velocity_texture(): RID
        get_color_texture(): RID
        get_depth_texture(): RID
        get_velocity_texture(): RID
        
        /** Blits our render results to screen optionally applying lens distortion. This can only be called while processing `_commit_views`. */
        add_blit(render_target: RID, src_rect: Rect2, dst_rect: Rect2i, use_layer: boolean, layer: int64, apply_lens_distortion: boolean, eye_center: Vector2, k1: float64, k2: float64, upscale: float64, aspect_ratio: float64): void
        
        /** Returns a valid [RID] for a texture to which we should render the current frame if supported by the interface. */
        get_render_target_texture(render_target: RID): RID
    }
    /** A 3D node that has its position automatically updated by the [XRServer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrnode3d.html  
     */
    class XRNode3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Returns `true` if the [member tracker] has been registered and the [member pose] is being tracked. */
        get_is_active(): boolean
        
        /** Returns `true` if the [member tracker] has current tracking data for the [member pose] being tracked. */
        get_has_tracking_data(): boolean
        
        /** Returns the [XRPose] containing the current state of the pose being tracked. This gives access to additional properties of this pose. */
        get_pose(): XRPose
        
        /** Triggers a haptic pulse on a device associated with this interface.  
         *  [param action_name] is the name of the action for this pulse.  
         *  [param frequency] is the frequency of the pulse, set to `0.0` to have the system use a default frequency.  
         *  [param amplitude] is the amplitude of the pulse between `0.0` and `1.0`.  
         *  [param duration_sec] is the duration of the pulse in seconds.  
         *  [param delay_sec] is a delay in seconds before the pulse is given.  
         */
        trigger_haptic_pulse(action_name: string, frequency: float64, amplitude: float64, duration_sec: float64, delay_sec: float64): void
        
        /** The name of the tracker we're bound to. Which trackers are available is not known during design time.  
         *  Godot defines a number of standard trackers such as `left_hand` and `right_hand` but others may be configured within a given [XRInterface].  
         */
        get tracker(): string
        set tracker(value: string)
        
        /** The name of the pose we're bound to. Which poses a tracker supports is not known during design time.  
         *  Godot defines number of standard pose names such as `aim` and `grip` but other may be configured within a given [XRInterface].  
         */
        get pose(): string
        set pose(value: string)
        
        /** Enables showing the node when tracking starts, and hiding the node when tracking is lost. */
        get show_when_tracked(): boolean
        set show_when_tracked(value: boolean)
        
        /** Emitted when the [member tracker] starts or stops receiving updated tracking data for the [member pose] being tracked. The [param tracking] argument indicates whether the tracker is getting updated tracking data. */
        readonly tracking_changed: Signal1<boolean>
    }
    /** The origin point in AR/VR.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrorigin3d.html  
     */
    class XROrigin3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** The scale of the game world compared to the real world. This is the same as [member XRServer.world_scale]. By default, most AR/VR platforms assume that 1 game unit corresponds to 1 real world meter. */
        get world_scale(): float64
        set world_scale(value: float64)
        
        /** If `true`, this origin node is currently being used by the [XRServer]. Only one origin point can be used at a time. */
        get current(): boolean
        set current(value: boolean)
    }
    namespace XRPose {
        enum TrackingConfidence {
            /** No tracking information is available for this pose. */
            XR_TRACKING_CONFIDENCE_NONE = 0,
            
            /** Tracking information may be inaccurate or estimated. For example, with inside out tracking this would indicate a controller may be (partially) obscured. */
            XR_TRACKING_CONFIDENCE_LOW = 1,
            
            /** Tracking information is considered accurate and up to date. */
            XR_TRACKING_CONFIDENCE_HIGH = 2,
        }
    }
    /** This object contains all data related to a pose on a tracked object.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrpose.html  
     */
    class XRPose extends RefCounted {
        constructor(identifier?: any)
        set_name(name: StringName): void
        get_name(): StringName
        
        /** Returns the [member transform] with world scale and our reference frame applied. This is the transform used to position [XRNode3D] objects. */
        get_adjusted_transform(): Transform3D
        
        /** If `true` our tracking data is up to date. If `false` we're no longer receiving new tracking data and our state is whatever that last valid state was. */
        get has_tracking_data(): boolean
        set has_tracking_data(value: boolean)
        
        /** The transform containing the original and transform as reported by the XR runtime. */
        get transform(): string
        set transform(value: string)
        
        /** The linear velocity of this pose. */
        get linear_velocity(): string
        set linear_velocity(value: string)
        
        /** The angular velocity for this pose. */
        get angular_velocity(): string
        set angular_velocity(value: string)
        
        /** The tracking confidence for this pose, provides insight on how accurate the spatial positioning of this record is. */
        get tracking_confidence(): int64
        set tracking_confidence(value: int64)
    }
    namespace XRPositionalTracker {
        enum TrackerHand {
            /** The hand this tracker is held in is unknown or not applicable. */
            TRACKER_HAND_UNKNOWN = 0,
            
            /** This tracker is the left hand controller. */
            TRACKER_HAND_LEFT = 1,
            
            /** This tracker is the right hand controller. */
            TRACKER_HAND_RIGHT = 2,
            
            /** Represents the size of the [enum TrackerHand] enum. */
            TRACKER_HAND_MAX = 3,
        }
    }
    /** A tracked object.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrpositionaltracker.html  
     */
    class XRPositionalTracker extends XRTracker {
        constructor(identifier?: any)
        /** Returns `true` if the tracker is available and is currently tracking the bound [param name] pose. */
        has_pose(name: StringName): boolean
        
        /** Returns the current [XRPose] state object for the bound [param name] pose. */
        get_pose(name: StringName): XRPose
        
        /** Marks this pose as invalid, we don't clear the last reported state but it allows users to decide if trackers need to be hidden if we lose tracking or just remain at their last known position. */
        invalidate_pose(name: StringName): void
        
        /** Sets the transform, linear velocity, angular velocity and tracking confidence for the given pose. This method is called by a [XRInterface] implementation and should not be used directly. */
        set_pose(name: StringName, transform: Transform3D, linear_velocity: Vector3, angular_velocity: Vector3, tracking_confidence: XRPose.TrackingConfidence): void
        
        /** Returns an input for this tracker. It can return a boolean, float or [Vector2] value depending on whether the input is a button, trigger or thumbstick/thumbpad. */
        get_input(name: StringName): any
        
        /** Changes the value for the given input. This method is called by a [XRInterface] implementation and should not be used directly. */
        set_input(name: StringName, value: any): void
        
        /** The profile associated with this tracker, interface dependent but will indicate the type of controller being tracked. */
        get profile(): string
        set profile(value: string)
        
        /** Defines which hand this tracker relates to. */
        get hand(): int64
        set hand(value: int64)
        
        /** Emitted when the state of a pose tracked by this tracker changes. */
        readonly pose_changed: Signal1<XRPose>
        
        /** Emitted when a pose tracked by this tracker stops getting updated tracking data. */
        readonly pose_lost_tracking: Signal1<XRPose>
        
        /** Emitted when a button on this tracker is pressed. Note that many XR runtimes allow other inputs to be mapped to buttons. */
        readonly button_pressed: Signal1<string>
        
        /** Emitted when a button on this tracker is released. */
        readonly button_released: Signal1<string>
        
        /** Emitted when a trigger or similar input on this tracker changes value. */
        readonly input_float_changed: Signal2<string, float64>
        
        /** Emitted when a thumbstick or thumbpad on this tracker moves. */
        readonly input_vector2_changed: Signal2<string, Vector2>
        
        /** Emitted when the profile of our tracker changes. */
        readonly profile_changed: Signal1<string>
    }
    /** A tracked object.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrtracker.html  
     */
    class XRTracker extends RefCounted {
        constructor(identifier?: any)
        get_tracker_name(): StringName
        set_tracker_name(name: StringName): void
        
        /** The type of tracker. */
        get type(): int64
        set type(value: int64)
        
        /** The description of this tracker. */
        get description(): string
        set description(value: string)
    }
    /** Helper class for XR interfaces that generates VRS images.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrvrs.html  
     */
    class XRVRS extends Object {
        constructor(identifier?: any)
        /** Generates the VRS texture based on a render [param target_size] adjusted by our VRS tile size. For each eyes focal point passed in [param eye_foci] a layer is created. Focal point should be in NDC.  
         *  The result will be cached, requesting a VRS texture with unchanged parameters and settings will return the cached RID.  
         */
        make_vrs_texture(target_size: Vector2, eye_foci: PackedVector2Array | Vector2[]): RID
        
        /** The minimum radius around the focal point where full quality is guaranteed if VRS is used as a percentage of screen size. */
        get vrs_min_radius(): float64
        set vrs_min_radius(value: float64)
        
        /** The strength used to calculate the VRS density map. The greater this value, the more noticeable VRS is. */
        get vrs_strength(): float64
        set vrs_strength(value: float64)
        
        /** The render region that the VRS texture will be scaled to when generated. */
        get vrs_render_region(): Rect2i
        set vrs_render_region(value: Rect2i)
    }
    namespace ZIPPacker {
        enum ZipAppend {
            /** Create a new zip archive at the given path. */
            APPEND_CREATE = 0,
            
            /** Append a new zip archive to the end of the already existing file at the given path. */
            APPEND_CREATEAFTER = 1,
            
            /** Add new files to the existing zip archive at the given path. */
            APPEND_ADDINZIP = 2,
        }
    }
    /** Allows the creation of ZIP files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_zippacker.html  
     */
    class ZIPPacker extends RefCounted {
        constructor(identifier?: any)
        /** Opens a zip file for writing at the given path using the specified write mode.  
         *  This must be called before everything else.  
         */
        open(path: string, append: ZIPPacker.ZipAppend = 0): GError
        
        /** Starts writing to a file within the archive. Only one file can be written at the same time.  
         *  Must be called after [method open].  
         */
        start_file(path: string): GError
        
        /** Write the given [param data] to the file.  
         *  Needs to be called after [method start_file].  
         */
        write_file(data: PackedByteArray | byte[] | ArrayBuffer): GError
        
        /** Stops writing to a file within the archive.  
         *  It will fail if there is no open file.  
         */
        close_file(): GError
        
        /** Closes the underlying resources used by this instance. */
        close(): GError
    }
    /** Allows reading the content of a ZIP file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_zipreader.html  
     */
    class ZIPReader extends RefCounted {
        constructor(identifier?: any)
        /** Opens the zip archive at the given [param path] and reads its file index. */
        open(path: string): GError
        
        /** Closes the underlying resources used by this instance. */
        close(): GError
        
        /** Returns the list of names of all files in the loaded archive.  
         *  Must be called after [method open].  
         */
        get_files(): PackedStringArray
        
        /** Loads the whole content of a file in the loaded zip archive into memory and returns it.  
         *  Must be called after [method open].  
         */
        read_file(path: string, case_sensitive: boolean = true): PackedByteArray
        
        /** Returns `true` if the file exists in the loaded zip archive.  
         *  Must be called after [method open].  
         */
        file_exists(path: string, case_sensitive: boolean = true): boolean
    }
    namespace Vector2 {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
        }
    }
    /** A 2D vector using floating-point coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_vector2.html  
     */
    class Vector2 {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Vector2
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Vector2
        
        /** Infinity vector, a vector with all components set to [constant @GDScript.INF]. */
        static readonly INF: Vector2
        
        /** Left unit vector. Represents the direction of left. */
        static readonly LEFT: Vector2
        
        /** Right unit vector. Represents the direction of right. */
        static readonly RIGHT: Vector2
        
        /** Up unit vector. Y is down in 2D, so this vector points -Y. */
        static readonly UP: Vector2
        
        /** Down unit vector. Y is down in 2D, so this vector points +Y. */
        static readonly DOWN: Vector2
        constructor()
        constructor(from: Vector2)
        constructor(from: Vector2i)
        constructor(x: float64, y: float64)
        
        /** Returns this vector's angle with respect to the positive X axis, or `(1, 0)` vector, in radians.  
         *  For example, `Vector2.RIGHT.angle()` will return zero, `Vector2.DOWN.angle()` will return `PI / 2` (a quarter turn, or 90 degrees), and `Vector2(1, -1).angle()` will return `-PI / 4` (a negative eighth turn, or -45 degrees).  
         *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/vector2_angle.png]Illustration of the returned angle.[/url]  
         *  Equivalent to the result of [method @GlobalScope.atan2] when called with the vector's [member y] and [member x] as parameters: `atan2(y, x)`.  
         */
        angle(): float64
        
        /** Returns the signed angle to the given vector, in radians.  
         *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/vector2_angle_to.png]Illustration of the returned angle.[/url]  
         */
        angle_to(to: Vector2): float64
        
        /** Returns the angle between the line connecting the two points and the X axis, in radians.  
         *  `a.angle_to_point(b)` is equivalent of doing `(b - a).angle()`.  
         *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/vector2_angle_to_point.png]Illustration of the returned angle.[/url]  
         */
        angle_to_point(to: Vector2): float64
        
        /** Returns the normalized vector pointing from this vector to [param to]. This is equivalent to using `(b - a).normalized()`. */
        direction_to(to: Vector2): Vector2
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector2): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector2): float64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): float64
        
        /** Returns the vector with a maximum length by limiting its length to [param length]. If the vector is non-finite, the result is undefined. */
        limit_length(length: float64 = 1): Vector2
        
        /** Returns the result of scaling the vector to unit length. Equivalent to `v / v.length()`. Returns `(0, 0)` if `v.length() == 0`. See also [method is_normalized].  
         *      
         *  **Note:** This function may return incorrect values if the input vector length is near zero.  
         */
        normalized(): Vector2
        
        /** Returns `true` if the vector is normalized, i.e. its length is approximately equal to 1. */
        is_normalized(): boolean
        
        /** Returns `true` if this vector and [param to] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Vector2): boolean
        
        /** Returns `true` if this vector's values are approximately zero, by running [method @GlobalScope.is_zero_approx] on each component.  
         *  This method is faster than using [method is_equal_approx] with one value as a zero vector.  
         */
        is_zero_approx(): boolean
        
        /** Returns `true` if this vector is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param mod]. */
        posmod(mod: float64): Vector2
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param modv]'s components. */
        posmodv(modv: Vector2): Vector2
        
        /** Returns a new vector resulting from projecting this vector onto the given vector [param b]. The resulting new vector is parallel to [param b]. See also [method slide].  
         *      
         *  **Note:** If the vector [param b] is a zero vector, the components of the resulting new vector will be [constant @GDScript.NAN].  
         */
        project(b: Vector2): Vector2
        
        /** Returns the result of the linear interpolation between this vector and [param to] by amount [param weight]. [param weight] is on the range of `0.0` to `1.0`, representing the amount of interpolation. */
        lerp(to: Vector2, weight: float64): Vector2
        
        /** Returns the result of spherical linear interpolation between this vector and [param to], by amount [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  This method also handles interpolating the lengths if the input vectors have different lengths. For the special case of one or both input vectors having zero length, this method behaves like [method lerp].  
         */
        slerp(to: Vector2, weight: float64): Vector2
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation. */
        cubic_interpolate(b: Vector2, pre_a: Vector2, post_b: Vector2, weight: float64): Vector2
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  It can perform smoother interpolation than [method cubic_interpolate] by the time values.  
         */
        cubic_interpolate_in_time(b: Vector2, pre_a: Vector2, post_b: Vector2, weight: float64, b_t: float64, pre_a_t: float64, post_b_t: float64): Vector2
        
        /** Returns the point at the given [param t] on the [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by this vector and the given [param control_1], [param control_2], and [param end] points. */
        bezier_interpolate(control_1: Vector2, control_2: Vector2, end: Vector2, t: float64): Vector2
        
        /** Returns the derivative at the given [param t] on the [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by this vector and the given [param control_1], [param control_2], and [param end] points. */
        bezier_derivative(control_1: Vector2, control_2: Vector2, end: Vector2, t: float64): Vector2
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_Y]. */
        min_axis_index(): int64
        
        /** Returns a new vector moved toward [param to] by the fixed [param delta] amount. Will not go past the final value. */
        move_toward(to: Vector2, delta: float64): Vector2
        
        /** Returns the result of rotating this vector by [param angle] (in radians). See also [method @GlobalScope.deg_to_rad]. */
        rotated(angle: float64): Vector2
        
        /** Returns a perpendicular vector rotated 90 degrees counter-clockwise compared to the original, with the same length. */
        orthogonal(): Vector2
        
        /** Returns a new vector with all components rounded down (towards negative infinity). */
        floor(): Vector2
        
        /** Returns a new vector with all components rounded up (towards positive infinity). */
        ceil(): Vector2
        
        /** Returns a new vector with all components rounded to the nearest integer, with halfway cases rounded away from zero. */
        round(): Vector2
        
        /** Returns the aspect ratio of this vector, the ratio of [member x] to [member y]. */
        aspect(): float64
        
        /** Returns the dot product of this vector and [param with]. This can be used to compare the angle between two vectors. For example, this can be used to determine whether an enemy is facing the player.  
         *  The dot product will be `0` for a right angle (90 degrees), greater than 0 for angles narrower than 90 degrees and lower than 0 for angles wider than 90 degrees.  
         *  When using unit (normalized) vectors, the result will always be between `-1.0` (180 degree angle) when the vectors are facing opposite directions, and `1.0` (0 degree angle) when the vectors are aligned.  
         *      
         *  **Note:** `a.dot(b)` is equivalent to `b.dot(a)`.  
         */
        dot(with_: Vector2): float64
        
        /** Returns a new vector resulting from sliding this vector along a line with normal [param n]. The resulting new vector is perpendicular to [param n], and is equivalent to this vector minus its projection on [param n]. See also [method project].  
         *      
         *  **Note:** The vector [param n] must be normalized. See also [method normalized].  
         */
        slide(n: Vector2): Vector2
        
        /** Returns the vector "bounced off" from a line defined by the given normal [param n] perpendicular to the line.  
         *      
         *  **Note:** [method bounce] performs the operation that most engines and frameworks call [code skip-lint]reflect()`.  
         */
        bounce(n: Vector2): Vector2
        
        /** Returns the result of reflecting the vector from a line defined by the given direction vector [param line].  
         *      
         *  **Note:** [method reflect] differs from what other engines and frameworks call [code skip-lint]reflect()`. In other engines, [code skip-lint]reflect()` takes a normal direction which is a direction perpendicular to the line. In Godot, you specify the direction of the line directly. See also [method bounce] which does what most engines call [code skip-lint]reflect()`.  
         */
        reflect(line: Vector2): Vector2
        
        /** Returns the 2D analog of the cross product for this vector and [param with].  
         *  This is the signed area of the parallelogram formed by the two vectors. If the second vector is clockwise from the first vector, then the cross product is the positive area. If counter-clockwise, the cross product is the negative area. If the two vectors are parallel this returns zero, making it useful for testing if two vectors are parallel.  
         *      
         *  **Note:** Cross product is not defined in 2D mathematically. This method embeds the 2D vectors in the XY plane of 3D space and uses their cross product's Z component as the analog.  
         */
        cross(with_: Vector2): float64
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector2
        
        /** Returns a new vector with each component set to `1.0` if it's positive, `-1.0` if it's negative, and `0.0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector2
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector2, max: Vector2): Vector2
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampf(min: float64, max: float64): Vector2
        
        /** Returns a new vector with each component snapped to the nearest multiple of the corresponding component in [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snapped(step: Vector2): Vector2
        
        /** Returns a new vector with each component snapped to the nearest multiple of [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snappedf(step: float64): Vector2
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector2(minf(x, with.x), minf(y, with.y))`. */
        min(with_: Vector2): Vector2
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector2(minf(x, with), minf(y, with))`. */
        minf(with_: float64): Vector2
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector2(maxf(x, with.x), maxf(y, with.y))`. */
        max(with_: Vector2): Vector2
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector2(maxf(x, with), maxf(y, with))`. */
        maxf(with_: float64): Vector2
        
        /** Creates a unit [Vector2] rotated to the given [param angle] in radians. This is equivalent to doing `Vector2(cos(angle), sin(angle))` or `Vector2.RIGHT.rotated(angle)`.  
         *    
         */
        static from_angle(angle: float64): Vector2
        static ADD(left: Vector2, right: Vector2): Vector2
        static SUBTRACT(left: Vector2, right: Vector2): Vector2
        static MULTIPLY(left: float64, right: Vector2): Vector2
        static MULTIPLY(left: Vector2, right: Vector2): Vector2
        static MULTIPLY(left: Vector2, right: float64): Vector2
        static DIVIDE(left: Vector2, right: Vector2): Vector2
        static DIVIDE(left: Vector2, right: float64): Vector2
        static NEGATE(left: Vector2): Vector2
        static EQUAL(left: Vector2, right: Vector2): boolean
        static NOT_EQUAL(left: Vector2, right: Vector2): boolean
        static LESS(left: Vector2, right: Vector2): boolean
        static LESS_EQUAL(left: Vector2, right: Vector2): boolean
        static GREATER(left: Vector2, right: Vector2): boolean
        static GREATER_EQUAL(left: Vector2, right: Vector2): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
    }
    namespace Vector2i {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
        }
    }
    /** A 2D vector using integer coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_vector2i.html  
     */
    class Vector2i {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Vector2i
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Vector2i
        
        /** Min vector, a vector with all components equal to `INT32_MIN`. Can be used as a negative integer equivalent of [constant Vector2.INF]. */
        static readonly MIN: Vector2i
        
        /** Max vector, a vector with all components equal to `INT32_MAX`. Can be used as an integer equivalent of [constant Vector2.INF]. */
        static readonly MAX: Vector2i
        
        /** Left unit vector. Represents the direction of left. */
        static readonly LEFT: Vector2i
        
        /** Right unit vector. Represents the direction of right. */
        static readonly RIGHT: Vector2i
        
        /** Up unit vector. Y is down in 2D, so this vector points -Y. */
        static readonly UP: Vector2i
        
        /** Down unit vector. Y is down in 2D, so this vector points +Y. */
        static readonly DOWN: Vector2i
        constructor()
        constructor(from: Vector2i)
        constructor(from: Vector2)
        constructor(x: int64, y: int64)
        
        /** Returns the aspect ratio of this vector, the ratio of [member x] to [member y]. */
        aspect(): float64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_Y]. */
        min_axis_index(): int64
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector2i): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector2i): int64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): int64
        
        /** Returns a new vector with each component set to `1` if it's positive, `-1` if it's negative, and `0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector2i
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector2i
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector2i, max: Vector2i): Vector2i
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampi(min: int64, max: int64): Vector2i
        
        /** Returns a new vector with each component snapped to the closest multiple of the corresponding component in [param step]. */
        snapped(step: Vector2i): Vector2i
        
        /** Returns a new vector with each component snapped to the closest multiple of [param step]. */
        snappedi(step: int64): Vector2i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector2i(mini(x, with.x), mini(y, with.y))`. */
        min(with_: Vector2i): Vector2i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector2i(mini(x, with), mini(y, with))`. */
        mini(with_: int64): Vector2i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector2i(maxi(x, with.x), maxi(y, with.y))`. */
        max(with_: Vector2i): Vector2i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector2i(maxi(x, with), maxi(y, with))`. */
        maxi(with_: int64): Vector2i
        static ADD(left: Vector2i, right: Vector2i): Vector2i
        static SUBTRACT(left: Vector2i, right: Vector2i): Vector2i
        static MULTIPLY(left: float64, right: Vector2i): Vector2i
        static MULTIPLY(left: Vector2i, right: Vector2i): Vector2i
        static MULTIPLY(left: Vector2i, right: float64): Vector2i
        static DIVIDE(left: Vector2i, right: Vector2i): Vector2i
        static DIVIDE(left: Vector2i, right: float64): Vector2i
        static NEGATE(left: Vector2i): Vector2i
        static EQUAL(left: Vector2i, right: Vector2i): boolean
        static NOT_EQUAL(left: Vector2i, right: Vector2i): boolean
        static LESS(left: Vector2i, right: Vector2i): boolean
        static LESS_EQUAL(left: Vector2i, right: Vector2i): boolean
        static GREATER(left: Vector2i, right: Vector2i): boolean
        static GREATER_EQUAL(left: Vector2i, right: Vector2i): boolean
        get x(): int64
        set x(value: int64)
        get y(): int64
        set y(value: int64)
    }
    /** A 2D axis-aligned bounding box using floating-point coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rect2.html  
     */
    class Rect2 {
        constructor()
        constructor(from: Rect2)
        constructor(from: Rect2i)
        constructor(position: Vector2, size: Vector2)
        constructor(x: float64, y: float64, width: float64, height: float64)
        
        /** Returns the center point of the rectangle. This is the same as `position + (size / 2.0)`. */
        get_center(): Vector2
        
        /** Returns the rectangle's area. This is equivalent to `size.x * size.y`. See also [method has_area]. */
        get_area(): float64
        
        /** Returns `true` if this rectangle has positive width and height. See also [method get_area]. */
        has_area(): boolean
        
        /** Returns `true` if the rectangle contains the given [param point]. By convention, points on the right and bottom edges are **not** included.  
         *      
         *  **Note:** This method is not reliable for [Rect2] with a  *negative*  [member size]. Use [method abs] first to get a valid rectangle.  
         */
        has_point(point: Vector2): boolean
        
        /** Returns `true` if this rectangle and [param rect] are approximately equal, by calling [method Vector2.is_equal_approx] on the [member position] and the [member size]. */
        is_equal_approx(rect: Rect2): boolean
        
        /** Returns `true` if this rectangle's values are finite, by calling [method Vector2.is_finite] on the [member position] and the [member size]. */
        is_finite(): boolean
        
        /** Returns `true` if this rectangle overlaps with the [param b] rectangle. The edges of both rectangles are excluded, unless [param include_borders] is `true`. */
        intersects(b: Rect2, include_borders: boolean = false): boolean
        
        /** Returns `true` if this rectangle  *completely*  encloses the [param b] rectangle. */
        encloses(b: Rect2): boolean
        
        /** Returns the intersection between this rectangle and [param b]. If the rectangles do not intersect, returns an empty [Rect2].  
         *    
         *      
         *  **Note:** If you only need to know whether two rectangles are overlapping, use [method intersects], instead.  
         */
        intersection(b: Rect2): Rect2
        
        /** Returns a [Rect2] that encloses both this rectangle and [param b] around the edges. See also [method encloses]. */
        merge(b: Rect2): Rect2
        
        /** Returns a copy of this rectangle expanded to align the edges with the given [param to] point, if necessary.  
         *    
         */
        expand(to: Vector2): Rect2
        
        /** Returns the vertex's position of this rect that's the farthest in the given direction. This point is commonly known as the support point in collision detection algorithms. */
        get_support(direction: Vector2): Vector2
        
        /** Returns a copy of this rectangle extended on all sides by the given [param amount]. A negative [param amount] shrinks the rectangle instead. See also [method grow_individual] and [method grow_side].  
         *    
         */
        grow(amount: float64): Rect2
        
        /** Returns a copy of this rectangle with its [param side] extended by the given [param amount] (see [enum Side] constants). A negative [param amount] shrinks the rectangle, instead. See also [method grow] and [method grow_individual]. */
        grow_side(side: int64, amount: float64): Rect2
        
        /** Returns a copy of this rectangle with its [param left], [param top], [param right], and [param bottom] sides extended by the given amounts. Negative values shrink the sides, instead. See also [method grow] and [method grow_side]. */
        grow_individual(left: float64, top: float64, right: float64, bottom: float64): Rect2
        
        /** Returns a [Rect2] equivalent to this rectangle, with its width and height modified to be non-negative values, and with its [member position] being the top-left corner of the rectangle.  
         *    
         *      
         *  **Note:** It's recommended to use this method when [member size] is negative, as most other methods in Godot assume that the [member position] is the top-left corner, and the [member end] is the bottom-right corner.  
         */
        abs(): Rect2
        get position(): Vector2
        set position(value: Vector2)
        get size(): Vector2
        set size(value: Vector2)
        get end(): Vector2
        set end(value: Vector2)
    }
    /** A 2D axis-aligned bounding box using integer coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rect2i.html  
     */
    class Rect2i {
        constructor()
        constructor(from: Rect2i)
        constructor(from: Rect2)
        constructor(position: Vector2i, size: Vector2i)
        constructor(x: int64, y: int64, width: int64, height: int64)
        
        /** Returns the center point of the rectangle. This is the same as `position + (size / 2)`.  
         *      
         *  **Note:** If the [member size] is odd, the result will be rounded towards [member position].  
         */
        get_center(): Vector2i
        
        /** Returns the rectangle's area. This is equivalent to `size.x * size.y`. See also [method has_area]. */
        get_area(): int64
        
        /** Returns `true` if this rectangle has positive width and height. See also [method get_area]. */
        has_area(): boolean
        
        /** Returns `true` if the rectangle contains the given [param point]. By convention, points on the right and bottom edges are **not** included.  
         *      
         *  **Note:** This method is not reliable for [Rect2i] with a  *negative*  [member size]. Use [method abs] first to get a valid rectangle.  
         */
        has_point(point: Vector2i): boolean
        
        /** Returns `true` if this rectangle overlaps with the [param b] rectangle. The edges of both rectangles are excluded. */
        intersects(b: Rect2i): boolean
        
        /** Returns `true` if this [Rect2i] completely encloses another one. */
        encloses(b: Rect2i): boolean
        
        /** Returns the intersection between this rectangle and [param b]. If the rectangles do not intersect, returns an empty [Rect2i].  
         *    
         *      
         *  **Note:** If you only need to know whether two rectangles are overlapping, use [method intersects], instead.  
         */
        intersection(b: Rect2i): Rect2i
        
        /** Returns a [Rect2i] that encloses both this rectangle and [param b] around the edges. See also [method encloses]. */
        merge(b: Rect2i): Rect2i
        
        /** Returns a copy of this rectangle expanded to align the edges with the given [param to] point, if necessary.  
         *    
         */
        expand(to: Vector2i): Rect2i
        
        /** Returns a copy of this rectangle extended on all sides by the given [param amount]. A negative [param amount] shrinks the rectangle instead. See also [method grow_individual] and [method grow_side].  
         *    
         */
        grow(amount: int64): Rect2i
        
        /** Returns a copy of this rectangle with its [param side] extended by the given [param amount] (see [enum Side] constants). A negative [param amount] shrinks the rectangle, instead. See also [method grow] and [method grow_individual]. */
        grow_side(side: int64, amount: int64): Rect2i
        
        /** Returns a copy of this rectangle with its [param left], [param top], [param right], and [param bottom] sides extended by the given amounts. Negative values shrink the sides, instead. See also [method grow] and [method grow_side]. */
        grow_individual(left: int64, top: int64, right: int64, bottom: int64): Rect2i
        
        /** Returns a [Rect2i] equivalent to this rectangle, with its width and height modified to be non-negative values, and with its [member position] being the top-left corner of the rectangle.  
         *    
         *      
         *  **Note:** It's recommended to use this method when [member size] is negative, as most other methods in Godot assume that the [member position] is the top-left corner, and the [member end] is the bottom-right corner.  
         */
        abs(): Rect2i
        get position(): Vector2i
        set position(value: Vector2i)
        get size(): Vector2i
        set size(value: Vector2i)
        get end(): Vector2i
        set end(value: Vector2i)
    }
    namespace Vector3 {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
            
            /** Enumerated value for the Z axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Z = 2,
        }
    }
    /** A 3D vector using floating-point coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_vector3.html  
     */
    class Vector3 {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Vector3
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Vector3
        
        /** Infinity vector, a vector with all components set to [constant @GDScript.INF]. */
        static readonly INF: Vector3
        
        /** Left unit vector. Represents the local direction of left, and the global direction of west. */
        static readonly LEFT: Vector3
        
        /** Right unit vector. Represents the local direction of right, and the global direction of east. */
        static readonly RIGHT: Vector3
        
        /** Up unit vector. */
        static readonly UP: Vector3
        
        /** Down unit vector. */
        static readonly DOWN: Vector3
        
        /** Forward unit vector. Represents the local direction of forward, and the global direction of north. Keep in mind that the forward direction for lights, cameras, etc is different from 3D assets like characters, which face towards the camera by convention. Use [constant Vector3.MODEL_FRONT] and similar constants when working in 3D asset space. */
        static readonly FORWARD: Vector3
        
        /** Back unit vector. Represents the local direction of back, and the global direction of south. */
        static readonly BACK: Vector3
        
        /** Unit vector pointing towards the left side of imported 3D assets. */
        static readonly MODEL_LEFT: Vector3
        
        /** Unit vector pointing towards the right side of imported 3D assets. */
        static readonly MODEL_RIGHT: Vector3
        
        /** Unit vector pointing towards the top side (up) of imported 3D assets. */
        static readonly MODEL_TOP: Vector3
        
        /** Unit vector pointing towards the bottom side (down) of imported 3D assets. */
        static readonly MODEL_BOTTOM: Vector3
        
        /** Unit vector pointing towards the front side (facing forward) of imported 3D assets. */
        static readonly MODEL_FRONT: Vector3
        
        /** Unit vector pointing towards the rear side (back) of imported 3D assets. */
        static readonly MODEL_REAR: Vector3
        constructor()
        constructor(from: Vector3)
        constructor(from: Vector3i)
        constructor(x: float64, y: float64, z: float64)
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_Z]. */
        min_axis_index(): int64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the unsigned minimum angle to the given vector, in radians. */
        angle_to(to: Vector3): float64
        
        /** Returns the signed angle to the given vector, in radians. The sign of the angle is positive in a counter-clockwise direction and negative in a clockwise direction when viewed from the side specified by the [param axis]. */
        signed_angle_to(to: Vector3, axis: Vector3): float64
        
        /** Returns the normalized vector pointing from this vector to [param to]. This is equivalent to using `(b - a).normalized()`. */
        direction_to(to: Vector3): Vector3
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector3): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector3): float64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): float64
        
        /** Returns the vector with a maximum length by limiting its length to [param length]. If the vector is non-finite, the result is undefined. */
        limit_length(length: float64 = 1): Vector3
        
        /** Returns the result of scaling the vector to unit length. Equivalent to `v / v.length()`. Returns `(0, 0, 0)` if `v.length() == 0`. See also [method is_normalized].  
         *      
         *  **Note:** This function may return incorrect values if the input vector length is near zero.  
         */
        normalized(): Vector3
        
        /** Returns `true` if the vector is normalized, i.e. its length is approximately equal to 1. */
        is_normalized(): boolean
        
        /** Returns `true` if this vector and [param to] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Vector3): boolean
        
        /** Returns `true` if this vector's values are approximately zero, by running [method @GlobalScope.is_zero_approx] on each component.  
         *  This method is faster than using [method is_equal_approx] with one value as a zero vector.  
         */
        is_zero_approx(): boolean
        
        /** Returns `true` if this vector is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns the inverse of the vector. This is the same as `Vector3(1.0 / v.x, 1.0 / v.y, 1.0 / v.z)`. */
        inverse(): Vector3
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector3, max: Vector3): Vector3
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampf(min: float64, max: float64): Vector3
        
        /** Returns a new vector with each component snapped to the nearest multiple of the corresponding component in [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snapped(step: Vector3): Vector3
        
        /** Returns a new vector with each component snapped to the nearest multiple of [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snappedf(step: float64): Vector3
        
        /** Returns the result of rotating this vector around a given axis by [param angle] (in radians). The axis must be a normalized vector. See also [method @GlobalScope.deg_to_rad]. */
        rotated(axis: Vector3, angle: float64): Vector3
        
        /** Returns the result of the linear interpolation between this vector and [param to] by amount [param weight]. [param weight] is on the range of `0.0` to `1.0`, representing the amount of interpolation. */
        lerp(to: Vector3, weight: float64): Vector3
        
        /** Returns the result of spherical linear interpolation between this vector and [param to], by amount [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  This method also handles interpolating the lengths if the input vectors have different lengths. For the special case of one or both input vectors having zero length, this method behaves like [method lerp].  
         */
        slerp(to: Vector3, weight: float64): Vector3
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation. */
        cubic_interpolate(b: Vector3, pre_a: Vector3, post_b: Vector3, weight: float64): Vector3
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  It can perform smoother interpolation than [method cubic_interpolate] by the time values.  
         */
        cubic_interpolate_in_time(b: Vector3, pre_a: Vector3, post_b: Vector3, weight: float64, b_t: float64, pre_a_t: float64, post_b_t: float64): Vector3
        
        /** Returns the point at the given [param t] on the [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by this vector and the given [param control_1], [param control_2], and [param end] points. */
        bezier_interpolate(control_1: Vector3, control_2: Vector3, end: Vector3, t: float64): Vector3
        
        /** Returns the derivative at the given [param t] on the [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by this vector and the given [param control_1], [param control_2], and [param end] points. */
        bezier_derivative(control_1: Vector3, control_2: Vector3, end: Vector3, t: float64): Vector3
        
        /** Returns a new vector moved toward [param to] by the fixed [param delta] amount. Will not go past the final value. */
        move_toward(to: Vector3, delta: float64): Vector3
        
        /** Returns the dot product of this vector and [param with]. This can be used to compare the angle between two vectors. For example, this can be used to determine whether an enemy is facing the player.  
         *  The dot product will be `0` for a right angle (90 degrees), greater than 0 for angles narrower than 90 degrees and lower than 0 for angles wider than 90 degrees.  
         *  When using unit (normalized) vectors, the result will always be between `-1.0` (180 degree angle) when the vectors are facing opposite directions, and `1.0` (0 degree angle) when the vectors are aligned.  
         *      
         *  **Note:** `a.dot(b)` is equivalent to `b.dot(a)`.  
         */
        dot(with_: Vector3): float64
        
        /** Returns the cross product of this vector and [param with].  
         *  This returns a vector perpendicular to both this and [param with], which would be the normal vector of the plane defined by the two vectors. As there are two such vectors, in opposite directions, this method returns the vector defined by a right-handed coordinate system. If the two vectors are parallel this returns an empty vector, making it useful for testing if two vectors are parallel.  
         */
        cross(with_: Vector3): Vector3
        
        /** Returns the outer product with [param with]. */
        outer(with_: Vector3): Basis
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector3
        
        /** Returns a new vector with all components rounded down (towards negative infinity). */
        floor(): Vector3
        
        /** Returns a new vector with all components rounded up (towards positive infinity). */
        ceil(): Vector3
        
        /** Returns a new vector with all components rounded to the nearest integer, with halfway cases rounded away from zero. */
        round(): Vector3
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param mod]. */
        posmod(mod: float64): Vector3
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param modv]'s components. */
        posmodv(modv: Vector3): Vector3
        
        /** Returns a new vector resulting from projecting this vector onto the given vector [param b]. The resulting new vector is parallel to [param b]. See also [method slide].  
         *      
         *  **Note:** If the vector [param b] is a zero vector, the components of the resulting new vector will be [constant @GDScript.NAN].  
         */
        project(b: Vector3): Vector3
        
        /** Returns a new vector resulting from sliding this vector along a plane with normal [param n]. The resulting new vector is perpendicular to [param n], and is equivalent to this vector minus its projection on [param n]. See also [method project].  
         *      
         *  **Note:** The vector [param n] must be normalized. See also [method normalized].  
         */
        slide(n: Vector3): Vector3
        
        /** Returns the vector "bounced off" from a plane defined by the given normal [param n].  
         *      
         *  **Note:** [method bounce] performs the operation that most engines and frameworks call [code skip-lint]reflect()`.  
         */
        bounce(n: Vector3): Vector3
        
        /** Returns the result of reflecting the vector through a plane defined by the given normal vector [param n].  
         *      
         *  **Note:** [method reflect] differs from what other engines and frameworks call [code skip-lint]reflect()`. In other engines, [code skip-lint]reflect()` returns the result of the vector reflected by the given plane. The reflection thus passes through the given normal. While in Godot the reflection passes through the plane and can be thought of as bouncing off the normal. See also [method bounce] which does what most engines call [code skip-lint]reflect()`.  
         */
        reflect(n: Vector3): Vector3
        
        /** Returns a new vector with each component set to `1.0` if it's positive, `-1.0` if it's negative, and `0.0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector3
        
        /** Returns the octahedral-encoded (oct32) form of this [Vector3] as a [Vector2]. Since a [Vector2] occupies 1/3 less memory compared to [Vector3], this form of compression can be used to pass greater amounts of [method normalized] [Vector3]s without increasing storage or memory requirements. See also [method octahedron_decode].  
         *      
         *  **Note:** [method octahedron_encode] can only be used for [method normalized] vectors. [method octahedron_encode] does  *not*  check whether this [Vector3] is normalized, and will return a value that does not decompress to the original value if the [Vector3] is not normalized.  
         *      
         *  **Note:** Octahedral compression is  *lossy* , although visual differences are rarely perceptible in real world scenarios.  
         */
        octahedron_encode(): Vector2
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector3(minf(x, with.x), minf(y, with.y), minf(z, with.z))`. */
        min(with_: Vector3): Vector3
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector3(minf(x, with), minf(y, with), minf(z, with))`. */
        minf(with_: float64): Vector3
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector3(maxf(x, with.x), maxf(y, with.y), maxf(z, with.z))`. */
        max(with_: Vector3): Vector3
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector3(maxf(x, with), maxf(y, with), maxf(z, with))`. */
        maxf(with_: float64): Vector3
        
        /** Returns the [Vector3] from an octahedral-compressed form created using [method octahedron_encode] (stored as a [Vector2]). */
        static octahedron_decode(uv: Vector2): Vector3
        static ADD(left: Vector3, right: Vector3): Vector3
        static SUBTRACT(left: Vector3, right: Vector3): Vector3
        static MULTIPLY(left: float64, right: Vector3): Vector3
        static MULTIPLY(left: Vector3, right: Vector3): Vector3
        static MULTIPLY(left: Vector3, right: float64): Vector3
        static DIVIDE(left: Vector3, right: Vector3): Vector3
        static DIVIDE(left: Vector3, right: float64): Vector3
        static NEGATE(left: Vector3): Vector3
        static EQUAL(left: Vector3, right: Vector3): boolean
        static NOT_EQUAL(left: Vector3, right: Vector3): boolean
        static LESS(left: Vector3, right: Vector3): boolean
        static LESS_EQUAL(left: Vector3, right: Vector3): boolean
        static GREATER(left: Vector3, right: Vector3): boolean
        static GREATER_EQUAL(left: Vector3, right: Vector3): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
        get z(): float64
        set z(value: float64)
    }
    namespace Vector3i {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
            
            /** Enumerated value for the Z axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Z = 2,
        }
    }
    /** A 3D vector using integer coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_vector3i.html  
     */
    class Vector3i {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Vector3i
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Vector3i
        
        /** Min vector, a vector with all components equal to `INT32_MIN`. Can be used as a negative integer equivalent of [constant Vector3.INF]. */
        static readonly MIN: Vector3i
        
        /** Max vector, a vector with all components equal to `INT32_MAX`. Can be used as an integer equivalent of [constant Vector3.INF]. */
        static readonly MAX: Vector3i
        
        /** Left unit vector. Represents the local direction of left, and the global direction of west. */
        static readonly LEFT: Vector3i
        
        /** Right unit vector. Represents the local direction of right, and the global direction of east. */
        static readonly RIGHT: Vector3i
        
        /** Up unit vector. */
        static readonly UP: Vector3i
        
        /** Down unit vector. */
        static readonly DOWN: Vector3i
        
        /** Forward unit vector. Represents the local direction of forward, and the global direction of north. */
        static readonly FORWARD: Vector3i
        
        /** Back unit vector. Represents the local direction of back, and the global direction of south. */
        static readonly BACK: Vector3i
        constructor()
        constructor(from: Vector3i)
        constructor(from: Vector3)
        constructor(x: int64, y: int64, z: int64)
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_Z]. */
        min_axis_index(): int64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector3i): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector3i): int64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): int64
        
        /** Returns a new vector with each component set to `1` if it's positive, `-1` if it's negative, and `0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector3i
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector3i
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector3i, max: Vector3i): Vector3i
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampi(min: int64, max: int64): Vector3i
        
        /** Returns a new vector with each component snapped to the closest multiple of the corresponding component in [param step]. */
        snapped(step: Vector3i): Vector3i
        
        /** Returns a new vector with each component snapped to the closest multiple of [param step]. */
        snappedi(step: int64): Vector3i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector3i(mini(x, with.x), mini(y, with.y), mini(z, with.z))`. */
        min(with_: Vector3i): Vector3i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector3i(mini(x, with), mini(y, with), mini(z, with))`. */
        mini(with_: int64): Vector3i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector3i(maxi(x, with.x), maxi(y, with.y), maxi(z, with.z))`. */
        max(with_: Vector3i): Vector3i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector3i(maxi(x, with), maxi(y, with), maxi(z, with))`. */
        maxi(with_: int64): Vector3i
        static ADD(left: Vector3i, right: Vector3i): Vector3i
        static SUBTRACT(left: Vector3i, right: Vector3i): Vector3i
        static MULTIPLY(left: float64, right: Vector3i): Vector3i
        static MULTIPLY(left: Vector3i, right: Vector3i): Vector3i
        static MULTIPLY(left: Vector3i, right: float64): Vector3i
        static DIVIDE(left: Vector3i, right: Vector3i): Vector3i
        static DIVIDE(left: Vector3i, right: float64): Vector3i
        static NEGATE(left: Vector3i): Vector3i
        static EQUAL(left: Vector3i, right: Vector3i): boolean
        static NOT_EQUAL(left: Vector3i, right: Vector3i): boolean
        static LESS(left: Vector3i, right: Vector3i): boolean
        static LESS_EQUAL(left: Vector3i, right: Vector3i): boolean
        static GREATER(left: Vector3i, right: Vector3i): boolean
        static GREATER_EQUAL(left: Vector3i, right: Vector3i): boolean
        get x(): int64
        set x(value: int64)
        get y(): int64
        set y(value: int64)
        get z(): int64
        set z(value: int64)
    }
    /** A 2×3 matrix representing a 2D transformation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_transform2d.html  
     */
    class Transform2D {
        /** The identity [Transform2D]. This is a transform with no translation, no rotation, and a scale of [constant Vector2.ONE]. This also means that:  
         *  - The [member x] points right ([constant Vector2.RIGHT]);  
         *  - The [member y] points down ([constant Vector2.DOWN]).  
         *    
         *  If a [Vector2], a [Rect2], a [PackedVector2Array], or another [Transform2D] is transformed (multiplied) by this constant, no transformation occurs.  
         *      
         *  **Note:** In GDScript, this constant is equivalent to creating a [constructor Transform2D] without any arguments. It can be used to make your code clearer, and for consistency with C#.  
         */
        static readonly IDENTITY: Transform2D
        
        /** When any transform is multiplied by [constant FLIP_X], it negates all components of the [member x] axis (the X column).  
         *  When [constant FLIP_X] is multiplied by any transform, it negates the [member Vector2.x] component of all axes (the X row).  
         */
        static readonly FLIP_X: Transform2D
        
        /** When any transform is multiplied by [constant FLIP_Y], it negates all components of the [member y] axis (the Y column).  
         *  When [constant FLIP_Y] is multiplied by any transform, it negates the [member Vector2.y] component of all axes (the Y row).  
         */
        static readonly FLIP_Y: Transform2D
        constructor()
        constructor(from: Transform2D)
        constructor(rotation: float64, position: Vector2)
        constructor(rotation: float64, scale: Vector2, skew: float64, position: Vector2)
        constructor(x_axis: Vector2, y_axis: Vector2, origin: Vector2)
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Invertible_matrix]inverted version of this transform[/url].  
         *      
         *  **Note:** For this method to return correctly, the transform's basis needs to be  *orthonormal*  (see [method orthonormalized]). That means the basis should only represent a rotation. If it does not, use [method affine_inverse] instead.  
         */
        inverse(): Transform2D
        
        /** Returns the inverted version of this transform. Unlike [method inverse], this method works with almost any basis, including non-uniform ones, but is slower.  
         *      
         *  **Note:** For this method to return correctly, the transform's basis needs to have a determinant that is not exactly `0.0` (see [method determinant]).  
         */
        affine_inverse(): Transform2D
        
        /** Returns this transform's rotation (in radians). This is equivalent to [member x]'s angle (see [method Vector2.angle]). */
        get_rotation(): float64
        
        /** Returns this transform's translation. Equivalent to [member origin]. */
        get_origin(): Vector2
        
        /** Returns the length of both [member x] and [member y], as a [Vector2]. If this transform's basis is not skewed, this value is the scaling factor. It is not affected by rotation.  
         *    
         *      
         *  **Note:** If the value returned by [method determinant] is negative, the scale is also negative.  
         */
        get_scale(): Vector2
        
        /** Returns this transform's skew (in radians). */
        get_skew(): float64
        
        /** Returns a copy of this transform with its basis orthonormalized. An orthonormal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *normalized*  (the axes have a length of `1.0`), which also means it can only represent a rotation. */
        orthonormalized(): Transform2D
        
        /** Returns a copy of this transform rotated by the given [param angle] (in radians).  
         *  If [param angle] is positive, the transform is rotated clockwise.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding rotation transform `R` from the left, i.e., `R * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        rotated(angle: float64): Transform2D
        
        /** Returns a copy of the transform rotated by the given [param angle] (in radians).  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding rotation transform `R` from the right, i.e., `X * R`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        rotated_local(angle: float64): Transform2D
        
        /** Returns a copy of the transform scaled by the given [param scale] factor.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding scaling transform `S` from the left, i.e., `S * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        scaled(scale: Vector2): Transform2D
        
        /** Returns a copy of the transform scaled by the given [param scale] factor.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding scaling transform `S` from the right, i.e., `X * S`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        scaled_local(scale: Vector2): Transform2D
        
        /** Returns a copy of the transform translated by the given [param offset].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding translation transform `T` from the left, i.e., `T * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        translated(offset: Vector2): Transform2D
        
        /** Returns a copy of the transform translated by the given [param offset].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding translation transform `T` from the right, i.e., `X * T`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        translated_local(offset: Vector2): Transform2D
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Determinant]determinant[/url] of this transform basis's matrix. For advanced math, this number can be used to determine a few attributes:  
         *  - If the determinant is exactly `0.0`, the basis is not invertible (see [method inverse]).  
         *  - If the determinant is a negative number, the basis represents a negative scale.  
         *      
         *  **Note:** If the basis's scale is the same for every axis, its determinant is always that scale by the power of 2.  
         */
        determinant(): float64
        
        /** Returns a copy of the [param v] vector, transformed (multiplied) by the transform basis's matrix. Unlike the multiplication operator (`*`), this method ignores the [member origin]. */
        basis_xform(v: Vector2): Vector2
        
        /** Returns a copy of the [param v] vector, transformed (multiplied) by the inverse transform basis's matrix (see [method inverse]). This method ignores the [member origin].  
         *      
         *  **Note:** This method assumes that this transform's basis is  *orthonormal*  (see [method orthonormalized]). If the basis is not orthonormal, `transform.affine_inverse().basis_xform(vector)` should be used instead (see [method affine_inverse]).  
         */
        basis_xform_inv(v: Vector2): Vector2
        
        /** Returns the result of the linear interpolation between this transform and [param xform] by the given [param weight].  
         *  The [param weight] should be between `0.0` and `1.0` (inclusive). Values outside this range are allowed and can be used to perform  *extrapolation*  instead.  
         */
        interpolate_with(xform: Transform2D, weight: float64): Transform2D
        
        /** Returns `true` if this transform's basis is conformal. A conformal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *uniform*  (the axes share the same length). This method can be especially useful during physics calculations. */
        is_conformal(): boolean
        
        /** Returns `true` if this transform and [param xform] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(xform: Transform2D): boolean
        
        /** Returns `true` if this transform is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns a copy of the transform rotated such that the rotated X-axis points towards the [param target] position, in global space. */
        looking_at(target: Vector2 = Vector2.ZERO): Transform2D
        static MULTIPLY(left: Transform2D, right: Transform2D): Transform2D
        static MULTIPLY(left: Transform2D, right: float64): Transform2D
        static MULTIPLY(left: Transform2D, right: Vector2): Vector2
        static MULTIPLY(left: Vector2, right: Transform2D): Vector2
        static MULTIPLY(left: Transform2D, right: Rect2): Rect2
        static MULTIPLY(left: Rect2, right: Transform2D): Rect2
        static MULTIPLY(left: Transform2D, right: PackedVector2Array | Vector2[]): PackedVector2Array
        static MULTIPLY(left: PackedVector2Array | Vector2[], right: Transform2D): PackedVector2Array
        static EQUAL(left: Transform2D, right: Transform2D): boolean
        static NOT_EQUAL(left: Transform2D, right: Transform2D): boolean
        get x(): Vector2
        set x(value: Vector2)
        get y(): Vector2
        set y(value: Vector2)
        get origin(): Vector2
        set origin(value: Vector2)
    }
    namespace Vector4 {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
            
            /** Enumerated value for the Z axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Z = 2,
            
            /** Enumerated value for the W axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_W = 3,
        }
    }
    /** A 4D vector using floating-point coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_vector4.html  
     */
    class Vector4 {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Vector4
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Vector4
        
        /** Infinity vector, a vector with all components set to [constant @GDScript.INF]. */
        static readonly INF: Vector4
        constructor()
        constructor(from: Vector4)
        constructor(from: Vector4i)
        constructor(x: float64, y: float64, z: float64, w: float64)
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_W]. */
        min_axis_index(): int64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): float64
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector4
        
        /** Returns a new vector with each component set to `1.0` if it's positive, `-1.0` if it's negative, and `0.0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector4
        
        /** Returns a new vector with all components rounded down (towards negative infinity). */
        floor(): Vector4
        
        /** Returns a new vector with all components rounded up (towards positive infinity). */
        ceil(): Vector4
        
        /** Returns a new vector with all components rounded to the nearest integer, with halfway cases rounded away from zero. */
        round(): Vector4
        
        /** Returns the result of the linear interpolation between this vector and [param to] by amount [param weight]. [param weight] is on the range of `0.0` to `1.0`, representing the amount of interpolation. */
        lerp(to: Vector4, weight: float64): Vector4
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation. */
        cubic_interpolate(b: Vector4, pre_a: Vector4, post_b: Vector4, weight: float64): Vector4
        
        /** Performs a cubic interpolation between this vector and [param b] using [param pre_a] and [param post_b] as handles, and returns the result at position [param weight]. [param weight] is on the range of 0.0 to 1.0, representing the amount of interpolation.  
         *  It can perform smoother interpolation than [method cubic_interpolate] by the time values.  
         */
        cubic_interpolate_in_time(b: Vector4, pre_a: Vector4, post_b: Vector4, weight: float64, b_t: float64, pre_a_t: float64, post_b_t: float64): Vector4
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param mod]. */
        posmod(mod: float64): Vector4
        
        /** Returns a vector composed of the [method @GlobalScope.fposmod] of this vector's components and [param modv]'s components. */
        posmodv(modv: Vector4): Vector4
        
        /** Returns a new vector with each component snapped to the nearest multiple of the corresponding component in [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snapped(step: Vector4): Vector4
        
        /** Returns a new vector with each component snapped to the nearest multiple of [param step]. This can also be used to round the components to an arbitrary number of decimals. */
        snappedf(step: float64): Vector4
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector4, max: Vector4): Vector4
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampf(min: float64, max: float64): Vector4
        
        /** Returns the result of scaling the vector to unit length. Equivalent to `v / v.length()`. Returns `(0, 0, 0, 0)` if `v.length() == 0`. See also [method is_normalized].  
         *      
         *  **Note:** This function may return incorrect values if the input vector length is near zero.  
         */
        normalized(): Vector4
        
        /** Returns `true` if the vector is normalized, i.e. its length is approximately equal to 1. */
        is_normalized(): boolean
        
        /** Returns the normalized vector pointing from this vector to [param to]. This is equivalent to using `(b - a).normalized()`. */
        direction_to(to: Vector4): Vector4
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector4): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector4): float64
        
        /** Returns the dot product of this vector and [param with]. */
        dot(with_: Vector4): float64
        
        /** Returns the inverse of the vector. This is the same as `Vector4(1.0 / v.x, 1.0 / v.y, 1.0 / v.z, 1.0 / v.w)`. */
        inverse(): Vector4
        
        /** Returns `true` if this vector and [param to] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Vector4): boolean
        
        /** Returns `true` if this vector's values are approximately zero, by running [method @GlobalScope.is_zero_approx] on each component.  
         *  This method is faster than using [method is_equal_approx] with one value as a zero vector.  
         */
        is_zero_approx(): boolean
        
        /** Returns `true` if this vector is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector4(minf(x, with.x), minf(y, with.y), minf(z, with.z), minf(w, with.w))`. */
        min(with_: Vector4): Vector4
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector4(minf(x, with), minf(y, with), minf(z, with), minf(w, with))`. */
        minf(with_: float64): Vector4
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector4(maxf(x, with.x), maxf(y, with.y), maxf(z, with.z), maxf(w, with.w))`. */
        max(with_: Vector4): Vector4
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector4(maxf(x, with), maxf(y, with), maxf(z, with), maxf(w, with))`. */
        maxf(with_: float64): Vector4
        static ADD(left: Vector4, right: Vector4): Vector4
        static SUBTRACT(left: Vector4, right: Vector4): Vector4
        static MULTIPLY(left: float64, right: Vector4): Vector4
        static MULTIPLY(left: Vector4, right: Vector4): Vector4
        static MULTIPLY(left: Vector4, right: float64): Vector4
        static DIVIDE(left: Vector4, right: Vector4): Vector4
        static DIVIDE(left: Vector4, right: float64): Vector4
        static NEGATE(left: Vector4): Vector4
        static EQUAL(left: Vector4, right: Vector4): boolean
        static NOT_EQUAL(left: Vector4, right: Vector4): boolean
        static LESS(left: Vector4, right: Vector4): boolean
        static LESS_EQUAL(left: Vector4, right: Vector4): boolean
        static GREATER(left: Vector4, right: Vector4): boolean
        static GREATER_EQUAL(left: Vector4, right: Vector4): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
        get z(): float64
        set z(value: float64)
        get w(): float64
        set w(value: float64)
    }
    namespace Vector4i {
        enum Axis {
            /** Enumerated value for the X axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_X = 0,
            
            /** Enumerated value for the Y axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Y = 1,
            
            /** Enumerated value for the Z axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_Z = 2,
            
            /** Enumerated value for the W axis. Returned by [method max_axis_index] and [method min_axis_index]. */
            AXIS_W = 3,
        }
    }
    /** A 4D vector using integer coordinates.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_vector4i.html  
     */
    class Vector4i {
        /** Zero vector, a vector with all components set to `0`. */
        static readonly ZERO: Vector4i
        
        /** One vector, a vector with all components set to `1`. */
        static readonly ONE: Vector4i
        
        /** Min vector, a vector with all components equal to `INT32_MIN`. Can be used as a negative integer equivalent of [constant Vector4.INF]. */
        static readonly MIN: Vector4i
        
        /** Max vector, a vector with all components equal to `INT32_MAX`. Can be used as an integer equivalent of [constant Vector4.INF]. */
        static readonly MAX: Vector4i
        constructor()
        constructor(from: Vector4i)
        constructor(from: Vector4)
        constructor(x: int64, y: int64, z: int64, w: int64)
        
        /** Returns the axis of the vector's lowest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_W]. */
        min_axis_index(): int64
        
        /** Returns the axis of the vector's highest value. See `AXIS_*` constants. If all components are equal, this method returns [constant AXIS_X]. */
        max_axis_index(): int64
        
        /** Returns the length (magnitude) of this vector. */
        length(): float64
        
        /** Returns the squared length (squared magnitude) of this vector.  
         *  This method runs faster than [method length], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        length_squared(): int64
        
        /** Returns a new vector with each component set to `1` if it's positive, `-1` if it's negative, and `0` if it's zero. The result is identical to calling [method @GlobalScope.sign] on each component. */
        sign(): Vector4i
        
        /** Returns a new vector with all components in absolute values (i.e. positive). */
        abs(): Vector4i
        
        /** Returns a new vector with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Vector4i, max: Vector4i): Vector4i
        
        /** Returns a new vector with all components clamped between [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clampi(min: int64, max: int64): Vector4i
        
        /** Returns a new vector with each component snapped to the closest multiple of the corresponding component in [param step]. */
        snapped(step: Vector4i): Vector4i
        
        /** Returns a new vector with each component snapped to the closest multiple of [param step]. */
        snappedi(step: int64): Vector4i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector4i(mini(x, with.x), mini(y, with.y), mini(z, with.z), mini(w, with.w))`. */
        min(with_: Vector4i): Vector4i
        
        /** Returns the component-wise minimum of this and [param with], equivalent to `Vector4i(mini(x, with), mini(y, with), mini(z, with), mini(w, with))`. */
        mini(with_: int64): Vector4i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector4i(maxi(x, with.x), maxi(y, with.y), maxi(z, with.z), maxi(w, with.w))`. */
        max(with_: Vector4i): Vector4i
        
        /** Returns the component-wise maximum of this and [param with], equivalent to `Vector4i(maxi(x, with), maxi(y, with), maxi(z, with), maxi(w, with))`. */
        maxi(with_: int64): Vector4i
        
        /** Returns the distance between this vector and [param to]. */
        distance_to(to: Vector4i): float64
        
        /** Returns the squared distance between this vector and [param to].  
         *  This method runs faster than [method distance_to], so prefer it if you need to compare vectors or need the squared distance for some formula.  
         */
        distance_squared_to(to: Vector4i): int64
        static ADD(left: Vector4i, right: Vector4i): Vector4i
        static SUBTRACT(left: Vector4i, right: Vector4i): Vector4i
        static MULTIPLY(left: float64, right: Vector4i): Vector4i
        static MULTIPLY(left: Vector4i, right: Vector4i): Vector4i
        static MULTIPLY(left: Vector4i, right: float64): Vector4i
        static DIVIDE(left: Vector4i, right: Vector4i): Vector4i
        static DIVIDE(left: Vector4i, right: float64): Vector4i
        static NEGATE(left: Vector4i): Vector4i
        static EQUAL(left: Vector4i, right: Vector4i): boolean
        static NOT_EQUAL(left: Vector4i, right: Vector4i): boolean
        static LESS(left: Vector4i, right: Vector4i): boolean
        static LESS_EQUAL(left: Vector4i, right: Vector4i): boolean
        static GREATER(left: Vector4i, right: Vector4i): boolean
        static GREATER_EQUAL(left: Vector4i, right: Vector4i): boolean
        get x(): int64
        set x(value: int64)
        get y(): int64
        set y(value: int64)
        get z(): int64
        set z(value: int64)
        get w(): int64
        set w(value: int64)
    }
    /** A plane in Hessian normal form.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_plane.html  
     */
    class Plane {
        /** A plane that extends in the Y and Z axes (normal vector points +X). */
        static readonly PLANE_YZ: Plane
        
        /** A plane that extends in the X and Z axes (normal vector points +Y). */
        static readonly PLANE_XZ: Plane
        
        /** A plane that extends in the X and Y axes (normal vector points +Z). */
        static readonly PLANE_XY: Plane
        constructor()
        constructor(from: Plane)
        constructor(normal: Vector3)
        constructor(normal: Vector3, d: float64)
        constructor(normal: Vector3, point: Vector3)
        constructor(point1: Vector3, point2: Vector3, point3: Vector3)
        constructor(a: float64, b: float64, c: float64, d: float64)
        
        /** Returns a copy of the plane, with normalized [member normal] (so it's a unit vector). Returns `Plane(0, 0, 0, 0)` if [member normal] can't be normalized (it has zero length). */
        normalized(): Plane
        
        /** Returns the center of the plane. */
        get_center(): Vector3
        
        /** Returns `true` if this plane and [param to_plane] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to_plane: Plane): boolean
        
        /** Returns `true` if this plane is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns `true` if [param point] is located above the plane. */
        is_point_over(point: Vector3): boolean
        
        /** Returns the shortest distance from the plane to the position [param point]. If the point is above the plane, the distance will be positive. If below, the distance will be negative. */
        distance_to(point: Vector3): float64
        
        /** Returns `true` if [param point] is inside the plane. Comparison uses a custom minimum [param tolerance] threshold. */
        has_point(point: Vector3, tolerance: float64 = 0.00001): boolean
        
        /** Returns the orthogonal projection of [param point] into a point in the plane. */
        project(point: Vector3): Vector3
        
        /** Returns the intersection point of the three planes [param b], [param c] and this plane. If no intersection is found, `null` is returned. */
        intersect_3(b: Plane, c: Plane): any
        
        /** Returns the intersection point of a ray consisting of the position [param from] and the direction normal [param dir] with this plane. If no intersection is found, `null` is returned. */
        intersects_ray(from: Vector3, dir: Vector3): any
        
        /** Returns the intersection point of a segment from position [param from] to position [param to] with this plane. If no intersection is found, `null` is returned. */
        intersects_segment(from: Vector3, to: Vector3): any
        static NEGATE(left: Plane): Plane
        static EQUAL(left: Plane, right: Plane): boolean
        static NOT_EQUAL(left: Plane, right: Plane): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
        get z(): float64
        set z(value: float64)
        get d(): float64
        set d(value: float64)
        get normal(): Vector3
        set normal(value: Vector3)
    }
    /** A unit quaternion used for representing 3D rotations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_quaternion.html  
     */
    class Quaternion {
        /** The identity quaternion, representing no rotation. This has the same rotation as [constant Basis.IDENTITY].  
         *  If a [Vector3] is rotated (multiplied) by this quaternion, it does not change.  
         *      
         *  **Note:** In GDScript, this constant is equivalent to creating a [constructor Quaternion] without any arguments. It can be used to make your code clearer, and for consistency with C#.  
         */
        static readonly IDENTITY: Quaternion
        constructor()
        constructor(from: Quaternion)
        constructor(from: Basis)
        constructor(axis: Vector3, angle: float64)
        constructor(arc_from: Vector3, arc_to: Vector3)
        constructor(x: float64, y: float64, z: float64, w: float64)
        
        /** Returns this quaternion's length, also called magnitude. */
        length(): float64
        
        /** Returns this quaternion's length, squared.  
         *      
         *  **Note:** This method is faster than [method length], so prefer it if you only need to compare quaternion lengths.  
         */
        length_squared(): float64
        
        /** Returns a copy of this quaternion, normalized so that its length is `1.0`. See also [method is_normalized]. */
        normalized(): Quaternion
        
        /** Returns `true` if this quaternion is normalized. See also [method normalized]. */
        is_normalized(): boolean
        
        /** Returns `true` if this quaternion and [param to] are approximately equal, by calling [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Quaternion): boolean
        
        /** Returns `true` if this quaternion is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        
        /** Returns the inverse version of this quaternion, inverting the sign of every component except [member w]. */
        inverse(): Quaternion
        
        /** Returns the logarithm of this quaternion. Multiplies this quaternion's rotation axis by its rotation angle, and stores the result in the returned quaternion's vector part ([member x], [member y], and [member z]). The returned quaternion's real part ([member w]) is always `0.0`. */
        log(): Quaternion
        
        /** Returns the exponential of this quaternion. The rotation axis of the result is the normalized rotation axis of this quaternion, the angle of the result is the length of the vector part of this quaternion. */
        exp(): Quaternion
        
        /** Returns the angle between this quaternion and [param to]. This is the magnitude of the angle you would need to rotate by to get from one to the other.  
         *      
         *  **Note:** The magnitude of the floating-point error for this method is abnormally high, so methods such as `is_zero_approx` will not work reliably.  
         */
        angle_to(to: Quaternion): float64
        
        /** Returns the dot product between this quaternion and [param with].  
         *  This is equivalent to `(quat.x * with.x) + (quat.y * with.y) + (quat.z * with.z) + (quat.w * with.w)`.  
         */
        dot(with_: Quaternion): float64
        
        /** Performs a spherical-linear interpolation with the [param to] quaternion, given a [param weight] and returns the result. Both this quaternion and [param to] must be normalized. */
        slerp(to: Quaternion, weight: float64): Quaternion
        
        /** Performs a spherical-linear interpolation with the [param to] quaternion, given a [param weight] and returns the result. Unlike [method slerp], this method does not check if the rotation path is smaller than 90 degrees. Both this quaternion and [param to] must be normalized. */
        slerpni(to: Quaternion, weight: float64): Quaternion
        
        /** Performs a spherical cubic interpolation between quaternions [param pre_a], this vector, [param b], and [param post_b], by the given amount [param weight]. */
        spherical_cubic_interpolate(b: Quaternion, pre_a: Quaternion, post_b: Quaternion, weight: float64): Quaternion
        
        /** Performs a spherical cubic interpolation between quaternions [param pre_a], this vector, [param b], and [param post_b], by the given amount [param weight].  
         *  It can perform smoother interpolation than [method spherical_cubic_interpolate] by the time values.  
         */
        spherical_cubic_interpolate_in_time(b: Quaternion, pre_a: Quaternion, post_b: Quaternion, weight: float64, b_t: float64, pre_a_t: float64, post_b_t: float64): Quaternion
        
        /** Returns this quaternion's rotation as a [Vector3] of [url=https://en.wikipedia.org/wiki/Euler_angles]Euler angles[/url], in radians.  
         *  The order of each consecutive rotation can be changed with [param order] (see [enum EulerOrder] constants). By default, the YXZ convention is used ([constant EULER_ORDER_YXZ]): Z (roll) is calculated first, then X (pitch), and lastly Y (yaw). When using the opposite method [method from_euler], this order is reversed.  
         */
        get_euler(order: int64 = 2): Vector3
        
        /** Constructs a new [Quaternion] from the given [Vector3] of [url=https://en.wikipedia.org/wiki/Euler_angles]Euler angles[/url], in radians. This method always uses the YXZ convention ([constant EULER_ORDER_YXZ]). */
        static from_euler(euler: Vector3): Quaternion
        
        /** Returns the rotation axis of the rotation represented by this quaternion. */
        get_axis(): Vector3
        
        /** Returns the angle of the rotation represented by this quaternion.  
         *      
         *  **Note:** The quaternion must be normalized.  
         */
        get_angle(): float64
        static ADD(left: Quaternion, right: Quaternion): Quaternion
        static SUBTRACT(left: Quaternion, right: Quaternion): Quaternion
        static MULTIPLY(left: Quaternion, right: Quaternion): Quaternion
        static MULTIPLY(left: Quaternion, right: float64): Quaternion
        static MULTIPLY(left: float64, right: Quaternion): Quaternion
        static MULTIPLY(left: Vector3, right: Quaternion): Vector3
        static MULTIPLY(left: Quaternion, right: Vector3): Vector3
        static DIVIDE(left: Quaternion, right: float64): Quaternion
        static NEGATE(left: Quaternion): Quaternion
        static EQUAL(left: Quaternion, right: Quaternion): boolean
        static NOT_EQUAL(left: Quaternion, right: Quaternion): boolean
        get x(): float64
        set x(value: float64)
        get y(): float64
        set y(value: float64)
        get z(): float64
        set z(value: float64)
        get w(): float64
        set w(value: float64)
    }
    /** A 3D axis-aligned bounding box.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_aabb.html  
     */
    class AABB {
        constructor()
        constructor(from: AABB)
        constructor(position: Vector3, size: Vector3)
        
        /** Returns an [AABB] equivalent to this bounding box, with its width, height, and depth modified to be non-negative values.  
         *    
         *      
         *  **Note:** It's recommended to use this method when [member size] is negative, as most other methods in Godot assume that the [member size]'s components are greater than `0`.  
         */
        abs(): AABB
        
        /** Returns the center point of the bounding box. This is the same as `position + (size / 2.0)`. */
        get_center(): Vector3
        
        /** Returns the bounding box's volume. This is equivalent to `size.x * size.y * size.z`. See also [method has_volume]. */
        get_volume(): float64
        
        /** Returns `true` if this bounding box's width, height, and depth are all positive. See also [method get_volume]. */
        has_volume(): boolean
        
        /** Returns `true` if this bounding box has a surface or a length, that is, at least one component of [member size] is greater than `0`. Otherwise, returns `false`. */
        has_surface(): boolean
        
        /** Returns `true` if the bounding box contains the given [param point]. By convention, points exactly on the right, top, and front sides are **not** included.  
         *      
         *  **Note:** This method is not reliable for [AABB] with a  *negative*  [member size]. Use [method abs] first to get a valid bounding box.  
         */
        has_point(point: Vector3): boolean
        
        /** Returns `true` if this bounding box and [param aabb] are approximately equal, by calling [method Vector3.is_equal_approx] on the [member position] and the [member size]. */
        is_equal_approx(aabb: AABB): boolean
        
        /** Returns `true` if this bounding box's values are finite, by calling [method Vector3.is_finite] on the [member position] and the [member size]. */
        is_finite(): boolean
        
        /** Returns `true` if this bounding box overlaps with the box [param with]. The edges of both boxes are  *always*  excluded. */
        intersects(with_: AABB): boolean
        
        /** Returns `true` if this bounding box  *completely*  encloses the [param with] box. The edges of both boxes are included.  
         *    
         */
        encloses(with_: AABB): boolean
        
        /** Returns `true` if this bounding box is on both sides of the given [param plane]. */
        intersects_plane(plane: Plane): boolean
        
        /** Returns the intersection between this bounding box and [param with]. If the boxes do not intersect, returns an empty [AABB]. If the boxes intersect at the edge, returns a flat [AABB] with no volume (see [method has_surface] and [method has_volume]).  
         *    
         *      
         *  **Note:** If you only need to know whether two bounding boxes are intersecting, use [method intersects], instead.  
         */
        intersection(with_: AABB): AABB
        
        /** Returns an [AABB] that encloses both this bounding box and [param with] around the edges. See also [method encloses]. */
        merge(with_: AABB): AABB
        
        /** Returns a copy of this bounding box expanded to align the edges with the given [param to_point], if necessary.  
         *    
         */
        expand(to_point: Vector3): AABB
        
        /** Returns a copy of this bounding box extended on all sides by the given amount [param by]. A negative amount shrinks the box instead.  
         *    
         */
        grow(by: float64): AABB
        
        /** Returns the vertex's position of this bounding box that's the farthest in the given direction. This point is commonly known as the support point in collision detection algorithms. */
        get_support(direction: Vector3): Vector3
        
        /** Returns the longest normalized axis of this bounding box's [member size], as a [Vector3] ([constant Vector3.RIGHT], [constant Vector3.UP], or [constant Vector3.BACK]).  
         *    
         *  See also [method get_longest_axis_index] and [method get_longest_axis_size].  
         */
        get_longest_axis(): Vector3
        
        /** Returns the index to the longest axis of this bounding box's [member size] (see [constant Vector3.AXIS_X], [constant Vector3.AXIS_Y], and [constant Vector3.AXIS_Z]).  
         *  For an example, see [method get_longest_axis].  
         */
        get_longest_axis_index(): int64
        
        /** Returns the longest dimension of this bounding box's [member size].  
         *  For an example, see [method get_longest_axis].  
         */
        get_longest_axis_size(): float64
        
        /** Returns the shortest normalized axis of this bounding box's [member size], as a [Vector3] ([constant Vector3.RIGHT], [constant Vector3.UP], or [constant Vector3.BACK]).  
         *    
         *  See also [method get_shortest_axis_index] and [method get_shortest_axis_size].  
         */
        get_shortest_axis(): Vector3
        
        /** Returns the index to the shortest axis of this bounding box's [member size] (see [constant Vector3.AXIS_X], [constant Vector3.AXIS_Y], and [constant Vector3.AXIS_Z]).  
         *  For an example, see [method get_shortest_axis].  
         */
        get_shortest_axis_index(): int64
        
        /** Returns the shortest dimension of this bounding box's [member size].  
         *  For an example, see [method get_shortest_axis].  
         */
        get_shortest_axis_size(): float64
        
        /** Returns the position of one of the 8 vertices that compose this bounding box. With a [param idx] of `0` this is the same as [member position], and a [param idx] of `7` is the same as [member end]. */
        get_endpoint(idx: int64): Vector3
        
        /** Returns the first point where this bounding box and the given segment intersect, as a [Vector3]. If no intersection occurs, returns `null`.  
         *  The segment begins at [param from] and ends at [param to].  
         */
        intersects_segment(from: Vector3, to: Vector3): any
        
        /** Returns the first point where this bounding box and the given ray intersect, as a [Vector3]. If no intersection occurs, returns `null`.  
         *  The ray begin at [param from], faces [param dir] and extends towards infinity.  
         */
        intersects_ray(from: Vector3, dir: Vector3): any
        static EQUAL(left: AABB, right: AABB): boolean
        static NOT_EQUAL(left: AABB, right: AABB): boolean
        get position(): Vector3
        set position(value: Vector3)
        get size(): Vector3
        set size(value: Vector3)
        get end(): Vector3
        set end(value: Vector3)
    }
    /** A 3×3 matrix for representing 3D rotation and scale.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_basis.html  
     */
    class Basis {
        /** The identity [Basis]. This is an orthonormal basis with no rotation, no shear, and a scale of [constant Vector3.ONE]. This also means that:  
         *  - The [member x] points right ([constant Vector3.RIGHT]);  
         *  - The [member y] points up ([constant Vector3.UP]);  
         *  - The [member z] points back ([constant Vector3.BACK]).  
         *    
         *  If a [Vector3] or another [Basis] is transformed (multiplied) by this constant, no transformation occurs.  
         *      
         *  **Note:** In GDScript, this constant is equivalent to creating a [constructor Basis] without any arguments. It can be used to make your code clearer, and for consistency with C#.  
         */
        static readonly IDENTITY: Basis
        
        /** When any basis is multiplied by [constant FLIP_X], it negates all components of the [member x] axis (the X column).  
         *  When [constant FLIP_X] is multiplied by any basis, it negates the [member Vector3.x] component of all axes (the X row).  
         */
        static readonly FLIP_X: Basis
        
        /** When any basis is multiplied by [constant FLIP_Y], it negates all components of the [member y] axis (the Y column).  
         *  When [constant FLIP_Y] is multiplied by any basis, it negates the [member Vector3.y] component of all axes (the Y row).  
         */
        static readonly FLIP_Y: Basis
        
        /** When any basis is multiplied by [constant FLIP_Z], it negates all components of the [member z] axis (the Z column).  
         *  When [constant FLIP_Z] is multiplied by any basis, it negates the [member Vector3.z] component of all axes (the Z row).  
         */
        static readonly FLIP_Z: Basis
        constructor()
        constructor(from: Basis)
        constructor(from: Quaternion)
        constructor(axis: Vector3, angle: float64)
        constructor(x_axis: Vector3, y_axis: Vector3, z_axis: Vector3)
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Invertible_matrix]inverse of this basis's matrix[/url]. */
        inverse(): Basis
        
        /** Returns the transposed version of this basis. This turns the basis matrix's columns into rows, and its rows into columns.  
         *    
         */
        transposed(): Basis
        
        /** Returns the orthonormalized version of this basis. An orthonormal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *normalized*  (the axes have a length of `1.0`), which also means it can only represent a rotation.  
         *  It is often useful to call this method to avoid rounding errors on a rotating basis:  
         *    
         */
        orthonormalized(): Basis
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Determinant]determinant[/url] of this basis's matrix. For advanced math, this number can be used to determine a few attributes:  
         *  - If the determinant is exactly `0.0`, the basis is not invertible (see [method inverse]).  
         *  - If the determinant is a negative number, the basis represents a negative scale.  
         *      
         *  **Note:** If the basis's scale is the same for every axis, its determinant is always that scale by the power of 2.  
         */
        determinant(): float64
        
        /** Returns a copy of this basis rotated around the given [param axis] by the given [param angle] (in radians).  
         *  The [param axis] must be a normalized vector (see [method Vector3.normalized]). If [param angle] is positive, the basis is rotated counter-clockwise around the axis.  
         *    
         */
        rotated(axis: Vector3, angle: float64): Basis
        
        /** Returns this basis with each axis's components scaled by the given [param scale]'s components.  
         *  The basis matrix's rows are multiplied by [param scale]'s components. This operation is a global scale (relative to the parent).  
         *    
         */
        scaled(scale: Vector3): Basis
        
        /** Returns the length of each axis of this basis, as a [Vector3]. If the basis is not sheared, this value is the scaling factor. It is not affected by rotation.  
         *    
         *      
         *  **Note:** If the value returned by [method determinant] is negative, the scale is also negative.  
         */
        get_scale(): Vector3
        
        /** Returns this basis's rotation as a [Vector3] of [url=https://en.wikipedia.org/wiki/Euler_angles]Euler angles[/url], in radians. For the returned value:  
         *  - The [member Vector3.x] contains the angle around the [member x] axis (pitch);  
         *  - The [member Vector3.y] contains the angle around the [member y] axis (yaw);  
         *  - The [member Vector3.z] contains the angle around the [member z] axis (roll).  
         *  The order of each consecutive rotation can be changed with [param order] (see [enum EulerOrder] constants). By default, the YXZ convention is used ([constant EULER_ORDER_YXZ]): Z (roll) is calculated first, then X (pitch), and lastly Y (yaw). When using the opposite method [method from_euler], this order is reversed.  
         *      
         *  **Note:** For this method to return correctly, the basis needs to be  *orthonormal*  (see [method orthonormalized]).  
         *      
         *  **Note:** Euler angles are much more intuitive but are not suitable for 3D math. Because of this, consider using the [method get_rotation_quaternion] method instead, which returns a [Quaternion].  
         *      
         *  **Note:** In the Inspector dock, a basis's rotation is often displayed in Euler angles (in degrees), as is the case with the [member Node3D.rotation] property.  
         */
        get_euler(order: int64 = 2): Vector3
        
        /** Returns the transposed dot product between [param with] and the [member x] axis (see [method transposed]).  
         *  This is equivalent to `basis.x.dot(vector)`.  
         */
        tdotx(with_: Vector3): float64
        
        /** Returns the transposed dot product between [param with] and the [member y] axis (see [method transposed]).  
         *  This is equivalent to `basis.y.dot(vector)`.  
         */
        tdoty(with_: Vector3): float64
        
        /** Returns the transposed dot product between [param with] and the [member z] axis (see [method transposed]).  
         *  This is equivalent to `basis.z.dot(vector)`.  
         */
        tdotz(with_: Vector3): float64
        
        /** Performs a spherical-linear interpolation with the [param to] basis, given a [param weight]. Both this basis and [param to] should represent a rotation.  
         *  **Example:** Smoothly rotate a [Node3D] to the target basis over time, with a [Tween]:  
         *    
         */
        slerp(to: Basis, weight: float64): Basis
        
        /** Returns `true` if this basis is conformal. A conformal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *uniform*  (the axes share the same length). This method can be especially useful during physics calculations. */
        is_conformal(): boolean
        
        /** Returns `true` if this basis and [param b] are approximately equal, by calling [method @GlobalScope.is_equal_approx] on all vector components. */
        is_equal_approx(b: Basis): boolean
        
        /** Returns `true` if this basis is finite, by calling [method @GlobalScope.is_finite] on all vector components. */
        is_finite(): boolean
        
        /** Returns this basis's rotation as a [Quaternion].  
         *      
         *  **Note:** Quaternions are much more suitable for 3D math but are less intuitive. For user interfaces, consider using the [method get_euler] method, which returns Euler angles.  
         */
        get_rotation_quaternion(): Quaternion
        
        /** Creates a new [Basis] with a rotation such that the forward axis (-Z) points towards the [param target] position.  
         *  By default, the -Z axis (camera forward) is treated as forward (implies +X is right). If [param use_model_front] is `true`, the +Z axis (asset front) is treated as forward (implies +X is left) and points toward the [param target] position.  
         *  The up axis (+Y) points as close to the [param up] vector as possible while staying perpendicular to the forward axis. The returned basis is orthonormalized (see [method orthonormalized]).  
         *  The [param target] and the [param up] cannot be [constant Vector3.ZERO], and shouldn't be colinear to avoid unintended rotation around local Z axis.  
         */
        static looking_at(target: Vector3, up: Vector3 = Vector3.ZERO, use_model_front: boolean = false): Basis
        
        /** Constructs a new [Basis] that only represents scale, with no rotation or shear, from the given [param scale] vector.  
         *    
         *      
         *  **Note:** In linear algebra, the matrix of this basis is also known as a [url=https://en.wikipedia.org/wiki/Diagonal_matrix]diagonal matrix[/url].  
         */
        static from_scale(scale: Vector3): Basis
        
        /** Constructs a new [Basis] that only represents rotation from the given [Vector3] of [url=https://en.wikipedia.org/wiki/Euler_angles]Euler angles[/url], in radians.  
         *  - The [member Vector3.x] should contain the angle around the [member x] axis (pitch);  
         *  - The [member Vector3.y] should contain the angle around the [member y] axis (yaw);  
         *  - The [member Vector3.z] should contain the angle around the [member z] axis (roll).  
         *    
         *  The order of each consecutive rotation can be changed with [param order] (see [enum EulerOrder] constants). By default, the YXZ convention is used ([constant EULER_ORDER_YXZ]): the basis rotates first around the Y axis (yaw), then X (pitch), and lastly Z (roll). When using the opposite method [method get_euler], this order is reversed.  
         */
        static from_euler(euler: Vector3, order: int64 = 2): Basis
        static MULTIPLY(left: Basis, right: Basis): Basis
        static MULTIPLY(left: Basis, right: float64): Basis
        static MULTIPLY(left: Basis, right: Vector3): Vector3
        static MULTIPLY(left: Vector3, right: Basis): Vector3
        static EQUAL(left: Basis, right: Basis): boolean
        static NOT_EQUAL(left: Basis, right: Basis): boolean
        get x(): Vector3
        set x(value: Vector3)
        get y(): Vector3
        set y(value: Vector3)
        get z(): Vector3
        set z(value: Vector3)
    }
    /** A 3×4 matrix representing a 3D transformation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_transform3d.html  
     */
    class Transform3D {
        /** The identity [Transform3D]. This is a transform with no translation, no rotation, and a scale of [constant Vector3.ONE]. Its [member basis] is equal to [constant Basis.IDENTITY]. This also means that:  
         *  - Its [member Basis.x] points right ([constant Vector3.RIGHT]);  
         *  - Its [member Basis.y] points up ([constant Vector3.UP]);  
         *  - Its [member Basis.z] points back ([constant Vector3.BACK]).  
         *    
         *  If a [Vector3], an [AABB], a [Plane], a [PackedVector3Array], or another [Transform3D] is transformed (multiplied) by this constant, no transformation occurs.  
         *      
         *  **Note:** In GDScript, this constant is equivalent to creating a [constructor Transform3D] without any arguments. It can be used to make your code clearer, and for consistency with C#.  
         */
        static readonly IDENTITY: Transform3D
        
        /** [Transform3D] with mirroring applied perpendicular to the YZ plane. Its [member basis] is equal to [constant Basis.FLIP_X]. */
        static readonly FLIP_X: Transform3D
        
        /** [Transform3D] with mirroring applied perpendicular to the XZ plane. Its [member basis] is equal to [constant Basis.FLIP_Y]. */
        static readonly FLIP_Y: Transform3D
        
        /** [Transform3D] with mirroring applied perpendicular to the XY plane. Its [member basis] is equal to [constant Basis.FLIP_Z]. */
        static readonly FLIP_Z: Transform3D
        constructor()
        constructor(from: Transform3D)
        constructor(basis: Basis, origin: Vector3)
        constructor(x_axis: Vector3, y_axis: Vector3, z_axis: Vector3, origin: Vector3)
        constructor(from: Projection)
        
        /** Returns the [url=https://en.wikipedia.org/wiki/Invertible_matrix]inverted version of this transform[/url]. See also [method Basis.inverse].  
         *      
         *  **Note:** For this method to return correctly, the transform's [member basis] needs to be  *orthonormal*  (see [method orthonormalized]). That means the basis should only represent a rotation. If it does not, use [method affine_inverse] instead.  
         */
        inverse(): Transform3D
        
        /** Returns the inverted version of this transform. Unlike [method inverse], this method works with almost any [member basis], including non-uniform ones, but is slower. See also [method Basis.inverse].  
         *      
         *  **Note:** For this method to return correctly, the transform's [member basis] needs to have a determinant that is not exactly `0.0` (see [method Basis.determinant]).  
         */
        affine_inverse(): Transform3D
        
        /** Returns a copy of this transform with its [member basis] orthonormalized. An orthonormal basis is both  *orthogonal*  (the axes are perpendicular to each other) and  *normalized*  (the axes have a length of `1.0`), which also means it can only represent a rotation. See also [method Basis.orthonormalized]. */
        orthonormalized(): Transform3D
        
        /** Returns a copy of this transform rotated around the given [param axis] by the given [param angle] (in radians).  
         *  The [param axis] must be a normalized vector (see [method Vector3.normalized]). If [param angle] is positive, the basis is rotated counter-clockwise around the axis.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding rotation transform `R` from the left, i.e., `R * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        rotated(axis: Vector3, angle: float64): Transform3D
        
        /** Returns a copy of this transform rotated around the given [param axis] by the given [param angle] (in radians).  
         *  The [param axis] must be a normalized vector in the transform's local coordinate system. For example, to rotate around the local X-axis, use [constant Vector3.RIGHT].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding rotation transform `R` from the right, i.e., `X * R`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        rotated_local(axis: Vector3, angle: float64): Transform3D
        
        /** Returns a copy of this transform scaled by the given [param scale] factor.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding scaling transform `S` from the left, i.e., `S * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        scaled(scale: Vector3): Transform3D
        
        /** Returns a copy of this transform scaled by the given [param scale] factor.  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding scaling transform `S` from the right, i.e., `X * S`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        scaled_local(scale: Vector3): Transform3D
        
        /** Returns a copy of this transform translated by the given [param offset].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding translation transform `T` from the left, i.e., `T * X`.  
         *  This can be seen as transforming with respect to the global/parent frame.  
         */
        translated(offset: Vector3): Transform3D
        
        /** Returns a copy of this transform translated by the given [param offset].  
         *  This method is an optimized version of multiplying the given transform `X` with a corresponding translation transform `T` from the right, i.e., `X * T`.  
         *  This can be seen as transforming with respect to the local frame.  
         */
        translated_local(offset: Vector3): Transform3D
        
        /** Returns a copy of this transform rotated so that the forward axis (-Z) points towards the [param target] position.  
         *  The up axis (+Y) points as close to the [param up] vector as possible while staying perpendicular to the forward axis. The resulting transform is orthonormalized. The existing rotation, scale, and skew information from the original transform is discarded. The [param target] and [param up] vectors cannot be zero, cannot be parallel to each other, and are defined in global/parent space.  
         *  If [param use_model_front] is `true`, the +Z axis (asset front) is treated as forward (implies +X is left) and points toward the [param target] position. By default, the -Z axis (camera forward) is treated as forward (implies +X is right).  
         */
        looking_at(target: Vector3, up: Vector3 = Vector3.ZERO, use_model_front: boolean = false): Transform3D
        
        /** Returns the result of the linear interpolation between this transform and [param xform] by the given [param weight].  
         *  The [param weight] should be between `0.0` and `1.0` (inclusive). Values outside this range are allowed and can be used to perform  *extrapolation*  instead.  
         */
        interpolate_with(xform: Transform3D, weight: float64): Transform3D
        
        /** Returns `true` if this transform and [param xform] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(xform: Transform3D): boolean
        
        /** Returns `true` if this transform is finite, by calling [method @GlobalScope.is_finite] on each component. */
        is_finite(): boolean
        static MULTIPLY(left: Transform3D, right: Transform3D): Transform3D
        static MULTIPLY(left: Transform3D, right: float64): Transform3D
        static MULTIPLY(left: Transform3D, right: Vector3): Vector3
        static MULTIPLY(left: Vector3, right: Transform3D): Vector3
        static MULTIPLY(left: Transform3D, right: AABB): AABB
        static MULTIPLY(left: AABB, right: Transform3D): AABB
        static MULTIPLY(left: Transform3D, right: Plane): Plane
        static MULTIPLY(left: Plane, right: Transform3D): Plane
        static MULTIPLY(left: Transform3D, right: PackedVector3Array | Vector3[]): PackedVector3Array
        static MULTIPLY(left: PackedVector3Array | Vector3[], right: Transform3D): PackedVector3Array
        static EQUAL(left: Transform3D, right: Transform3D): boolean
        static NOT_EQUAL(left: Transform3D, right: Transform3D): boolean
        get basis(): Basis
        set basis(value: Basis)
        get origin(): Vector3
        set origin(value: Vector3)
    }
    namespace Projection {
        enum Planes {
            /** The index value of the projection's near clipping plane. */
            PLANE_NEAR = 0,
            
            /** The index value of the projection's far clipping plane. */
            PLANE_FAR = 1,
            
            /** The index value of the projection's left clipping plane. */
            PLANE_LEFT = 2,
            
            /** The index value of the projection's top clipping plane. */
            PLANE_TOP = 3,
            
            /** The index value of the projection's right clipping plane. */
            PLANE_RIGHT = 4,
            
            /** The index value of the projection bottom clipping plane. */
            PLANE_BOTTOM = 5,
        }
    }
    /** A 4×4 matrix for 3D projective transformations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_projection.html  
     */
    class Projection {
        /** A [Projection] with no transformation defined. When applied to other data structures, no transformation is performed. */
        static readonly IDENTITY: Projection
        
        /** A [Projection] with all values initialized to 0. When applied to other data structures, they will be zeroed. */
        static readonly ZERO: Projection
        constructor()
        constructor(from: Projection)
        constructor(from: Transform3D)
        constructor(x_axis: Vector4, y_axis: Vector4, z_axis: Vector4, w_axis: Vector4)
        
        /** Creates a new [Projection] that projects positions from a depth range of `-1` to `1` to one that ranges from `0` to `1`, and flips the projected positions vertically, according to [param flip_y]. */
        static create_depth_correction(flip_y: boolean): Projection
        
        /** Creates a new [Projection] that projects positions into the given [Rect2]. */
        static create_light_atlas_rect(rect: Rect2): Projection
        
        /** Creates a new [Projection] that projects positions using a perspective projection with the given Y-axis field of view (in degrees), X:Y aspect ratio, and clipping planes.  
         *  [param flip_fov] determines whether the projection's field of view is flipped over its diagonal.  
         */
        static create_perspective(fovy: float64, aspect: float64, z_near: float64, z_far: float64, flip_fov: boolean = false): Projection
        
        /** Creates a new [Projection] that projects positions using a perspective projection with the given Y-axis field of view (in degrees), X:Y aspect ratio, and clipping distances. The projection is adjusted for a head-mounted display with the given distance between eyes and distance to a point that can be focused on.  
         *  [param eye] creates the projection for the left eye when set to 1, or the right eye when set to 2.  
         *  [param flip_fov] determines whether the projection's field of view is flipped over its diagonal.  
         */
        static create_perspective_hmd(fovy: float64, aspect: float64, z_near: float64, z_far: float64, flip_fov: boolean, eye: int64, intraocular_dist: float64, convergence_dist: float64): Projection
        
        /** Creates a new [Projection] for projecting positions onto a head-mounted display with the given X:Y aspect ratio, distance between eyes, display width, distance to lens, oversampling factor, and depth clipping planes.  
         *  [param eye] creates the projection for the left eye when set to 1, or the right eye when set to 2.  
         */
        static create_for_hmd(eye: int64, aspect: float64, intraocular_dist: float64, display_width: float64, display_to_lens: float64, oversample: float64, z_near: float64, z_far: float64): Projection
        
        /** Creates a new [Projection] that projects positions using an orthogonal projection with the given clipping planes. */
        static create_orthogonal(left: float64, right: float64, bottom: float64, top: float64, z_near: float64, z_far: float64): Projection
        
        /** Creates a new [Projection] that projects positions using an orthogonal projection with the given size, X:Y aspect ratio, and clipping planes.  
         *  [param flip_fov] determines whether the projection's field of view is flipped over its diagonal.  
         */
        static create_orthogonal_aspect(size: float64, aspect: float64, z_near: float64, z_far: float64, flip_fov: boolean = false): Projection
        
        /** Creates a new [Projection] that projects positions in a frustum with the given clipping planes. */
        static create_frustum(left: float64, right: float64, bottom: float64, top: float64, z_near: float64, z_far: float64): Projection
        
        /** Creates a new [Projection] that projects positions in a frustum with the given size, X:Y aspect ratio, offset, and clipping planes.  
         *  [param flip_fov] determines whether the projection's field of view is flipped over its diagonal.  
         */
        static create_frustum_aspect(size: float64, aspect: float64, offset: Vector2, z_near: float64, z_far: float64, flip_fov: boolean = false): Projection
        
        /** Creates a new [Projection] that scales a given projection to fit around a given [AABB] in projection space. */
        static create_fit_aabb(aabb: AABB): Projection
        
        /** Returns a scalar value that is the signed factor by which areas are scaled by this matrix. If the sign is negative, the matrix flips the orientation of the area.  
         *  The determinant can be used to calculate the invertibility of a matrix or solve linear systems of equations involving the matrix, among other applications.  
         */
        determinant(): float64
        
        /** Returns a [Projection] with the near clipping distance adjusted to be [param new_znear].  
         *      
         *  **Note:** The original [Projection] must be a perspective projection.  
         */
        perspective_znear_adjusted(new_znear: float64): Projection
        
        /** Returns the clipping plane of this [Projection] whose index is given by [param plane].  
         *  [param plane] should be equal to one of [constant PLANE_NEAR], [constant PLANE_FAR], [constant PLANE_LEFT], [constant PLANE_TOP], [constant PLANE_RIGHT], or [constant PLANE_BOTTOM].  
         */
        get_projection_plane(plane: int64): Plane
        
        /** Returns a copy of this [Projection] with the signs of the values of the Y column flipped. */
        flipped_y(): Projection
        
        /** Returns a [Projection] with the X and Y values from the given [Vector2] added to the first and second values of the final column respectively. */
        jitter_offseted(offset: Vector2): Projection
        
        /** Returns the vertical field of view of the projection (in degrees) associated with the given horizontal field of view (in degrees) and aspect ratio.  
         *      
         *  **Note:** Unlike most methods of [Projection], [param aspect] is expected to be 1 divided by the X:Y aspect ratio.  
         */
        static get_fovy(fovx: float64, aspect: float64): float64
        
        /** Returns the distance for this [Projection] beyond which positions are clipped. */
        get_z_far(): float64
        
        /** Returns the distance for this [Projection] before which positions are clipped. */
        get_z_near(): float64
        
        /** Returns the X:Y aspect ratio of this [Projection]'s viewport. */
        get_aspect(): float64
        
        /** Returns the horizontal field of view of the projection (in degrees). */
        get_fov(): float64
        
        /** Returns `true` if this [Projection] performs an orthogonal projection. */
        is_orthogonal(): boolean
        
        /** Returns the dimensions of the viewport plane that this [Projection] projects positions onto, divided by two. */
        get_viewport_half_extents(): Vector2
        
        /** Returns the dimensions of the far clipping plane of the projection, divided by two. */
        get_far_plane_half_extents(): Vector2
        
        /** Returns a [Projection] that performs the inverse of this [Projection]'s projective transformation. */
        inverse(): Projection
        
        /** Returns the number of pixels with the given pixel width displayed per meter, after this [Projection] is applied. */
        get_pixels_per_meter(for_pixel_width: int64): int64
        
        /** Returns the factor by which the visible level of detail is scaled by this [Projection]. */
        get_lod_multiplier(): float64
        static MULTIPLY(left: Projection, right: Projection): Projection
        static MULTIPLY(left: Projection, right: Vector4): Vector4
        static MULTIPLY(left: Vector4, right: Projection): Vector4
        static EQUAL(left: Projection, right: Projection): boolean
        static NOT_EQUAL(left: Projection, right: Projection): boolean
        get x(): Vector4
        set x(value: Vector4)
        get y(): Vector4
        set y(value: Vector4)
        get z(): Vector4
        set z(value: Vector4)
        get w(): Vector4
        set w(value: Vector4)
    }
    /** A color represented in RGBA format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_color.html  
     */
    class Color {
        /** Alice blue color. */
        static readonly ALICE_BLUE: Color
        
        /** Antique white color. */
        static readonly ANTIQUE_WHITE: Color
        
        /** Aqua color. */
        static readonly AQUA: Color
        
        /** Aquamarine color. */
        static readonly AQUAMARINE: Color
        
        /** Azure color. */
        static readonly AZURE: Color
        
        /** Beige color. */
        static readonly BEIGE: Color
        
        /** Bisque color. */
        static readonly BISQUE: Color
        
        /** Black color. In GDScript, this is the default value of any color. */
        static readonly BLACK: Color
        
        /** Blanched almond color. */
        static readonly BLANCHED_ALMOND: Color
        
        /** Blue color. */
        static readonly BLUE: Color
        
        /** Blue violet color. */
        static readonly BLUE_VIOLET: Color
        
        /** Brown color. */
        static readonly BROWN: Color
        
        /** Burlywood color. */
        static readonly BURLYWOOD: Color
        
        /** Cadet blue color. */
        static readonly CADET_BLUE: Color
        
        /** Chartreuse color. */
        static readonly CHARTREUSE: Color
        
        /** Chocolate color. */
        static readonly CHOCOLATE: Color
        
        /** Coral color. */
        static readonly CORAL: Color
        
        /** Cornflower blue color. */
        static readonly CORNFLOWER_BLUE: Color
        
        /** Cornsilk color. */
        static readonly CORNSILK: Color
        
        /** Crimson color. */
        static readonly CRIMSON: Color
        
        /** Cyan color. */
        static readonly CYAN: Color
        
        /** Dark blue color. */
        static readonly DARK_BLUE: Color
        
        /** Dark cyan color. */
        static readonly DARK_CYAN: Color
        
        /** Dark goldenrod color. */
        static readonly DARK_GOLDENROD: Color
        
        /** Dark gray color. */
        static readonly DARK_GRAY: Color
        
        /** Dark green color. */
        static readonly DARK_GREEN: Color
        
        /** Dark khaki color. */
        static readonly DARK_KHAKI: Color
        
        /** Dark magenta color. */
        static readonly DARK_MAGENTA: Color
        
        /** Dark olive green color. */
        static readonly DARK_OLIVE_GREEN: Color
        
        /** Dark orange color. */
        static readonly DARK_ORANGE: Color
        
        /** Dark orchid color. */
        static readonly DARK_ORCHID: Color
        
        /** Dark red color. */
        static readonly DARK_RED: Color
        
        /** Dark salmon color. */
        static readonly DARK_SALMON: Color
        
        /** Dark sea green color. */
        static readonly DARK_SEA_GREEN: Color
        
        /** Dark slate blue color. */
        static readonly DARK_SLATE_BLUE: Color
        
        /** Dark slate gray color. */
        static readonly DARK_SLATE_GRAY: Color
        
        /** Dark turquoise color. */
        static readonly DARK_TURQUOISE: Color
        
        /** Dark violet color. */
        static readonly DARK_VIOLET: Color
        
        /** Deep pink color. */
        static readonly DEEP_PINK: Color
        
        /** Deep sky blue color. */
        static readonly DEEP_SKY_BLUE: Color
        
        /** Dim gray color. */
        static readonly DIM_GRAY: Color
        
        /** Dodger blue color. */
        static readonly DODGER_BLUE: Color
        
        /** Firebrick color. */
        static readonly FIREBRICK: Color
        
        /** Floral white color. */
        static readonly FLORAL_WHITE: Color
        
        /** Forest green color. */
        static readonly FOREST_GREEN: Color
        
        /** Fuchsia color. */
        static readonly FUCHSIA: Color
        
        /** Gainsboro color. */
        static readonly GAINSBORO: Color
        
        /** Ghost white color. */
        static readonly GHOST_WHITE: Color
        
        /** Gold color. */
        static readonly GOLD: Color
        
        /** Goldenrod color. */
        static readonly GOLDENROD: Color
        
        /** Gray color. */
        static readonly GRAY: Color
        
        /** Green color. */
        static readonly GREEN: Color
        
        /** Green yellow color. */
        static readonly GREEN_YELLOW: Color
        
        /** Honeydew color. */
        static readonly HONEYDEW: Color
        
        /** Hot pink color. */
        static readonly HOT_PINK: Color
        
        /** Indian red color. */
        static readonly INDIAN_RED: Color
        
        /** Indigo color. */
        static readonly INDIGO: Color
        
        /** Ivory color. */
        static readonly IVORY: Color
        
        /** Khaki color. */
        static readonly KHAKI: Color
        
        /** Lavender color. */
        static readonly LAVENDER: Color
        
        /** Lavender blush color. */
        static readonly LAVENDER_BLUSH: Color
        
        /** Lawn green color. */
        static readonly LAWN_GREEN: Color
        
        /** Lemon chiffon color. */
        static readonly LEMON_CHIFFON: Color
        
        /** Light blue color. */
        static readonly LIGHT_BLUE: Color
        
        /** Light coral color. */
        static readonly LIGHT_CORAL: Color
        
        /** Light cyan color. */
        static readonly LIGHT_CYAN: Color
        
        /** Light goldenrod color. */
        static readonly LIGHT_GOLDENROD: Color
        
        /** Light gray color. */
        static readonly LIGHT_GRAY: Color
        
        /** Light green color. */
        static readonly LIGHT_GREEN: Color
        
        /** Light pink color. */
        static readonly LIGHT_PINK: Color
        
        /** Light salmon color. */
        static readonly LIGHT_SALMON: Color
        
        /** Light sea green color. */
        static readonly LIGHT_SEA_GREEN: Color
        
        /** Light sky blue color. */
        static readonly LIGHT_SKY_BLUE: Color
        
        /** Light slate gray color. */
        static readonly LIGHT_SLATE_GRAY: Color
        
        /** Light steel blue color. */
        static readonly LIGHT_STEEL_BLUE: Color
        
        /** Light yellow color. */
        static readonly LIGHT_YELLOW: Color
        
        /** Lime color. */
        static readonly LIME: Color
        
        /** Lime green color. */
        static readonly LIME_GREEN: Color
        
        /** Linen color. */
        static readonly LINEN: Color
        
        /** Magenta color. */
        static readonly MAGENTA: Color
        
        /** Maroon color. */
        static readonly MAROON: Color
        
        /** Medium aquamarine color. */
        static readonly MEDIUM_AQUAMARINE: Color
        
        /** Medium blue color. */
        static readonly MEDIUM_BLUE: Color
        
        /** Medium orchid color. */
        static readonly MEDIUM_ORCHID: Color
        
        /** Medium purple color. */
        static readonly MEDIUM_PURPLE: Color
        
        /** Medium sea green color. */
        static readonly MEDIUM_SEA_GREEN: Color
        
        /** Medium slate blue color. */
        static readonly MEDIUM_SLATE_BLUE: Color
        
        /** Medium spring green color. */
        static readonly MEDIUM_SPRING_GREEN: Color
        
        /** Medium turquoise color. */
        static readonly MEDIUM_TURQUOISE: Color
        
        /** Medium violet red color. */
        static readonly MEDIUM_VIOLET_RED: Color
        
        /** Midnight blue color. */
        static readonly MIDNIGHT_BLUE: Color
        
        /** Mint cream color. */
        static readonly MINT_CREAM: Color
        
        /** Misty rose color. */
        static readonly MISTY_ROSE: Color
        
        /** Moccasin color. */
        static readonly MOCCASIN: Color
        
        /** Navajo white color. */
        static readonly NAVAJO_WHITE: Color
        
        /** Navy blue color. */
        static readonly NAVY_BLUE: Color
        
        /** Old lace color. */
        static readonly OLD_LACE: Color
        
        /** Olive color. */
        static readonly OLIVE: Color
        
        /** Olive drab color. */
        static readonly OLIVE_DRAB: Color
        
        /** Orange color. */
        static readonly ORANGE: Color
        
        /** Orange red color. */
        static readonly ORANGE_RED: Color
        
        /** Orchid color. */
        static readonly ORCHID: Color
        
        /** Pale goldenrod color. */
        static readonly PALE_GOLDENROD: Color
        
        /** Pale green color. */
        static readonly PALE_GREEN: Color
        
        /** Pale turquoise color. */
        static readonly PALE_TURQUOISE: Color
        
        /** Pale violet red color. */
        static readonly PALE_VIOLET_RED: Color
        
        /** Papaya whip color. */
        static readonly PAPAYA_WHIP: Color
        
        /** Peach puff color. */
        static readonly PEACH_PUFF: Color
        
        /** Peru color. */
        static readonly PERU: Color
        
        /** Pink color. */
        static readonly PINK: Color
        
        /** Plum color. */
        static readonly PLUM: Color
        
        /** Powder blue color. */
        static readonly POWDER_BLUE: Color
        
        /** Purple color. */
        static readonly PURPLE: Color
        
        /** Rebecca purple color. */
        static readonly REBECCA_PURPLE: Color
        
        /** Red color. */
        static readonly RED: Color
        
        /** Rosy brown color. */
        static readonly ROSY_BROWN: Color
        
        /** Royal blue color. */
        static readonly ROYAL_BLUE: Color
        
        /** Saddle brown color. */
        static readonly SADDLE_BROWN: Color
        
        /** Salmon color. */
        static readonly SALMON: Color
        
        /** Sandy brown color. */
        static readonly SANDY_BROWN: Color
        
        /** Sea green color. */
        static readonly SEA_GREEN: Color
        
        /** Seashell color. */
        static readonly SEASHELL: Color
        
        /** Sienna color. */
        static readonly SIENNA: Color
        
        /** Silver color. */
        static readonly SILVER: Color
        
        /** Sky blue color. */
        static readonly SKY_BLUE: Color
        
        /** Slate blue color. */
        static readonly SLATE_BLUE: Color
        
        /** Slate gray color. */
        static readonly SLATE_GRAY: Color
        
        /** Snow color. */
        static readonly SNOW: Color
        
        /** Spring green color. */
        static readonly SPRING_GREEN: Color
        
        /** Steel blue color. */
        static readonly STEEL_BLUE: Color
        
        /** Tan color. */
        static readonly TAN: Color
        
        /** Teal color. */
        static readonly TEAL: Color
        
        /** Thistle color. */
        static readonly THISTLE: Color
        
        /** Tomato color. */
        static readonly TOMATO: Color
        
        /** Transparent color (white with zero alpha). */
        static readonly TRANSPARENT: Color
        
        /** Turquoise color. */
        static readonly TURQUOISE: Color
        
        /** Violet color. */
        static readonly VIOLET: Color
        
        /** Web gray color. */
        static readonly WEB_GRAY: Color
        
        /** Web green color. */
        static readonly WEB_GREEN: Color
        
        /** Web maroon color. */
        static readonly WEB_MAROON: Color
        
        /** Web purple color. */
        static readonly WEB_PURPLE: Color
        
        /** Wheat color. */
        static readonly WHEAT: Color
        
        /** White color. */
        static readonly WHITE: Color
        
        /** White smoke color. */
        static readonly WHITE_SMOKE: Color
        
        /** Yellow color. */
        static readonly YELLOW: Color
        
        /** Yellow green color. */
        static readonly YELLOW_GREEN: Color
        constructor()
        constructor(from: Color)
        constructor(from: Color, alpha: float64)
        constructor(r: float64, g: float64, b: float64)
        constructor(r: float64, g: float64, b: float64, a: float64)
        constructor(code: string)
        constructor(code: string, alpha: float64)
        
        /** Returns the color converted to a 32-bit integer in ARGB format (each component is 8 bits). ARGB is more compatible with DirectX.  
         *    
         */
        to_argb32(): int64
        
        /** Returns the color converted to a 32-bit integer in ABGR format (each component is 8 bits). ABGR is the reversed version of the default RGBA format.  
         *    
         */
        to_abgr32(): int64
        
        /** Returns the color converted to a 32-bit integer in RGBA format (each component is 8 bits). RGBA is Godot's default format. This method is the inverse of [method hex].  
         *    
         */
        to_rgba32(): int64
        
        /** Returns the color converted to a 64-bit integer in ARGB format (each component is 16 bits). ARGB is more compatible with DirectX.  
         *    
         */
        to_argb64(): int64
        
        /** Returns the color converted to a 64-bit integer in ABGR format (each component is 16 bits). ABGR is the reversed version of the default RGBA format.  
         *    
         */
        to_abgr64(): int64
        
        /** Returns the color converted to a 64-bit integer in RGBA format (each component is 16 bits). RGBA is Godot's default format. This method is the inverse of [method hex64].  
         *    
         */
        to_rgba64(): int64
        
        /** Returns the color converted to an HTML hexadecimal color [String] in RGBA format, without the hash (`#`) prefix.  
         *  Setting [param with_alpha] to `false`, excludes alpha from the hexadecimal string, using RGB format instead of RGBA format.  
         *    
         */
        to_html(with_alpha: boolean = true): string
        
        /** Returns a new color with all components clamped between the components of [param min] and [param max], by running [method @GlobalScope.clamp] on each component. */
        clamp(min: Color = new Color(0, 0, 0, 0), max: Color = new Color(1, 1, 1, 1)): Color
        
        /** Returns the color with its [member r], [member g], and [member b] components inverted (`(1 - r, 1 - g, 1 - b, a)`).  
         *    
         */
        inverted(): Color
        
        /** Returns the linear interpolation between this color's components and [param to]'s components. The interpolation factor [param weight] should be between 0.0 and 1.0 (inclusive). See also [method @GlobalScope.lerp].  
         *    
         */
        lerp(to: Color, weight: float64): Color
        
        /** Returns a new color resulting from making this color lighter by the specified [param amount], which should be a ratio from 0.0 to 1.0. See also [method darkened].  
         *    
         */
        lightened(amount: float64): Color
        
        /** Returns a new color resulting from making this color darker by the specified [param amount] (ratio from 0.0 to 1.0). See also [method lightened].  
         *    
         */
        darkened(amount: float64): Color
        
        /** Returns a new color resulting from overlaying this color over the given color. In a painting program, you can imagine it as the [param over] color painted over this color (including alpha).  
         *    
         */
        blend(over: Color): Color
        
        /** Returns the light intensity of the color, as a value between 0.0 and 1.0 (inclusive). This is useful when determining light or dark color. Colors with a luminance smaller than 0.5 can be generally considered dark.  
         *      
         *  **Note:** [method get_luminance] relies on the color being in the linear color space to return an accurate relative luminance value. If the color is in the sRGB color space, use [method srgb_to_linear] to convert it to the linear color space first.  
         */
        get_luminance(): float64
        
        /** Returns the color converted to the linear color space. This method assumes the original color already is in the sRGB color space. See also [method linear_to_srgb] which performs the opposite operation. */
        srgb_to_linear(): Color
        
        /** Returns the color converted to the [url=https://en.wikipedia.org/wiki/SRGB]sRGB[/url] color space. This method assumes the original color is in the linear color space. See also [method srgb_to_linear] which performs the opposite operation. */
        linear_to_srgb(): Color
        
        /** Returns `true` if this color and [param to] are approximately equal, by running [method @GlobalScope.is_equal_approx] on each component. */
        is_equal_approx(to: Color): boolean
        
        /** Returns the [Color] associated with the provided [param hex] integer in 32-bit RGBA format (8 bits per channel). This method is the inverse of [method to_rgba32].  
         *  In GDScript and C#, the [int] is best visualized with hexadecimal notation (`"0x"` prefix, making it `"0xRRGGBBAA"`).  
         *    
         *  If you want to use hex notation in a constant expression, use the equivalent constructor instead (i.e. `Color(0xRRGGBBAA)`).  
         */
        static hex(hex: int64): Color
        
        /** Returns the [Color] associated with the provided [param hex] integer in 64-bit RGBA format (16 bits per channel). This method is the inverse of [method to_rgba64].  
         *  In GDScript and C#, the [int] is best visualized with hexadecimal notation (`"0x"` prefix, making it `"0xRRRRGGGGBBBBAAAA"`).  
         */
        static hex64(hex: int64): Color
        
        /** Returns a new color from [param rgba], an HTML hexadecimal color string. [param rgba] is not case-sensitive, and may be prefixed by a hash sign (`#`).  
         *  [param rgba] must be a valid three-digit or six-digit hexadecimal color string, and may contain an alpha channel value. If [param rgba] does not contain an alpha channel value, an alpha channel value of 1.0 is applied. If [param rgba] is invalid, returns an empty color.  
         *    
         */
        static html(rgba: string): Color
        
        /** Returns `true` if [param color] is a valid HTML hexadecimal color string. The string must be a hexadecimal value (case-insensitive) of either 3, 4, 6 or 8 digits, and may be prefixed by a hash sign (`#`). This method is identical to [method String.is_valid_html_color].  
         *    
         */
        static html_is_valid(color: string): boolean
        
        /** Creates a [Color] from the given string, which can be either an HTML color code or a named color (case-insensitive). Returns [param default] if the color cannot be inferred from the string.  
         *  If you want to create a color from String in a constant expression, use the equivalent constructor instead (i.e. `Color("color string")`).  
         */
        static from_string(str: string, default_: Color): Color
        
        /** Constructs a color from an [url=https://en.wikipedia.org/wiki/HSL_and_HSV]HSV profile[/url]. The hue ([param h]), saturation ([param s]), and value ([param v]) are typically between 0.0 and 1.0.  
         *    
         */
        static from_hsv(h: float64, s: float64, v: float64, alpha: float64 = 1): Color
        
        /** Constructs a color from an [url=https://bottosson.github.io/posts/colorpicker/]OK HSL profile[/url]. The hue ([param h]), saturation ([param s]), and lightness ([param l]) are typically between 0.0 and 1.0.  
         *    
         */
        static from_ok_hsl(h: float64, s: float64, l: float64, alpha: float64 = 1): Color
        
        /** Decodes a [Color] from an RGBE9995 format integer. See [constant Image.FORMAT_RGBE9995]. */
        static from_rgbe9995(rgbe: int64): Color
        
        /** Returns a [Color] constructed from red ([param r8]), green ([param g8]), blue ([param b8]), and optionally alpha ([param a8]) integer channels, each divided by `255.0` for their final value.  
         *    
         *      
         *  **Note:** Due to the lower precision of [method from_rgba8] compared to the standard [Color] constructor, a color created with [method from_rgba8] will generally not be equal to the same color created with the standard [Color] constructor. Use [method is_equal_approx] for comparisons to avoid issues with floating-point precision error.  
         */
        static from_rgba8(r8: int64, g8: int64, b8: int64, a8: int64 = 255): Color
        static ADD(left: Color, right: Color): Color
        static SUBTRACT(left: Color, right: Color): Color
        static MULTIPLY(left: Color, right: Color): Color
        static MULTIPLY(left: Color, right: float64): Color
        static MULTIPLY(left: float64, right: Color): Color
        static DIVIDE(left: Color, right: Color): Color
        static DIVIDE(left: Color, right: float64): Color
        static NEGATE(left: Color): Color
        static EQUAL(left: Color, right: Color): boolean
        static NOT_EQUAL(left: Color, right: Color): boolean
        get r(): float64
        set r(value: float64)
        get g(): float64
        set g(value: float64)
        get b(): float64
        set b(value: float64)
        get a(): float64
        set a(value: float64)
        get r8(): int64
        set r8(value: int64)
        get g8(): int64
        set g8(value: int64)
        get b8(): int64
        set b8(value: int64)
        get a8(): int64
        set a8(value: int64)
        get h(): float64
        set h(value: float64)
        get s(): float64
        set s(value: float64)
        get v(): float64
        set v(value: float64)
        get ok_hsl_h(): float64
        set ok_hsl_h(value: float64)
        get ok_hsl_s(): float64
        set ok_hsl_s(value: float64)
        get ok_hsl_l(): float64
        set ok_hsl_l(value: float64)
    }
    /** A pre-parsed scene tree path.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_nodepath.html  
     */
    class NodePath {
        constructor()
        constructor(from: NodePath | string)
        constructor(from: string)
        
        /** Returns `true` if the node path is absolute. Unlike a relative path, an absolute path is represented by a leading slash character (`/`) and always begins from the [SceneTree]. It can be used to reliably access nodes from the root node (e.g. `"/root/Global"` if an autoload named "Global" exists). */
        is_absolute(): boolean
        
        /** Returns the number of node names in the path. Property subnames are not included.  
         *  For example, `"../RigidBody2D/Sprite2D:texture"` contains 3 node names.  
         */
        get_name_count(): int64
        
        /** Returns the node name indicated by [param idx], starting from 0. If [param idx] is out of bounds, an error is generated. See also [method get_subname_count] and [method get_name_count].  
         *    
         */
        get_name(idx: int64): StringName
        
        /** Returns the number of property names ("subnames") in the path. Each subname in the node path is listed after a colon character (`:`).  
         *  For example, `"Level/RigidBody2D/Sprite2D:texture:resource_name"` contains 2 subnames.  
         */
        get_subname_count(): int64
        
        /** Returns the 32-bit hash value representing the node path's contents.  
         *      
         *  **Note:** Node paths with equal hash values are  *not*  guaranteed to be the same, as a result of hash collisions. Node paths with different hash values are guaranteed to be different.  
         */
        hash(): int64
        
        /** Returns the property name indicated by [param idx], starting from 0. If [param idx] is out of bounds, an error is generated. See also [method get_subname_count].  
         *    
         */
        get_subname(idx: int64): StringName
        
        /** Returns all node names concatenated with a slash character (`/`) as a single [StringName]. */
        get_concatenated_names(): StringName
        
        /** Returns all property subnames concatenated with a colon character (`:`) as a single [StringName].  
         *    
         */
        get_concatenated_subnames(): StringName
        
        /** Returns the slice of the [NodePath], from [param begin] (inclusive) to [param end] (exclusive), as a new [NodePath].  
         *  The absolute value of [param begin] and [param end] will be clamped to the sum of [method get_name_count] and [method get_subname_count], so the default value for [param end] makes it slice to the end of the [NodePath] by default (i.e. `path.slice(1)` is a shorthand for `path.slice(1, path.get_name_count() + path.get_subname_count())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the [NodePath] (i.e. `path.slice(0, -2)` is a shorthand for `path.slice(0, path.get_name_count() + path.get_subname_count() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): NodePath
        
        /** Returns a copy of this node path with a colon character (`:`) prefixed, transforming it to a pure property path with no node names (relative to the current node).  
         *    
         */
        get_as_property_path(): NodePath
        
        /** Returns `true` if the node path has been constructed from an empty [String] (`""`). */
        is_empty(): boolean
        static EQUAL(left: NodePath | string, right: NodePath | string): boolean
        static NOT_EQUAL(left: NodePath | string, right: NodePath | string): boolean
    }
    /** A handle for a [Resource]'s unique identifier.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rid.html  
     */
    class RID {
        constructor()
        constructor(from: RID)
        
        /** Returns `true` if the [RID] is not `0`. */
        is_valid(): boolean
        
        /** Returns the ID of the referenced low-level resource. */
        get_id(): int64
        static EQUAL(left: RID, right: RID): boolean
        static NOT_EQUAL(left: RID, right: RID): boolean
        static LESS(left: RID, right: RID): boolean
        static LESS_EQUAL(left: RID, right: RID): boolean
        static GREATER(left: RID, right: RID): boolean
        static GREATER_EQUAL(left: RID, right: RID): boolean
    }
    /** A built-in type representing a method or a standalone function.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_callable.html  
     */
    class Callable extends AnyCallable {
        /** Create a callable object with a bound object `self` */
        static create<R = void>(self: Object, fn: () => R): Callable0<R>
        /** Create a callable object with a bound object `self` */
        static create<T1, R = void>(self: Object, fn: (v1: T1) => R): Callable1<T1, R>
        /** Create a callable object with a bound object `self` */
        static create<T1, T2, R = void>(self: Object, fn: (v1: T1, v2: T2) => R): Callable2<T1, T2, R>
        /** Create a callable object with a bound object `self` */
        static create<T1, T2, T3, R = void>(self: Object, fn: (v1: T1, v2: T2, v3: T3) => R): Callable3<T1, T2, T3, R>
        /** Create a callable object with a bound object `self` */
        static create<T1, T2, T3, T4, R = void>(self: Object, fn: (v1: T1, v2: T2, v3: T3, v4: T4) => R): Callable4<T1, T2, T3, T4, R>
        /** Create a callable object with a bound object `self` */
        static create<T1, T2, T3, T4, T5, R = void>(self: Object, fn: (v1: T1, v2: T2, v3: T3, v4: T4, v5: T5) => R): Callable5<T1, T2, T3, T4, T5, R>
        /** Create a callable object with a bound object `self` */
        static create<R = void>(fn: () => R): Callable0<R>
        /** Create a callable object with a bound object `self` */
        static create<T1, R = void>(fn: (v1: T1) => R): Callable1<T1, R>
        /** Create a callable object with a bound object `self` */
        static create<T1, T2, R = void>(fn: (v1: T1, v2: T2) => R): Callable2<T1, T2, R>
        /** Create a callable object with a bound object `self` */
        static create<T1, T2, T3, R = void>(fn: (v1: T1, v2: T2, v3: T3) => R): Callable3<T1, T2, T3, R>
        /** Create a callable object with a bound object `self` */
        static create<T1, T2, T3, T4, R = void>(fn: (v1: T1, v2: T2, v3: T3, v4: T4) => R): Callable4<T1, T2, T3, T4, R>
        /** Create a callable object with a bound object `self` */
        static create<T1, T2, T3, T4, T5, R = void>(fn: (v1: T1, v2: T2, v3: T3, v4: T4, v5: T5) => R): Callable5<T1, T2, T3, T4, T5, R>
        constructor()
        constructor(from: AnyCallable)
        constructor(object: Object, method: StringName)
        
        /** Creates a new [Callable] for the method named [param method] in the specified [param variant]. To represent a method of a built-in [Variant] type, a custom callable is used (see [method is_custom]). If [param variant] is [Object], then a standard callable will be created instead.  
         *      
         *  **Note:** This method is always necessary for the [Dictionary] type, as property syntax is used to access its entries. You may also use this method when [param variant]'s type is not known in advance (for polymorphism).  
         */
        static create(variant: any, method: StringName): AnyCallable
        
        /** Calls the method represented by this [Callable]. Unlike [method call], this method expects all arguments to be contained inside the [param arguments] [Array]. */
        callv(arguments_: GArray): any
        
        /** Returns `true` if this [Callable] has no target to call the method on. Equivalent to `callable == Callable()`.  
         *      
         *  **Note:** This is  *not*  the same as `not is_valid()` and using `not is_null()` will  *not*  guarantee that this callable can be called. Use [method is_valid] instead.  
         */
        is_null(): boolean
        
        /** Returns `true` if this [Callable] is a custom callable. Custom callables are used:  
         *  - for binding/unbinding arguments (see [method bind] and [method unbind]);  
         *  - for representing methods of built-in [Variant] types (see [method create]);  
         *  - for representing global, lambda, and RPC functions in GDScript;  
         *  - for other purposes in the core, GDExtension, and C#.  
         */
        is_custom(): boolean
        
        /** Returns `true` if this [Callable] is a standard callable. This method is the opposite of [method is_custom]. Returns `false` if this callable is a lambda function. */
        is_standard(): boolean
        
        /** Returns `true` if the callable's object exists and has a valid method name assigned, or is a custom callable. */
        is_valid(): boolean
        
        /** Returns the object on which this [Callable] is called. */
        get_object(): Object
        
        /** Returns the ID of this [Callable]'s object (see [method Object.get_instance_id]). */
        get_object_id(): int64
        
        /** Returns the name of the method represented by this [Callable]. If the callable is a GDScript lambda function, returns the function's name or `"<anonymous lambda>"`. */
        get_method(): StringName
        
        /** Returns the total number of arguments this [Callable] should take, including optional arguments. This means that any arguments bound with [method bind] are  *subtracted*  from the result, and any arguments unbound with [method unbind] are  *added*  to the result. */
        get_argument_count(): int64
        
        /** Returns the total amount of arguments bound via successive [method bind] or [method unbind] calls. This is the same as the size of the array returned by [method get_bound_arguments]. See [method get_bound_arguments] for details.  
         *      
         *  **Note:** The [method get_bound_arguments_count] and [method get_unbound_arguments_count] methods can both return positive values.  
         */
        get_bound_arguments_count(): int64
        
        /** Returns the array of arguments bound via successive [method bind] or [method unbind] calls. These arguments will be added  *after*  the arguments passed to the call, from which [method get_unbound_arguments_count] arguments on the right have been previously excluded.  
         *    
         */
        get_bound_arguments(): GArray
        
        /** Returns the total amount of arguments unbound via successive [method bind] or [method unbind] calls. See [method get_bound_arguments] for details.  
         *      
         *  **Note:** The [method get_bound_arguments_count] and [method get_unbound_arguments_count] methods can both return positive values.  
         */
        get_unbound_arguments_count(): int64
        
        /** Returns the 32-bit hash value of this [Callable]'s object.  
         *      
         *  **Note:** [Callable]s with equal content will always produce identical hash values. However, the reverse is not true. Returning identical hash values does  *not*  imply the callables are equal, because different callables can have identical hash values due to hash collisions. The engine uses a 32-bit hash algorithm for [method hash].  
         */
        hash(): int64
        
        /** Returns a copy of this [Callable] with one or more arguments bound, reading them from an array. When called, the bound arguments are passed  *after*  the arguments supplied by [method call]. See also [method unbind].  
         *      
         *  **Note:** When this method is chained with other similar methods, the order in which the argument list is modified is read from right to left.  
         */
        bindv(arguments_: GArray): AnyCallable
        
        /** Returns a copy of this [Callable] with a number of arguments unbound. In other words, when the new callable is called the last few arguments supplied by the user are ignored, according to [param argcount]. The remaining arguments are passed to the callable. This allows to use the original callable in a context that attempts to pass more arguments than this callable can handle, e.g. a signal with a fixed number of arguments. See also [method bind].  
         *      
         *  **Note:** When this method is chained with other similar methods, the order in which the argument list is modified is read from right to left.  
         *    
         */
        unbind(argcount: int64): AnyCallable
        
        /** Calls the method represented by this [Callable]. Arguments can be passed and should match the method's signature. */
        call(...vargargs: any[]): any
        
        /** Calls the method represented by this [Callable] in deferred mode, i.e. at the end of the current frame. Arguments can be passed and should match the method's signature.  
         *    
         *      
         *  **Note:** Deferred calls are processed at idle time. Idle time happens mainly at the end of process and physics frames. In it, deferred calls will be run until there are none left, which means you can defer calls from other deferred calls and they'll still be run in the current idle time cycle. This means you should not call a method deferred from itself (or from a method called by it), as this causes infinite recursion the same way as if you had called the method directly.  
         *  See also [method Object.call_deferred].  
         */
        call_deferred(...vargargs: any[]): void
        
        /** Perform an RPC (Remote Procedure Call) on all connected peers. This is used for multiplayer and is normally not available, unless the function being called has been marked as  *RPC*  (using [annotation @GDScript.@rpc] or [method Node.rpc_config]). Calling this method on unsupported functions will result in an error. See [method Node.rpc]. */
        rpc(...vargargs: any[]): void
        
        /** Perform an RPC (Remote Procedure Call) on a specific peer ID (see multiplayer documentation for reference). This is used for multiplayer and is normally not available unless the function being called has been marked as  *RPC*  (using [annotation @GDScript.@rpc] or [method Node.rpc_config]). Calling this method on unsupported functions will result in an error. See [method Node.rpc_id]. */
        rpc_id(peer_id: int64, ...vargargs: any[]): void
        
        /** Returns a copy of this [Callable] with one or more arguments bound. When called, the bound arguments are passed  *after*  the arguments supplied by [method call]. See also [method unbind].  
         *      
         *  **Note:** When this method is chained with other similar methods, the order in which the argument list is modified is read from right to left.  
         */
        bind(...vargargs: any[]): AnyCallable
        static EQUAL(left: AnyCallable, right: AnyCallable): boolean
        static NOT_EQUAL(left: AnyCallable, right: AnyCallable): boolean
    }
    /** A built-in type representing a signal of an [Object].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_signal.html  
     */
    class Signal extends AnySignal {
        constructor()
        constructor(from: AnySignal)
        constructor(object: Object, signal: StringName)
        
        /** Returns `true` if this [Signal] has no object and the signal name is empty. Equivalent to `signal == Signal()`. */
        is_null(): boolean
        
        /** Returns the object emitting this signal. */
        get_object(): Object
        
        /** Returns the ID of the object emitting this signal (see [method Object.get_instance_id]). */
        get_object_id(): int64
        
        /** Returns the name of this signal. */
        get_name(): StringName
        
        /** Connects this signal to the specified [param callable]. Optional [param flags] can be also added to configure the connection's behavior (see [enum Object.ConnectFlags] constants). You can provide additional arguments to the connected [param callable] by using [method Callable.bind].  
         *  A signal can only be connected once to the same [Callable]. If the signal is already connected, returns [constant ERR_INVALID_PARAMETER] and pushes an error message, unless the signal is connected with [constant Object.CONNECT_REFERENCE_COUNTED]. To prevent this, use [method is_connected] first to check for existing connections.  
         *    
         */
        connect(callable: AnyCallable, flags: int64 = 0): int64
        
        /** Disconnects this signal from the specified [Callable]. If the connection does not exist, generates an error. Use [method is_connected] to make sure that the connection exists. */
        disconnect(callable: AnyCallable): void
        
        /** Returns `true` if the specified [Callable] is connected to this signal. */
        is_connected(callable: AnyCallable): boolean
        
        /** Returns an [Array] of connections for this signal. Each connection is represented as a [Dictionary] that contains three entries:  
         *  - `signal` is a reference to this signal;  
         *  - `callable` is a reference to the connected [Callable];  
         *  - `flags` is a combination of [enum Object.ConnectFlags].  
         */
        get_connections(): GArray
        
        /** Returns `true` if any [Callable] is connected to this signal. */
        has_connections(): boolean
        
        /** Emits this signal. All [Callable]s connected to this signal will be triggered. This method supports a variable number of arguments, so parameters can be passed as a comma separated list. */
        emit(...vargargs: any[]): void
        static EQUAL(left: AnySignal, right: AnySignal): boolean
        static NOT_EQUAL(left: AnySignal, right: AnySignal): boolean
    }
    class GDictionary<T = Record<any, any>> {
        [Symbol.iterator](): IteratorObject<{ key: any, value: any }>
        /** Returns a Proxy that targets this GDictionary but behaves similar to a regular JavaScript object. Values are exposed as enumerable properties, so Object.keys(), Object.entries() etc. will work. */
        proxy(): GDictionaryProxy<T>
        
        set_keyed<K extends keyof T>(key: K, value: T[K]): void
        get_keyed<K extends keyof T>(key: K): T[K]
        constructor()
        constructor(from: GDictionary)
        constructor(base: GDictionary, key_type: int64, key_class_name: StringName, key_script: any, value_type: int64, value_class_name: StringName, value_script: any)
        
        /** Returns the number of entries in the dictionary. Empty dictionaries (`{ }`) always return `0`. See also [method is_empty]. */
        size(): int64
        
        /** Returns `true` if the dictionary is empty (its size is `0`). See also [method size]. */
        is_empty(): boolean
        
        /** Clears the dictionary, removing all entries from it. */
        clear(): void
        
        /** Assigns elements of another [param dictionary] into the dictionary. Resizes the dictionary to match [param dictionary]. Performs type conversions if the dictionary is typed. */
        assign(dictionary: T): void
        
        /** Sorts the dictionary in-place by key. This can be used to ensure dictionaries with the same contents produce equivalent results when getting the [method keys], getting the [method values], and converting to a string. This is also useful when wanting a JSON representation consistent with what is in memory, and useful for storing on a database that requires dictionaries to be sorted. */
        sort(): void
        
        /** Adds entries from [param dictionary] to this dictionary. By default, duplicate keys are not copied over, unless [param overwrite] is `true`.  
         *    
         *      
         *  **Note:** [method merge] is  *not*  recursive. Nested dictionaries are considered as keys that can be overwritten or not depending on the value of [param overwrite], but they will never be merged together.  
         */
        merge(dictionary: T, overwrite: boolean = false): void
        
        /** Returns a copy of this dictionary merged with the other [param dictionary]. By default, duplicate keys are not copied over, unless [param overwrite] is `true`. See also [method merge].  
         *  This method is useful for quickly making dictionaries with default values:  
         *    
         */
        merged<U>(dictionary: GDictionary<U>, overwrite: boolean = false): GDictionary<T & U>
        
        /** Returns `true` if the dictionary contains an entry with the given [param key].  
         *    
         *  In GDScript, this is equivalent to the `in` operator:  
         *    
         *      
         *  **Note:** This method returns `true` as long as the [param key] exists, even if its corresponding value is `null`.  
         */
        has(key: keyof T): boolean
        
        /** Returns `true` if the dictionary contains all keys in the given [param keys] array.  
         *    
         */
        has_all(keys: GArray<keyof T>): boolean
        
        /** Finds and returns the first key whose associated value is equal to [param value], or `null` if it is not found.  
         *      
         *  **Note:** `null` is also a valid key. If inside the dictionary, [method find_key] may give misleading results.  
         */
        find_key(value: T[keyof T]): keyof T
        
        /** Removes the dictionary entry by key, if it exists. Returns `true` if the given [param key] existed in the dictionary, otherwise `false`.  
         *      
         *  **Note:** Do not erase entries while iterating over the dictionary. You can iterate over the [method keys] array instead.  
         */
        erase(key: keyof T): boolean
        
        /** Returns a hashed 32-bit integer value representing the dictionary contents.  
         *    
         *      
         *  **Note:** Dictionaries with the same entries but in a different order will not have the same hash.  
         *      
         *  **Note:** Dictionaries with equal hash values are  *not*  guaranteed to be the same, because of hash collisions. On the contrary, dictionaries with different hash values are guaranteed to be different.  
         */
        hash(): int64
        
        /** Returns the list of keys in the dictionary. */
        keys(): Array<keyof T>
        
        /** Returns the list of values in this dictionary. */
        values(): GArray<T[keyof T]>
        
        /** Creates and returns a new copy of the dictionary. If [param deep] is `true`, inner [Dictionary] and [Array] keys and values are also copied, recursively. */
        duplicate(deep: boolean = false): GDictionary<T>
        
        /** Returns the corresponding value for the given [param key] in the dictionary. If the [param key] does not exist, returns [param default], or `null` if the parameter is omitted. */
        get<K extends keyof T>(key: K, default_: any = <any> {}): T[K]
        
        /** Gets a value and ensures the key is set. If the [param key] exists in the dictionary, this behaves like [method get]. Otherwise, the [param default] value is inserted into the dictionary and returned. */
        get_or_add<K extends keyof T>(key: K, default_: any = <any> {}): any
        
        /** Sets the value of the element at the given [param key] to the given [param value]. This is the same as using the `[]` operator (`array[index] = value`). */
        set<K extends keyof T>(key: K, value: T[K]): boolean
        
        /** Returns `true` if the dictionary is typed. Typed dictionaries can only store keys/values of their associated type and provide type safety for the `[]` operator. Methods of typed dictionary still return [Variant]. */
        is_typed(): boolean
        
        /** Returns `true` if the dictionary's keys are typed. */
        is_typed_key(): boolean
        
        /** Returns `true` if the dictionary's values are typed. */
        is_typed_value(): boolean
        
        /** Returns `true` if the dictionary is typed the same as [param dictionary]. */
        is_same_typed(dictionary: GDictionary): boolean
        
        /** Returns `true` if the dictionary's keys are typed the same as [param dictionary]'s keys. */
        is_same_typed_key(dictionary: GDictionary): boolean
        
        /** Returns `true` if the dictionary's values are typed the same as [param dictionary]'s values. */
        is_same_typed_value(dictionary: GDictionary): boolean
        
        /** Returns the built-in [Variant] type of the typed dictionary's keys as a [enum Variant.Type] constant. If the keys are not typed, returns [constant TYPE_NIL]. See also [method is_typed_key]. */
        get_typed_key_builtin(): int64
        
        /** Returns the built-in [Variant] type of the typed dictionary's values as a [enum Variant.Type] constant. If the values are not typed, returns [constant TYPE_NIL]. See also [method is_typed_value]. */
        get_typed_value_builtin(): int64
        
        /** Returns the **built-in** class name of the typed dictionary's keys, if the built-in [Variant] type is [constant TYPE_OBJECT]. Otherwise, returns an empty [StringName]. See also [method is_typed_key] and [method Object.get_class]. */
        get_typed_key_class_name(): StringName
        
        /** Returns the **built-in** class name of the typed dictionary's values, if the built-in [Variant] type is [constant TYPE_OBJECT]. Otherwise, returns an empty [StringName]. See also [method is_typed_value] and [method Object.get_class]. */
        get_typed_value_class_name(): StringName
        
        /** Returns the [Script] instance associated with this typed dictionary's keys, or `null` if it does not exist. See also [method is_typed_key]. */
        get_typed_key_script(): any
        
        /** Returns the [Script] instance associated with this typed dictionary's values, or `null` if it does not exist. See also [method is_typed_value]. */
        get_typed_value_script(): any
        
        /** Makes the dictionary read-only, i.e. disables modification of the dictionary's contents. Does not apply to nested content, e.g. content of nested dictionaries. */
        make_read_only(): void
        
        /** Returns `true` if the dictionary is read-only. See [method make_read_only]. Dictionaries are automatically read-only if declared with `const` keyword. */
        is_read_only(): boolean
        
        /** Returns `true` if the two dictionaries contain the same keys and values, inner [Dictionary] and [Array] keys and values are compared recursively. */
        recursive_equal(dictionary: GDictionary, recursion_count: int64): boolean
        static EQUAL(left: GDictionary, right: GDictionary): boolean
        static NOT_EQUAL(left: GDictionary, right: GDictionary): boolean
    }
    class GArray<T = Any> {
        [Symbol.iterator](): IteratorObject<T>
        /** Returns a Proxy that targets this GArray but behaves similar to a JavaScript array. */
        proxy(): GArrayProxy<T>
        
        set_indexed(index: number, value: T): void
        get_indexed(index: number): T
        constructor()
        constructor(from: GArray)
        constructor(base: GArray, type: int64, class_name: StringName, script: any)
        constructor(from: PackedByteArray | byte[] | ArrayBuffer)
        constructor(from: PackedInt32Array | int32[])
        constructor(from: PackedInt64Array | int64[])
        constructor(from: PackedFloat32Array | float32[])
        constructor(from: PackedFloat64Array | float64[])
        constructor(from: PackedStringArray | string[])
        constructor(from: PackedVector2Array | Vector2[])
        constructor(from: PackedVector3Array | Vector3[])
        constructor(from: PackedColorArray | Color[])
        constructor(from: PackedVector4Array)
        
        /** Returns the number of elements in the array. Empty arrays (`[]`) always return `0`. See also [method is_empty]. */
        size(): int64
        
        /** Returns `true` if the array is empty (`[]`). See also [method size]. */
        is_empty(): boolean
        
        /** Removes all elements from the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns a hashed 32-bit integer value representing the array and its contents.  
         *      
         *  **Note:** Arrays with equal hash values are  *not*  guaranteed to be the same, as a result of hash collisions. On the countrary, arrays with different hash values are guaranteed to be different.  
         */
        hash(): int64
        
        /** Assigns elements of another [param array] into the array. Resizes the array to match [param array]. Performs type conversions if the array is typed. */
        assign(array: GArray): void
        
        /** Returns the element at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): T
        
        /** Sets the value of the element at the given [param index] to the given [param value]. This will not change the size of the array, it only changes the value at an index already in the array. This is the same as using the `[]` operator (`array[index] = value`). */
        set(index: int64, value: T): void
        
        /** Appends an element at the end of the array. See also [method push_front]. */
        push_back(value: T): void
        
        /** Adds an element at the beginning of the array. See also [method push_back].  
         *      
         *  **Note:** This method shifts every other element's index forward, which may have a noticeable performance cost, especially on larger arrays.  
         */
        push_front(value: T): void
        
        /** Appends [param value] at the end of the array (alias of [method push_back]). */
        append(value: T): void
        
        /** Appends another [param array] at the end of this array.  
         *    
         */
        append_array(array: GArray<T>): void
        
        /** Sets the array's number of elements to [param size]. If [param size] is smaller than the array's current size, the elements at the end are removed. If [param size] is greater, new default elements (usually `null`) are added, depending on the array's type.  
         *  Returns [constant OK] on success, or one of the other [enum Error] constants if this method fails.  
         *      
         *  **Note:** Calling this method once and assigning the new values is faster than calling [method append] for every new element.  
         */
        resize(size: int64): int64
        
        /** Inserts a new element ([param value]) at a given index ([param position]) in the array. [param position] should be between `0` and the array's [method size].  
         *  Returns [constant OK] on success, or one of the other [enum Error] constants if this method fails.  
         *      
         *  **Note:** Every element's index after [param position] needs to be shifted forward, which may have a noticeable performance cost, especially on larger arrays.  
         */
        insert(position: int64, value: T): int64
        
        /** Removes the element from the array at the given index ([param position]). If the index is out of bounds, this method fails.  
         *  If you need to return the removed element, use [method pop_at]. To remove an element by value, use [method erase] instead.  
         *      
         *  **Note:** This method shifts every element's index after [param position] back, which may have a noticeable performance cost, especially on larger arrays.  
         *      
         *  **Note:** The [param position] cannot be negative. To remove an element relative to the end of the array, use `arr.remove_at(arr.size() - (i + 1))`. To remove the last element from the array, use `arr.resize(arr.size() - 1)`.  
         */
        remove_at(position: int64): void
        
        /** Assigns the given [param value] to all elements in the array.  
         *  This method can often be combined with [method resize] to create an array with a given size and initialized elements:  
         *    
         *      
         *  **Note:** If [param value] is a [Variant] passed by reference ([Object]-derived, [Array], [Dictionary], etc.), the array will be filled with references to the same [param value], which are not duplicates.  
         */
        fill(value: T): void
        
        /** Finds and removes the first occurrence of [param value] from the array. If [param value] does not exist in the array, nothing happens. To remove an element by index, use [method remove_at] instead.  
         *      
         *  **Note:** This method shifts every element's index after the removed [param value] back, which may have a noticeable performance cost, especially on larger arrays.  
         *      
         *  **Note:** Erasing elements while iterating over arrays is **not** supported and will result in unpredictable behavior.  
         */
        erase(value: T): void
        
        /** Returns the first element of the array. If the array is empty, fails and returns `null`. See also [method back].  
         *      
         *  **Note:** Unlike with the `[]` operator (`array[0]`), an error is generated without stopping project execution.  
         */
        front(): T
        
        /** Returns the last element of the array. If the array is empty, fails and returns `null`. See also [method front].  
         *      
         *  **Note:** Unlike with the `[]` operator (`array[-1]`), an error is generated without stopping project execution.  
         */
        back(): T
        
        /** Returns a random element from the array. Generates an error and returns `null` if the array is empty.  
         *    
         *      
         *  **Note:** Like many similar functions in the engine (such as [method @GlobalScope.randi] or [method shuffle]), this method uses a common, global random seed. To get a predictable outcome from this method, see [method @GlobalScope.seed].  
         */
        pick_random(): T
        
        /** Returns the index of the **first** occurrence of [param what] in this array, or `-1` if there are none. The search's start can be specified with [param from], continuing to the end of the array.  
         *      
         *  **Note:** If you just want to know whether the array contains [param what], use [method has] (`Contains` in C#). In GDScript, you may also use the `in` operator.  
         *      
         *  **Note:** For performance reasons, the search is affected by [param what]'s [enum Variant.Type]. For example, `7` ([int]) and `7.0` ([float]) are not considered equal for this method.  
         */
        find(what: T, from: int64 = 0): int64
        
        /** Returns the index of the **first** element in the array that causes [param method] to return `true`, or `-1` if there are none. The search's start can be specified with [param from], continuing to the end of the array.  
         *  [param method] is a callable that takes an element of the array, and returns a [bool].  
         *      
         *  **Note:** If you just want to know whether the array contains  *anything*  that satisfies [param method], use [method any].  
         *    
         */
        find_custom(method: AnyCallable, from: int64 = 0): int64
        
        /** Returns the index of the **last** occurrence of [param what] in this array, or `-1` if there are none. The search's start can be specified with [param from], continuing to the beginning of the array. This method is the reverse of [method find]. */
        rfind(what: T, from: int64 = -1): int64
        
        /** Returns the index of the **last** element of the array that causes [param method] to return `true`, or `-1` if there are none. The search's start can be specified with [param from], continuing to the beginning of the array. This method is the reverse of [method find_custom]. */
        rfind_custom(method: AnyCallable, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array.  
         *  To count how many elements in an array satisfy a condition, see [method reduce].  
         */
        count(value: T): int64
        
        /** Returns `true` if the array contains the given [param value].  
         *    
         *  In GDScript, this is equivalent to the `in` operator:  
         *    
         *      
         *  **Note:** For performance reasons, the search is affected by the [param value]'s [enum Variant.Type]. For example, `7` ([int]) and `7.0` ([float]) are not considered equal for this method.  
         */
        has(value: T): boolean
        
        /** Removes and returns the last element of the array. Returns `null` if the array is empty, without generating an error. See also [method pop_front]. */
        pop_back(): T
        
        /** Removes and returns the first element of the array. Returns `null` if the array is empty, without generating an error. See also [method pop_back].  
         *      
         *  **Note:** This method shifts every other element's index back, which may have a noticeable performance cost, especially on larger arrays.  
         */
        pop_front(): T
        
        /** Removes and returns the element of the array at index [param position]. If negative, [param position] is considered relative to the end of the array. Returns `null` if the array is empty. If [param position] is out of bounds, an error message is also generated.  
         *      
         *  **Note:** This method shifts every element's index after [param position] back, which may have a noticeable performance cost, especially on larger arrays.  
         */
        pop_at(position: int64): T
        
        /** Sorts the array in ascending order. The final order is dependent on the "less than" (`<`) comparison between elements.  
         *    
         *      
         *  **Note:** The sorting algorithm used is not [url=https://en.wikipedia.org/wiki/Sorting_algorithm#Stability]stable[/url]. This means that equivalent elements (such as `2` and `2.0`) may have their order changed when calling [method sort].  
         */
        sort(): void
        
        /** Sorts the array using a custom [Callable].  
         *  [param func] is called as many times as necessary, receiving two array elements as arguments. The function should return `true` if the first element should be moved  *before*  the second one, otherwise it should return `false`.  
         *    
         *  It may also be necessary to use this method to sort strings by natural order, with [method String.naturalnocasecmp_to], as in the following example:  
         *    
         *      
         *  **Note:** In C#, this method is not supported.  
         *      
         *  **Note:** The sorting algorithm used is not [url=https://en.wikipedia.org/wiki/Sorting_algorithm#Stability]stable[/url]. This means that values considered equal may have their order changed when calling this method.  
         *      
         *  **Note:** You should not randomize the return value of [param func], as the heapsort algorithm expects a consistent result. Randomizing the return value will result in unexpected behavior.  
         */
        sort_custom(func: Callable2<T, T, boolean>): void
        
        /** Shuffles all elements of the array in a random order.  
         *      
         *  **Note:** Like many similar functions in the engine (such as [method @GlobalScope.randi] or [method pick_random]), this method uses a common, global random seed. To get a predictable outcome from this method, see [method @GlobalScope.seed].  
         */
        shuffle(): void
        
        /** Returns the index of [param value] in the sorted array. If it cannot be found, returns where [param value] should be inserted to keep the array sorted. The algorithm used is [url=https://en.wikipedia.org/wiki/Binary_search_algorithm]binary search[/url].  
         *  If [param before] is `true` (as by default), the returned index comes before all existing elements equal to [param value] in the array.  
         *    
         *      
         *  **Note:** Calling [method bsearch] on an  *unsorted*  array will result in unexpected behavior. Use [method sort] before calling this method.  
         */
        bsearch(value: T, before: boolean = true): int64
        
        /** Returns the index of [param value] in the sorted array. If it cannot be found, returns where [param value] should be inserted to keep the array sorted (using [param func] for the comparisons). The algorithm used is [url=https://en.wikipedia.org/wiki/Binary_search_algorithm]binary search[/url].  
         *  Similar to [method sort_custom], [param func] is called as many times as necessary, receiving one array element and [param value] as arguments. The function should return `true` if the array element should be  *behind*  [param value], otherwise it should return `false`.  
         *  If [param before] is `true` (as by default), the returned index comes before all existing elements equal to [param value] in the array.  
         *    
         *      
         *  **Note:** Calling [method bsearch_custom] on an  *unsorted*  array will result in unexpected behavior. Use [method sort_custom] with [param func] before calling this method.  
         */
        bsearch_custom(value: T, func: Callable2<T, T, boolean>, before: boolean = true): int64
        
        /** Reverses the order of all elements in the array. */
        reverse(): void
        
        /** Returns a new copy of the array.  
         *  By default, a **shallow** copy is returned: all nested [Array] and [Dictionary] elements are shared with the original array. Modifying them in one array will also affect them in the other.[br]If [param deep] is `true`, a **deep** copy is returned: all nested arrays and dictionaries are also duplicated (recursively).  
         */
        duplicate(deep: boolean = false): GArray<T>
        
        /** Returns a new [Array] containing this array's elements, from index [param begin] (inclusive) to [param end] (exclusive), every [param step] elements.  
         *  If either [param begin] or [param end] are negative, their value is relative to the end of the array.  
         *  If [param step] is negative, this method iterates through the array in reverse, returning a slice ordered backwards. For this to work, [param begin] must be greater than [param end].  
         *  If [param deep] is `true`, all nested [Array] and [Dictionary] elements in the slice are duplicated from the original, recursively. See also [method duplicate]).  
         *    
         */
        slice(begin: int64, end: int64 = 2147483647, step: int64 = 1, deep: boolean = false): GArray<T>
        
        /** Calls the given [Callable] on each element in the array and returns a new, filtered [Array].  
         *  The [param method] receives one of the array elements as an argument, and should return `true` to add the element to the filtered array, or `false` to exclude it.  
         *    
         *  See also [method any], [method all], [method map] and [method reduce].  
         */
        filter(method: Callable1<T, boolean>): GArray<T>
        
        /** Calls the given [Callable] for each element in the array and returns a new array filled with values returned by the [param method].  
         *  The [param method] should take one [Variant] parameter (the current array element) and can return any [Variant].  
         *    
         *  See also [method filter], [method reduce], [method any] and [method all].  
         */
        map<U>(method: Callable1<T, U>): GArray<U>
        
        /** Calls the given [Callable] for each element in array, accumulates the result in [param accum], then returns it.  
         *  The [param method] takes two arguments: the current value of [param accum] and the current array element. If [param accum] is `null` (as by default), the iteration will start from the second element, with the first one used as initial value of [param accum].  
         *    
         *  If [method max] is not desirable, this method may also be used to implement a custom comparator:  
         *    
         *  This method can also be used to count how many elements in an array satisfy a certain condition, similar to [method count]:  
         *    
         *  See also [method map], [method filter], [method any], and [method all].  
         */
        reduce(method: AnyCallable, accum: any = <any> {}): any
        
        /** Calls the given [Callable] on each element in the array and returns `true` if the [Callable] returns `true` for  *one or more*  elements in the array. If the [Callable] returns `false` for all elements in the array, this method returns `false`.  
         *  The [param method] should take one [Variant] parameter (the current array element) and return a [bool].  
         *    
         *  See also [method all], [method filter], [method map] and [method reduce].  
         *      
         *  **Note:** Unlike relying on the size of an array returned by [method filter], this method will return as early as possible to improve performance (especially with large arrays).  
         *      
         *  **Note:** For an empty array, this method always returns `false`.  
         */
        any(method: Callable1<T, boolean>): boolean
        
        /** Calls the given [Callable] on each element in the array and returns `true` if the [Callable] returns `true` for  *all*  elements in the array. If the [Callable] returns `false` for one array element or more, this method returns `false`.  
         *  The [param method] should take one [Variant] parameter (the current array element) and return a [bool].  
         *    
         *  See also [method any], [method filter], [method map] and [method reduce].  
         *      
         *  **Note:** Unlike relying on the size of an array returned by [method filter], this method will return as early as possible to improve performance (especially with large arrays).  
         *      
         *  **Note:** For an empty array, this method [url=https://en.wikipedia.org/wiki/Vacuous_truth]always[/url] returns `true`.  
         */
        all(method: Callable1<T, boolean>): boolean
        
        /** Returns the maximum value contained in the array, if all elements can be compared. Otherwise, returns `null`. See also [method min].  
         *  To find the maximum value using a custom comparator, you can use [method reduce].  
         */
        max(): T
        
        /** Returns the minimum value contained in the array, if all elements can be compared. Otherwise, returns `null`. See also [method max]. */
        min(): T
        
        /** Returns `true` if the array is typed. Typed arrays can only contain elements of a specific type, as defined by the typed array constructor. The methods of a typed array are still expected to return a generic [Variant].  
         *  In GDScript, it is possible to define a typed array with static typing:  
         *    
         */
        is_typed(): boolean
        
        /** Returns `true` if this array is typed the same as the given [param array]. See also [method is_typed]. */
        is_same_typed(array: GArray): boolean
        
        /** Returns the built-in [Variant] type of the typed array as a [enum Variant.Type] constant. If the array is not typed, returns [constant TYPE_NIL]. See also [method is_typed]. */
        get_typed_builtin(): int64
        
        /** Returns the **built-in** class name of the typed array, if the built-in [Variant] type [constant TYPE_OBJECT]. Otherwise, returns an empty [StringName]. See also [method is_typed] and [method Object.get_class]. */
        get_typed_class_name(): StringName
        
        /** Returns the [Script] instance associated with this typed array, or `null` if it does not exist. See also [method is_typed]. */
        get_typed_script(): any
        
        /** Makes the array read-only. The array's elements cannot be overridden with different values, and their order cannot change. Does not apply to nested elements, such as dictionaries.  
         *  In GDScript, arrays are automatically read-only if declared with the `const` keyword.  
         */
        make_read_only(): void
        
        /** Returns `true` if the array is read-only. See [method make_read_only].  
         *  In GDScript, arrays are automatically read-only if declared with the `const` keyword.  
         */
        is_read_only(): boolean
        static EQUAL(left: GArray, right: GArray): boolean
        static NOT_EQUAL(left: GArray, right: GArray): boolean
        static LESS(left: GArray, right: GArray): boolean
        static LESS_EQUAL(left: GArray, right: GArray): boolean
        static GREATER(left: GArray, right: GArray): boolean
        static GREATER_EQUAL(left: GArray, right: GArray): boolean
    }
    /** A packed array of bytes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedbytearray.html  
     */
    class PackedByteArray {
        /** [jsb utility method] Converts a PackedByteArray to a JavaScript ArrayBuffer. */
        to_array_buffer(): ArrayBuffer
        constructor()
        constructor(from: PackedByteArray | byte[] | ArrayBuffer)
        constructor(from: GArray)
        
        /** Returns the byte at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): int64
        
        /** Changes the byte at the given index. */
        set(index: int64, value: int64): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Appends an element at the end of the array. */
        push_back(value: int64): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: int64): boolean
        
        /** Appends a [PackedByteArray] at the end of this array. */
        append_array(array: PackedByteArray | byte[] | ArrayBuffer): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new element at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: int64): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: int64): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value]. */
        has(value: int64): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedByteArray], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedByteArray].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedByteArray
        
        /** Sorts the elements of the array in ascending order. */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         */
        bsearch(value: int64, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedByteArray
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed. */
        find(value: int64, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array. */
        rfind(value: int64, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array. */
        count(value: int64): int64
        
        /** Converts ASCII/Latin-1 encoded array to [String]. Fast alternative to [method get_string_from_utf8] if the content is ASCII/Latin-1 only. Unlike the UTF-8 function this function maps every byte to a character in the array. Multibyte sequences will not be interpreted correctly. For parsing user input always use [method get_string_from_utf8]. This is the inverse of [method String.to_ascii_buffer]. */
        get_string_from_ascii(): string
        
        /** Converts UTF-8 encoded array to [String]. Slower than [method get_string_from_ascii] but supports UTF-8 encoded data. Use this function if you are unsure about the source of the data. For user input this function should always be preferred. Returns empty string if source array is not valid UTF-8 string. This is the inverse of [method String.to_utf8_buffer]. */
        get_string_from_utf8(): string
        
        /** Converts UTF-16 encoded array to [String]. If the BOM is missing, system endianness is assumed. Returns empty string if source array is not valid UTF-16 string. This is the inverse of [method String.to_utf16_buffer]. */
        get_string_from_utf16(): string
        
        /** Converts UTF-32 encoded array to [String]. System endianness is assumed. Returns empty string if source array is not valid UTF-32 string. This is the inverse of [method String.to_utf32_buffer]. */
        get_string_from_utf32(): string
        
        /** Converts wide character (`wchar_t`, UTF-16 on Windows, UTF-32 on other platforms) encoded array to [String]. Returns empty string if source array is not valid wide string. This is the inverse of [method String.to_wchar_buffer]. */
        get_string_from_wchar(): string
        
        /** Returns a hexadecimal representation of this array as a [String].  
         *    
         */
        hex_encode(): string
        
        /** Returns a new [PackedByteArray] with the data compressed. Set the compression mode using one of [enum FileAccess.CompressionMode]'s constants. */
        compress(compression_mode: int64 = 0): PackedByteArray
        
        /** Returns a new [PackedByteArray] with the data decompressed. Set [param buffer_size] to the size of the uncompressed data. Set the compression mode using one of [enum FileAccess.CompressionMode]'s constants.  
         *      
         *  **Note:** Decompression is not guaranteed to work with data not compressed by Godot, for example if data compressed with the deflate compression mode lacks a checksum or header.  
         */
        decompress(buffer_size: int64, compression_mode: int64 = 0): PackedByteArray
        
        /** Returns a new [PackedByteArray] with the data decompressed. Set the compression mode using one of [enum FileAccess.CompressionMode]'s constants. **This method only accepts brotli, gzip, and deflate compression modes.**  
         *  This method is potentially slower than [method decompress], as it may have to re-allocate its output buffer multiple times while decompressing, whereas [method decompress] knows it's output buffer size from the beginning.  
         *  GZIP has a maximal compression ratio of 1032:1, meaning it's very possible for a small compressed payload to decompress to a potentially very large output. To guard against this, you may provide a maximum size this function is allowed to allocate in bytes via [param max_output_size]. Passing -1 will allow for unbounded output. If any positive value is passed, and the decompression exceeds that amount in bytes, then an error will be returned.  
         *      
         *  **Note:** Decompression is not guaranteed to work with data not compressed by Godot, for example if data compressed with the deflate compression mode lacks a checksum or header.  
         */
        decompress_dynamic(max_output_size: int64, compression_mode: int64 = 0): PackedByteArray
        
        /** Decodes a 8-bit unsigned integer number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0` if a valid number can't be decoded. */
        decode_u8(byte_offset: int64): int64
        
        /** Decodes a 8-bit signed integer number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0` if a valid number can't be decoded. */
        decode_s8(byte_offset: int64): int64
        
        /** Decodes a 16-bit unsigned integer number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0` if a valid number can't be decoded. */
        decode_u16(byte_offset: int64): int64
        
        /** Decodes a 16-bit signed integer number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0` if a valid number can't be decoded. */
        decode_s16(byte_offset: int64): int64
        
        /** Decodes a 32-bit unsigned integer number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0` if a valid number can't be decoded. */
        decode_u32(byte_offset: int64): int64
        
        /** Decodes a 32-bit signed integer number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0` if a valid number can't be decoded. */
        decode_s32(byte_offset: int64): int64
        
        /** Decodes a 64-bit unsigned integer number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0` if a valid number can't be decoded. */
        decode_u64(byte_offset: int64): int64
        
        /** Decodes a 64-bit signed integer number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0` if a valid number can't be decoded. */
        decode_s64(byte_offset: int64): int64
        
        /** Decodes a 16-bit floating-point number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0.0` if a valid number can't be decoded. */
        decode_half(byte_offset: int64): float64
        
        /** Decodes a 32-bit floating-point number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0.0` if a valid number can't be decoded. */
        decode_float(byte_offset: int64): float64
        
        /** Decodes a 64-bit floating-point number from the bytes starting at [param byte_offset]. Fails if the byte count is insufficient. Returns `0.0` if a valid number can't be decoded. */
        decode_double(byte_offset: int64): float64
        
        /** Returns `true` if a valid [Variant] value can be decoded at the [param byte_offset]. Returns `false` otherwise or when the value is [Object]-derived and [param allow_objects] is `false`. */
        has_encoded_var(byte_offset: int64, allow_objects: boolean = false): boolean
        
        /** Decodes a [Variant] from the bytes starting at [param byte_offset]. Returns `null` if a valid variant can't be decoded or the value is [Object]-derived and [param allow_objects] is `false`. */
        decode_var(byte_offset: int64, allow_objects: boolean = false): any
        
        /** Decodes a size of a [Variant] from the bytes starting at [param byte_offset]. Requires at least 4 bytes of data starting at the offset, otherwise fails. */
        decode_var_size(byte_offset: int64, allow_objects: boolean = false): int64
        
        /** Returns a copy of the data converted to a [PackedInt32Array], where each block of 4 bytes has been converted to a signed 32-bit integer (C++ `int32_t`).  
         *  The size of the input array must be a multiple of 4 (size of 32-bit integer). The size of the new array will be `byte_array.size() / 4`.  
         *  If the original data can't be converted to signed 32-bit integers, the resulting data is undefined.  
         */
        to_int32_array(): PackedInt32Array
        
        /** Returns a copy of the data converted to a [PackedInt64Array], where each block of 8 bytes has been converted to a signed 64-bit integer (C++ `int64_t`, Godot [int]).  
         *  The size of the input array must be a multiple of 8 (size of 64-bit integer). The size of the new array will be `byte_array.size() / 8`.  
         *  If the original data can't be converted to signed 64-bit integers, the resulting data is undefined.  
         */
        to_int64_array(): PackedInt64Array
        
        /** Returns a copy of the data converted to a [PackedFloat32Array], where each block of 4 bytes has been converted to a 32-bit float (C++ [code skip-lint]float`).  
         *  The size of the input array must be a multiple of 4 (size of 32-bit float). The size of the new array will be `byte_array.size() / 4`.  
         *  If the original data can't be converted to 32-bit floats, the resulting data is undefined.  
         */
        to_float32_array(): PackedFloat32Array
        
        /** Returns a copy of the data converted to a [PackedFloat64Array], where each block of 8 bytes has been converted to a 64-bit float (C++ `double`, Godot [float]).  
         *  The size of the input array must be a multiple of 8 (size of 64-bit double). The size of the new array will be `byte_array.size() / 8`.  
         *  If the original data can't be converted to 64-bit floats, the resulting data is undefined.  
         */
        to_float64_array(): PackedFloat64Array
        
        /** Encodes a 8-bit unsigned integer number (byte) at the index of [param byte_offset] bytes. The array must have at least 1 byte of space, starting at the offset. */
        encode_u8(byte_offset: int64, value: int64): void
        
        /** Encodes a 8-bit signed integer number (signed byte) at the index of [param byte_offset] bytes. The array must have at least 1 byte of space, starting at the offset. */
        encode_s8(byte_offset: int64, value: int64): void
        
        /** Encodes a 16-bit unsigned integer number as bytes at the index of [param byte_offset] bytes. The array must have at least 2 bytes of space, starting at the offset. */
        encode_u16(byte_offset: int64, value: int64): void
        
        /** Encodes a 16-bit signed integer number as bytes at the index of [param byte_offset] bytes. The array must have at least 2 bytes of space, starting at the offset. */
        encode_s16(byte_offset: int64, value: int64): void
        
        /** Encodes a 32-bit unsigned integer number as bytes at the index of [param byte_offset] bytes. The array must have at least 4 bytes of space, starting at the offset. */
        encode_u32(byte_offset: int64, value: int64): void
        
        /** Encodes a 32-bit signed integer number as bytes at the index of [param byte_offset] bytes. The array must have at least 4 bytes of space, starting at the offset. */
        encode_s32(byte_offset: int64, value: int64): void
        
        /** Encodes a 64-bit unsigned integer number as bytes at the index of [param byte_offset] bytes. The array must have at least 8 bytes of space, starting at the offset. */
        encode_u64(byte_offset: int64, value: int64): void
        
        /** Encodes a 64-bit signed integer number as bytes at the index of [param byte_offset] bytes. The array must have at least 8 bytes of space, starting at the offset. */
        encode_s64(byte_offset: int64, value: int64): void
        
        /** Encodes a 16-bit floating-point number as bytes at the index of [param byte_offset] bytes. The array must have at least 2 bytes of space, starting at the offset. */
        encode_half(byte_offset: int64, value: float64): void
        
        /** Encodes a 32-bit floating-point number as bytes at the index of [param byte_offset] bytes. The array must have at least 4 bytes of space, starting at the offset. */
        encode_float(byte_offset: int64, value: float64): void
        
        /** Encodes a 64-bit floating-point number as bytes at the index of [param byte_offset] bytes. The array must have at least 8 bytes of allocated space, starting at the offset. */
        encode_double(byte_offset: int64, value: float64): void
        
        /** Encodes a [Variant] at the index of [param byte_offset] bytes. A sufficient space must be allocated, depending on the encoded variant's size. If [param allow_objects] is `false`, [Object]-derived values are not permitted and will instead be serialized as ID-only. */
        encode_var(byte_offset: int64, value: any, allow_objects: boolean = false): int64
        static EQUAL(left: PackedByteArray | byte[] | ArrayBuffer, right: PackedByteArray | byte[] | ArrayBuffer): boolean
        static NOT_EQUAL(left: PackedByteArray | byte[] | ArrayBuffer, right: PackedByteArray | byte[] | ArrayBuffer): boolean
    }
    /** A packed array of 32-bit integers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedint32array.html  
     */
    class PackedInt32Array {
        constructor()
        constructor(from: PackedInt32Array | int32[])
        constructor(from: GArray)
        
        /** Returns the 32-bit integer at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): int64
        
        /** Changes the integer at the given index. */
        set(index: int64, value: int64): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Appends a value to the array. */
        push_back(value: int64): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: int64): boolean
        
        /** Appends a [PackedInt32Array] at the end of this array. */
        append_array(array: PackedInt32Array | int32[]): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new integer at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: int64): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: int64): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value]. */
        has(value: int64): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedInt32Array], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedInt32Array].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedInt32Array
        
        /** Returns a copy of the data converted to a [PackedByteArray], where each element has been encoded as 4 bytes.  
         *  The size of the new array will be `int32_array.size() * 4`.  
         */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order. */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         */
        bsearch(value: int64, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedInt32Array
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed. */
        find(value: int64, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array. */
        rfind(value: int64, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array. */
        count(value: int64): int64
        static EQUAL(left: PackedInt32Array | int32[], right: PackedInt32Array | int32[]): boolean
        static NOT_EQUAL(left: PackedInt32Array | int32[], right: PackedInt32Array | int32[]): boolean
    }
    /** A packed array of 64-bit integers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedint64array.html  
     */
    class PackedInt64Array {
        constructor()
        constructor(from: PackedInt64Array | int64[])
        constructor(from: GArray)
        
        /** Returns the 64-bit integer at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): int64
        
        /** Changes the integer at the given index. */
        set(index: int64, value: int64): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Appends a value to the array. */
        push_back(value: int64): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: int64): boolean
        
        /** Appends a [PackedInt64Array] at the end of this array. */
        append_array(array: PackedInt64Array | int64[]): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new integer at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: int64): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: int64): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value]. */
        has(value: int64): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedInt64Array], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedInt64Array].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedInt64Array
        
        /** Returns a copy of the data converted to a [PackedByteArray], where each element has been encoded as 8 bytes.  
         *  The size of the new array will be `int64_array.size() * 8`.  
         */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order. */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         */
        bsearch(value: int64, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedInt64Array
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed. */
        find(value: int64, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array. */
        rfind(value: int64, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array. */
        count(value: int64): int64
        static EQUAL(left: PackedInt64Array | int64[], right: PackedInt64Array | int64[]): boolean
        static NOT_EQUAL(left: PackedInt64Array | int64[], right: PackedInt64Array | int64[]): boolean
    }
    /** A packed array of 32-bit floating-point values.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedfloat32array.html  
     */
    class PackedFloat32Array {
        constructor()
        constructor(from: PackedFloat32Array | float32[])
        constructor(from: GArray)
        
        /** Returns the 32-bit float at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): float64
        
        /** Changes the float at the given index. */
        set(index: int64, value: float64): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Appends an element at the end of the array. */
        push_back(value: float64): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: float64): boolean
        
        /** Appends a [PackedFloat32Array] at the end of this array. */
        append_array(array: PackedFloat32Array | float32[]): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new element at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: float64): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: float64): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value].  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        has(value: float64): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedFloat32Array], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedFloat32Array].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedFloat32Array
        
        /** Returns a copy of the data converted to a [PackedByteArray], where each element has been encoded as 4 bytes.  
         *  The size of the new array will be `float32_array.size() * 4`.  
         */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        bsearch(value: float64, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedFloat32Array
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        find(value: float64, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        rfind(value: float64, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        count(value: float64): int64
        static EQUAL(left: PackedFloat32Array | float32[], right: PackedFloat32Array | float32[]): boolean
        static NOT_EQUAL(left: PackedFloat32Array | float32[], right: PackedFloat32Array | float32[]): boolean
    }
    /** A packed array of 64-bit floating-point values.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedfloat64array.html  
     */
    class PackedFloat64Array {
        constructor()
        constructor(from: PackedFloat64Array | float64[])
        constructor(from: GArray)
        
        /** Returns the 64-bit float at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): float64
        
        /** Changes the float at the given index. */
        set(index: int64, value: float64): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Appends an element at the end of the array. */
        push_back(value: float64): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: float64): boolean
        
        /** Appends a [PackedFloat64Array] at the end of this array. */
        append_array(array: PackedFloat64Array | float64[]): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new element at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: float64): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: float64): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value].  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        has(value: float64): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedFloat64Array], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedFloat64Array].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedFloat64Array
        
        /** Returns a copy of the data converted to a [PackedByteArray], where each element has been encoded as 8 bytes.  
         *  The size of the new array will be `float64_array.size() * 8`.  
         */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        bsearch(value: float64, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedFloat64Array
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        find(value: float64, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        rfind(value: float64, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array.  
         *      
         *  **Note:** [constant @GDScript.NAN] doesn't behave the same as other numbers. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        count(value: float64): int64
        static EQUAL(left: PackedFloat64Array | float64[], right: PackedFloat64Array | float64[]): boolean
        static NOT_EQUAL(left: PackedFloat64Array | float64[], right: PackedFloat64Array | float64[]): boolean
    }
    /** A packed array of [String]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedstringarray.html  
     */
    class PackedStringArray {
        constructor()
        constructor(from: PackedStringArray | string[])
        constructor(from: GArray)
        
        /** Returns the [String] at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): string
        
        /** Changes the [String] at the given index. */
        set(index: int64, value: string): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Appends a string element at end of the array. */
        push_back(value: string): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: string): boolean
        
        /** Appends a [PackedStringArray] at the end of this array. */
        append_array(array: PackedStringArray | string[]): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new element at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: string): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: string): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value]. */
        has(value: string): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedStringArray], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedStringArray].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedStringArray
        
        /** Returns a [PackedByteArray] with each string encoded as UTF-8. Strings are `null` terminated. */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order. */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         */
        bsearch(value: string, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedStringArray
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed. */
        find(value: string, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array. */
        rfind(value: string, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array. */
        count(value: string): int64
        static EQUAL(left: PackedStringArray | string[], right: PackedStringArray | string[]): boolean
        static NOT_EQUAL(left: PackedStringArray | string[], right: PackedStringArray | string[]): boolean
    }
    /** A packed array of [Vector2]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedvector2array.html  
     */
    class PackedVector2Array {
        constructor()
        constructor(from: PackedVector2Array | Vector2[])
        constructor(from: GArray)
        
        /** Returns the [Vector2] at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): Vector2
        
        /** Changes the [Vector2] at the given index. */
        set(index: int64, value: Vector2): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Inserts a [Vector2] at the end. */
        push_back(value: Vector2): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: Vector2): boolean
        
        /** Appends a [PackedVector2Array] at the end of this array. */
        append_array(array: PackedVector2Array | Vector2[]): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new element at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: Vector2): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: Vector2): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value].  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        has(value: Vector2): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedVector2Array], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedVector2Array].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedVector2Array
        
        /** Returns a [PackedByteArray] with each vector encoded as bytes. */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        bsearch(value: Vector2, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedVector2Array
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        find(value: Vector2, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        rfind(value: Vector2, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        count(value: Vector2): int64
        static EQUAL(left: PackedVector2Array | Vector2[], right: PackedVector2Array | Vector2[]): boolean
        static NOT_EQUAL(left: PackedVector2Array | Vector2[], right: PackedVector2Array | Vector2[]): boolean
    }
    /** A packed array of [Vector3]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedvector3array.html  
     */
    class PackedVector3Array {
        constructor()
        constructor(from: PackedVector3Array | Vector3[])
        constructor(from: GArray)
        
        /** Returns the [Vector3] at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): Vector3
        
        /** Changes the [Vector3] at the given index. */
        set(index: int64, value: Vector3): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Inserts a [Vector3] at the end. */
        push_back(value: Vector3): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: Vector3): boolean
        
        /** Appends a [PackedVector3Array] at the end of this array. */
        append_array(array: PackedVector3Array | Vector3[]): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new element at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: Vector3): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: Vector3): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value].  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        has(value: Vector3): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedVector3Array], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedVector3Array].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedVector3Array
        
        /** Returns a [PackedByteArray] with each vector encoded as bytes. */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        bsearch(value: Vector3, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedVector3Array
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        find(value: Vector3, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        rfind(value: Vector3, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        count(value: Vector3): int64
        static EQUAL(left: PackedVector3Array | Vector3[], right: PackedVector3Array | Vector3[]): boolean
        static NOT_EQUAL(left: PackedVector3Array | Vector3[], right: PackedVector3Array | Vector3[]): boolean
    }
    /** A packed array of [Vector4]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedvector4array.html  
     */
    class PackedVector4Array {
        constructor()
        constructor(from: PackedVector4Array)
        constructor(from: GArray)
        
        /** Returns the [Vector4] at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): Vector4
        
        /** Changes the [Vector4] at the given index. */
        set(index: int64, value: Vector4): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Inserts a [Vector4] at the end. */
        push_back(value: Vector4): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: Vector4): boolean
        
        /** Appends a [PackedVector4Array] at the end of this array. */
        append_array(array: PackedVector4Array): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new element at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: Vector4): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: Vector4): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value].  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        has(value: Vector4): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedVector4Array], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedVector4Array].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedVector4Array
        
        /** Returns a [PackedByteArray] with each vector encoded as bytes. */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        bsearch(value: Vector4, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedVector4Array
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        find(value: Vector4, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        rfind(value: Vector4, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array.  
         *      
         *  **Note:** Vectors with [constant @GDScript.NAN] elements don't behave the same as other vectors. Therefore, the results from this method may not be accurate if NaNs are included.  
         */
        count(value: Vector4): int64
        static EQUAL(left: PackedVector4Array, right: PackedVector4Array): boolean
        static NOT_EQUAL(left: PackedVector4Array, right: PackedVector4Array): boolean
    }
    /** A packed array of [Color]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedcolorarray.html  
     */
    class PackedColorArray {
        constructor()
        constructor(from: PackedColorArray | Color[])
        constructor(from: GArray)
        
        /** Returns the [Color] at the given [param index] in the array. This is the same as using the `[]` operator (`array[index]`). */
        get(index: int64): Color
        
        /** Changes the [Color] at the given index. */
        set(index: int64, value: Color): void
        
        /** Returns the number of elements in the array. */
        size(): int64
        
        /** Returns `true` if the array is empty. */
        is_empty(): boolean
        
        /** Appends a value to the array. */
        push_back(value: Color): boolean
        
        /** Appends an element at the end of the array (alias of [method push_back]). */
        append(value: Color): boolean
        
        /** Appends a [PackedColorArray] at the end of this array. */
        append_array(array: PackedColorArray | Color[]): void
        
        /** Removes an element from the array by index. */
        remove_at(index: int64): void
        
        /** Inserts a new element at a given position in the array. The position must be valid, or at the end of the array (`idx == size()`). */
        insert(at_index: int64, value: Color): int64
        
        /** Assigns the given value to all elements in the array. This can typically be used together with [method resize] to create an array with a given size and initialized elements. */
        fill(value: Color): void
        
        /** Sets the size of the array. If the array is grown, reserves elements at the end of the array. If the array is shrunk, truncates the array to the new size. Calling [method resize] once and assigning the new values is faster than adding new elements one by one. */
        resize(new_size: int64): int64
        
        /** Clears the array. This is equivalent to using [method resize] with a size of `0`. */
        clear(): void
        
        /** Returns `true` if the array contains [param value]. */
        has(value: Color): boolean
        
        /** Reverses the order of the elements in the array. */
        reverse(): void
        
        /** Returns the slice of the [PackedColorArray], from [param begin] (inclusive) to [param end] (exclusive), as a new [PackedColorArray].  
         *  The absolute value of [param begin] and [param end] will be clamped to the array size, so the default value for [param end] makes it slice to the size of the array by default (i.e. `arr.slice(1)` is a shorthand for `arr.slice(1, arr.size())`).  
         *  If either [param begin] or [param end] are negative, they will be relative to the end of the array (i.e. `arr.slice(0, -2)` is a shorthand for `arr.slice(0, arr.size() - 2)`).  
         */
        slice(begin: int64, end: int64 = 2147483647): PackedColorArray
        
        /** Returns a [PackedByteArray] with each color encoded as bytes. */
        to_byte_array(): PackedByteArray
        
        /** Sorts the elements of the array in ascending order. */
        sort(): void
        
        /** Finds the index of an existing value (or the insertion index that maintains sorting order, if the value is not yet present in the array) using binary search. Optionally, a [param before] specifier can be passed. If `false`, the returned index comes after all existing entries of the value in the array.  
         *      
         *  **Note:** Calling [method bsearch] on an unsorted array results in unexpected behavior.  
         */
        bsearch(value: Color, before: boolean = true): int64
        
        /** Creates a copy of the array, and returns it. */
        duplicate(): PackedColorArray
        
        /** Searches the array for a value and returns its index or `-1` if not found. Optionally, the initial search index can be passed. */
        find(value: Color, from: int64 = 0): int64
        
        /** Searches the array in reverse order. Optionally, a start search index can be passed. If negative, the start index is considered relative to the end of the array. */
        rfind(value: Color, from: int64 = -1): int64
        
        /** Returns the number of times an element is in the array. */
        count(value: Color): int64
        static EQUAL(left: PackedColorArray | Color[], right: PackedColorArray | Color[]): boolean
        static NOT_EQUAL(left: PackedColorArray | Color[], right: PackedColorArray | Color[]): boolean
    }
    enum Side {
        /** Left side, usually used for [Control] or [StyleBox]-derived classes. */
        SIDE_LEFT = 0,
        
        /** Top side, usually used for [Control] or [StyleBox]-derived classes. */
        SIDE_TOP = 1,
        
        /** Right side, usually used for [Control] or [StyleBox]-derived classes. */
        SIDE_RIGHT = 2,
        
        /** Bottom side, usually used for [Control] or [StyleBox]-derived classes. */
        SIDE_BOTTOM = 3,
    }
    enum Corner {
        /** Top-left corner. */
        CORNER_TOP_LEFT = 0,
        
        /** Top-right corner. */
        CORNER_TOP_RIGHT = 1,
        
        /** Bottom-right corner. */
        CORNER_BOTTOM_RIGHT = 2,
        
        /** Bottom-left corner. */
        CORNER_BOTTOM_LEFT = 3,
    }
    enum Orientation {
        /** General vertical alignment, usually used for [Separator], [ScrollBar], [Slider], etc. */
        VERTICAL = 1,
        
        /** General horizontal alignment, usually used for [Separator], [ScrollBar], [Slider], etc. */
        HORIZONTAL = 0,
    }
    enum ClockDirection {
        /** Clockwise rotation. Used by some methods (e.g. [method Image.rotate_90]). */
        CLOCKWISE = 0,
        
        /** Counter-clockwise rotation. Used by some methods (e.g. [method Image.rotate_90]). */
        COUNTERCLOCKWISE = 1,
    }
    enum HorizontalAlignment {
        /** Horizontal left alignment, usually for text-derived classes. */
        HORIZONTAL_ALIGNMENT_LEFT = 0,
        
        /** Horizontal center alignment, usually for text-derived classes. */
        HORIZONTAL_ALIGNMENT_CENTER = 1,
        
        /** Horizontal right alignment, usually for text-derived classes. */
        HORIZONTAL_ALIGNMENT_RIGHT = 2,
        
        /** Expand row to fit width, usually for text-derived classes. */
        HORIZONTAL_ALIGNMENT_FILL = 3,
    }
    enum VerticalAlignment {
        /** Vertical top alignment, usually for text-derived classes. */
        VERTICAL_ALIGNMENT_TOP = 0,
        
        /** Vertical center alignment, usually for text-derived classes. */
        VERTICAL_ALIGNMENT_CENTER = 1,
        
        /** Vertical bottom alignment, usually for text-derived classes. */
        VERTICAL_ALIGNMENT_BOTTOM = 2,
        
        /** Expand rows to fit height, usually for text-derived classes. */
        VERTICAL_ALIGNMENT_FILL = 3,
    }
    enum InlineAlignment {
        /** Aligns the top of the inline object (e.g. image, table) to the position of the text specified by `INLINE_ALIGNMENT_TO_*` constant. */
        INLINE_ALIGNMENT_TOP_TO = 0,
        
        /** Aligns the center of the inline object (e.g. image, table) to the position of the text specified by `INLINE_ALIGNMENT_TO_*` constant. */
        INLINE_ALIGNMENT_CENTER_TO = 1,
        
        /** Aligns the baseline (user defined) of the inline object (e.g. image, table) to the position of the text specified by `INLINE_ALIGNMENT_TO_*` constant. */
        INLINE_ALIGNMENT_BASELINE_TO = 3,
        
        /** Aligns the bottom of the inline object (e.g. image, table) to the position of the text specified by `INLINE_ALIGNMENT_TO_*` constant. */
        INLINE_ALIGNMENT_BOTTOM_TO = 2,
        
        /** Aligns the position of the inline object (e.g. image, table) specified by `INLINE_ALIGNMENT_*_TO` constant to the top of the text. */
        INLINE_ALIGNMENT_TO_TOP = 0,
        
        /** Aligns the position of the inline object (e.g. image, table) specified by `INLINE_ALIGNMENT_*_TO` constant to the center of the text. */
        INLINE_ALIGNMENT_TO_CENTER = 4,
        
        /** Aligns the position of the inline object (e.g. image, table) specified by `INLINE_ALIGNMENT_*_TO` constant to the baseline of the text. */
        INLINE_ALIGNMENT_TO_BASELINE = 8,
        
        /** Aligns inline object (e.g. image, table) to the bottom of the text. */
        INLINE_ALIGNMENT_TO_BOTTOM = 12,
        
        /** Aligns top of the inline object (e.g. image, table) to the top of the text. Equivalent to `INLINE_ALIGNMENT_TOP_TO | INLINE_ALIGNMENT_TO_TOP`. */
        INLINE_ALIGNMENT_TOP = 0,
        
        /** Aligns center of the inline object (e.g. image, table) to the center of the text. Equivalent to `INLINE_ALIGNMENT_CENTER_TO | INLINE_ALIGNMENT_TO_CENTER`. */
        INLINE_ALIGNMENT_CENTER = 5,
        
        /** Aligns bottom of the inline object (e.g. image, table) to the bottom of the text. Equivalent to `INLINE_ALIGNMENT_BOTTOM_TO | INLINE_ALIGNMENT_TO_BOTTOM`. */
        INLINE_ALIGNMENT_BOTTOM = 14,
        
        /** A bit mask for `INLINE_ALIGNMENT_*_TO` alignment constants. */
        INLINE_ALIGNMENT_IMAGE_MASK = 3,
        
        /** A bit mask for `INLINE_ALIGNMENT_TO_*` alignment constants. */
        INLINE_ALIGNMENT_TEXT_MASK = 12,
    }
    enum EulerOrder {
        /** Specifies that Euler angles should be in XYZ order. When composing, the order is X, Y, Z. When decomposing, the order is reversed, first Z, then Y, and X last. */
        EULER_ORDER_XYZ = 0,
        
        /** Specifies that Euler angles should be in XZY order. When composing, the order is X, Z, Y. When decomposing, the order is reversed, first Y, then Z, and X last. */
        EULER_ORDER_XZY = 1,
        
        /** Specifies that Euler angles should be in YXZ order. When composing, the order is Y, X, Z. When decomposing, the order is reversed, first Z, then X, and Y last. */
        EULER_ORDER_YXZ = 2,
        
        /** Specifies that Euler angles should be in YZX order. When composing, the order is Y, Z, X. When decomposing, the order is reversed, first X, then Z, and Y last. */
        EULER_ORDER_YZX = 3,
        
        /** Specifies that Euler angles should be in ZXY order. When composing, the order is Z, X, Y. When decomposing, the order is reversed, first Y, then X, and Z last. */
        EULER_ORDER_ZXY = 4,
        
        /** Specifies that Euler angles should be in ZYX order. When composing, the order is Z, Y, X. When decomposing, the order is reversed, first X, then Y, and Z last. */
        EULER_ORDER_ZYX = 5,
    }
    enum Key {
        /** Enum value which doesn't correspond to any key. This is used to initialize [enum Key] properties with a generic state. */
        KEY_NONE = 0,
        
        /** Keycodes with this bit applied are non-printable. */
        KEY_SPECIAL = 4194304,
        
        /** Escape key. */
        KEY_ESCAPE = 4194305,
        
        /** Tab key. */
        KEY_TAB = 4194306,
        
        /** Shift + Tab key. */
        KEY_BACKTAB = 4194307,
        
        /** Backspace key. */
        KEY_BACKSPACE = 4194308,
        
        /** Return key (on the main keyboard). */
        KEY_ENTER = 4194309,
        
        /** Enter key on the numeric keypad. */
        KEY_KP_ENTER = 4194310,
        
        /** Insert key. */
        KEY_INSERT = 4194311,
        
        /** Delete key. */
        KEY_DELETE = 4194312,
        
        /** Pause key. */
        KEY_PAUSE = 4194313,
        
        /** Print Screen key. */
        KEY_PRINT = 4194314,
        
        /** System Request key. */
        KEY_SYSREQ = 4194315,
        
        /** Clear key. */
        KEY_CLEAR = 4194316,
        
        /** Home key. */
        KEY_HOME = 4194317,
        
        /** End key. */
        KEY_END = 4194318,
        
        /** Left arrow key. */
        KEY_LEFT = 4194319,
        
        /** Up arrow key. */
        KEY_UP = 4194320,
        
        /** Right arrow key. */
        KEY_RIGHT = 4194321,
        
        /** Down arrow key. */
        KEY_DOWN = 4194322,
        
        /** Page Up key. */
        KEY_PAGEUP = 4194323,
        
        /** Page Down key. */
        KEY_PAGEDOWN = 4194324,
        
        /** Shift key. */
        KEY_SHIFT = 4194325,
        
        /** Control key. */
        KEY_CTRL = 4194326,
        
        /** Meta key. */
        KEY_META = 4194327,
        
        /** Alt key. */
        KEY_ALT = 4194328,
        
        /** Caps Lock key. */
        KEY_CAPSLOCK = 4194329,
        
        /** Num Lock key. */
        KEY_NUMLOCK = 4194330,
        
        /** Scroll Lock key. */
        KEY_SCROLLLOCK = 4194331,
        
        /** F1 key. */
        KEY_F1 = 4194332,
        
        /** F2 key. */
        KEY_F2 = 4194333,
        
        /** F3 key. */
        KEY_F3 = 4194334,
        
        /** F4 key. */
        KEY_F4 = 4194335,
        
        /** F5 key. */
        KEY_F5 = 4194336,
        
        /** F6 key. */
        KEY_F6 = 4194337,
        
        /** F7 key. */
        KEY_F7 = 4194338,
        
        /** F8 key. */
        KEY_F8 = 4194339,
        
        /** F9 key. */
        KEY_F9 = 4194340,
        
        /** F10 key. */
        KEY_F10 = 4194341,
        
        /** F11 key. */
        KEY_F11 = 4194342,
        
        /** F12 key. */
        KEY_F12 = 4194343,
        
        /** F13 key. */
        KEY_F13 = 4194344,
        
        /** F14 key. */
        KEY_F14 = 4194345,
        
        /** F15 key. */
        KEY_F15 = 4194346,
        
        /** F16 key. */
        KEY_F16 = 4194347,
        
        /** F17 key. */
        KEY_F17 = 4194348,
        
        /** F18 key. */
        KEY_F18 = 4194349,
        
        /** F19 key. */
        KEY_F19 = 4194350,
        
        /** F20 key. */
        KEY_F20 = 4194351,
        
        /** F21 key. */
        KEY_F21 = 4194352,
        
        /** F22 key. */
        KEY_F22 = 4194353,
        
        /** F23 key. */
        KEY_F23 = 4194354,
        
        /** F24 key. */
        KEY_F24 = 4194355,
        
        /** F25 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F25 = 4194356,
        
        /** F26 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F26 = 4194357,
        
        /** F27 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F27 = 4194358,
        
        /** F28 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F28 = 4194359,
        
        /** F29 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F29 = 4194360,
        
        /** F30 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F30 = 4194361,
        
        /** F31 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F31 = 4194362,
        
        /** F32 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F32 = 4194363,
        
        /** F33 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F33 = 4194364,
        
        /** F34 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F34 = 4194365,
        
        /** F35 key. Only supported on macOS and Linux due to a Windows limitation. */
        KEY_F35 = 4194366,
        
        /** Multiply (*) key on the numeric keypad. */
        KEY_KP_MULTIPLY = 4194433,
        
        /** Divide (/) key on the numeric keypad. */
        KEY_KP_DIVIDE = 4194434,
        
        /** Subtract (-) key on the numeric keypad. */
        KEY_KP_SUBTRACT = 4194435,
        
        /** Period (.) key on the numeric keypad. */
        KEY_KP_PERIOD = 4194436,
        
        /** Add (+) key on the numeric keypad. */
        KEY_KP_ADD = 4194437,
        
        /** Number 0 on the numeric keypad. */
        KEY_KP_0 = 4194438,
        
        /** Number 1 on the numeric keypad. */
        KEY_KP_1 = 4194439,
        
        /** Number 2 on the numeric keypad. */
        KEY_KP_2 = 4194440,
        
        /** Number 3 on the numeric keypad. */
        KEY_KP_3 = 4194441,
        
        /** Number 4 on the numeric keypad. */
        KEY_KP_4 = 4194442,
        
        /** Number 5 on the numeric keypad. */
        KEY_KP_5 = 4194443,
        
        /** Number 6 on the numeric keypad. */
        KEY_KP_6 = 4194444,
        
        /** Number 7 on the numeric keypad. */
        KEY_KP_7 = 4194445,
        
        /** Number 8 on the numeric keypad. */
        KEY_KP_8 = 4194446,
        
        /** Number 9 on the numeric keypad. */
        KEY_KP_9 = 4194447,
        
        /** Context menu key. */
        KEY_MENU = 4194370,
        
        /** Hyper key. (On Linux/X11 only). */
        KEY_HYPER = 4194371,
        
        /** Help key. */
        KEY_HELP = 4194373,
        
        /** Back key. */
        KEY_BACK = 4194376,
        
        /** Forward key. */
        KEY_FORWARD = 4194377,
        
        /** Media stop key. */
        KEY_STOP = 4194378,
        
        /** Refresh key. */
        KEY_REFRESH = 4194379,
        
        /** Volume down key. */
        KEY_VOLUMEDOWN = 4194380,
        
        /** Mute volume key. */
        KEY_VOLUMEMUTE = 4194381,
        
        /** Volume up key. */
        KEY_VOLUMEUP = 4194382,
        
        /** Media play key. */
        KEY_MEDIAPLAY = 4194388,
        
        /** Media stop key. */
        KEY_MEDIASTOP = 4194389,
        
        /** Previous song key. */
        KEY_MEDIAPREVIOUS = 4194390,
        
        /** Next song key. */
        KEY_MEDIANEXT = 4194391,
        
        /** Media record key. */
        KEY_MEDIARECORD = 4194392,
        
        /** Home page key. */
        KEY_HOMEPAGE = 4194393,
        
        /** Favorites key. */
        KEY_FAVORITES = 4194394,
        
        /** Search key. */
        KEY_SEARCH = 4194395,
        
        /** Standby key. */
        KEY_STANDBY = 4194396,
        
        /** Open URL / Launch Browser key. */
        KEY_OPENURL = 4194397,
        
        /** Launch Mail key. */
        KEY_LAUNCHMAIL = 4194398,
        
        /** Launch Media key. */
        KEY_LAUNCHMEDIA = 4194399,
        
        /** Launch Shortcut 0 key. */
        KEY_LAUNCH0 = 4194400,
        
        /** Launch Shortcut 1 key. */
        KEY_LAUNCH1 = 4194401,
        
        /** Launch Shortcut 2 key. */
        KEY_LAUNCH2 = 4194402,
        
        /** Launch Shortcut 3 key. */
        KEY_LAUNCH3 = 4194403,
        
        /** Launch Shortcut 4 key. */
        KEY_LAUNCH4 = 4194404,
        
        /** Launch Shortcut 5 key. */
        KEY_LAUNCH5 = 4194405,
        
        /** Launch Shortcut 6 key. */
        KEY_LAUNCH6 = 4194406,
        
        /** Launch Shortcut 7 key. */
        KEY_LAUNCH7 = 4194407,
        
        /** Launch Shortcut 8 key. */
        KEY_LAUNCH8 = 4194408,
        
        /** Launch Shortcut 9 key. */
        KEY_LAUNCH9 = 4194409,
        
        /** Launch Shortcut A key. */
        KEY_LAUNCHA = 4194410,
        
        /** Launch Shortcut B key. */
        KEY_LAUNCHB = 4194411,
        
        /** Launch Shortcut C key. */
        KEY_LAUNCHC = 4194412,
        
        /** Launch Shortcut D key. */
        KEY_LAUNCHD = 4194413,
        
        /** Launch Shortcut E key. */
        KEY_LAUNCHE = 4194414,
        
        /** Launch Shortcut F key. */
        KEY_LAUNCHF = 4194415,
        
        /** "Globe" key on Mac / iPad keyboard. */
        KEY_GLOBE = 4194416,
        
        /** "On-screen keyboard" key on iPad keyboard. */
        KEY_KEYBOARD = 4194417,
        
        /** 英数 key on Mac keyboard. */
        KEY_JIS_EISU = 4194418,
        
        /** かな key on Mac keyboard. */
        KEY_JIS_KANA = 4194419,
        
        /** Unknown key. */
        KEY_UNKNOWN = 8388607,
        
        /** Space key. */
        KEY_SPACE = 32,
        
        /** Exclamation mark (`!`) key. */
        KEY_EXCLAM = 33,
        
        /** Double quotation mark (`"`) key. */
        KEY_QUOTEDBL = 34,
        
        /** Number sign or  *hash*  (`#`) key. */
        KEY_NUMBERSIGN = 35,
        
        /** Dollar sign (`$`) key. */
        KEY_DOLLAR = 36,
        
        /** Percent sign (`%`) key. */
        KEY_PERCENT = 37,
        
        /** Ampersand (`&`) key. */
        KEY_AMPERSAND = 38,
        
        /** Apostrophe (`'`) key. */
        KEY_APOSTROPHE = 39,
        
        /** Left parenthesis (`(`) key. */
        KEY_PARENLEFT = 40,
        
        /** Right parenthesis (`)`) key. */
        KEY_PARENRIGHT = 41,
        
        /** Asterisk (`*`) key. */
        KEY_ASTERISK = 42,
        
        /** Plus (`+`) key. */
        KEY_PLUS = 43,
        
        /** Comma (`,`) key. */
        KEY_COMMA = 44,
        
        /** Minus (`-`) key. */
        KEY_MINUS = 45,
        
        /** Period (`.`) key. */
        KEY_PERIOD = 46,
        
        /** Slash (`/`) key. */
        KEY_SLASH = 47,
        
        /** Number 0 key. */
        KEY_0 = 48,
        
        /** Number 1 key. */
        KEY_1 = 49,
        
        /** Number 2 key. */
        KEY_2 = 50,
        
        /** Number 3 key. */
        KEY_3 = 51,
        
        /** Number 4 key. */
        KEY_4 = 52,
        
        /** Number 5 key. */
        KEY_5 = 53,
        
        /** Number 6 key. */
        KEY_6 = 54,
        
        /** Number 7 key. */
        KEY_7 = 55,
        
        /** Number 8 key. */
        KEY_8 = 56,
        
        /** Number 9 key. */
        KEY_9 = 57,
        
        /** Colon (`:`) key. */
        KEY_COLON = 58,
        
        /** Semicolon (`;`) key. */
        KEY_SEMICOLON = 59,
        
        /** Less-than sign (`<`) key. */
        KEY_LESS = 60,
        
        /** Equal sign (`=`) key. */
        KEY_EQUAL = 61,
        
        /** Greater-than sign (`>`) key. */
        KEY_GREATER = 62,
        
        /** Question mark (`?`) key. */
        KEY_QUESTION = 63,
        
        /** At sign (`@`) key. */
        KEY_AT = 64,
        
        /** A key. */
        KEY_A = 65,
        
        /** B key. */
        KEY_B = 66,
        
        /** C key. */
        KEY_C = 67,
        
        /** D key. */
        KEY_D = 68,
        
        /** E key. */
        KEY_E = 69,
        
        /** F key. */
        KEY_F = 70,
        
        /** G key. */
        KEY_G = 71,
        
        /** H key. */
        KEY_H = 72,
        
        /** I key. */
        KEY_I = 73,
        
        /** J key. */
        KEY_J = 74,
        
        /** K key. */
        KEY_K = 75,
        
        /** L key. */
        KEY_L = 76,
        
        /** M key. */
        KEY_M = 77,
        
        /** N key. */
        KEY_N = 78,
        
        /** O key. */
        KEY_O = 79,
        
        /** P key. */
        KEY_P = 80,
        
        /** Q key. */
        KEY_Q = 81,
        
        /** R key. */
        KEY_R = 82,
        
        /** S key. */
        KEY_S = 83,
        
        /** T key. */
        KEY_T = 84,
        
        /** U key. */
        KEY_U = 85,
        
        /** V key. */
        KEY_V = 86,
        
        /** W key. */
        KEY_W = 87,
        
        /** X key. */
        KEY_X = 88,
        
        /** Y key. */
        KEY_Y = 89,
        
        /** Z key. */
        KEY_Z = 90,
        
        /** Left bracket (`[lb]`) key. */
        KEY_BRACKETLEFT = 91,
        
        /** Backslash (`\`) key. */
        KEY_BACKSLASH = 92,
        
        /** Right bracket (`[rb]`) key. */
        KEY_BRACKETRIGHT = 93,
        
        /** Caret (`^`) key. */
        KEY_ASCIICIRCUM = 94,
        
        /** Underscore (`_`) key. */
        KEY_UNDERSCORE = 95,
        
        /** Backtick (```) key. */
        KEY_QUOTELEFT = 96,
        
        /** Left brace (`{`) key. */
        KEY_BRACELEFT = 123,
        
        /** Vertical bar or  *pipe*  (`|`) key. */
        KEY_BAR = 124,
        
        /** Right brace (`}`) key. */
        KEY_BRACERIGHT = 125,
        
        /** Tilde (`~`) key. */
        KEY_ASCIITILDE = 126,
        
        /** Yen symbol (`¥`) key. */
        KEY_YEN = 165,
        
        /** Section sign (`§`) key. */
        KEY_SECTION = 167,
    }
    enum KeyModifierMask {
        /** Key Code mask. */
        KEY_CODE_MASK = 8388607,
        
        /** Modifier key mask. */
        KEY_MODIFIER_MASK = 2130706432,
        
        /** Automatically remapped to [constant KEY_META] on macOS and [constant KEY_CTRL] on other platforms, this mask is never set in the actual events, and should be used for key mapping only. */
        KEY_MASK_CMD_OR_CTRL = 16777216,
        
        /** Shift key mask. */
        KEY_MASK_SHIFT = 33554432,
        
        /** Alt or Option (on macOS) key mask. */
        KEY_MASK_ALT = 67108864,
        
        /** Command (on macOS) or Meta/Windows key mask. */
        KEY_MASK_META = 134217728,
        
        /** Control key mask. */
        KEY_MASK_CTRL = 268435456,
        
        /** Keypad key mask. */
        KEY_MASK_KPAD = 536870912,
        
        /** Group Switch key mask. */
        KEY_MASK_GROUP_SWITCH = 1073741824,
    }
    enum KeyLocation {
        /** Used for keys which only appear once, or when a comparison doesn't need to differentiate the `LEFT` and `RIGHT` versions.  
         *  For example, when using [method InputEvent.is_match], an event which has [constant KEY_LOCATION_UNSPECIFIED] will match any [enum KeyLocation] on the passed event.  
         */
        KEY_LOCATION_UNSPECIFIED = 0,
        
        /** A key which is to the left of its twin. */
        KEY_LOCATION_LEFT = 1,
        
        /** A key which is to the right of its twin. */
        KEY_LOCATION_RIGHT = 2,
    }
    enum MouseButton {
        /** Enum value which doesn't correspond to any mouse button. This is used to initialize [enum MouseButton] properties with a generic state. */
        MOUSE_BUTTON_NONE = 0,
        
        /** Primary mouse button, usually assigned to the left button. */
        MOUSE_BUTTON_LEFT = 1,
        
        /** Secondary mouse button, usually assigned to the right button. */
        MOUSE_BUTTON_RIGHT = 2,
        
        /** Middle mouse button. */
        MOUSE_BUTTON_MIDDLE = 3,
        
        /** Mouse wheel scrolling up. */
        MOUSE_BUTTON_WHEEL_UP = 4,
        
        /** Mouse wheel scrolling down. */
        MOUSE_BUTTON_WHEEL_DOWN = 5,
        
        /** Mouse wheel left button (only present on some mice). */
        MOUSE_BUTTON_WHEEL_LEFT = 6,
        
        /** Mouse wheel right button (only present on some mice). */
        MOUSE_BUTTON_WHEEL_RIGHT = 7,
        
        /** Extra mouse button 1. This is sometimes present, usually to the sides of the mouse. */
        MOUSE_BUTTON_XBUTTON1 = 8,
        
        /** Extra mouse button 2. This is sometimes present, usually to the sides of the mouse. */
        MOUSE_BUTTON_XBUTTON2 = 9,
    }
    enum MouseButtonMask {
        /** Primary mouse button mask, usually for the left button. */
        MOUSE_BUTTON_MASK_LEFT = 1,
        
        /** Secondary mouse button mask, usually for the right button. */
        MOUSE_BUTTON_MASK_RIGHT = 2,
        
        /** Middle mouse button mask. */
        MOUSE_BUTTON_MASK_MIDDLE = 4,
        
        /** Extra mouse button 1 mask. */
        MOUSE_BUTTON_MASK_MB_XBUTTON1 = 128,
        
        /** Extra mouse button 2 mask. */
        MOUSE_BUTTON_MASK_MB_XBUTTON2 = 256,
    }
    enum JoyButton {
        /** An invalid game controller button. */
        JOY_BUTTON_INVALID = -1,
        
        /** Game controller SDL button A. Corresponds to the bottom action button: Sony Cross, Xbox A, Nintendo B. */
        JOY_BUTTON_A = 0,
        
        /** Game controller SDL button B. Corresponds to the right action button: Sony Circle, Xbox B, Nintendo A. */
        JOY_BUTTON_B = 1,
        
        /** Game controller SDL button X. Corresponds to the left action button: Sony Square, Xbox X, Nintendo Y. */
        JOY_BUTTON_X = 2,
        
        /** Game controller SDL button Y. Corresponds to the top action button: Sony Triangle, Xbox Y, Nintendo X. */
        JOY_BUTTON_Y = 3,
        
        /** Game controller SDL back button. Corresponds to the Sony Select, Xbox Back, Nintendo - button. */
        JOY_BUTTON_BACK = 4,
        
        /** Game controller SDL guide button. Corresponds to the Sony PS, Xbox Home button. */
        JOY_BUTTON_GUIDE = 5,
        
        /** Game controller SDL start button. Corresponds to the Sony Options, Xbox Menu, Nintendo + button. */
        JOY_BUTTON_START = 6,
        
        /** Game controller SDL left stick button. Corresponds to the Sony L3, Xbox L/LS button. */
        JOY_BUTTON_LEFT_STICK = 7,
        
        /** Game controller SDL right stick button. Corresponds to the Sony R3, Xbox R/RS button. */
        JOY_BUTTON_RIGHT_STICK = 8,
        
        /** Game controller SDL left shoulder button. Corresponds to the Sony L1, Xbox LB button. */
        JOY_BUTTON_LEFT_SHOULDER = 9,
        
        /** Game controller SDL right shoulder button. Corresponds to the Sony R1, Xbox RB button. */
        JOY_BUTTON_RIGHT_SHOULDER = 10,
        
        /** Game controller D-pad up button. */
        JOY_BUTTON_DPAD_UP = 11,
        
        /** Game controller D-pad down button. */
        JOY_BUTTON_DPAD_DOWN = 12,
        
        /** Game controller D-pad left button. */
        JOY_BUTTON_DPAD_LEFT = 13,
        
        /** Game controller D-pad right button. */
        JOY_BUTTON_DPAD_RIGHT = 14,
        
        /** Game controller SDL miscellaneous button. Corresponds to Xbox share button, PS5 microphone button, Nintendo Switch capture button. */
        JOY_BUTTON_MISC1 = 15,
        
        /** Game controller SDL paddle 1 button. */
        JOY_BUTTON_PADDLE1 = 16,
        
        /** Game controller SDL paddle 2 button. */
        JOY_BUTTON_PADDLE2 = 17,
        
        /** Game controller SDL paddle 3 button. */
        JOY_BUTTON_PADDLE3 = 18,
        
        /** Game controller SDL paddle 4 button. */
        JOY_BUTTON_PADDLE4 = 19,
        
        /** Game controller SDL touchpad button. */
        JOY_BUTTON_TOUCHPAD = 20,
        
        /** The number of SDL game controller buttons. */
        JOY_BUTTON_SDL_MAX = 21,
        
        /** The maximum number of game controller buttons supported by the engine. The actual limit may be lower on specific platforms:  
         *  - **Android:** Up to 36 buttons.  
         *  - **Linux:** Up to 80 buttons.  
         *  - **Windows** and **macOS:** Up to 128 buttons.  
         */
        JOY_BUTTON_MAX = 128,
    }
    enum JoyAxis {
        /** An invalid game controller axis. */
        JOY_AXIS_INVALID = -1,
        
        /** Game controller left joystick x-axis. */
        JOY_AXIS_LEFT_X = 0,
        
        /** Game controller left joystick y-axis. */
        JOY_AXIS_LEFT_Y = 1,
        
        /** Game controller right joystick x-axis. */
        JOY_AXIS_RIGHT_X = 2,
        
        /** Game controller right joystick y-axis. */
        JOY_AXIS_RIGHT_Y = 3,
        
        /** Game controller left trigger axis. */
        JOY_AXIS_TRIGGER_LEFT = 4,
        
        /** Game controller right trigger axis. */
        JOY_AXIS_TRIGGER_RIGHT = 5,
        
        /** The number of SDL game controller axes. */
        JOY_AXIS_SDL_MAX = 6,
        
        /** The maximum number of game controller axes: OpenVR supports up to 5 Joysticks making a total of 10 axes. */
        JOY_AXIS_MAX = 10,
    }
    enum MIDIMessage {
        /** Does not correspond to any MIDI message. This is the default value of [member InputEventMIDI.message]. */
        MIDI_MESSAGE_NONE = 0,
        
        /** MIDI message sent when a note is released.  
         *      
         *  **Note:** Not all MIDI devices send this message; some may send [constant MIDI_MESSAGE_NOTE_ON] with [member InputEventMIDI.velocity] set to `0`.  
         */
        MIDI_MESSAGE_NOTE_OFF = 8,
        
        /** MIDI message sent when a note is pressed. */
        MIDI_MESSAGE_NOTE_ON = 9,
        
        /** MIDI message sent to indicate a change in pressure while a note is being pressed down, also called aftertouch. */
        MIDI_MESSAGE_AFTERTOUCH = 10,
        
        /** MIDI message sent when a controller value changes. In a MIDI device, a controller is any input that doesn't play notes. These may include sliders for volume, balance, and panning, as well as switches and pedals. See the [url=https://en.wikipedia.org/wiki/General_MIDI#Controller_events]General MIDI specification[/url] for a small list. */
        MIDI_MESSAGE_CONTROL_CHANGE = 11,
        
        /** MIDI message sent when the MIDI device changes its current instrument (also called  *program*  or  *preset* ). */
        MIDI_MESSAGE_PROGRAM_CHANGE = 12,
        
        /** MIDI message sent to indicate a change in pressure for the whole channel. Some MIDI devices may send this instead of [constant MIDI_MESSAGE_AFTERTOUCH]. */
        MIDI_MESSAGE_CHANNEL_PRESSURE = 13,
        
        /** MIDI message sent when the value of the pitch bender changes, usually a wheel on the MIDI device. */
        MIDI_MESSAGE_PITCH_BEND = 14,
        
        /** MIDI system exclusive (SysEx) message. This type of message is not standardized and it's highly dependent on the MIDI device sending it.  
         *      
         *  **Note:** Getting this message's data from [InputEventMIDI] is not implemented.  
         */
        MIDI_MESSAGE_SYSTEM_EXCLUSIVE = 240,
        
        /** MIDI message sent every quarter frame to keep connected MIDI devices synchronized. Related to [constant MIDI_MESSAGE_TIMING_CLOCK].  
         *      
         *  **Note:** Getting this message's data from [InputEventMIDI] is not implemented.  
         */
        MIDI_MESSAGE_QUARTER_FRAME = 241,
        
        /** MIDI message sent to jump onto a new position in the current sequence or song.  
         *      
         *  **Note:** Getting this message's data from [InputEventMIDI] is not implemented.  
         */
        MIDI_MESSAGE_SONG_POSITION_POINTER = 242,
        
        /** MIDI message sent to select a sequence or song to play.  
         *      
         *  **Note:** Getting this message's data from [InputEventMIDI] is not implemented.  
         */
        MIDI_MESSAGE_SONG_SELECT = 243,
        
        /** MIDI message sent to request a tuning calibration. Used on analog synthesizers. Most modern MIDI devices do not need this message. */
        MIDI_MESSAGE_TUNE_REQUEST = 246,
        
        /** MIDI message sent 24 times after [constant MIDI_MESSAGE_QUARTER_FRAME], to keep connected MIDI devices synchronized. */
        MIDI_MESSAGE_TIMING_CLOCK = 248,
        
        /** MIDI message sent to start the current sequence or song from the beginning. */
        MIDI_MESSAGE_START = 250,
        
        /** MIDI message sent to resume from the point the current sequence or song was paused. */
        MIDI_MESSAGE_CONTINUE = 251,
        
        /** MIDI message sent to pause the current sequence or song. */
        MIDI_MESSAGE_STOP = 252,
        
        /** MIDI message sent repeatedly while the MIDI device is idle, to tell the receiver that the connection is alive. Most MIDI devices do not send this message. */
        MIDI_MESSAGE_ACTIVE_SENSING = 254,
        
        /** MIDI message sent to reset a MIDI device to its default state, as if it was just turned on. It should not be sent when the MIDI device is being turned on. */
        MIDI_MESSAGE_SYSTEM_RESET = 255,
    }
    enum GError {
        /** Methods that return [enum Error] return [constant OK] when no error occurred.  
         *  Since [constant OK] has value `0`, and all other error constants are positive integers, it can also be used in boolean checks.  
         *    
         *      
         *  **Note:** Many functions do not return an error code, but will print error messages to standard output.  
         */
        OK = 0,
        
        /** Generic error. */
        FAILED = 1,
        
        /** Unavailable error. */
        ERR_UNAVAILABLE = 2,
        
        /** Unconfigured error. */
        ERR_UNCONFIGURED = 3,
        
        /** Unauthorized error. */
        ERR_UNAUTHORIZED = 4,
        
        /** Parameter range error. */
        ERR_PARAMETER_RANGE_ERROR = 5,
        
        /** Out of memory (OOM) error. */
        ERR_OUT_OF_MEMORY = 6,
        
        /** File: Not found error. */
        ERR_FILE_NOT_FOUND = 7,
        
        /** File: Bad drive error. */
        ERR_FILE_BAD_DRIVE = 8,
        
        /** File: Bad path error. */
        ERR_FILE_BAD_PATH = 9,
        
        /** File: No permission error. */
        ERR_FILE_NO_PERMISSION = 10,
        
        /** File: Already in use error. */
        ERR_FILE_ALREADY_IN_USE = 11,
        
        /** File: Can't open error. */
        ERR_FILE_CANT_OPEN = 12,
        
        /** File: Can't write error. */
        ERR_FILE_CANT_WRITE = 13,
        
        /** File: Can't read error. */
        ERR_FILE_CANT_READ = 14,
        
        /** File: Unrecognized error. */
        ERR_FILE_UNRECOGNIZED = 15,
        
        /** File: Corrupt error. */
        ERR_FILE_CORRUPT = 16,
        
        /** File: Missing dependencies error. */
        ERR_FILE_MISSING_DEPENDENCIES = 17,
        
        /** File: End of file (EOF) error. */
        ERR_FILE_EOF = 18,
        
        /** Can't open error. */
        ERR_CANT_OPEN = 19,
        
        /** Can't create error. */
        ERR_CANT_CREATE = 20,
        
        /** Query failed error. */
        ERR_QUERY_FAILED = 21,
        
        /** Already in use error. */
        ERR_ALREADY_IN_USE = 22,
        
        /** Locked error. */
        ERR_LOCKED = 23,
        
        /** Timeout error. */
        ERR_TIMEOUT = 24,
        
        /** Can't connect error. */
        ERR_CANT_CONNECT = 25,
        
        /** Can't resolve error. */
        ERR_CANT_RESOLVE = 26,
        
        /** Connection error. */
        ERR_CONNECTION_ERROR = 27,
        
        /** Can't acquire resource error. */
        ERR_CANT_ACQUIRE_RESOURCE = 28,
        
        /** Can't fork process error. */
        ERR_CANT_FORK = 29,
        
        /** Invalid data error. */
        ERR_INVALID_DATA = 30,
        
        /** Invalid parameter error. */
        ERR_INVALID_PARAMETER = 31,
        
        /** Already exists error. */
        ERR_ALREADY_EXISTS = 32,
        
        /** Does not exist error. */
        ERR_DOES_NOT_EXIST = 33,
        
        /** Database: Read error. */
        ERR_DATABASE_CANT_READ = 34,
        
        /** Database: Write error. */
        ERR_DATABASE_CANT_WRITE = 35,
        
        /** Compilation failed error. */
        ERR_COMPILATION_FAILED = 36,
        
        /** Method not found error. */
        ERR_METHOD_NOT_FOUND = 37,
        
        /** Linking failed error. */
        ERR_LINK_FAILED = 38,
        
        /** Script failed error. */
        ERR_SCRIPT_FAILED = 39,
        
        /** Cycling link (import cycle) error. */
        ERR_CYCLIC_LINK = 40,
        
        /** Invalid declaration error. */
        ERR_INVALID_DECLARATION = 41,
        
        /** Duplicate symbol error. */
        ERR_DUPLICATE_SYMBOL = 42,
        
        /** Parse error. */
        ERR_PARSE_ERROR = 43,
        
        /** Busy error. */
        ERR_BUSY = 44,
        
        /** Skip error. */
        ERR_SKIP = 45,
        
        /** Help error. Used internally when passing `--version` or `--help` as executable options. */
        ERR_HELP = 46,
        
        /** Bug error, caused by an implementation issue in the method.  
         *      
         *  **Note:** If a built-in method returns this code, please open an issue on [url=https://github.com/godotengine/godot/issues]the GitHub Issue Tracker[/url].  
         */
        ERR_BUG = 47,
        
        /** Printer on fire error (This is an easter egg, no built-in methods return this error code). */
        ERR_PRINTER_ON_FIRE = 48,
    }
    enum PropertyHint {
        /** The property has no hint for the editor. */
        PROPERTY_HINT_NONE = 0,
        
        /** Hints that an [int] or [float] property should be within a range specified via the hint string `"min,max"` or `"min,max,step"`. The hint string can optionally include `"or_greater"` and/or `"or_less"` to allow manual input going respectively above the max or below the min values.  
         *  **Example:** `"-360,360,1,or_greater,or_less"`.  
         *  Additionally, other keywords can be included: `"exp"` for exponential range editing, `"radians_as_degrees"` for editing radian angles in degrees (the range values are also in degrees), `"degrees"` to hint at an angle and `"hide_slider"` to hide the slider.  
         */
        PROPERTY_HINT_RANGE = 1,
        
        /** Hints that an [int] or [String] property is an enumerated value to pick in a list specified via a hint string.  
         *  The hint string is a comma separated list of names such as `"Hello,Something,Else"`. Whitespaces are **not** removed from either end of a name. For integer properties, the first name in the list has value 0, the next 1, and so on. Explicit values can also be specified by appending `:integer` to the name, e.g. `"Zero,One,Three:3,Four,Six:6"`.  
         */
        PROPERTY_HINT_ENUM = 2,
        
        /** Hints that a [String] property can be an enumerated value to pick in a list specified via a hint string such as `"Hello,Something,Else"`.  
         *  Unlike [constant PROPERTY_HINT_ENUM], a property with this hint still accepts arbitrary values and can be empty. The list of values serves to suggest possible values.  
         */
        PROPERTY_HINT_ENUM_SUGGESTION = 3,
        
        /** Hints that a [float] property should be edited via an exponential easing function. The hint string can include `"attenuation"` to flip the curve horizontally and/or `"positive_only"` to exclude in/out easing and limit values to be greater than or equal to zero. */
        PROPERTY_HINT_EXP_EASING = 4,
        
        /** Hints that a vector property should allow its components to be linked. For example, this allows [member Vector2.x] and [member Vector2.y] to be edited together. */
        PROPERTY_HINT_LINK = 5,
        
        /** Hints that an [int] property is a bitmask with named bit flags.  
         *  The hint string is a comma separated list of names such as `"Bit0,Bit1,Bit2,Bit3"`. Whitespaces are **not** removed from either end of a name. The first name in the list has value 1, the next 2, then 4, 8, 16 and so on. Explicit values can also be specified by appending `:integer` to the name, e.g. `"A:4,B:8,C:16"`. You can also combine several flags (`"A:4,B:8,AB:12,C:16"`).  
         *      
         *  **Note:** A flag value must be at least `1` and at most `2 ** 32 - 1`.  
         *      
         *  **Note:** Unlike [constant PROPERTY_HINT_ENUM], the previous explicit value is not taken into account. For the hint `"A:16,B,C"`, A is 16, B is 2, C is 4.  
         */
        PROPERTY_HINT_FLAGS = 6,
        
        /** Hints that an [int] property is a bitmask using the optionally named 2D render layers. */
        PROPERTY_HINT_LAYERS_2D_RENDER = 7,
        
        /** Hints that an [int] property is a bitmask using the optionally named 2D physics layers. */
        PROPERTY_HINT_LAYERS_2D_PHYSICS = 8,
        
        /** Hints that an [int] property is a bitmask using the optionally named 2D navigation layers. */
        PROPERTY_HINT_LAYERS_2D_NAVIGATION = 9,
        
        /** Hints that an [int] property is a bitmask using the optionally named 3D render layers. */
        PROPERTY_HINT_LAYERS_3D_RENDER = 10,
        
        /** Hints that an [int] property is a bitmask using the optionally named 3D physics layers. */
        PROPERTY_HINT_LAYERS_3D_PHYSICS = 11,
        
        /** Hints that an [int] property is a bitmask using the optionally named 3D navigation layers. */
        PROPERTY_HINT_LAYERS_3D_NAVIGATION = 12,
        
        /** Hints that an integer property is a bitmask using the optionally named avoidance layers. */
        PROPERTY_HINT_LAYERS_AVOIDANCE = 37,
        
        /** Hints that a [String] property is a path to a file. Editing it will show a file dialog for picking the path. The hint string can be a set of filters with wildcards like `"*.png,*.jpg"`. */
        PROPERTY_HINT_FILE = 13,
        
        /** Hints that a [String] property is a path to a directory. Editing it will show a file dialog for picking the path. */
        PROPERTY_HINT_DIR = 14,
        
        /** Hints that a [String] property is an absolute path to a file outside the project folder. Editing it will show a file dialog for picking the path. The hint string can be a set of filters with wildcards, like `"*.png,*.jpg"`. */
        PROPERTY_HINT_GLOBAL_FILE = 15,
        
        /** Hints that a [String] property is an absolute path to a directory outside the project folder. Editing it will show a file dialog for picking the path. */
        PROPERTY_HINT_GLOBAL_DIR = 16,
        
        /** Hints that a property is an instance of a [Resource]-derived type, optionally specified via the hint string (e.g. `"Texture2D"`). Editing it will show a popup menu of valid resource types to instantiate. */
        PROPERTY_HINT_RESOURCE_TYPE = 17,
        
        /** Hints that a [String] property is text with line breaks. Editing it will show a text input field where line breaks can be typed. */
        PROPERTY_HINT_MULTILINE_TEXT = 18,
        
        /** Hints that a [String] property is an [Expression]. */
        PROPERTY_HINT_EXPRESSION = 19,
        
        /** Hints that a [String] property should show a placeholder text on its input field, if empty. The hint string is the placeholder text to use. */
        PROPERTY_HINT_PLACEHOLDER_TEXT = 20,
        
        /** Hints that a [Color] property should be edited without affecting its transparency ([member Color.a] is not editable). */
        PROPERTY_HINT_COLOR_NO_ALPHA = 21,
        
        /** Hints that the property's value is an object encoded as object ID, with its type specified in the hint string. Used by the debugger. */
        PROPERTY_HINT_OBJECT_ID = 22,
        
        /** If a property is [String], hints that the property represents a particular type (class). This allows to select a type from the create dialog. The property will store the selected type as a string.  
         *  If a property is [Array], hints the editor how to show elements. The `hint_string` must encode nested types using `":"` and `"/"`.  
         *    
         *  **Examples:**  
         *    
         *      
         *  **Note:** The trailing colon is required for properly detecting built-in types.  
         */
        PROPERTY_HINT_TYPE_STRING = 23,
        PROPERTY_HINT_NODE_PATH_TO_EDITED_NODE = 24,
        
        /** Hints that an object is too big to be sent via the debugger. */
        PROPERTY_HINT_OBJECT_TOO_BIG = 25,
        
        /** Hints that the hint string specifies valid node types for property of type [NodePath]. */
        PROPERTY_HINT_NODE_PATH_VALID_TYPES = 26,
        
        /** Hints that a [String] property is a path to a file. Editing it will show a file dialog for picking the path for the file to be saved at. The dialog has access to the project's directory. The hint string can be a set of filters with wildcards like `"*.png,*.jpg"`. See also [member FileDialog.filters]. */
        PROPERTY_HINT_SAVE_FILE = 27,
        
        /** Hints that a [String] property is a path to a file. Editing it will show a file dialog for picking the path for the file to be saved at. The dialog has access to the entire filesystem. The hint string can be a set of filters with wildcards like `"*.png,*.jpg"`. See also [member FileDialog.filters]. */
        PROPERTY_HINT_GLOBAL_SAVE_FILE = 28,
        PROPERTY_HINT_INT_IS_OBJECTID = 29,
        
        /** Hints that an [int] property is a pointer. Used by GDExtension. */
        PROPERTY_HINT_INT_IS_POINTER = 30,
        
        /** Hints that a property is an [Array] with the stored type specified in the hint string. */
        PROPERTY_HINT_ARRAY_TYPE = 31,
        
        /** Hints that a property is a [Dictionary] with the stored types specified in the hint string. */
        PROPERTY_HINT_DICTIONARY_TYPE = 38,
        
        /** Hints that a string property is a locale code. Editing it will show a locale dialog for picking language and country. */
        PROPERTY_HINT_LOCALE_ID = 32,
        
        /** Hints that a dictionary property is string translation map. Dictionary keys are locale codes and, values are translated strings. */
        PROPERTY_HINT_LOCALIZABLE_STRING = 33,
        
        /** Hints that a property is an instance of a [Node]-derived type, optionally specified via the hint string (e.g. `"Node2D"`). Editing it will show a dialog for picking a node from the scene. */
        PROPERTY_HINT_NODE_TYPE = 34,
        
        /** Hints that a quaternion property should disable the temporary euler editor. */
        PROPERTY_HINT_HIDE_QUATERNION_EDIT = 35,
        
        /** Hints that a string property is a password, and every character is replaced with the secret character. */
        PROPERTY_HINT_PASSWORD = 36,
        
        /** Hints that a [Callable] property should be displayed as a clickable button. When the button is pressed, the callable is called. The hint string specifies the button text and optionally an icon from the `"EditorIcons"` theme type.  
         *  [codeblock lang=text]  
         *  "Click me!" - A button with the text "Click me!" and the default "Callable" icon.  
         *  "Click me!,ColorRect" - A button with the text "Click me!" and the "ColorRect" icon.  
         *  [/codeblock]  
         *      
         *  **Note:** A [Callable] cannot be properly serialized and stored in a file, so it is recommended to use [constant PROPERTY_USAGE_EDITOR] instead of [constant PROPERTY_USAGE_DEFAULT].  
         */
        PROPERTY_HINT_TOOL_BUTTON = 39,
        
        /** Hints that a property will be changed on its own after setting, such as [member AudioStreamPlayer.playing] or [member GPUParticles3D.emitting]. */
        PROPERTY_HINT_ONESHOT = 40,
        
        /** Represents the size of the [enum PropertyHint] enum. */
        PROPERTY_HINT_MAX = 42,
    }
    enum PropertyUsageFlags {
        /** The property is not stored, and does not display in the editor. This is the default for non-exported properties. */
        PROPERTY_USAGE_NONE = 0,
        
        /** The property is serialized and saved in the scene file (default for exported properties). */
        PROPERTY_USAGE_STORAGE = 2,
        
        /** The property is shown in the [EditorInspector] (default for exported properties). */
        PROPERTY_USAGE_EDITOR = 4,
        
        /** The property is excluded from the class reference. */
        PROPERTY_USAGE_INTERNAL = 8,
        
        /** The property can be checked in the [EditorInspector]. */
        PROPERTY_USAGE_CHECKABLE = 16,
        
        /** The property is checked in the [EditorInspector]. */
        PROPERTY_USAGE_CHECKED = 32,
        
        /** Used to group properties together in the editor. See [EditorInspector]. */
        PROPERTY_USAGE_GROUP = 64,
        
        /** Used to categorize properties together in the editor. */
        PROPERTY_USAGE_CATEGORY = 128,
        
        /** Used to group properties together in the editor in a subgroup (under a group). See [EditorInspector]. */
        PROPERTY_USAGE_SUBGROUP = 256,
        
        /** The property is a bitfield, i.e. it contains multiple flags represented as bits. */
        PROPERTY_USAGE_CLASS_IS_BITFIELD = 512,
        
        /** The property does not save its state in [PackedScene]. */
        PROPERTY_USAGE_NO_INSTANCE_STATE = 1024,
        
        /** Editing the property prompts the user for restarting the editor. */
        PROPERTY_USAGE_RESTART_IF_CHANGED = 2048,
        
        /** The property is a script variable. [constant PROPERTY_USAGE_SCRIPT_VARIABLE] can be used to distinguish between exported script variables from built-in variables (which don't have this usage flag). By default, [constant PROPERTY_USAGE_SCRIPT_VARIABLE] is **not** applied to variables that are created by overriding [method Object._get_property_list] in a script. */
        PROPERTY_USAGE_SCRIPT_VARIABLE = 4096,
        
        /** The property value of type [Object] will be stored even if its value is `null`. */
        PROPERTY_USAGE_STORE_IF_NULL = 8192,
        
        /** If this property is modified, all inspector fields will be refreshed. */
        PROPERTY_USAGE_UPDATE_ALL_IF_MODIFIED = 16384,
        PROPERTY_USAGE_SCRIPT_DEFAULT_VALUE = 32768,
        
        /** The property is a variable of enum type, i.e. it only takes named integer constants from its associated enumeration. */
        PROPERTY_USAGE_CLASS_IS_ENUM = 65536,
        
        /** If property has `nil` as default value, its type will be [Variant]. */
        PROPERTY_USAGE_NIL_IS_VARIANT = 131072,
        
        /** The property is an array. */
        PROPERTY_USAGE_ARRAY = 262144,
        
        /** When duplicating a resource with [method Resource.duplicate], and this flag is set on a property of that resource, the property should always be duplicated, regardless of the `subresources` bool parameter. */
        PROPERTY_USAGE_ALWAYS_DUPLICATE = 524288,
        
        /** When duplicating a resource with [method Resource.duplicate], and this flag is set on a property of that resource, the property should never be duplicated, regardless of the `subresources` bool parameter. */
        PROPERTY_USAGE_NEVER_DUPLICATE = 1048576,
        
        /** The property is only shown in the editor if modern renderers are supported (the Compatibility rendering method is excluded). */
        PROPERTY_USAGE_HIGH_END_GFX = 2097152,
        
        /** The [NodePath] property will always be relative to the scene's root. Mostly useful for local resources. */
        PROPERTY_USAGE_NODE_PATH_FROM_SCENE_ROOT = 4194304,
        
        /** Use when a resource is created on the fly, i.e. the getter will always return a different instance. [ResourceSaver] needs this information to properly save such resources. */
        PROPERTY_USAGE_RESOURCE_NOT_PERSISTENT = 8388608,
        
        /** Inserting an animation key frame of this property will automatically increment the value, allowing to easily keyframe multiple values in a row. */
        PROPERTY_USAGE_KEYING_INCREMENTS = 16777216,
        PROPERTY_USAGE_DEFERRED_SET_RESOURCE = 33554432,
        
        /** When this property is a [Resource] and base object is a [Node], a resource instance will be automatically created whenever the node is created in the editor. */
        PROPERTY_USAGE_EDITOR_INSTANTIATE_OBJECT = 67108864,
        
        /** The property is considered a basic setting and will appear even when advanced mode is disabled. Used for project settings. */
        PROPERTY_USAGE_EDITOR_BASIC_SETTING = 134217728,
        
        /** The property is read-only in the [EditorInspector]. */
        PROPERTY_USAGE_READ_ONLY = 268435456,
        
        /** An export preset property with this flag contains confidential information and is stored separately from the rest of the export preset configuration. */
        PROPERTY_USAGE_SECRET = 536870912,
        
        /** Default usage (storage and editor). */
        PROPERTY_USAGE_DEFAULT = 6,
        
        /** Default usage but without showing the property in the editor (storage). */
        PROPERTY_USAGE_NO_EDITOR = 2,
    }
    enum MethodFlags {
        /** Flag for a normal method. */
        METHOD_FLAG_NORMAL = 1,
        
        /** Flag for an editor method. */
        METHOD_FLAG_EDITOR = 2,
        
        /** Flag for a constant method. */
        METHOD_FLAG_CONST = 4,
        
        /** Flag for a virtual method. */
        METHOD_FLAG_VIRTUAL = 8,
        
        /** Flag for a method with a variable number of arguments. */
        METHOD_FLAG_VARARG = 16,
        
        /** Flag for a static method. */
        METHOD_FLAG_STATIC = 32,
        
        /** Used internally. Allows to not dump core virtual methods (such as [method Object._notification]) to the JSON API. */
        METHOD_FLAG_OBJECT_CORE = 64,
        
        /** Flag for a virtual method that is required. */
        METHOD_FLAG_VIRTUAL_REQUIRED = 128,
        
        /** Default method flags (normal). */
        METHOD_FLAGS_DEFAULT = 1,
    }
    namespace Variant {
        enum Type {
            /** Variable is `null`. */
            TYPE_NIL = 0,
            
            /** Variable is of type [bool]. */
            TYPE_BOOL = 1,
            
            /** Variable is of type [int]. */
            TYPE_INT = 2,
            
            /** Variable is of type [float]. */
            TYPE_FLOAT = 3,
            
            /** Variable is of type [String]. */
            TYPE_STRING = 4,
            
            /** Variable is of type [Vector2]. */
            TYPE_VECTOR2 = 5,
            
            /** Variable is of type [Vector2i]. */
            TYPE_VECTOR2I = 6,
            
            /** Variable is of type [Rect2]. */
            TYPE_RECT2 = 7,
            
            /** Variable is of type [Rect2i]. */
            TYPE_RECT2I = 8,
            
            /** Variable is of type [Vector3]. */
            TYPE_VECTOR3 = 9,
            
            /** Variable is of type [Vector3i]. */
            TYPE_VECTOR3I = 10,
            
            /** Variable is of type [Transform2D]. */
            TYPE_TRANSFORM2D = 11,
            
            /** Variable is of type [Vector4]. */
            TYPE_VECTOR4 = 12,
            
            /** Variable is of type [Vector4i]. */
            TYPE_VECTOR4I = 13,
            
            /** Variable is of type [Plane]. */
            TYPE_PLANE = 14,
            
            /** Variable is of type [Quaternion]. */
            TYPE_QUATERNION = 15,
            
            /** Variable is of type [AABB]. */
            TYPE_AABB = 16,
            
            /** Variable is of type [Basis]. */
            TYPE_BASIS = 17,
            
            /** Variable is of type [Transform3D]. */
            TYPE_TRANSFORM3D = 18,
            
            /** Variable is of type [Projection]. */
            TYPE_PROJECTION = 19,
            
            /** Variable is of type [Color]. */
            TYPE_COLOR = 20,
            
            /** Variable is of type [StringName]. */
            TYPE_STRING_NAME = 21,
            
            /** Variable is of type [NodePath]. */
            TYPE_NODE_PATH = 22,
            
            /** Variable is of type [RID]. */
            TYPE_RID = 23,
            
            /** Variable is of type [Object]. */
            TYPE_OBJECT = 24,
            
            /** Variable is of type [Callable]. */
            TYPE_CALLABLE = 25,
            
            /** Variable is of type [Signal]. */
            TYPE_SIGNAL = 26,
            
            /** Variable is of type [Dictionary]. */
            TYPE_DICTIONARY = 27,
            
            /** Variable is of type [Array]. */
            TYPE_ARRAY = 28,
            
            /** Variable is of type [PackedByteArray]. */
            TYPE_PACKED_BYTE_ARRAY = 29,
            
            /** Variable is of type [PackedInt32Array]. */
            TYPE_PACKED_INT32_ARRAY = 30,
            
            /** Variable is of type [PackedInt64Array]. */
            TYPE_PACKED_INT64_ARRAY = 31,
            
            /** Variable is of type [PackedFloat32Array]. */
            TYPE_PACKED_FLOAT32_ARRAY = 32,
            
            /** Variable is of type [PackedFloat64Array]. */
            TYPE_PACKED_FLOAT64_ARRAY = 33,
            
            /** Variable is of type [PackedStringArray]. */
            TYPE_PACKED_STRING_ARRAY = 34,
            
            /** Variable is of type [PackedVector2Array]. */
            TYPE_PACKED_VECTOR2_ARRAY = 35,
            
            /** Variable is of type [PackedVector3Array]. */
            TYPE_PACKED_VECTOR3_ARRAY = 36,
            
            /** Variable is of type [PackedColorArray]. */
            TYPE_PACKED_COLOR_ARRAY = 37,
            
            /** Variable is of type [PackedVector4Array]. */
            TYPE_PACKED_VECTOR4_ARRAY = 38,
            
            /** Represents the size of the [enum Variant.Type] enum. */
            TYPE_MAX = 39,
        }
    }
    namespace Variant {
        enum Operator {
            /** Equality operator (`==`). */
            OP_EQUAL = 0,
            
            /** Inequality operator (`!=`). */
            OP_NOT_EQUAL = 1,
            
            /** Less than operator (`<`). */
            OP_LESS = 2,
            
            /** Less than or equal operator (`<=`). */
            OP_LESS_EQUAL = 3,
            
            /** Greater than operator (`>`). */
            OP_GREATER = 4,
            
            /** Greater than or equal operator (`>=`). */
            OP_GREATER_EQUAL = 5,
            
            /** Addition operator (`+`). */
            OP_ADD = 6,
            
            /** Subtraction operator (`-`). */
            OP_SUBTRACT = 7,
            
            /** Multiplication operator (`*`). */
            OP_MULTIPLY = 8,
            
            /** Division operator (`/`). */
            OP_DIVIDE = 9,
            
            /** Unary negation operator (`-`). */
            OP_NEGATE = 10,
            
            /** Unary plus operator (`+`). */
            OP_POSITIVE = 11,
            
            /** Remainder/modulo operator (`%`). */
            OP_MODULE = 12,
            
            /** Power operator (`**`). */
            OP_POWER = 13,
            
            /** Left shift operator (`<<`). */
            OP_SHIFT_LEFT = 14,
            
            /** Right shift operator (`>>`). */
            OP_SHIFT_RIGHT = 15,
            
            /** Bitwise AND operator (`&`). */
            OP_BIT_AND = 16,
            
            /** Bitwise OR operator (`|`). */
            OP_BIT_OR = 17,
            
            /** Bitwise XOR operator (`^`). */
            OP_BIT_XOR = 18,
            
            /** Bitwise NOT operator (`~`). */
            OP_BIT_NEGATE = 19,
            
            /** Logical AND operator (`and` or `&&`). */
            OP_AND = 20,
            
            /** Logical OR operator (`or` or `||`). */
            OP_OR = 21,
            
            /** Logical XOR operator (not implemented in GDScript). */
            OP_XOR = 22,
            
            /** Logical NOT operator (`not` or `!`). */
            OP_NOT = 23,
            
            /** Logical IN operator (`in`). */
            OP_IN = 24,
            
            /** Represents the size of the [enum Variant.Operator] enum. */
            OP_MAX = 25,
        }
    }
    
    /** Returns the sine of angle [param angle_rad] in radians.  
     *    
     */
    static function sin(angle_rad: float64): float64
    
    /** Returns the cosine of angle [param angle_rad] in radians.  
     *    
     */
    static function cos(angle_rad: float64): float64
    
    /** Returns the tangent of angle [param angle_rad] in radians.  
     *    
     */
    static function tan(angle_rad: float64): float64
    
    /** Returns the hyperbolic sine of [param x].  
     *    
     */
    static function sinh(x: float64): float64
    
    /** Returns the hyperbolic cosine of [param x] in radians.  
     *    
     */
    static function cosh(x: float64): float64
    
    /** Returns the hyperbolic tangent of [param x].  
     *    
     */
    static function tanh(x: float64): float64
    
    /** Returns the arc sine of [param x] in radians. Use to get the angle of sine [param x]. [param x] will be clamped between `-1.0` and `1.0` (inclusive), in order to prevent [method asin] from returning [constant @GDScript.NAN].  
     *    
     */
    static function asin(x: float64): float64
    
    /** Returns the arc cosine of [param x] in radians. Use to get the angle of cosine [param x]. [param x] will be clamped between `-1.0` and `1.0` (inclusive), in order to prevent [method acos] from returning [constant @GDScript.NAN].  
     *    
     */
    static function acos(x: float64): float64
    
    /** Returns the arc tangent of [param x] in radians. Use it to get the angle from an angle's tangent in trigonometry.  
     *  The method cannot know in which quadrant the angle should fall. See [method atan2] if you have both `y` and [code skip-lint]x`.  
     *    
     *  If [param x] is between `-PI / 2` and `PI / 2` (inclusive), `atan(tan(x))` is equal to [param x].  
     */
    static function atan(x: float64): float64
    
    /** Returns the arc tangent of `y/x` in radians. Use to get the angle of tangent `y/x`. To compute the value, the method takes into account the sign of both arguments in order to determine the quadrant.  
     *  Important note: The Y coordinate comes first, by convention.  
     *    
     */
    static function atan2(y: float64, x: float64): float64
    
    /** Returns the hyperbolic arc (also called inverse) sine of [param x], returning a value in radians. Use it to get the angle from an angle's sine in hyperbolic space.  
     *    
     */
    static function asinh(x: float64): float64
    
    /** Returns the hyperbolic arc (also called inverse) cosine of [param x], returning a value in radians. Use it to get the angle from an angle's cosine in hyperbolic space if [param x] is larger or equal to 1. For values of [param x] lower than 1, it will return 0, in order to prevent [method acosh] from returning [constant @GDScript.NAN].  
     *    
     */
    static function acosh(x: float64): float64
    
    /** Returns the hyperbolic arc (also called inverse) tangent of [param x], returning a value in radians. Use it to get the angle from an angle's tangent in hyperbolic space if [param x] is between -1 and 1 (non-inclusive).  
     *  In mathematics, the inverse hyperbolic tangent is only defined for -1 < [param x] < 1 in the real set, so values equal or lower to -1 for [param x] return negative [constant @GDScript.INF] and values equal or higher than 1 return positive [constant @GDScript.INF] in order to prevent [method atanh] from returning [constant @GDScript.NAN].  
     *    
     */
    static function atanh(x: float64): float64
    
    /** Returns the square root of [param x], where [param x] is a non-negative number.  
     *    
     *      
     *  **Note:** Negative values of [param x] return NaN ("Not a Number"). in C#, if you need negative inputs, use `System.Numerics.Complex`.  
     */
    static function sqrt(x: float64): float64
    
    /** Returns the floating-point remainder of [param x] divided by [param y], keeping the sign of [param x].  
     *    
     *  For the integer remainder operation, use the `%` operator.  
     */
    static function fmod(x: float64, y: float64): float64
    
    /** Returns the floating-point modulus of [param x] divided by [param y], wrapping equally in positive and negative.  
     *    
     *  Prints:  
     *  [codeblock lang=text]  
     *   (x)  (fmod(x, 1.5))   (fposmod(x, 1.5))  
     *  -1.5           -0.0  |  0.0  
     *  -1.0           -1.0  |  0.5  
     *  -0.5           -0.5  |  1.0  
     *   0.0            0.0  |  0.0  
     *   0.5            0.5  |  0.5  
     *   1.0            1.0  |  1.0  
     *   1.5            0.0  |  0.0  
     *  [/codeblock]  
     */
    static function fposmod(x: float64, y: float64): float64
    
    /** Returns the integer modulus of [param x] divided by [param y] that wraps equally in positive and negative.  
     *    
     *  Prints:  
     *  [codeblock lang=text]  
     *  (i)  (i % 3)   (posmod(i, 3))  
     *  -3        0  |  0  
     *  -2       -2  |  1  
     *  -1       -1  |  2  
     *   0        0  |  0  
     *   1        1  |  1  
     *   2        2  |  2  
     *   3        0  |  0  
     *  [/codeblock]  
     */
    static function posmod(x: int64, y: int64): int64
    
    /** Rounds [param x] downward (towards negative infinity), returning the largest whole number that is not more than [param x]. Supported types: [int], [float], [Vector2], [Vector2i], [Vector3], [Vector3i], [Vector4], [Vector4i].  
     *    
     *  See also [method ceil], [method round], and [method snapped].  
     *      
     *  **Note:** For better type safety, use [method floorf], [method floori], [method Vector2.floor], [method Vector3.floor], or [method Vector4.floor].  
     */
    static function floor(x: any): any
    
    /** Rounds [param x] downward (towards negative infinity), returning the largest whole number that is not more than [param x].  
     *  A type-safe version of [method floor], returning a [float].  
     */
    static function floorf(x: float64): float64
    
    /** Rounds [param x] downward (towards negative infinity), returning the largest whole number that is not more than [param x].  
     *  A type-safe version of [method floor], returning an [int].  
     *      
     *  **Note:** This function is  *not*  the same as `int(x)`, which rounds towards 0.  
     */
    static function floori(x: float64): int64
    
    /** Rounds [param x] upward (towards positive infinity), returning the smallest whole number that is not less than [param x]. Supported types: [int], [float], [Vector2], [Vector2i], [Vector3], [Vector3i], [Vector4], [Vector4i].  
     *    
     *  See also [method floor], [method round], and [method snapped].  
     *      
     *  **Note:** For better type safety, use [method ceilf], [method ceili], [method Vector2.ceil], [method Vector3.ceil], or [method Vector4.ceil].  
     */
    static function ceil(x: any): any
    
    /** Rounds [param x] upward (towards positive infinity), returning the smallest whole number that is not less than [param x].  
     *  A type-safe version of [method ceil], returning a [float].  
     */
    static function ceilf(x: float64): float64
    
    /** Rounds [param x] upward (towards positive infinity), returning the smallest whole number that is not less than [param x].  
     *  A type-safe version of [method ceil], returning an [int].  
     */
    static function ceili(x: float64): int64
    
    /** Rounds [param x] to the nearest whole number, with halfway cases rounded away from 0. Supported types: [int], [float], [Vector2], [Vector2i], [Vector3], [Vector3i], [Vector4], [Vector4i].  
     *    
     *  See also [method floor], [method ceil], and [method snapped].  
     *      
     *  **Note:** For better type safety, use [method roundf], [method roundi], [method Vector2.round], [method Vector3.round], or [method Vector4.round].  
     */
    static function round(x: any): any
    
    /** Rounds [param x] to the nearest whole number, with halfway cases rounded away from 0.  
     *  A type-safe version of [method round], returning a [float].  
     */
    static function roundf(x: float64): float64
    
    /** Rounds [param x] to the nearest whole number, with halfway cases rounded away from 0.  
     *  A type-safe version of [method round], returning an [int].  
     */
    static function roundi(x: float64): int64
    
    /** Returns the absolute value of a [Variant] parameter [param x] (i.e. non-negative value). Supported types: [int], [float], [Vector2], [Vector2i], [Vector3], [Vector3i], [Vector4], [Vector4i].  
     *    
     *      
     *  **Note:** For better type safety, use [method absf], [method absi], [method Vector2.abs], [method Vector2i.abs], [method Vector3.abs], [method Vector3i.abs], [method Vector4.abs], or [method Vector4i.abs].  
     */
    static function abs(x: any): any
    
    /** Returns the absolute value of float parameter [param x] (i.e. positive value).  
     *    
     */
    static function absf(x: float64): float64
    
    /** Returns the absolute value of int parameter [param x] (i.e. positive value).  
     *    
     */
    static function absi(x: int64): int64
    
    /** Returns the same type of [Variant] as [param x], with `-1` for negative values, `1` for positive values, and `0` for zeros. For `nan` values it returns 0.  
     *  Supported types: [int], [float], [Vector2], [Vector2i], [Vector3], [Vector3i], [Vector4], [Vector4i].  
     *    
     *      
     *  **Note:** For better type safety, use [method signf], [method signi], [method Vector2.sign], [method Vector2i.sign], [method Vector3.sign], [method Vector3i.sign], [method Vector4.sign], or [method Vector4i.sign].  
     */
    static function sign(x: any): any
    
    /** Returns `-1.0` if [param x] is negative, `1.0` if [param x] is positive, and `0.0` if [param x] is zero. For `nan` values of [param x] it returns 0.0.  
     *    
     */
    static function signf(x: float64): float64
    
    /** Returns `-1` if [param x] is negative, `1` if [param x] is positive, and `0` if [param x] is zero.  
     *    
     */
    static function signi(x: int64): int64
    
    /** Returns the multiple of [param step] that is the closest to [param x]. This can also be used to round a floating-point number to an arbitrary number of decimals.  
     *  The returned value is the same type of [Variant] as [param step]. Supported types: [int], [float], [Vector2], [Vector2i], [Vector3], [Vector3i], [Vector4], [Vector4i].  
     *    
     *  See also [method ceil], [method floor], and [method round].  
     *      
     *  **Note:** For better type safety, use [method snappedf], [method snappedi], [method Vector2.snapped], [method Vector2i.snapped], [method Vector3.snapped], [method Vector3i.snapped], [method Vector4.snapped], or [method Vector4i.snapped].  
     */
    static function snapped(x: any, step: any): any
    
    /** Returns the multiple of [param step] that is the closest to [param x]. This can also be used to round a floating-point number to an arbitrary number of decimals.  
     *  A type-safe version of [method snapped], returning a [float].  
     *    
     */
    static function snappedf(x: float64, step: float64): float64
    
    /** Returns the multiple of [param step] that is the closest to [param x].  
     *  A type-safe version of [method snapped], returning an [int].  
     *    
     */
    static function snappedi(x: float64, step: int64): int64
    
    /** Returns the result of [param base] raised to the power of [param exp].  
     *  In GDScript, this is the equivalent of the `**` operator.  
     *    
     */
    static function pow(base: float64, exp: float64): float64
    
    /** Returns the [url=https://en.wikipedia.org/wiki/Natural_logarithm]natural logarithm[/url] of [param x] (base [url=https://en.wikipedia.org/wiki/E_(mathematical_constant)] *e* [/url], with  *e*  being approximately 2.71828). This is the amount of time needed to reach a certain level of continuous growth.  
     *      
     *  **Note:** This is not the same as the "log" function on most calculators, which uses a base 10 logarithm. To use base 10 logarithm, use `log(x) / log(10)`.  
     *    
     *      
     *  **Note:** The logarithm of `0` returns `-inf`, while negative values return `-nan`.  
     */
    static function log(x: float64): float64
    
    /** The natural exponential function. It raises the mathematical constant  *e*  to the power of [param x] and returns it.  
     *   *e*  has an approximate value of 2.71828, and can be obtained with `exp(1)`.  
     *  For exponents to other bases use the method [method pow].  
     *    
     */
    static function exp(x: float64): float64
    
    /** Returns `true` if [param x] is a NaN ("Not a Number" or invalid) value. */
    static function is_nan(x: float64): boolean
    
    /** Returns `true` if [param x] is either positive infinity or negative infinity. */
    static function is_inf(x: float64): boolean
    
    /** Returns `true` if [param a] and [param b] are approximately equal to each other.  
     *  Here, "approximately equal" means that [param a] and [param b] are within a small internal epsilon of each other, which scales with the magnitude of the numbers.  
     *  Infinity values of the same sign are considered equal.  
     */
    static function is_equal_approx(a: float64, b: float64): boolean
    
    /** Returns `true` if [param x] is zero or almost zero. The comparison is done using a tolerance calculation with a small internal epsilon.  
     *  This function is faster than using [method is_equal_approx] with one value as zero.  
     */
    static function is_zero_approx(x: float64): boolean
    
    /** Returns whether [param x] is a finite value, i.e. it is not [constant @GDScript.NAN], positive infinity, or negative infinity. */
    static function is_finite(x: float64): boolean
    
    /** Returns an "eased" value of [param x] based on an easing function defined with [param curve]. This easing function is based on an exponent. The [param curve] can be any floating-point number, with specific values leading to the following behaviors:  
     *  [codeblock lang=text]  
     *  - Lower than -1.0 (exclusive): Ease in-out  
     *  - -1.0: Linear  
     *  - Between -1.0 and 0.0 (exclusive): Ease out-in  
     *  - 0.0: Constant  
     *  - Between 0.0 to 1.0 (exclusive): Ease out  
     *  - 1.0: Linear  
     *  - Greater than 1.0 (exclusive): Ease in  
     *  [/codeblock]  
     *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/ease_cheatsheet.png]ease() curve values cheatsheet[/url]  
     *  See also [method smoothstep]. If you need to perform more advanced transitions, use [method Tween.interpolate_value].  
     */
    static function ease(x: float64, curve: float64): float64
    
    /** Returns the position of the first non-zero digit, after the decimal point. Note that the maximum return value is 10, which is a design decision in the implementation.  
     *    
     */
    static function step_decimals(x: float64): int64
    
    /** Linearly interpolates between two values by the factor defined in [param weight]. To perform interpolation, [param weight] should be between `0.0` and `1.0` (inclusive). However, values outside this range are allowed and can be used to perform  *extrapolation* . If this is not desired, use [method clampf] to limit [param weight].  
     *  Both [param from] and [param to] must be the same type. Supported types: [int], [float], [Vector2], [Vector3], [Vector4], [Color], [Quaternion], [Basis], [Transform2D], [Transform3D].  
     *    
     *  See also [method inverse_lerp] which performs the reverse of this operation. To perform eased interpolation with [method lerp], combine it with [method ease] or [method smoothstep]. See also [method remap] to map a continuous series of values to another.  
     *      
     *  **Note:** For better type safety, use [method lerpf], [method Vector2.lerp], [method Vector3.lerp], [method Vector4.lerp], [method Color.lerp], [method Quaternion.slerp], [method Basis.slerp], [method Transform2D.interpolate_with], or [method Transform3D.interpolate_with].  
     */
    static function lerp(from: any, to: any, weight: any): any
    
    /** Linearly interpolates between two values by the factor defined in [param weight]. To perform interpolation, [param weight] should be between `0.0` and `1.0` (inclusive). However, values outside this range are allowed and can be used to perform  *extrapolation* . If this is not desired, use [method clampf] on the result of this function.  
     *    
     *  See also [method inverse_lerp] which performs the reverse of this operation. To perform eased interpolation with [method lerp], combine it with [method ease] or [method smoothstep].  
     */
    static function lerpf(from: float64, to: float64, weight: float64): float64
    
    /** Cubic interpolates between two values by the factor defined in [param weight] with [param pre] and [param post] values. */
    static function cubic_interpolate(from: float64, to: float64, pre: float64, post: float64, weight: float64): float64
    
    /** Cubic interpolates between two rotation values with shortest path by the factor defined in [param weight] with [param pre] and [param post] values. See also [method lerp_angle]. */
    static function cubic_interpolate_angle(from: float64, to: float64, pre: float64, post: float64, weight: float64): float64
    
    /** Cubic interpolates between two values by the factor defined in [param weight] with [param pre] and [param post] values.  
     *  It can perform smoother interpolation than [method cubic_interpolate] by the time values.  
     */
    static function cubic_interpolate_in_time(from: float64, to: float64, pre: float64, post: float64, weight: float64, to_t: float64, pre_t: float64, post_t: float64): float64
    
    /** Cubic interpolates between two rotation values with shortest path by the factor defined in [param weight] with [param pre] and [param post] values. See also [method lerp_angle].  
     *  It can perform smoother interpolation than [method cubic_interpolate] by the time values.  
     */
    static function cubic_interpolate_angle_in_time(from: float64, to: float64, pre: float64, post: float64, weight: float64, to_t: float64, pre_t: float64, post_t: float64): float64
    
    /** Returns the point at the given [param t] on a one-dimensional [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by the given [param control_1], [param control_2], and [param end] points. */
    static function bezier_interpolate(start: float64, control_1: float64, control_2: float64, end: float64, t: float64): float64
    
    /** Returns the derivative at the given [param t] on a one-dimensional [url=https://en.wikipedia.org/wiki/B%C3%A9zier_curve]Bézier curve[/url] defined by the given [param control_1], [param control_2], and [param end] points. */
    static function bezier_derivative(start: float64, control_1: float64, control_2: float64, end: float64, t: float64): float64
    
    /** Returns the difference between the two angles (in radians), in the range of `[-PI, +PI]`. When [param from] and [param to] are opposite, returns `-PI` if [param from] is smaller than [param to], or `PI` otherwise. */
    static function angle_difference(from: float64, to: float64): float64
    
    /** Linearly interpolates between two angles (in radians) by a [param weight] value between 0.0 and 1.0.  
     *  Similar to [method lerp], but interpolates correctly when the angles wrap around [constant @GDScript.TAU]. To perform eased interpolation with [method lerp_angle], combine it with [method ease] or [method smoothstep].  
     *    
     *      
     *  **Note:** This function lerps through the shortest path between [param from] and [param to]. However, when these two angles are approximately `PI + k * TAU` apart for any integer `k`, it's not obvious which way they lerp due to floating-point precision errors. For example, `lerp_angle(0, PI, weight)` lerps counter-clockwise, while `lerp_angle(0, PI + 5 * TAU, weight)` lerps clockwise.  
     */
    static function lerp_angle(from: float64, to: float64, weight: float64): float64
    
    /** Returns an interpolation or extrapolation factor considering the range specified in [param from] and [param to], and the interpolated value specified in [param weight]. The returned value will be between `0.0` and `1.0` if [param weight] is between [param from] and [param to] (inclusive). If [param weight] is located outside this range, then an extrapolation factor will be returned (return value lower than `0.0` or greater than `1.0`). Use [method clamp] on the result of [method inverse_lerp] if this is not desired.  
     *    
     *  See also [method lerp], which performs the reverse of this operation, and [method remap] to map a continuous series of values to another.  
     */
    static function inverse_lerp(from: float64, to: float64, weight: float64): float64
    
    /** Maps a [param value] from range `[istart, istop]` to `[ostart, ostop]`. See also [method lerp] and [method inverse_lerp]. If [param value] is outside `[istart, istop]`, then the resulting value will also be outside `[ostart, ostop]`. If this is not desired, use [method clamp] on the result of this function.  
     *    
     *  For complex use cases where multiple ranges are needed, consider using [Curve] or [Gradient] instead.  
     *      
     *  **Note:** If `istart == istop`, the return value is undefined (most likely NaN, INF, or -INF).  
     */
    static function remap(value: float64, istart: float64, istop: float64, ostart: float64, ostop: float64): float64
    
    /** Returns a smooth cubic Hermite interpolation between `0` and `1`.  
     *  For positive ranges (when `from <= to`) the return value is `0` when `x <= from`, and `1` when `x >= to`. If [param x] lies between [param from] and [param to], the return value follows an S-shaped curve that smoothly transitions from `0` to `1`.  
     *  For negative ranges (when `from > to`) the function is mirrored and returns `1` when `x <= to` and `0` when `x >= from`.  
     *  This S-shaped curve is the cubic Hermite interpolator, given by `f(y) = 3*y^2 - 2*y^3` where `y = (x-from) / (to-from)`.  
     *    
     *  Compared to [method ease] with a curve value of `-1.6521`, [method smoothstep] returns the smoothest possible curve with no sudden changes in the derivative. If you need to perform more advanced transitions, use [Tween] or [AnimationPlayer].  
     *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/smoothstep_ease_comparison.png]Comparison between smoothstep() and ease(x, -1.6521) return values[/url]  
     *  [url=https://raw.githubusercontent.com/godotengine/godot-docs/master/img/smoothstep_range.webp]Smoothstep() return values with positive, zero, and negative ranges[/url]  
     */
    static function smoothstep(from: float64, to: float64, x: float64): float64
    
    /** Moves [param from] toward [param to] by the [param delta] amount. Will not go past [param to].  
     *  Use a negative [param delta] value to move away.  
     *    
     */
    static function move_toward(from: float64, to: float64, delta: float64): float64
    
    /** Rotates [param from] toward [param to] by the [param delta] amount. Will not go past [param to].  
     *  Similar to [method move_toward], but interpolates correctly when the angles wrap around [constant @GDScript.TAU].  
     *  If [param delta] is negative, this function will rotate away from [param to], toward the opposite angle, and will not go past the opposite angle.  
     */
    static function rotate_toward(from: float64, to: float64, delta: float64): float64
    
    /** Converts an angle expressed in degrees to radians.  
     *    
     */
    static function deg_to_rad(deg: float64): float64
    
    /** Converts an angle expressed in radians to degrees.  
     *    
     */
    static function rad_to_deg(rad: float64): float64
    
    /** Converts from linear energy to decibels (audio). Since volume is not normally linear, this can be used to implement volume sliders that behave as expected.  
     *  **Example:** Change the Master bus's volume through a [Slider] node, which ranges from `0.0` to `1.0`:  
     *    
     */
    static function linear_to_db(lin: float64): float64
    
    /** Converts from decibels to linear energy (audio). */
    static function db_to_linear(db: float64): float64
    
    /** Wraps the [Variant] [param value] between [param min] and [param max]. Can be used for creating loop-alike behavior or infinite surfaces.  
     *  Variant types [int] and [float] are supported. If any of the arguments is [float] this function returns a [float], otherwise it returns an [int].  
     *    
     */
    static function wrap(value: any, min: any, max: any): any
    
    /** Wraps the integer [param value] between [param min] and [param max]. Can be used for creating loop-alike behavior or infinite surfaces.  
     *    
     *    
     */
    static function wrapi(value: int64, min: int64, max: int64): int64
    
    /** Wraps the float [param value] between [param min] and [param max]. Can be used for creating loop-alike behavior or infinite surfaces.  
     *    
     *    
     *    
     *      
     *  **Note:** If [param min] is `0`, this is equivalent to [method fposmod], so prefer using that instead.  
     *  [method wrapf] is more flexible than using the [method fposmod] approach by giving the user control over the minimum value.  
     */
    static function wrapf(value: float64, min: float64, max: float64): float64
    
    /** Returns the maximum of the given numeric values. This function can take any number of arguments.  
     *    
     *      
     *  **Note:** When using this on vectors it will  *not*  perform component-wise maximum, and will pick the largest value when compared using `x < y`. To perform component-wise maximum, use [method Vector2.max], [method Vector2i.max], [method Vector3.max], [method Vector3i.max], [method Vector4.max], and [method Vector4i.max].  
     */
    static function max(...vargargs: any[]): any
    
    /** Returns the maximum of two [int] values.  
     *    
     */
    static function maxi(a: int64, b: int64): int64
    
    /** Returns the maximum of two [float] values.  
     *    
     */
    static function maxf(a: float64, b: float64): float64
    
    /** Returns the minimum of the given numeric values. This function can take any number of arguments.  
     *    
     *      
     *  **Note:** When using this on vectors it will  *not*  perform component-wise minimum, and will pick the smallest value when compared using `x < y`. To perform component-wise minimum, use [method Vector2.min], [method Vector2i.min], [method Vector3.min], [method Vector3i.min], [method Vector4.min], and [method Vector4i.min].  
     */
    static function min(...vargargs: any[]): any
    
    /** Returns the minimum of two [int] values.  
     *    
     */
    static function mini(a: int64, b: int64): int64
    
    /** Returns the minimum of two [float] values.  
     *    
     */
    static function minf(a: float64, b: float64): float64
    
    /** Clamps the [param value], returning a [Variant] not less than [param min] and not more than [param max]. Any values that can be compared with the less than and greater than operators will work.  
     *    
     *      
     *  **Note:** For better type safety, use [method clampf], [method clampi], [method Vector2.clamp], [method Vector2i.clamp], [method Vector3.clamp], [method Vector3i.clamp], [method Vector4.clamp], [method Vector4i.clamp], or [method Color.clamp] (not currently supported by this method).  
     *      
     *  **Note:** When using this on vectors it will  *not*  perform component-wise clamping, and will pick [param min] if `value < min` or [param max] if `value > max`. To perform component-wise clamping use the methods listed above.  
     */
    static function clamp(value: any, min: any, max: any): any
    
    /** Clamps the [param value], returning an [int] not less than [param min] and not more than [param max].  
     *    
     */
    static function clampi(value: int64, min: int64, max: int64): int64
    
    /** Clamps the [param value], returning a [float] not less than [param min] and not more than [param max].  
     *    
     */
    static function clampf(value: float64, min: float64, max: float64): float64
    
    /** Returns the smallest integer power of 2 that is greater than or equal to [param value].  
     *    
     *  **Warning:** Due to its implementation, this method returns `0` rather than `1` for values less than or equal to `0`, with an exception for [param value] being the smallest negative 64-bit integer (`-9223372036854775808`) in which case the [param value] is returned unchanged.  
     */
    static function nearest_po2(value: int64): int64
    
    /** Wraps [param value] between `0` and the [param length]. If the limit is reached, the next value the function returns is decreased to the `0` side or increased to the [param length] side (like a triangle wave). If [param length] is less than zero, it becomes positive.  
     *    
     */
    static function pingpong(value: float64, length: float64): float64
    
    /** Randomizes the seed (or the internal state) of the random number generator. The current implementation uses a number based on the device's time.  
     *      
     *  **Note:** This function is called automatically when the project is run. If you need to fix the seed to have consistent, reproducible results, use [method seed] to initialize the random number generator.  
     */
    static function randomize(): void
    
    /** Returns a random unsigned 32-bit integer. Use remainder to obtain a random value in the interval `[0, N - 1]` (where N is smaller than 2^32).  
     *    
     */
    static function randi(): int64
    
    /** Returns a random floating-point value between `0.0` and `1.0` (inclusive).  
     *    
     */
    static function randf(): float64
    
    /** Returns a random signed 32-bit integer between [param from] and [param to] (inclusive). If [param to] is lesser than [param from], they are swapped.  
     *    
     */
    static function randi_range(from: int64, to: int64): int64
    
    /** Returns a random floating-point value between [param from] and [param to] (inclusive).  
     *    
     */
    static function randf_range(from: float64, to: float64): float64
    
    /** Returns a [url=https://en.wikipedia.org/wiki/Normal_distribution]normally-distributed[/url], pseudo-random floating-point value from the specified [param mean] and a standard [param deviation]. This is also known as a Gaussian distribution.  
     *      
     *  **Note:** This method uses the [url=https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform]Box-Muller transform[/url] algorithm.  
     */
    static function randfn(mean: float64, deviation: float64): float64
    
    /** Sets the seed for the random number generator to [param base]. Setting the seed manually can ensure consistent, repeatable results for most random functions.  
     *    
     */
    static function seed(base: int64): void
    
    /** Given a [param seed], returns a [PackedInt64Array] of size `2`, where its first element is the randomized [int] value, and the second element is the same as [param seed]. Passing the same [param seed] consistently returns the same array.  
     *      
     *  **Note:** "Seed" here refers to the internal state of the pseudo random number generator, currently implemented as a 64 bit integer.  
     *    
     */
    static function rand_from_seed(seed: int64): PackedInt64Array
    
    /** Returns a [WeakRef] instance holding a weak reference to [param obj]. Returns an empty [WeakRef] instance if [param obj] is `null`. Prints an error and returns `null` if [param obj] is neither [Object]-derived nor `null`.  
     *  A weak reference to an object is not enough to keep the object alive: when the only remaining references to a referent are weak references, garbage collection is free to destroy the referent and reuse its memory for something else. However, until the object is actually destroyed the weak reference may return the object even if there are no strong references to it.  
     */
    static function weakref(obj: any): any
    
    /** Returns the internal type of the given [param variable], using the [enum Variant.Type] values.  
     *    
     *  See also [method type_string].  
     */
    // [INVALID_NAME]: static function typeof(variable: any): int64
    
    /** Converts the given [param variant] to the given [param type], using the [enum Variant.Type] values. This method is generous with how it handles types, it can automatically convert between array types, convert numeric [String]s to [int], and converting most things to [String].  
     *  If the type conversion cannot be done, this method will return the default value for that type, for example converting [Rect2] to [Vector2] will always return [constant Vector2.ZERO]. This method will never show error messages as long as [param type] is a valid Variant type.  
     *  The returned value is a [Variant], but the data inside and its type will be the same as the requested type.  
     *    
     */
    static function type_convert(variant: any, type: int64): any
    
    /** Converts one or more arguments of any [Variant] type to a [String] in the best way possible.  
     *    
     */
    static function str(...vargargs: any[]): string
    
    /** Returns a human-readable name for the given [enum Error] code.  
     *    
     */
    static function error_string(error: int64): string
    
    /** Returns a human-readable name of the given [param type], using the [enum Variant.Type] values.  
     *    
     *  See also [method typeof].  
     */
    static function type_string(type: int64): string
    
    /** Converts one or more arguments of any type to string in the best way possible and prints them to the console.  
     *    
     *      
     *  **Note:** Consider using [method push_error] and [method push_warning] to print error and warning messages instead of [method print] or [method print_rich]. This distinguishes them from print messages used for debugging purposes, while also displaying a stack trace when an error or warning is printed. See also [member Engine.print_to_stdout] and [member ProjectSettings.application/run/disable_stdout].  
     */
    static function print(...vargargs: any[]): void
    
    /** Converts one or more arguments of any type to string in the best way possible and prints them to the console.  
     *  The following BBCode tags are supported: `b`, `i`, `u`, `s`, `indent`, `code`, `url`, `center`, `right`, `color`, `bgcolor`, `fgcolor`.  
     *  URL tags only support URLs wrapped by a URL tag, not URLs with a different title.  
     *  When printing to standard output, the supported subset of BBCode is converted to ANSI escape codes for the terminal emulator to display. Support for ANSI escape codes varies across terminal emulators, especially for italic and strikethrough. In standard output, `code` is represented with faint text but without any font change. Unsupported tags are left as-is in standard output.  
     *    
     *      
     *  **Note:** Consider using [method push_error] and [method push_warning] to print error and warning messages instead of [method print] or [method print_rich]. This distinguishes them from print messages used for debugging purposes, while also displaying a stack trace when an error or warning is printed.  
     *      
     *  **Note:** On Windows, only Windows 10 and later correctly displays ANSI escape codes in standard output.  
     *      
     *  **Note:** Output displayed in the editor supports clickable [code skip-lint][url=address]text[/url]` tags. The [code skip-lint][url]` tag's `address` value is handled by [method OS.shell_open] when clicked.  
     */
    static function print_rich(...vargargs: any[]): void
    
    /** Prints one or more arguments to strings in the best way possible to standard error line.  
     *    
     */
    static function printerr(...vargargs: any[]): void
    
    /** Prints one or more arguments to the console with a tab between each argument.  
     *    
     */
    static function printt(...vargargs: any[]): void
    
    /** Prints one or more arguments to the console with a space between each argument.  
     *    
     */
    static function prints(...vargargs: any[]): void
    
    /** Prints one or more arguments to strings in the best way possible to the OS terminal. Unlike [method print], no newline is automatically added at the end.  
     *      
     *  **Note:** The OS terminal is  *not*  the same as the editor's Output dock. The output sent to the OS terminal can be seen when running Godot from a terminal. On Windows, this requires using the `console.exe` executable.  
     *    
     */
    static function printraw(...vargargs: any[]): void
    
    /** If verbose mode is enabled ([method OS.is_stdout_verbose] returning `true`), converts one or more arguments of any type to string in the best way possible and prints them to the console. */
    static function print_verbose(...vargargs: any[]): void
    
    /** Pushes an error message to Godot's built-in debugger and to the OS terminal.  
     *    
     *      
     *  **Note:** This function does not pause project execution. To print an error message and pause project execution in debug builds, use `assert(false, "test error")` instead.  
     */
    static function push_error(...vargargs: any[]): void
    
    /** Pushes a warning message to Godot's built-in debugger and to the OS terminal.  
     *    
     */
    static function push_warning(...vargargs: any[]): void
    
    /** Converts a [Variant] [param variable] to a formatted [String] that can then be parsed using [method str_to_var].  
     *    
     *  Prints:  
     *  [codeblock lang=text]  
     *  {  
     *      "a": 1,  
     *      "b": 2  
     *  }  
     *  [/codeblock]  
     *      
     *  **Note:** Converting [Signal] or [Callable] is not supported and will result in an empty value for these types, regardless of their data.  
     */
    static function var_to_str(variable: any): string
    
    /** Converts a formatted [param string] that was returned by [method var_to_str] to the original [Variant].  
     *    
     */
    static function str_to_var(string_: string): any
    
    /** Encodes a [Variant] value to a byte array, without encoding objects. Deserialization can be done with [method bytes_to_var].  
     *      
     *  **Note:** If you need object serialization, see [method var_to_bytes_with_objects].  
     *      
     *  **Note:** Encoding [Callable] is not supported and will result in an empty value, regardless of the data.  
     */
    static function var_to_bytes(variable: any): PackedByteArray
    
    /** Decodes a byte array back to a [Variant] value, without decoding objects.  
     *      
     *  **Note:** If you need object deserialization, see [method bytes_to_var_with_objects].  
     */
    static function bytes_to_var(bytes: PackedByteArray | byte[] | ArrayBuffer): any
    
    /** Encodes a [Variant] value to a byte array. Encoding objects is allowed (and can potentially include executable code). Deserialization can be done with [method bytes_to_var_with_objects].  
     *      
     *  **Note:** Encoding [Callable] is not supported and will result in an empty value, regardless of the data.  
     */
    static function var_to_bytes_with_objects(variable: any): PackedByteArray
    
    /** Decodes a byte array back to a [Variant] value. Decoding objects is allowed.  
     *  **Warning:** Deserialized object can contain code which gets executed. Do not use this option if the serialized object comes from untrusted sources to avoid potential security threats (remote code execution).  
     */
    static function bytes_to_var_with_objects(bytes: PackedByteArray | byte[] | ArrayBuffer): any
    
    /** Returns the integer hash of the passed [param variable].  
     *    
     */
    static function hash(variable: any): int64
    
    /** Returns the [Object] that corresponds to [param instance_id]. All Objects have a unique instance ID. See also [method Object.get_instance_id].  
     *    
     */
    static function instance_from_id(instance_id: int64): Object
    
    /** Returns `true` if the Object that corresponds to [param id] is a valid object (e.g. has not been deleted from memory). All Objects have a unique instance ID. */
    static function is_instance_id_valid(id: int64): boolean
    
    /** Returns `true` if [param instance] is a valid Object (e.g. has not been deleted from memory). */
    static function is_instance_valid(instance: any): boolean
    
    /** Allocates a unique ID which can be used by the implementation to construct an RID. This is used mainly from native extensions to implement servers. */
    static function rid_allocate_id(): int64
    
    /** Creates an RID from a [param base]. This is used mainly from native extensions to build servers. */
    static function rid_from_int64(base: int64): RID
    
    /** Returns `true`, for value types, if [param a] and [param b] share the same value. Returns `true`, for reference types, if the references of [param a] and [param b] are the same.  
     *    
     *  These are [Variant] value types: `null`, [bool], [int], [float], [String], [StringName], [Vector2], [Vector2i], [Vector3], [Vector3i], [Vector4], [Vector4i], [Rect2], [Rect2i], [Transform2D], [Transform3D], [Plane], [Quaternion], [AABB], [Basis], [Projection], [Color], [NodePath], [RID], [Callable] and [Signal].  
     *  These are [Variant] reference types: [Object], [Dictionary], [Array], [PackedByteArray], [PackedInt32Array], [PackedInt64Array], [PackedFloat32Array], [PackedFloat64Array], [PackedStringArray], [PackedVector2Array], [PackedVector3Array], [PackedVector4Array], and [PackedColorArray].  
     */
    static function is_same(a: any, b: any): boolean
    
    /** shorthand for getting project settings */
    function GLOBAL_GET(entry_path: StringName): any
    
    /** shorthand for getting editor settings  
     *  NOTE: calling before EditorSettings created will cause null reference exception.  
     */
    function EDITOR_GET(entry_path: StringName): any
}
