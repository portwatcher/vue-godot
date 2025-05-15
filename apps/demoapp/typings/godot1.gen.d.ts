// AUTO-GENERATED
/// <reference no-default-lib="true"/>
declare module "godot" {
    // _singleton_class_: PhysicsServer3D
    namespace PhysicsServer3D {
        enum JointType {
            /** The [Joint3D] is a [PinJoint3D]. */
            JOINT_TYPE_PIN = 0,
            
            /** The [Joint3D] is a [HingeJoint3D]. */
            JOINT_TYPE_HINGE = 1,
            
            /** The [Joint3D] is a [SliderJoint3D]. */
            JOINT_TYPE_SLIDER = 2,
            
            /** The [Joint3D] is a [ConeTwistJoint3D]. */
            JOINT_TYPE_CONE_TWIST = 3,
            
            /** The [Joint3D] is a [Generic6DOFJoint3D]. */
            JOINT_TYPE_6DOF = 4,
            
            /** Represents the size of the [enum JointType] enum. */
            JOINT_TYPE_MAX = 5,
        }
        enum PinJointParam {
            /** The strength with which the pinned objects try to stay in positional relation to each other.  
             *  The higher, the stronger.  
             */
            PIN_JOINT_BIAS = 0,
            
            /** The strength with which the pinned objects try to stay in velocity relation to each other.  
             *  The higher, the stronger.  
             */
            PIN_JOINT_DAMPING = 1,
            
            /** If above 0, this value is the maximum value for an impulse that this Joint3D puts on its ends. */
            PIN_JOINT_IMPULSE_CLAMP = 2,
        }
        enum HingeJointParam {
            /** The speed with which the two bodies get pulled together when they move in different directions. */
            HINGE_JOINT_BIAS = 0,
            
            /** The maximum rotation across the Hinge. */
            HINGE_JOINT_LIMIT_UPPER = 1,
            
            /** The minimum rotation across the Hinge. */
            HINGE_JOINT_LIMIT_LOWER = 2,
            
            /** The speed with which the rotation across the axis perpendicular to the hinge gets corrected. */
            HINGE_JOINT_LIMIT_BIAS = 3,
            HINGE_JOINT_LIMIT_SOFTNESS = 4,
            
            /** The lower this value, the more the rotation gets slowed down. */
            HINGE_JOINT_LIMIT_RELAXATION = 5,
            
            /** Target speed for the motor. */
            HINGE_JOINT_MOTOR_TARGET_VELOCITY = 6,
            
            /** Maximum acceleration for the motor. */
            HINGE_JOINT_MOTOR_MAX_IMPULSE = 7,
        }
        enum HingeJointFlag {
            /** If `true`, the Hinge has a maximum and a minimum rotation. */
            HINGE_JOINT_FLAG_USE_LIMIT = 0,
            
            /** If `true`, a motor turns the Hinge. */
            HINGE_JOINT_FLAG_ENABLE_MOTOR = 1,
        }
        enum SliderJointParam {
            /** The maximum difference between the pivot points on their X axis before damping happens. */
            SLIDER_JOINT_LINEAR_LIMIT_UPPER = 0,
            
            /** The minimum difference between the pivot points on their X axis before damping happens. */
            SLIDER_JOINT_LINEAR_LIMIT_LOWER = 1,
            
            /** A factor applied to the movement across the slider axis once the limits get surpassed. The lower, the slower the movement. */
            SLIDER_JOINT_LINEAR_LIMIT_SOFTNESS = 2,
            
            /** The amount of restitution once the limits are surpassed. The lower, the more velocity-energy gets lost. */
            SLIDER_JOINT_LINEAR_LIMIT_RESTITUTION = 3,
            
            /** The amount of damping once the slider limits are surpassed. */
            SLIDER_JOINT_LINEAR_LIMIT_DAMPING = 4,
            
            /** A factor applied to the movement across the slider axis as long as the slider is in the limits. The lower, the slower the movement. */
            SLIDER_JOINT_LINEAR_MOTION_SOFTNESS = 5,
            
            /** The amount of restitution inside the slider limits. */
            SLIDER_JOINT_LINEAR_MOTION_RESTITUTION = 6,
            
            /** The amount of damping inside the slider limits. */
            SLIDER_JOINT_LINEAR_MOTION_DAMPING = 7,
            
            /** A factor applied to the movement across axes orthogonal to the slider. */
            SLIDER_JOINT_LINEAR_ORTHOGONAL_SOFTNESS = 8,
            
            /** The amount of restitution when movement is across axes orthogonal to the slider. */
            SLIDER_JOINT_LINEAR_ORTHOGONAL_RESTITUTION = 9,
            
            /** The amount of damping when movement is across axes orthogonal to the slider. */
            SLIDER_JOINT_LINEAR_ORTHOGONAL_DAMPING = 10,
            
            /** The upper limit of rotation in the slider. */
            SLIDER_JOINT_ANGULAR_LIMIT_UPPER = 11,
            
            /** The lower limit of rotation in the slider. */
            SLIDER_JOINT_ANGULAR_LIMIT_LOWER = 12,
            
            /** A factor applied to the all rotation once the limit is surpassed. */
            SLIDER_JOINT_ANGULAR_LIMIT_SOFTNESS = 13,
            
            /** The amount of restitution of the rotation when the limit is surpassed. */
            SLIDER_JOINT_ANGULAR_LIMIT_RESTITUTION = 14,
            
            /** The amount of damping of the rotation when the limit is surpassed. */
            SLIDER_JOINT_ANGULAR_LIMIT_DAMPING = 15,
            
            /** A factor that gets applied to the all rotation in the limits. */
            SLIDER_JOINT_ANGULAR_MOTION_SOFTNESS = 16,
            
            /** The amount of restitution of the rotation in the limits. */
            SLIDER_JOINT_ANGULAR_MOTION_RESTITUTION = 17,
            
            /** The amount of damping of the rotation in the limits. */
            SLIDER_JOINT_ANGULAR_MOTION_DAMPING = 18,
            
            /** A factor that gets applied to the all rotation across axes orthogonal to the slider. */
            SLIDER_JOINT_ANGULAR_ORTHOGONAL_SOFTNESS = 19,
            
            /** The amount of restitution of the rotation across axes orthogonal to the slider. */
            SLIDER_JOINT_ANGULAR_ORTHOGONAL_RESTITUTION = 20,
            
            /** The amount of damping of the rotation across axes orthogonal to the slider. */
            SLIDER_JOINT_ANGULAR_ORTHOGONAL_DAMPING = 21,
            
            /** Represents the size of the [enum SliderJointParam] enum. */
            SLIDER_JOINT_MAX = 22,
        }
        enum ConeTwistJointParam {
            /** Swing is rotation from side to side, around the axis perpendicular to the twist axis.  
             *  The swing span defines, how much rotation will not get corrected along the swing axis.  
             *  Could be defined as looseness in the [ConeTwistJoint3D].  
             *  If below 0.05, this behavior is locked.  
             */
            CONE_TWIST_JOINT_SWING_SPAN = 0,
            
            /** Twist is the rotation around the twist axis, this value defined how far the joint can twist.  
             *  Twist is locked if below 0.05.  
             */
            CONE_TWIST_JOINT_TWIST_SPAN = 1,
            
            /** The speed with which the swing or twist will take place.  
             *  The higher, the faster.  
             */
            CONE_TWIST_JOINT_BIAS = 2,
            
            /** The ease with which the Joint3D twists, if it's too low, it takes more force to twist the joint. */
            CONE_TWIST_JOINT_SOFTNESS = 3,
            
            /** Defines, how fast the swing- and twist-speed-difference on both sides gets synced. */
            CONE_TWIST_JOINT_RELAXATION = 4,
        }
        enum G6DOFJointAxisParam {
            /** The minimum difference between the pivot points' axes. */
            G6DOF_JOINT_LINEAR_LOWER_LIMIT = 0,
            
            /** The maximum difference between the pivot points' axes. */
            G6DOF_JOINT_LINEAR_UPPER_LIMIT = 1,
            
            /** A factor that gets applied to the movement across the axes. The lower, the slower the movement. */
            G6DOF_JOINT_LINEAR_LIMIT_SOFTNESS = 2,
            
            /** The amount of restitution on the axes movement. The lower, the more velocity-energy gets lost. */
            G6DOF_JOINT_LINEAR_RESTITUTION = 3,
            
            /** The amount of damping that happens at the linear motion across the axes. */
            G6DOF_JOINT_LINEAR_DAMPING = 4,
            
            /** The velocity that the joint's linear motor will attempt to reach. */
            G6DOF_JOINT_LINEAR_MOTOR_TARGET_VELOCITY = 5,
            
            /** The maximum force that the linear motor can apply while trying to reach the target velocity. */
            G6DOF_JOINT_LINEAR_MOTOR_FORCE_LIMIT = 6,
            G6DOF_JOINT_LINEAR_SPRING_STIFFNESS = 7,
            G6DOF_JOINT_LINEAR_SPRING_DAMPING = 8,
            G6DOF_JOINT_LINEAR_SPRING_EQUILIBRIUM_POINT = 9,
            
            /** The minimum rotation in negative direction to break loose and rotate around the axes. */
            G6DOF_JOINT_ANGULAR_LOWER_LIMIT = 10,
            
            /** The minimum rotation in positive direction to break loose and rotate around the axes. */
            G6DOF_JOINT_ANGULAR_UPPER_LIMIT = 11,
            
            /** A factor that gets multiplied onto all rotations across the axes. */
            G6DOF_JOINT_ANGULAR_LIMIT_SOFTNESS = 12,
            
            /** The amount of rotational damping across the axes. The lower, the more damping occurs. */
            G6DOF_JOINT_ANGULAR_DAMPING = 13,
            
            /** The amount of rotational restitution across the axes. The lower, the more restitution occurs. */
            G6DOF_JOINT_ANGULAR_RESTITUTION = 14,
            
            /** The maximum amount of force that can occur, when rotating around the axes. */
            G6DOF_JOINT_ANGULAR_FORCE_LIMIT = 15,
            
            /** When correcting the crossing of limits in rotation across the axes, this error tolerance factor defines how much the correction gets slowed down. The lower, the slower. */
            G6DOF_JOINT_ANGULAR_ERP = 16,
            
            /** Target speed for the motor at the axes. */
            G6DOF_JOINT_ANGULAR_MOTOR_TARGET_VELOCITY = 17,
            
            /** Maximum acceleration for the motor at the axes. */
            G6DOF_JOINT_ANGULAR_MOTOR_FORCE_LIMIT = 18,
            G6DOF_JOINT_ANGULAR_SPRING_STIFFNESS = 19,
            G6DOF_JOINT_ANGULAR_SPRING_DAMPING = 20,
            G6DOF_JOINT_ANGULAR_SPRING_EQUILIBRIUM_POINT = 21,
            
            /** Represents the size of the [enum G6DOFJointAxisParam] enum. */
            G6DOF_JOINT_MAX = 22,
        }
        enum G6DOFJointAxisFlag {
            /** If set, linear motion is possible within the given limits. */
            G6DOF_JOINT_FLAG_ENABLE_LINEAR_LIMIT = 0,
            
            /** If set, rotational motion is possible. */
            G6DOF_JOINT_FLAG_ENABLE_ANGULAR_LIMIT = 1,
            G6DOF_JOINT_FLAG_ENABLE_ANGULAR_SPRING = 2,
            G6DOF_JOINT_FLAG_ENABLE_LINEAR_SPRING = 3,
            
            /** If set, there is a rotational motor across these axes. */
            G6DOF_JOINT_FLAG_ENABLE_MOTOR = 4,
            
            /** If set, there is a linear motor on this axis that targets a specific velocity. */
            G6DOF_JOINT_FLAG_ENABLE_LINEAR_MOTOR = 5,
            
            /** Represents the size of the [enum G6DOFJointAxisFlag] enum. */
            G6DOF_JOINT_FLAG_MAX = 6,
        }
        enum ShapeType {
            /** The [Shape3D] is a [WorldBoundaryShape3D]. */
            SHAPE_WORLD_BOUNDARY = 0,
            
            /** The [Shape3D] is a [SeparationRayShape3D]. */
            SHAPE_SEPARATION_RAY = 1,
            
            /** The [Shape3D] is a [SphereShape3D]. */
            SHAPE_SPHERE = 2,
            
            /** The [Shape3D] is a [BoxShape3D]. */
            SHAPE_BOX = 3,
            
            /** The [Shape3D] is a [CapsuleShape3D]. */
            SHAPE_CAPSULE = 4,
            
            /** The [Shape3D] is a [CylinderShape3D]. */
            SHAPE_CYLINDER = 5,
            
            /** The [Shape3D] is a [ConvexPolygonShape3D]. */
            SHAPE_CONVEX_POLYGON = 6,
            
            /** The [Shape3D] is a [ConcavePolygonShape3D]. */
            SHAPE_CONCAVE_POLYGON = 7,
            
            /** The [Shape3D] is a [HeightMapShape3D]. */
            SHAPE_HEIGHTMAP = 8,
            
            /** The [Shape3D] is used internally for a soft body. Any attempt to create this kind of shape results in an error. */
            SHAPE_SOFT_BODY = 9,
            
            /** This constant is used internally by the engine. Any attempt to create this kind of shape results in an error. */
            SHAPE_CUSTOM = 10,
        }
        enum AreaParameter {
            /** Constant to set/get gravity override mode in an area. See [enum AreaSpaceOverrideMode] for possible values. */
            AREA_PARAM_GRAVITY_OVERRIDE_MODE = 0,
            
            /** Constant to set/get gravity strength in an area. */
            AREA_PARAM_GRAVITY = 1,
            
            /** Constant to set/get gravity vector/center in an area. */
            AREA_PARAM_GRAVITY_VECTOR = 2,
            
            /** Constant to set/get whether the gravity vector of an area is a direction, or a center point. */
            AREA_PARAM_GRAVITY_IS_POINT = 3,
            
            /** Constant to set/get the distance at which the gravity strength is equal to the gravity controlled by [constant AREA_PARAM_GRAVITY]. For example, on a planet 100 meters in radius with a surface gravity of 4.0 m/s², set the gravity to 4.0 and the unit distance to 100.0. The gravity will have falloff according to the inverse square law, so in the example, at 200 meters from the center the gravity will be 1.0 m/s² (twice the distance, 1/4th the gravity), at 50 meters it will be 16.0 m/s² (half the distance, 4x the gravity), and so on.  
             *  The above is true only when the unit distance is a positive number. When this is set to 0.0, the gravity will be constant regardless of distance.  
             */
            AREA_PARAM_GRAVITY_POINT_UNIT_DISTANCE = 4,
            
            /** Constant to set/get linear damping override mode in an area. See [enum AreaSpaceOverrideMode] for possible values. */
            AREA_PARAM_LINEAR_DAMP_OVERRIDE_MODE = 5,
            
            /** Constant to set/get the linear damping factor of an area. */
            AREA_PARAM_LINEAR_DAMP = 6,
            
            /** Constant to set/get angular damping override mode in an area. See [enum AreaSpaceOverrideMode] for possible values. */
            AREA_PARAM_ANGULAR_DAMP_OVERRIDE_MODE = 7,
            
            /** Constant to set/get the angular damping factor of an area. */
            AREA_PARAM_ANGULAR_DAMP = 8,
            
            /** Constant to set/get the priority (order of processing) of an area. */
            AREA_PARAM_PRIORITY = 9,
            
            /** Constant to set/get the magnitude of area-specific wind force. This wind force only applies to [SoftBody3D] nodes. Other physics bodies are currently not affected by wind. */
            AREA_PARAM_WIND_FORCE_MAGNITUDE = 10,
            
            /** Constant to set/get the 3D vector that specifies the origin from which an area-specific wind blows. */
            AREA_PARAM_WIND_SOURCE = 11,
            
            /** Constant to set/get the 3D vector that specifies the direction in which an area-specific wind blows. */
            AREA_PARAM_WIND_DIRECTION = 12,
            
            /** Constant to set/get the exponential rate at which wind force decreases with distance from its origin. */
            AREA_PARAM_WIND_ATTENUATION_FACTOR = 13,
        }
        enum AreaSpaceOverrideMode {
            /** This area does not affect gravity/damp. These are generally areas that exist only to detect collisions, and objects entering or exiting them. */
            AREA_SPACE_OVERRIDE_DISABLED = 0,
            
            /** This area adds its gravity/damp values to whatever has been calculated so far. This way, many overlapping areas can combine their physics to make interesting effects. */
            AREA_SPACE_OVERRIDE_COMBINE = 1,
            
            /** This area adds its gravity/damp values to whatever has been calculated so far. Then stops taking into account the rest of the areas, even the default one. */
            AREA_SPACE_OVERRIDE_COMBINE_REPLACE = 2,
            
            /** This area replaces any gravity/damp, even the default one, and stops taking into account the rest of the areas. */
            AREA_SPACE_OVERRIDE_REPLACE = 3,
            
            /** This area replaces any gravity/damp calculated so far, but keeps calculating the rest of the areas, down to the default one. */
            AREA_SPACE_OVERRIDE_REPLACE_COMBINE = 4,
        }
        enum BodyMode {
            /** Constant for static bodies. In this mode, a body can be only moved by user code and doesn't collide with other bodies along its path when moved. */
            BODY_MODE_STATIC = 0,
            
            /** Constant for kinematic bodies. In this mode, a body can be only moved by user code and collides with other bodies along its path. */
            BODY_MODE_KINEMATIC = 1,
            
            /** Constant for rigid bodies. In this mode, a body can be pushed by other bodies and has forces applied. */
            BODY_MODE_RIGID = 2,
            
            /** Constant for linear rigid bodies. In this mode, a body can not rotate, and only its linear velocity is affected by external forces. */
            BODY_MODE_RIGID_LINEAR = 3,
        }
        enum BodyParameter {
            /** Constant to set/get a body's bounce factor. */
            BODY_PARAM_BOUNCE = 0,
            
            /** Constant to set/get a body's friction. */
            BODY_PARAM_FRICTION = 1,
            
            /** Constant to set/get a body's mass. */
            BODY_PARAM_MASS = 2,
            
            /** Constant to set/get a body's inertia. */
            BODY_PARAM_INERTIA = 3,
            
            /** Constant to set/get a body's center of mass position in the body's local coordinate system. */
            BODY_PARAM_CENTER_OF_MASS = 4,
            
            /** Constant to set/get a body's gravity multiplier. */
            BODY_PARAM_GRAVITY_SCALE = 5,
            
            /** Constant to set/get a body's linear damping mode. See [enum BodyDampMode] for possible values. */
            BODY_PARAM_LINEAR_DAMP_MODE = 6,
            
            /** Constant to set/get a body's angular damping mode. See [enum BodyDampMode] for possible values. */
            BODY_PARAM_ANGULAR_DAMP_MODE = 7,
            
            /** Constant to set/get a body's linear damping factor. */
            BODY_PARAM_LINEAR_DAMP = 8,
            
            /** Constant to set/get a body's angular damping factor. */
            BODY_PARAM_ANGULAR_DAMP = 9,
            
            /** Represents the size of the [enum BodyParameter] enum. */
            BODY_PARAM_MAX = 10,
        }
        enum BodyDampMode {
            /** The body's damping value is added to any value set in areas or the default value. */
            BODY_DAMP_MODE_COMBINE = 0,
            
            /** The body's damping value replaces any value set in areas or the default value. */
            BODY_DAMP_MODE_REPLACE = 1,
        }
        enum BodyState {
            /** Constant to set/get the current transform matrix of the body. */
            BODY_STATE_TRANSFORM = 0,
            
            /** Constant to set/get the current linear velocity of the body. */
            BODY_STATE_LINEAR_VELOCITY = 1,
            
            /** Constant to set/get the current angular velocity of the body. */
            BODY_STATE_ANGULAR_VELOCITY = 2,
            
            /** Constant to sleep/wake up a body, or to get whether it is sleeping. */
            BODY_STATE_SLEEPING = 3,
            
            /** Constant to set/get whether the body can sleep. */
            BODY_STATE_CAN_SLEEP = 4,
        }
        enum AreaBodyStatus {
            /** The value of the first parameter and area callback function receives, when an object enters one of its shapes. */
            AREA_BODY_ADDED = 0,
            
            /** The value of the first parameter and area callback function receives, when an object exits one of its shapes. */
            AREA_BODY_REMOVED = 1,
        }
        enum ProcessInfo {
            /** Constant to get the number of objects that are not sleeping. */
            INFO_ACTIVE_OBJECTS = 0,
            
            /** Constant to get the number of possible collisions. */
            INFO_COLLISION_PAIRS = 1,
            
            /** Constant to get the number of space regions where a collision could occur. */
            INFO_ISLAND_COUNT = 2,
        }
        enum SpaceParameter {
            /** Constant to set/get the maximum distance a pair of bodies has to move before their collision status has to be recalculated. */
            SPACE_PARAM_CONTACT_RECYCLE_RADIUS = 0,
            
            /** Constant to set/get the maximum distance a shape can be from another before they are considered separated and the contact is discarded. */
            SPACE_PARAM_CONTACT_MAX_SEPARATION = 1,
            
            /** Constant to set/get the maximum distance a shape can penetrate another shape before it is considered a collision. */
            SPACE_PARAM_CONTACT_MAX_ALLOWED_PENETRATION = 2,
            
            /** Constant to set/get the default solver bias for all physics contacts. A solver bias is a factor controlling how much two objects "rebound", after overlapping, to avoid leaving them in that state because of numerical imprecision. */
            SPACE_PARAM_CONTACT_DEFAULT_BIAS = 3,
            
            /** Constant to set/get the threshold linear velocity of activity. A body marked as potentially inactive for both linear and angular velocity will be put to sleep after the time given. */
            SPACE_PARAM_BODY_LINEAR_VELOCITY_SLEEP_THRESHOLD = 4,
            
            /** Constant to set/get the threshold angular velocity of activity. A body marked as potentially inactive for both linear and angular velocity will be put to sleep after the time given. */
            SPACE_PARAM_BODY_ANGULAR_VELOCITY_SLEEP_THRESHOLD = 5,
            
            /** Constant to set/get the maximum time of activity. A body marked as potentially inactive for both linear and angular velocity will be put to sleep after this time. */
            SPACE_PARAM_BODY_TIME_TO_SLEEP = 6,
            
            /** Constant to set/get the number of solver iterations for contacts and constraints. The greater the number of iterations, the more accurate the collisions and constraints will be. However, a greater number of iterations requires more CPU power, which can decrease performance. */
            SPACE_PARAM_SOLVER_ITERATIONS = 7,
        }
        enum BodyAxis {
            BODY_AXIS_LINEAR_X = 1,
            BODY_AXIS_LINEAR_Y = 2,
            BODY_AXIS_LINEAR_Z = 4,
            BODY_AXIS_ANGULAR_X = 8,
            BODY_AXIS_ANGULAR_Y = 16,
            BODY_AXIS_ANGULAR_Z = 32,
        }
    }
    /** A server interface for low-level 3D physics access.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_physicsserver3d.html  
     */
    class PhysicsServer3D extends Object {
        static world_boundary_shape_create(): RID
        static separation_ray_shape_create(): RID
        static sphere_shape_create(): RID
        static box_shape_create(): RID
        static capsule_shape_create(): RID
        static cylinder_shape_create(): RID
        static convex_polygon_shape_create(): RID
        static concave_polygon_shape_create(): RID
        static heightmap_shape_create(): RID
        static custom_shape_create(): RID
        
        /** Sets the shape data that defines its shape and size. The data to be passed depends on the kind of shape created [method shape_get_type]. */
        static shape_set_data(shape: RID, data: any): void
        
        /** Sets the collision margin for the shape.  
         *      
         *  **Note:** This is not used in Godot Physics.  
         */
        static shape_set_margin(shape: RID, margin: float64): void
        
        /** Returns the type of shape (see [enum ShapeType] constants). */
        static shape_get_type(shape: RID): PhysicsServer3D.ShapeType
        
        /** Returns the shape data. */
        static shape_get_data(shape: RID): any
        
        /** Returns the collision margin for the shape.  
         *      
         *  **Note:** This is not used in Godot Physics, so will always return `0`.  
         */
        static shape_get_margin(shape: RID): float64
        
        /** Creates a space. A space is a collection of parameters for the physics engine that can be assigned to an area or a body. It can be assigned to an area with [method area_set_space], or to a body with [method body_set_space]. */
        static space_create(): RID
        
        /** Marks a space as active. It will not have an effect, unless it is assigned to an area or body. */
        static space_set_active(space: RID, active: boolean): void
        
        /** Returns whether the space is active. */
        static space_is_active(space: RID): boolean
        
        /** Sets the value for a space parameter. A list of available parameters is on the [enum SpaceParameter] constants. */
        static space_set_param(space: RID, param: PhysicsServer3D.SpaceParameter, value: float64): void
        
        /** Returns the value of a space parameter. */
        static space_get_param(space: RID, param: PhysicsServer3D.SpaceParameter): float64
        
        /** Returns the state of a space, a [PhysicsDirectSpaceState3D]. This object can be used to make collision/intersection queries. */
        static space_get_direct_state(space: RID): PhysicsDirectSpaceState3D
        
        /** Creates a 3D area object in the physics server, and returns the [RID] that identifies it. The default settings for the created area include a collision layer and mask set to `1`, and `monitorable` set to `false`.  
         *  Use [method area_add_shape] to add shapes to it, use [method area_set_transform] to set its transform, and use [method area_set_space] to add the area to a space. If you want the area to be detectable use [method area_set_monitorable].  
         */
        static area_create(): RID
        
        /** Assigns a space to the area. */
        static area_set_space(area: RID, space: RID): void
        
        /** Returns the space assigned to the area. */
        static area_get_space(area: RID): RID
        
        /** Adds a shape to the area, along with a transform matrix. Shapes are usually referenced by their index, so you should track which shape has a given index. */
        static area_add_shape(area: RID, shape: RID, transform: Transform3D = new Transform3D(), disabled: boolean = false): void
        
        /** Substitutes a given area shape by another. The old shape is selected by its index, the new one by its [RID]. */
        static area_set_shape(area: RID, shape_idx: int64, shape: RID): void
        
        /** Sets the transform matrix for an area shape. */
        static area_set_shape_transform(area: RID, shape_idx: int64, transform: Transform3D): void
        static area_set_shape_disabled(area: RID, shape_idx: int64, disabled: boolean): void
        
        /** Returns the number of shapes assigned to an area. */
        static area_get_shape_count(area: RID): int64
        
        /** Returns the [RID] of the nth shape of an area. */
        static area_get_shape(area: RID, shape_idx: int64): RID
        
        /** Returns the transform matrix of a shape within an area. */
        static area_get_shape_transform(area: RID, shape_idx: int64): Transform3D
        
        /** Removes a shape from an area. It does not delete the shape, so it can be reassigned later. */
        static area_remove_shape(area: RID, shape_idx: int64): void
        
        /** Removes all shapes from an area. It does not delete the shapes, so they can be reassigned later. */
        static area_clear_shapes(area: RID): void
        
        /** Assigns the area to one or many physics layers. */
        static area_set_collision_layer(area: RID, layer: int64): void
        
        /** Returns the physics layer or layers an area belongs to. */
        static area_get_collision_layer(area: RID): int64
        
        /** Sets which physics layers the area will monitor. */
        static area_set_collision_mask(area: RID, mask: int64): void
        
        /** Returns the physics layer or layers an area can contact with. */
        static area_get_collision_mask(area: RID): int64
        
        /** Sets the value for an area parameter. A list of available parameters is on the [enum AreaParameter] constants. */
        static area_set_param(area: RID, param: PhysicsServer3D.AreaParameter, value: any): void
        
        /** Sets the transform matrix for an area. */
        static area_set_transform(area: RID, transform: Transform3D): void
        
        /** Returns an area parameter value. A list of available parameters is on the [enum AreaParameter] constants. */
        static area_get_param(area: RID, param: PhysicsServer3D.AreaParameter): any
        
        /** Returns the transform matrix for an area. */
        static area_get_transform(area: RID): Transform3D
        
        /** Assigns the area to a descendant of [Object], so it can exist in the node tree. */
        static area_attach_object_instance_id(area: RID, id: int64): void
        
        /** Gets the instance ID of the object the area is assigned to. */
        static area_get_object_instance_id(area: RID): int64
        
        /** Sets the area's body monitor callback. This callback will be called when any other (shape of a) body enters or exits (a shape of) the given area, and must take the following five parameters:  
         *  1. an integer `status`: either [constant AREA_BODY_ADDED] or [constant AREA_BODY_REMOVED] depending on whether the other body shape entered or exited the area,  
         *  2. an [RID] `body_rid`: the [RID] of the body that entered or exited the area,  
         *  3. an integer `instance_id`: the `ObjectID` attached to the body,  
         *  4. an integer `body_shape_idx`: the index of the shape of the body that entered or exited the area,  
         *  5. an integer `self_shape_idx`: the index of the shape of the area where the body entered or exited.  
         *  By counting (or keeping track of) the shapes that enter and exit, it can be determined if a body (with all its shapes) is entering for the first time or exiting for the last time.  
         */
        static area_set_monitor_callback(area: RID, callback: Callable): void
        
        /** Sets the area's area monitor callback. This callback will be called when any other (shape of an) area enters or exits (a shape of) the given area, and must take the following five parameters:  
         *  1. an integer `status`: either [constant AREA_BODY_ADDED] or [constant AREA_BODY_REMOVED] depending on whether the other area's shape entered or exited the area,  
         *  2. an [RID] `area_rid`: the [RID] of the other area that entered or exited the area,  
         *  3. an integer `instance_id`: the `ObjectID` attached to the other area,  
         *  4. an integer `area_shape_idx`: the index of the shape of the other area that entered or exited the area,  
         *  5. an integer `self_shape_idx`: the index of the shape of the area where the other area entered or exited.  
         *  By counting (or keeping track of) the shapes that enter and exit, it can be determined if an area (with all its shapes) is entering for the first time or exiting for the last time.  
         */
        static area_set_area_monitor_callback(area: RID, callback: Callable): void
        static area_set_monitorable(area: RID, monitorable: boolean): void
        
        /** Sets object pickable with rays. */
        static area_set_ray_pickable(area: RID, enable: boolean): void
        
        /** Creates a 3D body object in the physics server, and returns the [RID] that identifies it. The default settings for the created area include a collision layer and mask set to `1`, and body mode set to [constant BODY_MODE_RIGID].  
         *  Use [method body_add_shape] to add shapes to it, use [method body_set_state] to set its transform, and use [method body_set_space] to add the body to a space.  
         */
        static body_create(): RID
        
        /** Assigns a space to the body (see [method space_create]). */
        static body_set_space(body: RID, space: RID): void
        
        /** Returns the [RID] of the space assigned to a body. */
        static body_get_space(body: RID): RID
        
        /** Sets the body mode, from one of the [enum BodyMode] constants. */
        static body_set_mode(body: RID, mode: PhysicsServer3D.BodyMode): void
        
        /** Returns the body mode. */
        static body_get_mode(body: RID): PhysicsServer3D.BodyMode
        
        /** Sets the physics layer or layers a body belongs to. */
        static body_set_collision_layer(body: RID, layer: int64): void
        
        /** Returns the physics layer or layers a body belongs to. */
        static body_get_collision_layer(body: RID): int64
        
        /** Sets the physics layer or layers a body can collide with. */
        static body_set_collision_mask(body: RID, mask: int64): void
        
        /** Returns the physics layer or layers a body can collide with. */
        static body_get_collision_mask(body: RID): int64
        
        /** Sets the body's collision priority. */
        static body_set_collision_priority(body: RID, priority: float64): void
        
        /** Returns the body's collision priority. */
        static body_get_collision_priority(body: RID): float64
        
        /** Adds a shape to the body, along with a transform matrix. Shapes are usually referenced by their index, so you should track which shape has a given index. */
        static body_add_shape(body: RID, shape: RID, transform: Transform3D = new Transform3D(), disabled: boolean = false): void
        
        /** Substitutes a given body shape by another. The old shape is selected by its index, the new one by its [RID]. */
        static body_set_shape(body: RID, shape_idx: int64, shape: RID): void
        
        /** Sets the transform matrix for a body shape. */
        static body_set_shape_transform(body: RID, shape_idx: int64, transform: Transform3D): void
        static body_set_shape_disabled(body: RID, shape_idx: int64, disabled: boolean): void
        
        /** Returns the number of shapes assigned to a body. */
        static body_get_shape_count(body: RID): int64
        
        /** Returns the [RID] of the nth shape of a body. */
        static body_get_shape(body: RID, shape_idx: int64): RID
        
        /** Returns the transform matrix of a body shape. */
        static body_get_shape_transform(body: RID, shape_idx: int64): Transform3D
        
        /** Removes a shape from a body. The shape is not deleted, so it can be reused afterwards. */
        static body_remove_shape(body: RID, shape_idx: int64): void
        
        /** Removes all shapes from a body. */
        static body_clear_shapes(body: RID): void
        
        /** Assigns the area to a descendant of [Object], so it can exist in the node tree. */
        static body_attach_object_instance_id(body: RID, id: int64): void
        
        /** Gets the instance ID of the object the area is assigned to. */
        static body_get_object_instance_id(body: RID): int64
        
        /** If `true`, the continuous collision detection mode is enabled.  
         *  Continuous collision detection tries to predict where a moving body will collide, instead of moving it and correcting its movement if it collided.  
         */
        static body_set_enable_continuous_collision_detection(body: RID, enable: boolean): void
        
        /** If `true`, the continuous collision detection mode is enabled. */
        static body_is_continuous_collision_detection_enabled(body: RID): boolean
        
        /** Sets a body parameter. A list of available parameters is on the [enum BodyParameter] constants. */
        static body_set_param(body: RID, param: PhysicsServer3D.BodyParameter, value: any): void
        
        /** Returns the value of a body parameter. A list of available parameters is on the [enum BodyParameter] constants. */
        static body_get_param(body: RID, param: PhysicsServer3D.BodyParameter): any
        
        /** Restores the default inertia and center of mass based on shapes to cancel any custom values previously set using [method body_set_param]. */
        static body_reset_mass_properties(body: RID): void
        
        /** Sets a body state (see [enum BodyState] constants). */
        static body_set_state(body: RID, state: PhysicsServer3D.BodyState, value: any): void
        
        /** Returns a body state. */
        static body_get_state(body: RID, state: PhysicsServer3D.BodyState): any
        
        /** Applies a directional impulse without affecting rotation.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  This is equivalent to using [method body_apply_impulse] at the body's center of mass.  
         */
        static body_apply_central_impulse(body: RID, impulse: Vector3): void
        
        /** Applies a positioned impulse to the body.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        static body_apply_impulse(body: RID, impulse: Vector3, position: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Applies a rotational impulse to the body without affecting the position.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         */
        static body_apply_torque_impulse(body: RID, impulse: Vector3): void
        
        /** Applies a directional force without affecting rotation. A force is time dependent and meant to be applied every physics update.  
         *  This is equivalent to using [method body_apply_force] at the body's center of mass.  
         */
        static body_apply_central_force(body: RID, force: Vector3): void
        
        /** Applies a positioned force to the body. A force is time dependent and meant to be applied every physics update.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        static body_apply_force(body: RID, force: Vector3, position: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Applies a rotational force without affecting position. A force is time dependent and meant to be applied every physics update. */
        static body_apply_torque(body: RID, torque: Vector3): void
        
        /** Adds a constant directional force without affecting rotation that keeps being applied over time until cleared with `body_set_constant_force(body, Vector3(0, 0, 0))`.  
         *  This is equivalent to using [method body_add_constant_force] at the body's center of mass.  
         */
        static body_add_constant_central_force(body: RID, force: Vector3): void
        
        /** Adds a constant positioned force to the body that keeps being applied over time until cleared with `body_set_constant_force(body, Vector3(0, 0, 0))`.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        static body_add_constant_force(body: RID, force: Vector3, position: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Adds a constant rotational force without affecting position that keeps being applied over time until cleared with `body_set_constant_torque(body, Vector3(0, 0, 0))`. */
        static body_add_constant_torque(body: RID, torque: Vector3): void
        
        /** Sets the body's total constant positional forces applied during each physics update.  
         *  See [method body_add_constant_force] and [method body_add_constant_central_force].  
         */
        static body_set_constant_force(body: RID, force: Vector3): void
        
        /** Returns the body's total constant positional forces applied during each physics update.  
         *  See [method body_add_constant_force] and [method body_add_constant_central_force].  
         */
        static body_get_constant_force(body: RID): Vector3
        
        /** Sets the body's total constant rotational forces applied during each physics update.  
         *  See [method body_add_constant_torque].  
         */
        static body_set_constant_torque(body: RID, torque: Vector3): void
        
        /** Returns the body's total constant rotational forces applied during each physics update.  
         *  See [method body_add_constant_torque].  
         */
        static body_get_constant_torque(body: RID): Vector3
        
        /** Sets an axis velocity. The velocity in the given vector axis will be set as the given vector length. This is useful for jumping behavior. */
        static body_set_axis_velocity(body: RID, axis_velocity: Vector3): void
        static body_set_axis_lock(body: RID, axis: PhysicsServer3D.BodyAxis, lock: boolean): void
        static body_is_axis_locked(body: RID, axis: PhysicsServer3D.BodyAxis): boolean
        
        /** Adds a body to the list of bodies exempt from collisions. */
        static body_add_collision_exception(body: RID, excepted_body: RID): void
        
        /** Removes a body from the list of bodies exempt from collisions.  
         *  Continuous collision detection tries to predict where a moving body will collide, instead of moving it and correcting its movement if it collided.  
         */
        static body_remove_collision_exception(body: RID, excepted_body: RID): void
        
        /** Sets the maximum contacts to report. Bodies can keep a log of the contacts with other bodies. This is enabled by setting the maximum number of contacts reported to a number greater than 0. */
        static body_set_max_contacts_reported(body: RID, amount: int64): void
        
        /** Returns the maximum contacts that can be reported. See [method body_set_max_contacts_reported]. */
        static body_get_max_contacts_reported(body: RID): int64
        
        /** Sets whether the body omits the standard force integration. If [param enable] is `true`, the body will not automatically use applied forces, torques, and damping to update the body's linear and angular velocity. In this case, [method body_set_force_integration_callback] can be used to manually update the linear and angular velocity instead.  
         *  This method is called when the property [member RigidBody3D.custom_integrator] is set.  
         */
        static body_set_omit_force_integration(body: RID, enable: boolean): void
        
        /** Returns `true` if the body is omitting the standard force integration. See [method body_set_omit_force_integration]. */
        static body_is_omitting_force_integration(body: RID): boolean
        
        /** Sets the body's state synchronization callback function to [param callable]. Use an empty [Callable] ([code skip-lint]Callable()`) to clear the callback.  
         *  The function [param callable] will be called every physics frame, assuming that the body was active during the previous physics tick, and can be used to fetch the latest state from the physics server.  
         *  The function [param callable] must take the following parameters:  
         *  1. `state`: a [PhysicsDirectBodyState3D], used to retrieve the body's state.  
         */
        static body_set_state_sync_callback(body: RID, callable: Callable): void
        
        /** Sets the body's custom force integration callback function to [param callable]. Use an empty [Callable] ([code skip-lint]Callable()`) to clear the custom callback.  
         *  The function [param callable] will be called every physics tick, before the standard force integration (see [method body_set_omit_force_integration]). It can be used for example to update the body's linear and angular velocity based on contact with other bodies.  
         *  If [param userdata] is not `null`, the function [param callable] must take the following two parameters:  
         *  1. `state`: a [PhysicsDirectBodyState3D], used to retrieve and modify the body's state,  
         *  2. [code skip-lint]userdata`: a [Variant]; its value will be the [param userdata] passed into this method.  
         *  If [param userdata] is `null`, then [param callable] must take only the `state` parameter.  
         */
        static body_set_force_integration_callback(body: RID, callable: Callable, userdata: any = <any> {}): void
        
        /** Sets the body pickable with rays if [param enable] is set. */
        static body_set_ray_pickable(body: RID, enable: boolean): void
        
        /** Returns `true` if a collision would result from moving along a motion vector from a given point in space. [PhysicsTestMotionParameters3D] is passed to set motion parameters. [PhysicsTestMotionResult3D] can be passed to return additional information. */
        static body_test_motion(body: RID, parameters: PhysicsTestMotionParameters3D, result: PhysicsTestMotionResult3D = undefined): boolean
        
        /** Returns the [PhysicsDirectBodyState3D] of the body. Returns `null` if the body is destroyed or removed from the physics space. */
        static body_get_direct_state(body: RID): PhysicsDirectBodyState3D
        
        /** Creates a new soft body and returns its internal [RID]. */
        static soft_body_create(): RID
        
        /** Requests that the physics server updates the rendering server with the latest positions of the given soft body's points through the [param rendering_server_handler] interface. */
        static soft_body_update_rendering_server(body: RID, rendering_server_handler: PhysicsServer3DRenderingServerHandler): void
        
        /** Assigns a space to the given soft body (see [method space_create]). */
        static soft_body_set_space(body: RID, space: RID): void
        
        /** Returns the [RID] of the space assigned to the given soft body. */
        static soft_body_get_space(body: RID): RID
        
        /** Sets the mesh of the given soft body. */
        static soft_body_set_mesh(body: RID, mesh: RID): void
        
        /** Returns the bounds of the given soft body in global coordinates. */
        static soft_body_get_bounds(body: RID): AABB
        
        /** Sets the physics layer or layers the given soft body belongs to. */
        static soft_body_set_collision_layer(body: RID, layer: int64): void
        
        /** Returns the physics layer or layers that the given soft body belongs to. */
        static soft_body_get_collision_layer(body: RID): int64
        
        /** Sets the physics layer or layers the given soft body can collide with. */
        static soft_body_set_collision_mask(body: RID, mask: int64): void
        
        /** Returns the physics layer or layers that the given soft body can collide with. */
        static soft_body_get_collision_mask(body: RID): int64
        
        /** Adds the given body to the list of bodies exempt from collisions. */
        static soft_body_add_collision_exception(body: RID, body_b: RID): void
        
        /** Removes the given body from the list of bodies exempt from collisions. */
        static soft_body_remove_collision_exception(body: RID, body_b: RID): void
        
        /** Sets the given body state for the given body (see [enum BodyState] constants).  
         *      
         *  **Note:** Godot's default physics implementation does not support [constant BODY_STATE_LINEAR_VELOCITY], [constant BODY_STATE_ANGULAR_VELOCITY], [constant BODY_STATE_SLEEPING], or [constant BODY_STATE_CAN_SLEEP].  
         */
        static soft_body_set_state(body: RID, state: PhysicsServer3D.BodyState, variant: any): void
        
        /** Returns the given soft body state (see [enum BodyState] constants).  
         *      
         *  **Note:** Godot's default physics implementation does not support [constant BODY_STATE_LINEAR_VELOCITY], [constant BODY_STATE_ANGULAR_VELOCITY], [constant BODY_STATE_SLEEPING], or [constant BODY_STATE_CAN_SLEEP].  
         */
        static soft_body_get_state(body: RID, state: PhysicsServer3D.BodyState): any
        
        /** Sets the global transform of the given soft body. */
        static soft_body_set_transform(body: RID, transform: Transform3D): void
        
        /** Sets whether the given soft body will be pickable when using object picking. */
        static soft_body_set_ray_pickable(body: RID, enable: boolean): void
        
        /** Sets the simulation precision of the given soft body. Increasing this value will improve the resulting simulation, but can affect performance. Use with care. */
        static soft_body_set_simulation_precision(body: RID, simulation_precision: int64): void
        
        /** Returns the simulation precision of the given soft body. */
        static soft_body_get_simulation_precision(body: RID): int64
        
        /** Sets the total mass for the given soft body. */
        static soft_body_set_total_mass(body: RID, total_mass: float64): void
        
        /** Returns the total mass assigned to the given soft body. */
        static soft_body_get_total_mass(body: RID): float64
        
        /** Sets the linear stiffness of the given soft body. Higher values will result in a stiffer body, while lower values will increase the body's ability to bend. The value can be between `0.0` and `1.0` (inclusive). */
        static soft_body_set_linear_stiffness(body: RID, stiffness: float64): void
        
        /** Returns the linear stiffness of the given soft body. */
        static soft_body_get_linear_stiffness(body: RID): float64
        
        /** Sets the pressure coefficient of the given soft body. Simulates pressure build-up from inside this body. Higher values increase the strength of this effect. */
        static soft_body_set_pressure_coefficient(body: RID, pressure_coefficient: float64): void
        
        /** Returns the pressure coefficient of the given soft body. */
        static soft_body_get_pressure_coefficient(body: RID): float64
        
        /** Sets the damping coefficient of the given soft body. Higher values will slow down the body more noticeably when forces are applied. */
        static soft_body_set_damping_coefficient(body: RID, damping_coefficient: float64): void
        
        /** Returns the damping coefficient of the given soft body. */
        static soft_body_get_damping_coefficient(body: RID): float64
        
        /** Sets the drag coefficient of the given soft body. Higher values increase this body's air resistance.  
         *      
         *  **Note:** This value is currently unused by Godot's default physics implementation.  
         */
        static soft_body_set_drag_coefficient(body: RID, drag_coefficient: float64): void
        
        /** Returns the drag coefficient of the given soft body. */
        static soft_body_get_drag_coefficient(body: RID): float64
        
        /** Moves the given soft body point to a position in global coordinates. */
        static soft_body_move_point(body: RID, point_index: int64, global_position: Vector3): void
        
        /** Returns the current position of the given soft body point in global coordinates. */
        static soft_body_get_point_global_position(body: RID, point_index: int64): Vector3
        
        /** Unpins all points of the given soft body. */
        static soft_body_remove_all_pinned_points(body: RID): void
        
        /** Pins or unpins the given soft body point based on the value of [param pin].  
         *      
         *  **Note:** Pinning a point effectively makes it kinematic, preventing it from being affected by forces, but you can still move it using [method soft_body_move_point].  
         */
        static soft_body_pin_point(body: RID, point_index: int64, pin: boolean): void
        
        /** Returns whether the given soft body point is pinned. */
        static soft_body_is_point_pinned(body: RID, point_index: int64): boolean
        static joint_create(): RID
        static joint_clear(joint: RID): void
        static joint_make_pin(joint: RID, body_A: RID, local_A: Vector3, body_B: RID, local_B: Vector3): void
        
        /** Sets a pin_joint parameter (see [enum PinJointParam] constants). */
        static pin_joint_set_param(joint: RID, param: PhysicsServer3D.PinJointParam, value: float64): void
        
        /** Gets a pin_joint parameter (see [enum PinJointParam] constants). */
        static pin_joint_get_param(joint: RID, param: PhysicsServer3D.PinJointParam): float64
        
        /** Sets position of the joint in the local space of body a of the joint. */
        static pin_joint_set_local_a(joint: RID, local_A: Vector3): void
        
        /** Returns position of the joint in the local space of body a of the joint. */
        static pin_joint_get_local_a(joint: RID): Vector3
        
        /** Sets position of the joint in the local space of body b of the joint. */
        static pin_joint_set_local_b(joint: RID, local_B: Vector3): void
        
        /** Returns position of the joint in the local space of body b of the joint. */
        static pin_joint_get_local_b(joint: RID): Vector3
        static joint_make_hinge(joint: RID, body_A: RID, hinge_A: Transform3D, body_B: RID, hinge_B: Transform3D): void
        
        /** Sets a hinge_joint parameter (see [enum HingeJointParam] constants). */
        static hinge_joint_set_param(joint: RID, param: PhysicsServer3D.HingeJointParam, value: float64): void
        
        /** Gets a hinge_joint parameter (see [enum HingeJointParam]). */
        static hinge_joint_get_param(joint: RID, param: PhysicsServer3D.HingeJointParam): float64
        
        /** Sets a hinge_joint flag (see [enum HingeJointFlag] constants). */
        static hinge_joint_set_flag(joint: RID, flag: PhysicsServer3D.HingeJointFlag, enabled: boolean): void
        
        /** Gets a hinge_joint flag (see [enum HingeJointFlag] constants). */
        static hinge_joint_get_flag(joint: RID, flag: PhysicsServer3D.HingeJointFlag): boolean
        static joint_make_slider(joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, local_ref_B: Transform3D): void
        
        /** Gets a slider_joint parameter (see [enum SliderJointParam] constants). */
        static slider_joint_set_param(joint: RID, param: PhysicsServer3D.SliderJointParam, value: float64): void
        
        /** Gets a slider_joint parameter (see [enum SliderJointParam] constants). */
        static slider_joint_get_param(joint: RID, param: PhysicsServer3D.SliderJointParam): float64
        static joint_make_cone_twist(joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, local_ref_B: Transform3D): void
        
        /** Sets a cone_twist_joint parameter (see [enum ConeTwistJointParam] constants). */
        static cone_twist_joint_set_param(joint: RID, param: PhysicsServer3D.ConeTwistJointParam, value: float64): void
        
        /** Gets a cone_twist_joint parameter (see [enum ConeTwistJointParam] constants). */
        static cone_twist_joint_get_param(joint: RID, param: PhysicsServer3D.ConeTwistJointParam): float64
        
        /** Returns the type of the Joint3D. */
        static joint_get_type(joint: RID): PhysicsServer3D.JointType
        
        /** Sets the priority value of the Joint3D. */
        static joint_set_solver_priority(joint: RID, priority: int64): void
        
        /** Gets the priority value of the Joint3D. */
        static joint_get_solver_priority(joint: RID): int64
        
        /** Sets whether the bodies attached to the [Joint3D] will collide with each other. */
        static joint_disable_collisions_between_bodies(joint: RID, disable: boolean): void
        
        /** Returns whether the bodies attached to the [Joint3D] will collide with each other. */
        static joint_is_disabled_collisions_between_bodies(joint: RID): boolean
        
        /** Make the joint a generic six degrees of freedom (6DOF) joint. Use [method generic_6dof_joint_set_flag] and [method generic_6dof_joint_set_param] to set the joint's flags and parameters respectively. */
        static joint_make_generic_6dof(joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, local_ref_B: Transform3D): void
        
        /** Sets the value of a given generic 6DOF joint parameter. See [enum G6DOFJointAxisParam] for the list of available parameters. */
        static generic_6dof_joint_set_param(joint: RID, axis: Vector3.Axis, param: PhysicsServer3D.G6DOFJointAxisParam, value: float64): void
        
        /** Returns the value of a generic 6DOF joint parameter. See [enum G6DOFJointAxisParam] for the list of available parameters. */
        static generic_6dof_joint_get_param(joint: RID, axis: Vector3.Axis, param: PhysicsServer3D.G6DOFJointAxisParam): float64
        
        /** Sets the value of a given generic 6DOF joint flag. See [enum G6DOFJointAxisFlag] for the list of available flags. */
        static generic_6dof_joint_set_flag(joint: RID, axis: Vector3.Axis, flag: PhysicsServer3D.G6DOFJointAxisFlag, enable: boolean): void
        
        /** Returns the value of a generic 6DOF joint flag. See [enum G6DOFJointAxisFlag] for the list of available flags. */
        static generic_6dof_joint_get_flag(joint: RID, axis: Vector3.Axis, flag: PhysicsServer3D.G6DOFJointAxisFlag): boolean
        
        /** Destroys any of the objects created by PhysicsServer3D. If the [RID] passed is not one of the objects that can be created by PhysicsServer3D, an error will be sent to the console. */
        static free_rid(rid: RID): void
        
        /** Activates or deactivates the 3D physics engine. */
        static set_active(active: boolean): void
        
        /** Returns information about the current state of the 3D physics engine. See [enum ProcessInfo] for a list of available states. */
        static get_process_info(process_info: PhysicsServer3D.ProcessInfo): int64
    }
    // _singleton_class_: XRServer
    namespace XRServer {
        enum TrackerType {
            /** The tracker tracks the location of the players head. This is usually a location centered between the players eyes. Note that for handheld AR devices this can be the current location of the device. */
            TRACKER_HEAD = 1,
            
            /** The tracker tracks the location of a controller. */
            TRACKER_CONTROLLER = 2,
            
            /** The tracker tracks the location of a base station. */
            TRACKER_BASESTATION = 4,
            
            /** The tracker tracks the location and size of an AR anchor. */
            TRACKER_ANCHOR = 8,
            
            /** The tracker tracks the location and joints of a hand. */
            TRACKER_HAND = 16,
            
            /** The tracker tracks the location and joints of a body. */
            TRACKER_BODY = 32,
            
            /** The tracker tracks the expressions of a face. */
            TRACKER_FACE = 64,
            
            /** Used internally to filter trackers of any known type. */
            TRACKER_ANY_KNOWN = 127,
            
            /** Used internally if we haven't set the tracker type yet. */
            TRACKER_UNKNOWN = 128,
            
            /** Used internally to select all trackers. */
            TRACKER_ANY = 255,
        }
        enum RotationMode {
            /** Fully reset the orientation of the HMD. Regardless of what direction the user is looking to in the real world. The user will look dead ahead in the virtual world. */
            RESET_FULL_ROTATION = 0,
            
            /** Resets the orientation but keeps the tilt of the device. So if we're looking down, we keep looking down but heading will be reset. */
            RESET_BUT_KEEP_TILT = 1,
            
            /** Does not reset the orientation of the HMD, only the position of the player gets centered. */
            DONT_RESET_ROTATION = 2,
        }
    }
    /** Server for AR and VR features.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_xrserver.html  
     */
    class XRServer extends Object {
        /** Returns the reference frame transform. Mostly used internally and exposed for GDExtension build interfaces. */
        static get_reference_frame(): Transform3D
        
        /** Clears the reference frame that was set by previous calls to [method center_on_hmd]. */
        static clear_reference_frame(): void
        
        /** This is an important function to understand correctly. AR and VR platforms all handle positioning slightly differently.  
         *  For platforms that do not offer spatial tracking, our origin point (0, 0, 0) is the location of our HMD, but you have little control over the direction the player is facing in the real world.  
         *  For platforms that do offer spatial tracking, our origin point depends very much on the system. For OpenVR, our origin point is usually the center of the tracking space, on the ground. For other platforms, it's often the location of the tracking camera.  
         *  This method allows you to center your tracker on the location of the HMD. It will take the current location of the HMD and use that to adjust all your tracking data; in essence, realigning the real world to your player's current position in the game world.  
         *  For this method to produce usable results, tracking information must be available. This often takes a few frames after starting your game.  
         *  You should call this method after a few seconds have passed. For example, when the user requests a realignment of the display holding a designated button on a controller for a short period of time, or when implementing a teleport mechanism.  
         */
        static center_on_hmd(rotation_mode: XRServer.RotationMode, keep_height: boolean): void
        
        /** Returns the primary interface's transformation. */
        static get_hmd_transform(): Transform3D
        
        /** Registers an [XRInterface] object. */
        static add_interface(interface: XRInterface): void
        
        /** Returns the number of interfaces currently registered with the AR/VR server. If your project supports multiple AR/VR platforms, you can look through the available interface, and either present the user with a selection or simply try to initialize each interface and use the first one that returns `true`. */
        static get_interface_count(): int64
        
        /** Removes this [param interface]. */
        static remove_interface(interface: XRInterface): void
        
        /** Returns the interface registered at the given [param idx] index in the list of interfaces. */
        static get_interface(idx: int64): XRInterface
        
        /** Returns a list of available interfaces the ID and name of each interface. */
        static get_interfaces(): GArray
        
        /** Finds an interface by its [param name]. For example, if your project uses capabilities of an AR/VR platform, you can find the interface for that platform by name and initialize it. */
        static find_interface(name: string): XRInterface
        
        /** Registers a new [XRTracker] that tracks a physical object. */
        static add_tracker(tracker: XRTracker): void
        
        /** Removes this [param tracker]. */
        static remove_tracker(tracker: XRTracker): void
        
        /** Returns a dictionary of trackers for [param tracker_types]. */
        static get_trackers(tracker_types: int64): GDictionary
        
        /** Returns the positional tracker with the given [param tracker_name]. */
        static get_tracker(tracker_name: StringName): XRTracker
        
        /** The scale of the game world compared to the real world. By default, most AR/VR platforms assume that 1 game unit corresponds to 1 real world meter. */
        get world_scale(): float64
        set world_scale(value: float64)
        
        /** The current origin of our tracking space in the virtual world. This is used by the renderer to properly position the camera with new tracking data.  
         *      
         *  **Note:** This property is managed by the current [XROrigin3D] node. It is exposed for access from GDExtensions.  
         */
        get world_origin(): Vector3
        set world_origin(value: Vector3)
        
        /** The primary [XRInterface] currently bound to the [XRServer]. */
        get primary_interface(): Object
        set primary_interface(value: Object)
        
        /** Emitted when the reference frame transform changes. */
        static readonly reference_frame_changed: Signal0
        
        /** Emitted when a new interface has been added. */
        static readonly interface_added: Signal1<StringName>
        
        /** Emitted when an interface is removed. */
        static readonly interface_removed: Signal1<StringName>
        
        /** Emitted when a new tracker has been added. If you don't use a fixed number of controllers or if you're using [XRAnchor3D]s for an AR solution, it is important to react to this signal to add the appropriate [XRController3D] or [XRAnchor3D] nodes related to this new tracker. */
        static readonly tracker_added: Signal2<StringName, int64>
        
        /** Emitted when an existing tracker has been updated. This can happen if the user switches controllers. */
        static readonly tracker_updated: Signal2<StringName, int64>
        
        /** Emitted when a tracker is removed. You should remove any [XRController3D] or [XRAnchor3D] points if applicable. This is not mandatory, the nodes simply become inactive and will be made active again when a new tracker becomes available (i.e. a new controller is switched on that takes the place of the previous one). */
        static readonly tracker_removed: Signal2<StringName, int64>
    }
    namespace AESContext {
        enum Mode {
            /** AES electronic codebook encryption mode. */
            MODE_ECB_ENCRYPT = 0,
            
            /** AES electronic codebook decryption mode. */
            MODE_ECB_DECRYPT = 1,
            
            /** AES cipher blocker chaining encryption mode. */
            MODE_CBC_ENCRYPT = 2,
            
            /** AES cipher blocker chaining decryption mode. */
            MODE_CBC_DECRYPT = 3,
            
            /** Maximum value for the mode enum. */
            MODE_MAX = 4,
        }
    }
    /** Provides access to AES encryption/decryption of raw data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_aescontext.html  
     */
    class AESContext extends RefCounted {
        constructor(identifier?: any)
        /** Start the AES context in the given [param mode]. A [param key] of either 16 or 32 bytes must always be provided, while an [param iv] (initialization vector) of exactly 16 bytes, is only needed when [param mode] is either [constant MODE_CBC_ENCRYPT] or [constant MODE_CBC_DECRYPT]. */
        start(mode: AESContext.Mode, key: PackedByteArray | byte[] | ArrayBuffer, iv: PackedByteArray | byte[] | ArrayBuffer = []): GError
        
        /** Run the desired operation for this AES context. Will return a [PackedByteArray] containing the result of encrypting (or decrypting) the given [param src]. See [method start] for mode of operation.  
         *      
         *  **Note:** The size of [param src] must be a multiple of 16. Apply some padding if needed.  
         */
        update(src: PackedByteArray | byte[] | ArrayBuffer): PackedByteArray
        
        /** Get the current IV state for this context (IV gets updated when calling [method update]). You normally don't need this function.  
         *      
         *  **Note:** This function only makes sense when the context is started with [constant MODE_CBC_ENCRYPT] or [constant MODE_CBC_DECRYPT].  
         */
        get_iv_state(): PackedByteArray
        
        /** Close this AES context so it can be started again. See [method start]. */
        finish(): void
    }
    /** An implementation of A* for finding the shortest path between two vertices on a connected graph in 2D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_astar2d.html  
     */
    class AStar2D extends RefCounted {
        constructor(identifier?: any)
        /** Called when estimating the cost between a point and the path's ending point.  
         *  Note that this function is hidden in the default [AStar2D] class.  
         */
        /* gdvirtual */ _estimate_cost(from_id: int64, to_id: int64): float64
        
        /** Called when computing the cost between two connected points.  
         *  Note that this function is hidden in the default [AStar2D] class.  
         */
        /* gdvirtual */ _compute_cost(from_id: int64, to_id: int64): float64
        
        /** Returns the next available point ID with no point associated to it. */
        get_available_point_id(): int64
        
        /** Adds a new point at the given position with the given identifier. The [param id] must be 0 or larger, and the [param weight_scale] must be 0.0 or greater.  
         *  The [param weight_scale] is multiplied by the result of [method _compute_cost] when determining the overall cost of traveling across a segment from a neighboring point to this point. Thus, all else being equal, the algorithm prefers points with lower [param weight_scale]s to form a path.  
         *    
         *  If there already exists a point for the given [param id], its position and weight scale are updated to the given values.  
         */
        add_point(id: int64, position: Vector2, weight_scale: float64 = 1): void
        
        /** Returns the position of the point associated with the given [param id]. */
        get_point_position(id: int64): Vector2
        
        /** Sets the [param position] for the point with the given [param id]. */
        set_point_position(id: int64, position: Vector2): void
        
        /** Returns the weight scale of the point associated with the given [param id]. */
        get_point_weight_scale(id: int64): float64
        
        /** Sets the [param weight_scale] for the point with the given [param id]. The [param weight_scale] is multiplied by the result of [method _compute_cost] when determining the overall cost of traveling across a segment from a neighboring point to this point. */
        set_point_weight_scale(id: int64, weight_scale: float64): void
        
        /** Removes the point associated with the given [param id] from the points pool. */
        remove_point(id: int64): void
        
        /** Returns whether a point associated with the given [param id] exists. */
        has_point(id: int64): boolean
        
        /** Returns an array with the IDs of the points that form the connection with the given point.  
         *    
         */
        get_point_connections(id: int64): PackedInt64Array
        
        /** Returns an array of all point IDs. */
        get_point_ids(): PackedInt64Array
        
        /** Disables or enables the specified point for pathfinding. Useful for making a temporary obstacle. */
        set_point_disabled(id: int64, disabled: boolean = true): void
        
        /** Returns whether a point is disabled or not for pathfinding. By default, all points are enabled. */
        is_point_disabled(id: int64): boolean
        
        /** Creates a segment between the given points. If [param bidirectional] is `false`, only movement from [param id] to [param to_id] is allowed, not the reverse direction.  
         *    
         */
        connect_points(id: int64, to_id: int64, bidirectional: boolean = true): void
        
        /** Deletes the segment between the given points. If [param bidirectional] is `false`, only movement from [param id] to [param to_id] is prevented, and a unidirectional segment possibly remains. */
        disconnect_points(id: int64, to_id: int64, bidirectional: boolean = true): void
        
        /** Returns whether there is a connection/segment between the given points. If [param bidirectional] is `false`, returns whether movement from [param id] to [param to_id] is possible through this segment. */
        are_points_connected(id: int64, to_id: int64, bidirectional: boolean = true): boolean
        
        /** Returns the number of points currently in the points pool. */
        get_point_count(): int64
        
        /** Returns the capacity of the structure backing the points, useful in conjunction with [method reserve_space]. */
        get_point_capacity(): int64
        
        /** Reserves space internally for [param num_nodes] points, useful if you're adding a known large number of points at once, such as points on a grid. New capacity must be greater or equals to old capacity. */
        reserve_space(num_nodes: int64): void
        
        /** Clears all the points and segments. */
        clear(): void
        
        /** Returns the ID of the closest point to [param to_position], optionally taking disabled points into account. Returns `-1` if there are no points in the points pool.  
         *      
         *  **Note:** If several points are the closest to [param to_position], the one with the smallest ID will be returned, ensuring a deterministic result.  
         */
        get_closest_point(to_position: Vector2, include_disabled: boolean = false): int64
        
        /** Returns the closest position to [param to_position] that resides inside a segment between two connected points.  
         *    
         *  The result is in the segment that goes from `y = 0` to `y = 5`. It's the closest position in the segment to the given point.  
         */
        get_closest_position_in_segment(to_position: Vector2): Vector2
        
        /** Returns an array with the points that are in the path found by AStar2D between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *      
         *  **Note:** This method is not thread-safe. If called from a [Thread], it will return an empty array and will print an error message.  
         */
        get_point_path(from_id: int64, to_id: int64, allow_partial_path: boolean = false): PackedVector2Array
        
        /** Returns an array with the IDs of the points that form the path found by AStar2D between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *    
         *  If you change the 2nd point's weight to 3, then the result will be `[1, 4, 3]` instead, because now even though the distance is longer, it's "easier" to get through point 4 than through point 2.  
         */
        get_id_path(from_id: int64, to_id: int64, allow_partial_path: boolean = false): PackedInt64Array
    }
    /** An implementation of A* for finding the shortest path between two vertices on a connected graph in 3D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_astar3d.html  
     */
    class AStar3D extends RefCounted {
        constructor(identifier?: any)
        /** Called when estimating the cost between a point and the path's ending point.  
         *  Note that this function is hidden in the default [AStar3D] class.  
         */
        /* gdvirtual */ _estimate_cost(from_id: int64, to_id: int64): float64
        
        /** Called when computing the cost between two connected points.  
         *  Note that this function is hidden in the default [AStar3D] class.  
         */
        /* gdvirtual */ _compute_cost(from_id: int64, to_id: int64): float64
        
        /** Returns the next available point ID with no point associated to it. */
        get_available_point_id(): int64
        
        /** Adds a new point at the given position with the given identifier. The [param id] must be 0 or larger, and the [param weight_scale] must be 0.0 or greater.  
         *  The [param weight_scale] is multiplied by the result of [method _compute_cost] when determining the overall cost of traveling across a segment from a neighboring point to this point. Thus, all else being equal, the algorithm prefers points with lower [param weight_scale]s to form a path.  
         *    
         *  If there already exists a point for the given [param id], its position and weight scale are updated to the given values.  
         */
        add_point(id: int64, position: Vector3, weight_scale: float64 = 1): void
        
        /** Returns the position of the point associated with the given [param id]. */
        get_point_position(id: int64): Vector3
        
        /** Sets the [param position] for the point with the given [param id]. */
        set_point_position(id: int64, position: Vector3): void
        
        /** Returns the weight scale of the point associated with the given [param id]. */
        get_point_weight_scale(id: int64): float64
        
        /** Sets the [param weight_scale] for the point with the given [param id]. The [param weight_scale] is multiplied by the result of [method _compute_cost] when determining the overall cost of traveling across a segment from a neighboring point to this point. */
        set_point_weight_scale(id: int64, weight_scale: float64): void
        
        /** Removes the point associated with the given [param id] from the points pool. */
        remove_point(id: int64): void
        
        /** Returns whether a point associated with the given [param id] exists. */
        has_point(id: int64): boolean
        
        /** Returns an array with the IDs of the points that form the connection with the given point.  
         *    
         */
        get_point_connections(id: int64): PackedInt64Array
        
        /** Returns an array of all point IDs. */
        get_point_ids(): PackedInt64Array
        
        /** Disables or enables the specified point for pathfinding. Useful for making a temporary obstacle. */
        set_point_disabled(id: int64, disabled: boolean = true): void
        
        /** Returns whether a point is disabled or not for pathfinding. By default, all points are enabled. */
        is_point_disabled(id: int64): boolean
        
        /** Creates a segment between the given points. If [param bidirectional] is `false`, only movement from [param id] to [param to_id] is allowed, not the reverse direction.  
         *    
         */
        connect_points(id: int64, to_id: int64, bidirectional: boolean = true): void
        
        /** Deletes the segment between the given points. If [param bidirectional] is `false`, only movement from [param id] to [param to_id] is prevented, and a unidirectional segment possibly remains. */
        disconnect_points(id: int64, to_id: int64, bidirectional: boolean = true): void
        
        /** Returns whether the two given points are directly connected by a segment. If [param bidirectional] is `false`, returns whether movement from [param id] to [param to_id] is possible through this segment. */
        are_points_connected(id: int64, to_id: int64, bidirectional: boolean = true): boolean
        
        /** Returns the number of points currently in the points pool. */
        get_point_count(): int64
        
        /** Returns the capacity of the structure backing the points, useful in conjunction with [method reserve_space]. */
        get_point_capacity(): int64
        
        /** Reserves space internally for [param num_nodes] points. Useful if you're adding a known large number of points at once, such as points on a grid. New capacity must be greater or equals to old capacity. */
        reserve_space(num_nodes: int64): void
        
        /** Clears all the points and segments. */
        clear(): void
        
        /** Returns the ID of the closest point to [param to_position], optionally taking disabled points into account. Returns `-1` if there are no points in the points pool.  
         *      
         *  **Note:** If several points are the closest to [param to_position], the one with the smallest ID will be returned, ensuring a deterministic result.  
         */
        get_closest_point(to_position: Vector3, include_disabled: boolean = false): int64
        
        /** Returns the closest position to [param to_position] that resides inside a segment between two connected points.  
         *    
         *  The result is in the segment that goes from `y = 0` to `y = 5`. It's the closest position in the segment to the given point.  
         */
        get_closest_position_in_segment(to_position: Vector3): Vector3
        
        /** Returns an array with the points that are in the path found by AStar3D between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *      
         *  **Note:** This method is not thread-safe. If called from a [Thread], it will return an empty array and will print an error message.  
         */
        get_point_path(from_id: int64, to_id: int64, allow_partial_path: boolean = false): PackedVector3Array
        
        /** Returns an array with the IDs of the points that form the path found by AStar3D between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *    
         *  If you change the 2nd point's weight to 3, then the result will be `[1, 4, 3]` instead, because now even though the distance is longer, it's "easier" to get through point 4 than through point 2.  
         */
        get_id_path(from_id: int64, to_id: int64, allow_partial_path: boolean = false): PackedInt64Array
    }
    namespace AStarGrid2D {
        enum Heuristic {
            /** The [url=https://en.wikipedia.org/wiki/Euclidean_distance]Euclidean heuristic[/url] to be used for the pathfinding using the following formula:  
             *    
             *      
             *  **Note:** This is also the internal heuristic used in [AStar3D] and [AStar2D] by default (with the inclusion of possible z-axis coordinate).  
             */
            HEURISTIC_EUCLIDEAN = 0,
            
            /** The [url=https://en.wikipedia.org/wiki/Taxicab_geometry]Manhattan heuristic[/url] to be used for the pathfinding using the following formula:  
             *    
             *      
             *  **Note:** This heuristic is intended to be used with 4-side orthogonal movements, provided by setting the [member diagonal_mode] to [constant DIAGONAL_MODE_NEVER].  
             */
            HEURISTIC_MANHATTAN = 1,
            
            /** The Octile heuristic to be used for the pathfinding using the following formula:  
             *    
             */
            HEURISTIC_OCTILE = 2,
            
            /** The [url=https://en.wikipedia.org/wiki/Chebyshev_distance]Chebyshev heuristic[/url] to be used for the pathfinding using the following formula:  
             *    
             */
            HEURISTIC_CHEBYSHEV = 3,
            
            /** Represents the size of the [enum Heuristic] enum. */
            HEURISTIC_MAX = 4,
        }
        enum DiagonalMode {
            /** The pathfinding algorithm will ignore solid neighbors around the target cell and allow passing using diagonals. */
            DIAGONAL_MODE_ALWAYS = 0,
            
            /** The pathfinding algorithm will ignore all diagonals and the way will be always orthogonal. */
            DIAGONAL_MODE_NEVER = 1,
            
            /** The pathfinding algorithm will avoid using diagonals if at least two obstacles have been placed around the neighboring cells of the specific path segment. */
            DIAGONAL_MODE_AT_LEAST_ONE_WALKABLE = 2,
            
            /** The pathfinding algorithm will avoid using diagonals if any obstacle has been placed around the neighboring cells of the specific path segment. */
            DIAGONAL_MODE_ONLY_IF_NO_OBSTACLES = 3,
            
            /** Represents the size of the [enum DiagonalMode] enum. */
            DIAGONAL_MODE_MAX = 4,
        }
        enum CellShape {
            /** Rectangular cell shape. */
            CELL_SHAPE_SQUARE = 0,
            
            /** Diamond cell shape (for isometric look). Cell coordinates layout where the horizontal axis goes up-right, and the vertical one goes down-right. */
            CELL_SHAPE_ISOMETRIC_RIGHT = 1,
            
            /** Diamond cell shape (for isometric look). Cell coordinates layout where the horizontal axis goes down-right, and the vertical one goes down-left. */
            CELL_SHAPE_ISOMETRIC_DOWN = 2,
            
            /** Represents the size of the [enum CellShape] enum. */
            CELL_SHAPE_MAX = 3,
        }
    }
    /** An implementation of A* for finding the shortest path between two points on a partial 2D grid.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_astargrid2d.html  
     */
    class AStarGrid2D extends RefCounted {
        constructor(identifier?: any)
        /** Called when estimating the cost between a point and the path's ending point.  
         *  Note that this function is hidden in the default [AStarGrid2D] class.  
         */
        /* gdvirtual */ _estimate_cost(from_id: Vector2i, to_id: Vector2i): float64
        
        /** Called when computing the cost between two connected points.  
         *  Note that this function is hidden in the default [AStarGrid2D] class.  
         */
        /* gdvirtual */ _compute_cost(from_id: Vector2i, to_id: Vector2i): float64
        
        /** Returns `true` if the [param x] and [param y] is a valid grid coordinate (id), i.e. if it is inside [member region]. Equivalent to `region.has_point(Vector2i(x, y))`. */
        is_in_bounds(x: int64, y: int64): boolean
        
        /** Returns `true` if the [param id] vector is a valid grid coordinate, i.e. if it is inside [member region]. Equivalent to `region.has_point(id)`. */
        is_in_boundsv(id: Vector2i): boolean
        
        /** Indicates that the grid parameters were changed and [method update] needs to be called. */
        is_dirty(): boolean
        
        /** Updates the internal state of the grid according to the parameters to prepare it to search the path. Needs to be called if parameters like [member region], [member cell_size] or [member offset] are changed. [method is_dirty] will return `true` if this is the case and this needs to be called.  
         *      
         *  **Note:** All point data (solidity and weight scale) will be cleared.  
         */
        update(): void
        
        /** Disables or enables the specified point for pathfinding. Useful for making an obstacle. By default, all points are enabled.  
         *      
         *  **Note:** Calling [method update] is not needed after the call of this function.  
         */
        set_point_solid(id: Vector2i, solid: boolean = true): void
        
        /** Returns `true` if a point is disabled for pathfinding. By default, all points are enabled. */
        is_point_solid(id: Vector2i): boolean
        
        /** Sets the [param weight_scale] for the point with the given [param id]. The [param weight_scale] is multiplied by the result of [method _compute_cost] when determining the overall cost of traveling across a segment from a neighboring point to this point.  
         *      
         *  **Note:** Calling [method update] is not needed after the call of this function.  
         */
        set_point_weight_scale(id: Vector2i, weight_scale: float64): void
        
        /** Returns the weight scale of the point associated with the given [param id]. */
        get_point_weight_scale(id: Vector2i): float64
        
        /** Fills the given [param region] on the grid with the specified value for the solid flag.  
         *      
         *  **Note:** Calling [method update] is not needed after the call of this function.  
         */
        fill_solid_region(region: Rect2i, solid: boolean = true): void
        
        /** Fills the given [param region] on the grid with the specified value for the weight scale.  
         *      
         *  **Note:** Calling [method update] is not needed after the call of this function.  
         */
        fill_weight_scale_region(region: Rect2i, weight_scale: float64): void
        
        /** Clears the grid and sets the [member region] to `Rect2i(0, 0, 0, 0)`. */
        clear(): void
        
        /** Returns the position of the point associated with the given [param id]. */
        get_point_position(id: Vector2i): Vector2
        
        /** Returns an array with the points that are in the path found by [AStarGrid2D] between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *      
         *  **Note:** This method is not thread-safe. If called from a [Thread], it will return an empty array and will print an error message.  
         */
        get_point_path(from_id: Vector2i, to_id: Vector2i, allow_partial_path: boolean = false): PackedVector2Array
        
        /** Returns an array with the IDs of the points that form the path found by AStar2D between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         */
        get_id_path(from_id: Vector2i, to_id: Vector2i, allow_partial_path: boolean = false): GArray
        
        /** The region of grid cells available for pathfinding. If changed, [method update] needs to be called before finding the next path. */
        get region(): Rect2i
        set region(value: Rect2i)
        
        /** The size of the grid (number of cells of size [member cell_size] on each axis). If changed, [method update] needs to be called before finding the next path. */
        get size(): Vector2i
        set size(value: Vector2i)
        
        /** The offset of the grid which will be applied to calculate the resulting point position returned by [method get_point_path]. If changed, [method update] needs to be called before finding the next path. */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** The size of the point cell which will be applied to calculate the resulting point position returned by [method get_point_path]. If changed, [method update] needs to be called before finding the next path. */
        get cell_size(): Vector2
        set cell_size(value: Vector2)
        
        /** The cell shape. Affects how the positions are placed in the grid. If changed, [method update] needs to be called before finding the next path. */
        get cell_shape(): int64
        set cell_shape(value: int64)
        
        /** Enables or disables jumping to skip up the intermediate points and speeds up the searching algorithm.  
         *      
         *  **Note:** Currently, toggling it on disables the consideration of weight scaling in pathfinding.  
         */
        get jumping_enabled(): boolean
        set jumping_enabled(value: boolean)
        
        /** The default [enum Heuristic] which will be used to calculate the cost between two points if [method _compute_cost] was not overridden. */
        get default_compute_heuristic(): int64
        set default_compute_heuristic(value: int64)
        
        /** The default [enum Heuristic] which will be used to calculate the cost between the point and the end point if [method _estimate_cost] was not overridden. */
        get default_estimate_heuristic(): int64
        set default_estimate_heuristic(value: int64)
        
        /** A specific [enum DiagonalMode] mode which will force the path to avoid or accept the specified diagonals. */
        get diagonal_mode(): int64
        set diagonal_mode(value: int64)
    }
    class AbstractPolygon2DEditor extends HBoxContainer {
        constructor(identifier?: any)
    }
    class AbstractPolygon2DEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** A base dialog used for user notification.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_acceptdialog.html  
     */
    class AcceptDialog extends Window {
        constructor(identifier?: any)
        /** Returns the OK [Button] instance.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_ok_button(): Button
        
        /** Returns the label used for built-in text.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_label(): Label
        
        /** Adds a button with label [param text] and a custom [param action] to the dialog and returns the created button. [param action] will be passed to the [signal custom_action] signal when pressed.  
         *  If `true`, [param right] will place the button to the right of any sibling buttons.  
         *  You can use [method remove_button] method to remove a button created with this method from the dialog.  
         */
        add_button(text: string, right: boolean = false, action: string = ''): Button
        
        /** Adds a button with label [param name] and a cancel action to the dialog and returns the created button.  
         *  You can use [method remove_button] method to remove a button created with this method from the dialog.  
         */
        add_cancel_button(name: string): Button
        
        /** Removes the [param button] from the dialog. Does NOT free the [param button]. The [param button] must be a [Button] added with [method add_button] or [method add_cancel_button] method. After removal, pressing the [param button] will no longer emit this dialog's [signal custom_action] or [signal canceled] signals. */
        remove_button(button: Button): void
        
        /** Registers a [LineEdit] in the dialog. When the enter key is pressed, the dialog will be accepted. */
        register_text_enter(line_edit: LineEdit): void
        
        /** The text displayed by the OK button (see [method get_ok_button]). */
        get ok_button_text(): string
        set ok_button_text(value: string)
        
        /** The text displayed by the dialog. */
        get dialog_text(): string
        set dialog_text(value: string)
        
        /** If `true`, the dialog is hidden when the OK button is pressed. You can set it to `false` if you want to do e.g. input validation when receiving the [signal confirmed] signal, and handle hiding the dialog in your own logic.  
         *      
         *  **Note:** Some nodes derived from this class can have a different default value, and potentially their own built-in logic overriding this setting. For example [FileDialog] defaults to `false`, and has its own input validation code that is called when you press OK, which eventually hides the dialog if the input is valid. As such, this property can't be used in [FileDialog] to disable hiding the dialog when pressing OK.  
         */
        get dialog_hide_on_ok(): boolean
        set dialog_hide_on_ok(value: boolean)
        
        /** If `true`, the dialog will be hidden when the escape key ([constant KEY_ESCAPE]) is pressed. */
        get dialog_close_on_escape(): boolean
        set dialog_close_on_escape(value: boolean)
        
        /** Sets autowrapping for the text in the dialog. */
        get dialog_autowrap(): boolean
        set dialog_autowrap(value: boolean)
        
        /** Emitted when the dialog is accepted, i.e. the OK button is pressed. */
        readonly confirmed: Signal0
        
        /** Emitted when the dialog is closed or the button created with [method add_cancel_button] is pressed. */
        readonly canceled: Signal0
        
        /** Emitted when a custom button is pressed. See [method add_button]. */
        readonly custom_action: Signal1<StringName>
    }
    class ActionMapEditor extends Control {
        constructor(identifier?: any)
        readonly action_added: Signal1<string>
        readonly action_edited: Signal2<string, GDictionary>
        readonly action_removed: Signal1<string>
        readonly action_renamed: Signal2<string, string>
        readonly action_reordered: Signal3<string, string, boolean>
        readonly filter_focused: Signal0
        readonly filter_unfocused: Signal0
    }
    class AnchorPresetPicker extends ControlEditorPresetPicker {
        constructor(identifier?: any)
        readonly anchors_preset_selected: Signal1<int64>
    }
    /** A 2D physics body that can't be moved by external forces. When moved manually, it affects other bodies in its path.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animatablebody2d.html  
     */
    class AnimatableBody2D extends StaticBody2D {
        constructor(identifier?: any)
        /** If `true`, the body's movement will be synchronized to the physics frame. This is useful when animating movement via [AnimationPlayer], for example on moving platforms. Do **not** use together with [method PhysicsBody2D.move_and_collide]. */
        get sync_to_physics(): boolean
        set sync_to_physics(value: boolean)
    }
    /** A 3D physics body that can't be moved by external forces. When moved manually, it affects other bodies in its path.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animatablebody3d.html  
     */
    class AnimatableBody3D extends StaticBody3D {
        constructor(identifier?: any)
        /** If `true`, the body's movement will be synchronized to the physics frame. This is useful when animating movement via [AnimationPlayer], for example on moving platforms. Do **not** use together with [method PhysicsBody3D.move_and_collide]. */
        get sync_to_physics(): boolean
        set sync_to_physics(value: boolean)
    }
    /** Sprite node that contains multiple textures as frames to play for animation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animatedsprite2d.html  
     */
    class AnimatedSprite2D extends Node2D {
        constructor(identifier?: any)
        /** Returns `true` if an animation is currently playing (even if [member speed_scale] and/or `custom_speed` are `0`). */
        is_playing(): boolean
        
        /** Plays the animation with key [param name]. If [param custom_speed] is negative and [param from_end] is `true`, the animation will play backwards (which is equivalent to calling [method play_backwards]).  
         *  If this method is called with that same animation [param name], or with no [param name] parameter, the assigned animation will resume playing if it was paused.  
         */
        play(name: StringName = '', custom_speed: float64 = 1, from_end: boolean = false): void
        
        /** Plays the animation with key [param name] in reverse.  
         *  This method is a shorthand for [method play] with `custom_speed = -1.0` and `from_end = true`, so see its description for more information.  
         */
        play_backwards(name: StringName = ''): void
        
        /** Pauses the currently playing animation. The [member frame] and [member frame_progress] will be kept and calling [method play] or [method play_backwards] without arguments will resume the animation from the current playback position.  
         *  See also [method stop].  
         */
        pause(): void
        
        /** Stops the currently playing animation. The animation position is reset to `0` and the `custom_speed` is reset to `1.0`. See also [method pause]. */
        stop(): void
        
        /** The setter of [member frame] resets the [member frame_progress] to `0.0` implicitly, but this method avoids that.  
         *  This is useful when you want to carry over the current [member frame_progress] to another [member frame].  
         *  **Example:**  
         *    
         */
        set_frame_and_progress(frame: int64, progress: float64): void
        
        /** Returns the actual playing speed of current animation or `0` if not playing. This speed is the [member speed_scale] property multiplied by `custom_speed` argument specified when calling the [method play] method.  
         *  Returns a negative value if the current animation is playing backwards.  
         */
        get_playing_speed(): float64
        
        /** The [SpriteFrames] resource containing the animation(s). Allows you the option to load, edit, clear, make unique and save the states of the [SpriteFrames] resource. */
        get sprite_frames(): SpriteFrames
        set sprite_frames(value: SpriteFrames)
        
        /** The current animation from the [member sprite_frames] resource. If this value is changed, the [member frame] counter and the [member frame_progress] are reset. */
        get animation(): StringName
        set animation(value: StringName)
        
        /** The key of the animation to play when the scene loads. */
        get autoplay(): StringName
        set autoplay(value: StringName)
        
        /** The displayed animation frame's index. Setting this property also resets [member frame_progress]. If this is not desired, use [method set_frame_and_progress]. */
        get frame(): int64
        set frame(value: int64)
        
        /** The progress value between `0.0` and `1.0` until the current frame transitions to the next frame. If the animation is playing backwards, the value transitions from `1.0` to `0.0`. */
        get frame_progress(): float64
        set frame_progress(value: float64)
        
        /** The speed scaling ratio. For example, if this value is `1`, then the animation plays at normal speed. If it's `0.5`, then it plays at half speed. If it's `2`, then it plays at double speed.  
         *  If set to a negative value, the animation is played in reverse. If set to `0`, the animation will not advance.  
         */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** If `true`, texture will be centered.  
         *      
         *  **Note:** For games with a pixel art aesthetic, textures may appear deformed when centered. This is caused by their position being between pixels. To prevent this, set this property to `false`, or consider enabling [member ProjectSettings.rendering/2d/snap/snap_2d_vertices_to_pixel] and [member ProjectSettings.rendering/2d/snap/snap_2d_transforms_to_pixel].  
         */
        get centered(): boolean
        set centered(value: boolean)
        
        /** The texture's drawing offset. */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** If `true`, texture is flipped horizontally. */
        get flip_h(): boolean
        set flip_h(value: boolean)
        
        /** If `true`, texture is flipped vertically. */
        get flip_v(): boolean
        set flip_v(value: boolean)
        
        /** Emitted when [member sprite_frames] changes. */
        readonly sprite_frames_changed: Signal0
        
        /** Emitted when [member animation] changes. */
        readonly animation_changed: Signal0
        
        /** Emitted when [member frame] changes. */
        readonly frame_changed: Signal0
        
        /** Emitted when the animation loops. */
        readonly animation_looped: Signal0
        
        /** Emitted when the animation reaches the end, or the start if it is played in reverse. When the animation finishes, it pauses the playback.  
         *      
         *  **Note:** This signal is not emitted if an animation is looping.  
         */
        readonly animation_finished: Signal0
    }
    /** 2D sprite node in 3D world, that can use multiple 2D textures for animation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animatedsprite3d.html  
     */
    class AnimatedSprite3D extends SpriteBase3D {
        constructor(identifier?: any)
        /** Returns `true` if an animation is currently playing (even if [member speed_scale] and/or `custom_speed` are `0`). */
        is_playing(): boolean
        
        /** Plays the animation with key [param name]. If [param custom_speed] is negative and [param from_end] is `true`, the animation will play backwards (which is equivalent to calling [method play_backwards]).  
         *  If this method is called with that same animation [param name], or with no [param name] parameter, the assigned animation will resume playing if it was paused.  
         */
        play(name: StringName = '', custom_speed: float64 = 1, from_end: boolean = false): void
        
        /** Plays the animation with key [param name] in reverse.  
         *  This method is a shorthand for [method play] with `custom_speed = -1.0` and `from_end = true`, so see its description for more information.  
         */
        play_backwards(name: StringName = ''): void
        
        /** Pauses the currently playing animation. The [member frame] and [member frame_progress] will be kept and calling [method play] or [method play_backwards] without arguments will resume the animation from the current playback position.  
         *  See also [method stop].  
         */
        pause(): void
        
        /** Stops the currently playing animation. The animation position is reset to `0` and the `custom_speed` is reset to `1.0`. See also [method pause]. */
        stop(): void
        
        /** The setter of [member frame] resets the [member frame_progress] to `0.0` implicitly, but this method avoids that.  
         *  This is useful when you want to carry over the current [member frame_progress] to another [member frame].  
         *  **Example:**  
         *    
         */
        set_frame_and_progress(frame: int64, progress: float64): void
        
        /** Returns the actual playing speed of current animation or `0` if not playing. This speed is the [member speed_scale] property multiplied by `custom_speed` argument specified when calling the [method play] method.  
         *  Returns a negative value if the current animation is playing backwards.  
         */
        get_playing_speed(): float64
        _res_changed(): void
        
        /** The [SpriteFrames] resource containing the animation(s). Allows you the option to load, edit, clear, make unique and save the states of the [SpriteFrames] resource. */
        get sprite_frames(): SpriteFrames
        set sprite_frames(value: SpriteFrames)
        
        /** The current animation from the [member sprite_frames] resource. If this value is changed, the [member frame] counter and the [member frame_progress] are reset. */
        get animation(): StringName
        set animation(value: StringName)
        
        /** The key of the animation to play when the scene loads. */
        get autoplay(): StringName
        set autoplay(value: StringName)
        
        /** The displayed animation frame's index. Setting this property also resets [member frame_progress]. If this is not desired, use [method set_frame_and_progress]. */
        get frame(): int64
        set frame(value: int64)
        
        /** The progress value between `0.0` and `1.0` until the current frame transitions to the next frame. If the animation is playing backwards, the value transitions from `1.0` to `0.0`. */
        get frame_progress(): float64
        set frame_progress(value: float64)
        
        /** The speed scaling ratio. For example, if this value is `1`, then the animation plays at normal speed. If it's `0.5`, then it plays at half speed. If it's `2`, then it plays at double speed.  
         *  If set to a negative value, the animation is played in reverse. If set to `0`, the animation will not advance.  
         */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** Emitted when [member sprite_frames] changes. */
        readonly sprite_frames_changed: Signal0
        
        /** Emitted when [member animation] changes. */
        readonly animation_changed: Signal0
        
        /** Emitted when [member frame] changes. */
        readonly frame_changed: Signal0
        
        /** Emitted when the animation loops. */
        readonly animation_looped: Signal0
        
        /** Emitted when the animation reaches the end, or the start if it is played in reverse. When the animation finishes, it pauses the playback.  
         *      
         *  **Note:** This signal is not emitted if an animation is looping.  
         */
        readonly animation_finished: Signal0
    }
    /** Proxy texture for simple frame-based animations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animatedtexture.html  
     */
    class AnimatedTexture extends Texture2D {
        /** The maximum number of frames supported by [AnimatedTexture]. If you need more frames in your animation, use [AnimationPlayer] or [AnimatedSprite2D]. */
        static readonly MAX_FRAMES = 256
        constructor(identifier?: any)
        
        /** Assigns a [Texture2D] to the given frame. Frame IDs start at 0, so the first frame has ID 0, and the last frame of the animation has ID [member frames] - 1.  
         *  You can define any number of textures up to [constant MAX_FRAMES], but keep in mind that only frames from 0 to [member frames] - 1 will be part of the animation.  
         */
        set_frame_texture(frame: int64, texture: Texture2D): void
        
        /** Returns the given frame's [Texture2D]. */
        get_frame_texture(frame: int64): Texture2D
        
        /** Sets the duration of any given [param frame]. The final duration is affected by the [member speed_scale]. If set to `0`, the frame is skipped during playback. */
        set_frame_duration(frame: int64, duration: float64): void
        
        /** Returns the given [param frame]'s duration, in seconds. */
        get_frame_duration(frame: int64): float64
        
        /** Number of frames to use in the animation. While you can create the frames independently with [method set_frame_texture], you need to set this value for the animation to take new frames into account. The maximum number of frames is [constant MAX_FRAMES]. */
        get frames(): int64
        set frames(value: int64)
        
        /** Sets the currently visible frame of the texture. Setting this frame while playing resets the current frame time, so the newly selected frame plays for its whole configured frame duration. */
        get current_frame(): int64
        set current_frame(value: int64)
        
        /** If `true`, the animation will pause where it currently is (i.e. at [member current_frame]). The animation will continue from where it was paused when changing this property to `false`. */
        get pause(): boolean
        set pause(value: boolean)
        
        /** If `true`, the animation will only play once and will not loop back to the first frame after reaching the end. Note that reaching the end will not set [member pause] to `true`. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** The animation speed is multiplied by this value. If set to a negative value, the animation is played in reverse. */
        get speed_scale(): float64
        set speed_scale(value: float64)
    }
    namespace Animation {
        enum TrackType {
            /** Value tracks set values in node properties, but only those which can be interpolated. For 3D position/rotation/scale, using the dedicated [constant TYPE_POSITION_3D], [constant TYPE_ROTATION_3D] and [constant TYPE_SCALE_3D] track types instead of [constant TYPE_VALUE] is recommended for performance reasons. */
            TYPE_VALUE = 0,
            
            /** 3D position track (values are stored in [Vector3]s). */
            TYPE_POSITION_3D = 1,
            
            /** 3D rotation track (values are stored in [Quaternion]s). */
            TYPE_ROTATION_3D = 2,
            
            /** 3D scale track (values are stored in [Vector3]s). */
            TYPE_SCALE_3D = 3,
            
            /** Blend shape track. */
            TYPE_BLEND_SHAPE = 4,
            
            /** Method tracks call functions with given arguments per key. */
            TYPE_METHOD = 5,
            
            /** Bezier tracks are used to interpolate a value using custom curves. They can also be used to animate sub-properties of vectors and colors (e.g. alpha value of a [Color]). */
            TYPE_BEZIER = 6,
            
            /** Audio tracks are used to play an audio stream with either type of [AudioStreamPlayer]. The stream can be trimmed and previewed in the animation. */
            TYPE_AUDIO = 7,
            
            /** Animation tracks play animations in other [AnimationPlayer] nodes. */
            TYPE_ANIMATION = 8,
        }
        enum InterpolationType {
            /** No interpolation (nearest value). */
            INTERPOLATION_NEAREST = 0,
            
            /** Linear interpolation. */
            INTERPOLATION_LINEAR = 1,
            
            /** Cubic interpolation. This looks smoother than linear interpolation, but is more expensive to interpolate. Stick to [constant INTERPOLATION_LINEAR] for complex 3D animations imported from external software, even if it requires using a higher animation framerate in return. */
            INTERPOLATION_CUBIC = 2,
            
            /** Linear interpolation with shortest path rotation.  
             *      
             *  **Note:** The result value is always normalized and may not match the key value.  
             */
            INTERPOLATION_LINEAR_ANGLE = 3,
            
            /** Cubic interpolation with shortest path rotation.  
             *      
             *  **Note:** The result value is always normalized and may not match the key value.  
             */
            INTERPOLATION_CUBIC_ANGLE = 4,
        }
        enum UpdateMode {
            /** Update between keyframes and hold the value. */
            UPDATE_CONTINUOUS = 0,
            
            /** Update at the keyframes. */
            UPDATE_DISCRETE = 1,
            
            /** Same as [constant UPDATE_CONTINUOUS] but works as a flag to capture the value of the current object and perform interpolation in some methods. See also [method AnimationMixer.capture], [member AnimationPlayer.playback_auto_capture], and [method AnimationPlayer.play_with_capture]. */
            UPDATE_CAPTURE = 2,
        }
        enum LoopMode {
            /** At both ends of the animation, the animation will stop playing. */
            LOOP_NONE = 0,
            
            /** At both ends of the animation, the animation will be repeated without changing the playback direction. */
            LOOP_LINEAR = 1,
            
            /** Repeats playback and reverse playback at both ends of the animation. */
            LOOP_PINGPONG = 2,
        }
        enum LoopedFlag {
            /** This flag indicates that the animation proceeds without any looping. */
            LOOPED_FLAG_NONE = 0,
            
            /** This flag indicates that the animation has reached the end of the animation and just after loop processed. */
            LOOPED_FLAG_END = 1,
            
            /** This flag indicates that the animation has reached the start of the animation and just after loop processed. */
            LOOPED_FLAG_START = 2,
        }
        enum FindMode {
            /** Finds the nearest time key. */
            FIND_MODE_NEAREST = 0,
            
            /** Finds only the key with approximating the time. */
            FIND_MODE_APPROX = 1,
            
            /** Finds only the key with matching the time. */
            FIND_MODE_EXACT = 2,
        }
    }
    /** Holds data that can be used to animate anything in the engine.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animation.html  
     */
    class Animation extends Resource {
        constructor(identifier?: any)
        /** Adds a track to the Animation. */
        add_track(type: Animation.TrackType, at_position: int64 = -1): int64
        
        /** Removes a track by specifying the track index. */
        remove_track(track_idx: int64): void
        
        /** Returns the amount of tracks in the animation. */
        get_track_count(): int64
        
        /** Gets the type of a track. */
        track_get_type(track_idx: int64): Animation.TrackType
        
        /** Gets the path of a track. For more information on the path format, see [method track_set_path]. */
        track_get_path(track_idx: int64): NodePath
        
        /** Sets the path of a track. Paths must be valid scene-tree paths to a node and must be specified starting from the [member AnimationMixer.root_node] that will reproduce the animation. Tracks that control properties or bones must append their name after the path, separated by `":"`.  
         *  For example, `"character/skeleton:ankle"` or `"character/mesh:transform/local"`.  
         */
        track_set_path(track_idx: int64, path: NodePath | string): void
        
        /** Returns the index of the specified track. If the track is not found, return -1. */
        find_track(path: NodePath | string, type: Animation.TrackType): int64
        
        /** Moves a track up. */
        track_move_up(track_idx: int64): void
        
        /** Moves a track down. */
        track_move_down(track_idx: int64): void
        
        /** Changes the index position of track [param track_idx] to the one defined in [param to_idx]. */
        track_move_to(track_idx: int64, to_idx: int64): void
        
        /** Swaps the track [param track_idx]'s index position with the track [param with_idx]. */
        track_swap(track_idx: int64, with_idx: int64): void
        
        /** Sets the given track as imported or not. */
        track_set_imported(track_idx: int64, imported: boolean): void
        
        /** Returns `true` if the given track is imported. Else, return `false`. */
        track_is_imported(track_idx: int64): boolean
        
        /** Enables/disables the given track. Tracks are enabled by default. */
        track_set_enabled(track_idx: int64, enabled: boolean): void
        
        /** Returns `true` if the track at index [param track_idx] is enabled. */
        track_is_enabled(track_idx: int64): boolean
        
        /** Inserts a key in a given 3D position track. Returns the key index. */
        position_track_insert_key(track_idx: int64, time: float64, position: Vector3): int64
        
        /** Inserts a key in a given 3D rotation track. Returns the key index. */
        rotation_track_insert_key(track_idx: int64, time: float64, rotation: Quaternion): int64
        
        /** Inserts a key in a given 3D scale track. Returns the key index. */
        scale_track_insert_key(track_idx: int64, time: float64, scale: Vector3): int64
        
        /** Inserts a key in a given blend shape track. Returns the key index. */
        blend_shape_track_insert_key(track_idx: int64, time: float64, amount: float64): int64
        
        /** Returns the interpolated position value at the given time (in seconds). The [param track_idx] must be the index of a 3D position track. */
        position_track_interpolate(track_idx: int64, time_sec: float64, backward: boolean = false): Vector3
        
        /** Returns the interpolated rotation value at the given time (in seconds). The [param track_idx] must be the index of a 3D rotation track. */
        rotation_track_interpolate(track_idx: int64, time_sec: float64, backward: boolean = false): Quaternion
        
        /** Returns the interpolated scale value at the given time (in seconds). The [param track_idx] must be the index of a 3D scale track. */
        scale_track_interpolate(track_idx: int64, time_sec: float64, backward: boolean = false): Vector3
        
        /** Returns the interpolated blend shape value at the given time (in seconds). The [param track_idx] must be the index of a blend shape track. */
        blend_shape_track_interpolate(track_idx: int64, time_sec: float64, backward: boolean = false): float64
        
        /** Inserts a generic key in a given track. Returns the key index. */
        track_insert_key(track_idx: int64, time: float64, key: any, transition: float64 = 1): int64
        
        /** Removes a key by index in a given track. */
        track_remove_key(track_idx: int64, key_idx: int64): void
        
        /** Removes a key at [param time] in a given track. */
        track_remove_key_at_time(track_idx: int64, time: float64): void
        
        /** Sets the value of an existing key. */
        track_set_key_value(track_idx: int64, key: int64, value: any): void
        
        /** Sets the transition curve (easing) for a specific key (see the built-in math function [method @GlobalScope.ease]). */
        track_set_key_transition(track_idx: int64, key_idx: int64, transition: float64): void
        
        /** Sets the time of an existing key. */
        track_set_key_time(track_idx: int64, key_idx: int64, time: float64): void
        
        /** Returns the transition curve (easing) for a specific key (see the built-in math function [method @GlobalScope.ease]). */
        track_get_key_transition(track_idx: int64, key_idx: int64): float64
        
        /** Returns the number of keys in a given track. */
        track_get_key_count(track_idx: int64): int64
        
        /** Returns the value of a given key in a given track. */
        track_get_key_value(track_idx: int64, key_idx: int64): any
        
        /** Returns the time at which the key is located. */
        track_get_key_time(track_idx: int64, key_idx: int64): float64
        
        /** Finds the key index by time in a given track. Optionally, only find it if the approx/exact time is given.  
         *  If [param limit] is `true`, it does not return keys outside the animation range.  
         *  If [param backward] is `true`, the direction is reversed in methods that rely on one directional processing.  
         *  For example, in case [param find_mode] is [constant FIND_MODE_NEAREST], if there is no key in the current position just after seeked, the first key found is retrieved by searching before the position, but if [param backward] is `true`, the first key found is retrieved after the position.  
         */
        track_find_key(track_idx: int64, time: float64, find_mode: Animation.FindMode = 0, limit: boolean = false, backward: boolean = false): int64
        
        /** Sets the interpolation type of a given track. */
        track_set_interpolation_type(track_idx: int64, interpolation: Animation.InterpolationType): void
        
        /** Returns the interpolation type of a given track. */
        track_get_interpolation_type(track_idx: int64): Animation.InterpolationType
        
        /** If `true`, the track at [param track_idx] wraps the interpolation loop. */
        track_set_interpolation_loop_wrap(track_idx: int64, interpolation: boolean): void
        
        /** Returns `true` if the track at [param track_idx] wraps the interpolation loop. New tracks wrap the interpolation loop by default. */
        track_get_interpolation_loop_wrap(track_idx: int64): boolean
        
        /** Returns `true` if the track is compressed, `false` otherwise. See also [method compress]. */
        track_is_compressed(track_idx: int64): boolean
        
        /** Sets the update mode (see [enum UpdateMode]) of a value track. */
        value_track_set_update_mode(track_idx: int64, mode: Animation.UpdateMode): void
        
        /** Returns the update mode of a value track. */
        value_track_get_update_mode(track_idx: int64): Animation.UpdateMode
        
        /** Returns the interpolated value at the given time (in seconds). The [param track_idx] must be the index of a value track.  
         *  A [param backward] mainly affects the direction of key retrieval of the track with [constant UPDATE_DISCRETE] converted by [constant AnimationMixer.ANIMATION_CALLBACK_MODE_DISCRETE_FORCE_CONTINUOUS] to match the result with [method track_find_key].  
         */
        value_track_interpolate(track_idx: int64, time_sec: float64, backward: boolean = false): any
        
        /** Returns the method name of a method track. */
        method_track_get_name(track_idx: int64, key_idx: int64): StringName
        
        /** Returns the arguments values to be called on a method track for a given key in a given track. */
        method_track_get_params(track_idx: int64, key_idx: int64): GArray
        
        /** Inserts a Bezier Track key at the given [param time] in seconds. The [param track_idx] must be the index of a Bezier Track.  
         *  [param in_handle] is the left-side weight of the added Bezier curve point, [param out_handle] is the right-side one, while [param value] is the actual value at this point.  
         */
        bezier_track_insert_key(track_idx: int64, time: float64, value: float64, in_handle: Vector2 = Vector2.ZERO, out_handle: Vector2 = Vector2.ZERO): int64
        
        /** Sets the value of the key identified by [param key_idx] to the given value. The [param track_idx] must be the index of a Bezier Track. */
        bezier_track_set_key_value(track_idx: int64, key_idx: int64, value: float64): void
        
        /** Sets the in handle of the key identified by [param key_idx] to value [param in_handle]. The [param track_idx] must be the index of a Bezier Track. */
        bezier_track_set_key_in_handle(track_idx: int64, key_idx: int64, in_handle: Vector2, balanced_value_time_ratio: float64 = 1): void
        
        /** Sets the out handle of the key identified by [param key_idx] to value [param out_handle]. The [param track_idx] must be the index of a Bezier Track. */
        bezier_track_set_key_out_handle(track_idx: int64, key_idx: int64, out_handle: Vector2, balanced_value_time_ratio: float64 = 1): void
        
        /** Returns the value of the key identified by [param key_idx]. The [param track_idx] must be the index of a Bezier Track. */
        bezier_track_get_key_value(track_idx: int64, key_idx: int64): float64
        
        /** Returns the in handle of the key identified by [param key_idx]. The [param track_idx] must be the index of a Bezier Track. */
        bezier_track_get_key_in_handle(track_idx: int64, key_idx: int64): Vector2
        
        /** Returns the out handle of the key identified by [param key_idx]. The [param track_idx] must be the index of a Bezier Track. */
        bezier_track_get_key_out_handle(track_idx: int64, key_idx: int64): Vector2
        
        /** Returns the interpolated value at the given [param time] (in seconds). The [param track_idx] must be the index of a Bezier Track. */
        bezier_track_interpolate(track_idx: int64, time: float64): float64
        
        /** Inserts an Audio Track key at the given [param time] in seconds. The [param track_idx] must be the index of an Audio Track.  
         *  [param stream] is the [AudioStream] resource to play. [param start_offset] is the number of seconds cut off at the beginning of the audio stream, while [param end_offset] is at the ending.  
         */
        audio_track_insert_key(track_idx: int64, time: float64, stream: Resource, start_offset: float64 = 0, end_offset: float64 = 0): int64
        
        /** Sets the stream of the key identified by [param key_idx] to value [param stream]. The [param track_idx] must be the index of an Audio Track. */
        audio_track_set_key_stream(track_idx: int64, key_idx: int64, stream: Resource): void
        
        /** Sets the start offset of the key identified by [param key_idx] to value [param offset]. The [param track_idx] must be the index of an Audio Track. */
        audio_track_set_key_start_offset(track_idx: int64, key_idx: int64, offset: float64): void
        
        /** Sets the end offset of the key identified by [param key_idx] to value [param offset]. The [param track_idx] must be the index of an Audio Track. */
        audio_track_set_key_end_offset(track_idx: int64, key_idx: int64, offset: float64): void
        
        /** Returns the audio stream of the key identified by [param key_idx]. The [param track_idx] must be the index of an Audio Track. */
        audio_track_get_key_stream(track_idx: int64, key_idx: int64): Resource
        
        /** Returns the start offset of the key identified by [param key_idx]. The [param track_idx] must be the index of an Audio Track.  
         *  Start offset is the number of seconds cut off at the beginning of the audio stream.  
         */
        audio_track_get_key_start_offset(track_idx: int64, key_idx: int64): float64
        
        /** Returns the end offset of the key identified by [param key_idx]. The [param track_idx] must be the index of an Audio Track.  
         *  End offset is the number of seconds cut off at the ending of the audio stream.  
         */
        audio_track_get_key_end_offset(track_idx: int64, key_idx: int64): float64
        
        /** Sets whether the track will be blended with other animations. If `true`, the audio playback volume changes depending on the blend value. */
        audio_track_set_use_blend(track_idx: int64, enable: boolean): void
        
        /** Returns `true` if the track at [param track_idx] will be blended with other animations. */
        audio_track_is_use_blend(track_idx: int64): boolean
        
        /** Inserts a key with value [param animation] at the given [param time] (in seconds). The [param track_idx] must be the index of an Animation Track. */
        animation_track_insert_key(track_idx: int64, time: float64, animation: StringName): int64
        
        /** Sets the key identified by [param key_idx] to value [param animation]. The [param track_idx] must be the index of an Animation Track. */
        animation_track_set_key_animation(track_idx: int64, key_idx: int64, animation: StringName): void
        
        /** Returns the animation name at the key identified by [param key_idx]. The [param track_idx] must be the index of an Animation Track. */
        animation_track_get_key_animation(track_idx: int64, key_idx: int64): StringName
        
        /** Clear the animation (clear all tracks and reset all). */
        clear(): void
        
        /** Adds a new track to [param to_animation] that is a copy of the given track from this animation. */
        copy_track(track_idx: int64, to_animation: Animation): void
        
        /** Compress the animation and all its tracks in-place. This will make [method track_is_compressed] return `true` once called on this [Animation]. Compressed tracks require less memory to be played, and are designed to be used for complex 3D animations (such as cutscenes) imported from external 3D software. Compression is lossy, but the difference is usually not noticeable in real world conditions.  
         *      
         *  **Note:** Compressed tracks have various limitations (such as not being editable from the editor), so only use compressed animations if you actually need them.  
         */
        compress(page_size: int64 = 8192, fps: int64 = 120, split_tolerance: float64 = 4): void
        
        /** The total length of the animation (in seconds).  
         *      
         *  **Note:** Length is not delimited by the last key, as this one may be before or after the end to ensure correct interpolation and looping.  
         */
        get length(): float64
        set length(value: float64)
        
        /** Determines the behavior of both ends of the animation timeline during animation playback. This is used for correct interpolation of animation cycles, and for hinting the player that it must restart the animation. */
        get loop_mode(): int64
        set loop_mode(value: int64)
        
        /** The animation step value. */
        get step(): float64
        set step(value: float64)
        
        /** Returns `true` if the capture track is included. This is a cached readonly value for performance. */
        get capture_included(): boolean
    }
    class AnimationBezierTrackEdit extends Control {
        constructor(identifier?: any)
        _clear_selection(): void
        _clear_selection_for_anim(_unnamed_arg0: Animation): void
        _select_at_anim(_unnamed_arg0: Animation, _unnamed_arg1: int64, _unnamed_arg2: float64, _unnamed_arg3: boolean): void
        _update_hidden_tracks_after(_unnamed_arg0: int64): void
        _update_locked_tracks_after(_unnamed_arg0: int64): void
        _bezier_track_insert_key_at_anim(_unnamed_arg0: Animation, _unnamed_arg1: int64, _unnamed_arg2: float64, _unnamed_arg3: float64, _unnamed_arg4: Vector2, _unnamed_arg5: Vector2, _unnamed_arg6: any /*Animation.HandleMode*/): void
        readonly select_key: Signal3<int64, boolean, int64>
        readonly deselect_key: Signal2<int64, int64>
        readonly clear_selection: Signal0
    }
    /** Container for [Animation] resources.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationlibrary.html  
     */
    class AnimationLibrary extends Resource {
        constructor(identifier?: any)
        /** Adds the [param animation] to the library, accessible by the key [param name]. */
        add_animation(name: StringName, animation: Animation): GError
        
        /** Removes the [Animation] with the key [param name]. */
        remove_animation(name: StringName): void
        
        /** Changes the key of the [Animation] associated with the key [param name] to [param newname]. */
        rename_animation(name: StringName, newname: StringName): void
        
        /** Returns `true` if the library stores an [Animation] with [param name] as the key. */
        has_animation(name: StringName): boolean
        
        /** Returns the [Animation] with the key [param name]. If the animation does not exist, `null` is returned and an error is logged. */
        get_animation(name: StringName): Animation
        
        /** Returns the keys for the [Animation]s stored in the library. */
        get_animation_list(): GArray
        get _data(): GDictionary
        set _data(value: GDictionary)
        
        /** Emitted when an [Animation] is added, under the key [param name]. */
        readonly animation_added: Signal1<StringName>
        
        /** Emitted when an [Animation] stored with the key [param name] is removed. */
        readonly animation_removed: Signal1<StringName>
        
        /** Emitted when the key for an [Animation] is changed, from [param name] to [param to_name]. */
        readonly animation_renamed: Signal2<StringName, StringName>
        
        /** Emitted when there's a change in one of the animations, e.g. tracks are added, moved or have changed paths. [param name] is the key of the animation that was changed.  
         *  See also [signal Resource.changed], which this acts as a relay for.  
         */
        readonly animation_changed: Signal1<StringName>
    }
    class AnimationLibraryEditor extends AcceptDialog {
        constructor(identifier?: any)
        _update_editor(mixer: Object): void
        readonly update_editor: Signal0
    }
    namespace AnimationMixer {
        enum AnimationCallbackModeProcess {
            /** Process animation during physics frames (see [constant Node.NOTIFICATION_INTERNAL_PHYSICS_PROCESS]). This is especially useful when animating physics bodies. */
            ANIMATION_CALLBACK_MODE_PROCESS_PHYSICS = 0,
            
            /** Process animation during process frames (see [constant Node.NOTIFICATION_INTERNAL_PROCESS]). */
            ANIMATION_CALLBACK_MODE_PROCESS_IDLE = 1,
            
            /** Do not process animation. Use [method advance] to process the animation manually. */
            ANIMATION_CALLBACK_MODE_PROCESS_MANUAL = 2,
        }
        enum AnimationCallbackModeMethod {
            /** Batch method calls during the animation process, then do the calls after events are processed. This avoids bugs involving deleting nodes or modifying the AnimationPlayer while playing. */
            ANIMATION_CALLBACK_MODE_METHOD_DEFERRED = 0,
            
            /** Make method calls immediately when reached in the animation. */
            ANIMATION_CALLBACK_MODE_METHOD_IMMEDIATE = 1,
        }
        enum AnimationCallbackModeDiscrete {
            /** An [constant Animation.UPDATE_DISCRETE] track value takes precedence when blending [constant Animation.UPDATE_CONTINUOUS] or [constant Animation.UPDATE_CAPTURE] track values and [constant Animation.UPDATE_DISCRETE] track values. */
            ANIMATION_CALLBACK_MODE_DISCRETE_DOMINANT = 0,
            
            /** An [constant Animation.UPDATE_CONTINUOUS] or [constant Animation.UPDATE_CAPTURE] track value takes precedence when blending the [constant Animation.UPDATE_CONTINUOUS] or [constant Animation.UPDATE_CAPTURE] track values and the [constant Animation.UPDATE_DISCRETE] track values. This is the default behavior for [AnimationPlayer]. */
            ANIMATION_CALLBACK_MODE_DISCRETE_RECESSIVE = 1,
            
            /** Always treat the [constant Animation.UPDATE_DISCRETE] track value as [constant Animation.UPDATE_CONTINUOUS] with [constant Animation.INTERPOLATION_NEAREST]. This is the default behavior for [AnimationTree].  
             *  If a value track has non-numeric type key values, it is internally converted to use [constant ANIMATION_CALLBACK_MODE_DISCRETE_RECESSIVE] with [constant Animation.UPDATE_DISCRETE].  
             */
            ANIMATION_CALLBACK_MODE_DISCRETE_FORCE_CONTINUOUS = 2,
        }
    }
    /** Base class for [AnimationPlayer] and [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationmixer.html  
     */
    class AnimationMixer extends Node {
        constructor(identifier?: any)
        /** A virtual function for processing after getting a key during playback. */
        /* gdvirtual */ _post_process_key_value(animation: Animation, track: int64, value: any, object_id: int64, object_sub_idx: int64): any
        
        /** Adds [param library] to the animation player, under the key [param name].  
         *  AnimationMixer has a global library by default with an empty string as key. For adding an animation to the global library:  
         *    
         */
        add_animation_library(name: StringName, library: AnimationLibrary): GError
        
        /** Removes the [AnimationLibrary] associated with the key [param name]. */
        remove_animation_library(name: StringName): void
        
        /** Moves the [AnimationLibrary] associated with the key [param name] to the key [param newname]. */
        rename_animation_library(name: StringName, newname: StringName): void
        
        /** Returns `true` if the [AnimationMixer] stores an [AnimationLibrary] with key [param name]. */
        has_animation_library(name: StringName): boolean
        
        /** Returns the first [AnimationLibrary] with key [param name] or `null` if not found.  
         *  To get the [AnimationMixer]'s global animation library, use `get_animation_library("")`.  
         */
        get_animation_library(name: StringName): AnimationLibrary
        
        /** Returns the list of stored library keys. */
        get_animation_library_list(): GArray
        
        /** Returns `true` if the [AnimationMixer] stores an [Animation] with key [param name]. */
        has_animation(name: StringName): boolean
        
        /** Returns the [Animation] with the key [param name]. If the animation does not exist, `null` is returned and an error is logged. */
        get_animation(name: StringName): Animation
        
        /** Returns the list of stored animation keys. */
        get_animation_list(): PackedStringArray
        
        /** Retrieve the motion delta of position with the [member root_motion_track] as a [Vector3] that can be used elsewhere.  
         *  If [member root_motion_track] is not a path to a track of type [constant Animation.TYPE_POSITION_3D], returns `Vector3(0, 0, 0)`.  
         *  See also [member root_motion_track] and [RootMotionView].  
         *  The most basic example is applying position to [CharacterBody3D]:  
         *    
         *  By using this in combination with [method get_root_motion_rotation_accumulator], you can apply the root motion position more correctly to account for the rotation of the node.  
         *    
         */
        get_root_motion_position(): Vector3
        
        /** Retrieve the motion delta of rotation with the [member root_motion_track] as a [Quaternion] that can be used elsewhere.  
         *  If [member root_motion_track] is not a path to a track of type [constant Animation.TYPE_ROTATION_3D], returns `Quaternion(0, 0, 0, 1)`.  
         *  See also [member root_motion_track] and [RootMotionView].  
         *  The most basic example is applying rotation to [CharacterBody3D]:  
         *    
         */
        get_root_motion_rotation(): Quaternion
        
        /** Retrieve the motion delta of scale with the [member root_motion_track] as a [Vector3] that can be used elsewhere.  
         *  If [member root_motion_track] is not a path to a track of type [constant Animation.TYPE_SCALE_3D], returns `Vector3(0, 0, 0)`.  
         *  See also [member root_motion_track] and [RootMotionView].  
         *  The most basic example is applying scale to [CharacterBody3D]:  
         *    
         */
        get_root_motion_scale(): Vector3
        
        /** Retrieve the blended value of the position tracks with the [member root_motion_track] as a [Vector3] that can be used elsewhere.  
         *  This is useful in cases where you want to respect the initial key values of the animation.  
         *  For example, if an animation with only one key `Vector3(0, 0, 0)` is played in the previous frame and then an animation with only one key `Vector3(1, 0, 1)` is played in the next frame, the difference can be calculated as follows:  
         *    
         *  However, if the animation loops, an unintended discrete change may occur, so this is only useful for some simple use cases.  
         */
        get_root_motion_position_accumulator(): Vector3
        
        /** Retrieve the blended value of the rotation tracks with the [member root_motion_track] as a [Quaternion] that can be used elsewhere.  
         *  This is necessary to apply the root motion position correctly, taking rotation into account. See also [method get_root_motion_position].  
         *  Also, this is useful in cases where you want to respect the initial key values of the animation.  
         *  For example, if an animation with only one key `Quaternion(0, 0, 0, 1)` is played in the previous frame and then an animation with only one key `Quaternion(0, 0.707, 0, 0.707)` is played in the next frame, the difference can be calculated as follows:  
         *    
         *  However, if the animation loops, an unintended discrete change may occur, so this is only useful for some simple use cases.  
         */
        get_root_motion_rotation_accumulator(): Quaternion
        
        /** Retrieve the blended value of the scale tracks with the [member root_motion_track] as a [Vector3] that can be used elsewhere.  
         *  For example, if an animation with only one key `Vector3(1, 1, 1)` is played in the previous frame and then an animation with only one key `Vector3(2, 2, 2)` is played in the next frame, the difference can be calculated as follows:  
         *    
         *  However, if the animation loops, an unintended discrete change may occur, so this is only useful for some simple use cases.  
         */
        get_root_motion_scale_accumulator(): Vector3
        
        /** [AnimationMixer] caches animated nodes. It may not notice if a node disappears; [method clear_caches] forces it to update the cache again. */
        clear_caches(): void
        
        /** Manually advance the animations by the specified time (in seconds). */
        advance(delta: float64): void
        
        /** If the animation track specified by [param name] has an option [constant Animation.UPDATE_CAPTURE], stores current values of the objects indicated by the track path as a cache. If there is already a captured cache, the old cache is discarded.  
         *  After this it will interpolate with current animation blending result during the playback process for the time specified by [param duration], working like a crossfade.  
         *  You can specify [param trans_type] as the curve for the interpolation. For better results, it may be appropriate to specify [constant Tween.TRANS_LINEAR] for cases where the first key of the track begins with a non-zero value or where the key value does not change, and [constant Tween.TRANS_QUAD] for cases where the key value changes linearly.  
         */
        capture(name: StringName, duration: float64, trans_type: Tween.TransitionType = 0, ease_type: Tween.EaseType = 0): void
        _reset(): void
        _restore(backup: any /*AnimatedValuesBackup*/): void
        
        /** Returns the key of [param animation] or an empty [StringName] if not found. */
        find_animation(animation: Animation): StringName
        
        /** Returns the key for the [AnimationLibrary] that contains [param animation] or an empty [StringName] if not found. */
        find_animation_library(animation: Animation): StringName
        
        /** If `true`, the [AnimationMixer] will be processing. */
        get active(): boolean
        set active(value: boolean)
        
        /** If `true`, the blending uses the deterministic algorithm. The total weight is not normalized and the result is accumulated with an initial value (`0` or a `"RESET"` animation if present).  
         *  This means that if the total amount of blending is `0.0`, the result is equal to the `"RESET"` animation.  
         *  If the number of tracks between the blended animations is different, the animation with the missing track is treated as if it had the initial value.  
         *  If `false`, The blend does not use the deterministic algorithm. The total weight is normalized and always `1.0`. If the number of tracks between the blended animations is different, nothing is done about the animation that is missing a track.  
         *      
         *  **Note:** In [AnimationTree], the blending with [AnimationNodeAdd2], [AnimationNodeAdd3], [AnimationNodeSub2] or the weight greater than `1.0` may produce unexpected results.  
         *  For example, if [AnimationNodeAdd2] blends two nodes with the amount `1.0`, then total weight is `2.0` but it will be normalized to make the total amount `1.0` and the result will be equal to [AnimationNodeBlend2] with the amount `0.5`.  
         */
        get deterministic(): boolean
        set deterministic(value: boolean)
        
        /** This is used by the editor. If set to `true`, the scene will be saved with the effects of the reset animation (the animation with the key `"RESET"`) applied as if it had been seeked to time 0, with the editor keeping the values that the scene had before saving.  
         *  This makes it more convenient to preview and edit animations in the editor, as changes to the scene will not be saved as long as they are set in the reset animation.  
         */
        get reset_on_save(): boolean
        set reset_on_save(value: boolean)
        
        /** The node which node path references will travel from. */
        get root_node(): NodePath
        set root_node(value: NodePath | string)
        
        /** The path to the Animation track used for root motion. Paths must be valid scene-tree paths to a node, and must be specified starting from the parent node of the node that will reproduce the animation. The [member root_motion_track] uses the same format as [method Animation.track_set_path], but note that a bone must be specified.  
         *  If the track has type [constant Animation.TYPE_POSITION_3D], [constant Animation.TYPE_ROTATION_3D], or [constant Animation.TYPE_SCALE_3D] the transformation will be canceled visually, and the animation will appear to stay in place. See also [method get_root_motion_position], [method get_root_motion_rotation], [method get_root_motion_scale], and [RootMotionView].  
         */
        get root_motion_track(): NodePath
        set root_motion_track(value: NodePath | string)
        
        /** The number of possible simultaneous sounds for each of the assigned AudioStreamPlayers.  
         *  For example, if this value is `32` and the animation has two audio tracks, the two [AudioStreamPlayer]s assigned can play simultaneously up to `32` voices each.  
         */
        get audio_max_polyphony(): int64
        set audio_max_polyphony(value: int64)
        
        /** The process notification in which to update animations. */
        get callback_mode_process(): int64
        set callback_mode_process(value: int64)
        
        /** The call mode used for "Call Method" tracks. */
        get callback_mode_method(): int64
        set callback_mode_method(value: int64)
        
        /** Ordinarily, tracks can be set to [constant Animation.UPDATE_DISCRETE] to update infrequently, usually when using nearest interpolation.  
         *  However, when blending with [constant Animation.UPDATE_CONTINUOUS] several results are considered. The [member callback_mode_discrete] specify it explicitly. See also [enum AnimationCallbackModeDiscrete].  
         *  To make the blended results look good, it is recommended to set this to [constant ANIMATION_CALLBACK_MODE_DISCRETE_FORCE_CONTINUOUS] to update every frame during blending. Other values exist for compatibility and they are fine if there is no blending, but not so, may produce artifacts.  
         */
        get callback_mode_discrete(): int64
        set callback_mode_discrete(value: int64)
        
        /** Notifies when an animation list is changed. */
        readonly animation_list_changed: Signal0
        
        /** Notifies when the animation libraries have changed. */
        readonly animation_libraries_updated: Signal0
        
        /** Notifies when an animation finished playing.  
         *      
         *  **Note:** This signal is not emitted if an animation is looping.  
         */
        readonly animation_finished: Signal1<StringName>
        
        /** Notifies when an animation starts playing. */
        readonly animation_started: Signal1<StringName>
        
        /** Notifies when the caches have been cleared, either automatically, or manually via [method clear_caches]. */
        readonly caches_cleared: Signal0
        
        /** Notifies when the blending result related have been applied to the target objects. */
        readonly mixer_applied: Signal0
        
        /** Notifies when the property related process have been updated. */
        readonly mixer_updated: Signal0
    }
    namespace AnimationNode {
        enum FilterAction {
            /** Do not use filtering. */
            FILTER_IGNORE = 0,
            
            /** Paths matching the filter will be allowed to pass. */
            FILTER_PASS = 1,
            
            /** Paths matching the filter will be discarded. */
            FILTER_STOP = 2,
            
            /** Paths matching the filter will be blended (by the blend value). */
            FILTER_BLEND = 3,
        }
    }
    /** Base class for [AnimationTree] nodes. Not related to scene nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnode.html  
     */
    class AnimationNode extends Resource {
        constructor(identifier?: any)
        /** When inheriting from [AnimationRootNode], implement this virtual method to return all child animation nodes in order as a `name: node` dictionary. */
        /* gdvirtual */ _get_child_nodes(): GDictionary
        
        /** When inheriting from [AnimationRootNode], implement this virtual method to return a list of the properties on this animation node. Parameters are custom local memory used for your animation nodes, given a resource can be reused in multiple trees. Format is similar to [method Object.get_property_list]. */
        /* gdvirtual */ _get_parameter_list(): GArray
        
        /** When inheriting from [AnimationRootNode], implement this virtual method to return a child animation node by its [param name]. */
        /* gdvirtual */ _get_child_by_name(name: StringName): AnimationNode
        
        /** When inheriting from [AnimationRootNode], implement this virtual method to return the default value of a [param parameter]. Parameters are custom local memory used for your animation nodes, given a resource can be reused in multiple trees. */
        /* gdvirtual */ _get_parameter_default_value(parameter: StringName): any
        
        /** When inheriting from [AnimationRootNode], implement this virtual method to return whether the [param parameter] is read-only. Parameters are custom local memory used for your animation nodes, given a resource can be reused in multiple trees. */
        /* gdvirtual */ _is_parameter_read_only(parameter: StringName): boolean
        
        /** When inheriting from [AnimationRootNode], implement this virtual method to run some code when this animation node is processed. The [param time] parameter is a relative delta, unless [param seek] is `true`, in which case it is absolute.  
         *  Here, call the [method blend_input], [method blend_node] or [method blend_animation] functions. You can also use [method get_parameter] and [method set_parameter] to modify local memory.  
         *  This function should return the delta.  
         */
        /* gdvirtual */ _process(time: float64, seek: boolean, is_external_seeking: boolean, test_only: boolean): float64
        
        /** When inheriting from [AnimationRootNode], implement this virtual method to override the text caption for this animation node. */
        /* gdvirtual */ _get_caption(): string
        
        /** When inheriting from [AnimationRootNode], implement this virtual method to return whether the blend tree editor should display filter editing on this animation node. */
        /* gdvirtual */ _has_filter(): boolean
        
        /** Adds an input to the animation node. This is only useful for animation nodes created for use in an [AnimationNodeBlendTree]. If the addition fails, returns `false`. */
        add_input(name: string): boolean
        
        /** Removes an input, call this only when inactive. */
        remove_input(index: int64): void
        
        /** Sets the name of the input at the given [param input] index. If the setting fails, returns `false`. */
        set_input_name(input: int64, name: string): boolean
        
        /** Gets the name of an input by index. */
        get_input_name(input: int64): string
        
        /** Amount of inputs in this animation node, only useful for animation nodes that go into [AnimationNodeBlendTree]. */
        get_input_count(): int64
        
        /** Returns the input index which corresponds to [param name]. If not found, returns `-1`. */
        find_input(name: string): int64
        
        /** Adds or removes a path for the filter. */
        set_filter_path(path: NodePath | string, enable: boolean): void
        
        /** Returns whether the given path is filtered. */
        is_path_filtered(path: NodePath | string): boolean
        
        /** Blend an animation by [param blend] amount (name must be valid in the linked [AnimationPlayer]). A [param time] and [param delta] may be passed, as well as whether [param seeked] happened.  
         *  A [param looped_flag] is used by internal processing immediately after the loop. See also [enum Animation.LoopedFlag].  
         */
        blend_animation(animation: StringName, time: float64, delta: float64, seeked: boolean, is_external_seeking: boolean, blend: float64, looped_flag: Animation.LoopedFlag = 0): void
        
        /** Blend another animation node (in case this animation node contains child animation nodes). This function is only useful if you inherit from [AnimationRootNode] instead, otherwise editors will not display your animation node for addition. */
        blend_node(name: StringName, node: AnimationNode, time: float64, seek: boolean, is_external_seeking: boolean, blend: float64, filter: AnimationNode.FilterAction = 0, sync: boolean = true, test_only: boolean = false): float64
        
        /** Blend an input. This is only useful for animation nodes created for an [AnimationNodeBlendTree]. The [param time] parameter is a relative delta, unless [param seek] is `true`, in which case it is absolute. A filter mode may be optionally passed (see [enum FilterAction] for options). */
        blend_input(input_index: int64, time: float64, seek: boolean, is_external_seeking: boolean, blend: float64, filter: AnimationNode.FilterAction = 0, sync: boolean = true, test_only: boolean = false): float64
        
        /** Sets a custom parameter. These are used as local memory, because resources can be reused across the tree or scenes. */
        set_parameter(name: StringName, value: any): void
        
        /** Gets the value of a parameter. Parameters are custom local memory used for your animation nodes, given a resource can be reused in multiple trees. */
        get_parameter(name: StringName): any
        
        /** If `true`, filtering is enabled. */
        get filter_enabled(): boolean
        set filter_enabled(value: boolean)
        get filters(): GArray
        set filters(value: GArray)
        
        /** Emitted by nodes that inherit from this class and that have an internal tree when one of their animation nodes changes. The animation nodes that emit this signal are [AnimationNodeBlendSpace1D], [AnimationNodeBlendSpace2D], [AnimationNodeStateMachine], [AnimationNodeBlendTree] and [AnimationNodeTransition]. */
        readonly tree_changed: Signal0
        
        /** Emitted by nodes that inherit from this class and that have an internal tree when one of their animation node names changes. The animation nodes that emit this signal are [AnimationNodeBlendSpace1D], [AnimationNodeBlendSpace2D], [AnimationNodeStateMachine], and [AnimationNodeBlendTree]. */
        readonly animation_node_renamed: Signal3<int64, string, string>
        
        /** Emitted by nodes that inherit from this class and that have an internal tree when one of their animation nodes removes. The animation nodes that emit this signal are [AnimationNodeBlendSpace1D], [AnimationNodeBlendSpace2D], [AnimationNodeStateMachine], and [AnimationNodeBlendTree]. */
        readonly animation_node_removed: Signal2<int64, string>
    }
    /** Blends two animations additively inside of an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeadd2.html  
     */
    class AnimationNodeAdd2 extends AnimationNodeSync {
        constructor(identifier?: any)
    }
    /** Blends two of three animations additively inside of an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeadd3.html  
     */
    class AnimationNodeAdd3 extends AnimationNodeSync {
        constructor(identifier?: any)
    }
    namespace AnimationNodeAnimation {
        enum PlayMode {
            /** Plays animation in forward direction. */
            PLAY_MODE_FORWARD = 0,
            
            /** Plays animation in backward direction. */
            PLAY_MODE_BACKWARD = 1,
        }
    }
    /** An input animation for an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeanimation.html  
     */
    class AnimationNodeAnimation extends AnimationRootNode {
        constructor(identifier?: any)
        /** Animation to use as an output. It is one of the animations provided by [member AnimationTree.anim_player]. */
        get animation(): StringName
        set animation(value: StringName)
        
        /** Determines the playback direction of the animation. */
        get play_mode(): int64
        set play_mode(value: int64)
        
        /** If `true`, [AnimationNode] provides an animation based on the [Animation] resource with some parameters adjusted. */
        get use_custom_timeline(): boolean
        set use_custom_timeline(value: boolean)
        
        /** If [member use_custom_timeline] is `true`, offset the start position of the animation. */
        get timeline_length(): float64
        set timeline_length(value: float64)
        
        /** If `true`, scales the time so that the length specified in [member timeline_length] is one cycle.  
         *  This is useful for matching the periods of walking and running animations.  
         *  If `false`, the original animation length is respected. If you set the loop to [member loop_mode], the animation will loop in [member timeline_length].  
         */
        get stretch_time_scale(): boolean
        set stretch_time_scale(value: boolean)
        
        /** If [member use_custom_timeline] is `true`, offset the start position of the animation.  
         *  This is useful for adjusting which foot steps first in 3D walking animations.  
         */
        get start_offset(): float64
        set start_offset(value: float64)
        
        /** If [member use_custom_timeline] is `true`, override the loop settings of the original [Animation] resource with the value.  
         *      
         *  **Note:** If the [member Animation.loop_mode] isn't set to looping, the [method Animation.track_set_interpolation_loop_wrap] option will not be respected. If you cannot get the expected behavior, consider duplicating the [Animation] resource and changing the loop settings.  
         */
        get loop_mode(): int64
        set loop_mode(value: int64)
    }
    /** Blends two animations linearly inside of an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeblend2.html  
     */
    class AnimationNodeBlend2 extends AnimationNodeSync {
        constructor(identifier?: any)
    }
    /** Blends two of three animations linearly inside of an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeblend3.html  
     */
    class AnimationNodeBlend3 extends AnimationNodeSync {
        constructor(identifier?: any)
    }
    namespace AnimationNodeBlendSpace1D {
        enum BlendMode {
            /** The interpolation between animations is linear. */
            BLEND_MODE_INTERPOLATED = 0,
            
            /** The blend space plays the animation of the animation node which blending position is closest to. Useful for frame-by-frame 2D animations. */
            BLEND_MODE_DISCRETE = 1,
            
            /** Similar to [constant BLEND_MODE_DISCRETE], but starts the new animation at the last animation's playback position. */
            BLEND_MODE_DISCRETE_CARRY = 2,
        }
    }
    /** A set of [AnimationRootNode]s placed on a virtual axis, crossfading between the two adjacent ones. Used by [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeblendspace1d.html  
     */
    class AnimationNodeBlendSpace1D extends AnimationRootNode {
        constructor(identifier?: any)
        /** Adds a new point that represents a [param node] on the virtual axis at a given position set by [param pos]. You can insert it at a specific index using the [param at_index] argument. If you use the default value for [param at_index], the point is inserted at the end of the blend points array. */
        add_blend_point(node: AnimationRootNode, pos: float64, at_index: int64 = -1): void
        
        /** Updates the position of the point at index [param point] on the blend axis. */
        set_blend_point_position(point: int64, pos: float64): void
        
        /** Returns the position of the point at index [param point]. */
        get_blend_point_position(point: int64): float64
        
        /** Changes the [AnimationNode] referenced by the point at index [param point]. */
        set_blend_point_node(point: int64, node: AnimationRootNode): void
        
        /** Returns the [AnimationNode] referenced by the point at index [param point]. */
        get_blend_point_node(point: int64): AnimationRootNode
        
        /** Removes the point at index [param point] from the blend axis. */
        remove_blend_point(point: int64): void
        
        /** Returns the number of points on the blend axis. */
        get_blend_point_count(): int64
        _add_blend_point(index: int64, node: AnimationRootNode): void
        
        /** The blend space's axis's lower limit for the points' position. See [method add_blend_point]. */
        get min_space(): float64
        set min_space(value: float64)
        
        /** The blend space's axis's upper limit for the points' position. See [method add_blend_point]. */
        get max_space(): float64
        set max_space(value: float64)
        
        /** Position increment to snap to when moving a point on the axis. */
        get snap(): float64
        set snap(value: float64)
        
        /** Label of the virtual axis of the blend space. */
        get value_label(): string
        set value_label(value: string)
        
        /** Controls the interpolation between animations. See [enum BlendMode] constants. */
        get blend_mode(): int64
        set blend_mode(value: int64)
        
        /** If `false`, the blended animations' frame are stopped when the blend value is `0`.  
         *  If `true`, forcing the blended animations to advance frame.  
         */
        get sync(): boolean
        set sync(value: boolean)
    }
    class AnimationNodeBlendSpace1DEditor extends AnimationTreeNodeEditorPlugin {
        constructor(identifier?: any)
        _update_space(): void
        _update_tool_erase(): void
        _update_edited_point_pos(): void
    }
    namespace AnimationNodeBlendSpace2D {
        enum BlendMode {
            /** The interpolation between animations is linear. */
            BLEND_MODE_INTERPOLATED = 0,
            
            /** The blend space plays the animation of the animation node which blending position is closest to. Useful for frame-by-frame 2D animations. */
            BLEND_MODE_DISCRETE = 1,
            
            /** Similar to [constant BLEND_MODE_DISCRETE], but starts the new animation at the last animation's playback position. */
            BLEND_MODE_DISCRETE_CARRY = 2,
        }
    }
    /** A set of [AnimationRootNode]s placed on 2D coordinates, crossfading between the three adjacent ones. Used by [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeblendspace2d.html  
     */
    class AnimationNodeBlendSpace2D extends AnimationRootNode {
        constructor(identifier?: any)
        /** Adds a new point that represents a [param node] at the position set by [param pos]. You can insert it at a specific index using the [param at_index] argument. If you use the default value for [param at_index], the point is inserted at the end of the blend points array. */
        add_blend_point(node: AnimationRootNode, pos: Vector2, at_index: int64 = -1): void
        
        /** Updates the position of the point at index [param point] in the blend space. */
        set_blend_point_position(point: int64, pos: Vector2): void
        
        /** Returns the position of the point at index [param point]. */
        get_blend_point_position(point: int64): Vector2
        
        /** Changes the [AnimationNode] referenced by the point at index [param point]. */
        set_blend_point_node(point: int64, node: AnimationRootNode): void
        
        /** Returns the [AnimationRootNode] referenced by the point at index [param point]. */
        get_blend_point_node(point: int64): AnimationRootNode
        
        /** Removes the point at index [param point] from the blend space. */
        remove_blend_point(point: int64): void
        
        /** Returns the number of points in the blend space. */
        get_blend_point_count(): int64
        
        /** Creates a new triangle using three points [param x], [param y], and [param z]. Triangles can overlap. You can insert the triangle at a specific index using the [param at_index] argument. If you use the default value for [param at_index], the point is inserted at the end of the blend points array. */
        add_triangle(x: int64, y: int64, z: int64, at_index: int64 = -1): void
        
        /** Returns the position of the point at index [param point] in the triangle of index [param triangle]. */
        get_triangle_point(triangle: int64, point: int64): int64
        
        /** Removes the triangle at index [param triangle] from the blend space. */
        remove_triangle(triangle: int64): void
        
        /** Returns the number of triangles in the blend space. */
        get_triangle_count(): int64
        _add_blend_point(index: int64, node: AnimationRootNode): void
        
        /** If `true`, the blend space is triangulated automatically. The mesh updates every time you add or remove points with [method add_blend_point] and [method remove_blend_point]. */
        get auto_triangles(): boolean
        set auto_triangles(value: boolean)
        get triangles(): PackedInt32Array
        set triangles(value: PackedInt32Array | int32[])
        
        /** The blend space's X and Y axes' lower limit for the points' position. See [method add_blend_point]. */
        get min_space(): Vector2
        set min_space(value: Vector2)
        
        /** The blend space's X and Y axes' upper limit for the points' position. See [method add_blend_point]. */
        get max_space(): Vector2
        set max_space(value: Vector2)
        
        /** Position increment to snap to when moving a point. */
        get snap(): Vector2
        set snap(value: Vector2)
        
        /** Name of the blend space's X axis. */
        get x_label(): string
        set x_label(value: string)
        
        /** Name of the blend space's Y axis. */
        get y_label(): string
        set y_label(value: string)
        
        /** Controls the interpolation between animations. See [enum BlendMode] constants. */
        get blend_mode(): int64
        set blend_mode(value: int64)
        
        /** If `false`, the blended animations' frame are stopped when the blend value is `0`.  
         *  If `true`, forcing the blended animations to advance frame.  
         */
        get sync(): boolean
        set sync(value: boolean)
        
        /** Emitted every time the blend space's triangles are created, removed, or when one of their vertices changes position. */
        readonly triangles_updated: Signal0
    }
    class AnimationNodeBlendSpace2DEditor extends AnimationTreeNodeEditorPlugin {
        constructor(identifier?: any)
        _update_space(): void
        _update_tool_erase(): void
        _update_edited_point_pos(): void
    }
    /** A sub-tree of many type [AnimationNode]s used for complex animations. Used by [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeblendtree.html  
     */
    class AnimationNodeBlendTree extends AnimationRootNode {
        /** The connection was successful. */
        static readonly CONNECTION_OK = 0
        
        /** The input node is `null`. */
        static readonly CONNECTION_ERROR_NO_INPUT = 1
        
        /** The specified input port is out of range. */
        static readonly CONNECTION_ERROR_NO_INPUT_INDEX = 2
        
        /** The output node is `null`. */
        static readonly CONNECTION_ERROR_NO_OUTPUT = 3
        
        /** Input and output nodes are the same. */
        static readonly CONNECTION_ERROR_SAME_NODE = 4
        
        /** The specified connection already exists. */
        static readonly CONNECTION_ERROR_CONNECTION_EXISTS = 5
        constructor(identifier?: any)
        
        /** Adds an [AnimationNode] at the given [param position]. The [param name] is used to identify the created sub animation node later. */
        add_node(name: StringName, node: AnimationNode, position: Vector2 = Vector2.ZERO): void
        
        /** Returns the sub animation node with the specified [param name]. */
        get_node(name: StringName): AnimationNode
        
        /** Removes a sub animation node. */
        remove_node(name: StringName): void
        
        /** Changes the name of a sub animation node. */
        rename_node(name: StringName, new_name: StringName): void
        
        /** Returns `true` if a sub animation node with specified [param name] exists. */
        has_node(name: StringName): boolean
        
        /** Connects the output of an [AnimationNode] as input for another [AnimationNode], at the input port specified by [param input_index]. */
        connect_node(input_node: StringName, input_index: int64, output_node: StringName): void
        
        /** Disconnects the animation node connected to the specified input. */
        disconnect_node(input_node: StringName, input_index: int64): void
        
        /** Modifies the position of a sub animation node. */
        set_node_position(name: StringName, position: Vector2): void
        
        /** Returns the position of the sub animation node with the specified [param name]. */
        get_node_position(name: StringName): Vector2
        
        /** The global offset of all sub animation nodes. */
        get graph_offset(): Vector2
        set graph_offset(value: Vector2)
        
        /** Emitted when the input port information is changed. */
        readonly node_changed: Signal1<StringName>
    }
    class AnimationNodeBlendTreeEditor extends AnimationTreeNodeEditorPlugin {
        constructor(identifier?: any)
        update_graph(): void
        _update_filters(_unnamed_arg0: AnimationNode): boolean
    }
    class AnimationNodeEndState extends AnimationRootNode {
        constructor(identifier?: any)
    }
    namespace AnimationNodeOneShot {
        enum OneShotRequest {
            /** The default state of the request. Nothing is done. */
            ONE_SHOT_REQUEST_NONE = 0,
            
            /** The request to play the animation connected to "shot" port. */
            ONE_SHOT_REQUEST_FIRE = 1,
            
            /** The request to stop the animation connected to "shot" port. */
            ONE_SHOT_REQUEST_ABORT = 2,
            
            /** The request to fade out the animation connected to "shot" port. */
            ONE_SHOT_REQUEST_FADE_OUT = 3,
        }
        enum MixMode {
            /** Blends two animations. See also [AnimationNodeBlend2]. */
            MIX_MODE_BLEND = 0,
            
            /** Blends two animations additively. See also [AnimationNodeAdd2]. */
            MIX_MODE_ADD = 1,
        }
    }
    /** Plays an animation once in an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeoneshot.html  
     */
    class AnimationNodeOneShot extends AnimationNodeSync {
        constructor(identifier?: any)
        /** The blend type. */
        get mix_mode(): int64
        set mix_mode(value: int64)
        
        /** The fade-in duration. For example, setting this to `1.0` for a 5 second length animation will produce a cross-fade that starts at 0 second and ends at 1 second during the animation.  
         *      
         *  **Note:** [AnimationNodeOneShot] transitions the current state after the end of the fading. When [AnimationNodeOutput] is considered as the most upstream, so the [member fadein_time] is scaled depending on the downstream delta. For example, if this value is set to `1.0` and a [AnimationNodeTimeScale] with a value of `2.0` is chained downstream, the actual processing time will be 0.5 second.  
         */
        get fadein_time(): float64
        set fadein_time(value: float64)
        
        /** Determines how cross-fading between animations is eased. If empty, the transition will be linear. */
        get fadein_curve(): Curve
        set fadein_curve(value: Curve)
        
        /** The fade-out duration. For example, setting this to `1.0` for a 5 second length animation will produce a cross-fade that starts at 4 second and ends at 5 second during the animation.  
         *      
         *  **Note:** [AnimationNodeOneShot] transitions the current state after the end of the fading. When [AnimationNodeOutput] is considered as the most upstream, so the [member fadeout_time] is scaled depending on the downstream delta. For example, if this value is set to `1.0` and an [AnimationNodeTimeScale] with a value of `2.0` is chained downstream, the actual processing time will be 0.5 second.  
         */
        get fadeout_time(): float64
        set fadeout_time(value: float64)
        
        /** Determines how cross-fading between animations is eased. If empty, the transition will be linear. */
        get fadeout_curve(): Curve
        set fadeout_curve(value: Curve)
        
        /** If `true`, breaks the loop at the end of the loop cycle for transition, even if the animation is looping. */
        get break_loop_at_end(): boolean
        set break_loop_at_end(value: boolean)
        
        /** If `true`, the sub-animation will restart automatically after finishing.  
         *  In other words, to start auto restarting, the animation must be played once with the [constant ONE_SHOT_REQUEST_FIRE] request. The [constant ONE_SHOT_REQUEST_ABORT] request stops the auto restarting, but it does not disable the [member autorestart] itself. So, the [constant ONE_SHOT_REQUEST_FIRE] request will start auto restarting again.  
         */
        get autorestart(): boolean
        set autorestart(value: boolean)
        
        /** The delay after which the automatic restart is triggered, in seconds. */
        get autorestart_delay(): float64
        set autorestart_delay(value: float64)
        
        /** If [member autorestart] is `true`, a random additional delay (in seconds) between 0 and this value will be added to [member autorestart_delay]. */
        get autorestart_random_delay(): float64
        set autorestart_random_delay(value: float64)
    }
    /** The animation output node of an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodeoutput.html  
     */
    class AnimationNodeOutput extends AnimationNode {
        constructor(identifier?: any)
    }
    class AnimationNodeStartState extends AnimationRootNode {
        constructor(identifier?: any)
    }
    namespace AnimationNodeStateMachine {
        enum StateMachineType {
            /** Seeking to the beginning is treated as playing from the start state. Transition to the end state is treated as exiting the state machine. */
            STATE_MACHINE_TYPE_ROOT = 0,
            
            /** Seeking to the beginning is treated as seeking to the beginning of the animation in the current state. Transition to the end state, or the absence of transitions in each state, is treated as exiting the state machine. */
            STATE_MACHINE_TYPE_NESTED = 1,
            
            /** This is a grouped state machine that can be controlled from a parent state machine. It does not work independently. There must be a state machine with [member state_machine_type] of [constant STATE_MACHINE_TYPE_ROOT] or [constant STATE_MACHINE_TYPE_NESTED] in the parent or ancestor. */
            STATE_MACHINE_TYPE_GROUPED = 2,
        }
    }
    /** A state machine with multiple [AnimationRootNode]s, used by [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodestatemachine.html  
     */
    class AnimationNodeStateMachine extends AnimationRootNode {
        constructor(identifier?: any)
        /** Adds a new animation node to the graph. The [param position] is used for display in the editor. */
        add_node(name: StringName, node: AnimationNode, position: Vector2 = Vector2.ZERO): void
        
        /** Replaces the given animation node with a new animation node. */
        replace_node(name: StringName, node: AnimationNode): void
        
        /** Returns the animation node with the given name. */
        get_node(name: StringName): AnimationNode
        
        /** Deletes the given animation node from the graph. */
        remove_node(name: StringName): void
        
        /** Renames the given animation node. */
        rename_node(name: StringName, new_name: StringName): void
        
        /** Returns `true` if the graph contains the given animation node. */
        has_node(name: StringName): boolean
        
        /** Returns the given animation node's name. */
        get_node_name(node: AnimationNode): StringName
        
        /** Sets the animation node's coordinates. Used for display in the editor. */
        set_node_position(name: StringName, position: Vector2): void
        
        /** Returns the given animation node's coordinates. Used for display in the editor. */
        get_node_position(name: StringName): Vector2
        
        /** Returns `true` if there is a transition between the given animation nodes. */
        has_transition(from: StringName, to: StringName): boolean
        
        /** Adds a transition between the given animation nodes. */
        add_transition(from: StringName, to: StringName, transition: AnimationNodeStateMachineTransition): void
        
        /** Returns the given transition. */
        get_transition(idx: int64): AnimationNodeStateMachineTransition
        
        /** Returns the given transition's start node. */
        get_transition_from(idx: int64): StringName
        
        /** Returns the given transition's end node. */
        get_transition_to(idx: int64): StringName
        
        /** Returns the number of connections in the graph. */
        get_transition_count(): int64
        
        /** Deletes the given transition by index. */
        remove_transition_by_index(idx: int64): void
        
        /** Deletes the transition between the two specified animation nodes. */
        remove_transition(from: StringName, to: StringName): void
        
        /** Sets the draw offset of the graph. Used for display in the editor. */
        set_graph_offset(offset: Vector2): void
        
        /** Returns the draw offset of the graph. Used for display in the editor. */
        get_graph_offset(): Vector2
        
        /** This property can define the process of transitions for different use cases. See also [enum AnimationNodeStateMachine.StateMachineType]. */
        get state_machine_type(): int64
        set state_machine_type(value: int64)
        
        /** If `true`, allows teleport to the self state with [method AnimationNodeStateMachinePlayback.travel]. When the reset option is enabled in [method AnimationNodeStateMachinePlayback.travel], the animation is restarted. If `false`, nothing happens on the teleportation to the self state. */
        get allow_transition_to_self(): boolean
        set allow_transition_to_self(value: boolean)
        
        /** If `true`, treat the cross-fade to the start and end nodes as a blend with the RESET animation.  
         *  In most cases, when additional cross-fades are performed in the parent [AnimationNode] of the state machine, setting this property to `false` and matching the cross-fade time of the parent [AnimationNode] and the state machine's start node and end node gives good results.  
         */
        get reset_ends(): boolean
        set reset_ends(value: boolean)
    }
    class AnimationNodeStateMachineEditor extends AnimationTreeNodeEditorPlugin {
        constructor(identifier?: any)
        _update_graph(): void
    }
    /** Provides playback control for an [AnimationNodeStateMachine].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodestatemachineplayback.html  
     */
    class AnimationNodeStateMachinePlayback extends Resource {
        constructor(identifier?: any)
        /** Transitions from the current state to another one, following the shortest path.  
         *  If the path does not connect from the current state, the animation will play after the state teleports.  
         *  If [param reset_on_teleport] is `true`, the animation is played from the beginning when the travel cause a teleportation.  
         */
        travel(to_node: StringName, reset_on_teleport: boolean = true): void
        
        /** Starts playing the given animation.  
         *  If [param reset] is `true`, the animation is played from the beginning.  
         */
        start(node: StringName, reset: boolean = true): void
        
        /** If there is a next path by travel or auto advance, immediately transitions from the current state to the next state. */
        next(): void
        
        /** Stops the currently playing animation. */
        stop(): void
        
        /** Returns `true` if an animation is playing. */
        is_playing(): boolean
        
        /** Returns the currently playing animation state.  
         *      
         *  **Note:** When using a cross-fade, the current state changes to the next state immediately after the cross-fade begins.  
         */
        get_current_node(): StringName
        
        /** Returns the playback position within the current animation state. */
        get_current_play_position(): float64
        
        /** Returns the current state length.  
         *      
         *  **Note:** It is possible that any [AnimationRootNode] can be nodes as well as animations. This means that there can be multiple animations within a single state. Which animation length has priority depends on the nodes connected inside it. Also, if a transition does not reset, the remaining length at that point will be returned.  
         */
        get_current_length(): float64
        
        /** Returns the starting state of currently fading animation. */
        get_fading_from_node(): StringName
        
        /** Returns the current travel path as computed internally by the A* algorithm. */
        get_travel_path(): GArray
    }
    namespace AnimationNodeStateMachineTransition {
        enum SwitchMode {
            /** Switch to the next state immediately. The current state will end and blend into the beginning of the new one. */
            SWITCH_MODE_IMMEDIATE = 0,
            
            /** Switch to the next state immediately, but will seek the new state to the playback position of the old state. */
            SWITCH_MODE_SYNC = 1,
            
            /** Wait for the current state playback to end, then switch to the beginning of the next state animation. */
            SWITCH_MODE_AT_END = 2,
        }
        enum AdvanceMode {
            /** Don't use this transition. */
            ADVANCE_MODE_DISABLED = 0,
            
            /** Only use this transition during [method AnimationNodeStateMachinePlayback.travel]. */
            ADVANCE_MODE_ENABLED = 1,
            
            /** Automatically use this transition if the [member advance_condition] and [member advance_expression] checks are true (if assigned). */
            ADVANCE_MODE_AUTO = 2,
        }
    }
    /** A transition within an [AnimationNodeStateMachine] connecting two [AnimationRootNode]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodestatemachinetransition.html  
     */
    class AnimationNodeStateMachineTransition extends Resource {
        constructor(identifier?: any)
        /** The time to cross-fade between this state and the next.  
         *      
         *  **Note:** [AnimationNodeStateMachine] transitions the current state immediately after the start of the fading. The precise remaining time can only be inferred from the main animation. When [AnimationNodeOutput] is considered as the most upstream, so the [member xfade_time] is not scaled depending on the downstream delta. See also [member AnimationNodeOneShot.fadeout_time].  
         */
        get xfade_time(): float64
        set xfade_time(value: float64)
        
        /** Ease curve for better control over cross-fade between this state and the next. */
        get xfade_curve(): Curve
        set xfade_curve(value: Curve)
        
        /** If `true`, breaks the loop at the end of the loop cycle for transition, even if the animation is looping. */
        get break_loop_at_end(): boolean
        set break_loop_at_end(value: boolean)
        
        /** If `true`, the destination animation is played back from the beginning when switched. */
        get reset(): boolean
        set reset(value: boolean)
        
        /** Lower priority transitions are preferred when travelling through the tree via [method AnimationNodeStateMachinePlayback.travel] or [member advance_mode] is set to [constant ADVANCE_MODE_AUTO]. */
        get priority(): int64
        set priority(value: int64)
        
        /** The transition type. */
        get switch_mode(): int64
        set switch_mode(value: int64)
        
        /** Determines whether the transition should disabled, enabled when using [method AnimationNodeStateMachinePlayback.travel], or traversed automatically if the [member advance_condition] and [member advance_expression] checks are true (if assigned). */
        get advance_mode(): int64
        set advance_mode(value: int64)
        
        /** Turn on auto advance when this condition is set. The provided name will become a boolean parameter on the [AnimationTree] that can be controlled from code (see [url=https://docs.godotengine.org/en/4.3/tutorials/animation/animation_tree.html#controlling-from-code]Using AnimationTree[/url]). For example, if [member AnimationTree.tree_root] is an [AnimationNodeStateMachine] and [member advance_condition] is set to `"idle"`:  
         *    
         */
        get advance_condition(): StringName
        set advance_condition(value: StringName)
        
        /** Use an expression as a condition for state machine transitions. It is possible to create complex animation advance conditions for switching between states and gives much greater flexibility for creating complex state machines by directly interfacing with the script code. */
        get advance_expression(): string
        set advance_expression(value: string)
        
        /** Emitted when [member advance_condition] is changed. */
        readonly advance_condition_changed: Signal0
    }
    /** Blends two animations subtractively inside of an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodesub2.html  
     */
    class AnimationNodeSub2 extends AnimationNodeSync {
        constructor(identifier?: any)
    }
    /** Base class for [AnimationNode]s with multiple input ports that must be synchronized.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodesync.html  
     */
    class AnimationNodeSync extends AnimationNode {
        constructor(identifier?: any)
        /** If `false`, the blended animations' frame are stopped when the blend value is `0`.  
         *  If `true`, forcing the blended animations to advance frame.  
         */
        get sync(): boolean
        set sync(value: boolean)
    }
    /** A time-scaling animation node used in [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodetimescale.html  
     */
    class AnimationNodeTimeScale extends AnimationNode {
        constructor(identifier?: any)
    }
    /** A time-seeking animation node used in [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodetimeseek.html  
     */
    class AnimationNodeTimeSeek extends AnimationNode {
        constructor(identifier?: any)
    }
    /** A transition within an [AnimationTree] connecting two [AnimationNode]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationnodetransition.html  
     */
    class AnimationNodeTransition extends AnimationNodeSync {
        constructor(identifier?: any)
        /** Enables or disables auto-advance for the given [param input] index. If enabled, state changes to the next input after playing the animation once. If enabled for the last input state, it loops to the first. */
        set_input_as_auto_advance(input: int64, enable: boolean): void
        
        /** Returns `true` if auto-advance is enabled for the given [param input] index. */
        is_input_set_as_auto_advance(input: int64): boolean
        
        /** If `true`, breaks the loop at the end of the loop cycle for transition, even if the animation is looping. */
        set_input_break_loop_at_end(input: int64, enable: boolean): void
        
        /** Returns whether the animation breaks the loop at the end of the loop cycle for transition. */
        is_input_loop_broken_at_end(input: int64): boolean
        
        /** If `true`, the destination animation is restarted when the animation transitions. */
        set_input_reset(input: int64, enable: boolean): void
        
        /** Returns whether the animation restarts when the animation transitions from the other animation. */
        is_input_reset(input: int64): boolean
        
        /** Cross-fading time (in seconds) between each animation connected to the inputs.  
         *      
         *  **Note:** [AnimationNodeTransition] transitions the current state immediately after the start of the fading. The precise remaining time can only be inferred from the main animation. When [AnimationNodeOutput] is considered as the most upstream, so the [member xfade_time] is not scaled depending on the downstream delta. See also [member AnimationNodeOneShot.fadeout_time].  
         */
        get xfade_time(): float64
        set xfade_time(value: float64)
        
        /** Determines how cross-fading between animations is eased. If empty, the transition will be linear. */
        get xfade_curve(): Curve
        set xfade_curve(value: Curve)
        
        /** If `true`, allows transition to the self state. When the reset option is enabled in input, the animation is restarted. If `false`, nothing happens on the transition to the self state. */
        get allow_transition_to_self(): boolean
        set allow_transition_to_self(value: boolean)
        
        /** The number of enabled input ports for this animation node. */
        get input_count(): any /*Inputs,input_*/
        set input_count(value: any /*Inputs,input_*/)
    }
    /** A node used for animation playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationplayer.html  
     */
    class AnimationPlayer extends AnimationMixer {
        constructor(identifier?: any)
        /** Triggers the [param animation_to] animation when the [param animation_from] animation completes. */
        animation_set_next(animation_from: StringName, animation_to: StringName): void
        
        /** Returns the key of the animation which is queued to play after the [param animation_from] animation. */
        animation_get_next(animation_from: StringName): StringName
        
        /** Specifies a blend time (in seconds) between two animations, referenced by their keys. */
        set_blend_time(animation_from: StringName, animation_to: StringName, sec: float64): void
        
        /** Returns the blend time (in seconds) between two animations, referenced by their keys. */
        get_blend_time(animation_from: StringName, animation_to: StringName): float64
        
        /** Plays the animation with key [param name]. Custom blend times and speed can be set.  
         *  The [param from_end] option only affects when switching to a new animation track, or if the same track but at the start or end. It does not affect resuming playback that was paused in the middle of an animation. If [param custom_speed] is negative and [param from_end] is `true`, the animation will play backwards (which is equivalent to calling [method play_backwards]).  
         *  The [AnimationPlayer] keeps track of its current or last played animation with [member assigned_animation]. If this method is called with that same animation [param name], or with no [param name] parameter, the assigned animation will resume playing if it was paused.  
         *      
         *  **Note:** The animation will be updated the next time the [AnimationPlayer] is processed. If other variables are updated at the same time this is called, they may be updated too early. To perform the update immediately, call `advance(0)`.  
         */
        play(name: StringName = '', custom_blend: float64 = -1, custom_speed: float64 = 1, from_end: boolean = false): void
        
        /** Plays the animation with key [param name] in reverse.  
         *  This method is a shorthand for [method play] with `custom_speed = -1.0` and `from_end = true`, so see its description for more information.  
         */
        play_backwards(name: StringName = '', custom_blend: float64 = -1): void
        
        /** See also [method AnimationMixer.capture].  
         *  You can use this method to use more detailed options for capture than those performed by [member playback_auto_capture]. When [member playback_auto_capture] is `false`, this method is almost the same as the following:  
         *    
         *  If [param name] is blank, it specifies [member assigned_animation].  
         *  If [param duration] is a negative value, the duration is set to the interval between the current position and the first key, when [param from_end] is `true`, uses the interval between the current position and the last key instead.  
         *      
         *  **Note:** The [param duration] takes [member speed_scale] into account, but [param custom_speed] does not, because the capture cache is interpolated with the blend result and the result may contain multiple animations.  
         */
        play_with_capture(name: StringName = '', duration: float64 = -1, custom_blend: float64 = -1, custom_speed: float64 = 1, from_end: boolean = false, trans_type: Tween.TransitionType = 0, ease_type: Tween.EaseType = 0): void
        
        /** Pauses the currently playing animation. The [member current_animation_position] will be kept and calling [method play] or [method play_backwards] without arguments or with the same animation name as [member assigned_animation] will resume the animation.  
         *  See also [method stop].  
         */
        pause(): void
        
        /** Stops the currently playing animation. The animation position is reset to `0` and the `custom_speed` is reset to `1.0`. See also [method pause].  
         *  If [param keep_state] is `true`, the animation state is not updated visually.  
         *      
         *  **Note:** The method / audio / animation playback tracks will not be processed by this method.  
         */
        stop(keep_state: boolean = false): void
        
        /** Returns `true` if an animation is currently playing (even if [member speed_scale] and/or `custom_speed` are `0`). */
        is_playing(): boolean
        
        /** Queues an animation for playback once the current animation and all previously queued animations are done.  
         *      
         *  **Note:** If a looped animation is currently playing, the queued animation will never play unless the looped animation is stopped somehow.  
         */
        queue(name: StringName): void
        
        /** Returns a list of the animation keys that are currently queued to play. */
        get_queue(): PackedStringArray
        
        /** Clears all queued, unplayed animations. */
        clear_queue(): void
        
        /** Returns the actual playing speed of current animation or `0` if not playing. This speed is the [member speed_scale] property multiplied by `custom_speed` argument specified when calling the [method play] method.  
         *  Returns a negative value if the current animation is playing backwards.  
         */
        get_playing_speed(): float64
        
        /** Seeks the animation to the [param seconds] point in time (in seconds). If [param update] is `true`, the animation updates too, otherwise it updates at process time. Events between the current frame and [param seconds] are skipped.  
         *  If [param update_only] is `true`, the method / audio / animation playback tracks will not be processed.  
         *      
         *  **Note:** Seeking to the end of the animation doesn't emit [signal AnimationMixer.animation_finished]. If you want to skip animation and emit the signal, use [method AnimationMixer.advance].  
         */
        seek(seconds: float64, update: boolean = false, update_only: boolean = false): void
        
        /** The key of the currently playing animation. If no animation is playing, the property's value is an empty string. Changing this value does not restart the animation. See [method play] for more information on playing animations.  
         *      
         *  **Note:** While this property appears in the Inspector, it's not meant to be edited, and it's not saved in the scene. This property is mainly used to get the currently playing animation, and internally for animation playback tracks. For more information, see [Animation].  
         */
        get current_animation(): StringName
        set current_animation(value: StringName)
        
        /** If playing, the current animation's key, otherwise, the animation last played. When set, this changes the animation, but will not play it unless already playing. See also [member current_animation]. */
        get assigned_animation(): StringName
        set assigned_animation(value: StringName)
        
        /** The key of the animation to play when the scene loads. */
        get autoplay(): StringName
        set autoplay(value: StringName)
        
        /** The length (in seconds) of the currently playing animation. */
        get current_animation_length(): float64
        
        /** The position (in seconds) of the currently playing animation. */
        get current_animation_position(): float64
        
        /** If `true`, performs [method AnimationMixer.capture] before playback automatically. This means just [method play_with_capture] is executed with default arguments instead of [method play].  
         *      
         *  **Note:** Capture interpolation is only performed if the animation contains a capture track. See also [constant Animation.UPDATE_CAPTURE].  
         */
        get playback_auto_capture(): boolean
        set playback_auto_capture(value: boolean)
        
        /** See also [method play_with_capture] and [method AnimationMixer.capture].  
         *  If [member playback_auto_capture_duration] is negative value, the duration is set to the interval between the current position and the first key.  
         */
        get playback_auto_capture_duration(): float64
        set playback_auto_capture_duration(value: float64)
        
        /** The transition type of the capture interpolation. See also [enum Tween.TransitionType]. */
        get playback_auto_capture_transition_type(): int64
        set playback_auto_capture_transition_type(value: int64)
        
        /** The ease type of the capture interpolation. See also [enum Tween.EaseType]. */
        get playback_auto_capture_ease_type(): int64
        set playback_auto_capture_ease_type(value: int64)
        
        /** The default time in which to blend animations. Ranges from 0 to 4096 with 0.01 precision. */
        get playback_default_blend_time(): float64
        set playback_default_blend_time(value: float64)
        
        /** The speed scaling ratio. For example, if this value is `1`, then the animation plays at normal speed. If it's `0.5`, then it plays at half speed. If it's `2`, then it plays at double speed.  
         *  If set to a negative value, the animation is played in reverse. If set to `0`, the animation will not advance.  
         */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** If `true` and the engine is running in Movie Maker mode (see [MovieWriter]), exits the engine with [method SceneTree.quit] as soon as an animation is done playing in this [AnimationPlayer]. A message is printed when the engine quits for this reason.  
         *      
         *  **Note:** This obeys the same logic as the [signal AnimationMixer.animation_finished] signal, so it will not quit the engine if the animation is set to be looping.  
         */
        get movie_quit_on_finish(): boolean
        set movie_quit_on_finish(value: boolean)
        
        /** Emitted when [member current_animation] changes. */
        readonly current_animation_changed: Signal1<string>
        
        /** Emitted when a queued animation plays after the previous animation finished. See also [method AnimationPlayer.queue].  
         *      
         *  **Note:** The signal is not emitted when the animation is changed via [method AnimationPlayer.play] or by an [AnimationTree].  
         */
        readonly animation_changed: Signal2<StringName, StringName>
    }
    class AnimationPlayerEditor extends VBoxContainer {
        constructor(identifier?: any)
        _animation_player_changed(_unnamed_arg0: Object): void
        _start_onion_skinning(): void
        _stop_onion_skinning(): void
        readonly animation_selected: Signal1<string>
    }
    class AnimationPlayerEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** Base class for [AnimationNode]s that hold one or multiple composite animations. Usually used for [member AnimationTree.tree_root].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationrootnode.html  
     */
    class AnimationRootNode extends AnimationNode {
        constructor(identifier?: any)
    }
    class AnimationTimelineEdit extends Range {
        constructor(identifier?: any)
        update_values(): void
        readonly zoom_changed: Signal0
        readonly name_limit_changed: Signal0
        readonly timeline_changed: Signal2<float64, boolean>
        readonly track_added: Signal1<int64>
        readonly length_changed: Signal1<float64>
    }
    class AnimationTrackEditDefaultPlugin extends AnimationTrackEditPlugin {
        constructor(identifier?: any)
    }
    class AnimationTrackEditPlugin extends RefCounted {
        constructor(identifier?: any)
    }
    class AnimationTrackEditor extends VBoxContainer {
        constructor(identifier?: any)
        _track_grab_focus(_unnamed_arg0: int64): void
        _redraw_tracks(): void
        _clear_selection_for_anim(_unnamed_arg0: Animation): void
        _select_at_anim(_unnamed_arg0: Animation, _unnamed_arg1: int64, _unnamed_arg2: float64): void
        _clear_selection(_unnamed_arg0: boolean): void
        _bezier_track_set_key_handle_mode(animation: Animation, track_idx: int64, key_idx: int64, key_handle_mode: any /*Animation.HandleMode*/, key_handle_set_mode: any /*Animation.HandleSetMode*/ = 0): void
        readonly timeline_changed: Signal3<float64, boolean, boolean>
        readonly keying_changed: Signal0
        readonly animation_len_changed: Signal1<float64>
        readonly animation_step_changed: Signal1<float64>
    }
    class AnimationTrackKeyEditEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** A node used for advanced animation transitions in an [AnimationPlayer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_animationtree.html  
     */
    class AnimationTree extends AnimationMixer {
        constructor(identifier?: any)
        /** The root animation node of this [AnimationTree]. See [AnimationRootNode]. */
        get tree_root(): AnimationRootNode
        set tree_root(value: AnimationRootNode)
        
        /** The path to the [Node] used to evaluate the [AnimationNode] [Expression] if one is not explicitly specified internally. */
        get advance_expression_base_node(): NodePath
        set advance_expression_base_node(value: NodePath | string)
        
        /** The path to the [AnimationPlayer] used for animating. */
        get anim_player(): NodePath
        set anim_player(value: NodePath | string)
        
        /** Emitted when the [member anim_player] is changed. */
        readonly animation_player_changed: Signal0
    }
    class AnimationTreeEditor extends VBoxContainer {
        constructor(identifier?: any)
    }
    class AnimationTreeEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    class AnimationTreeNodeEditorPlugin extends VBoxContainer {
        constructor(identifier?: any)
    }
    namespace Area2D {
        enum SpaceOverride {
            /** This area does not affect gravity/damping. */
            SPACE_OVERRIDE_DISABLED = 0,
            
            /** This area adds its gravity/damping values to whatever has been calculated so far (in [member priority] order). */
            SPACE_OVERRIDE_COMBINE = 1,
            
            /** This area adds its gravity/damping values to whatever has been calculated so far (in [member priority] order), ignoring any lower priority areas. */
            SPACE_OVERRIDE_COMBINE_REPLACE = 2,
            
            /** This area replaces any gravity/damping, even the defaults, ignoring any lower priority areas. */
            SPACE_OVERRIDE_REPLACE = 3,
            
            /** This area replaces any gravity/damping calculated so far (in [member priority] order), but keeps calculating the rest of the areas. */
            SPACE_OVERRIDE_REPLACE_COMBINE = 4,
        }
    }
    /** A region of 2D space that detects other [CollisionObject2D]s entering or exiting it.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_area2d.html  
     */
    class Area2D extends CollisionObject2D {
        constructor(identifier?: any)
        /** Returns a list of intersecting [PhysicsBody2D]s and [TileMap]s. The overlapping body's [member CollisionObject2D.collision_layer] must be part of this area's [member CollisionObject2D.collision_mask] in order to be detected.  
         *  For performance reasons (collisions are all processed at the same time) this list is modified once during the physics step, not immediately after objects are moved. Consider using signals instead.  
         */
        get_overlapping_bodies(): GArray
        
        /** Returns a list of intersecting [Area2D]s. The overlapping area's [member CollisionObject2D.collision_layer] must be part of this area's [member CollisionObject2D.collision_mask] in order to be detected.  
         *  For performance reasons (collisions are all processed at the same time) this list is modified once during the physics step, not immediately after objects are moved. Consider using signals instead.  
         */
        get_overlapping_areas(): GArray
        
        /** Returns `true` if intersecting any [PhysicsBody2D]s or [TileMap]s, otherwise returns `false`. The overlapping body's [member CollisionObject2D.collision_layer] must be part of this area's [member CollisionObject2D.collision_mask] in order to be detected.  
         *  For performance reasons (collisions are all processed at the same time) the list of overlapping bodies is modified once during the physics step, not immediately after objects are moved. Consider using signals instead.  
         */
        has_overlapping_bodies(): boolean
        
        /** Returns `true` if intersecting any [Area2D]s, otherwise returns `false`. The overlapping area's [member CollisionObject2D.collision_layer] must be part of this area's [member CollisionObject2D.collision_mask] in order to be detected.  
         *  For performance reasons (collisions are all processed at the same time) the list of overlapping areas is modified once during the physics step, not immediately after objects are moved. Consider using signals instead.  
         */
        has_overlapping_areas(): boolean
        
        /** Returns `true` if the given physics body intersects or overlaps this [Area2D], `false` otherwise.  
         *      
         *  **Note:** The result of this test is not immediate after moving objects. For performance, list of overlaps is updated once per frame and before the physics step. Consider using signals instead.  
         *  The [param body] argument can either be a [PhysicsBody2D] or a [TileMap] instance. While TileMaps are not physics bodies themselves, they register their tiles with collision shapes as a virtual physics body.  
         */
        overlaps_body(body: Node): boolean
        
        /** Returns `true` if the given [Area2D] intersects or overlaps this [Area2D], `false` otherwise.  
         *      
         *  **Note:** The result of this test is not immediate after moving objects. For performance, the list of overlaps is updated once per frame and before the physics step. Consider using signals instead.  
         */
        overlaps_area(area: Node): boolean
        
        /** If `true`, the area detects bodies or areas entering and exiting it. */
        get monitoring(): boolean
        set monitoring(value: boolean)
        
        /** If `true`, other monitoring areas can detect this area. */
        get monitorable(): boolean
        set monitorable(value: boolean)
        
        /** The area's priority. Higher priority areas are processed first. The [World2D]'s physics is always processed last, after all areas. */
        get priority(): int64
        set priority(value: int64)
        
        /** Override mode for gravity calculations within this area. See [enum SpaceOverride] for possible values. */
        get gravity_space_override(): int64
        set gravity_space_override(value: int64)
        
        /** If `true`, gravity is calculated from a point (set via [member gravity_point_center]). See also [member gravity_space_override]. */
        get gravity_point(): boolean
        set gravity_point(value: boolean)
        
        /** The distance at which the gravity strength is equal to [member gravity]. For example, on a planet 100 pixels in radius with a surface gravity of 4.0 px/s², set the [member gravity] to 4.0 and the unit distance to 100.0. The gravity will have falloff according to the inverse square law, so in the example, at 200 pixels from the center the gravity will be 1.0 px/s² (twice the distance, 1/4th the gravity), at 50 pixels it will be 16.0 px/s² (half the distance, 4x the gravity), and so on.  
         *  The above is true only when the unit distance is a positive number. When this is set to 0.0, the gravity will be constant regardless of distance.  
         */
        get gravity_point_unit_distance(): float64
        set gravity_point_unit_distance(value: float64)
        
        /** If gravity is a point (see [member gravity_point]), this will be the point of attraction. */
        get gravity_point_center(): Vector2
        set gravity_point_center(value: Vector2)
        
        /** The area's gravity vector (not normalized). */
        get gravity_direction(): Vector2
        set gravity_direction(value: Vector2)
        
        /** The area's gravity intensity (in pixels per second squared). This value multiplies the gravity direction. This is useful to alter the force of gravity without altering its direction. */
        get gravity(): float64
        set gravity(value: float64)
        
        /** Override mode for linear damping calculations within this area. See [enum SpaceOverride] for possible values. */
        get linear_damp_space_override(): int64
        set linear_damp_space_override(value: int64)
        
        /** The rate at which objects stop moving in this area. Represents the linear velocity lost per second.  
         *  See [member ProjectSettings.physics/2d/default_linear_damp] for more details about damping.  
         */
        get linear_damp(): float64
        set linear_damp(value: float64)
        
        /** Override mode for angular damping calculations within this area. See [enum SpaceOverride] for possible values. */
        get angular_damp_space_override(): int64
        set angular_damp_space_override(value: int64)
        
        /** The rate at which objects stop spinning in this area. Represents the angular velocity lost per second.  
         *  See [member ProjectSettings.physics/2d/default_angular_damp] for more details about damping.  
         */
        get angular_damp(): float64
        set angular_damp(value: float64)
        
        /** If `true`, the area's audio bus overrides the default audio bus. */
        get audio_bus_override(): boolean
        set audio_bus_override(value: boolean)
        
        /** The name of the area's audio bus. */
        get audio_bus_name(): StringName
        set audio_bus_name(value: StringName)
        
        /** Emitted when a [Shape2D] of the received [param body] enters a shape of this area. [param body] can be a [PhysicsBody2D] or a [TileMap]. [TileMap]s are detected if their [TileSet] has collision shapes configured. Requires [member monitoring] to be set to `true`.  
         *  [param local_shape_index] and [param body_shape_index] contain indices of the interacting shapes from this area and the interacting body, respectively. [param body_rid] contains the [RID] of the body. These values can be used with the [PhysicsServer2D].  
         *  **Example of getting the** [CollisionShape2D] **node from the shape index:**  
         *    
         */
        readonly body_shape_entered: Signal4<RID, Node2D, int64, int64>
        
        /** Emitted when a [Shape2D] of the received [param body] exits a shape of this area. [param body] can be a [PhysicsBody2D] or a [TileMap]. [TileMap]s are detected if their [TileSet] has collision shapes configured. Requires [member monitoring] to be set to `true`.  
         *  See also [signal body_shape_entered].  
         */
        readonly body_shape_exited: Signal4<RID, Node2D, int64, int64>
        
        /** Emitted when the received [param body] enters this area. [param body] can be a [PhysicsBody2D] or a [TileMap]. [TileMap]s are detected if their [TileSet] has collision shapes configured. Requires [member monitoring] to be set to `true`. */
        readonly body_entered: Signal1<Node2D>
        
        /** Emitted when the received [param body] exits this area. [param body] can be a [PhysicsBody2D] or a [TileMap]. [TileMap]s are detected if their [TileSet] has collision shapes configured. Requires [member monitoring] to be set to `true`. */
        readonly body_exited: Signal1<Node2D>
        
        /** Emitted when a [Shape2D] of the received [param area] enters a shape of this area. Requires [member monitoring] to be set to `true`.  
         *  [param local_shape_index] and [param area_shape_index] contain indices of the interacting shapes from this area and the other area, respectively. [param area_rid] contains the [RID] of the other area. These values can be used with the [PhysicsServer2D].  
         *  **Example of getting the** [CollisionShape2D] **node from the shape index:**  
         *    
         */
        readonly area_shape_entered: Signal4<RID, Area2D, int64, int64>
        
        /** Emitted when a [Shape2D] of the received [param area] exits a shape of this area. Requires [member monitoring] to be set to `true`.  
         *  See also [signal area_shape_entered].  
         */
        readonly area_shape_exited: Signal4<RID, Area2D, int64, int64>
        
        /** Emitted when the received [param area] enters this area. Requires [member monitoring] to be set to `true`. */
        readonly area_entered: Signal1<Area2D>
        
        /** Emitted when the received [param area] exits this area. Requires [member monitoring] to be set to `true`. */
        readonly area_exited: Signal1<Area2D>
    }
    namespace Area3D {
        enum SpaceOverride {
            /** This area does not affect gravity/damping. */
            SPACE_OVERRIDE_DISABLED = 0,
            
            /** This area adds its gravity/damping values to whatever has been calculated so far (in [member priority] order). */
            SPACE_OVERRIDE_COMBINE = 1,
            
            /** This area adds its gravity/damping values to whatever has been calculated so far (in [member priority] order), ignoring any lower priority areas. */
            SPACE_OVERRIDE_COMBINE_REPLACE = 2,
            
            /** This area replaces any gravity/damping, even the defaults, ignoring any lower priority areas. */
            SPACE_OVERRIDE_REPLACE = 3,
            
            /** This area replaces any gravity/damping calculated so far (in [member priority] order), but keeps calculating the rest of the areas. */
            SPACE_OVERRIDE_REPLACE_COMBINE = 4,
        }
    }
    /** A region of 3D space that detects other [CollisionObject3D]s entering or exiting it.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_area3d.html  
     */
    class Area3D extends CollisionObject3D {
        constructor(identifier?: any)
        /** Returns a list of intersecting [PhysicsBody3D]s and [GridMap]s. The overlapping body's [member CollisionObject3D.collision_layer] must be part of this area's [member CollisionObject3D.collision_mask] in order to be detected.  
         *  For performance reasons (collisions are all processed at the same time) this list is modified once during the physics step, not immediately after objects are moved. Consider using signals instead.  
         */
        get_overlapping_bodies(): GArray
        
        /** Returns a list of intersecting [Area3D]s. The overlapping area's [member CollisionObject3D.collision_layer] must be part of this area's [member CollisionObject3D.collision_mask] in order to be detected.  
         *  For performance reasons (collisions are all processed at the same time) this list is modified once during the physics step, not immediately after objects are moved. Consider using signals instead.  
         */
        get_overlapping_areas(): GArray
        
        /** Returns `true` if intersecting any [PhysicsBody3D]s or [GridMap]s, otherwise returns `false`. The overlapping body's [member CollisionObject3D.collision_layer] must be part of this area's [member CollisionObject3D.collision_mask] in order to be detected.  
         *  For performance reasons (collisions are all processed at the same time) the list of overlapping bodies is modified once during the physics step, not immediately after objects are moved. Consider using signals instead.  
         */
        has_overlapping_bodies(): boolean
        
        /** Returns `true` if intersecting any [Area3D]s, otherwise returns `false`. The overlapping area's [member CollisionObject3D.collision_layer] must be part of this area's [member CollisionObject3D.collision_mask] in order to be detected.  
         *  For performance reasons (collisions are all processed at the same time) the list of overlapping areas is modified once during the physics step, not immediately after objects are moved. Consider using signals instead.  
         */
        has_overlapping_areas(): boolean
        
        /** Returns `true` if the given physics body intersects or overlaps this [Area3D], `false` otherwise.  
         *      
         *  **Note:** The result of this test is not immediate after moving objects. For performance, list of overlaps is updated once per frame and before the physics step. Consider using signals instead.  
         *  The [param body] argument can either be a [PhysicsBody3D] or a [GridMap] instance. While GridMaps are not physics body themselves, they register their tiles with collision shapes as a virtual physics body.  
         */
        overlaps_body(body: Node): boolean
        
        /** Returns `true` if the given [Area3D] intersects or overlaps this [Area3D], `false` otherwise.  
         *      
         *  **Note:** The result of this test is not immediate after moving objects. For performance, list of overlaps is updated once per frame and before the physics step. Consider using signals instead.  
         */
        overlaps_area(area: Node): boolean
        
        /** If `true`, the area detects bodies or areas entering and exiting it. */
        get monitoring(): boolean
        set monitoring(value: boolean)
        
        /** If `true`, other monitoring areas can detect this area. */
        get monitorable(): boolean
        set monitorable(value: boolean)
        
        /** The area's priority. Higher priority areas are processed first. The [World3D]'s physics is always processed last, after all areas. */
        get priority(): int64
        set priority(value: int64)
        
        /** Override mode for gravity calculations within this area. See [enum SpaceOverride] for possible values. */
        get gravity_space_override(): int64
        set gravity_space_override(value: int64)
        
        /** If `true`, gravity is calculated from a point (set via [member gravity_point_center]). See also [member gravity_space_override]. */
        get gravity_point(): boolean
        set gravity_point(value: boolean)
        
        /** The distance at which the gravity strength is equal to [member gravity]. For example, on a planet 100 meters in radius with a surface gravity of 4.0 m/s², set the [member gravity] to 4.0 and the unit distance to 100.0. The gravity will have falloff according to the inverse square law, so in the example, at 200 meters from the center the gravity will be 1.0 m/s² (twice the distance, 1/4th the gravity), at 50 meters it will be 16.0 m/s² (half the distance, 4x the gravity), and so on.  
         *  The above is true only when the unit distance is a positive number. When this is set to 0.0, the gravity will be constant regardless of distance.  
         */
        get gravity_point_unit_distance(): float64
        set gravity_point_unit_distance(value: float64)
        
        /** If gravity is a point (see [member gravity_point]), this will be the point of attraction. */
        get gravity_point_center(): Vector3
        set gravity_point_center(value: Vector3)
        
        /** The area's gravity vector (not normalized). */
        get gravity_direction(): Vector3
        set gravity_direction(value: Vector3)
        
        /** The area's gravity intensity (in meters per second squared). This value multiplies the gravity direction. This is useful to alter the force of gravity without altering its direction. */
        get gravity(): float64
        set gravity(value: float64)
        
        /** Override mode for linear damping calculations within this area. See [enum SpaceOverride] for possible values. */
        get linear_damp_space_override(): int64
        set linear_damp_space_override(value: int64)
        
        /** The rate at which objects stop moving in this area. Represents the linear velocity lost per second.  
         *  See [member ProjectSettings.physics/3d/default_linear_damp] for more details about damping.  
         */
        get linear_damp(): float64
        set linear_damp(value: float64)
        
        /** Override mode for angular damping calculations within this area. See [enum SpaceOverride] for possible values. */
        get angular_damp_space_override(): int64
        set angular_damp_space_override(value: int64)
        
        /** The rate at which objects stop spinning in this area. Represents the angular velocity lost per second.  
         *  See [member ProjectSettings.physics/3d/default_angular_damp] for more details about damping.  
         */
        get angular_damp(): float64
        set angular_damp(value: float64)
        
        /** The magnitude of area-specific wind force.  
         *      
         *  **Note:** This wind force only applies to [SoftBody3D] nodes. Other physics bodies are currently not affected by wind.  
         */
        get wind_force_magnitude(): float64
        set wind_force_magnitude(value: float64)
        
        /** The exponential rate at which wind force decreases with distance from its origin.  
         *      
         *  **Note:** This wind force only applies to [SoftBody3D] nodes. Other physics bodies are currently not affected by wind.  
         */
        get wind_attenuation_factor(): float64
        set wind_attenuation_factor(value: float64)
        
        /** The [Node3D] which is used to specify the direction and origin of an area-specific wind force. The direction is opposite to the z-axis of the [Node3D]'s local transform, and its origin is the origin of the [Node3D]'s local transform.  
         *      
         *  **Note:** This wind force only applies to [SoftBody3D] nodes. Other physics bodies are currently not affected by wind.  
         */
        get wind_source_path(): NodePath
        set wind_source_path(value: NodePath | string)
        
        /** If `true`, the area's audio bus overrides the default audio bus. */
        get audio_bus_override(): boolean
        set audio_bus_override(value: boolean)
        
        /** The name of the area's audio bus. */
        get audio_bus_name(): StringName
        set audio_bus_name(value: StringName)
        
        /** If `true`, the area applies reverb to its associated audio. */
        get reverb_bus_enabled(): boolean
        set reverb_bus_enabled(value: boolean)
        
        /** The name of the reverb bus to use for this area's associated audio. */
        get reverb_bus_name(): StringName
        set reverb_bus_name(value: StringName)
        
        /** The degree to which this area applies reverb to its associated audio. Ranges from `0` to `1` with `0.1` precision. */
        get reverb_bus_amount(): float64
        set reverb_bus_amount(value: float64)
        
        /** The degree to which this area's reverb is a uniform effect. Ranges from `0` to `1` with `0.1` precision. */
        get reverb_bus_uniformity(): float64
        set reverb_bus_uniformity(value: float64)
        
        /** Emitted when a [Shape3D] of the received [param body] enters a shape of this area. [param body] can be a [PhysicsBody3D] or a [GridMap]. [GridMap]s are detected if their [MeshLibrary] has collision shapes configured. Requires [member monitoring] to be set to `true`.  
         *  [param local_shape_index] and [param body_shape_index] contain indices of the interacting shapes from this area and the interacting body, respectively. [param body_rid] contains the [RID] of the body. These values can be used with the [PhysicsServer3D].  
         *  **Example of getting the** [CollisionShape3D] **node from the shape index:**  
         *    
         */
        readonly body_shape_entered: Signal4<RID, Node3D, int64, int64>
        
        /** Emitted when a [Shape3D] of the received [param body] exits a shape of this area. [param body] can be a [PhysicsBody3D] or a [GridMap]. [GridMap]s are detected if their [MeshLibrary] has collision shapes configured. Requires [member monitoring] to be set to `true`.  
         *  See also [signal body_shape_entered].  
         */
        readonly body_shape_exited: Signal4<RID, Node3D, int64, int64>
        
        /** Emitted when the received [param body] enters this area. [param body] can be a [PhysicsBody3D] or a [GridMap]. [GridMap]s are detected if their [MeshLibrary] has collision shapes configured. Requires [member monitoring] to be set to `true`. */
        readonly body_entered: Signal1<Node3D>
        
        /** Emitted when the received [param body] exits this area. [param body] can be a [PhysicsBody3D] or a [GridMap]. [GridMap]s are detected if their [MeshLibrary] has collision shapes configured. Requires [member monitoring] to be set to `true`. */
        readonly body_exited: Signal1<Node3D>
        
        /** Emitted when a [Shape3D] of the received [param area] enters a shape of this area. Requires [member monitoring] to be set to `true`.  
         *  [param local_shape_index] and [param area_shape_index] contain indices of the interacting shapes from this area and the other area, respectively. [param area_rid] contains the [RID] of the other area. These values can be used with the [PhysicsServer3D].  
         *  **Example of getting the** [CollisionShape3D] **node from the shape index:**  
         *    
         */
        readonly area_shape_entered: Signal4<RID, Area3D, int64, int64>
        
        /** Emitted when a [Shape3D] of the received [param area] exits a shape of this area. Requires [member monitoring] to be set to `true`.  
         *  See also [signal area_shape_entered].  
         */
        readonly area_shape_exited: Signal4<RID, Area3D, int64, int64>
        
        /** Emitted when the received [param area] enters this area. Requires [member monitoring] to be set to `true`. */
        readonly area_entered: Signal1<Area3D>
        
        /** Emitted when the received [param area] exits this area. Requires [member monitoring] to be set to `true`. */
        readonly area_exited: Signal1<Area3D>
    }
    /** [Mesh] type that provides utility for constructing a surface from arrays.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_arraymesh.html  
     */
    class ArrayMesh extends Mesh {
        constructor(identifier?: any)
        /** Adds name for a blend shape that will be added with [method add_surface_from_arrays]. Must be called before surface is added. */
        add_blend_shape(name: StringName): void
        
        /** Returns the number of blend shapes that the [ArrayMesh] holds. */
        get_blend_shape_count(): int64
        
        /** Returns the name of the blend shape at this index. */
        get_blend_shape_name(index: int64): StringName
        
        /** Sets the name of the blend shape at this index. */
        set_blend_shape_name(index: int64, name: StringName): void
        
        /** Removes all blend shapes from this [ArrayMesh]. */
        clear_blend_shapes(): void
        
        /** Creates a new surface. [method Mesh.get_surface_count] will become the `surf_idx` for this new surface.  
         *  Surfaces are created to be rendered using a [param primitive], which may be any of the values defined in [enum Mesh.PrimitiveType].  
         *  The [param arrays] argument is an array of arrays. Each of the [constant Mesh.ARRAY_MAX] elements contains an array with some of the mesh data for this surface as described by the corresponding member of [enum Mesh.ArrayType] or `null` if it is not used by the surface. For example, `arrays[0]` is the array of vertices. That first vertex sub-array is always required; the others are optional. Adding an index array puts this surface into "index mode" where the vertex and other arrays become the sources of data and the index array defines the vertex order. All sub-arrays must have the same length as the vertex array (or be an exact multiple of the vertex array's length, when multiple elements of a sub-array correspond to a single vertex) or be empty, except for [constant Mesh.ARRAY_INDEX] if it is used.  
         *  The [param blend_shapes] argument is an array of vertex data for each blend shape. Each element is an array of the same structure as [param arrays], but [constant Mesh.ARRAY_VERTEX], [constant Mesh.ARRAY_NORMAL], and [constant Mesh.ARRAY_TANGENT] are set if and only if they are set in [param arrays] and all other entries are `null`.  
         *  The [param lods] argument is a dictionary with [float] keys and [PackedInt32Array] values. Each entry in the dictionary represents an LOD level of the surface, where the value is the [constant Mesh.ARRAY_INDEX] array to use for the LOD level and the key is roughly proportional to the distance at which the LOD stats being used. I.e., increasing the key of an LOD also increases the distance that the objects has to be from the camera before the LOD is used.  
         *  The [param flags] argument is the bitwise or of, as required: One value of [enum Mesh.ArrayCustomFormat] left shifted by `ARRAY_FORMAT_CUSTOMn_SHIFT` for each custom channel in use, [constant Mesh.ARRAY_FLAG_USE_DYNAMIC_UPDATE], [constant Mesh.ARRAY_FLAG_USE_8_BONE_WEIGHTS], or [constant Mesh.ARRAY_FLAG_USES_EMPTY_VERTEX_ARRAY].  
         *      
         *  **Note:** When using indices, it is recommended to only use points, lines, or triangles.  
         */
        add_surface_from_arrays(primitive: Mesh.PrimitiveType, arrays: GArray, blend_shapes: GArray = [], lods: GDictionary = new GDictionary(), flags: Mesh.ArrayFormat = 0): void
        
        /** Removes all surfaces from this [ArrayMesh]. */
        clear_surfaces(): void
        surface_update_vertex_region(surf_idx: int64, offset: int64, data: PackedByteArray | byte[] | ArrayBuffer): void
        surface_update_attribute_region(surf_idx: int64, offset: int64, data: PackedByteArray | byte[] | ArrayBuffer): void
        surface_update_skin_region(surf_idx: int64, offset: int64, data: PackedByteArray | byte[] | ArrayBuffer): void
        
        /** Returns the length in vertices of the vertex array in the requested surface (see [method add_surface_from_arrays]). */
        surface_get_array_len(surf_idx: int64): int64
        
        /** Returns the length in indices of the index array in the requested surface (see [method add_surface_from_arrays]). */
        surface_get_array_index_len(surf_idx: int64): int64
        
        /** Returns the format mask of the requested surface (see [method add_surface_from_arrays]). */
        surface_get_format(surf_idx: int64): Mesh.ArrayFormat
        
        /** Returns the primitive type of the requested surface (see [method add_surface_from_arrays]). */
        surface_get_primitive_type(surf_idx: int64): Mesh.PrimitiveType
        
        /** Returns the index of the first surface with this name held within this [ArrayMesh]. If none are found, -1 is returned. */
        surface_find_by_name(name: string): int64
        
        /** Sets a name for a given surface. */
        surface_set_name(surf_idx: int64, name: string): void
        
        /** Gets the name assigned to this surface. */
        surface_get_name(surf_idx: int64): string
        
        /** Regenerates tangents for each of the [ArrayMesh]'s surfaces. */
        regen_normal_maps(): void
        
        /** Performs a UV unwrap on the [ArrayMesh] to prepare the mesh for lightmapping. */
        lightmap_unwrap(transform: Transform3D, texel_size: float64): GError
        get _blend_shape_names(): PackedStringArray
        set _blend_shape_names(value: PackedStringArray | string[])
        get _surfaces(): GArray
        set _surfaces(value: GArray)
        
        /** Sets the blend shape mode to one of [enum Mesh.BlendShapeMode]. */
        get blend_shape_mode(): int64
        set blend_shape_mode(value: int64)
        
        /** Overrides the [AABB] with one defined by user for use with frustum culling. Especially useful to avoid unexpected culling when using a shader to offset vertices. */
        get custom_aabb(): AABB
        set custom_aabb(value: AABB)
        
        /** An optional mesh which can be used for rendering shadows and the depth prepass. Can be used to increase performance by supplying a mesh with fused vertices and only vertex position data (without normals, UVs, colors, etc.).  
         *      
         *  **Note:** This mesh must have exactly the same vertex positions as the source mesh (including the source mesh's LODs, if present). If vertex positions differ, then the mesh will not draw correctly.  
         */
        get shadow_mesh(): ArrayMesh
        set shadow_mesh(value: ArrayMesh)
    }
    /** 3D polygon shape for use with occlusion culling in [OccluderInstance3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_arrayoccluder3d.html  
     */
    class ArrayOccluder3D extends Occluder3D {
        constructor(identifier?: any)
        /** Sets [member indices] and [member vertices], while updating the final occluder only once after both values are set. */
        set_arrays(vertices: PackedVector3Array | Vector3[], indices: PackedInt32Array | int32[]): void
        
        /** The occluder's vertex positions in local 3D coordinates.  
         *      
         *  **Note:** The occluder is always updated after setting this value. If creating occluders procedurally, consider using [method set_arrays] instead to avoid updating the occluder twice when it's created.  
         */
        get vertices(): PackedVector3Array
        set vertices(value: PackedVector3Array | Vector3[])
        
        /** The occluder's index position. Indices determine which points from the [member vertices] array should be drawn, and in which order.  
         *      
         *  **Note:** The occluder is always updated after setting this value. If creating occluders procedurally, consider using [method set_arrays] instead to avoid updating the occluder twice when it's created.  
         */
        get indices(): PackedInt32Array
        set indices(value: PackedInt32Array | int32[])
    }
    namespace AspectRatioContainer {
        enum StretchMode {
            /** The height of child controls is automatically adjusted based on the width of the container. */
            STRETCH_WIDTH_CONTROLS_HEIGHT = 0,
            
            /** The width of child controls is automatically adjusted based on the height of the container. */
            STRETCH_HEIGHT_CONTROLS_WIDTH = 1,
            
            /** The bounding rectangle of child controls is automatically adjusted to fit inside the container while keeping the aspect ratio. */
            STRETCH_FIT = 2,
            
            /** The width and height of child controls is automatically adjusted to make their bounding rectangle cover the entire area of the container while keeping the aspect ratio.  
             *  When the bounding rectangle of child controls exceed the container's size and [member Control.clip_contents] is enabled, this allows to show only the container's area restricted by its own bounding rectangle.  
             */
            STRETCH_COVER = 3,
        }
        enum AlignmentMode {
            /** Aligns child controls with the beginning (left or top) of the container. */
            ALIGNMENT_BEGIN = 0,
            
            /** Aligns child controls with the center of the container. */
            ALIGNMENT_CENTER = 1,
            
            /** Aligns child controls with the end (right or bottom) of the container. */
            ALIGNMENT_END = 2,
        }
    }
    /** A container that preserves the proportions of its child controls.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_aspectratiocontainer.html  
     */
    class AspectRatioContainer extends Container {
        constructor(identifier?: any)
        /** The aspect ratio to enforce on child controls. This is the width divided by the height. The ratio depends on the [member stretch_mode]. */
        get ratio(): float64
        set ratio(value: float64)
        
        /** The stretch mode used to align child controls. */
        get stretch_mode(): int64
        set stretch_mode(value: int64)
        
        /** Specifies the horizontal relative position of child controls. */
        get alignment_horizontal(): int64
        set alignment_horizontal(value: int64)
        
        /** Specifies the vertical relative position of child controls. */
        get alignment_vertical(): int64
        set alignment_vertical(value: int64)
    }
    class AssetLibraryEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    class AtlasMergingDialog extends ConfirmationDialog {
        constructor(identifier?: any)
    }
    /** A texture that crops out part of another Texture2D.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_atlastexture.html  
     */
    class AtlasTexture extends Texture2D {
        constructor(identifier?: any)
        /** The texture that contains the atlas. Can be any type inheriting from [Texture2D], including another [AtlasTexture]. */
        get atlas(): Texture2D
        set atlas(value: Texture2D)
        
        /** The region used to draw the [member atlas]. If either dimension of the region's size is `0`, the value from [member atlas] size will be used for that axis instead. */
        get region(): Rect2
        set region(value: Rect2)
        
        /** The margin around the [member region]. Useful for small adjustments. If the [member Rect2.size] of this property ("w" and "h" in the editor) is set, the drawn texture is resized to fit within the margin. */
        get margin(): Rect2
        set margin(value: Rect2)
        
        /** If `true`, the area outside of the [member region] is clipped to avoid bleeding of the surrounding texture pixels. */
        get filter_clip(): boolean
        set filter_clip(value: boolean)
    }
    class AtlasTileProxyObject extends Object {
        constructor(identifier?: any)
        readonly changed: Signal1<string>
    }
    /** Stores information about the audio buses.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiobuslayout.html  
     */
    class AudioBusLayout extends Resource {
        constructor(identifier?: any)
    }
    class AudioBusesEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** Base class for audio effect resources.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffect.html  
     */
    class AudioEffect extends Resource {
        constructor(identifier?: any)
        /** Override this method to customize the [AudioEffectInstance] created when this effect is applied on a bus in the editor's Audio panel, or through [method AudioServer.add_bus_effect].  
         *    
         *      
         *  **Note:** It is recommended to keep a reference to the original [AudioEffect] in the new instance. Depending on the implementation this allows the effect instance to listen for changes at run-time and be modified accordingly.  
         */
        /* gdvirtual */ _instantiate(): AudioEffectInstance
    }
    /** Adds an amplifying audio effect to an audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectamplify.html  
     */
    class AudioEffectAmplify extends AudioEffect {
        constructor(identifier?: any)
        /** Amount of amplification in decibels. Positive values make the sound louder, negative values make it quieter. Value can range from -80 to 24. */
        get volume_db(): float64
        set volume_db(value: float64)
    }
    /** Adds a band limit filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectbandlimitfilter.html  
     */
    class AudioEffectBandLimitFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a band pass filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectbandpassfilter.html  
     */
    class AudioEffectBandPassFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Captures audio from an audio bus in real-time.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectcapture.html  
     */
    class AudioEffectCapture extends AudioEffect {
        constructor(identifier?: any)
        /** Returns `true` if at least [param frames] audio frames are available to read in the internal ring buffer. */
        can_get_buffer(frames: int64): boolean
        
        /** Gets the next [param frames] audio samples from the internal ring buffer.  
         *  Returns a [PackedVector2Array] containing exactly [param frames] audio samples if available, or an empty [PackedVector2Array] if insufficient data was available.  
         *  The samples are signed floating-point PCM between `-1` and `1`. You will have to scale them if you want to use them as 8 or 16-bit integer samples. (`v = 0x7fff * samples[0].x`)  
         */
        get_buffer(frames: int64): PackedVector2Array
        
        /** Clears the internal ring buffer.  
         *      
         *  **Note:** Calling this during a capture can cause the loss of samples which causes popping in the playback.  
         */
        clear_buffer(): void
        
        /** Returns the number of frames available to read using [method get_buffer]. */
        get_frames_available(): int64
        
        /** Returns the number of audio frames discarded from the audio bus due to full buffer. */
        get_discarded_frames(): int64
        
        /** Returns the total size of the internal ring buffer in frames. */
        get_buffer_length_frames(): int64
        
        /** Returns the number of audio frames inserted from the audio bus. */
        get_pushed_frames(): int64
        
        /** Length of the internal ring buffer, in seconds. Setting the buffer length will have no effect if already initialized. */
        get buffer_length(): float64
        set buffer_length(value: float64)
    }
    /** Adds a chorus audio effect.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectchorus.html  
     */
    class AudioEffectChorus extends AudioEffect {
        constructor(identifier?: any)
        set_voice_delay_ms(voice_idx: int64, delay_ms: float64): void
        get_voice_delay_ms(voice_idx: int64): float64
        set_voice_rate_hz(voice_idx: int64, rate_hz: float64): void
        get_voice_rate_hz(voice_idx: int64): float64
        set_voice_depth_ms(voice_idx: int64, depth_ms: float64): void
        get_voice_depth_ms(voice_idx: int64): float64
        set_voice_level_db(voice_idx: int64, level_db: float64): void
        get_voice_level_db(voice_idx: int64): float64
        set_voice_cutoff_hz(voice_idx: int64, cutoff_hz: float64): void
        get_voice_cutoff_hz(voice_idx: int64): float64
        set_voice_pan(voice_idx: int64, pan: float64): void
        get_voice_pan(voice_idx: int64): float64
        
        /** The number of voices in the effect. */
        get voice_count(): int64
        set voice_count(value: int64)
        
        /** The effect's raw signal. */
        get dry(): float64
        set dry(value: float64)
        
        /** The effect's processed signal. */
        get wet(): float64
        set wet(value: float64)
    }
    /** Adds a compressor audio effect to an audio bus.  
     *  Reduces sounds that exceed a certain threshold level, smooths out the dynamics and increases the overall volume.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectcompressor.html  
     */
    class AudioEffectCompressor extends AudioEffect {
        constructor(identifier?: any)
        /** The level above which compression is applied to the audio. Value can range from -60 to 0. */
        get threshold(): float64
        set threshold(value: float64)
        
        /** Amount of compression applied to the audio once it passes the threshold level. The higher the ratio, the more the loud parts of the audio will be compressed. Value can range from 1 to 48. */
        get ratio(): float64
        set ratio(value: float64)
        
        /** Gain applied to the output signal. */
        get gain(): float64
        set gain(value: float64)
        
        /** Compressor's reaction time when the signal exceeds the threshold, in microseconds. Value can range from 20 to 2000. */
        get attack_us(): float64
        set attack_us(value: float64)
        
        /** Compressor's delay time to stop reducing the signal after the signal level falls below the threshold, in milliseconds. Value can range from 20 to 2000. */
        get release_ms(): float64
        set release_ms(value: float64)
        
        /** Balance between original signal and effect signal. Value can range from 0 (totally dry) to 1 (totally wet). */
        get mix(): float64
        set mix(value: float64)
        
        /** Reduce the sound level using another audio bus for threshold detection. */
        get sidechain(): StringName
        set sidechain(value: StringName)
    }
    /** Adds a delay audio effect to an audio bus. Plays input signal back after a period of time.  
     *  Two tap delay and feedback options.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectdelay.html  
     */
    class AudioEffectDelay extends AudioEffect {
        constructor(identifier?: any)
        /** Output percent of original sound. At 0, only delayed sounds are output. Value can range from 0 to 1. */
        get dry(): float64
        set dry(value: float64)
        
        /** If `true`, the first tap will be enabled. */
        get tap1_active(): boolean
        set tap1_active(value: boolean)
        
        /** First tap delay time in milliseconds. */
        get tap1_delay_ms(): float64
        set tap1_delay_ms(value: float64)
        
        /** Sound level for the first tap. */
        get tap1_level_db(): float64
        set tap1_level_db(value: float64)
        
        /** Pan position for the first tap. Value can range from -1 (fully left) to 1 (fully right). */
        get tap1_pan(): float64
        set tap1_pan(value: float64)
        
        /** If `true`, the second tap will be enabled. */
        get tap2_active(): boolean
        set tap2_active(value: boolean)
        
        /** Second tap delay time in milliseconds. */
        get tap2_delay_ms(): float64
        set tap2_delay_ms(value: float64)
        
        /** Sound level for the second tap. */
        get tap2_level_db(): float64
        set tap2_level_db(value: float64)
        
        /** Pan position for the second tap. Value can range from -1 (fully left) to 1 (fully right). */
        get tap2_pan(): float64
        set tap2_pan(value: float64)
        
        /** If `true`, feedback is enabled. */
        get feedback_active(): boolean
        set feedback_active(value: boolean)
        
        /** Feedback delay time in milliseconds. */
        get feedback_delay_ms(): float64
        set feedback_delay_ms(value: float64)
        
        /** Sound level for feedback. */
        get feedback_level_db(): float64
        set feedback_level_db(value: float64)
        
        /** Low-pass filter for feedback, in Hz. Frequencies below this value are filtered out of the source signal. */
        get feedback_lowpass(): float64
        set feedback_lowpass(value: float64)
    }
    namespace AudioEffectDistortion {
        enum Mode {
            /** Digital distortion effect which cuts off peaks at the top and bottom of the waveform. */
            MODE_CLIP = 0,
            MODE_ATAN = 1,
            
            /** Low-resolution digital distortion effect (bit depth reduction). You can use it to emulate the sound of early digital audio devices. */
            MODE_LOFI = 2,
            
            /** Emulates the warm distortion produced by a field effect transistor, which is commonly used in solid-state musical instrument amplifiers. The [member drive] property has no effect in this mode. */
            MODE_OVERDRIVE = 3,
            
            /** Waveshaper distortions are used mainly by electronic musicians to achieve an extra-abrasive sound. */
            MODE_WAVESHAPE = 4,
        }
    }
    /** Adds a distortion audio effect to an Audio bus.  
     *  Modifies the sound to make it distorted.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectdistortion.html  
     */
    class AudioEffectDistortion extends AudioEffect {
        constructor(identifier?: any)
        /** Distortion type. */
        get mode(): int64
        set mode(value: int64)
        
        /** Increases or decreases the volume before the effect, in decibels. Value can range from -60 to 60. */
        get pre_gain(): float64
        set pre_gain(value: float64)
        
        /** High-pass filter, in Hz. Frequencies higher than this value will not be affected by the distortion. Value can range from 1 to 20000. */
        get keep_hf_hz(): float64
        set keep_hf_hz(value: float64)
        
        /** Distortion power. Value can range from 0 to 1. */
        get drive(): float64
        set drive(value: float64)
        
        /** Increases or decreases the volume after the effect, in decibels. Value can range from -80 to 24. */
        get post_gain(): float64
        set post_gain(value: float64)
    }
    /** Base class for audio equalizers. Gives you control over frequencies.  
     *  Use it to create a custom equalizer if [AudioEffectEQ6], [AudioEffectEQ10] or [AudioEffectEQ21] don't fit your needs.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffecteq.html  
     */
    class AudioEffectEQ extends AudioEffect {
        constructor(identifier?: any)
        /** Sets band's gain at the specified index, in dB. */
        set_band_gain_db(band_idx: int64, volume_db: float64): void
        
        /** Returns the band's gain at the specified index, in dB. */
        get_band_gain_db(band_idx: int64): float64
        
        /** Returns the number of bands of the equalizer. */
        get_band_count(): int64
    }
    /** Adds a 10-band equalizer audio effect to an Audio bus. Gives you control over frequencies from 31 Hz to 16000 Hz.  
     *  Each frequency can be modulated between -60/+24 dB.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffecteq10.html  
     */
    class AudioEffectEQ10 extends AudioEffectEQ {
        constructor(identifier?: any)
    }
    /** Adds a 21-band equalizer audio effect to an Audio bus. Gives you control over frequencies from 22 Hz to 22000 Hz.  
     *  Each frequency can be modulated between -60/+24 dB.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffecteq21.html  
     */
    class AudioEffectEQ21 extends AudioEffectEQ {
        constructor(identifier?: any)
    }
    /** Adds a 6-band equalizer audio effect to an audio bus. Gives you control over frequencies from 32 Hz to 10000 Hz.  
     *  Each frequency can be modulated between -60/+24 dB.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffecteq6.html  
     */
    class AudioEffectEQ6 extends AudioEffectEQ {
        constructor(identifier?: any)
    }
    namespace AudioEffectFilter {
        enum FilterDB {
            FILTER_6DB = 0,
            FILTER_12DB = 1,
            FILTER_18DB = 2,
            FILTER_24DB = 3,
        }
    }
    /** Adds a filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectfilter.html  
     */
    class AudioEffectFilter extends AudioEffect {
        constructor(identifier?: any)
        /** Threshold frequency for the filter, in Hz. */
        get cutoff_hz(): float64
        set cutoff_hz(value: float64)
        
        /** Amount of boost in the frequency range near the cutoff frequency. */
        get resonance(): float64
        set resonance(value: float64)
        
        /** Gain amount of the frequencies after the filter. */
        get gain(): float64
        set gain(value: float64)
        get db(): int64
        set db(value: int64)
    }
    /** Adds a hard limiter audio effect to an Audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffecthardlimiter.html  
     */
    class AudioEffectHardLimiter extends AudioEffect {
        constructor(identifier?: any)
        /** Gain to apply before limiting, in decibels. */
        get pre_gain_db(): float64
        set pre_gain_db(value: float64)
        
        /** The waveform's maximum allowed value, in decibels. This value can range from `-24.0` to `0.0`.  
         *  The default value of `-0.3` prevents potential inter-sample peaks (ISP) from crossing over 0 dB, which can cause slight distortion on some older hardware.  
         */
        get ceiling_db(): float64
        set ceiling_db(value: float64)
        
        /** Time it takes in seconds for the gain reduction to fully release. */
        get release(): float64
        set release(value: float64)
    }
    /** Adds a high-pass filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffecthighpassfilter.html  
     */
    class AudioEffectHighPassFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a high-shelf filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffecthighshelffilter.html  
     */
    class AudioEffectHighShelfFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Manipulates the audio it receives for a given effect.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectinstance.html  
     */
    class AudioEffectInstance extends RefCounted {
        constructor(identifier?: any)
        /** Called by the [AudioServer] to process this effect. When [method _process_silence] is not overridden or it returns `false`, this method is called only when the bus is active.  
         *      
         *  **Note:** It is not useful to override this method in GDScript or C#. Only GDExtension can take advantage of it.  
         */
        /* gdvirtual */ _process(src_buffer: int64, dst_buffer: int64, frame_count: int64): void
        
        /** Override this method to customize the processing behavior of this effect instance.  
         *  Should return `true` to force the [AudioServer] to always call [method _process], even if the bus has been muted or cannot otherwise be heard.  
         */
        /* gdvirtual */ _process_silence(): boolean
    }
    /** Adds a soft-clip limiter audio effect to an Audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectlimiter.html  
     */
    class AudioEffectLimiter extends AudioEffect {
        constructor(identifier?: any)
        /** The waveform's maximum allowed value, in decibels. Value can range from -20 to -0.1. */
        get ceiling_db(): float64
        set ceiling_db(value: float64)
        
        /** Threshold from which the limiter begins to be active, in decibels. Value can range from -30 to 0. */
        get threshold_db(): float64
        set threshold_db(value: float64)
        
        /** Applies a gain to the limited waves, in decibels. Value can range from 0 to 6. */
        get soft_clip_db(): float64
        set soft_clip_db(value: float64)
        get soft_clip_ratio(): float64
        set soft_clip_ratio(value: float64)
    }
    /** Adds a low-pass filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectlowpassfilter.html  
     */
    class AudioEffectLowPassFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a low-shelf filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectlowshelffilter.html  
     */
    class AudioEffectLowShelfFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a notch filter to the Audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectnotchfilter.html  
     */
    class AudioEffectNotchFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a panner audio effect to an audio bus. Pans sound left or right.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectpanner.html  
     */
    class AudioEffectPanner extends AudioEffect {
        constructor(identifier?: any)
        /** Pan position. Value can range from -1 (fully left) to 1 (fully right). */
        get pan(): float64
        set pan(value: float64)
    }
    /** Adds a phaser audio effect to an audio bus.  
     *  Combines the original signal with a copy that is slightly out of phase with the original.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectphaser.html  
     */
    class AudioEffectPhaser extends AudioEffect {
        constructor(identifier?: any)
        /** Determines the minimum frequency affected by the LFO modulations, in Hz. Value can range from 10 to 10000. */
        get range_min_hz(): float64
        set range_min_hz(value: float64)
        
        /** Determines the maximum frequency affected by the LFO modulations, in Hz. Value can range from 10 to 10000. */
        get range_max_hz(): float64
        set range_max_hz(value: float64)
        
        /** Adjusts the rate in Hz at which the effect sweeps up and down across the frequency range. */
        get rate_hz(): float64
        set rate_hz(value: float64)
        
        /** Output percent of modified sound. Value can range from 0.1 to 0.9. */
        get feedback(): float64
        set feedback(value: float64)
        
        /** Governs how high the filter frequencies sweep. Low value will primarily affect bass frequencies. High value can sweep high into the treble. Value can range from 0.1 to 4. */
        get depth(): float64
        set depth(value: float64)
    }
    namespace AudioEffectPitchShift {
        enum FFTSize {
            /** Use a buffer of 256 samples for the Fast Fourier transform. Lowest latency, but least stable over time. */
            FFT_SIZE_256 = 0,
            
            /** Use a buffer of 512 samples for the Fast Fourier transform. Low latency, but less stable over time. */
            FFT_SIZE_512 = 1,
            
            /** Use a buffer of 1024 samples for the Fast Fourier transform. This is a compromise between latency and stability over time. */
            FFT_SIZE_1024 = 2,
            
            /** Use a buffer of 2048 samples for the Fast Fourier transform. High latency, but stable over time. */
            FFT_SIZE_2048 = 3,
            
            /** Use a buffer of 4096 samples for the Fast Fourier transform. Highest latency, but most stable over time. */
            FFT_SIZE_4096 = 4,
            
            /** Represents the size of the [enum FFTSize] enum. */
            FFT_SIZE_MAX = 5,
        }
    }
    /** Adds a pitch-shifting audio effect to an audio bus.  
     *  Raises or lowers the pitch of original sound.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectpitchshift.html  
     */
    class AudioEffectPitchShift extends AudioEffect {
        constructor(identifier?: any)
        /** The pitch scale to use. `1.0` is the default pitch and plays sounds unaffected. [member pitch_scale] can range from `0.0` (infinitely low pitch, inaudible) to `16` (16 times higher than the initial pitch). */
        get pitch_scale(): float64
        set pitch_scale(value: float64)
        
        /** The oversampling factor to use. Higher values result in better quality, but are more demanding on the CPU and may cause audio cracking if the CPU can't keep up. */
        get oversampling(): float64
        set oversampling(value: float64)
        
        /** The size of the [url=https://en.wikipedia.org/wiki/Fast_Fourier_transform]Fast Fourier transform[/url] buffer. Higher values smooth out the effect over time, but have greater latency. The effects of this higher latency are especially noticeable on sounds that have sudden amplitude changes. */
        get fft_size(): int64
        set fft_size(value: int64)
    }
    /** Audio effect used for recording the sound from an audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectrecord.html  
     */
    class AudioEffectRecord extends AudioEffect {
        constructor(identifier?: any)
        /** If `true`, the sound will be recorded. Note that restarting the recording will remove the previously recorded sample. */
        set_recording_active(record: boolean): void
        
        /** Returns whether the recording is active or not. */
        is_recording_active(): boolean
        
        /** Returns the recorded sample. */
        get_recording(): AudioStreamWAV
        
        /** Specifies the format in which the sample will be recorded. See [enum AudioStreamWAV.Format] for available formats. */
        get format(): int64
        set format(value: int64)
    }
    /** Adds a reverberation audio effect to an Audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectreverb.html  
     */
    class AudioEffectReverb extends AudioEffect {
        constructor(identifier?: any)
        /** Time between the original signal and the early reflections of the reverb signal, in milliseconds. */
        get predelay_msec(): float64
        set predelay_msec(value: float64)
        
        /** Output percent of predelay. Value can range from 0 to 1. */
        get predelay_feedback(): float64
        set predelay_feedback(value: float64)
        
        /** Dimensions of simulated room. Bigger means more echoes. Value can range from 0 to 1. */
        get room_size(): float64
        set room_size(value: float64)
        
        /** Defines how reflective the imaginary room's walls are. Value can range from 0 to 1. */
        get damping(): float64
        set damping(value: float64)
        
        /** Widens or narrows the stereo image of the reverb tail. 1 means fully widens. Value can range from 0 to 1. */
        get spread(): float64
        set spread(value: float64)
        
        /** High-pass filter passes signals with a frequency higher than a certain cutoff frequency and attenuates signals with frequencies lower than the cutoff frequency. Value can range from 0 to 1. */
        get hipass(): float64
        set hipass(value: float64)
        
        /** Output percent of original sound. At 0, only modified sound is outputted. Value can range from 0 to 1. */
        get dry(): float64
        set dry(value: float64)
        
        /** Output percent of modified sound. At 0, only original sound is outputted. Value can range from 0 to 1. */
        get wet(): float64
        set wet(value: float64)
    }
    namespace AudioEffectSpectrumAnalyzer {
        enum FFTSize {
            /** Use a buffer of 256 samples for the Fast Fourier transform. Lowest latency, but least stable over time. */
            FFT_SIZE_256 = 0,
            
            /** Use a buffer of 512 samples for the Fast Fourier transform. Low latency, but less stable over time. */
            FFT_SIZE_512 = 1,
            
            /** Use a buffer of 1024 samples for the Fast Fourier transform. This is a compromise between latency and stability over time. */
            FFT_SIZE_1024 = 2,
            
            /** Use a buffer of 2048 samples for the Fast Fourier transform. High latency, but stable over time. */
            FFT_SIZE_2048 = 3,
            
            /** Use a buffer of 4096 samples for the Fast Fourier transform. Highest latency, but most stable over time. */
            FFT_SIZE_4096 = 4,
            
            /** Represents the size of the [enum FFTSize] enum. */
            FFT_SIZE_MAX = 5,
        }
    }
    /** Audio effect that can be used for real-time audio visualizations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectspectrumanalyzer.html  
     */
    class AudioEffectSpectrumAnalyzer extends AudioEffect {
        constructor(identifier?: any)
        /** The length of the buffer to keep (in seconds). Higher values keep data around for longer, but require more memory. */
        get buffer_length(): float64
        set buffer_length(value: float64)
        get tap_back_pos(): float64
        set tap_back_pos(value: float64)
        
        /** The size of the [url=https://en.wikipedia.org/wiki/Fast_Fourier_transform]Fast Fourier transform[/url] buffer. Higher values smooth out the spectrum analysis over time, but have greater latency. The effects of this higher latency are especially noticeable with sudden amplitude changes. */
        get fft_size(): int64
        set fft_size(value: int64)
    }
    namespace AudioEffectSpectrumAnalyzerInstance {
        enum MagnitudeMode {
            /** Use the average value across the frequency range as magnitude. */
            MAGNITUDE_AVERAGE = 0,
            
            /** Use the maximum value of the frequency range as magnitude. */
            MAGNITUDE_MAX = 1,
        }
    }
    /** Queryable instance of an [AudioEffectSpectrumAnalyzer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectspectrumanalyzerinstance.html  
     */
    class AudioEffectSpectrumAnalyzerInstance extends AudioEffectInstance {
        constructor(identifier?: any)
        /** Returns the magnitude of the frequencies from [param from_hz] to [param to_hz] in linear energy as a Vector2. The `x` component of the return value represents the left stereo channel, and `y` represents the right channel.  
         *  [param mode] determines how the frequency range will be processed. See [enum MagnitudeMode].  
         */
        get_magnitude_for_frequency_range(from_hz: float64, to_hz: float64, mode: AudioEffectSpectrumAnalyzerInstance.MagnitudeMode = 1): Vector2
    }
    /** An audio effect that can be used to adjust the intensity of stereo panning.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audioeffectstereoenhance.html  
     */
    class AudioEffectStereoEnhance extends AudioEffect {
        constructor(identifier?: any)
        /** Values greater than 1.0 increase intensity of any panning on audio passing through this effect, whereas values less than 1.0 will decrease the panning intensity. A value of 0.0 will downmix audio to mono. */
        get pan_pullout(): float64
        set pan_pullout(value: float64)
        get time_pullout_ms(): float64
        set time_pullout_ms(value: float64)
        get surround(): float64
        set surround(value: float64)
    }
    /** Overrides the location sounds are heard from.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiolistener2d.html  
     */
    class AudioListener2D extends Node2D {
        constructor(identifier?: any)
        /** Makes the [AudioListener2D] active, setting it as the hearing point for the sounds. If there is already another active [AudioListener2D], it will be disabled.  
         *  This method will have no effect if the [AudioListener2D] is not added to [SceneTree].  
         */
        make_current(): void
        
        /** Disables the [AudioListener2D]. If it's not set as current, this method will have no effect. */
        clear_current(): void
        
        /** Returns `true` if this [AudioListener2D] is currently active. */
        is_current(): boolean
    }
    /** Overrides the location sounds are heard from.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiolistener3d.html  
     */
    class AudioListener3D extends Node3D {
        constructor(identifier?: any)
        /** Enables the listener. This will override the current camera's listener. */
        make_current(): void
        
        /** Disables the listener to use the current camera's listener instead. */
        clear_current(): void
        
        /** Returns `true` if the listener was made current using [method make_current], `false` otherwise.  
         *      
         *  **Note:** There may be more than one AudioListener3D marked as "current" in the scene tree, but only the one that was made current last will be used.  
         */
        is_current(): boolean
        
        /** Returns the listener's global orthonormalized [Transform3D]. */
        get_listener_transform(): Transform3D
    }
    class AudioListener3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** Base class for audio samples.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiosample.html  
     */
    class AudioSample extends RefCounted {
        constructor(identifier?: any)
    }
    /** Meta class for playing back audio samples.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiosampleplayback.html  
     */
    class AudioSamplePlayback extends RefCounted {
        constructor(identifier?: any)
    }
    /** Base class for audio streams.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostream.html  
     */
    class AudioStream extends Resource {
        constructor(identifier?: any)
        /** Override this method to customize the returned value of [method instantiate_playback]. Should returned a new [AudioStreamPlayback] created when the stream is played (such as by an [AudioStreamPlayer]).. */
        /* gdvirtual */ _instantiate_playback(): AudioStreamPlayback
        
        /** Override this method to customize the name assigned to this audio stream. Unused by the engine. */
        /* gdvirtual */ _get_stream_name(): string
        
        /** Override this method to customize the returned value of [method get_length]. Should return the length of this audio stream, in seconds. */
        /* gdvirtual */ _get_length(): float64
        
        /** Override this method to customize the returned value of [method is_monophonic]. Should return `true` if this audio stream only supports one channel. */
        /* gdvirtual */ _is_monophonic(): boolean
        
        /** Overridable method. Should return the tempo of this audio stream, in beats per minute (BPM). Used by the engine to determine the position of every beat.  
         *  Ideally, the returned value should be based off the stream's sample rate ([member AudioStreamWAV.mix_rate], for example).  
         */
        /* gdvirtual */ _get_bpm(): float64
        
        /** Overridable method. Should return the total number of beats of this audio stream. Used by the engine to determine the position of every beat.  
         *  Ideally, the returned value should be based off the stream's sample rate ([member AudioStreamWAV.mix_rate], for example).  
         */
        /* gdvirtual */ _get_beat_count(): int64
        
        /** Return the controllable parameters of this stream. This array contains dictionaries with a property info description format (see [method Object.get_property_list]). Additionally, the default value for this parameter must be added tho each dictionary in "default_value" field. */
        /* gdvirtual */ _get_parameter_list(): GArray
        
        /** Returns the length of the audio stream in seconds. */
        get_length(): float64
        
        /** Returns `true` if this audio stream only supports one channel ( *monophony* ), or `false` if the audio stream supports two or more channels ( *polyphony* ). */
        is_monophonic(): boolean
        
        /** Returns a newly created [AudioStreamPlayback] intended to play this audio stream. Useful for when you want to extend [method _instantiate_playback] but call [method instantiate_playback] from an internally held AudioStream subresource. An example of this can be found in the source code for `AudioStreamRandomPitch::instantiate_playback`. */
        instantiate_playback(): AudioStreamPlayback
        
        /** Returns if the current [AudioStream] can be used as a sample. Only static streams can be sampled. */
        can_be_sampled(): boolean
        
        /** Generates an [AudioSample] based on the current stream. */
        generate_sample(): AudioSample
        
        /** Returns `true` if the stream is a collection of other streams, `false` otherwise. */
        is_meta_stream(): boolean
        
        /** Signal to be emitted to notify when the parameter list changed. */
        readonly parameter_list_changed: Signal0
    }
    class AudioStreamEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** An audio stream with utilities for procedural sound generation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamgenerator.html  
     */
    class AudioStreamGenerator extends AudioStream {
        constructor(identifier?: any)
        /** The sample rate to use (in Hz). Higher values are more demanding for the CPU to generate, but result in better quality.  
         *  In games, common sample rates in use are `11025`, `16000`, `22050`, `32000`, `44100`, and `48000`.  
         *  According to the [url=https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem]Nyquist-Shannon sampling theorem[/url], there is no quality difference to human hearing when going past 40,000 Hz (since most humans can only hear up to ~20,000 Hz, often less). If you are generating lower-pitched sounds such as voices, lower sample rates such as `32000` or `22050` may be usable with no loss in quality.  
         */
        get mix_rate(): float64
        set mix_rate(value: float64)
        
        /** The length of the buffer to generate (in seconds). Lower values result in less latency, but require the script to generate audio data faster, resulting in increased CPU usage and more risk for audio cracking if the CPU can't keep up. */
        get buffer_length(): float64
        set buffer_length(value: float64)
    }
    /** Plays back audio generated using [AudioStreamGenerator].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamgeneratorplayback.html  
     */
    class AudioStreamGeneratorPlayback extends AudioStreamPlaybackResampled {
        constructor(identifier?: any)
        /** Pushes a single audio data frame to the buffer. This is usually less efficient than [method push_buffer] in C# and compiled languages via GDExtension, but [method push_frame] may be  *more*  efficient in GDScript. */
        push_frame(frame: Vector2): boolean
        
        /** Returns `true` if a buffer of the size [param amount] can be pushed to the audio sample data buffer without overflowing it, `false` otherwise. */
        can_push_buffer(amount: int64): boolean
        
        /** Pushes several audio data frames to the buffer. This is usually more efficient than [method push_frame] in C# and compiled languages via GDExtension, but [method push_buffer] may be  *less*  efficient in GDScript. */
        push_buffer(frames: PackedVector2Array | Vector2[]): boolean
        
        /** Returns the number of frames that can be pushed to the audio sample data buffer without overflowing it. If the result is `0`, the buffer is full. */
        get_frames_available(): int64
        
        /** Returns the number of times the playback skipped due to a buffer underrun in the audio sample data. This value is reset at the start of the playback. */
        get_skips(): int64
        
        /** Clears the audio sample data buffer. */
        clear_buffer(): void
    }
    class AudioStreamImportSettingsDialog extends ConfirmationDialog {
        constructor(identifier?: any)
    }
    namespace AudioStreamInteractive {
        enum TransitionFromTime {
            /** Start transition as soon as possible, don't wait for any specific time position. */
            TRANSITION_FROM_TIME_IMMEDIATE = 0,
            
            /** Transition when the clip playback position reaches the next beat. */
            TRANSITION_FROM_TIME_NEXT_BEAT = 1,
            
            /** Transition when the clip playback position reaches the next bar. */
            TRANSITION_FROM_TIME_NEXT_BAR = 2,
            
            /** Transition when the current clip finished playing. */
            TRANSITION_FROM_TIME_END = 3,
        }
        enum TransitionToTime {
            /** Transition to the same position in the destination clip. This is useful when both clips have exactly the same length and the music should fade between them. */
            TRANSITION_TO_TIME_SAME_POSITION = 0,
            
            /** Transition to the start of the destination clip. */
            TRANSITION_TO_TIME_START = 1,
        }
        enum FadeMode {
            /** Do not use fade for the transition. This is useful when transitioning from a clip-end to clip-beginning, and each clip has their begin/end. */
            FADE_DISABLED = 0,
            
            /** Use a fade-in in the next clip, let the current clip finish. */
            FADE_IN = 1,
            
            /** Use a fade-out in the current clip, the next clip will start by itself. */
            FADE_OUT = 2,
            
            /** Use a cross-fade between clips. */
            FADE_CROSS = 3,
            
            /** Use automatic fade logic depending on the transition from/to. It is recommended to use this by default. */
            FADE_AUTOMATIC = 4,
        }
        enum AutoAdvanceMode {
            /** Disable auto-advance (default). */
            AUTO_ADVANCE_DISABLED = 0,
            
            /** Enable auto-advance, a clip must be specified. */
            AUTO_ADVANCE_ENABLED = 1,
            
            /** Enable auto-advance, but instead of specifying a clip, the playback will return to hold (see [method add_transition]). */
            AUTO_ADVANCE_RETURN_TO_HOLD = 2,
        }
    }
    /** Audio stream that can playback music interactively, combining clips and a transition table.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreaminteractive.html  
     */
    class AudioStreamInteractive extends AudioStream {
        /** This constant describes that any clip is valid for a specific transition as either source or destination. */
        static readonly CLIP_ANY = -1
        constructor(identifier?: any)
        _get_linked_undo_properties(for_property: string, for_value: any): PackedStringArray
        _inspector_array_swap_clip(a: int64, b: int64): void
        
        /** Set the name of the current clip (for easier identification). */
        set_clip_name(clip_index: int64, name: StringName): void
        
        /** Return the name of a clip. */
        get_clip_name(clip_index: int64): StringName
        
        /** Set the [AudioStream] associated with the current clip. */
        set_clip_stream(clip_index: int64, stream: AudioStream): void
        
        /** Return the [AudioStream] associated with a clip. */
        get_clip_stream(clip_index: int64): AudioStream
        
        /** Set whether a clip will auto-advance by changing the auto-advance mode. */
        set_clip_auto_advance(clip_index: int64, mode: AudioStreamInteractive.AutoAdvanceMode): void
        
        /** Return whether a clip has auto-advance enabled. See [method set_clip_auto_advance]. */
        get_clip_auto_advance(clip_index: int64): AudioStreamInteractive.AutoAdvanceMode
        
        /** Set the index of the next clip towards which this clip will auto advance to when finished. If the clip being played loops, then auto-advance will be ignored. */
        set_clip_auto_advance_next_clip(clip_index: int64, auto_advance_next_clip: int64): void
        
        /** Return the clip towards which the clip referenced by [param clip_index] will auto-advance to. */
        get_clip_auto_advance_next_clip(clip_index: int64): int64
        
        /** Add a transition between two clips. Provide the indices of the source and destination clips, or use the [constant CLIP_ANY] constant to indicate that transition happens to/from any clip to this one.  
         *  * [param from_time] indicates the moment in the current clip the transition will begin after triggered.  
         *  * [param to_time] indicates the time in the next clip that the playback will start from.  
         *  * [param fade_mode] indicates how the fade will happen between clips. If unsure, just use [constant FADE_AUTOMATIC] which uses the most common type of fade for each situation.  
         *  * [param fade_beats] indicates how many beats the fade will take. Using decimals is allowed.  
         *  * [param use_filler_clip] indicates that there will be a filler clip used between the source and destination clips.  
         *  * [param filler_clip] the index of the filler clip.  
         *  * If [param hold_previous] is used, then this clip will be remembered. This can be used together with [constant AUTO_ADVANCE_RETURN_TO_HOLD] to return to this clip after another is done playing.  
         */
        add_transition(from_clip: int64, to_clip: int64, from_time: AudioStreamInteractive.TransitionFromTime, to_time: AudioStreamInteractive.TransitionToTime, fade_mode: AudioStreamInteractive.FadeMode, fade_beats: float64, use_filler_clip: boolean = false, filler_clip: int64 = -1, hold_previous: boolean = false): void
        
        /** Return true if a given transition exists (was added via [method add_transition]). */
        has_transition(from_clip: int64, to_clip: int64): boolean
        
        /** Erase a transition by providing [param from_clip] and [param to_clip] clip indices. [constant CLIP_ANY] can be used for either argument or both. */
        erase_transition(from_clip: int64, to_clip: int64): void
        
        /** Return the list of transitions (from, to interleaved). */
        get_transition_list(): PackedInt32Array
        
        /** Return the source time position for a transition (see [method add_transition]). */
        get_transition_from_time(from_clip: int64, to_clip: int64): AudioStreamInteractive.TransitionFromTime
        
        /** Return the destination time position for a transition (see [method add_transition]). */
        get_transition_to_time(from_clip: int64, to_clip: int64): AudioStreamInteractive.TransitionToTime
        
        /** Return the mode for a transition (see [method add_transition]). */
        get_transition_fade_mode(from_clip: int64, to_clip: int64): AudioStreamInteractive.FadeMode
        
        /** Return the time (in beats) for a transition (see [method add_transition]). */
        get_transition_fade_beats(from_clip: int64, to_clip: int64): float64
        
        /** Return whether a transition uses the  *filler clip*  functionality (see [method add_transition]). */
        is_transition_using_filler_clip(from_clip: int64, to_clip: int64): boolean
        
        /** Return the filler clip for a transition (see [method add_transition]). */
        get_transition_filler_clip(from_clip: int64, to_clip: int64): int64
        
        /** Return whether a transition uses the  *hold previous*  functionality (see [method add_transition]). */
        is_transition_holding_previous(from_clip: int64, to_clip: int64): boolean
        
        /** Index of the initial clip, which will be played first when this stream is played. */
        get initial_clip(): int64
        set initial_clip(value: int64)
        
        /** Amount of clips contained in this interactive player. */
        get clip_count(): any /*Clips,clip_,page_size=999,unfoldable,numbered,swap_method=_inspector_array_swap_clip,add_button_text=Add Clip*/
        set clip_count(value: any /*Clips,clip_,page_size=999,unfoldable,numbered,swap_method=_inspector_array_swap_clip,add_button_text=Add Clip*/)
        get _transitions(): GDictionary
        set _transitions(value: GDictionary)
    }
    class AudioStreamInteractiveEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    class AudioStreamInteractiveTransitionEditor extends AcceptDialog {
        constructor(identifier?: any)
        _update_transitions(): void
    }
    /** MP3 audio stream driver.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreammp3.html  
     */
    class AudioStreamMP3 extends AudioStream {
        constructor(identifier?: any)
        /** Contains the audio data in bytes.  
         *  You can load a file without having to import it beforehand using the code snippet below. Keep in mind that this snippet loads the whole file into memory and may not be ideal for huge files (hundreds of megabytes or more).  
         *    
         */
        get data(): PackedByteArray
        set data(value: PackedByteArray | byte[] | ArrayBuffer)
        get bpm(): float64
        set bpm(value: float64)
        get beat_count(): int64
        set beat_count(value: int64)
        get bar_beats(): int64
        set bar_beats(value: int64)
        
        /** If `true`, the stream will automatically loop when it reaches the end. */
        get loop(): boolean
        set loop(value: boolean)
        
        /** Time in seconds at which the stream starts after being looped. */
        get loop_offset(): float64
        set loop_offset(value: float64)
    }
    /** Plays real-time audio input data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreammicrophone.html  
     */
    class AudioStreamMicrophone extends AudioStream {
        constructor(identifier?: any)
    }
    /** A class representing an Ogg Vorbis audio stream.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamoggvorbis.html  
     */
    class AudioStreamOggVorbis extends AudioStream {
        constructor(identifier?: any)
        /** Creates a new AudioStreamOggVorbis instance from the given buffer. The buffer must contain Ogg Vorbis data. */
        static load_from_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): AudioStreamOggVorbis
        
        /** Creates a new AudioStreamOggVorbis instance from the given file path. The file must be in Ogg Vorbis format. */
        static load_from_file(path: string): AudioStreamOggVorbis
        
        /** Contains the raw Ogg data for this stream. */
        get packet_sequence(): Object
        set packet_sequence(value: Object)
        get bpm(): float64
        set bpm(value: float64)
        get beat_count(): int64
        set beat_count(value: int64)
        get bar_beats(): int64
        set bar_beats(value: int64)
        
        /** If `true`, the audio will play again from the specified [member loop_offset] once it is done playing. Useful for ambient sounds and background music. */
        get loop(): boolean
        set loop(value: boolean)
        
        /** Time in seconds at which the stream starts after being looped. */
        get loop_offset(): float64
        set loop_offset(value: float64)
    }
    /** Meta class for playing back audio.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplayback.html  
     */
    class AudioStreamPlayback extends RefCounted {
        constructor(identifier?: any)
        /** Override this method to customize what happens when the playback starts at the given position, such as by calling [method AudioStreamPlayer.play]. */
        /* gdvirtual */ _start(from_pos: float64): void
        
        /** Override this method to customize what happens when the playback is stopped, such as by calling [method AudioStreamPlayer.stop]. */
        /* gdvirtual */ _stop(): void
        
        /** Overridable method. Should return `true` if this playback is active and playing its audio stream. */
        /* gdvirtual */ _is_playing(): boolean
        
        /** Overridable method. Should return how many times this audio stream has looped. Most built-in playbacks always return `0`. */
        /* gdvirtual */ _get_loop_count(): int64
        
        /** Overridable method. Should return the current progress along the audio stream, in seconds. */
        /* gdvirtual */ _get_playback_position(): float64
        
        /** Override this method to customize what happens when seeking this audio stream at the given [param position], such as by calling [method AudioStreamPlayer.seek]. */
        /* gdvirtual */ _seek(position: float64): void
        
        /** Override this method to customize how the audio stream is mixed. This method is called even if the playback is not active.  
         *      
         *  **Note:** It is not useful to override this method in GDScript or C#. Only GDExtension can take advantage of it.  
         */
        /* gdvirtual */ _mix(buffer: int64, rate_scale: float64, frames: int64): int64
        
        /** Overridable method. Called whenever the audio stream is mixed if the playback is active and [method AudioServer.set_enable_tagging_used_audio_streams] has been set to `true`. Editor plugins may use this method to "tag" the current position along the audio stream and display it in a preview. */
        /* gdvirtual */ _tag_used_streams(): void
        
        /** Set the current value of a playback parameter by name (see [method AudioStream._get_parameter_list]). */
        /* gdvirtual */ _set_parameter(name: StringName, value: any): void
        
        /** Return the current value of a playback parameter by name (see [method AudioStream._get_parameter_list]). */
        /* gdvirtual */ _get_parameter(name: StringName): any
        
        /** Associates [AudioSamplePlayback] to this [AudioStreamPlayback] for playing back the audio sample of this stream. */
        set_sample_playback(playback_sample: AudioSamplePlayback): void
        
        /** Returns the [AudioSamplePlayback] associated with this [AudioStreamPlayback] for playing back the audio sample of this stream. */
        get_sample_playback(): AudioSamplePlayback
    }
    /** Playback component of [AudioStreamInteractive].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplaybackinteractive.html  
     */
    class AudioStreamPlaybackInteractive extends AudioStreamPlayback {
        constructor(identifier?: any)
        /** Switch to a clip (by name). */
        switch_to_clip_by_name(clip_name: StringName): void
        
        /** Switch to a clip (by index). */
        switch_to_clip(clip_index: int64): void
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplaybackoggvorbis.html */
    class AudioStreamPlaybackOggVorbis extends AudioStreamPlaybackResampled {
        constructor(identifier?: any)
    }
    /** Playback class used for [AudioStreamPlaylist].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplaybackplaylist.html  
     */
    class AudioStreamPlaybackPlaylist extends AudioStreamPlayback {
        constructor(identifier?: any)
    }
    /** Playback instance for [AudioStreamPolyphonic].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplaybackpolyphonic.html  
     */
    class AudioStreamPlaybackPolyphonic extends AudioStreamPlayback {
        /** Returned by [method play_stream] in case it could not allocate a stream for playback. */
        static readonly INVALID_ID = -1
        constructor(identifier?: any)
        
        /** Play an [AudioStream] at a given offset, volume, pitch scale, playback type, and bus. Playback starts immediately.  
         *  The return value is a unique integer ID that is associated to this playback stream and which can be used to control it.  
         *  This ID becomes invalid when the stream ends (if it does not loop), when the [AudioStreamPlaybackPolyphonic] is stopped, or when [method stop_stream] is called.  
         *  This function returns [constant INVALID_ID] if the amount of streams currently playing equals [member AudioStreamPolyphonic.polyphony]. If you need a higher amount of maximum polyphony, raise this value.  
         */
        play_stream(stream: AudioStream, from_offset: float64 = 0, volume_db: float64 = 0, pitch_scale: float64 = 1, playback_type: AudioServer.PlaybackType = 0, bus: StringName = 'Master'): int64
        
        /** Change the stream volume (in db). The [param stream] argument is an integer ID returned by [method play_stream]. */
        set_stream_volume(stream: int64, volume_db: float64): void
        
        /** Change the stream pitch scale. The [param stream] argument is an integer ID returned by [method play_stream]. */
        set_stream_pitch_scale(stream: int64, pitch_scale: float64): void
        
        /** Return true whether the stream associated with an integer ID is still playing. Check [method play_stream] for information on when this ID becomes invalid. */
        is_stream_playing(stream: int64): boolean
        
        /** Stop a stream. The [param stream] argument is an integer ID returned by [method play_stream], which becomes invalid after calling this function. */
        stop_stream(stream: int64): void
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplaybackresampled.html */
    class AudioStreamPlaybackResampled extends AudioStreamPlayback {
        constructor(identifier?: any)
        /* gdvirtual */ _mix_resampled(dst_buffer: int64, frame_count: int64): int64
        /* gdvirtual */ _get_stream_sampling_rate(): float64
        begin_resample(): void
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplaybacksynchronized.html */
    class AudioStreamPlaybackSynchronized extends AudioStreamPlayback {
        constructor(identifier?: any)
    }
    namespace AudioStreamPlayer {
        enum MixTarget {
            /** The audio will be played only on the first channel. This is the default. */
            MIX_TARGET_STEREO = 0,
            
            /** The audio will be played on all surround channels. */
            MIX_TARGET_SURROUND = 1,
            
            /** The audio will be played on the second channel, which is usually the center. */
            MIX_TARGET_CENTER = 2,
        }
    }
    /** A node for audio playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplayer.html  
     */
    class AudioStreamPlayer extends Node {
        constructor(identifier?: any)
        /** Plays a sound from the beginning, or the given [param from_position] in seconds. */
        play(from_position: float64 = 0): void
        
        /** Restarts all sounds to be played from the given [param to_position], in seconds. Does nothing if no sounds are playing. */
        seek(to_position: float64): void
        
        /** Stops all sounds from this node. */
        stop(): void
        
        /** Returns the position in the [AudioStream] of the latest sound, in seconds. Returns `0.0` if no sounds are playing.  
         *      
         *  **Note:** The position is not always accurate, as the [AudioServer] does not mix audio every processed frame. To get more accurate results, add [method AudioServer.get_time_since_last_mix] to the returned position.  
         */
        get_playback_position(): float64
        _is_active(): boolean
        
        /** Returns `true` if any sound is active, even if [member stream_paused] is set to `true`. See also [member playing] and [method get_stream_playback]. */
        has_stream_playback(): boolean
        
        /** Returns the latest [AudioStreamPlayback] of this node, usually the most recently created by [method play]. If no sounds are playing, this method fails and returns an empty playback. */
        get_stream_playback(): AudioStreamPlayback
        
        /** The [AudioStream] resource to be played. Setting this property stops all currently playing sounds. If left empty, the [AudioStreamPlayer] does not work. */
        get stream(): AudioStream
        set stream(value: AudioStream)
        
        /** Volume of sound, in decibel. This is an offset of the [member stream]'s volume.  
         *      
         *  **Note:** To convert between decibel and linear energy (like most volume sliders do), use [method @GlobalScope.db_to_linear] and [method @GlobalScope.linear_to_db].  
         */
        get volume_db(): float64
        set volume_db(value: float64)
        
        /** The audio's pitch and tempo, as a multiplier of the [member stream]'s sample rate. A value of `2.0` doubles the audio's pitch, while a value of `0.5` halves the pitch. */
        get pitch_scale(): float64
        set pitch_scale(value: float64)
        
        /** If `true`, this node is playing sounds. Setting this property has the same effect as [method play] and [method stop]. */
        get playing(): boolean
        set playing(value: boolean)
        
        /** If `true`, this node calls [method play] when entering the tree. */
        get autoplay(): boolean
        set autoplay(value: boolean)
        
        /** If `true`, the sounds are paused. Setting [member stream_paused] to `false` resumes all sounds.  
         *      
         *  **Note:** This property is automatically changed when exiting or entering the tree, or this node is paused (see [member Node.process_mode]).  
         */
        get stream_paused(): boolean
        set stream_paused(value: boolean)
        
        /** The mix target channels, as one of the [enum MixTarget] constants. Has no effect when two speakers or less are detected (see [enum AudioServer.SpeakerMode]). */
        get mix_target(): int64
        set mix_target(value: int64)
        
        /** The maximum number of sounds this node can play at the same time. Calling [method play] after this value is reached will cut off the oldest sounds. */
        get max_polyphony(): int64
        set max_polyphony(value: int64)
        
        /** The target bus name. All sounds from this node will be playing on this bus.  
         *      
         *  **Note:** At runtime, if no bus with the given name exists, all sounds will fall back on `"Master"`. See also [method AudioServer.get_bus_name].  
         */
        get bus(): StringName
        set bus(value: StringName)
        
        /** The playback type of the stream player. If set other than to the default value, it will force that playback type. */
        get playback_type(): int64
        set playback_type(value: int64)
        
        /** Emitted when a sound finishes playing without interruptions. This signal is  *not*  emitted when calling [method stop], or when exiting the tree while sounds are playing. */
        readonly finished: Signal0
    }
    /** Plays positional sound in 2D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplayer2d.html  
     */
    class AudioStreamPlayer2D extends Node2D {
        constructor(identifier?: any)
        /** Queues the audio to play on the next physics frame, from the given position [param from_position], in seconds. */
        play(from_position: float64 = 0): void
        
        /** Sets the position from which audio will be played, in seconds. */
        seek(to_position: float64): void
        
        /** Stops the audio. */
        stop(): void
        
        /** Returns the position in the [AudioStream]. */
        get_playback_position(): float64
        _is_active(): boolean
        
        /** Returns whether the [AudioStreamPlayer] can return the [AudioStreamPlayback] object or not. */
        has_stream_playback(): boolean
        
        /** Returns the [AudioStreamPlayback] object associated with this [AudioStreamPlayer2D]. */
        get_stream_playback(): AudioStreamPlayback
        
        /** The [AudioStream] object to be played. */
        get stream(): AudioStream
        set stream(value: AudioStream)
        
        /** Base volume before attenuation. */
        get volume_db(): float64
        set volume_db(value: float64)
        
        /** The pitch and the tempo of the audio, as a multiplier of the audio sample's sample rate. */
        get pitch_scale(): float64
        set pitch_scale(value: float64)
        
        /** If `true`, audio is playing or is queued to be played (see [method play]). */
        get playing(): boolean
        set playing(value: boolean)
        
        /** If `true`, audio plays when added to scene tree. */
        get autoplay(): boolean
        set autoplay(value: boolean)
        
        /** If `true`, the playback is paused. You can resume it by setting [member stream_paused] to `false`. */
        get stream_paused(): boolean
        set stream_paused(value: boolean)
        
        /** Maximum distance from which audio is still hearable. */
        get max_distance(): float64
        set max_distance(value: float64)
        
        /** The volume is attenuated over distance with this as an exponent. */
        get attenuation(): float64
        set attenuation(value: float64)
        
        /** The maximum number of sounds this node can play at the same time. Playing additional sounds after this value is reached will cut off the oldest sounds. */
        get max_polyphony(): int64
        set max_polyphony(value: int64)
        
        /** Scales the panning strength for this node by multiplying the base [member ProjectSettings.audio/general/2d_panning_strength] with this factor. Higher values will pan audio from left to right more dramatically than lower values. */
        get panning_strength(): float64
        set panning_strength(value: float64)
        
        /** Bus on which this audio is playing.  
         *      
         *  **Note:** When setting this property, keep in mind that no validation is performed to see if the given name matches an existing bus. This is because audio bus layouts might be loaded after this property is set. If this given name can't be resolved at runtime, it will fall back to `"Master"`.  
         */
        get bus(): StringName
        set bus(value: StringName)
        
        /** Determines which [Area2D] layers affect the sound for reverb and audio bus effects. Areas can be used to redirect [AudioStream]s so that they play in a certain audio bus. An example of how you might use this is making a "water" area so that sounds played in the water are redirected through an audio bus to make them sound like they are being played underwater. */
        get area_mask(): int64
        set area_mask(value: int64)
        
        /** The playback type of the stream player. If set other than to the default value, it will force that playback type. */
        get playback_type(): int64
        set playback_type(value: int64)
        
        /** Emitted when the audio stops playing. */
        readonly finished: Signal0
    }
    namespace AudioStreamPlayer3D {
        enum AttenuationModel {
            /** Attenuation of loudness according to linear distance. */
            ATTENUATION_INVERSE_DISTANCE = 0,
            
            /** Attenuation of loudness according to squared distance. */
            ATTENUATION_INVERSE_SQUARE_DISTANCE = 1,
            
            /** Attenuation of loudness according to logarithmic distance. */
            ATTENUATION_LOGARITHMIC = 2,
            
            /** No attenuation of loudness according to distance. The sound will still be heard positionally, unlike an [AudioStreamPlayer]. [constant ATTENUATION_DISABLED] can be combined with a [member max_distance] value greater than `0.0` to achieve linear attenuation clamped to a sphere of a defined size. */
            ATTENUATION_DISABLED = 3,
        }
        enum DopplerTracking {
            /** Disables doppler tracking. */
            DOPPLER_TRACKING_DISABLED = 0,
            
            /** Executes doppler tracking during process frames (see [constant Node.NOTIFICATION_INTERNAL_PROCESS]). */
            DOPPLER_TRACKING_IDLE_STEP = 1,
            
            /** Executes doppler tracking during physics frames (see [constant Node.NOTIFICATION_INTERNAL_PHYSICS_PROCESS]). */
            DOPPLER_TRACKING_PHYSICS_STEP = 2,
        }
    }
    /** Plays positional sound in 3D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplayer3d.html  
     */
    class AudioStreamPlayer3D extends Node3D {
        constructor(identifier?: any)
        /** Queues the audio to play on the next physics frame, from the given position [param from_position], in seconds. */
        play(from_position: float64 = 0): void
        
        /** Sets the position from which audio will be played, in seconds. */
        seek(to_position: float64): void
        
        /** Stops the audio. */
        stop(): void
        
        /** Returns the position in the [AudioStream]. */
        get_playback_position(): float64
        _is_active(): boolean
        
        /** Returns whether the [AudioStreamPlayer] can return the [AudioStreamPlayback] object or not. */
        has_stream_playback(): boolean
        
        /** Returns the [AudioStreamPlayback] object associated with this [AudioStreamPlayer3D]. */
        get_stream_playback(): AudioStreamPlayback
        
        /** The [AudioStream] resource to be played. */
        get stream(): AudioStream
        set stream(value: AudioStream)
        
        /** Decides if audio should get quieter with distance linearly, quadratically, logarithmically, or not be affected by distance, effectively disabling attenuation. */
        get attenuation_model(): int64
        set attenuation_model(value: int64)
        
        /** The base sound level before attenuation, in decibels. */
        get volume_db(): float64
        set volume_db(value: float64)
        
        /** The factor for the attenuation effect. Higher values make the sound audible over a larger distance. */
        get unit_size(): float64
        set unit_size(value: float64)
        
        /** Sets the absolute maximum of the sound level, in decibels. */
        get max_db(): float64
        set max_db(value: float64)
        
        /** The pitch and the tempo of the audio, as a multiplier of the audio sample's sample rate. */
        get pitch_scale(): float64
        set pitch_scale(value: float64)
        
        /** If `true`, audio is playing or is queued to be played (see [method play]). */
        get playing(): boolean
        set playing(value: boolean)
        
        /** If `true`, audio plays when the AudioStreamPlayer3D node is added to scene tree. */
        get autoplay(): boolean
        set autoplay(value: boolean)
        
        /** If `true`, the playback is paused. You can resume it by setting [member stream_paused] to `false`. */
        get stream_paused(): boolean
        set stream_paused(value: boolean)
        
        /** The distance past which the sound can no longer be heard at all. Only has an effect if set to a value greater than `0.0`. [member max_distance] works in tandem with [member unit_size]. However, unlike [member unit_size] whose behavior depends on the [member attenuation_model], [member max_distance] always works in a linear fashion. This can be used to prevent the [AudioStreamPlayer3D] from requiring audio mixing when the listener is far away, which saves CPU resources. */
        get max_distance(): float64
        set max_distance(value: float64)
        
        /** The maximum number of sounds this node can play at the same time. Playing additional sounds after this value is reached will cut off the oldest sounds. */
        get max_polyphony(): int64
        set max_polyphony(value: int64)
        
        /** Scales the panning strength for this node by multiplying the base [member ProjectSettings.audio/general/3d_panning_strength] with this factor. Higher values will pan audio from left to right more dramatically than lower values. */
        get panning_strength(): float64
        set panning_strength(value: float64)
        
        /** The bus on which this audio is playing.  
         *      
         *  **Note:** When setting this property, keep in mind that no validation is performed to see if the given name matches an existing bus. This is because audio bus layouts might be loaded after this property is set. If this given name can't be resolved at runtime, it will fall back to `"Master"`.  
         */
        get bus(): StringName
        set bus(value: StringName)
        
        /** Determines which [Area3D] layers affect the sound for reverb and audio bus effects. Areas can be used to redirect [AudioStream]s so that they play in a certain audio bus. An example of how you might use this is making a "water" area so that sounds played in the water are redirected through an audio bus to make them sound like they are being played underwater. */
        get area_mask(): int64
        set area_mask(value: int64)
        
        /** The playback type of the stream player. If set other than to the default value, it will force that playback type. */
        get playback_type(): int64
        set playback_type(value: int64)
        
        /** If `true`, the audio should be attenuated according to the direction of the sound. */
        get emission_angle_enabled(): boolean
        set emission_angle_enabled(value: boolean)
        
        /** The angle in which the audio reaches a listener unattenuated. */
        get emission_angle_degrees(): float64
        set emission_angle_degrees(value: float64)
        
        /** Attenuation factor used if listener is outside of [member emission_angle_degrees] and [member emission_angle_enabled] is set, in decibels. */
        get emission_angle_filter_attenuation_db(): float64
        set emission_angle_filter_attenuation_db(value: float64)
        
        /** The cutoff frequency of the attenuation low-pass filter, in Hz. A sound above this frequency is attenuated more than a sound below this frequency. To disable this effect, set this to `20500` as this frequency is above the human hearing limit. */
        get attenuation_filter_cutoff_hz(): float64
        set attenuation_filter_cutoff_hz(value: float64)
        
        /** Amount how much the filter affects the loudness, in decibels. */
        get attenuation_filter_db(): float64
        set attenuation_filter_db(value: float64)
        
        /** Decides in which step the Doppler effect should be calculated. */
        get doppler_tracking(): int64
        set doppler_tracking(value: int64)
        
        /** Emitted when the audio stops playing. */
        readonly finished: Signal0
    }
    class AudioStreamPlayer3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    class AudioStreamPlayerInternal extends Object {
        constructor(identifier?: any)
    }
    /** [AudioStream] that includes sub-streams and plays them back like a playlist.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamplaylist.html  
     */
    class AudioStreamPlaylist extends AudioStream {
        /** Maximum amount of streams supported in the playlist. */
        static readonly MAX_STREAMS = 64
        constructor(identifier?: any)
        
        /** Returns the BPM of the playlist, which can vary depending on the clip being played. */
        get_bpm(): float64
        
        /** Sets the stream at playback position index. */
        set_list_stream(stream_index: int64, audio_stream: AudioStream): void
        
        /** Returns the stream at playback position index. */
        get_list_stream(stream_index: int64): AudioStream
        
        /** If `true`, the playlist will shuffle each time playback starts and each time it loops. */
        get shuffle(): boolean
        set shuffle(value: boolean)
        
        /** If `true`, the playlist will loop, otherwise the playlist will end when the last stream is finished. */
        get loop(): boolean
        set loop(value: boolean)
        
        /** Fade time used when a stream ends, when going to the next one. Streams are expected to have an extra bit of audio after the end to help with fading. */
        get fade_time(): float64
        set fade_time(value: float64)
        
        /** Amount of streams in the playlist. */
        get stream_count(): any /*Streams,stream_,unfoldable,page_size=999,add_button_text=Add Stream*/
        set stream_count(value: any /*Streams,stream_,unfoldable,page_size=999,add_button_text=Add Stream*/)
        get stream_0(): AudioStream
        set stream_0(value: AudioStream)
        get stream_1(): AudioStream
        set stream_1(value: AudioStream)
        get stream_2(): AudioStream
        set stream_2(value: AudioStream)
        get stream_3(): AudioStream
        set stream_3(value: AudioStream)
        get stream_4(): AudioStream
        set stream_4(value: AudioStream)
        get stream_5(): AudioStream
        set stream_5(value: AudioStream)
        get stream_6(): AudioStream
        set stream_6(value: AudioStream)
        get stream_7(): AudioStream
        set stream_7(value: AudioStream)
        get stream_8(): AudioStream
        set stream_8(value: AudioStream)
        get stream_9(): AudioStream
        set stream_9(value: AudioStream)
        get stream_10(): AudioStream
        set stream_10(value: AudioStream)
        get stream_11(): AudioStream
        set stream_11(value: AudioStream)
        get stream_12(): AudioStream
        set stream_12(value: AudioStream)
        get stream_13(): AudioStream
        set stream_13(value: AudioStream)
        get stream_14(): AudioStream
        set stream_14(value: AudioStream)
        get stream_15(): AudioStream
        set stream_15(value: AudioStream)
        get stream_16(): AudioStream
        set stream_16(value: AudioStream)
        get stream_17(): AudioStream
        set stream_17(value: AudioStream)
        get stream_18(): AudioStream
        set stream_18(value: AudioStream)
        get stream_19(): AudioStream
        set stream_19(value: AudioStream)
        get stream_20(): AudioStream
        set stream_20(value: AudioStream)
        get stream_21(): AudioStream
        set stream_21(value: AudioStream)
        get stream_22(): AudioStream
        set stream_22(value: AudioStream)
        get stream_23(): AudioStream
        set stream_23(value: AudioStream)
        get stream_24(): AudioStream
        set stream_24(value: AudioStream)
        get stream_25(): AudioStream
        set stream_25(value: AudioStream)
        get stream_26(): AudioStream
        set stream_26(value: AudioStream)
        get stream_27(): AudioStream
        set stream_27(value: AudioStream)
        get stream_28(): AudioStream
        set stream_28(value: AudioStream)
        get stream_29(): AudioStream
        set stream_29(value: AudioStream)
        get stream_30(): AudioStream
        set stream_30(value: AudioStream)
        get stream_31(): AudioStream
        set stream_31(value: AudioStream)
        get stream_32(): AudioStream
        set stream_32(value: AudioStream)
        get stream_33(): AudioStream
        set stream_33(value: AudioStream)
        get stream_34(): AudioStream
        set stream_34(value: AudioStream)
        get stream_35(): AudioStream
        set stream_35(value: AudioStream)
        get stream_36(): AudioStream
        set stream_36(value: AudioStream)
        get stream_37(): AudioStream
        set stream_37(value: AudioStream)
        get stream_38(): AudioStream
        set stream_38(value: AudioStream)
        get stream_39(): AudioStream
        set stream_39(value: AudioStream)
        get stream_40(): AudioStream
        set stream_40(value: AudioStream)
        get stream_41(): AudioStream
        set stream_41(value: AudioStream)
        get stream_42(): AudioStream
        set stream_42(value: AudioStream)
        get stream_43(): AudioStream
        set stream_43(value: AudioStream)
        get stream_44(): AudioStream
        set stream_44(value: AudioStream)
        get stream_45(): AudioStream
        set stream_45(value: AudioStream)
        get stream_46(): AudioStream
        set stream_46(value: AudioStream)
        get stream_47(): AudioStream
        set stream_47(value: AudioStream)
        get stream_48(): AudioStream
        set stream_48(value: AudioStream)
        get stream_49(): AudioStream
        set stream_49(value: AudioStream)
        get stream_50(): AudioStream
        set stream_50(value: AudioStream)
        get stream_51(): AudioStream
        set stream_51(value: AudioStream)
        get stream_52(): AudioStream
        set stream_52(value: AudioStream)
        get stream_53(): AudioStream
        set stream_53(value: AudioStream)
        get stream_54(): AudioStream
        set stream_54(value: AudioStream)
        get stream_55(): AudioStream
        set stream_55(value: AudioStream)
        get stream_56(): AudioStream
        set stream_56(value: AudioStream)
        get stream_57(): AudioStream
        set stream_57(value: AudioStream)
        get stream_58(): AudioStream
        set stream_58(value: AudioStream)
        get stream_59(): AudioStream
        set stream_59(value: AudioStream)
        get stream_60(): AudioStream
        set stream_60(value: AudioStream)
        get stream_61(): AudioStream
        set stream_61(value: AudioStream)
        get stream_62(): AudioStream
        set stream_62(value: AudioStream)
        get stream_63(): AudioStream
        set stream_63(value: AudioStream)
    }
    /** AudioStream that lets the user play custom streams at any time from code, simultaneously using a single player.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreampolyphonic.html  
     */
    class AudioStreamPolyphonic extends AudioStream {
        constructor(identifier?: any)
        /** Maximum amount of simultaneous streams that can be played. */
        get polyphony(): int64
        set polyphony(value: int64)
    }
    class AudioStreamPreviewGenerator extends Node {
        constructor(identifier?: any)
        generate_preview(stream: AudioStream): any /*AudioStreamPreview*/
        readonly preview_updated: Signal1<int64>
    }
    namespace AudioStreamRandomizer {
        enum PlaybackMode {
            /** Pick a stream at random according to the probability weights chosen for each stream, but avoid playing the same stream twice in a row whenever possible. If only 1 sound is present in the pool, the same sound will always play, effectively allowing repeats to occur. */
            PLAYBACK_RANDOM_NO_REPEATS = 0,
            
            /** Pick a stream at random according to the probability weights chosen for each stream. If only 1 sound is present in the pool, the same sound will always play. */
            PLAYBACK_RANDOM = 1,
            
            /** Play streams in the order they appear in the stream pool. If only 1 sound is present in the pool, the same sound will always play. */
            PLAYBACK_SEQUENTIAL = 2,
        }
    }
    /** Wraps a pool of audio streams with pitch and volume shifting.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamrandomizer.html  
     */
    class AudioStreamRandomizer extends AudioStream {
        constructor(identifier?: any)
        /** Insert a stream at the specified index. If the index is less than zero, the insertion occurs at the end of the underlying pool. */
        add_stream(index: int64, stream: AudioStream, weight: float64 = 1): void
        
        /** Move a stream from one index to another. */
        move_stream(index_from: int64, index_to: int64): void
        
        /** Remove the stream at the specified index. */
        remove_stream(index: int64): void
        
        /** Set the AudioStream at the specified index. */
        set_stream(index: int64, stream: AudioStream): void
        
        /** Returns the stream at the specified index. */
        get_stream(index: int64): AudioStream
        
        /** Set the probability weight of the stream at the specified index. The higher this value, the more likely that the randomizer will choose this stream during random playback modes. */
        set_stream_probability_weight(index: int64, weight: float64): void
        
        /** Returns the probability weight associated with the stream at the given index. */
        get_stream_probability_weight(index: int64): float64
        
        /** Controls how this AudioStreamRandomizer picks which AudioStream to play next. */
        get playback_mode(): int64
        set playback_mode(value: int64)
        
        /** The intensity of random pitch variation. A value of 1 means no variation. */
        get random_pitch(): float64
        set random_pitch(value: float64)
        
        /** The intensity of random volume variation. A value of 0 means no variation. */
        get random_volume_offset_db(): float64
        set random_volume_offset_db(value: float64)
        
        /** The number of streams in the stream pool. */
        get streams_count(): int64
        set streams_count(value: int64)
    }
    class AudioStreamRandomizerEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** Stream that can be fitted with sub-streams, which will be played in-sync.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamsynchronized.html  
     */
    class AudioStreamSynchronized extends AudioStream {
        /** Maximum amount of streams that can be synchronized. */
        static readonly MAX_STREAMS = 32
        constructor(identifier?: any)
        
        /** Set one of the synchronized streams, by index. */
        set_sync_stream(stream_index: int64, audio_stream: AudioStream): void
        
        /** Get one of the synchronized streams, by index. */
        get_sync_stream(stream_index: int64): AudioStream
        
        /** Set the volume of one of the synchronized streams, by index. */
        set_sync_stream_volume(stream_index: int64, volume_db: float64): void
        
        /** Get the volume of one of the synchronized streams, by index. */
        get_sync_stream_volume(stream_index: int64): float64
        
        /** Set the total amount of streams that will be played back synchronized. */
        get stream_count(): any /*Streams,stream_,unfoldable,page_size=999,add_button_text=Add Stream*/
        set stream_count(value: any /*Streams,stream_,unfoldable,page_size=999,add_button_text=Add Stream*/)
    }
    namespace AudioStreamWAV {
        enum Format {
            /** 8-bit audio codec. */
            FORMAT_8_BITS = 0,
            
            /** 16-bit audio codec. */
            FORMAT_16_BITS = 1,
            
            /** Audio is compressed using IMA ADPCM. */
            FORMAT_IMA_ADPCM = 2,
            
            /** Audio is compressed as QOA ([url=https://qoaformat.org/]Quite OK Audio[/url]). */
            FORMAT_QOA = 3,
        }
        enum LoopMode {
            /** Audio does not loop. */
            LOOP_DISABLED = 0,
            
            /** Audio loops the data between [member loop_begin] and [member loop_end], playing forward only. */
            LOOP_FORWARD = 1,
            
            /** Audio loops the data between [member loop_begin] and [member loop_end], playing back and forth. */
            LOOP_PINGPONG = 2,
            
            /** Audio loops the data between [member loop_begin] and [member loop_end], playing backward only. */
            LOOP_BACKWARD = 3,
        }
    }
    /** Stores audio data loaded from WAV files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_audiostreamwav.html  
     */
    class AudioStreamWAV extends AudioStream {
        constructor(identifier?: any)
        /** Saves the AudioStreamWAV as a WAV file to [param path]. Samples with IMA ADPCM or QOA formats can't be saved.  
         *      
         *  **Note:** A `.wav` extension is automatically appended to [param path] if it is missing.  
         */
        save_to_wav(path: string): GError
        
        /** Contains the audio data in bytes.  
         *      
         *  **Note:** This property expects signed PCM8 data. To convert unsigned PCM8 to signed PCM8, subtract 128 from each byte.  
         */
        get data(): PackedByteArray
        set data(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** Audio format. See [enum Format] constants for values. */
        get format(): int64
        set format(value: int64)
        
        /** The loop mode. This information will be imported automatically from the WAV file if present. See [enum LoopMode] constants for values. */
        get loop_mode(): int64
        set loop_mode(value: int64)
        
        /** The loop start point (in number of samples, relative to the beginning of the stream). This information will be imported automatically from the WAV file if present. */
        get loop_begin(): int64
        set loop_begin(value: int64)
        
        /** The loop end point (in number of samples, relative to the beginning of the stream). This information will be imported automatically from the WAV file if present. */
        get loop_end(): int64
        set loop_end(value: int64)
        
        /** The sample rate for mixing this audio. Higher values require more storage space, but result in better quality.  
         *  In games, common sample rates in use are `11025`, `16000`, `22050`, `32000`, `44100`, and `48000`.  
         *  According to the [url=https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem]Nyquist-Shannon sampling theorem[/url], there is no quality difference to human hearing when going past 40,000 Hz (since most humans can only hear up to ~20,000 Hz, often less). If you are using lower-pitched sounds such as voices, lower sample rates such as `32000` or `22050` may be usable with no loss in quality.  
         */
        get mix_rate(): int64
        set mix_rate(value: int64)
        
        /** If `true`, audio is stereo. */
        get stereo(): boolean
        set stereo(value: boolean)
    }
    namespace BackBufferCopy {
        enum CopyMode {
            /** Disables the buffering mode. This means the [BackBufferCopy] node will directly use the portion of screen it covers. */
            COPY_MODE_DISABLED = 0,
            
            /** [BackBufferCopy] buffers a rectangular region. */
            COPY_MODE_RECT = 1,
            
            /** [BackBufferCopy] buffers the entire screen. */
            COPY_MODE_VIEWPORT = 2,
        }
    }
    /** A node that copies a region of the screen to a buffer for access in shader code.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_backbuffercopy.html  
     */
    class BackBufferCopy extends Node2D {
        constructor(identifier?: any)
        /** Buffer mode. See [enum CopyMode] constants. */
        get copy_mode(): int64
        set copy_mode(value: int64)
        
        /** The area covered by the [BackBufferCopy]. Only used if [member copy_mode] is [constant COPY_MODE_RECT]. */
        get rect(): Rect2
        set rect(value: Rect2)
    }
    class BackgroundProgress extends HBoxContainer {
        constructor(identifier?: any)
    }
    namespace BaseButton {
        enum DrawMode {
            /** The normal state (i.e. not pressed, not hovered, not toggled and enabled) of buttons. */
            DRAW_NORMAL = 0,
            
            /** The state of buttons are pressed. */
            DRAW_PRESSED = 1,
            
            /** The state of buttons are hovered. */
            DRAW_HOVER = 2,
            
            /** The state of buttons are disabled. */
            DRAW_DISABLED = 3,
            
            /** The state of buttons are both hovered and pressed. */
            DRAW_HOVER_PRESSED = 4,
        }
        enum ActionMode {
            /** Require just a press to consider the button clicked. */
            ACTION_MODE_BUTTON_PRESS = 0,
            
            /** Require a press and a subsequent release before considering the button clicked. */
            ACTION_MODE_BUTTON_RELEASE = 1,
        }
    }
    /** Abstract base class for GUI buttons.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_basebutton.html  
     */
    class BaseButton extends Control {
        constructor(identifier?: any)
        /** Called when the button is pressed. If you need to know the button's pressed state (and [member toggle_mode] is active), use [method _toggled] instead. */
        /* gdvirtual */ _pressed(): void
        
        /** Called when the button is toggled (only if [member toggle_mode] is active). */
        /* gdvirtual */ _toggled(toggled_on: boolean): void
        
        /** Changes the [member button_pressed] state of the button, without emitting [signal toggled]. Use when you just want to change the state of the button without sending the pressed event (e.g. when initializing scene). Only works if [member toggle_mode] is `true`.  
         *      
         *  **Note:** This method doesn't unpress other buttons in [member button_group].  
         */
        set_pressed_no_signal(pressed: boolean): void
        
        /** Returns `true` if the mouse has entered the button and has not left it yet. */
        is_hovered(): boolean
        
        /** Returns the visual state used to draw the button. This is useful mainly when implementing your own draw code by either overriding _draw() or connecting to "draw" signal. The visual state of the button is defined by the [enum DrawMode] enum. */
        get_draw_mode(): BaseButton.DrawMode
        
        /** If `true`, the button is in disabled state and can't be clicked or toggled. */
        get disabled(): boolean
        set disabled(value: boolean)
        
        /** If `true`, the button is in toggle mode. Makes the button flip state between pressed and unpressed each time its area is clicked. */
        get toggle_mode(): boolean
        set toggle_mode(value: boolean)
        
        /** If `true`, the button's state is pressed. Means the button is pressed down or toggled (if [member toggle_mode] is active). Only works if [member toggle_mode] is `true`.  
         *      
         *  **Note:** Setting [member button_pressed] will result in [signal toggled] to be emitted. If you want to change the pressed state without emitting that signal, use [method set_pressed_no_signal].  
         */
        get button_pressed(): boolean
        set button_pressed(value: boolean)
        
        /** Determines when the button is considered clicked, one of the [enum ActionMode] constants. */
        get action_mode(): int64
        set action_mode(value: int64)
        
        /** Binary mask to choose which mouse buttons this button will respond to.  
         *  To allow both left-click and right-click, use `MOUSE_BUTTON_MASK_LEFT | MOUSE_BUTTON_MASK_RIGHT`.  
         */
        get button_mask(): int64
        set button_mask(value: int64)
        
        /** If `true`, the button stays pressed when moving the cursor outside the button while pressing it.  
         *      
         *  **Note:** This property only affects the button's visual appearance. Signals will be emitted at the same moment regardless of this property's value.  
         */
        get keep_pressed_outside(): boolean
        set keep_pressed_outside(value: boolean)
        
        /** The [ButtonGroup] associated with the button. Not to be confused with node groups.  
         *      
         *  **Note:** The button will be configured as a radio button if a [ButtonGroup] is assigned to it.  
         */
        get button_group(): ButtonGroup
        set button_group(value: ButtonGroup)
        
        /** [Shortcut] associated to the button. */
        get shortcut(): Shortcut
        set shortcut(value: Shortcut)
        
        /** If `true`, the button will highlight for a short amount of time when its shortcut is activated. If `false` and [member toggle_mode] is `false`, the shortcut will activate without any visual feedback. */
        get shortcut_feedback(): boolean
        set shortcut_feedback(value: boolean)
        
        /** If `true`, the button will add information about its shortcut in the tooltip. */
        get shortcut_in_tooltip(): boolean
        set shortcut_in_tooltip(value: boolean)
        
        /** Emitted when the button is toggled or pressed. This is on [signal button_down] if [member action_mode] is [constant ACTION_MODE_BUTTON_PRESS] and on [signal button_up] otherwise.  
         *  If you need to know the button's pressed state (and [member toggle_mode] is active), use [signal toggled] instead.  
         */
        readonly pressed: Signal0
        
        /** Emitted when the button stops being held down. */
        readonly button_up: Signal0
        
        /** Emitted when the button starts being held down. */
        readonly button_down: Signal0
        
        /** Emitted when the button was just toggled between pressed and normal states (only if [member toggle_mode] is active). The new state is contained in the [param toggled_on] argument. */
        readonly toggled: Signal1<boolean>
    }
    namespace BaseMaterial3D {
        enum TextureParam {
            /** Texture specifying per-pixel color. */
            TEXTURE_ALBEDO = 0,
            
            /** Texture specifying per-pixel metallic value. */
            TEXTURE_METALLIC = 1,
            
            /** Texture specifying per-pixel roughness value. */
            TEXTURE_ROUGHNESS = 2,
            
            /** Texture specifying per-pixel emission color. */
            TEXTURE_EMISSION = 3,
            
            /** Texture specifying per-pixel normal vector. */
            TEXTURE_NORMAL = 4,
            
            /** Texture specifying per-pixel rim value. */
            TEXTURE_RIM = 5,
            
            /** Texture specifying per-pixel clearcoat value. */
            TEXTURE_CLEARCOAT = 6,
            
            /** Texture specifying per-pixel flowmap direction for use with [member anisotropy]. */
            TEXTURE_FLOWMAP = 7,
            
            /** Texture specifying per-pixel ambient occlusion value. */
            TEXTURE_AMBIENT_OCCLUSION = 8,
            
            /** Texture specifying per-pixel height. */
            TEXTURE_HEIGHTMAP = 9,
            
            /** Texture specifying per-pixel subsurface scattering. */
            TEXTURE_SUBSURFACE_SCATTERING = 10,
            
            /** Texture specifying per-pixel transmittance for subsurface scattering. */
            TEXTURE_SUBSURFACE_TRANSMITTANCE = 11,
            
            /** Texture specifying per-pixel backlight color. */
            TEXTURE_BACKLIGHT = 12,
            
            /** Texture specifying per-pixel refraction strength. */
            TEXTURE_REFRACTION = 13,
            
            /** Texture specifying per-pixel detail mask blending value. */
            TEXTURE_DETAIL_MASK = 14,
            
            /** Texture specifying per-pixel detail color. */
            TEXTURE_DETAIL_ALBEDO = 15,
            
            /** Texture specifying per-pixel detail normal. */
            TEXTURE_DETAIL_NORMAL = 16,
            
            /** Texture holding ambient occlusion, roughness, and metallic. */
            TEXTURE_ORM = 17,
            
            /** Represents the size of the [enum TextureParam] enum. */
            TEXTURE_MAX = 18,
        }
        enum TextureFilter {
            /** The texture filter reads from the nearest pixel only. This makes the texture look pixelated from up close, and grainy from a distance (due to mipmaps not being sampled). */
            TEXTURE_FILTER_NEAREST = 0,
            
            /** The texture filter blends between the nearest 4 pixels. This makes the texture look smooth from up close, and grainy from a distance (due to mipmaps not being sampled). */
            TEXTURE_FILTER_LINEAR = 1,
            
            /** The texture filter reads from the nearest pixel and blends between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look pixelated from up close, and smooth from a distance. */
            TEXTURE_FILTER_NEAREST_WITH_MIPMAPS = 2,
            
            /** The texture filter blends between the nearest 4 pixels and between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look smooth from up close, and smooth from a distance. */
            TEXTURE_FILTER_LINEAR_WITH_MIPMAPS = 3,
            
            /** The texture filter reads from the nearest pixel and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look pixelated from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level]. */
            TEXTURE_FILTER_NEAREST_WITH_MIPMAPS_ANISOTROPIC = 4,
            
            /** The texture filter blends between the nearest 4 pixels and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look smooth from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level]. */
            TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC = 5,
            
            /** Represents the size of the [enum TextureFilter] enum. */
            TEXTURE_FILTER_MAX = 6,
        }
        enum DetailUV {
            /** Use `UV` with the detail texture. */
            DETAIL_UV_1 = 0,
            
            /** Use `UV2` with the detail texture. */
            DETAIL_UV_2 = 1,
        }
        enum Transparency {
            /** The material will not use transparency. This is the fastest to render. */
            TRANSPARENCY_DISABLED = 0,
            
            /** The material will use the texture's alpha values for transparency. This is the slowest to render, and disables shadow casting. */
            TRANSPARENCY_ALPHA = 1,
            
            /** The material will cut off all values below a threshold, the rest will remain opaque. The opaque portions will be rendered in the depth prepass. This is faster to render than alpha blending, but slower than opaque rendering. This also supports casting shadows. */
            TRANSPARENCY_ALPHA_SCISSOR = 2,
            
            /** The material will cut off all values below a spatially-deterministic threshold, the rest will remain opaque. This is faster to render than alpha blending, but slower than opaque rendering. This also supports casting shadows. Alpha hashing is suited for hair rendering. */
            TRANSPARENCY_ALPHA_HASH = 3,
            
            /** The material will use the texture's alpha value for transparency, but will discard fragments with an alpha of less than 0.99 during the depth prepass and fragments with an alpha less than 0.1 during the shadow pass. This also supports casting shadows. */
            TRANSPARENCY_ALPHA_DEPTH_PRE_PASS = 4,
            
            /** Represents the size of the [enum Transparency] enum. */
            TRANSPARENCY_MAX = 5,
        }
        enum ShadingMode {
            /** The object will not receive shadows. This is the fastest to render, but it disables all interactions with lights. */
            SHADING_MODE_UNSHADED = 0,
            
            /** The object will be shaded per pixel. Useful for realistic shading effects. */
            SHADING_MODE_PER_PIXEL = 1,
            
            /** The object will be shaded per vertex. Useful when you want cheaper shaders and do not care about visual quality. Not implemented yet (this mode will act like [constant SHADING_MODE_PER_PIXEL]). */
            SHADING_MODE_PER_VERTEX = 2,
            
            /** Represents the size of the [enum ShadingMode] enum. */
            SHADING_MODE_MAX = 3,
        }
        enum Feature {
            /** Constant for setting [member emission_enabled]. */
            FEATURE_EMISSION = 0,
            
            /** Constant for setting [member normal_enabled]. */
            FEATURE_NORMAL_MAPPING = 1,
            
            /** Constant for setting [member rim_enabled]. */
            FEATURE_RIM = 2,
            
            /** Constant for setting [member clearcoat_enabled]. */
            FEATURE_CLEARCOAT = 3,
            
            /** Constant for setting [member anisotropy_enabled]. */
            FEATURE_ANISOTROPY = 4,
            
            /** Constant for setting [member ao_enabled]. */
            FEATURE_AMBIENT_OCCLUSION = 5,
            
            /** Constant for setting [member heightmap_enabled]. */
            FEATURE_HEIGHT_MAPPING = 6,
            
            /** Constant for setting [member subsurf_scatter_enabled]. */
            FEATURE_SUBSURFACE_SCATTERING = 7,
            
            /** Constant for setting [member subsurf_scatter_transmittance_enabled]. */
            FEATURE_SUBSURFACE_TRANSMITTANCE = 8,
            
            /** Constant for setting [member backlight_enabled]. */
            FEATURE_BACKLIGHT = 9,
            
            /** Constant for setting [member refraction_enabled]. */
            FEATURE_REFRACTION = 10,
            
            /** Constant for setting [member detail_enabled]. */
            FEATURE_DETAIL = 11,
            
            /** Represents the size of the [enum Feature] enum. */
            FEATURE_MAX = 12,
        }
        enum BlendMode {
            /** Default blend mode. The color of the object is blended over the background based on the object's alpha value. */
            BLEND_MODE_MIX = 0,
            
            /** The color of the object is added to the background. */
            BLEND_MODE_ADD = 1,
            
            /** The color of the object is subtracted from the background. */
            BLEND_MODE_SUB = 2,
            
            /** The color of the object is multiplied by the background. */
            BLEND_MODE_MUL = 3,
            
            /** The color of the object is added to the background and the alpha channel is used to mask out the background. This is effectively a hybrid of the blend mix and add modes, useful for effects like fire where you want the flame to add but the smoke to mix. By default, this works with unshaded materials using premultiplied textures. For shaded materials, use the `PREMUL_ALPHA_FACTOR` built-in so that lighting can be modulated as well. */
            BLEND_MODE_PREMULT_ALPHA = 4,
        }
        enum AlphaAntiAliasing {
            /** Disables Alpha AntiAliasing for the material. */
            ALPHA_ANTIALIASING_OFF = 0,
            
            /** Enables AlphaToCoverage. Alpha values in the material are passed to the AntiAliasing sample mask. */
            ALPHA_ANTIALIASING_ALPHA_TO_COVERAGE = 1,
            
            /** Enables AlphaToCoverage and forces all non-zero alpha values to `1`. Alpha values in the material are passed to the AntiAliasing sample mask. */
            ALPHA_ANTIALIASING_ALPHA_TO_COVERAGE_AND_TO_ONE = 2,
        }
        enum DepthDrawMode {
            /** Default depth draw mode. Depth is drawn only for opaque objects during the opaque prepass (if any) and during the opaque pass. */
            DEPTH_DRAW_OPAQUE_ONLY = 0,
            
            /** Objects will write to depth during the opaque and the transparent passes. Transparent objects that are close to the camera may obscure other transparent objects behind them.  
             *      
             *  **Note:** This does not influence whether transparent objects are included in the depth prepass or not. For that, see [enum Transparency].  
             */
            DEPTH_DRAW_ALWAYS = 1,
            
            /** Objects will not write their depth to the depth buffer, even during the depth prepass (if enabled). */
            DEPTH_DRAW_DISABLED = 2,
        }
        enum CullMode {
            /** Default cull mode. The back of the object is culled when not visible. Back face triangles will be culled when facing the camera. This results in only the front side of triangles being drawn. For closed-surface meshes, this means that only the exterior of the mesh will be visible. */
            CULL_BACK = 0,
            
            /** Front face triangles will be culled when facing the camera. This results in only the back side of triangles being drawn. For closed-surface meshes, this means that the interior of the mesh will be drawn instead of the exterior. */
            CULL_FRONT = 1,
            
            /** No face culling is performed; both the front face and back face will be visible. */
            CULL_DISABLED = 2,
        }
        enum Flags {
            /** Disables the depth test, so this object is drawn on top of all others drawn before it. This puts the object in the transparent draw pass where it is sorted based on distance to camera. Objects drawn after it in the draw order may cover it. This also disables writing to depth. */
            FLAG_DISABLE_DEPTH_TEST = 0,
            
            /** Set `ALBEDO` to the per-vertex color specified in the mesh. */
            FLAG_ALBEDO_FROM_VERTEX_COLOR = 1,
            
            /** Vertex colors are considered to be stored in sRGB color space and are converted to linear color space during rendering. See also [member vertex_color_is_srgb].  
             *      
             *  **Note:** Only effective when using the Forward+ and Mobile rendering methods.  
             */
            FLAG_SRGB_VERTEX_COLOR = 2,
            
            /** Uses point size to alter the size of primitive points. Also changes the albedo texture lookup to use `POINT_COORD` instead of `UV`. */
            FLAG_USE_POINT_SIZE = 3,
            
            /** Object is scaled by depth so that it always appears the same size on screen. */
            FLAG_FIXED_SIZE = 4,
            
            /** Shader will keep the scale set for the mesh. Otherwise the scale is lost when billboarding. Only applies when [member billboard_mode] is [constant BILLBOARD_ENABLED]. */
            FLAG_BILLBOARD_KEEP_SCALE = 5,
            
            /** Use triplanar texture lookup for all texture lookups that would normally use `UV`. */
            FLAG_UV1_USE_TRIPLANAR = 6,
            
            /** Use triplanar texture lookup for all texture lookups that would normally use `UV2`. */
            FLAG_UV2_USE_TRIPLANAR = 7,
            
            /** Use triplanar texture lookup for all texture lookups that would normally use `UV`. */
            FLAG_UV1_USE_WORLD_TRIPLANAR = 8,
            
            /** Use triplanar texture lookup for all texture lookups that would normally use `UV2`. */
            FLAG_UV2_USE_WORLD_TRIPLANAR = 9,
            
            /** Use `UV2` coordinates to look up from the [member ao_texture]. */
            FLAG_AO_ON_UV2 = 10,
            
            /** Use `UV2` coordinates to look up from the [member emission_texture]. */
            FLAG_EMISSION_ON_UV2 = 11,
            
            /** Forces the shader to convert albedo from sRGB space to linear space. See also [member albedo_texture_force_srgb]. */
            FLAG_ALBEDO_TEXTURE_FORCE_SRGB = 12,
            
            /** Disables receiving shadows from other objects. */
            FLAG_DONT_RECEIVE_SHADOWS = 13,
            
            /** Disables receiving ambient light. */
            FLAG_DISABLE_AMBIENT_LIGHT = 14,
            
            /** Enables the shadow to opacity feature. */
            FLAG_USE_SHADOW_TO_OPACITY = 15,
            
            /** Enables the texture to repeat when UV coordinates are outside the 0-1 range. If using one of the linear filtering modes, this can result in artifacts at the edges of a texture when the sampler filters across the edges of the texture. */
            FLAG_USE_TEXTURE_REPEAT = 16,
            
            /** Invert values read from a depth texture to convert them to height values (heightmap). */
            FLAG_INVERT_HEIGHTMAP = 17,
            
            /** Enables the skin mode for subsurface scattering which is used to improve the look of subsurface scattering when used for human skin. */
            FLAG_SUBSURFACE_MODE_SKIN = 18,
            
            /** Enables parts of the shader required for [GPUParticles3D] trails to function. This also requires using a mesh with appropriate skinning, such as [RibbonTrailMesh] or [TubeTrailMesh]. Enabling this feature outside of materials used in [GPUParticles3D] meshes will break material rendering. */
            FLAG_PARTICLE_TRAILS_MODE = 19,
            
            /** Enables multichannel signed distance field rendering shader. */
            FLAG_ALBEDO_TEXTURE_MSDF = 20,
            
            /** Disables receiving depth-based or volumetric fog. */
            FLAG_DISABLE_FOG = 21,
            
            /** Represents the size of the [enum Flags] enum. */
            FLAG_MAX = 22,
        }
        enum DiffuseMode {
            /** Default diffuse scattering algorithm. */
            DIFFUSE_BURLEY = 0,
            
            /** Diffuse scattering ignores roughness. */
            DIFFUSE_LAMBERT = 1,
            
            /** Extends Lambert to cover more than 90 degrees when roughness increases. */
            DIFFUSE_LAMBERT_WRAP = 2,
            
            /** Uses a hard cut for lighting, with smoothing affected by roughness. */
            DIFFUSE_TOON = 3,
        }
        enum SpecularMode {
            /** Default specular blob. */
            SPECULAR_SCHLICK_GGX = 0,
            
            /** Toon blob which changes size based on roughness. */
            SPECULAR_TOON = 1,
            
            /** No specular blob. This is slightly faster to render than other specular modes. */
            SPECULAR_DISABLED = 2,
        }
        enum BillboardMode {
            /** Billboard mode is disabled. */
            BILLBOARD_DISABLED = 0,
            
            /** The object's Z axis will always face the camera. */
            BILLBOARD_ENABLED = 1,
            
            /** The object's X axis will always face the camera. */
            BILLBOARD_FIXED_Y = 2,
            
            /** Used for particle systems when assigned to [GPUParticles3D] and [CPUParticles3D] nodes (flipbook animation). Enables `particles_anim_*` properties.  
             *  The [member ParticleProcessMaterial.anim_speed_min] or [member CPUParticles3D.anim_speed_min] should also be set to a value bigger than zero for the animation to play.  
             */
            BILLBOARD_PARTICLES = 3,
        }
        enum TextureChannel {
            /** Used to read from the red channel of a texture. */
            TEXTURE_CHANNEL_RED = 0,
            
            /** Used to read from the green channel of a texture. */
            TEXTURE_CHANNEL_GREEN = 1,
            
            /** Used to read from the blue channel of a texture. */
            TEXTURE_CHANNEL_BLUE = 2,
            
            /** Used to read from the alpha channel of a texture. */
            TEXTURE_CHANNEL_ALPHA = 3,
            
            /** Used to read from the linear (non-perceptual) average of the red, green and blue channels of a texture. */
            TEXTURE_CHANNEL_GRAYSCALE = 4,
        }
        enum EmissionOperator {
            /** Adds the emission color to the color from the emission texture. */
            EMISSION_OP_ADD = 0,
            
            /** Multiplies the emission color by the color from the emission texture. */
            EMISSION_OP_MULTIPLY = 1,
        }
        enum DistanceFadeMode {
            /** Do not use distance fade. */
            DISTANCE_FADE_DISABLED = 0,
            
            /** Smoothly fades the object out based on each pixel's distance from the camera using the alpha channel. */
            DISTANCE_FADE_PIXEL_ALPHA = 1,
            
            /** Smoothly fades the object out based on each pixel's distance from the camera using a dithering approach. Dithering discards pixels based on a set pattern to smoothly fade without enabling transparency. On certain hardware, this can be faster than [constant DISTANCE_FADE_PIXEL_ALPHA]. */
            DISTANCE_FADE_PIXEL_DITHER = 2,
            
            /** Smoothly fades the object out based on the object's distance from the camera using a dithering approach. Dithering discards pixels based on a set pattern to smoothly fade without enabling transparency. On certain hardware, this can be faster than [constant DISTANCE_FADE_PIXEL_ALPHA] and [constant DISTANCE_FADE_PIXEL_DITHER]. */
            DISTANCE_FADE_OBJECT_DITHER = 3,
        }
    }
    /** Abstract base class for defining the 3D rendering properties of meshes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_basematerial3d.html  
     */
    class BaseMaterial3D extends Material {
        constructor(identifier?: any)
        /** If `true`, enables the specified flag. Flags are optional behavior that can be turned on and off. Only one flag can be enabled at a time with this function, the flag enumerators cannot be bit-masked together to enable or disable multiple flags at once. Flags can also be enabled by setting the corresponding member to `true`. See [enum Flags] enumerator for options. */
        set_flag(flag: BaseMaterial3D.Flags, enable: boolean): void
        
        /** Returns `true`, if the specified flag is enabled. See [enum Flags] enumerator for options. */
        get_flag(flag: BaseMaterial3D.Flags): boolean
        
        /** If `true`, enables the specified [enum Feature]. Many features that are available in [BaseMaterial3D]s need to be enabled before use. This way the cost for using the feature is only incurred when specified. Features can also be enabled by setting the corresponding member to `true`. */
        set_feature(feature: BaseMaterial3D.Feature, enable: boolean): void
        
        /** Returns `true`, if the specified [enum Feature] is enabled. */
        get_feature(feature: BaseMaterial3D.Feature): boolean
        
        /** Sets the texture for the slot specified by [param param]. See [enum TextureParam] for available slots. */
        set_texture(param: BaseMaterial3D.TextureParam, texture: Texture2D): void
        
        /** Returns the [Texture2D] associated with the specified [enum TextureParam]. */
        get_texture(param: BaseMaterial3D.TextureParam): Texture2D
        
        /** The material's transparency mode. Some transparency modes will disable shadow casting. Any transparency mode other than [constant TRANSPARENCY_DISABLED] has a greater performance impact compared to opaque rendering. See also [member blend_mode]. */
        get transparency(): int64
        set transparency(value: int64)
        
        /** Threshold at which the alpha scissor will discard values. Higher values will result in more pixels being discarded. If the material becomes too opaque at a distance, try increasing [member alpha_scissor_threshold]. If the material disappears at a distance, try decreasing [member alpha_scissor_threshold]. */
        get alpha_scissor_threshold(): float64
        set alpha_scissor_threshold(value: float64)
        
        /** The hashing scale for Alpha Hash. Recommended values between `0` and `2`. */
        get alpha_hash_scale(): float64
        set alpha_hash_scale(value: float64)
        
        /** The type of alpha antialiasing to apply. See [enum AlphaAntiAliasing]. */
        get alpha_antialiasing_mode(): int64
        set alpha_antialiasing_mode(value: int64)
        
        /** Threshold at which antialiasing will be applied on the alpha channel. */
        get alpha_antialiasing_edge(): float64
        set alpha_antialiasing_edge(value: float64)
        
        /** The material's blend mode.  
         *      
         *  **Note:** Values other than `Mix` force the object into the transparent pipeline. See [enum BlendMode].  
         */
        get blend_mode(): int64
        set blend_mode(value: int64)
        
        /** Determines which side of the triangle to cull depending on whether the triangle faces towards or away from the camera. See [enum CullMode]. */
        get cull_mode(): int64
        set cull_mode(value: int64)
        
        /** Determines when depth rendering takes place. See [enum DepthDrawMode]. See also [member transparency]. */
        get depth_draw_mode(): int64
        set depth_draw_mode(value: int64)
        
        /** If `true`, depth testing is disabled and the object will be drawn in render order. */
        get no_depth_test(): boolean
        set no_depth_test(value: boolean)
        
        /** Sets whether the shading takes place, per-pixel, per-vertex or unshaded. Per-vertex lighting is faster, making it the best choice for mobile applications, however it looks considerably worse than per-pixel. Unshaded rendering is the fastest, but disables all interactions with lights.  
         *      
         *  **Note:** Setting the shading mode vertex shading currently has no effect, as vertex shading is not implemented yet.  
         */
        get shading_mode(): int64
        set shading_mode(value: int64)
        
        /** The algorithm used for diffuse light scattering. See [enum DiffuseMode]. */
        get diffuse_mode(): int64
        set diffuse_mode(value: int64)
        
        /** The method for rendering the specular blob. See [enum SpecularMode].  
         *      
         *  **Note:** [member specular_mode] only applies to the specular blob. It does not affect specular reflections from the sky, screen-space reflections, [VoxelGI], SDFGI or [ReflectionProbe]s. To disable reflections from these sources as well, set [member metallic_specular] to `0.0` instead.  
         */
        get specular_mode(): int64
        set specular_mode(value: int64)
        
        /** If `true`, the object receives no ambient light. */
        get disable_ambient_light(): boolean
        set disable_ambient_light(value: boolean)
        
        /** If `true`, the object will not be affected by fog (neither volumetric nor depth fog). This is useful for unshaded or transparent materials (e.g. particles), which without this setting will be affected even if fully transparent. */
        get disable_fog(): boolean
        set disable_fog(value: boolean)
        
        /** If `true`, the vertex color is used as albedo color. */
        get vertex_color_use_as_albedo(): boolean
        set vertex_color_use_as_albedo(value: boolean)
        
        /** If `true`, vertex colors are considered to be stored in sRGB color space and are converted to linear color space during rendering. If `false`, vertex colors are considered to be stored in linear color space and are rendered as-is. See also [member albedo_texture_force_srgb].  
         *      
         *  **Note:** Only effective when using the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        get vertex_color_is_srgb(): boolean
        set vertex_color_is_srgb(value: boolean)
        
        /** The material's base color.  
         *      
         *  **Note:** If [member detail_enabled] is `true` and a [member detail_albedo] texture is specified, [member albedo_color] will  *not*  modulate the detail texture. This can be used to color partial areas of a material by not specifying an albedo texture and using a transparent [member detail_albedo] texture instead.  
         */
        get albedo_color(): Color
        set albedo_color(value: Color)
        
        /** Texture to multiply by [member albedo_color]. Used for basic texturing of objects.  
         *  If the texture appears unexpectedly too dark or too bright, check [member albedo_texture_force_srgb].  
         */
        get albedo_texture(): Texture2D
        set albedo_texture(value: Texture2D)
        
        /** If `true`, forces a conversion of the [member albedo_texture] from sRGB color space to linear color space. See also [member vertex_color_is_srgb].  
         *  This should only be enabled when needed (typically when using a [ViewportTexture] as [member albedo_texture]). If [member albedo_texture_force_srgb] is `true` when it shouldn't be, the texture will appear to be too dark. If [member albedo_texture_force_srgb] is `false` when it shouldn't be, the texture will appear to be too bright.  
         */
        get albedo_texture_force_srgb(): boolean
        set albedo_texture_force_srgb(value: boolean)
        
        /** Enables multichannel signed distance field rendering shader. Use [member msdf_pixel_range] and [member msdf_outline_size] to configure MSDF parameters. */
        get albedo_texture_msdf(): boolean
        set albedo_texture_msdf(value: boolean)
        
        /** The Occlusion/Roughness/Metallic texture to use. This is a more efficient replacement of [member ao_texture], [member roughness_texture] and [member metallic_texture] in [ORMMaterial3D]. Ambient occlusion is stored in the red channel. Roughness map is stored in the green channel. Metallic map is stored in the blue channel. The alpha channel is ignored. */
        get orm_texture(): Texture2D
        set orm_texture(value: Texture2D)
        
        /** A high value makes the material appear more like a metal. Non-metals use their albedo as the diffuse color and add diffuse to the specular reflection. With non-metals, the reflection appears on top of the albedo color. Metals use their albedo as a multiplier to the specular reflection and set the diffuse color to black resulting in a tinted reflection. Materials work better when fully metal or fully non-metal, values between `0` and `1` should only be used for blending between metal and non-metal sections. To alter the amount of reflection use [member roughness]. */
        get metallic(): float64
        set metallic(value: float64)
        
        /** Adjusts the strength of specular reflections. Specular reflections are composed of scene reflections and the specular lobe which is the bright spot that is reflected from light sources. When set to `0.0`, no specular reflections will be visible. This differs from the [constant SPECULAR_DISABLED] [enum SpecularMode] as [constant SPECULAR_DISABLED] only applies to the specular lobe from the light source.  
         *      
         *  **Note:** Unlike [member metallic], this is not energy-conserving, so it should be left at `0.5` in most cases. See also [member roughness].  
         */
        get metallic_specular(): float64
        set metallic_specular(value: float64)
        
        /** Texture used to specify metallic for an object. This is multiplied by [member metallic]. */
        get metallic_texture(): Texture2D
        set metallic_texture(value: Texture2D)
        
        /** Specifies the channel of the [member metallic_texture] in which the metallic information is stored. This is useful when you store the information for multiple effects in a single texture. For example if you stored metallic in the red channel, roughness in the blue, and ambient occlusion in the green you could reduce the number of textures you use. */
        get metallic_texture_channel(): int64
        set metallic_texture_channel(value: int64)
        
        /** Surface reflection. A value of `0` represents a perfect mirror while a value of `1` completely blurs the reflection. See also [member metallic]. */
        get roughness(): float64
        set roughness(value: float64)
        
        /** Texture used to control the roughness per-pixel. Multiplied by [member roughness]. */
        get roughness_texture(): Texture2D
        set roughness_texture(value: Texture2D)
        
        /** Specifies the channel of the [member roughness_texture] in which the roughness information is stored. This is useful when you store the information for multiple effects in a single texture. For example if you stored metallic in the red channel, roughness in the blue, and ambient occlusion in the green you could reduce the number of textures you use. */
        get roughness_texture_channel(): int64
        set roughness_texture_channel(value: int64)
        
        /** If `true`, the body emits light. Emitting light makes the object appear brighter. The object can also cast light on other objects if a [VoxelGI], SDFGI, or [LightmapGI] is used and this object is used in baked lighting. */
        get emission_enabled(): boolean
        set emission_enabled(value: boolean)
        
        /** The emitted light's color. See [member emission_enabled]. */
        get emission(): Color
        set emission(value: Color)
        
        /** Multiplier for emitted light. See [member emission_enabled]. */
        get emission_energy_multiplier(): float64
        set emission_energy_multiplier(value: float64)
        
        /** Luminance of emitted light, measured in nits (candela per square meter). Only available when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled. The default is roughly equivalent to an indoor lightbulb. */
        get emission_intensity(): float64
        set emission_intensity(value: float64)
        
        /** Sets how [member emission] interacts with [member emission_texture]. Can either add or multiply. See [enum EmissionOperator] for options. */
        get emission_operator(): int64
        set emission_operator(value: int64)
        
        /** Use `UV2` to read from the [member emission_texture]. */
        get emission_on_uv2(): boolean
        set emission_on_uv2(value: boolean)
        
        /** Texture that specifies how much surface emits light at a given point. */
        get emission_texture(): Texture2D
        set emission_texture(value: Texture2D)
        
        /** If `true`, normal mapping is enabled. This has a slight performance cost, especially on mobile GPUs. */
        get normal_enabled(): boolean
        set normal_enabled(value: boolean)
        
        /** The strength of the normal map's effect. */
        get normal_scale(): float64
        set normal_scale(value: float64)
        
        /** Texture used to specify the normal at a given pixel. The [member normal_texture] only uses the red and green channels; the blue and alpha channels are ignored. The normal read from [member normal_texture] is oriented around the surface normal provided by the [Mesh].  
         *      
         *  **Note:** The mesh must have both normals and tangents defined in its vertex data. Otherwise, the normal map won't render correctly and will only appear to darken the whole surface. If creating geometry with [SurfaceTool], you can use [method SurfaceTool.generate_normals] and [method SurfaceTool.generate_tangents] to automatically generate normals and tangents respectively.  
         *      
         *  **Note:** Godot expects the normal map to use X+, Y+, and Z+ coordinates. See [url=http://wiki.polycount.com/wiki/Normal_Map_Technical_Details#Common_Swizzle_Coordinates]this page[/url] for a comparison of normal map coordinates expected by popular engines.  
         *      
         *  **Note:** If [member detail_enabled] is `true`, the [member detail_albedo] texture is drawn  *below*  the [member normal_texture]. To display a normal map  *above*  the [member detail_albedo] texture, use [member detail_normal] instead.  
         */
        get normal_texture(): Texture2D
        set normal_texture(value: Texture2D)
        
        /** If `true`, rim effect is enabled. Rim lighting increases the brightness at glancing angles on an object.  
         *      
         *  **Note:** Rim lighting is not visible if the material's [member shading_mode] is [constant SHADING_MODE_UNSHADED].  
         */
        get rim_enabled(): boolean
        set rim_enabled(value: boolean)
        
        /** Sets the strength of the rim lighting effect. */
        get rim(): float64
        set rim(value: float64)
        
        /** The amount of to blend light and albedo color when rendering rim effect. If `0` the light color is used, while `1` means albedo color is used. An intermediate value generally works best. */
        get rim_tint(): float64
        set rim_tint(value: float64)
        
        /** Texture used to set the strength of the rim lighting effect per-pixel. Multiplied by [member rim]. */
        get rim_texture(): Texture2D
        set rim_texture(value: Texture2D)
        
        /** If `true`, clearcoat rendering is enabled. Adds a secondary transparent pass to the lighting calculation resulting in an added specular blob. This makes materials appear as if they have a clear layer on them that can be either glossy or rough.  
         *      
         *  **Note:** Clearcoat rendering is not visible if the material's [member shading_mode] is [constant SHADING_MODE_UNSHADED].  
         */
        get clearcoat_enabled(): boolean
        set clearcoat_enabled(value: boolean)
        
        /** Sets the strength of the clearcoat effect. Setting to `0` looks the same as disabling the clearcoat effect. */
        get clearcoat(): float64
        set clearcoat(value: float64)
        
        /** Sets the roughness of the clearcoat pass. A higher value results in a rougher clearcoat while a lower value results in a smoother clearcoat. */
        get clearcoat_roughness(): float64
        set clearcoat_roughness(value: float64)
        
        /** Texture that defines the strength of the clearcoat effect and the glossiness of the clearcoat. Strength is specified in the red channel while glossiness is specified in the green channel. */
        get clearcoat_texture(): Texture2D
        set clearcoat_texture(value: Texture2D)
        
        /** If `true`, anisotropy is enabled. Anisotropy changes the shape of the specular blob and aligns it to tangent space. This is useful for brushed aluminium and hair reflections.  
         *      
         *  **Note:** Mesh tangents are needed for anisotropy to work. If the mesh does not contain tangents, the anisotropy effect will appear broken.  
         *      
         *  **Note:** Material anisotropy should not to be confused with anisotropic texture filtering, which can be enabled by setting [member texture_filter] to [constant TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC].  
         */
        get anisotropy_enabled(): boolean
        set anisotropy_enabled(value: boolean)
        
        /** The strength of the anisotropy effect. This is multiplied by [member anisotropy_flowmap]'s alpha channel if a texture is defined there and the texture contains an alpha channel. */
        get anisotropy(): float64
        set anisotropy(value: float64)
        
        /** Texture that offsets the tangent map for anisotropy calculations and optionally controls the anisotropy effect (if an alpha channel is present). The flowmap texture is expected to be a derivative map, with the red channel representing distortion on the X axis and green channel representing distortion on the Y axis. Values below 0.5 will result in negative distortion, whereas values above 0.5 will result in positive distortion.  
         *  If present, the texture's alpha channel will be used to multiply the strength of the [member anisotropy] effect. Fully opaque pixels will keep the anisotropy effect's original strength while fully transparent pixels will disable the anisotropy effect entirely. The flowmap texture's blue channel is ignored.  
         */
        get anisotropy_flowmap(): Texture2D
        set anisotropy_flowmap(value: Texture2D)
        
        /** If `true`, ambient occlusion is enabled. Ambient occlusion darkens areas based on the [member ao_texture]. */
        get ao_enabled(): boolean
        set ao_enabled(value: boolean)
        
        /** Amount that ambient occlusion affects lighting from lights. If `0`, ambient occlusion only affects ambient light. If `1`, ambient occlusion affects lights just as much as it affects ambient light. This can be used to impact the strength of the ambient occlusion effect, but typically looks unrealistic. */
        get ao_light_affect(): float64
        set ao_light_affect(value: float64)
        
        /** Texture that defines the amount of ambient occlusion for a given point on the object. */
        get ao_texture(): Texture2D
        set ao_texture(value: Texture2D)
        
        /** If `true`, use `UV2` coordinates to look up from the [member ao_texture]. */
        get ao_on_uv2(): boolean
        set ao_on_uv2(value: boolean)
        
        /** Specifies the channel of the [member ao_texture] in which the ambient occlusion information is stored. This is useful when you store the information for multiple effects in a single texture. For example if you stored metallic in the red channel, roughness in the blue, and ambient occlusion in the green you could reduce the number of textures you use. */
        get ao_texture_channel(): int64
        set ao_texture_channel(value: int64)
        
        /** If `true`, height mapping is enabled (also called "parallax mapping" or "depth mapping"). See also [member normal_enabled]. Height mapping is a demanding feature on the GPU, so it should only be used on materials where it makes a significant visual difference.  
         *      
         *  **Note:** Height mapping is not supported if triplanar mapping is used on the same material. The value of [member heightmap_enabled] will be ignored if [member uv1_triplanar] is enabled.  
         */
        get heightmap_enabled(): boolean
        set heightmap_enabled(value: boolean)
        
        /** The heightmap scale to use for the parallax effect (see [member heightmap_enabled]). The default value is tuned so that the highest point (value = 255) appears to be 5 cm higher than the lowest point (value = 0). Higher values result in a deeper appearance, but may result in artifacts appearing when looking at the material from oblique angles, especially when the camera moves. Negative values can be used to invert the parallax effect, but this is different from inverting the texture using [member heightmap_flip_texture] as the material will also appear to be "closer" to the camera. In most cases, [member heightmap_scale] should be kept to a positive value.  
         *      
         *  **Note:** If the height map effect looks strange regardless of this value, try adjusting [member heightmap_flip_binormal] and [member heightmap_flip_tangent]. See also [member heightmap_texture] for recommendations on authoring heightmap textures, as the way the heightmap texture is authored affects how [member heightmap_scale] behaves.  
         */
        get heightmap_scale(): float64
        set heightmap_scale(value: float64)
        
        /** If `true`, uses parallax occlusion mapping to represent depth in the material instead of simple offset mapping (see [member heightmap_enabled]). This results in a more convincing depth effect, but is much more expensive on the GPU. Only enable this on materials where it makes a significant visual difference. */
        get heightmap_deep_parallax(): boolean
        set heightmap_deep_parallax(value: boolean)
        
        /** The number of layers to use for parallax occlusion mapping when the camera is far away from the material. Higher values result in a more convincing depth effect, especially in materials that have steep height changes. Higher values have a significant cost on the GPU, so it should only be increased on materials where it makes a significant visual difference.  
         *      
         *  **Note:** Only effective if [member heightmap_deep_parallax] is `true`.  
         */
        get heightmap_min_layers(): int64
        set heightmap_min_layers(value: int64)
        
        /** The number of layers to use for parallax occlusion mapping when the camera is up close to the material. Higher values result in a more convincing depth effect, especially in materials that have steep height changes. Higher values have a significant cost on the GPU, so it should only be increased on materials where it makes a significant visual difference.  
         *      
         *  **Note:** Only effective if [member heightmap_deep_parallax] is `true`.  
         */
        get heightmap_max_layers(): int64
        set heightmap_max_layers(value: int64)
        
        /** If `true`, flips the mesh's tangent vectors when interpreting the height map. If the heightmap effect looks strange when the camera moves (even with a reasonable [member heightmap_scale]), try setting this to `true`. */
        get heightmap_flip_tangent(): boolean
        set heightmap_flip_tangent(value: boolean)
        
        /** If `true`, flips the mesh's binormal vectors when interpreting the height map. If the heightmap effect looks strange when the camera moves (even with a reasonable [member heightmap_scale]), try setting this to `true`. */
        get heightmap_flip_binormal(): boolean
        set heightmap_flip_binormal(value: boolean)
        
        /** The texture to use as a height map. See also [member heightmap_enabled].  
         *  For best results, the texture should be normalized (with [member heightmap_scale] reduced to compensate). In [url=https://gimp.org]GIMP[/url], this can be done using **Colors > Auto > Equalize**. If the texture only uses a small part of its available range, the parallax effect may look strange, especially when the camera moves.  
         *      
         *  **Note:** To reduce memory usage and improve loading times, you may be able to use a lower-resolution heightmap texture as most heightmaps are only comprised of low-frequency data.  
         */
        get heightmap_texture(): Texture2D
        set heightmap_texture(value: Texture2D)
        
        /** If `true`, interprets the height map texture as a depth map, with brighter values appearing to be "lower" in altitude compared to darker values.  
         *  This can be enabled for compatibility with some materials authored for Godot 3.x. This is not necessary if the Invert import option was used to invert the depth map in Godot 3.x, in which case [member heightmap_flip_texture] should remain `false`.  
         */
        get heightmap_flip_texture(): boolean
        set heightmap_flip_texture(value: boolean)
        
        /** If `true`, subsurface scattering is enabled. Emulates light that penetrates an object's surface, is scattered, and then emerges. Subsurface scattering quality is controlled by [member ProjectSettings.rendering/environment/subsurface_scattering/subsurface_scattering_quality]. */
        get subsurf_scatter_enabled(): boolean
        set subsurf_scatter_enabled(value: boolean)
        
        /** The strength of the subsurface scattering effect. The depth of the effect is also controlled by [member ProjectSettings.rendering/environment/subsurface_scattering/subsurface_scattering_scale], which is set globally. */
        get subsurf_scatter_strength(): float64
        set subsurf_scatter_strength(value: float64)
        
        /** If `true`, subsurface scattering will use a special mode optimized for the color and density of human skin, such as boosting the intensity of the red channel in subsurface scattering. */
        get subsurf_scatter_skin_mode(): boolean
        set subsurf_scatter_skin_mode(value: boolean)
        
        /** Texture used to control the subsurface scattering strength. Stored in the red texture channel. Multiplied by [member subsurf_scatter_strength]. */
        get subsurf_scatter_texture(): Texture2D
        set subsurf_scatter_texture(value: Texture2D)
        
        /** If `true`, enables subsurface scattering transmittance. Only effective if [member subsurf_scatter_enabled] is `true`. See also [member backlight_enabled]. */
        get subsurf_scatter_transmittance_enabled(): boolean
        set subsurf_scatter_transmittance_enabled(value: boolean)
        
        /** The color to multiply the subsurface scattering transmittance effect with. Ignored if [member subsurf_scatter_skin_mode] is `true`. */
        get subsurf_scatter_transmittance_color(): Color
        set subsurf_scatter_transmittance_color(value: Color)
        
        /** The texture to use for multiplying the intensity of the subsurface scattering transmittance intensity. See also [member subsurf_scatter_texture]. Ignored if [member subsurf_scatter_skin_mode] is `true`. */
        get subsurf_scatter_transmittance_texture(): Texture2D
        set subsurf_scatter_transmittance_texture(value: Texture2D)
        
        /** The depth of the subsurface scattering transmittance effect. */
        get subsurf_scatter_transmittance_depth(): float64
        set subsurf_scatter_transmittance_depth(value: float64)
        
        /** The intensity of the subsurface scattering transmittance effect. */
        get subsurf_scatter_transmittance_boost(): float64
        set subsurf_scatter_transmittance_boost(value: float64)
        
        /** If `true`, the backlight effect is enabled. See also [member subsurf_scatter_transmittance_enabled]. */
        get backlight_enabled(): boolean
        set backlight_enabled(value: boolean)
        
        /** The color used by the backlight effect. Represents the light passing through an object. */
        get backlight(): Color
        set backlight(value: Color)
        
        /** Texture used to control the backlight effect per-pixel. Added to [member backlight]. */
        get backlight_texture(): Texture2D
        set backlight_texture(value: Texture2D)
        
        /** If `true`, the refraction effect is enabled. Distorts transparency based on light from behind the object. */
        get refraction_enabled(): boolean
        set refraction_enabled(value: boolean)
        
        /** The strength of the refraction effect. */
        get refraction_scale(): float64
        set refraction_scale(value: float64)
        
        /** Texture that controls the strength of the refraction per-pixel. Multiplied by [member refraction_scale]. */
        get refraction_texture(): Texture2D
        set refraction_texture(value: Texture2D)
        
        /** Specifies the channel of the [member refraction_texture] in which the refraction information is stored. This is useful when you store the information for multiple effects in a single texture. For example if you stored refraction in the red channel, roughness in the blue, and ambient occlusion in the green you could reduce the number of textures you use. */
        get refraction_texture_channel(): int64
        set refraction_texture_channel(value: int64)
        
        /** If `true`, enables the detail overlay. Detail is a second texture that gets mixed over the surface of the object based on [member detail_mask] and [member detail_albedo]'s alpha channel. This can be used to add variation to objects, or to blend between two different albedo/normal textures. */
        get detail_enabled(): boolean
        set detail_enabled(value: boolean)
        
        /** Texture used to specify how the detail textures get blended with the base textures. [member detail_mask] can be used together with [member detail_albedo]'s alpha channel (if any). */
        get detail_mask(): Texture2D
        set detail_mask(value: Texture2D)
        
        /** Specifies how the [member detail_albedo] should blend with the current `ALBEDO`. See [enum BlendMode] for options. */
        get detail_blend_mode(): int64
        set detail_blend_mode(value: int64)
        
        /** Specifies whether to use `UV` or `UV2` for the detail layer. See [enum DetailUV] for options. */
        get detail_uv_layer(): int64
        set detail_uv_layer(value: int64)
        
        /** Texture that specifies the color of the detail overlay. [member detail_albedo]'s alpha channel is used as a mask, even when the material is opaque. To use a dedicated texture as a mask, see [member detail_mask].  
         *      
         *  **Note:** [member detail_albedo] is  *not*  modulated by [member albedo_color].  
         */
        get detail_albedo(): Texture2D
        set detail_albedo(value: Texture2D)
        
        /** Texture that specifies the per-pixel normal of the detail overlay. The [member detail_normal] texture only uses the red and green channels; the blue and alpha channels are ignored. The normal read from [member detail_normal] is oriented around the surface normal provided by the [Mesh].  
         *      
         *  **Note:** Godot expects the normal map to use X+, Y+, and Z+ coordinates. See [url=http://wiki.polycount.com/wiki/Normal_Map_Technical_Details#Common_Swizzle_Coordinates]this page[/url] for a comparison of normal map coordinates expected by popular engines.  
         */
        get detail_normal(): Texture2D
        set detail_normal(value: Texture2D)
        
        /** How much to scale the `UV` coordinates. This is multiplied by `UV` in the vertex function. The Z component is used when [member uv1_triplanar] is enabled, but it is not used anywhere else. */
        get uv1_scale(): Vector3
        set uv1_scale(value: Vector3)
        
        /** How much to offset the `UV` coordinates. This amount will be added to `UV` in the vertex function. This can be used to offset a texture. The Z component is used when [member uv1_triplanar] is enabled, but it is not used anywhere else. */
        get uv1_offset(): Vector3
        set uv1_offset(value: Vector3)
        
        /** If `true`, instead of using `UV` textures will use a triplanar texture lookup to determine how to apply textures. Triplanar uses the orientation of the object's surface to blend between texture coordinates. It reads from the source texture 3 times, once for each axis and then blends between the results based on how closely the pixel aligns with each axis. This is often used for natural features to get a realistic blend of materials. Because triplanar texturing requires many more texture reads per-pixel it is much slower than normal UV texturing. Additionally, because it is blending the texture between the three axes, it is unsuitable when you are trying to achieve crisp texturing. */
        get uv1_triplanar(): boolean
        set uv1_triplanar(value: boolean)
        
        /** A lower number blends the texture more softly while a higher number blends the texture more sharply.  
         *      
         *  **Note:** [member uv1_triplanar_sharpness] is clamped between `0.0` and `150.0` (inclusive) as values outside that range can look broken depending on the mesh.  
         */
        get uv1_triplanar_sharpness(): float64
        set uv1_triplanar_sharpness(value: float64)
        
        /** If `true`, triplanar mapping for `UV` is calculated in world space rather than object local space. See also [member uv1_triplanar]. */
        get uv1_world_triplanar(): boolean
        set uv1_world_triplanar(value: boolean)
        
        /** How much to scale the `UV2` coordinates. This is multiplied by `UV2` in the vertex function. The Z component is used when [member uv2_triplanar] is enabled, but it is not used anywhere else. */
        get uv2_scale(): Vector3
        set uv2_scale(value: Vector3)
        
        /** How much to offset the `UV2` coordinates. This amount will be added to `UV2` in the vertex function. This can be used to offset a texture. The Z component is used when [member uv2_triplanar] is enabled, but it is not used anywhere else. */
        get uv2_offset(): Vector3
        set uv2_offset(value: Vector3)
        
        /** If `true`, instead of using `UV2` textures will use a triplanar texture lookup to determine how to apply textures. Triplanar uses the orientation of the object's surface to blend between texture coordinates. It reads from the source texture 3 times, once for each axis and then blends between the results based on how closely the pixel aligns with each axis. This is often used for natural features to get a realistic blend of materials. Because triplanar texturing requires many more texture reads per-pixel it is much slower than normal UV texturing. Additionally, because it is blending the texture between the three axes, it is unsuitable when you are trying to achieve crisp texturing. */
        get uv2_triplanar(): boolean
        set uv2_triplanar(value: boolean)
        
        /** A lower number blends the texture more softly while a higher number blends the texture more sharply.  
         *      
         *  **Note:** [member uv2_triplanar_sharpness] is clamped between `0.0` and `150.0` (inclusive) as values outside that range can look broken depending on the mesh.  
         */
        get uv2_triplanar_sharpness(): float64
        set uv2_triplanar_sharpness(value: float64)
        
        /** If `true`, triplanar mapping for `UV2` is calculated in world space rather than object local space. See also [member uv2_triplanar]. */
        get uv2_world_triplanar(): boolean
        set uv2_world_triplanar(value: boolean)
        
        /** Filter flags for the texture. See [enum TextureFilter] for options.  
         *      
         *  **Note:** [member heightmap_texture] is always sampled with linear filtering, even if nearest-neighbor filtering is selected here. This is to ensure the heightmap effect looks as intended. If you need sharper height transitions between pixels, resize the heightmap texture in an image editor with nearest-neighbor filtering.  
         */
        get texture_filter(): int64
        set texture_filter(value: int64)
        
        /** Repeat flags for the texture. See [enum TextureFilter] for options. */
        get texture_repeat(): boolean
        set texture_repeat(value: boolean)
        
        /** If `true`, the object receives no shadow that would otherwise be cast onto it. */
        get disable_receive_shadows(): boolean
        set disable_receive_shadows(value: boolean)
        
        /** If `true`, enables the "shadow to opacity" render mode where lighting modifies the alpha so shadowed areas are opaque and non-shadowed areas are transparent. Useful for overlaying shadows onto a camera feed in AR. */
        get shadow_to_opacity(): boolean
        set shadow_to_opacity(value: boolean)
        
        /** Controls how the object faces the camera. See [enum BillboardMode].  
         *      
         *  **Note:** When billboarding is enabled and the material also casts shadows, billboards will face **the** camera in the scene when rendering shadows. In scenes with multiple cameras, the intended shadow cannot be determined and this will result in undefined behavior. See [url=https://github.com/godotengine/godot/pull/72638]GitHub Pull Request #72638[/url] for details.  
         *      
         *  **Note:** Billboard mode is not suitable for VR because the left-right vector of the camera is not horizontal when the screen is attached to your head instead of on the table. See [url=https://github.com/godotengine/godot/issues/41567]GitHub issue #41567[/url] for details.  
         */
        get billboard_mode(): int64
        set billboard_mode(value: int64)
        
        /** If `true`, the shader will keep the scale set for the mesh. Otherwise, the scale is lost when billboarding. Only applies when [member billboard_mode] is not [constant BILLBOARD_DISABLED]. */
        get billboard_keep_scale(): boolean
        set billboard_keep_scale(value: boolean)
        
        /** The number of horizontal frames in the particle sprite sheet. Only enabled when using [constant BILLBOARD_PARTICLES]. See [member billboard_mode]. */
        get particles_anim_h_frames(): int64
        set particles_anim_h_frames(value: int64)
        
        /** The number of vertical frames in the particle sprite sheet. Only enabled when using [constant BILLBOARD_PARTICLES]. See [member billboard_mode]. */
        get particles_anim_v_frames(): int64
        set particles_anim_v_frames(value: int64)
        
        /** If `true`, particle animations are looped. Only enabled when using [constant BILLBOARD_PARTICLES]. See [member billboard_mode]. */
        get particles_anim_loop(): boolean
        set particles_anim_loop(value: boolean)
        
        /** If `true`, enables the vertex grow setting. This can be used to create mesh-based outlines using a second material pass and its [member cull_mode] set to [constant CULL_FRONT]. See also [member grow_amount].  
         *      
         *  **Note:** Vertex growth cannot create new vertices, which means that visible gaps may occur in sharp corners. This can be alleviated by designing the mesh to use smooth normals exclusively using [url=https://wiki.polycount.com/wiki/Face_weighted_normals]face weighted normals[/url] in the 3D authoring software. In this case, grow will be able to join every outline together, just like in the original mesh.  
         */
        get grow(): boolean
        set grow(value: boolean)
        
        /** Grows object vertices in the direction of their normals. Only effective if [member grow] is `true`. */
        get grow_amount(): float64
        set grow_amount(value: float64)
        
        /** If `true`, the object is rendered at the same size regardless of distance. */
        get fixed_size(): boolean
        set fixed_size(value: boolean)
        
        /** If `true`, render point size can be changed.  
         *      
         *  **Note:** This is only effective for objects whose geometry is point-based rather than triangle-based. See also [member point_size].  
         */
        get use_point_size(): boolean
        set use_point_size(value: boolean)
        
        /** The point size in pixels. See [member use_point_size]. */
        get point_size(): float64
        set point_size(value: float64)
        
        /** If `true`, enables parts of the shader required for [GPUParticles3D] trails to function. This also requires using a mesh with appropriate skinning, such as [RibbonTrailMesh] or [TubeTrailMesh]. Enabling this feature outside of materials used in [GPUParticles3D] meshes will break material rendering. */
        get use_particle_trails(): boolean
        set use_particle_trails(value: boolean)
        
        /** If `true`, the proximity fade effect is enabled. The proximity fade effect fades out each pixel based on its distance to another object. */
        get proximity_fade_enabled(): boolean
        set proximity_fade_enabled(value: boolean)
        
        /** Distance over which the fade effect takes place. The larger the distance the longer it takes for an object to fade. */
        get proximity_fade_distance(): float64
        set proximity_fade_distance(value: float64)
        
        /** The width of the range around the shape between the minimum and maximum representable signed distance. */
        get msdf_pixel_range(): float64
        set msdf_pixel_range(value: float64)
        
        /** The width of the shape outline. */
        get msdf_outline_size(): float64
        set msdf_outline_size(value: float64)
        
        /** Specifies which type of fade to use. Can be any of the [enum DistanceFadeMode]s. */
        get distance_fade_mode(): int64
        set distance_fade_mode(value: int64)
        
        /** Distance at which the object starts to become visible. If the object is less than this distance away, it will be invisible.  
         *      
         *  **Note:** If [member distance_fade_min_distance] is greater than [member distance_fade_max_distance], the behavior will be reversed. The object will start to fade away at [member distance_fade_max_distance] and will fully disappear once it reaches [member distance_fade_min_distance].  
         */
        get distance_fade_min_distance(): float64
        set distance_fade_min_distance(value: float64)
        
        /** Distance at which the object appears fully opaque.  
         *      
         *  **Note:** If [member distance_fade_max_distance] is less than [member distance_fade_min_distance], the behavior will be reversed. The object will start to fade away at [member distance_fade_max_distance] and will fully disappear once it reaches [member distance_fade_min_distance].  
         */
        get distance_fade_max_distance(): float64
        set distance_fade_max_distance(value: float64)
    }
    /** Boolean matrix.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_bitmap.html  
     */
    class BitMap extends Resource {
        constructor(identifier?: any)
        /** Creates a bitmap with the specified size, filled with `false`. */
        create(size: Vector2i): void
        
        /** Creates a bitmap that matches the given image dimensions, every element of the bitmap is set to `false` if the alpha value of the image at that position is equal to [param threshold] or less, and `true` in other case. */
        create_from_image_alpha(image: Image, threshold: float64 = 0.1): void
        
        /** Sets the bitmap's element at the specified position, to the specified value. */
        set_bitv(position: Vector2i, bit: boolean): void
        
        /** Sets the bitmap's element at the specified position, to the specified value. */
        set_bit(x: int64, y: int64, bit: boolean): void
        
        /** Returns bitmap's value at the specified position. */
        get_bitv(position: Vector2i): boolean
        
        /** Returns bitmap's value at the specified position. */
        get_bit(x: int64, y: int64): boolean
        
        /** Sets a rectangular portion of the bitmap to the specified value. */
        set_bit_rect(rect: Rect2i, bit: boolean): void
        
        /** Returns the number of bitmap elements that are set to `true`. */
        get_true_bit_count(): int64
        
        /** Returns bitmap's dimensions. */
        get_size(): Vector2i
        
        /** Resizes the image to [param new_size]. */
        resize(new_size: Vector2i): void
        
        /** Applies morphological dilation or erosion to the bitmap. If [param pixels] is positive, dilation is applied to the bitmap. If [param pixels] is negative, erosion is applied to the bitmap. [param rect] defines the area where the morphological operation is applied. Pixels located outside the [param rect] are unaffected by [method grow_mask]. */
        grow_mask(pixels: int64, rect: Rect2i): void
        
        /** Returns an image of the same size as the bitmap and with a [enum Image.Format] of type [constant Image.FORMAT_L8]. `true` bits of the bitmap are being converted into white pixels, and `false` bits into black. */
        convert_to_image(): Image
        
        /** Creates an [Array] of polygons covering a rectangular portion of the bitmap. It uses a marching squares algorithm, followed by Ramer-Douglas-Peucker (RDP) reduction of the number of vertices. Each polygon is described as a [PackedVector2Array] of its vertices.  
         *  To get polygons covering the whole bitmap, pass:  
         *    
         *  [param epsilon] is passed to RDP to control how accurately the polygons cover the bitmap: a lower [param epsilon] corresponds to more points in the polygons.  
         */
        opaque_to_polygons(rect: Rect2i, epsilon: float64 = 2): GArray
        get data(): GDictionary
        set data(value: GDictionary)
    }
    class BitMapEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** A joint used with [Skeleton2D] to control and animate other nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_bone2d.html  
     */
    class Bone2D extends Node2D {
        constructor(identifier?: any)
        /** Resets the bone to the rest pose. This is equivalent to setting [member Node2D.transform] to [member rest]. */
        apply_rest(): void
        
        /** Returns the node's [member rest] [Transform2D] if it doesn't have a parent, or its rest pose relative to its parent. */
        get_skeleton_rest(): Transform2D
        
        /** Returns the node's index as part of the entire skeleton. See [Skeleton2D]. */
        get_index_in_skeleton(): int64
        
        /** When set to `true`, the [Bone2D] node will attempt to automatically calculate the bone angle and length using the first child [Bone2D] node, if one exists. If none exist, the [Bone2D] cannot automatically calculate these values and will print a warning. */
        set_autocalculate_length_and_angle(auto_calculate: boolean): void
        
        /** Returns whether this [Bone2D] is going to autocalculate its length and bone angle using its first [Bone2D] child node, if one exists. If there are no [Bone2D] children, then it cannot autocalculate these values and will print a warning. */
        get_autocalculate_length_and_angle(): boolean
        
        /** Sets the length of the bone in the [Bone2D]. */
        set_length(length: float64): void
        
        /** Returns the length of the bone in the [Bone2D] node. */
        get_length(): float64
        
        /** Sets the bone angle for the [Bone2D]. This is typically set to the rotation from the [Bone2D] to a child [Bone2D] node.  
         *      
         *  **Note:** This is different from the [Bone2D]'s rotation. The bone's angle is the rotation of the bone shown by the gizmo, which is unaffected by the [Bone2D]'s [member Node2D.transform].  
         */
        set_bone_angle(angle: float64): void
        
        /** Returns the angle of the bone in the [Bone2D].  
         *      
         *  **Note:** This is different from the [Bone2D]'s rotation. The bone's angle is the rotation of the bone shown by the gizmo, which is unaffected by the [Bone2D]'s [member Node2D.transform].  
         */
        get_bone_angle(): float64
        
        /** Rest transform of the bone. You can reset the node's transforms to this value using [method apply_rest]. */
        get rest(): Transform2D
        set rest(value: Transform2D)
    }
    /** А node that dynamically copies or overrides the 3D transform of a bone in its parent [Skeleton3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_boneattachment3d.html  
     */
    class BoneAttachment3D extends Node3D {
        constructor(identifier?: any)
        /** A function that is called automatically when the [Skeleton3D] is updated. This function is where the [BoneAttachment3D] node updates its position so it is correctly bound when it is  *not*  set to override the bone pose. */
        on_skeleton_update(): void
        
        /** Sets whether the BoneAttachment3D node will use an external [Skeleton3D] node rather than attempting to use its parent node as the [Skeleton3D]. When set to `true`, the BoneAttachment3D node will use the external [Skeleton3D] node set in [method set_external_skeleton]. */
        set_use_external_skeleton(use_external_skeleton: boolean): void
        
        /** Returns whether the BoneAttachment3D node is using an external [Skeleton3D] rather than attempting to use its parent node as the [Skeleton3D]. */
        get_use_external_skeleton(): boolean
        
        /** Sets the [NodePath] to the external skeleton that the BoneAttachment3D node should use. See [method set_use_external_skeleton] to enable the external [Skeleton3D] node. */
        set_external_skeleton(external_skeleton: NodePath | string): void
        
        /** Returns the [NodePath] to the external [Skeleton3D] node, if one has been set. */
        get_external_skeleton(): NodePath
        
        /** The name of the attached bone. */
        get bone_name(): StringName
        set bone_name(value: StringName)
        
        /** The index of the attached bone. */
        get bone_idx(): int64
        set bone_idx(value: int64)
        
        /** Whether the BoneAttachment3D node will override the bone pose of the bone it is attached to. When set to `true`, the BoneAttachment3D node can change the pose of the bone. When set to `false`, the BoneAttachment3D will always be set to the bone's transform.  
         *      
         *  **Note:** This override performs interruptively in the skeleton update process using signals due to the old design. It may cause unintended behavior when used at the same time with [SkeletonModifier3D].  
         */
        get override_pose(): boolean
        set override_pose(value: boolean)
    }
    /** Describes a mapping of bone names for retargeting [Skeleton3D] into common names defined by a [SkeletonProfile].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_bonemap.html  
     */
    class BoneMap extends Resource {
        constructor(identifier?: any)
        /** Returns a skeleton bone name is mapped to [param profile_bone_name].  
         *  In the retargeting process, the returned bone name is the bone name of the source skeleton.  
         */
        get_skeleton_bone_name(profile_bone_name: StringName): StringName
        
        /** Maps a skeleton bone name to [param profile_bone_name].  
         *  In the retargeting process, the setting bone name is the bone name of the source skeleton.  
         */
        set_skeleton_bone_name(profile_bone_name: StringName, skeleton_bone_name: StringName): void
        
        /** Returns a profile bone name having [param skeleton_bone_name]. If not found, an empty [StringName] will be returned.  
         *  In the retargeting process, the returned bone name is the bone name of the target skeleton.  
         */
        find_profile_bone_name(skeleton_bone_name: StringName): StringName
        
        /** A [SkeletonProfile] of the mapping target. Key names in the [BoneMap] are synchronized with it. */
        get profile(): SkeletonProfile
        set profile(value: SkeletonProfile)
        
        /** This signal is emitted when change the key value in the [BoneMap]. This is used to validate mapping and to update [BoneMap] editor. */
        readonly bone_map_updated: Signal0
        
        /** This signal is emitted when change the value in profile or change the reference of profile. This is used to update key names in the [BoneMap] and to redraw the [BoneMap] editor. */
        readonly profile_updated: Signal0
    }
    class BoneMapEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    namespace BoxContainer {
        enum AlignmentMode {
            /** The child controls will be arranged at the beginning of the container, i.e. top if orientation is vertical, left if orientation is horizontal (right for RTL layout). */
            ALIGNMENT_BEGIN = 0,
            
            /** The child controls will be centered in the container. */
            ALIGNMENT_CENTER = 1,
            
            /** The child controls will be arranged at the end of the container, i.e. bottom if orientation is vertical, right if orientation is horizontal (left for RTL layout). */
            ALIGNMENT_END = 2,
        }
    }
    /** A container that arranges its child controls horizontally or vertically.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_boxcontainer.html  
     */
    class BoxContainer extends Container {
        constructor(identifier?: any)
        /** Adds a [Control] node to the box as a spacer. If [param begin] is `true`, it will insert the [Control] node in front of all other children. */
        add_spacer(begin: boolean): Control
        
        /** The alignment of the container's children (must be one of [constant ALIGNMENT_BEGIN], [constant ALIGNMENT_CENTER], or [constant ALIGNMENT_END]). */
        get alignment(): int64
        set alignment(value: int64)
        
        /** If `true`, the [BoxContainer] will arrange its children vertically, rather than horizontally.  
         *  Can't be changed when using [HBoxContainer] and [VBoxContainer].  
         */
        get vertical(): boolean
        set vertical(value: boolean)
    }
    /** Generate an axis-aligned box [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_boxmesh.html  
     */
    class BoxMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** The box's width, height and depth. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** Number of extra edge loops inserted along the X axis. */
        get subdivide_width(): int64
        set subdivide_width(value: int64)
        
        /** Number of extra edge loops inserted along the Y axis. */
        get subdivide_height(): int64
        set subdivide_height(value: int64)
        
        /** Number of extra edge loops inserted along the Z axis. */
        get subdivide_depth(): int64
        set subdivide_depth(value: int64)
    }
    /** Cuboid shape for use with occlusion culling in [OccluderInstance3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_boxoccluder3d.html  
     */
    class BoxOccluder3D extends Occluder3D {
        constructor(identifier?: any)
        /** The box's size in 3D units. */
        get size(): Vector3
        set size(value: Vector3)
    }
    /** A 3D box shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_boxshape3d.html  
     */
    class BoxShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The box's width, height and depth. */
        get size(): Vector3
        set size(value: Vector3)
    }
    /** A themed button that can contain text and an icon.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_button.html  
     */
    class Button extends BaseButton {
        constructor(identifier?: any)
        /** The button's text that will be displayed inside the button's area. */
        get text(): string
        set text(value: string)
        
        /** Button's icon, if text is present the icon will be placed before the text.  
         *  To edit margin and spacing of the icon, use [theme_item h_separation] theme property and `content_margin_*` properties of the used [StyleBox]es.  
         */
        get icon(): Texture2D
        set icon(value: Texture2D)
        
        /** Flat buttons don't display decoration. */
        get flat(): boolean
        set flat(value: boolean)
        
        /** Text alignment policy for the button's text, use one of the [enum HorizontalAlignment] constants. */
        get alignment(): int64
        set alignment(value: int64)
        
        /** Sets the clipping behavior when the text exceeds the node's bounding rectangle. See [enum TextServer.OverrunBehavior] for a description of all modes. */
        get text_overrun_behavior(): int64
        set text_overrun_behavior(value: int64)
        
        /** If set to something other than [constant TextServer.AUTOWRAP_OFF], the text gets wrapped inside the node's bounding rectangle. */
        get autowrap_mode(): int64
        set autowrap_mode(value: int64)
        
        /** When this property is enabled, text that is too large to fit the button is clipped, when disabled the Button will always be wide enough to hold the text. */
        get clip_text(): boolean
        set clip_text(value: boolean)
        
        /** Specifies if the icon should be aligned horizontally to the left, right, or center of a button. Uses the same [enum HorizontalAlignment] constants as the text alignment. If centered horizontally and vertically, text will draw on top of the icon. */
        get icon_alignment(): int64
        set icon_alignment(value: int64)
        
        /** Specifies if the icon should be aligned vertically to the top, bottom, or center of a button. Uses the same [enum VerticalAlignment] constants as the text alignment. If centered horizontally and vertically, text will draw on top of the icon. */
        get vertical_icon_alignment(): int64
        set vertical_icon_alignment(value: int64)
        
        /** When enabled, the button's icon will expand/shrink to fit the button's size while keeping its aspect. See also [theme_item icon_max_width]. */
        get expand_icon(): boolean
        set expand_icon(value: boolean)
        
        /** Base text writing direction. */
        get text_direction(): int64
        set text_direction(value: int64)
        
        /** Language code used for line-breaking and text shaping algorithms, if left empty current locale is used instead. */
        get language(): string
        set language(value: string)
    }
    /** A group of buttons that doesn't allow more than one button to be pressed at a time.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_buttongroup.html  
     */
    class ButtonGroup extends Resource {
        constructor(identifier?: any)
        /** Returns the current pressed button. */
        get_pressed_button(): BaseButton
        
        /** Returns an [Array] of [Button]s who have this as their [ButtonGroup] (see [member BaseButton.button_group]). */
        get_buttons(): GArray
        
        /** If `true`, it is possible to unpress all buttons in this [ButtonGroup]. */
        get allow_unpress(): boolean
        set allow_unpress(value: boolean)
        
        /** Emitted when one of the buttons of the group is pressed. */
        readonly pressed: Signal1<BaseButton>
    }
    namespace CPUParticles2D {
        enum DrawOrder {
            /** Particles are drawn in the order emitted. */
            DRAW_ORDER_INDEX = 0,
            
            /** Particles are drawn in order of remaining lifetime. In other words, the particle with the highest lifetime is drawn at the front. */
            DRAW_ORDER_LIFETIME = 1,
        }
        enum Parameter {
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set initial velocity properties. */
            PARAM_INITIAL_LINEAR_VELOCITY = 0,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set angular velocity properties. */
            PARAM_ANGULAR_VELOCITY = 1,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set orbital velocity properties. */
            PARAM_ORBIT_VELOCITY = 2,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set linear acceleration properties. */
            PARAM_LINEAR_ACCEL = 3,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set radial acceleration properties. */
            PARAM_RADIAL_ACCEL = 4,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set tangential acceleration properties. */
            PARAM_TANGENTIAL_ACCEL = 5,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set damping properties. */
            PARAM_DAMPING = 6,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set angle properties. */
            PARAM_ANGLE = 7,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set scale properties. */
            PARAM_SCALE = 8,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set hue variation properties. */
            PARAM_HUE_VARIATION = 9,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set animation speed properties. */
            PARAM_ANIM_SPEED = 10,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set animation offset properties. */
            PARAM_ANIM_OFFSET = 11,
            
            /** Represents the size of the [enum Parameter] enum. */
            PARAM_MAX = 12,
        }
        enum ParticleFlags {
            /** Use with [method set_particle_flag] to set [member particle_flag_align_y]. */
            PARTICLE_FLAG_ALIGN_Y_TO_VELOCITY = 0,
            
            /** Present for consistency with 3D particle nodes, not used in 2D. */
            PARTICLE_FLAG_ROTATE_Y = 1,
            
            /** Present for consistency with 3D particle nodes, not used in 2D. */
            PARTICLE_FLAG_DISABLE_Z = 2,
            
            /** Represents the size of the [enum ParticleFlags] enum. */
            PARTICLE_FLAG_MAX = 3,
        }
        enum EmissionShape {
            /** All particles will be emitted from a single point. */
            EMISSION_SHAPE_POINT = 0,
            
            /** Particles will be emitted in the volume of a sphere flattened to two dimensions. */
            EMISSION_SHAPE_SPHERE = 1,
            
            /** Particles will be emitted on the surface of a sphere flattened to two dimensions. */
            EMISSION_SHAPE_SPHERE_SURFACE = 2,
            
            /** Particles will be emitted in the area of a rectangle. */
            EMISSION_SHAPE_RECTANGLE = 3,
            
            /** Particles will be emitted at a position chosen randomly among [member emission_points]. Particle color will be modulated by [member emission_colors]. */
            EMISSION_SHAPE_POINTS = 4,
            
            /** Particles will be emitted at a position chosen randomly among [member emission_points]. Particle velocity and rotation will be set based on [member emission_normals]. Particle color will be modulated by [member emission_colors]. */
            EMISSION_SHAPE_DIRECTED_POINTS = 5,
            
            /** Represents the size of the [enum EmissionShape] enum. */
            EMISSION_SHAPE_MAX = 6,
        }
    }
    /** A CPU-based 2D particle emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cpuparticles2d.html  
     */
    class CPUParticles2D extends Node2D {
        constructor(identifier?: any)
        /** Restarts the particle emitter. */
        restart(): void
        
        /** Sets the minimum value for the given parameter. */
        set_param_min(param: CPUParticles2D.Parameter, value: float64): void
        
        /** Returns the minimum value range for the given parameter. */
        get_param_min(param: CPUParticles2D.Parameter): float64
        
        /** Sets the maximum value for the given parameter. */
        set_param_max(param: CPUParticles2D.Parameter, value: float64): void
        
        /** Returns the maximum value range for the given parameter. */
        get_param_max(param: CPUParticles2D.Parameter): float64
        
        /** Sets the [Curve] of the parameter specified by [enum Parameter]. */
        set_param_curve(param: CPUParticles2D.Parameter, curve: Curve): void
        
        /** Returns the [Curve] of the parameter specified by [enum Parameter]. */
        get_param_curve(param: CPUParticles2D.Parameter): Curve
        
        /** Enables or disables the given flag (see [enum ParticleFlags] for options). */
        set_particle_flag(particle_flag: CPUParticles2D.ParticleFlags, enable: boolean): void
        
        /** Returns the enabled state of the given flag (see [enum ParticleFlags] for options). */
        get_particle_flag(particle_flag: CPUParticles2D.ParticleFlags): boolean
        
        /** Sets this node's properties to match a given [GPUParticles2D] node with an assigned [ParticleProcessMaterial]. */
        convert_from_particles(particles: Node): void
        
        /** If `true`, particles are being emitted. [member emitting] can be used to start and stop particles from emitting. However, if [member one_shot] is `true` setting [member emitting] to `true` will not restart the emission cycle until after all active particles finish processing. You can use the [signal finished] signal to be notified once all active particles finish processing. */
        get emitting(): boolean
        set emitting(value: boolean)
        
        /** Number of particles emitted in one emission cycle. */
        get amount(): int64
        set amount(value: int64)
        
        /** Amount of time each particle will exist. */
        get lifetime(): float64
        set lifetime(value: float64)
        
        /** If `true`, only one emission cycle occurs. If set `true` during a cycle, emission will stop at the cycle's end. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** Particle system starts as if it had already run for this many seconds. */
        get preprocess(): float64
        set preprocess(value: float64)
        
        /** Particle system's running speed scaling ratio. A value of `0` can be used to pause the particles. */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** How rapidly particles in an emission cycle are emitted. If greater than `0`, there will be a gap in emissions before the next cycle begins. */
        get explosiveness(): float64
        set explosiveness(value: float64)
        
        /** Emission lifetime randomness ratio. */
        get randomness(): float64
        set randomness(value: float64)
        
        /** Particle lifetime randomness ratio. */
        get lifetime_randomness(): float64
        set lifetime_randomness(value: float64)
        
        /** The particle system's frame rate is fixed to a value. For example, changing the value to 2 will make the particles render at 2 frames per second. Note this does not slow down the simulation of the particle system itself. */
        get fixed_fps(): int64
        set fixed_fps(value: int64)
        
        /** If `true`, results in fractional delta calculation which has a smoother particles display effect. */
        get fract_delta(): boolean
        set fract_delta(value: boolean)
        
        /** If `true`, particles use the parent node's coordinate space (known as local coordinates). This will cause particles to move and rotate along the [CPUParticles2D] node (and its parents) when it is moved or rotated. If `false`, particles use global coordinates; they will not move or rotate along the [CPUParticles2D] node (and its parents) when it is moved or rotated. */
        get local_coords(): boolean
        set local_coords(value: boolean)
        
        /** Particle draw order. Uses [enum DrawOrder] values. */
        get draw_order(): int64
        set draw_order(value: int64)
        
        /** Particle texture. If `null`, particles will be squares. */
        get texture(): Texture2D
        set texture(value: Texture2D)
        
        /** Particles will be emitted inside this region. See [enum EmissionShape] for possible values. */
        get emission_shape(): int64
        set emission_shape(value: int64)
        
        /** The sphere's radius if [member emission_shape] is set to [constant EMISSION_SHAPE_SPHERE]. */
        get emission_sphere_radius(): float64
        set emission_sphere_radius(value: float64)
        
        /** The rectangle's extents if [member emission_shape] is set to [constant EMISSION_SHAPE_RECTANGLE]. */
        get emission_rect_extents(): Vector2
        set emission_rect_extents(value: Vector2)
        
        /** Sets the initial positions to spawn particles when using [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_points(): PackedVector2Array
        set emission_points(value: PackedVector2Array | Vector2[])
        
        /** Sets the direction the particles will be emitted in when using [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_normals(): PackedVector2Array
        set emission_normals(value: PackedVector2Array | Vector2[])
        
        /** Sets the [Color]s to modulate particles by when using [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_colors(): PackedColorArray
        set emission_colors(value: PackedColorArray | Color[])
        
        /** Align Y axis of particle with the direction of its velocity. */
        get particle_flag_align_y(): boolean
        set particle_flag_align_y(value: boolean)
        
        /** Unit vector specifying the particles' emission direction. */
        get direction(): Vector2
        set direction(value: Vector2)
        
        /** Each particle's initial direction range from `+spread` to `-spread` degrees. */
        get spread(): float64
        set spread(value: float64)
        
        /** Gravity applied to every particle. */
        get gravity(): Vector2
        set gravity(value: Vector2)
        
        /** Minimum equivalent of [member initial_velocity_max]. */
        get initial_velocity_min(): float64
        set initial_velocity_min(value: float64)
        
        /** Maximum initial velocity magnitude for each particle. Direction comes from [member direction] and [member spread]. */
        get initial_velocity_max(): float64
        set initial_velocity_max(value: float64)
        
        /** Minimum equivalent of [member angular_velocity_max]. */
        get angular_velocity_min(): float64
        set angular_velocity_min(value: float64)
        
        /** Maximum initial angular velocity (rotation speed) applied to each particle in  *degrees*  per second. */
        get angular_velocity_max(): float64
        set angular_velocity_max(value: float64)
        
        /** Each particle's angular velocity will vary along this [Curve]. */
        get angular_velocity_curve(): Curve
        set angular_velocity_curve(value: Curve)
        
        /** Minimum equivalent of [member orbit_velocity_max]. */
        get orbit_velocity_min(): float64
        set orbit_velocity_min(value: float64)
        
        /** Maximum orbital velocity applied to each particle. Makes the particles circle around origin. Specified in number of full rotations around origin per second. */
        get orbit_velocity_max(): float64
        set orbit_velocity_max(value: float64)
        
        /** Each particle's orbital velocity will vary along this [Curve]. */
        get orbit_velocity_curve(): Curve
        set orbit_velocity_curve(value: Curve)
        
        /** Minimum equivalent of [member linear_accel_max]. */
        get linear_accel_min(): float64
        set linear_accel_min(value: float64)
        
        /** Maximum linear acceleration applied to each particle in the direction of motion. */
        get linear_accel_max(): float64
        set linear_accel_max(value: float64)
        
        /** Each particle's linear acceleration will vary along this [Curve]. */
        get linear_accel_curve(): Curve
        set linear_accel_curve(value: Curve)
        
        /** Minimum equivalent of [member radial_accel_max]. */
        get radial_accel_min(): float64
        set radial_accel_min(value: float64)
        
        /** Maximum radial acceleration applied to each particle. Makes particle accelerate away from the origin or towards it if negative. */
        get radial_accel_max(): float64
        set radial_accel_max(value: float64)
        
        /** Each particle's radial acceleration will vary along this [Curve]. */
        get radial_accel_curve(): Curve
        set radial_accel_curve(value: Curve)
        
        /** Minimum equivalent of [member tangential_accel_max]. */
        get tangential_accel_min(): float64
        set tangential_accel_min(value: float64)
        
        /** Maximum tangential acceleration applied to each particle. Tangential acceleration is perpendicular to the particle's velocity giving the particles a swirling motion. */
        get tangential_accel_max(): float64
        set tangential_accel_max(value: float64)
        
        /** Each particle's tangential acceleration will vary along this [Curve]. */
        get tangential_accel_curve(): Curve
        set tangential_accel_curve(value: Curve)
        
        /** Minimum equivalent of [member damping_max]. */
        get damping_min(): float64
        set damping_min(value: float64)
        
        /** The maximum rate at which particles lose velocity. For example value of `100` means that the particle will go from `100` velocity to `0` in `1` second. */
        get damping_max(): float64
        set damping_max(value: float64)
        
        /** Damping will vary along this [Curve]. */
        get damping_curve(): Curve
        set damping_curve(value: Curve)
        
        /** Minimum equivalent of [member angle_max]. */
        get angle_min(): float64
        set angle_min(value: float64)
        
        /** Maximum initial rotation applied to each particle, in degrees. */
        get angle_max(): float64
        set angle_max(value: float64)
        
        /** Each particle's rotation will be animated along this [Curve]. */
        get angle_curve(): Curve
        set angle_curve(value: Curve)
        
        /** Minimum equivalent of [member scale_amount_max]. */
        get scale_amount_min(): float64
        set scale_amount_min(value: float64)
        
        /** Maximum initial scale applied to each particle. */
        get scale_amount_max(): float64
        set scale_amount_max(value: float64)
        
        /** Each particle's scale will vary along this [Curve]. */
        get scale_amount_curve(): Curve
        set scale_amount_curve(value: Curve)
        
        /** If `true`, the scale curve will be split into x and y components. See [member scale_curve_x] and [member scale_curve_y]. */
        get split_scale(): boolean
        set split_scale(value: boolean)
        
        /** Each particle's horizontal scale will vary along this [Curve].  
         *  [member split_scale] must be enabled.  
         */
        get scale_curve_x(): Curve
        set scale_curve_x(value: Curve)
        
        /** Each particle's vertical scale will vary along this [Curve].  
         *  [member split_scale] must be enabled.  
         */
        get scale_curve_y(): Curve
        set scale_curve_y(value: Curve)
        
        /** Each particle's initial color. If [member texture] is defined, it will be multiplied by this color. */
        get color(): Color
        set color(value: Color)
        
        /** Each particle's color will vary along this [Gradient] (multiplied with [member color]). */
        get color_ramp(): Gradient
        set color_ramp(value: Gradient)
        
        /** Each particle's initial color will vary along this [GradientTexture1D] (multiplied with [member color]). */
        get color_initial_ramp(): Gradient
        set color_initial_ramp(value: Gradient)
        
        /** Minimum equivalent of [member hue_variation_max]. */
        get hue_variation_min(): float64
        set hue_variation_min(value: float64)
        
        /** Maximum initial hue variation applied to each particle. It will shift the particle color's hue. */
        get hue_variation_max(): float64
        set hue_variation_max(value: float64)
        
        /** Each particle's hue will vary along this [Curve]. */
        get hue_variation_curve(): Curve
        set hue_variation_curve(value: Curve)
        
        /** Minimum equivalent of [member anim_speed_max]. */
        get anim_speed_min(): float64
        set anim_speed_min(value: float64)
        
        /** Maximum particle animation speed. Animation speed of `1` means that the particles will make full `0` to `1` offset cycle during lifetime, `2` means `2` cycles etc.  
         *  With animation speed greater than `1`, remember to enable [member CanvasItemMaterial.particles_anim_loop] property if you want the animation to repeat.  
         */
        get anim_speed_max(): float64
        set anim_speed_max(value: float64)
        
        /** Each particle's animation speed will vary along this [Curve]. */
        get anim_speed_curve(): Curve
        set anim_speed_curve(value: Curve)
        
        /** Minimum equivalent of [member anim_offset_max]. */
        get anim_offset_min(): float64
        set anim_offset_min(value: float64)
        
        /** Maximum animation offset that corresponds to frame index in the texture. `0` is the first frame, `1` is the last one. See [member CanvasItemMaterial.particles_animation]. */
        get anim_offset_max(): float64
        set anim_offset_max(value: float64)
        
        /** Each particle's animation offset will vary along this [Curve]. */
        get anim_offset_curve(): Curve
        set anim_offset_curve(value: Curve)
        
        /** Emitted when all active particles have finished processing. When [member one_shot] is disabled, particles will process continuously, so this is never emitted. */
        readonly finished: Signal0
    }
    class CPUParticles2DEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    namespace CPUParticles3D {
        enum DrawOrder {
            /** Particles are drawn in the order emitted. */
            DRAW_ORDER_INDEX = 0,
            
            /** Particles are drawn in order of remaining lifetime. In other words, the particle with the highest lifetime is drawn at the front. */
            DRAW_ORDER_LIFETIME = 1,
            
            /** Particles are drawn in order of depth. */
            DRAW_ORDER_VIEW_DEPTH = 2,
        }
        enum Parameter {
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set initial velocity properties. */
            PARAM_INITIAL_LINEAR_VELOCITY = 0,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set angular velocity properties. */
            PARAM_ANGULAR_VELOCITY = 1,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set orbital velocity properties. */
            PARAM_ORBIT_VELOCITY = 2,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set linear acceleration properties. */
            PARAM_LINEAR_ACCEL = 3,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set radial acceleration properties. */
            PARAM_RADIAL_ACCEL = 4,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set tangential acceleration properties. */
            PARAM_TANGENTIAL_ACCEL = 5,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set damping properties. */
            PARAM_DAMPING = 6,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set angle properties. */
            PARAM_ANGLE = 7,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set scale properties. */
            PARAM_SCALE = 8,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set hue variation properties. */
            PARAM_HUE_VARIATION = 9,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set animation speed properties. */
            PARAM_ANIM_SPEED = 10,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_curve] to set animation offset properties. */
            PARAM_ANIM_OFFSET = 11,
            
            /** Represents the size of the [enum Parameter] enum. */
            PARAM_MAX = 12,
        }
        enum ParticleFlags {
            /** Use with [method set_particle_flag] to set [member particle_flag_align_y]. */
            PARTICLE_FLAG_ALIGN_Y_TO_VELOCITY = 0,
            
            /** Use with [method set_particle_flag] to set [member particle_flag_rotate_y]. */
            PARTICLE_FLAG_ROTATE_Y = 1,
            
            /** Use with [method set_particle_flag] to set [member particle_flag_disable_z]. */
            PARTICLE_FLAG_DISABLE_Z = 2,
            
            /** Represents the size of the [enum ParticleFlags] enum. */
            PARTICLE_FLAG_MAX = 3,
        }
        enum EmissionShape {
            /** All particles will be emitted from a single point. */
            EMISSION_SHAPE_POINT = 0,
            
            /** Particles will be emitted in the volume of a sphere. */
            EMISSION_SHAPE_SPHERE = 1,
            
            /** Particles will be emitted on the surface of a sphere. */
            EMISSION_SHAPE_SPHERE_SURFACE = 2,
            
            /** Particles will be emitted in the volume of a box. */
            EMISSION_SHAPE_BOX = 3,
            
            /** Particles will be emitted at a position chosen randomly among [member emission_points]. Particle color will be modulated by [member emission_colors]. */
            EMISSION_SHAPE_POINTS = 4,
            
            /** Particles will be emitted at a position chosen randomly among [member emission_points]. Particle velocity and rotation will be set based on [member emission_normals]. Particle color will be modulated by [member emission_colors]. */
            EMISSION_SHAPE_DIRECTED_POINTS = 5,
            
            /** Particles will be emitted in a ring or cylinder. */
            EMISSION_SHAPE_RING = 6,
            
            /** Represents the size of the [enum EmissionShape] enum. */
            EMISSION_SHAPE_MAX = 7,
        }
    }
    /** A CPU-based 3D particle emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cpuparticles3d.html  
     */
    class CPUParticles3D extends GeometryInstance3D {
        constructor(identifier?: any)
        /** Restarts the particle emitter. */
        restart(): void
        
        /** Sets the minimum value for the given parameter. */
        set_param_min(param: CPUParticles3D.Parameter, value: float64): void
        
        /** Returns the minimum value range for the given parameter. */
        get_param_min(param: CPUParticles3D.Parameter): float64
        
        /** Sets the maximum value for the given parameter. */
        set_param_max(param: CPUParticles3D.Parameter, value: float64): void
        
        /** Returns the maximum value range for the given parameter. */
        get_param_max(param: CPUParticles3D.Parameter): float64
        
        /** Sets the [Curve] of the parameter specified by [enum Parameter]. */
        set_param_curve(param: CPUParticles3D.Parameter, curve: Curve): void
        
        /** Returns the [Curve] of the parameter specified by [enum Parameter]. */
        get_param_curve(param: CPUParticles3D.Parameter): Curve
        
        /** Enables or disables the given particle flag (see [enum ParticleFlags] for options). */
        set_particle_flag(particle_flag: CPUParticles3D.ParticleFlags, enable: boolean): void
        
        /** Returns the enabled state of the given particle flag (see [enum ParticleFlags] for options). */
        get_particle_flag(particle_flag: CPUParticles3D.ParticleFlags): boolean
        
        /** Sets this node's properties to match a given [GPUParticles3D] node with an assigned [ParticleProcessMaterial]. */
        convert_from_particles(particles: Node): void
        
        /** If `true`, particles are being emitted. [member emitting] can be used to start and stop particles from emitting. However, if [member one_shot] is `true` setting [member emitting] to `true` will not restart the emission cycle until after all active particles finish processing. You can use the [signal finished] signal to be notified once all active particles finish processing. */
        get emitting(): boolean
        set emitting(value: boolean)
        
        /** Number of particles emitted in one emission cycle. */
        get amount(): int64
        set amount(value: int64)
        
        /** Amount of time each particle will exist. */
        get lifetime(): float64
        set lifetime(value: float64)
        
        /** If `true`, only one emission cycle occurs. If set `true` during a cycle, emission will stop at the cycle's end. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** Particle system starts as if it had already run for this many seconds. */
        get preprocess(): float64
        set preprocess(value: float64)
        
        /** Particle system's running speed scaling ratio. A value of `0` can be used to pause the particles. */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** How rapidly particles in an emission cycle are emitted. If greater than `0`, there will be a gap in emissions before the next cycle begins. */
        get explosiveness(): float64
        set explosiveness(value: float64)
        
        /** Emission lifetime randomness ratio. */
        get randomness(): float64
        set randomness(value: float64)
        
        /** Particle lifetime randomness ratio. */
        get lifetime_randomness(): float64
        set lifetime_randomness(value: float64)
        
        /** The particle system's frame rate is fixed to a value. For example, changing the value to 2 will make the particles render at 2 frames per second. Note this does not slow down the particle system itself. */
        get fixed_fps(): int64
        set fixed_fps(value: int64)
        
        /** If `true`, results in fractional delta calculation which has a smoother particles display effect. */
        get fract_delta(): boolean
        set fract_delta(value: boolean)
        
        /** The [AABB] that determines the node's region which needs to be visible on screen for the particle system to be active.  
         *  Grow the box if particles suddenly appear/disappear when the node enters/exits the screen. The [AABB] can be grown via code or with the **Particles → Generate AABB** editor tool.  
         */
        get visibility_aabb(): AABB
        set visibility_aabb(value: AABB)
        
        /** If `true`, particles use the parent node's coordinate space (known as local coordinates). This will cause particles to move and rotate along the [CPUParticles3D] node (and its parents) when it is moved or rotated. If `false`, particles use global coordinates; they will not move or rotate along the [CPUParticles3D] node (and its parents) when it is moved or rotated. */
        get local_coords(): boolean
        set local_coords(value: boolean)
        
        /** Particle draw order. Uses [enum DrawOrder] values. */
        get draw_order(): int64
        set draw_order(value: int64)
        
        /** The [Mesh] used for each particle. If `null`, particles will be spheres. */
        get mesh(): Mesh
        set mesh(value: Mesh)
        
        /** Particles will be emitted inside this region. See [enum EmissionShape] for possible values. */
        get emission_shape(): int64
        set emission_shape(value: int64)
        
        /** The sphere's radius if [enum EmissionShape] is set to [constant EMISSION_SHAPE_SPHERE]. */
        get emission_sphere_radius(): float64
        set emission_sphere_radius(value: float64)
        
        /** The rectangle's extents if [member emission_shape] is set to [constant EMISSION_SHAPE_BOX]. */
        get emission_box_extents(): Vector3
        set emission_box_extents(value: Vector3)
        
        /** Sets the initial positions to spawn particles when using [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_points(): PackedVector3Array
        set emission_points(value: PackedVector3Array | Vector3[])
        
        /** Sets the direction the particles will be emitted in when using [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_normals(): PackedVector3Array
        set emission_normals(value: PackedVector3Array | Vector3[])
        
        /** Sets the [Color]s to modulate particles by when using [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS].  
         *      
         *  **Note:** [member emission_colors] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member emission_colors] will have no visible effect.  
         */
        get emission_colors(): PackedColorArray
        set emission_colors(value: PackedColorArray | Color[])
        
        /** The axis of the ring when using the emitter [constant EMISSION_SHAPE_RING]. */
        get emission_ring_axis(): Vector3
        set emission_ring_axis(value: Vector3)
        
        /** The height of the ring when using the emitter [constant EMISSION_SHAPE_RING]. */
        get emission_ring_height(): float64
        set emission_ring_height(value: float64)
        
        /** The radius of the ring when using the emitter [constant EMISSION_SHAPE_RING]. */
        get emission_ring_radius(): float64
        set emission_ring_radius(value: float64)
        
        /** The inner radius of the ring when using the emitter [constant EMISSION_SHAPE_RING]. */
        get emission_ring_inner_radius(): float64
        set emission_ring_inner_radius(value: float64)
        
        /** Align Y axis of particle with the direction of its velocity. */
        get particle_flag_align_y(): boolean
        set particle_flag_align_y(value: boolean)
        
        /** If `true`, particles rotate around Y axis by [member angle_min]. */
        get particle_flag_rotate_y(): boolean
        set particle_flag_rotate_y(value: boolean)
        
        /** If `true`, particles will not move on the Z axis. */
        get particle_flag_disable_z(): boolean
        set particle_flag_disable_z(value: boolean)
        
        /** Unit vector specifying the particles' emission direction. */
        get direction(): Vector3
        set direction(value: Vector3)
        
        /** Each particle's initial direction range from `+spread` to `-spread` degrees. Applied to X/Z plane and Y/Z planes. */
        get spread(): float64
        set spread(value: float64)
        
        /** Amount of [member spread] in Y/Z plane. A value of `1` restricts particles to X/Z plane. */
        get flatness(): float64
        set flatness(value: float64)
        
        /** Gravity applied to every particle. */
        get gravity(): Vector3
        set gravity(value: Vector3)
        
        /** Minimum value of the initial velocity. */
        get initial_velocity_min(): float64
        set initial_velocity_min(value: float64)
        
        /** Maximum value of the initial velocity. */
        get initial_velocity_max(): float64
        set initial_velocity_max(value: float64)
        
        /** Minimum initial angular velocity (rotation speed) applied to each particle in  *degrees*  per second. */
        get angular_velocity_min(): float64
        set angular_velocity_min(value: float64)
        
        /** Maximum initial angular velocity (rotation speed) applied to each particle in  *degrees*  per second. */
        get angular_velocity_max(): float64
        set angular_velocity_max(value: float64)
        
        /** Each particle's angular velocity (rotation speed) will vary along this [Curve] over its lifetime. */
        get angular_velocity_curve(): Curve
        set angular_velocity_curve(value: Curve)
        
        /** Minimum orbit velocity. */
        get orbit_velocity_min(): float64
        set orbit_velocity_min(value: float64)
        
        /** Maximum orbit velocity. */
        get orbit_velocity_max(): float64
        set orbit_velocity_max(value: float64)
        
        /** Each particle's orbital velocity will vary along this [Curve]. */
        get orbit_velocity_curve(): Curve
        set orbit_velocity_curve(value: Curve)
        
        /** Minimum linear acceleration. */
        get linear_accel_min(): float64
        set linear_accel_min(value: float64)
        
        /** Maximum linear acceleration. */
        get linear_accel_max(): float64
        set linear_accel_max(value: float64)
        
        /** Each particle's linear acceleration will vary along this [Curve]. */
        get linear_accel_curve(): Curve
        set linear_accel_curve(value: Curve)
        
        /** Minimum radial acceleration. */
        get radial_accel_min(): float64
        set radial_accel_min(value: float64)
        
        /** Maximum radial acceleration. */
        get radial_accel_max(): float64
        set radial_accel_max(value: float64)
        
        /** Each particle's radial acceleration will vary along this [Curve]. */
        get radial_accel_curve(): Curve
        set radial_accel_curve(value: Curve)
        
        /** Minimum tangent acceleration. */
        get tangential_accel_min(): float64
        set tangential_accel_min(value: float64)
        
        /** Maximum tangent acceleration. */
        get tangential_accel_max(): float64
        set tangential_accel_max(value: float64)
        
        /** Each particle's tangential acceleration will vary along this [Curve]. */
        get tangential_accel_curve(): Curve
        set tangential_accel_curve(value: Curve)
        
        /** Minimum damping. */
        get damping_min(): float64
        set damping_min(value: float64)
        
        /** Maximum damping. */
        get damping_max(): float64
        set damping_max(value: float64)
        
        /** Damping will vary along this [Curve]. */
        get damping_curve(): Curve
        set damping_curve(value: Curve)
        
        /** Minimum angle. */
        get angle_min(): float64
        set angle_min(value: float64)
        
        /** Maximum angle. */
        get angle_max(): float64
        set angle_max(value: float64)
        
        /** Each particle's rotation will be animated along this [Curve]. */
        get angle_curve(): Curve
        set angle_curve(value: Curve)
        
        /** Minimum scale. */
        get scale_amount_min(): float64
        set scale_amount_min(value: float64)
        
        /** Maximum scale. */
        get scale_amount_max(): float64
        set scale_amount_max(value: float64)
        
        /** Each particle's scale will vary along this [Curve]. */
        get scale_amount_curve(): Curve
        set scale_amount_curve(value: Curve)
        
        /** If set to `true`, three different scale curves can be specified, one per scale axis. */
        get split_scale(): boolean
        set split_scale(value: boolean)
        
        /** Curve for the scale over life, along the x axis. */
        get scale_curve_x(): Curve
        set scale_curve_x(value: Curve)
        
        /** Curve for the scale over life, along the y axis. */
        get scale_curve_y(): Curve
        set scale_curve_y(value: Curve)
        
        /** Curve for the scale over life, along the z axis. */
        get scale_curve_z(): Curve
        set scale_curve_z(value: Curve)
        
        /** Each particle's initial color.  
         *      
         *  **Note:** [member color] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color] will have no visible effect.  
         */
        get color(): Color
        set color(value: Color)
        
        /** Each particle's color will vary along this [GradientTexture1D] over its lifetime (multiplied with [member color]).  
         *      
         *  **Note:** [member color_ramp] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color_ramp] will have no visible effect.  
         */
        get color_ramp(): Gradient
        set color_ramp(value: Gradient)
        
        /** Each particle's initial color will vary along this [GradientTexture1D] (multiplied with [member color]).  
         *      
         *  **Note:** [member color_initial_ramp] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color_initial_ramp] will have no visible effect.  
         */
        get color_initial_ramp(): Gradient
        set color_initial_ramp(value: Gradient)
        
        /** Minimum hue variation. */
        get hue_variation_min(): float64
        set hue_variation_min(value: float64)
        
        /** Maximum hue variation. */
        get hue_variation_max(): float64
        set hue_variation_max(value: float64)
        
        /** Each particle's hue will vary along this [Curve]. */
        get hue_variation_curve(): Curve
        set hue_variation_curve(value: Curve)
        
        /** Minimum particle animation speed. */
        get anim_speed_min(): float64
        set anim_speed_min(value: float64)
        
        /** Maximum particle animation speed. */
        get anim_speed_max(): float64
        set anim_speed_max(value: float64)
        
        /** Each particle's animation speed will vary along this [Curve]. */
        get anim_speed_curve(): Curve
        set anim_speed_curve(value: Curve)
        
        /** Minimum animation offset. */
        get anim_offset_min(): float64
        set anim_offset_min(value: float64)
        
        /** Maximum animation offset. */
        get anim_offset_max(): float64
        set anim_offset_max(value: float64)
        
        /** Each particle's animation offset will vary along this [Curve]. */
        get anim_offset_curve(): Curve
        set anim_offset_curve(value: Curve)
        
        /** Emitted when all active particles have finished processing. When [member one_shot] is disabled, particles will process continuously, so this is never emitted. */
        readonly finished: Signal0
    }
    class CPUParticles3DEditor extends GPUParticles3DEditorBase {
        constructor(identifier?: any)
    }
    class CPUParticles3DEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    class CPUParticles3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** Calls the specified method after optional delay.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_callbacktweener.html  
     */
    class CallbackTweener extends Tweener {
        constructor(identifier?: any)
        /** Makes the callback call delayed by given time in seconds.  
         *  **Example:**  
         *    
         */
        set_delay(delay: float64): CallbackTweener
    }
    namespace Camera2D {
        enum AnchorMode {
            /** The camera's position is fixed so that the top-left corner is always at the origin. */
            ANCHOR_MODE_FIXED_TOP_LEFT = 0,
            
            /** The camera's position takes into account vertical/horizontal offsets and the screen size. */
            ANCHOR_MODE_DRAG_CENTER = 1,
        }
        enum Camera2DProcessCallback {
            /** The camera updates during physics frames (see [constant Node.NOTIFICATION_INTERNAL_PHYSICS_PROCESS]). */
            CAMERA2D_PROCESS_PHYSICS = 0,
            
            /** The camera updates during process frames (see [constant Node.NOTIFICATION_INTERNAL_PROCESS]). */
            CAMERA2D_PROCESS_IDLE = 1,
        }
    }
    /** Camera node for 2D scenes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_camera2d.html  
     */
    class Camera2D extends Node2D {
        constructor(identifier?: any)
        _update_scroll(): void
        
        /** Forces this [Camera2D] to become the current active one. [member enabled] must be `true`. */
        make_current(): void
        
        /** Returns `true` if this [Camera2D] is the active camera (see [method Viewport.get_camera_2d]). */
        is_current(): boolean
        _make_current(_unnamed_arg0: Object): void
        
        /** Sets the camera limit for the specified [enum Side]. See also [member limit_bottom], [member limit_top], [member limit_left], and [member limit_right]. */
        set_limit(margin: Side, limit: int64): void
        
        /** Returns the camera limit for the specified [enum Side]. See also [member limit_bottom], [member limit_top], [member limit_left], and [member limit_right]. */
        get_limit(margin: Side): int64
        
        /** Sets the specified [enum Side]'s margin. See also [member drag_bottom_margin], [member drag_top_margin], [member drag_left_margin], and [member drag_right_margin]. */
        set_drag_margin(margin: Side, drag_margin: float64): void
        
        /** Returns the specified [enum Side]'s margin. See also [member drag_bottom_margin], [member drag_top_margin], [member drag_left_margin], and [member drag_right_margin]. */
        get_drag_margin(margin: Side): float64
        
        /** Returns this camera's target position, in global coordinates.  
         *      
         *  **Note:** The returned value is not the same as [member Node2D.global_position], as it is affected by the drag properties. It is also not the same as the current position if [member position_smoothing_enabled] is `true` (see [method get_screen_center_position]).  
         */
        get_target_position(): Vector2
        
        /** Returns the center of the screen from this camera's point of view, in global coordinates.  
         *      
         *  **Note:** The exact targeted position of the camera may be different. See [method get_target_position].  
         */
        get_screen_center_position(): Vector2
        
        /** Forces the camera to update scroll immediately. */
        force_update_scroll(): void
        
        /** Sets the camera's position immediately to its current smoothing destination.  
         *  This method has no effect if [member position_smoothing_enabled] is `false`.  
         */
        reset_smoothing(): void
        
        /** Aligns the camera to the tracked node. */
        align(): void
        _set_old_smoothing(follow_smoothing: float64): void
        
        /** The camera's relative offset. Useful for looking around or camera shake animations. The offsetted camera can go past the limits defined in [member limit_top], [member limit_bottom], [member limit_left] and [member limit_right]. */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** The Camera2D's anchor point. See [enum AnchorMode] constants. */
        get anchor_mode(): int64
        set anchor_mode(value: int64)
        
        /** If `true`, the camera's rendered view is not affected by its [member Node2D.rotation] and [member Node2D.global_rotation]. */
        get ignore_rotation(): boolean
        set ignore_rotation(value: boolean)
        
        /** Controls whether the camera can be active or not. If `true`, the [Camera2D] will become the main camera when it enters the scene tree and there is no active camera currently (see [method Viewport.get_camera_2d]).  
         *  When the camera is currently active and [member enabled] is set to `false`, the next enabled [Camera2D] in the scene tree will become active.  
         */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The camera's zoom. A zoom of `Vector(2, 2)` doubles the size seen in the viewport. A zoom of `Vector(0.5, 0.5)` halves the size seen in the viewport.  
         *      
         *  **Note:** [member FontFile.oversampling] does  *not*  take [Camera2D] zoom into account. This means that zooming in/out will cause bitmap fonts and rasterized (non-MSDF) dynamic fonts to appear blurry or pixelated unless the font is part of a [CanvasLayer] that makes it ignore camera zoom. To ensure text remains crisp regardless of zoom, you can enable MSDF font rendering by enabling [member ProjectSettings.gui/theme/default_font_multichannel_signed_distance_field] (applies to the default project font only), or enabling **Multichannel Signed Distance Field** in the import options of a DynamicFont for custom fonts. On system fonts, [member SystemFont.multichannel_signed_distance_field] can be enabled in the inspector.  
         */
        get zoom(): Vector2
        set zoom(value: Vector2)
        
        /** The custom [Viewport] node attached to the [Camera2D]. If `null` or not a [Viewport], uses the default viewport instead. */
        get custom_viewport(): Viewport
        set custom_viewport(value: Viewport)
        
        /** The camera's process callback. See [enum Camera2DProcessCallback]. */
        get process_callback(): int64
        set process_callback(value: int64)
        
        /** Left scroll limit in pixels. The camera stops moving when reaching this value, but [member offset] can push the view past the limit. */
        get limit_left(): int64
        set limit_left(value: int64)
        
        /** Top scroll limit in pixels. The camera stops moving when reaching this value, but [member offset] can push the view past the limit. */
        get limit_top(): int64
        set limit_top(value: int64)
        
        /** Right scroll limit in pixels. The camera stops moving when reaching this value, but [member offset] can push the view past the limit. */
        get limit_right(): int64
        set limit_right(value: int64)
        
        /** Bottom scroll limit in pixels. The camera stops moving when reaching this value, but [member offset] can push the view past the limit. */
        get limit_bottom(): int64
        set limit_bottom(value: int64)
        
        /** If `true`, the camera smoothly stops when reaches its limits.  
         *  This property has no effect if [member position_smoothing_enabled] is `false`.  
         *      
         *  **Note:** To immediately update the camera's position to be within limits without smoothing, even with this setting enabled, invoke [method reset_smoothing].  
         */
        get limit_smoothed(): boolean
        set limit_smoothed(value: boolean)
        
        /** If `true`, the camera's view smoothly moves towards its target position at [member position_smoothing_speed]. */
        get position_smoothing_enabled(): boolean
        set position_smoothing_enabled(value: boolean)
        
        /** Speed in pixels per second of the camera's smoothing effect when [member position_smoothing_enabled] is `true`. */
        get position_smoothing_speed(): float64
        set position_smoothing_speed(value: float64)
        
        /** If `true`, the camera's view smoothly rotates, via asymptotic smoothing, to align with its target rotation at [member rotation_smoothing_speed].  
         *      
         *  **Note:** This property has no effect if [member ignore_rotation] is `true`.  
         */
        get rotation_smoothing_enabled(): boolean
        set rotation_smoothing_enabled(value: boolean)
        
        /** The angular, asymptotic speed of the camera's rotation smoothing effect when [member rotation_smoothing_enabled] is `true`. */
        get rotation_smoothing_speed(): float64
        set rotation_smoothing_speed(value: float64)
        
        /** If `true`, the camera only moves when reaching the horizontal (left and right) drag margins. If `false`, the camera moves horizontally regardless of margins. */
        get drag_horizontal_enabled(): boolean
        set drag_horizontal_enabled(value: boolean)
        
        /** If `true`, the camera only moves when reaching the vertical (top and bottom) drag margins. If `false`, the camera moves vertically regardless of the drag margins. */
        get drag_vertical_enabled(): boolean
        set drag_vertical_enabled(value: boolean)
        
        /** The relative horizontal drag offset of the camera between the right (`-1`) and left (`1`) drag margins.  
         *      
         *  **Note:** Used to set the initial horizontal drag offset; determine the current offset; or force the current offset. It's not automatically updated when [member drag_horizontal_enabled] is `true` or the drag margins are changed.  
         */
        get drag_horizontal_offset(): float64
        set drag_horizontal_offset(value: float64)
        
        /** The relative vertical drag offset of the camera between the bottom (`-1`) and top (`1`) drag margins.  
         *      
         *  **Note:** Used to set the initial vertical drag offset; determine the current offset; or force the current offset. It's not automatically updated when [member drag_vertical_enabled] is `true` or the drag margins are changed.  
         */
        get drag_vertical_offset(): float64
        set drag_vertical_offset(value: float64)
        
        /** Left margin needed to drag the camera. A value of `1` makes the camera move only when reaching the left edge of the screen. */
        get drag_left_margin(): float64
        set drag_left_margin(value: float64)
        
        /** Top margin needed to drag the camera. A value of `1` makes the camera move only when reaching the top edge of the screen. */
        get drag_top_margin(): float64
        set drag_top_margin(value: float64)
        
        /** Right margin needed to drag the camera. A value of `1` makes the camera move only when reaching the right edge of the screen. */
        get drag_right_margin(): float64
        set drag_right_margin(value: float64)
        
        /** Bottom margin needed to drag the camera. A value of `1` makes the camera move only when reaching the bottom edge of the screen. */
        get drag_bottom_margin(): float64
        set drag_bottom_margin(value: float64)
        
        /** If `true`, draws the camera's screen rectangle in the editor. */
        get editor_draw_screen(): boolean
        set editor_draw_screen(value: boolean)
        
        /** If `true`, draws the camera's limits rectangle in the editor. */
        get editor_draw_limits(): boolean
        set editor_draw_limits(value: boolean)
        
        /** If `true`, draws the camera's drag margin rectangle in the editor. */
        get editor_draw_drag_margin(): boolean
        set editor_draw_drag_margin(value: boolean)
    }
    namespace Camera3D {
        enum ProjectionType {
            /** Perspective projection. Objects on the screen becomes smaller when they are far away. */
            PROJECTION_PERSPECTIVE = 0,
            
            /** Orthogonal projection, also known as orthographic projection. Objects remain the same size on the screen no matter how far away they are. */
            PROJECTION_ORTHOGONAL = 1,
            
            /** Frustum projection. This mode allows adjusting [member frustum_offset] to create "tilted frustum" effects. */
            PROJECTION_FRUSTUM = 2,
        }
        enum KeepAspect {
            /** Preserves the horizontal aspect ratio; also known as Vert- scaling. This is usually the best option for projects running in portrait mode, as taller aspect ratios will benefit from a wider vertical FOV. */
            KEEP_WIDTH = 0,
            
            /** Preserves the vertical aspect ratio; also known as Hor+ scaling. This is usually the best option for projects running in landscape mode, as wider aspect ratios will automatically benefit from a wider horizontal FOV. */
            KEEP_HEIGHT = 1,
        }
        enum DopplerTracking {
            /** Disables [url=https://en.wikipedia.org/wiki/Doppler_effect]Doppler effect[/url] simulation (default). */
            DOPPLER_TRACKING_DISABLED = 0,
            
            /** Simulate [url=https://en.wikipedia.org/wiki/Doppler_effect]Doppler effect[/url] by tracking positions of objects that are changed in `_process`. Changes in the relative velocity of this camera compared to those objects affect how audio is perceived (changing the audio's [member AudioStreamPlayer3D.pitch_scale]). */
            DOPPLER_TRACKING_IDLE_STEP = 1,
            
            /** Simulate [url=https://en.wikipedia.org/wiki/Doppler_effect]Doppler effect[/url] by tracking positions of objects that are changed in `_physics_process`. Changes in the relative velocity of this camera compared to those objects affect how audio is perceived (changing the audio's [member AudioStreamPlayer3D.pitch_scale]). */
            DOPPLER_TRACKING_PHYSICS_STEP = 2,
        }
    }
    /** Camera node, displays from a point of view.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_camera3d.html  
     */
    class Camera3D extends Node3D {
        constructor(identifier?: any)
        /** Returns a normal vector in world space, that is the result of projecting a point on the [Viewport] rectangle by the inverse camera projection. This is useful for casting rays in the form of (origin, normal) for object intersection or picking. */
        project_ray_normal(screen_point: Vector2): Vector3
        
        /** Returns a normal vector from the screen point location directed along the camera. Orthogonal cameras are normalized. Perspective cameras account for perspective, screen width/height, etc. */
        project_local_ray_normal(screen_point: Vector2): Vector3
        
        /** Returns a 3D position in world space, that is the result of projecting a point on the [Viewport] rectangle by the inverse camera projection. This is useful for casting rays in the form of (origin, normal) for object intersection or picking. */
        project_ray_origin(screen_point: Vector2): Vector3
        
        /** Returns the 2D coordinate in the [Viewport] rectangle that maps to the given 3D point in world space.  
         *      
         *  **Note:** When using this to position GUI elements over a 3D viewport, use [method is_position_behind] to prevent them from appearing if the 3D point is behind the camera:  
         *    
         */
        unproject_position(world_point: Vector3): Vector2
        
        /** Returns `true` if the given position is behind the camera (the blue part of the linked diagram). [url=https://raw.githubusercontent.com/godotengine/godot-docs/4.1/img/camera3d_position_frustum.png]See this diagram[/url] for an overview of position query methods.  
         *      
         *  **Note:** A position which returns `false` may still be outside the camera's field of view.  
         */
        is_position_behind(world_point: Vector3): boolean
        
        /** Returns the 3D point in world space that maps to the given 2D coordinate in the [Viewport] rectangle on a plane that is the given [param z_depth] distance into the scene away from the camera. */
        project_position(screen_point: Vector2, z_depth: float64): Vector3
        
        /** Sets the camera projection to perspective mode (see [constant PROJECTION_PERSPECTIVE]), by specifying a [param fov] (field of view) angle in degrees, and the [param z_near] and [param z_far] clip planes in world space units. */
        set_perspective(fov: float64, z_near: float64, z_far: float64): void
        
        /** Sets the camera projection to orthogonal mode (see [constant PROJECTION_ORTHOGONAL]), by specifying a [param size], and the [param z_near] and [param z_far] clip planes in world space units. (As a hint, 2D games often use this projection, with values specified in pixels.) */
        set_orthogonal(size: float64, z_near: float64, z_far: float64): void
        
        /** Sets the camera projection to frustum mode (see [constant PROJECTION_FRUSTUM]), by specifying a [param size], an [param offset], and the [param z_near] and [param z_far] clip planes in world space units. See also [member frustum_offset]. */
        set_frustum(size: float64, offset: Vector2, z_near: float64, z_far: float64): void
        
        /** Makes this camera the current camera for the [Viewport] (see class description). If the camera node is outside the scene tree, it will attempt to become current once it's added. */
        make_current(): void
        
        /** If this is the current camera, remove it from being current. If [param enable_next] is `true`, request to make the next camera current, if any. */
        clear_current(enable_next: boolean = true): void
        
        /** Returns the transform of the camera plus the vertical ([member v_offset]) and horizontal ([member h_offset]) offsets; and any other adjustments made to the position and orientation of the camera by subclassed cameras such as [XRCamera3D]. */
        get_camera_transform(): Transform3D
        
        /** Returns the projection matrix that this camera uses to render to its associated viewport. The camera must be part of the scene tree to function. */
        get_camera_projection(): Projection
        
        /** Returns the camera's frustum planes in world space units as an array of [Plane]s in the following order: near, far, left, top, right, bottom. Not to be confused with [member frustum_offset]. */
        get_frustum(): GArray
        
        /** Returns `true` if the given position is inside the camera's frustum (the green part of the linked diagram). [url=https://raw.githubusercontent.com/godotengine/godot-docs/4.1/img/camera3d_position_frustum.png]See this diagram[/url] for an overview of position query methods. */
        is_position_in_frustum(world_point: Vector3): boolean
        
        /** Returns the camera's RID from the [RenderingServer]. */
        get_camera_rid(): RID
        
        /** Returns the RID of a pyramid shape encompassing the camera's view frustum, ignoring the camera's near plane. The tip of the pyramid represents the position of the camera. */
        get_pyramid_shape_rid(): RID
        
        /** Based on [param value], enables or disables the specified layer in the [member cull_mask], given a [param layer_number] between 1 and 20. */
        set_cull_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member cull_mask] is enabled, given a [param layer_number] between 1 and 20. */
        get_cull_mask_value(layer_number: int64): boolean
        
        /** The axis to lock during [member fov]/[member size] adjustments. Can be either [constant KEEP_WIDTH] or [constant KEEP_HEIGHT]. */
        get keep_aspect(): int64
        set keep_aspect(value: int64)
        
        /** The culling mask that describes which [member VisualInstance3D.layers] are rendered by this camera. By default, all 20 user-visible layers are rendered.  
         *      
         *  **Note:** Since the [member cull_mask] allows for 32 layers to be stored in total, there are an additional 12 layers that are only used internally by the engine and aren't exposed in the editor. Setting [member cull_mask] using a script allows you to toggle those reserved layers, which can be useful for editor plugins.  
         *  To adjust [member cull_mask] more easily using a script, use [method get_cull_mask_value] and [method set_cull_mask_value].  
         *      
         *  **Note:** [VoxelGI], SDFGI and [LightmapGI] will always take all layers into account to determine what contributes to global illumination. If this is an issue, set [member GeometryInstance3D.gi_mode] to [constant GeometryInstance3D.GI_MODE_DISABLED] for meshes and [member Light3D.light_bake_mode] to [constant Light3D.BAKE_DISABLED] for lights to exclude them from global illumination.  
         */
        get cull_mask(): int64
        set cull_mask(value: int64)
        
        /** The [Environment] to use for this camera. */
        get environment(): Environment
        set environment(value: Environment)
        
        /** The [CameraAttributes] to use for this camera. */
        get attributes(): CameraAttributesPractical | CameraAttributesPhysical
        set attributes(value: CameraAttributesPractical | CameraAttributesPhysical)
        
        /** The [Compositor] to use for this camera. */
        get compositor(): Compositor
        set compositor(value: Compositor)
        
        /** The horizontal (X) offset of the camera viewport. */
        get h_offset(): float64
        set h_offset(value: float64)
        
        /** The vertical (Y) offset of the camera viewport. */
        get v_offset(): float64
        set v_offset(value: float64)
        
        /** If not [constant DOPPLER_TRACKING_DISABLED], this camera will simulate the [url=https://en.wikipedia.org/wiki/Doppler_effect]Doppler effect[/url] for objects changed in particular `_process` methods. See [enum DopplerTracking] for possible values. */
        get doppler_tracking(): int64
        set doppler_tracking(value: int64)
        
        /** The camera's projection mode. In [constant PROJECTION_PERSPECTIVE] mode, objects' Z distance from the camera's local space scales their perceived size. */
        get projection(): int64
        set projection(value: int64)
        
        /** If `true`, the ancestor [Viewport] is currently using this camera.  
         *  If multiple cameras are in the scene, one will always be made current. For example, if two [Camera3D] nodes are present in the scene and only one is current, setting one camera's [member current] to `false` will cause the other camera to be made current.  
         */
        get current(): boolean
        set current(value: boolean)
        
        /** The camera's field of view angle (in degrees). Only applicable in perspective mode. Since [member keep_aspect] locks one axis, [member fov] sets the other axis' field of view angle.  
         *  For reference, the default vertical field of view value (`75.0`) is equivalent to a horizontal FOV of:  
         *  - ~91.31 degrees in a 4:3 viewport  
         *  - ~101.67 degrees in a 16:10 viewport  
         *  - ~107.51 degrees in a 16:9 viewport  
         *  - ~121.63 degrees in a 21:9 viewport  
         */
        get fov(): float64
        set fov(value: float64)
        
        /** The camera's size in meters measured as the diameter of the width or height, depending on [member keep_aspect]. Only applicable in orthogonal and frustum modes. */
        get size(): float64
        set size(value: float64)
        
        /** The camera's frustum offset. This can be changed from the default to create "tilted frustum" effects such as [url=https://zdoom.org/wiki/Y-shearing]Y-shearing[/url].  
         *      
         *  **Note:** Only effective if [member projection] is [constant PROJECTION_FRUSTUM].  
         */
        get frustum_offset(): Vector2
        set frustum_offset(value: Vector2)
        
        /** The distance to the near culling boundary for this camera relative to its local Z axis. Lower values allow the camera to see objects more up close to its origin, at the cost of lower precision across the  *entire*  range. Values lower than the default can lead to increased Z-fighting. */
        get near(): float64
        set near(value: float64)
        
        /** The distance to the far culling boundary for this camera relative to its local Z axis. Higher values allow the camera to see further away, while decreasing [member far] can improve performance if it results in objects being partially or fully culled. */
        get far(): float64
        set far(value: float64)
    }
    class Camera3DEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    class Camera3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** Parent class for camera settings.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cameraattributes.html  
     */
    class CameraAttributes extends Resource {
        constructor(identifier?: any)
        /** Sensitivity of camera sensors, measured in ISO. A higher sensitivity results in a brighter image. Only available when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled. When [member auto_exposure_enabled] this can be used as a method of exposure compensation, doubling the value will increase the exposure value (measured in EV100) by 1 stop. */
        get exposure_sensitivity(): float64
        set exposure_sensitivity(value: float64)
        
        /** Multiplier for the exposure amount. A higher value results in a brighter image. */
        get exposure_multiplier(): float64
        set exposure_multiplier(value: float64)
        
        /** If `true`, enables the tonemapping auto exposure mode of the scene renderer. If `true`, the renderer will automatically determine the exposure setting to adapt to the scene's illumination and the observed light. */
        get auto_exposure_enabled(): boolean
        set auto_exposure_enabled(value: boolean)
        
        /** The scale of the auto exposure effect. Affects the intensity of auto exposure. */
        get auto_exposure_scale(): float64
        set auto_exposure_scale(value: float64)
        
        /** The speed of the auto exposure effect. Affects the time needed for the camera to perform auto exposure. */
        get auto_exposure_speed(): float64
        set auto_exposure_speed(value: float64)
    }
    /** Physically-based camera settings.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cameraattributesphysical.html  
     */
    class CameraAttributesPhysical extends CameraAttributes {
        constructor(identifier?: any)
        /** Returns the vertical field of view that corresponds to the [member frustum_focal_length]. This value is calculated internally whenever [member frustum_focal_length] is changed. */
        get_fov(): float64
        
        /** Distance from camera of object that will be in focus, measured in meters. Internally this will be clamped to be at least 1 millimeter larger than [member frustum_focal_length]. */
        get frustum_focus_distance(): float64
        set frustum_focus_distance(value: float64)
        
        /** Distance between camera lens and camera aperture, measured in millimeters. Controls field of view and depth of field. A larger focal length will result in a smaller field of view and a narrower depth of field meaning fewer objects will be in focus. A smaller focal length will result in a wider field of view and a larger depth of field meaning more objects will be in focus. When attached to a [Camera3D] as its [member Camera3D.attributes], it will override the [member Camera3D.fov] property and the [member Camera3D.keep_aspect] property. */
        get frustum_focal_length(): float64
        set frustum_focal_length(value: float64)
        
        /** Override value for [member Camera3D.near]. Used internally when calculating depth of field. When attached to a [Camera3D] as its [member Camera3D.attributes], it will override the [member Camera3D.near] property. */
        get frustum_near(): float64
        set frustum_near(value: float64)
        
        /** Override value for [member Camera3D.far]. Used internally when calculating depth of field. When attached to a [Camera3D] as its [member Camera3D.attributes], it will override the [member Camera3D.far] property. */
        get frustum_far(): float64
        set frustum_far(value: float64)
        
        /** Size of the aperture of the camera, measured in f-stops. An f-stop is a unitless ratio between the focal length of the camera and the diameter of the aperture. A high aperture setting will result in a smaller aperture which leads to a dimmer image and sharper focus. A low aperture results in a wide aperture which lets in more light resulting in a brighter, less-focused image. Default is appropriate for outdoors at daytime (i.e. for use with a default [DirectionalLight3D]), for indoor lighting, a value between 2 and 4 is more appropriate.  
         *  Only available when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled.  
         */
        get exposure_aperture(): float64
        set exposure_aperture(value: float64)
        
        /** Time for shutter to open and close, evaluated as `1 / shutter_speed` seconds. A higher value will allow less light (leading to a darker image), while a lower value will allow more light (leading to a brighter image).  
         *  Only available when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled.  
         */
        get exposure_shutter_speed(): float64
        set exposure_shutter_speed(value: float64)
        
        /** The minimum luminance luminance (in EV100) used when calculating auto exposure. When calculating scene average luminance, color values will be clamped to at least this value. This limits the auto-exposure from exposing above a certain brightness, resulting in a cut off point where the scene will remain dark. */
        get auto_exposure_min_exposure_value(): float64
        set auto_exposure_min_exposure_value(value: float64)
        
        /** The maximum luminance (in EV100) used when calculating auto exposure. When calculating scene average luminance, color values will be clamped to at least this value. This limits the auto-exposure from exposing below a certain brightness, resulting in a cut off point where the scene will remain bright. */
        get auto_exposure_max_exposure_value(): float64
        set auto_exposure_max_exposure_value(value: float64)
    }
    /** Camera settings in an easy to use format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cameraattributespractical.html  
     */
    class CameraAttributesPractical extends CameraAttributes {
        constructor(identifier?: any)
        /** Enables depth of field blur for objects further than [member dof_blur_far_distance]. Strength of blur is controlled by [member dof_blur_amount] and modulated by [member dof_blur_far_transition].  
         *      
         *  **Note:** Depth of field blur is only supported in the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        get dof_blur_far_enabled(): boolean
        set dof_blur_far_enabled(value: boolean)
        
        /** Objects further from the [Camera3D] by this amount will be blurred by the depth of field effect. Measured in meters. */
        get dof_blur_far_distance(): float64
        set dof_blur_far_distance(value: float64)
        
        /** When positive, distance over which (starting from [member dof_blur_far_distance]) blur effect will scale from 0 to [member dof_blur_amount]. When negative, uses physically-based scaling so depth of field effect will scale from 0 at [member dof_blur_far_distance] and will increase in a physically accurate way as objects get further from the [Camera3D]. */
        get dof_blur_far_transition(): float64
        set dof_blur_far_transition(value: float64)
        
        /** Enables depth of field blur for objects closer than [member dof_blur_near_distance]. Strength of blur is controlled by [member dof_blur_amount] and modulated by [member dof_blur_near_transition].  
         *      
         *  **Note:** Depth of field blur is only supported in the Forward+ and Mobile rendering methods, not Compatibility.  
         */
        get dof_blur_near_enabled(): boolean
        set dof_blur_near_enabled(value: boolean)
        
        /** Objects closer from the [Camera3D] by this amount will be blurred by the depth of field effect. Measured in meters. */
        get dof_blur_near_distance(): float64
        set dof_blur_near_distance(value: float64)
        
        /** When positive, distance over which blur effect will scale from 0 to [member dof_blur_amount], ending at [member dof_blur_near_distance]. When negative, uses physically-based scaling so depth of field effect will scale from 0 at [member dof_blur_near_distance] and will increase in a physically accurate way as objects get closer to the [Camera3D]. */
        get dof_blur_near_transition(): float64
        set dof_blur_near_transition(value: float64)
        
        /** Sets the maximum amount of blur. When using physically-based blur amounts, will instead act as a multiplier. High values lead to an increased amount of blurriness, but can be much more expensive to calculate. It is best to keep this as low as possible for a given art style. */
        get dof_blur_amount(): float64
        set dof_blur_amount(value: float64)
        
        /** The minimum sensitivity (in ISO) used when calculating auto exposure. When calculating scene average luminance, color values will be clamped to at least this value. This limits the auto-exposure from exposing above a certain brightness, resulting in a cut off point where the scene will remain dark. */
        get auto_exposure_min_sensitivity(): float64
        set auto_exposure_min_sensitivity(value: float64)
        
        /** The maximum sensitivity (in ISO) used when calculating auto exposure. When calculating scene average luminance, color values will be clamped to at least this value. This limits the auto-exposure from exposing below a certain brightness, resulting in a cut off point where the scene will remain bright. */
        get auto_exposure_max_sensitivity(): float64
        set auto_exposure_max_sensitivity(value: float64)
    }
    namespace CameraFeed {
        enum FeedDataType {
            /** No image set for the feed. */
            FEED_NOIMAGE = 0,
            
            /** Feed supplies RGB images. */
            FEED_RGB = 1,
            
            /** Feed supplies YCbCr images that need to be converted to RGB. */
            FEED_YCBCR = 2,
            
            /** Feed supplies separate Y and CbCr images that need to be combined and converted to RGB. */
            FEED_YCBCR_SEP = 3,
        }
        enum FeedPosition {
            /** Unspecified position. */
            FEED_UNSPECIFIED = 0,
            
            /** Camera is mounted at the front of the device. */
            FEED_FRONT = 1,
            
            /** Camera is mounted at the back of the device. */
            FEED_BACK = 2,
        }
    }
    /** A camera feed gives you access to a single physical camera attached to your device.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_camerafeed.html  
     */
    class CameraFeed extends RefCounted {
        constructor(identifier?: any)
        /** Returns the unique ID for this feed. */
        get_id(): int64
        
        /** Returns the camera's name. */
        get_name(): string
        _set_name(name: string): void
        
        /** Returns the position of camera on the device. */
        get_position(): CameraFeed.FeedPosition
        _set_position(position: CameraFeed.FeedPosition): void
        _set_RGB_img(rgb_img: Image): void
        _set_YCbCr_img(ycbcr_img: Image): void
        
        /** Returns feed image data type. */
        get_datatype(): CameraFeed.FeedDataType
        
        /** If `true`, the feed is active. */
        get feed_is_active(): boolean
        set feed_is_active(value: boolean)
        
        /** The transform applied to the camera's image. */
        get feed_transform(): Transform2D
        set feed_transform(value: Transform2D)
    }
    /** Texture provided by a [CameraFeed].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cameratexture.html  
     */
    class CameraTexture extends Texture2D {
        constructor(identifier?: any)
        /** The ID of the [CameraFeed] for which we want to display the image. */
        get camera_feed_id(): int64
        set camera_feed_id(value: int64)
        
        /** Which image within the [CameraFeed] we want access to, important if the camera image is split in a Y and CbCr component. */
        get which_feed(): int64
        set which_feed(value: int64)
        
        /** Convenience property that gives access to the active property of the [CameraFeed]. */
        get camera_is_active(): boolean
        set camera_is_active(value: boolean)
    }
    /** Merges several 2D nodes into a single draw operation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_canvasgroup.html  
     */
    class CanvasGroup extends Node2D {
        constructor(identifier?: any)
        /** Sets the size of a margin used to expand the drawable rect of this [CanvasGroup]. The size of the [CanvasGroup] is determined by fitting a rect around its children then expanding that rect by [member fit_margin]. This increases both the backbuffer area used and the area covered by the [CanvasGroup] both of which can reduce performance. This should be kept as small as possible and should only be expanded when an increased size is needed (e.g. for custom shader effects). */
        get fit_margin(): float64
        set fit_margin(value: float64)
        
        /** Sets the size of the margin used to expand the clearing rect of this [CanvasGroup]. This expands the area of the backbuffer that will be used by the [CanvasGroup]. A smaller margin will reduce the area of the backbuffer used which can increase performance, however if [member use_mipmaps] is enabled, a small margin may result in mipmap errors at the edge of the [CanvasGroup]. Accordingly, this should be left as small as possible, but should be increased if artifacts appear along the edges of the canvas group. */
        get clear_margin(): float64
        set clear_margin(value: float64)
        
        /** If `true`, calculates mipmaps for the backbuffer before drawing the [CanvasGroup] so that mipmaps can be used in a custom [ShaderMaterial] attached to the [CanvasGroup]. Generating mipmaps has a performance cost so this should not be enabled unless required. */
        get use_mipmaps(): boolean
        set use_mipmaps(value: boolean)
    }
    namespace CanvasItem {
        enum TextureFilter {
            /** The [CanvasItem] will inherit the filter from its parent. */
            TEXTURE_FILTER_PARENT_NODE = 0,
            
            /** The texture filter reads from the nearest pixel only. This makes the texture look pixelated from up close, and grainy from a distance (due to mipmaps not being sampled). */
            TEXTURE_FILTER_NEAREST = 1,
            
            /** The texture filter blends between the nearest 4 pixels. This makes the texture look smooth from up close, and grainy from a distance (due to mipmaps not being sampled). */
            TEXTURE_FILTER_LINEAR = 2,
            
            /** The texture filter reads from the nearest pixel and blends between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look pixelated from up close, and smooth from a distance.  
             *  Use this for non-pixel art textures that may be viewed at a low scale (e.g. due to [Camera2D] zoom or sprite scaling), as mipmaps are important to smooth out pixels that are smaller than on-screen pixels.  
             */
            TEXTURE_FILTER_NEAREST_WITH_MIPMAPS = 3,
            
            /** The texture filter blends between the nearest 4 pixels and between the nearest 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`). This makes the texture look smooth from up close, and smooth from a distance.  
             *  Use this for non-pixel art textures that may be viewed at a low scale (e.g. due to [Camera2D] zoom or sprite scaling), as mipmaps are important to smooth out pixels that are smaller than on-screen pixels.  
             */
            TEXTURE_FILTER_LINEAR_WITH_MIPMAPS = 4,
            
            /** The texture filter reads from the nearest pixel and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look pixelated from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level].  
             *      
             *  **Note:** This texture filter is rarely useful in 2D projects. [constant TEXTURE_FILTER_NEAREST_WITH_MIPMAPS] is usually more appropriate in this case.  
             */
            TEXTURE_FILTER_NEAREST_WITH_MIPMAPS_ANISOTROPIC = 5,
            
            /** The texture filter blends between the nearest 4 pixels and blends between 2 mipmaps (or uses the nearest mipmap if [member ProjectSettings.rendering/textures/default_filters/use_nearest_mipmap_filter] is `true`) based on the angle between the surface and the camera view. This makes the texture look smooth from up close, and smooth from a distance. Anisotropic filtering improves texture quality on surfaces that are almost in line with the camera, but is slightly slower. The anisotropic filtering level can be changed by adjusting [member ProjectSettings.rendering/textures/default_filters/anisotropic_filtering_level].  
             *      
             *  **Note:** This texture filter is rarely useful in 2D projects. [constant TEXTURE_FILTER_LINEAR_WITH_MIPMAPS] is usually more appropriate in this case.  
             */
            TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC = 6,
            
            /** Represents the size of the [enum TextureFilter] enum. */
            TEXTURE_FILTER_MAX = 7,
        }
        enum TextureRepeat {
            /** The [CanvasItem] will inherit the filter from its parent. */
            TEXTURE_REPEAT_PARENT_NODE = 0,
            
            /** Texture will not repeat. */
            TEXTURE_REPEAT_DISABLED = 1,
            
            /** Texture will repeat normally. */
            TEXTURE_REPEAT_ENABLED = 2,
            
            /** Texture will repeat in a 2×2 tiled mode, where elements at even positions are mirrored. */
            TEXTURE_REPEAT_MIRROR = 3,
            
            /** Represents the size of the [enum TextureRepeat] enum. */
            TEXTURE_REPEAT_MAX = 4,
        }
        enum ClipChildrenMode {
            /** Child draws over parent and is not clipped. */
            CLIP_CHILDREN_DISABLED = 0,
            
            /** Parent is used for the purposes of clipping only. Child is clipped to the parent's visible area, parent is not drawn. */
            CLIP_CHILDREN_ONLY = 1,
            
            /** Parent is used for clipping child, but parent is also drawn underneath child as normal before clipping child to its visible area. */
            CLIP_CHILDREN_AND_DRAW = 2,
            
            /** Represents the size of the [enum ClipChildrenMode] enum. */
            CLIP_CHILDREN_MAX = 3,
        }
    }
    /** Abstract base class for everything in 2D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_canvasitem.html  
     */
    class CanvasItem extends Node {
        /** The [CanvasItem]'s global transform has changed. This notification is only received if enabled by [method set_notify_transform]. */
        static readonly NOTIFICATION_TRANSFORM_CHANGED = 2000
        
        /** The [CanvasItem]'s local transform has changed. This notification is only received if enabled by [method set_notify_local_transform]. */
        static readonly NOTIFICATION_LOCAL_TRANSFORM_CHANGED = 35
        
        /** The [CanvasItem] is requested to draw (see [method _draw]). */
        static readonly NOTIFICATION_DRAW = 30
        
        /** The [CanvasItem]'s visibility has changed. */
        static readonly NOTIFICATION_VISIBILITY_CHANGED = 31
        
        /** The [CanvasItem] has entered the canvas. */
        static readonly NOTIFICATION_ENTER_CANVAS = 32
        
        /** The [CanvasItem] has exited the canvas. */
        static readonly NOTIFICATION_EXIT_CANVAS = 33
        
        /** The [CanvasItem]'s active [World2D] changed. */
        static readonly NOTIFICATION_WORLD_2D_CHANGED = 36
        constructor(identifier?: any)
        
        /** Called when [CanvasItem] has been requested to redraw (after [method queue_redraw] is called, either manually or by the engine).  
         *  Corresponds to the [constant NOTIFICATION_DRAW] notification in [method Object._notification].  
         */
        /* gdvirtual */ _draw(): void
        _top_level_raise_self(): void
        _edit_set_state(state: GDictionary): void
        _edit_get_state(): GDictionary
        _edit_set_position(position: Vector2): void
        _edit_get_position(): Vector2
        _edit_set_scale(scale: Vector2): void
        _edit_get_scale(): Vector2
        _edit_set_rect(rect: Rect2): void
        _edit_get_rect(): Rect2
        _edit_use_rect(): boolean
        _edit_set_rotation(degrees: float64): void
        _edit_get_rotation(): float64
        _edit_use_rotation(): boolean
        _edit_set_pivot(pivot: Vector2): void
        _edit_get_pivot(): Vector2
        _edit_use_pivot(): boolean
        _edit_get_transform(): Transform2D
        
        /** Returns the canvas item RID used by [RenderingServer] for this item. */
        get_canvas_item(): RID
        
        /** Returns `true` if the node is present in the [SceneTree], its [member visible] property is `true` and all its ancestors are also visible. If any ancestor is hidden, this node will not be visible in the scene tree, and is therefore not drawn (see [method _draw]).  
         *  Visibility is checked only in parent nodes that inherit from [CanvasItem], [CanvasLayer], and [Window]. If the parent is of any other type (such as [Node], [AnimationPlayer], or [Node3D]), it is assumed to be visible.  
         */
        is_visible_in_tree(): boolean
        
        /** Show the [CanvasItem] if it's currently hidden. This is equivalent to setting [member visible] to `true`. For controls that inherit [Popup], the correct way to make them visible is to call one of the multiple `popup*()` functions instead. */
        show(): void
        
        /** Hide the [CanvasItem] if it's currently visible. This is equivalent to setting [member visible] to `false`. */
        hide(): void
        
        /** Queues the [CanvasItem] to redraw. During idle time, if [CanvasItem] is visible, [constant NOTIFICATION_DRAW] is sent and [method _draw] is called. This only occurs **once** per frame, even if this method has been called multiple times. */
        queue_redraw(): void
        
        /** Moves this node to display on top of its siblings.  
         *  Internally, the node is moved to the bottom of parent's child list. The method has no effect on nodes without a parent.  
         */
        move_to_front(): void
        
        /** Draws a line from a 2D point to another, with a given color and width. It can be optionally antialiased. See also [method draw_multiline] and [method draw_polyline].  
         *  If [param width] is negative, then a two-point primitive will be drawn instead of a four-point one. This means that when the CanvasItem is scaled, the line will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         */
        draw_line(from: Vector2, to: Vector2, color: Color, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws a dashed line from a 2D point to another, with a given color and width. See also [method draw_multiline] and [method draw_polyline].  
         *  If [param width] is negative, then a two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the line parts will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *  If [param antialiased] is `true`, half transparent "feathers" will be attached to the boundary, making outlines smooth.  
         *      
         *  **Note:** [param antialiased] is only effective if [param width] is greater than `0.0`.  
         */
        draw_dashed_line(from: Vector2, to: Vector2, color: Color, width: float64 = -1, dash: float64 = 2, aligned: boolean = true, antialiased: boolean = false): void
        
        /** Draws interconnected line segments with a uniform [param color] and [param width] and optional antialiasing (supported only for positive [param width]). When drawing large amounts of lines, this is faster than using individual [method draw_line] calls. To draw disconnected lines, use [method draw_multiline] instead. See also [method draw_polygon].  
         *  If [param width] is negative, it will be ignored and the polyline will be drawn using [constant RenderingServer.PRIMITIVE_LINE_STRIP]. This means that when the CanvasItem is scaled, the polyline will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         */
        draw_polyline(points: PackedVector2Array | Vector2[], color: Color, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws interconnected line segments with a uniform [param width], point-by-point coloring, and optional antialiasing (supported only for positive [param width]). Colors assigned to line points match by index between [param points] and [param colors], i.e. each line segment is filled with a gradient between the colors of the endpoints. When drawing large amounts of lines, this is faster than using individual [method draw_line] calls. To draw disconnected lines, use [method draw_multiline_colors] instead. See also [method draw_polygon].  
         *  If [param width] is negative, it will be ignored and the polyline will be drawn using [constant RenderingServer.PRIMITIVE_LINE_STRIP]. This means that when the CanvasItem is scaled, the polyline will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         */
        draw_polyline_colors(points: PackedVector2Array | Vector2[], colors: PackedColorArray | Color[], width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws an unfilled arc between the given angles with a uniform [param color] and [param width] and optional antialiasing (supported only for positive [param width]). The larger the value of [param point_count], the smoother the curve. See also [method draw_circle].  
         *  If [param width] is negative, it will be ignored and the arc will be drawn using [constant RenderingServer.PRIMITIVE_LINE_STRIP]. This means that when the CanvasItem is scaled, the arc will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *  The arc is drawn from [param start_angle] towards the value of [param end_angle] so in clockwise direction if `start_angle < end_angle` and counter-clockwise otherwise. Passing the same angles but in reversed order will produce the same arc. If absolute difference of [param start_angle] and [param end_angle] is greater than [constant @GDScript.TAU] radians, then a full circle arc is drawn (i.e. arc will not overlap itself).  
         */
        draw_arc(center: Vector2, radius: float64, start_angle: float64, end_angle: float64, point_count: int64, color: Color, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws multiple disconnected lines with a uniform [param width] and [param color]. Each line is defined by two consecutive points from [param points] array, i.e. i-th segment consists of `points[2 * i]`, `points[2 * i + 1]` endpoints. When drawing large amounts of lines, this is faster than using individual [method draw_line] calls. To draw interconnected lines, use [method draw_polyline] instead.  
         *  If [param width] is negative, then two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the lines will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *      
         *  **Note:** [param antialiased] is only effective if [param width] is greater than `0.0`.  
         */
        draw_multiline(points: PackedVector2Array | Vector2[], color: Color, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws multiple disconnected lines with a uniform [param width] and segment-by-segment coloring. Each segment is defined by two consecutive points from [param points] array and a corresponding color from [param colors] array, i.e. i-th segment consists of `points[2 * i]`, `points[2 * i + 1]` endpoints and has `colors *` color. When drawing large amounts of lines, this is faster than using individual [method draw_line] calls. To draw interconnected lines, use [method draw_polyline_colors] instead.  
         *  If [param width] is negative, then two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the lines will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *      
         *  **Note:** [param antialiased] is only effective if [param width] is greater than `0.0`.  
         */
        draw_multiline_colors(points: PackedVector2Array | Vector2[], colors: PackedColorArray | Color[], width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws a rectangle. If [param filled] is `true`, the rectangle will be filled with the [param color] specified. If [param filled] is `false`, the rectangle will be drawn as a stroke with the [param color] and [param width] specified. See also [method draw_texture_rect].  
         *  If [param width] is negative, then two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the lines will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *  If [param antialiased] is `true`, half transparent "feathers" will be attached to the boundary, making outlines smooth.  
         *      
         *  **Note:** [param width] is only effective if [param filled] is `false`.  
         *      
         *  **Note:** Unfilled rectangles drawn with a negative [param width] may not display perfectly. For example, corners may be missing or brighter due to overlapping lines (for a translucent [param color]).  
         */
        draw_rect(rect: Rect2, color: Color, filled: boolean = true, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws a circle. See also [method draw_arc], [method draw_polyline], and [method draw_polygon].  
         *  If [param filled] is `true`, the circle will be filled with the [param color] specified. If [param filled] is `false`, the circle will be drawn as a stroke with the [param color] and [param width] specified.  
         *  If [param width] is negative, then two-point primitives will be drawn instead of a four-point ones. This means that when the CanvasItem is scaled, the lines will remain thin. If this behavior is not desired, then pass a positive [param width] like `1.0`.  
         *  If [param antialiased] is `true`, half transparent "feathers" will be attached to the boundary, making outlines smooth.  
         *      
         *  **Note:** [param width] is only effective if [param filled] is `false`.  
         */
        draw_circle(position: Vector2, radius: float64, color: Color, filled: boolean = true, width: float64 = -1, antialiased: boolean = false): void
        
        /** Draws a texture at a given position. */
        draw_texture(texture: Texture2D, position: Vector2, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a textured rectangle at a given position, optionally modulated by a color. If [param transpose] is `true`, the texture will have its X and Y coordinates swapped. See also [method draw_rect] and [method draw_texture_rect_region]. */
        draw_texture_rect(texture: Texture2D, rect: Rect2, tile: boolean, modulate: Color = new Color(1, 1, 1, 1), transpose: boolean = false): void
        
        /** Draws a textured rectangle from a texture's region (specified by [param src_rect]) at a given position, optionally modulated by a color. If [param transpose] is `true`, the texture will have its X and Y coordinates swapped. See also [method draw_texture_rect]. */
        draw_texture_rect_region(texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = new Color(1, 1, 1, 1), transpose: boolean = false, clip_uv: boolean = true): void
        
        /** Draws a textured rectangle region of the multi-channel signed distance field texture at a given position, optionally modulated by a color. See [member FontFile.multichannel_signed_distance_field] for more information and caveats about MSDF font rendering.  
         *  If [param outline] is positive, each alpha channel value of pixel in region is set to maximum value of true distance in the [param outline] radius.  
         *  Value of the [param pixel_range] should the same that was used during distance field texture generation.  
         */
        draw_msdf_texture_rect_region(texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = new Color(1, 1, 1, 1), outline: float64 = 0, pixel_range: float64 = 4, scale: float64 = 1): void
        
        /** Draws a textured rectangle region of the font texture with LCD subpixel anti-aliasing at a given position, optionally modulated by a color.  
         *  Texture is drawn using the following blend operation, blend mode of the [CanvasItemMaterial] is ignored:  
         *    
         */
        draw_lcd_texture_rect_region(texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a styled rectangle. */
        draw_style_box(style_box: StyleBox, rect: Rect2): void
        
        /** Draws a custom primitive. 1 point for a point, 2 points for a line, 3 points for a triangle, and 4 points for a quad. If 0 points or more than 4 points are specified, nothing will be drawn and an error message will be printed. See also [method draw_line], [method draw_polyline], [method draw_polygon], and [method draw_rect]. */
        draw_primitive(points: PackedVector2Array | Vector2[], colors: PackedColorArray | Color[], uvs: PackedVector2Array | Vector2[], texture: Texture2D = undefined): void
        
        /** Draws a solid polygon of any number of points, convex or concave. Unlike [method draw_colored_polygon], each point's color can be changed individually. See also [method draw_polyline] and [method draw_polyline_colors]. If you need more flexibility (such as being able to use bones), use [method RenderingServer.canvas_item_add_triangle_array] instead. */
        draw_polygon(points: PackedVector2Array | Vector2[], colors: PackedColorArray | Color[], uvs: PackedVector2Array | Vector2[] = [], texture: Texture2D = undefined): void
        
        /** Draws a colored polygon of any number of points, convex or concave. Unlike [method draw_polygon], a single color must be specified for the whole polygon. */
        draw_colored_polygon(points: PackedVector2Array | Vector2[], color: Color, uvs: PackedVector2Array | Vector2[] = [], texture: Texture2D = undefined): void
        
        /** Draws [param text] using the specified [param font] at the [param pos] (bottom-left corner using the baseline of the font). The text will have its color multiplied by [param modulate]. If [param width] is greater than or equal to 0, the text will be clipped if it exceeds the specified width.  
         *  **Example using the default project font:**  
         *    
         *  See also [method Font.draw_string].  
         */
        draw_string(font: Font, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, modulate: Color = new Color(1, 1, 1, 1), justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Breaks [param text] into lines and draws it using the specified [param font] at the [param pos] (top-left corner). The text will have its color multiplied by [param modulate]. If [param width] is greater than or equal to 0, the text will be clipped if it exceeds the specified width. */
        draw_multiline_string(font: Font, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, max_lines: int64 = -1, modulate: Color = new Color(1, 1, 1, 1), brk_flags: TextServer.LineBreakFlag = 3, justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Draws [param text] outline using the specified [param font] at the [param pos] (bottom-left corner using the baseline of the font). The text will have its color multiplied by [param modulate]. If [param width] is greater than or equal to 0, the text will be clipped if it exceeds the specified width. */
        draw_string_outline(font: Font, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, size: int64 = 1, modulate: Color = new Color(1, 1, 1, 1), justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Breaks [param text] to the lines and draws text outline using the specified [param font] at the [param pos] (top-left corner). The text will have its color multiplied by [param modulate]. If [param width] is greater than or equal to 0, the text will be clipped if it exceeds the specified width. */
        draw_multiline_string_outline(font: Font, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, max_lines: int64 = -1, size: int64 = 1, modulate: Color = new Color(1, 1, 1, 1), brk_flags: TextServer.LineBreakFlag = 3, justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Draws a string first character using a custom font. */
        draw_char(font: Font, pos: Vector2, char: string, font_size: int64 = 16, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a string first character outline using a custom font. */
        draw_char_outline(font: Font, pos: Vector2, char: string, font_size: int64 = 16, size: int64 = -1, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a [Mesh] in 2D, using the provided texture. See [MeshInstance2D] for related documentation. */
        draw_mesh(mesh: Mesh, texture: Texture2D, transform: Transform2D = new Transform2D(), modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Draws a [MultiMesh] in 2D with the provided texture. See [MultiMeshInstance2D] for related documentation. */
        draw_multimesh(multimesh: MultiMesh, texture: Texture2D): void
        
        /** Sets a custom transform for drawing via components. Anything drawn afterwards will be transformed by this.  
         *      
         *  **Note:** [member FontFile.oversampling] does  *not*  take [param scale] into account. This means that scaling up/down will cause bitmap fonts and rasterized (non-MSDF) dynamic fonts to appear blurry or pixelated. To ensure text remains crisp regardless of scale, you can enable MSDF font rendering by enabling [member ProjectSettings.gui/theme/default_font_multichannel_signed_distance_field] (applies to the default project font only), or enabling **Multichannel Signed Distance Field** in the import options of a DynamicFont for custom fonts. On system fonts, [member SystemFont.multichannel_signed_distance_field] can be enabled in the inspector.  
         */
        draw_set_transform(position: Vector2, rotation: float64 = 0, scale: Vector2 = Vector2.ONE): void
        
        /** Sets a custom transform for drawing via matrix. Anything drawn afterwards will be transformed by this. */
        draw_set_transform_matrix(xform: Transform2D): void
        
        /** Subsequent drawing commands will be ignored unless they fall within the specified animation slice. This is a faster way to implement animations that loop on background rather than redrawing constantly. */
        draw_animation_slice(animation_length: float64, slice_begin: float64, slice_end: float64, offset: float64 = 0): void
        
        /** After submitting all animations slices via [method draw_animation_slice], this function can be used to revert drawing to its default state (all subsequent drawing commands will be visible). If you don't care about this particular use case, usage of this function after submitting the slices is not required. */
        draw_end_animation(): void
        
        /** Returns the transform matrix of this item. */
        get_transform(): Transform2D
        
        /** Returns the global transform matrix of this item, i.e. the combined transform up to the topmost [CanvasItem] node. The topmost item is a [CanvasItem] that either has no parent, has non-[CanvasItem] parent or it has [member top_level] enabled. */
        get_global_transform(): Transform2D
        
        /** Returns the transform from the local coordinate system of this [CanvasItem] to the [Viewport]s coordinate system. */
        get_global_transform_with_canvas(): Transform2D
        
        /** Returns the transform from the coordinate system of the canvas, this item is in, to the [Viewport]s embedders coordinate system. */
        get_viewport_transform(): Transform2D
        
        /** Returns the viewport's boundaries as a [Rect2]. */
        get_viewport_rect(): Rect2
        
        /** Returns the transform from the coordinate system of the canvas, this item is in, to the [Viewport]s coordinate system. */
        get_canvas_transform(): Transform2D
        
        /** Returns the transform of this [CanvasItem] in global screen coordinates (i.e. taking window position into account). Mostly useful for editor plugins.  
         *  Equals to [method get_global_transform] if the window is embedded (see [member Viewport.gui_embed_subwindows]).  
         */
        get_screen_transform(): Transform2D
        
        /** Returns the mouse's position in this [CanvasItem] using the local coordinate system of this [CanvasItem]. */
        get_local_mouse_position(): Vector2
        
        /** Returns the mouse's position in the [CanvasLayer] that this [CanvasItem] is in using the coordinate system of the [CanvasLayer].  
         *      
         *  **Note:** For screen-space coordinates (e.g. when using a non-embedded [Popup]), you can use [method DisplayServer.mouse_get_position].  
         */
        get_global_mouse_position(): Vector2
        
        /** Returns the [RID] of the [World2D] canvas where this item is in. */
        get_canvas(): RID
        
        /** Returns the [CanvasLayer] that contains this node, or `null` if the node is not in any [CanvasLayer]. */
        get_canvas_layer_node(): CanvasLayer
        
        /** Returns the [World2D] where this item is in. */
        get_world_2d(): World2D
        
        /** If [param enable] is `true`, this node will receive [constant NOTIFICATION_LOCAL_TRANSFORM_CHANGED] when its local transform changes. */
        set_notify_local_transform(enable: boolean): void
        
        /** Returns `true` if local transform notifications are communicated to children. */
        is_local_transform_notification_enabled(): boolean
        
        /** If [param enable] is `true`, this node will receive [constant NOTIFICATION_TRANSFORM_CHANGED] when its global transform changes. */
        set_notify_transform(enable: boolean): void
        
        /** Returns `true` if global transform notifications are communicated to children. */
        is_transform_notification_enabled(): boolean
        
        /** Forces the transform to update. Transform changes in physics are not instant for performance reasons. Transforms are accumulated and then set. Use this if you need an up-to-date transform when doing physics operations. */
        force_update_transform(): void
        
        /** Assigns [param screen_point] as this node's new local transform. */
        make_canvas_position_local(screen_point: Vector2): Vector2
        
        /** Transformations issued by [param event]'s inputs are applied in local space instead of global space. */
        make_input_local(event: InputEvent): InputEvent
        
        /** Set/clear individual bits on the rendering visibility layer. This simplifies editing this [CanvasItem]'s visibility layer. */
        set_visibility_layer_bit(layer: int64, enabled: boolean): void
        
        /** Returns an individual bit on the rendering visibility layer. */
        get_visibility_layer_bit(layer: int64): boolean
        
        /** If `true`, this [CanvasItem] is drawn. The node is only visible if all of its ancestors are visible as well (in other words, [method is_visible_in_tree] must return `true`).  
         *      
         *  **Note:** For controls that inherit [Popup], the correct way to make them visible is to call one of the multiple `popup*()` functions instead.  
         */
        get visible(): boolean
        set visible(value: boolean)
        
        /** The color applied to this [CanvasItem]. This property does affect child [CanvasItem]s, unlike [member self_modulate] which only affects the node itself. */
        get modulate(): Color
        set modulate(value: Color)
        
        /** The color applied to this [CanvasItem]. This property does **not** affect child [CanvasItem]s, unlike [member modulate] which affects both the node itself and its children.  
         *      
         *  **Note:** Internal children (e.g. sliders in [ColorPicker] or tab bar in [TabContainer]) are also not affected by this property (see `include_internal` parameter of [method Node.get_child] and other similar methods).  
         */
        get self_modulate(): Color
        set self_modulate(value: Color)
        
        /** If `true`, the object draws behind its parent. */
        get show_behind_parent(): boolean
        set show_behind_parent(value: boolean)
        
        /** If `true`, this [CanvasItem] will  *not*  inherit its transform from parent [CanvasItem]s. Its draw order will also be changed to make it draw on top of other [CanvasItem]s that do not have [member top_level] set to `true`. The [CanvasItem] will effectively act as if it was placed as a child of a bare [Node]. */
        get top_level(): boolean
        set top_level(value: boolean)
        
        /** Allows the current node to clip child nodes, essentially acting as a mask. */
        get clip_children(): int64
        set clip_children(value: int64)
        
        /** The rendering layers in which this [CanvasItem] responds to [Light2D] nodes. */
        get light_mask(): int64
        set light_mask(value: int64)
        
        /** The rendering layer in which this [CanvasItem] is rendered by [Viewport] nodes. A [Viewport] will render a [CanvasItem] if it and all its parents share a layer with the [Viewport]'s canvas cull mask. */
        get visibility_layer(): int64
        set visibility_layer(value: int64)
        
        /** Controls the order in which the nodes render. A node with a higher Z index will display in front of others. Must be between [constant RenderingServer.CANVAS_ITEM_Z_MIN] and [constant RenderingServer.CANVAS_ITEM_Z_MAX] (inclusive).  
         *      
         *  **Note:** Changing the Z index of a [Control] only affects the drawing order, not the order in which input events are handled. This can be useful to implement certain UI animations, e.g. a menu where hovered items are scaled and should overlap others.  
         */
        get z_index(): int64
        set z_index(value: int64)
        
        /** If `true`, the node's Z index is relative to its parent's Z index. If this node's Z index is 2 and its parent's effective Z index is 3, then this node's effective Z index will be 2 + 3 = 5. */
        get z_as_relative(): boolean
        set z_as_relative(value: boolean)
        
        /** If `true`, this and child [CanvasItem] nodes with a higher Y position are rendered in front of nodes with a lower Y position. If `false`, this and child [CanvasItem] nodes are rendered normally in scene tree order.  
         *  With Y-sorting enabled on a parent node ('A') but disabled on a child node ('B'), the child node ('B') is sorted but its children ('C1', 'C2', etc) render together on the same Y position as the child node ('B'). This allows you to organize the render order of a scene without changing the scene tree.  
         *  Nodes sort relative to each other only if they are on the same [member z_index].  
         */
        get y_sort_enabled(): boolean
        set y_sort_enabled(value: boolean)
        
        /** The texture filtering mode to use on this [CanvasItem]. */
        get texture_filter(): int64
        set texture_filter(value: int64)
        
        /** The texture repeating mode to use on this [CanvasItem]. */
        get texture_repeat(): int64
        set texture_repeat(value: int64)
        
        /** The material applied to this [CanvasItem]. */
        get material(): CanvasItemMaterial | ShaderMaterial
        set material(value: CanvasItemMaterial | ShaderMaterial)
        
        /** If `true`, the parent [CanvasItem]'s [member material] property is used as this one's material. */
        get use_parent_material(): boolean
        set use_parent_material(value: boolean)
        
        /** Emitted when the [CanvasItem] must redraw,  *after*  the related [constant NOTIFICATION_DRAW] notification, and  *before*  [method _draw] is called.  
         *      
         *  **Note:** Deferred connections do not allow drawing through the `draw_*` methods.  
         */
        readonly draw: Signal0
        
        /** Emitted when the visibility (hidden/visible) changes. */
        readonly visibility_changed: Signal0
        
        /** Emitted when becoming hidden. */
        readonly hidden: Signal0
        
        /** Emitted when the item's [Rect2] boundaries (position or size) have changed, or when an action is taking place that may have impacted these boundaries (e.g. changing [member Sprite2D.texture]). */
        readonly item_rect_changed: Signal0
    }
    class CanvasItemEditor extends VBoxContainer {
        constructor(identifier?: any)
        _get_editor_data(_unnamed_arg0: Object): Object
        update_viewport(): void
        center_at(position: Vector2): void
        _set_owner_for_node_and_children(_unnamed_arg0: Node, _unnamed_arg1: Node): void
        readonly item_lock_status_changed: Signal0
        readonly item_group_status_changed: Signal0
    }
    class CanvasItemEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    class CanvasItemEditorViewport extends Control {
        constructor(identifier?: any)
    }
    namespace CanvasItemMaterial {
        enum BlendMode {
            /** Mix blending mode. Colors are assumed to be independent of the alpha (opacity) value. */
            BLEND_MODE_MIX = 0,
            
            /** Additive blending mode. */
            BLEND_MODE_ADD = 1,
            
            /** Subtractive blending mode. */
            BLEND_MODE_SUB = 2,
            
            /** Multiplicative blending mode. */
            BLEND_MODE_MUL = 3,
            
            /** Mix blending mode. Colors are assumed to be premultiplied by the alpha (opacity) value. */
            BLEND_MODE_PREMULT_ALPHA = 4,
        }
        enum LightMode {
            /** Render the material using both light and non-light sensitive material properties. */
            LIGHT_MODE_NORMAL = 0,
            
            /** Render the material as if there were no light. */
            LIGHT_MODE_UNSHADED = 1,
            
            /** Render the material as if there were only light. */
            LIGHT_MODE_LIGHT_ONLY = 2,
        }
    }
    /** A material for [CanvasItem]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_canvasitemmaterial.html  
     */
    class CanvasItemMaterial extends Material {
        constructor(identifier?: any)
        /** The manner in which a material's rendering is applied to underlying textures. */
        get blend_mode(): int64
        set blend_mode(value: int64)
        
        /** The manner in which material reacts to lighting. */
        get light_mode(): int64
        set light_mode(value: int64)
        
        /** If `true`, enable spritesheet-based animation features when assigned to [GPUParticles2D] and [CPUParticles2D] nodes. The [member ParticleProcessMaterial.anim_speed_max] or [member CPUParticles2D.anim_speed_max] should also be set to a positive value for the animation to play.  
         *  This property (and other `particles_anim_*` properties that depend on it) has no effect on other types of nodes.  
         */
        get particles_animation(): boolean
        set particles_animation(value: boolean)
        
        /** The number of columns in the spritesheet assigned as [Texture2D] for a [GPUParticles2D] or [CPUParticles2D].  
         *      
         *  **Note:** This property is only used and visible in the editor if [member particles_animation] is `true`.  
         */
        get particles_anim_h_frames(): int64
        set particles_anim_h_frames(value: int64)
        
        /** The number of rows in the spritesheet assigned as [Texture2D] for a [GPUParticles2D] or [CPUParticles2D].  
         *      
         *  **Note:** This property is only used and visible in the editor if [member particles_animation] is `true`.  
         */
        get particles_anim_v_frames(): int64
        set particles_anim_v_frames(value: int64)
        
        /** If `true`, the particles animation will loop.  
         *      
         *  **Note:** This property is only used and visible in the editor if [member particles_animation] is `true`.  
         */
        get particles_anim_loop(): boolean
        set particles_anim_loop(value: boolean)
    }
    class CanvasItemMaterialConversionPlugin extends EditorResourceConversionPlugin {
        constructor(identifier?: any)
    }
    /** A node used for independent rendering of objects within a 2D scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_canvaslayer.html  
     */
    class CanvasLayer extends Node {
        constructor(identifier?: any)
        /** Shows any [CanvasItem] under this [CanvasLayer]. This is equivalent to setting [member visible] to `true`. */
        show(): void
        
        /** Hides any [CanvasItem] under this [CanvasLayer]. This is equivalent to setting [member visible] to `false`. */
        hide(): void
        
        /** Returns the transform from the [CanvasLayer]s coordinate system to the [Viewport]s coordinate system. */
        get_final_transform(): Transform2D
        
        /** Returns the RID of the canvas used by this layer. */
        get_canvas(): RID
        
        /** Layer index for draw order. Lower values are drawn behind higher values.  
         *      
         *  **Note:** If multiple CanvasLayers have the same layer index, [CanvasItem] children of one CanvasLayer are drawn behind the [CanvasItem] children of the other CanvasLayer. Which CanvasLayer is drawn in front is non-deterministic.  
         */
        get layer(): int64
        set layer(value: int64)
        
        /** If `false`, any [CanvasItem] under this [CanvasLayer] will be hidden.  
         *  Unlike [member CanvasItem.visible], visibility of a [CanvasLayer] isn't propagated to underlying layers.  
         */
        get visible(): boolean
        set visible(value: boolean)
        
        /** The layer's base offset. */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** The layer's rotation in radians. */
        get rotation(): float64
        set rotation(value: float64)
        
        /** The layer's scale. */
        get scale(): Vector2
        set scale(value: Vector2)
        
        /** The layer's transform. */
        get transform(): Transform2D
        set transform(value: Transform2D)
        
        /** The custom [Viewport] node assigned to the [CanvasLayer]. If `null`, uses the default viewport instead. */
        get custom_viewport(): Viewport
        set custom_viewport(value: Viewport)
        
        /** If enabled, the [CanvasLayer] will use the viewport's transform, so it will move when camera moves instead of being anchored in a fixed position on the screen.  
         *  Together with [member follow_viewport_scale] it can be used for a pseudo 3D effect.  
         */
        get follow_viewport_enabled(): boolean
        set follow_viewport_enabled(value: boolean)
        
        /** Scales the layer when using [member follow_viewport_enabled]. Layers moving into the foreground should have increasing scales, while layers moving into the background should have decreasing scales. */
        get follow_viewport_scale(): float64
        set follow_viewport_scale(value: float64)
        
        /** Emitted when visibility of the layer is changed. See [member visible]. */
        readonly visibility_changed: Signal0
    }
}
