// AUTO-GENERATED
/// <reference no-default-lib="true"/>
declare module "godot" {
    // _singleton_class_: PhysicsServer2D
    namespace PhysicsServer2D {
        enum SpaceParameter {
            /** Constant to set/get the maximum distance a pair of bodies has to move before their collision status has to be recalculated. The default value of this parameter is [member ProjectSettings.physics/2d/solver/contact_recycle_radius]. */
            SPACE_PARAM_CONTACT_RECYCLE_RADIUS = 0,
            
            /** Constant to set/get the maximum distance a shape can be from another before they are considered separated and the contact is discarded. The default value of this parameter is [member ProjectSettings.physics/2d/solver/contact_max_separation]. */
            SPACE_PARAM_CONTACT_MAX_SEPARATION = 1,
            
            /** Constant to set/get the maximum distance a shape can penetrate another shape before it is considered a collision. The default value of this parameter is [member ProjectSettings.physics/2d/solver/contact_max_allowed_penetration]. */
            SPACE_PARAM_CONTACT_MAX_ALLOWED_PENETRATION = 2,
            
            /** Constant to set/get the default solver bias for all physics contacts. A solver bias is a factor controlling how much two objects "rebound", after overlapping, to avoid leaving them in that state because of numerical imprecision. The default value of this parameter is [member ProjectSettings.physics/2d/solver/default_contact_bias]. */
            SPACE_PARAM_CONTACT_DEFAULT_BIAS = 3,
            
            /** Constant to set/get the threshold linear velocity of activity. A body marked as potentially inactive for both linear and angular velocity will be put to sleep after the time given. The default value of this parameter is [member ProjectSettings.physics/2d/sleep_threshold_linear]. */
            SPACE_PARAM_BODY_LINEAR_VELOCITY_SLEEP_THRESHOLD = 4,
            
            /** Constant to set/get the threshold angular velocity of activity. A body marked as potentially inactive for both linear and angular velocity will be put to sleep after the time given. The default value of this parameter is [member ProjectSettings.physics/2d/sleep_threshold_angular]. */
            SPACE_PARAM_BODY_ANGULAR_VELOCITY_SLEEP_THRESHOLD = 5,
            
            /** Constant to set/get the maximum time of activity. A body marked as potentially inactive for both linear and angular velocity will be put to sleep after this time. The default value of this parameter is [member ProjectSettings.physics/2d/time_before_sleep]. */
            SPACE_PARAM_BODY_TIME_TO_SLEEP = 6,
            
            /** Constant to set/get the default solver bias for all physics constraints. A solver bias is a factor controlling how much two objects "rebound", after violating a constraint, to avoid leaving them in that state because of numerical imprecision. The default value of this parameter is [member ProjectSettings.physics/2d/solver/default_constraint_bias]. */
            SPACE_PARAM_CONSTRAINT_DEFAULT_BIAS = 7,
            
            /** Constant to set/get the number of solver iterations for all contacts and constraints. The greater the number of iterations, the more accurate the collisions will be. However, a greater number of iterations requires more CPU power, which can decrease performance. The default value of this parameter is [member ProjectSettings.physics/2d/solver/solver_iterations]. */
            SPACE_PARAM_SOLVER_ITERATIONS = 8,
        }
        enum ShapeType {
            /** This is the constant for creating world boundary shapes. A world boundary shape is an  *infinite*  line with an origin point, and a normal. Thus, it can be used for front/behind checks. */
            SHAPE_WORLD_BOUNDARY = 0,
            
            /** This is the constant for creating separation ray shapes. A separation ray is defined by a length and separates itself from what is touching its far endpoint. Useful for character controllers. */
            SHAPE_SEPARATION_RAY = 1,
            
            /** This is the constant for creating segment shapes. A segment shape is a  *finite*  line from a point A to a point B. It can be checked for intersections. */
            SHAPE_SEGMENT = 2,
            
            /** This is the constant for creating circle shapes. A circle shape only has a radius. It can be used for intersections and inside/outside checks. */
            SHAPE_CIRCLE = 3,
            
            /** This is the constant for creating rectangle shapes. A rectangle shape is defined by a width and a height. It can be used for intersections and inside/outside checks. */
            SHAPE_RECTANGLE = 4,
            
            /** This is the constant for creating capsule shapes. A capsule shape is defined by a radius and a length. It can be used for intersections and inside/outside checks. */
            SHAPE_CAPSULE = 5,
            
            /** This is the constant for creating convex polygon shapes. A polygon is defined by a list of points. It can be used for intersections and inside/outside checks. */
            SHAPE_CONVEX_POLYGON = 6,
            
            /** This is the constant for creating concave polygon shapes. A polygon is defined by a list of points. It can be used for intersections checks, but not for inside/outside checks. */
            SHAPE_CONCAVE_POLYGON = 7,
            
            /** This constant is used internally by the engine. Any attempt to create this kind of shape results in an error. */
            SHAPE_CUSTOM = 8,
        }
        enum AreaParameter {
            /** Constant to set/get gravity override mode in an area. See [enum AreaSpaceOverrideMode] for possible values. The default value of this parameter is [constant AREA_SPACE_OVERRIDE_DISABLED]. */
            AREA_PARAM_GRAVITY_OVERRIDE_MODE = 0,
            
            /** Constant to set/get gravity strength in an area. The default value of this parameter is `9.80665`. */
            AREA_PARAM_GRAVITY = 1,
            
            /** Constant to set/get gravity vector/center in an area. The default value of this parameter is `Vector2(0, -1)`. */
            AREA_PARAM_GRAVITY_VECTOR = 2,
            
            /** Constant to set/get whether the gravity vector of an area is a direction, or a center point. The default value of this parameter is `false`. */
            AREA_PARAM_GRAVITY_IS_POINT = 3,
            
            /** Constant to set/get the distance at which the gravity strength is equal to the gravity controlled by [constant AREA_PARAM_GRAVITY]. For example, on a planet 100 pixels in radius with a surface gravity of 4.0 px/s², set the gravity to 4.0 and the unit distance to 100.0. The gravity will have falloff according to the inverse square law, so in the example, at 200 pixels from the center the gravity will be 1.0 px/s² (twice the distance, 1/4th the gravity), at 50 pixels it will be 16.0 px/s² (half the distance, 4x the gravity), and so on.  
             *  The above is true only when the unit distance is a positive number. When the unit distance is set to 0.0, the gravity will be constant regardless of distance. The default value of this parameter is `0.0`.  
             */
            AREA_PARAM_GRAVITY_POINT_UNIT_DISTANCE = 4,
            
            /** Constant to set/get linear damping override mode in an area. See [enum AreaSpaceOverrideMode] for possible values. The default value of this parameter is [constant AREA_SPACE_OVERRIDE_DISABLED]. */
            AREA_PARAM_LINEAR_DAMP_OVERRIDE_MODE = 5,
            
            /** Constant to set/get the linear damping factor of an area. The default value of this parameter is `0.1`. */
            AREA_PARAM_LINEAR_DAMP = 6,
            
            /** Constant to set/get angular damping override mode in an area. See [enum AreaSpaceOverrideMode] for possible values. The default value of this parameter is [constant AREA_SPACE_OVERRIDE_DISABLED]. */
            AREA_PARAM_ANGULAR_DAMP_OVERRIDE_MODE = 7,
            
            /** Constant to set/get the angular damping factor of an area. The default value of this parameter is `1.0`. */
            AREA_PARAM_ANGULAR_DAMP = 8,
            
            /** Constant to set/get the priority (order of processing) of an area. The default value of this parameter is `0`. */
            AREA_PARAM_PRIORITY = 9,
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
            /** Constant to set/get a body's bounce factor. The default value of this parameter is `0.0`. */
            BODY_PARAM_BOUNCE = 0,
            
            /** Constant to set/get a body's friction. The default value of this parameter is `1.0`. */
            BODY_PARAM_FRICTION = 1,
            
            /** Constant to set/get a body's mass. The default value of this parameter is `1.0`. If the body's mode is set to [constant BODY_MODE_RIGID], then setting this parameter will have the following additional effects:  
             *  - If the parameter [constant BODY_PARAM_CENTER_OF_MASS] has never been set explicitly, then the value of that parameter will be recalculated based on the body's shapes.  
             *  - If the parameter [constant BODY_PARAM_INERTIA] is set to a value `<= 0.0`, then the value of that parameter will be recalculated based on the body's shapes, mass, and center of mass.  
             */
            BODY_PARAM_MASS = 2,
            
            /** Constant to set/get a body's inertia. The default value of this parameter is `0.0`. If the body's inertia is set to a value `<= 0.0`, then the inertia will be recalculated based on the body's shapes, mass, and center of mass. */
            BODY_PARAM_INERTIA = 3,
            
            /** Constant to set/get a body's center of mass position in the body's local coordinate system. The default value of this parameter is `Vector2(0,0)`. If this parameter is never set explicitly, then it is recalculated based on the body's shapes when setting the parameter [constant BODY_PARAM_MASS] or when calling [method body_set_space]. */
            BODY_PARAM_CENTER_OF_MASS = 4,
            
            /** Constant to set/get a body's gravity multiplier. The default value of this parameter is `1.0`. */
            BODY_PARAM_GRAVITY_SCALE = 5,
            
            /** Constant to set/get a body's linear damping mode. See [enum BodyDampMode] for possible values. The default value of this parameter is [constant BODY_DAMP_MODE_COMBINE]. */
            BODY_PARAM_LINEAR_DAMP_MODE = 6,
            
            /** Constant to set/get a body's angular damping mode. See [enum BodyDampMode] for possible values. The default value of this parameter is [constant BODY_DAMP_MODE_COMBINE]. */
            BODY_PARAM_ANGULAR_DAMP_MODE = 7,
            
            /** Constant to set/get a body's linear damping factor. The default value of this parameter is `0.0`. */
            BODY_PARAM_LINEAR_DAMP = 8,
            
            /** Constant to set/get a body's angular damping factor. The default value of this parameter is `0.0`. */
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
        enum JointType {
            /** Constant to create pin joints. */
            JOINT_TYPE_PIN = 0,
            
            /** Constant to create groove joints. */
            JOINT_TYPE_GROOVE = 1,
            
            /** Constant to create damped spring joints. */
            JOINT_TYPE_DAMPED_SPRING = 2,
            
            /** Represents the size of the [enum JointType] enum. */
            JOINT_TYPE_MAX = 3,
        }
        enum JointParam {
            /** Constant to set/get how fast the joint pulls the bodies back to satisfy the joint constraint. The lower the value, the more the two bodies can pull on the joint. The default value of this parameter is `0.0`.  
             *      
             *  **Note:** In Godot Physics, this parameter is only used for pin joints and groove joints.  
             */
            JOINT_PARAM_BIAS = 0,
            
            /** Constant to set/get the maximum speed with which the joint can apply corrections. The default value of this parameter is `3.40282e+38`.  
             *      
             *  **Note:** In Godot Physics, this parameter is only used for groove joints.  
             */
            JOINT_PARAM_MAX_BIAS = 1,
            
            /** Constant to set/get the maximum force that the joint can use to act on the two bodies. The default value of this parameter is `3.40282e+38`.  
             *      
             *  **Note:** In Godot Physics, this parameter is only used for groove joints.  
             */
            JOINT_PARAM_MAX_FORCE = 2,
        }
        enum PinJointParam {
            /** Constant to set/get a how much the bond of the pin joint can flex. The default value of this parameter is `0.0`. */
            PIN_JOINT_SOFTNESS = 0,
            
            /** The maximum rotation around the pin. */
            PIN_JOINT_LIMIT_UPPER = 1,
            
            /** The minimum rotation around the pin. */
            PIN_JOINT_LIMIT_LOWER = 2,
            
            /** Target speed for the motor. In radians per second. */
            PIN_JOINT_MOTOR_TARGET_VELOCITY = 3,
        }
        enum PinJointFlag {
            /** If `true`, the pin has a maximum and a minimum rotation. */
            PIN_JOINT_FLAG_ANGULAR_LIMIT_ENABLED = 0,
            
            /** If `true`, a motor turns the pin. */
            PIN_JOINT_FLAG_MOTOR_ENABLED = 1,
        }
        enum DampedSpringParam {
            /** Sets the resting length of the spring joint. The joint will always try to go to back this length when pulled apart. The default value of this parameter is the distance between the joint's anchor points. */
            DAMPED_SPRING_REST_LENGTH = 0,
            
            /** Sets the stiffness of the spring joint. The joint applies a force equal to the stiffness times the distance from its resting length. The default value of this parameter is `20.0`. */
            DAMPED_SPRING_STIFFNESS = 1,
            
            /** Sets the damping ratio of the spring joint. A value of 0 indicates an undamped spring, while 1 causes the system to reach equilibrium as fast as possible (critical damping). The default value of this parameter is `1.5`. */
            DAMPED_SPRING_DAMPING = 2,
        }
        enum CCDMode {
            /** Disables continuous collision detection. This is the fastest way to detect body collisions, but it can miss small and/or fast-moving objects. */
            CCD_MODE_DISABLED = 0,
            
            /** Enables continuous collision detection by raycasting. It is faster than shapecasting, but less precise. */
            CCD_MODE_CAST_RAY = 1,
            
            /** Enables continuous collision detection by shapecasting. It is the slowest CCD method, and the most precise. */
            CCD_MODE_CAST_SHAPE = 2,
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
    }
    /** A server interface for low-level 2D physics access.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsserver2d.html  
     */
    class PhysicsServer2D extends Object {
        /** Creates a 2D world boundary shape in the physics server, and returns the [RID] that identifies it. Use [method shape_set_data] to set the shape's normal direction and distance properties. */
        static world_boundary_shape_create(): RID
        
        /** Creates a 2D separation ray shape in the physics server, and returns the [RID] that identifies it. Use [method shape_set_data] to set the shape's `length` and `slide_on_slope` properties. */
        static separation_ray_shape_create(): RID
        
        /** Creates a 2D segment shape in the physics server, and returns the [RID] that identifies it. Use [method shape_set_data] to set the segment's start and end points. */
        static segment_shape_create(): RID
        
        /** Creates a 2D circle shape in the physics server, and returns the [RID] that identifies it. Use [method shape_set_data] to set the circle's radius. */
        static circle_shape_create(): RID
        
        /** Creates a 2D rectangle shape in the physics server, and returns the [RID] that identifies it. Use [method shape_set_data] to set the rectangle's half-extents. */
        static rectangle_shape_create(): RID
        
        /** Creates a 2D capsule shape in the physics server, and returns the [RID] that identifies it. Use [method shape_set_data] to set the capsule's height and radius. */
        static capsule_shape_create(): RID
        
        /** Creates a 2D convex polygon shape in the physics server, and returns the [RID] that identifies it. Use [method shape_set_data] to set the convex polygon's points. */
        static convex_polygon_shape_create(): RID
        
        /** Creates a 2D concave polygon shape in the physics server, and returns the [RID] that identifies it. Use [method shape_set_data] to set the concave polygon's segments. */
        static concave_polygon_shape_create(): RID
        
        /** Sets the shape data that defines the configuration of the shape. The [param data] to be passed depends on the shape's type (see [method shape_get_type]):  
         *  - [constant SHAPE_WORLD_BOUNDARY]: an array of length two containing a [Vector2] `normal` direction and a [float] distance `d`,  
         *  - [constant SHAPE_SEPARATION_RAY]: a dictionary containing the key `length` with a [float] value and the key `slide_on_slope` with a [bool] value,  
         *  - [constant SHAPE_SEGMENT]: a [Rect2] `rect` containing the first point of the segment in `rect.position` and the second point of the segment in `rect.size`,  
         *  - [constant SHAPE_CIRCLE]: a [float] `radius`,  
         *  - [constant SHAPE_RECTANGLE]: a [Vector2] `half_extents`,  
         *  - [constant SHAPE_CAPSULE]: an array of length two (or a [Vector2]) containing a [float] `height` and a [float] `radius`,  
         *  - [constant SHAPE_CONVEX_POLYGON]: either a [PackedVector2Array] of points defining a convex polygon in counterclockwise order (the clockwise outward normal of each segment formed by consecutive points is calculated internally), or a [PackedFloat32Array] of length divisible by four so that every 4-tuple of [float]s contains the coordinates of a point followed by the coordinates of the clockwise outward normal vector to the segment between the current point and the next point,  
         *  - [constant SHAPE_CONCAVE_POLYGON]: a [PackedVector2Array] of length divisible by two (each pair of points forms one segment).  
         *  **Warning:** In the case of [constant SHAPE_CONVEX_POLYGON], this method does not check if the points supplied actually form a convex polygon (unlike the [member CollisionPolygon2D.polygon] property).  
         */
        static shape_set_data(shape: RID, data: any): void
        
        /** Returns the shape's type (see [enum ShapeType]). */
        static shape_get_type(shape: RID): PhysicsServer2D.ShapeType
        
        /** Returns the shape data that defines the configuration of the shape, such as the half-extents of a rectangle or the segments of a concave shape. See [method shape_set_data] for the precise format of this data in each case. */
        static shape_get_data(shape: RID): any
        
        /** Creates a 2D space in the physics server, and returns the [RID] that identifies it. A space contains bodies and areas, and controls the stepping of the physics simulation of the objects in it. */
        static space_create(): RID
        
        /** Activates or deactivates the space. If [param active] is `false`, then the physics server will not do anything with this space in its physics step. */
        static space_set_active(space: RID, active: boolean): void
        
        /** Returns `true` if the space is active. */
        static space_is_active(space: RID): boolean
        
        /** Sets the value of the given space parameter. See [enum SpaceParameter] for the list of available parameters. */
        static space_set_param(space: RID, param: PhysicsServer2D.SpaceParameter, value: float64): void
        
        /** Returns the value of the given space parameter. See [enum SpaceParameter] for the list of available parameters. */
        static space_get_param(space: RID, param: PhysicsServer2D.SpaceParameter): float64
        
        /** Returns the state of a space, a [PhysicsDirectSpaceState2D]. This object can be used for collision/intersection queries. */
        static space_get_direct_state(space: RID): PhysicsDirectSpaceState2D
        
        /** Creates a 2D area object in the physics server, and returns the [RID] that identifies it. The default settings for the created area include a collision layer and mask set to `1`, and `monitorable` set to `false`.  
         *  Use [method area_add_shape] to add shapes to it, use [method area_set_transform] to set its transform, and use [method area_set_space] to add the area to a space. If you want the area to be detectable use [method area_set_monitorable].  
         */
        static area_create(): RID
        
        /** Adds the area to the given space, after removing the area from the previously assigned space (if any).  
         *      
         *  **Note:** To remove an area from a space without immediately adding it back elsewhere, use `PhysicsServer2D.area_set_space(area, RID())`.  
         */
        static area_set_space(area: RID, space: RID): void
        
        /** Returns the [RID] of the space assigned to the area. Returns an empty [RID] if no space is assigned. */
        static area_get_space(area: RID): RID
        
        /** Adds a shape to the area, with the given local transform. The shape (together with its [param transform] and [param disabled] properties) is added to an array of shapes, and the shapes of an area are usually referenced by their index in this array. */
        static area_add_shape(area: RID, shape: RID, transform: Transform2D = new Transform2D(), disabled: boolean = false): void
        
        /** Replaces the area's shape at the given index by another shape, while not affecting the `transform` and `disabled` properties at the same index. */
        static area_set_shape(area: RID, shape_idx: int64, shape: RID): void
        
        /** Sets the local transform matrix of the area's shape with the given index. */
        static area_set_shape_transform(area: RID, shape_idx: int64, transform: Transform2D): void
        
        /** Sets the disabled property of the area's shape with the given index. If [param disabled] is `true`, then the shape will not detect any other shapes entering or exiting it. */
        static area_set_shape_disabled(area: RID, shape_idx: int64, disabled: boolean): void
        
        /** Returns the number of shapes added to the area. */
        static area_get_shape_count(area: RID): int64
        
        /** Returns the [RID] of the shape with the given index in the area's array of shapes. */
        static area_get_shape(area: RID, shape_idx: int64): RID
        
        /** Returns the local transform matrix of the shape with the given index in the area's array of shapes. */
        static area_get_shape_transform(area: RID, shape_idx: int64): Transform2D
        
        /** Removes the shape with the given index from the area's array of shapes. The shape itself is not deleted, so it can continue to be used elsewhere or added back later. As a result of this operation, the area's shapes which used to have indices higher than [param shape_idx] will have their index decreased by one. */
        static area_remove_shape(area: RID, shape_idx: int64): void
        
        /** Removes all shapes from the area. This does not delete the shapes themselves, so they can continue to be used elsewhere or added back later. */
        static area_clear_shapes(area: RID): void
        
        /** Assigns the area to one or many physics layers, via a bitmask. */
        static area_set_collision_layer(area: RID, layer: int64): void
        
        /** Returns the physics layer or layers the area belongs to, as a bitmask. */
        static area_get_collision_layer(area: RID): int64
        
        /** Sets which physics layers the area will monitor, via a bitmask. */
        static area_set_collision_mask(area: RID, mask: int64): void
        
        /** Returns the physics layer or layers the area can contact with, as a bitmask. */
        static area_get_collision_mask(area: RID): int64
        
        /** Sets the value of the given area parameter. See [enum AreaParameter] for the list of available parameters. */
        static area_set_param(area: RID, param: PhysicsServer2D.AreaParameter, value: any): void
        
        /** Sets the transform matrix of the area. */
        static area_set_transform(area: RID, transform: Transform2D): void
        
        /** Returns the value of the given area parameter. See [enum AreaParameter] for the list of available parameters. */
        static area_get_param(area: RID, param: PhysicsServer2D.AreaParameter): any
        
        /** Returns the transform matrix of the area. */
        static area_get_transform(area: RID): Transform2D
        
        /** Attaches the `ObjectID` of an [Object] to the area. Use [method Object.get_instance_id] to get the `ObjectID` of a [CollisionObject2D]. */
        static area_attach_object_instance_id(area: RID, id: int64): void
        
        /** Returns the `ObjectID` attached to the area. Use [method @GlobalScope.instance_from_id] to retrieve an [Object] from a nonzero `ObjectID`. */
        static area_get_object_instance_id(area: RID): int64
        
        /** Attaches the `ObjectID` of a canvas to the area. Use [method Object.get_instance_id] to get the `ObjectID` of a [CanvasLayer]. */
        static area_attach_canvas_instance_id(area: RID, id: int64): void
        
        /** Returns the `ObjectID` of the canvas attached to the area. Use [method @GlobalScope.instance_from_id] to retrieve a [CanvasLayer] from a nonzero `ObjectID`. */
        static area_get_canvas_instance_id(area: RID): int64
        
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
        
        /** Sets whether the area is monitorable or not. If [param monitorable] is `true`, the area monitoring callback of other areas will be called when this area enters or exits them. */
        static area_set_monitorable(area: RID, monitorable: boolean): void
        
        /** Creates a 2D body object in the physics server, and returns the [RID] that identifies it. The default settings for the created area include a collision layer and mask set to `1`, and body mode set to [constant BODY_MODE_RIGID].  
         *  Use [method body_add_shape] to add shapes to it, use [method body_set_state] to set its transform, and use [method body_set_space] to add the body to a space.  
         */
        static body_create(): RID
        
        /** Adds the body to the given space, after removing the body from the previously assigned space (if any). If the body's mode is set to [constant BODY_MODE_RIGID], then adding the body to a space will have the following additional effects:  
         *  - If the parameter [constant BODY_PARAM_CENTER_OF_MASS] has never been set explicitly, then the value of that parameter will be recalculated based on the body's shapes.  
         *  - If the parameter [constant BODY_PARAM_INERTIA] is set to a value `<= 0.0`, then the value of that parameter will be recalculated based on the body's shapes, mass, and center of mass.  
         *      
         *  **Note:** To remove a body from a space without immediately adding it back elsewhere, use `PhysicsServer2D.body_set_space(body, RID())`.  
         */
        static body_set_space(body: RID, space: RID): void
        
        /** Returns the [RID] of the space assigned to the body. Returns an empty [RID] if no space is assigned. */
        static body_get_space(body: RID): RID
        
        /** Sets the body's mode. See [enum BodyMode] for the list of available modes. */
        static body_set_mode(body: RID, mode: PhysicsServer2D.BodyMode): void
        
        /** Returns the body's mode (see [enum BodyMode]). */
        static body_get_mode(body: RID): PhysicsServer2D.BodyMode
        
        /** Adds a shape to the area, with the given local transform. The shape (together with its [param transform] and [param disabled] properties) is added to an array of shapes, and the shapes of a body are usually referenced by their index in this array. */
        static body_add_shape(body: RID, shape: RID, transform: Transform2D = new Transform2D(), disabled: boolean = false): void
        
        /** Replaces the body's shape at the given index by another shape, while not affecting the `transform`, `disabled`, and one-way collision properties at the same index. */
        static body_set_shape(body: RID, shape_idx: int64, shape: RID): void
        
        /** Sets the local transform matrix of the body's shape with the given index. */
        static body_set_shape_transform(body: RID, shape_idx: int64, transform: Transform2D): void
        
        /** Returns the number of shapes added to the body. */
        static body_get_shape_count(body: RID): int64
        
        /** Returns the [RID] of the shape with the given index in the body's array of shapes. */
        static body_get_shape(body: RID, shape_idx: int64): RID
        
        /** Returns the local transform matrix of the shape with the given index in the area's array of shapes. */
        static body_get_shape_transform(body: RID, shape_idx: int64): Transform2D
        
        /** Removes the shape with the given index from the body's array of shapes. The shape itself is not deleted, so it can continue to be used elsewhere or added back later. As a result of this operation, the body's shapes which used to have indices higher than [param shape_idx] will have their index decreased by one. */
        static body_remove_shape(body: RID, shape_idx: int64): void
        
        /** Removes all shapes from the body. This does not delete the shapes themselves, so they can continue to be used elsewhere or added back later. */
        static body_clear_shapes(body: RID): void
        
        /** Sets the disabled property of the body's shape with the given index. If [param disabled] is `true`, then the shape will be ignored in all collision detection. */
        static body_set_shape_disabled(body: RID, shape_idx: int64, disabled: boolean): void
        
        /** Sets the one-way collision properties of the body's shape with the given index. If [param enable] is `true`, the one-way collision direction given by the shape's local upward axis `body_get_shape_transform(body, shape_idx).y` will be used to ignore collisions with the shape in the opposite direction, and to ensure depenetration of kinematic bodies happens in this direction. */
        static body_set_shape_as_one_way_collision(body: RID, shape_idx: int64, enable: boolean, margin: float64): void
        
        /** Attaches the `ObjectID` of an [Object] to the body. Use [method Object.get_instance_id] to get the `ObjectID` of a [CollisionObject2D]. */
        static body_attach_object_instance_id(body: RID, id: int64): void
        
        /** Returns the `ObjectID` attached to the body. Use [method @GlobalScope.instance_from_id] to retrieve an [Object] from a nonzero `ObjectID`. */
        static body_get_object_instance_id(body: RID): int64
        
        /** Attaches the `ObjectID` of a canvas to the body. Use [method Object.get_instance_id] to get the `ObjectID` of a [CanvasLayer]. */
        static body_attach_canvas_instance_id(body: RID, id: int64): void
        
        /** Returns the `ObjectID` of the canvas attached to the body. Use [method @GlobalScope.instance_from_id] to retrieve a [CanvasLayer] from a nonzero `ObjectID`. */
        static body_get_canvas_instance_id(body: RID): int64
        
        /** Sets the continuous collision detection mode using one of the [enum CCDMode] constants.  
         *  Continuous collision detection tries to predict where a moving body would collide in between physics updates, instead of moving it and correcting its movement if it collided.  
         */
        static body_set_continuous_collision_detection_mode(body: RID, mode: PhysicsServer2D.CCDMode): void
        
        /** Returns the body's continuous collision detection mode (see [enum CCDMode]). */
        static body_get_continuous_collision_detection_mode(body: RID): PhysicsServer2D.CCDMode
        
        /** Sets the physics layer or layers the body belongs to, via a bitmask. */
        static body_set_collision_layer(body: RID, layer: int64): void
        
        /** Returns the physics layer or layers the body belongs to, as a bitmask. */
        static body_get_collision_layer(body: RID): int64
        
        /** Sets the physics layer or layers the body can collide with, via a bitmask. */
        static body_set_collision_mask(body: RID, mask: int64): void
        
        /** Returns the physics layer or layers the body can collide with, as a bitmask. */
        static body_get_collision_mask(body: RID): int64
        
        /** Sets the body's collision priority. This is used in the depenetration phase of [method body_test_motion]. The higher the priority is, the lower the penetration into the body will be. */
        static body_set_collision_priority(body: RID, priority: float64): void
        
        /** Returns the body's collision priority. This is used in the depenetration phase of [method body_test_motion]. The higher the priority is, the lower the penetration into the body will be. */
        static body_get_collision_priority(body: RID): float64
        
        /** Sets the value of the given body parameter. See [enum BodyParameter] for the list of available parameters. */
        static body_set_param(body: RID, param: PhysicsServer2D.BodyParameter, value: any): void
        
        /** Returns the value of the given body parameter. See [enum BodyParameter] for the list of available parameters. */
        static body_get_param(body: RID, param: PhysicsServer2D.BodyParameter): any
        
        /** Restores the default inertia and center of mass of the body based on its shapes. This undoes any custom values previously set using [method body_set_param]. */
        static body_reset_mass_properties(body: RID): void
        
        /** Sets the value of a body's state. See [enum BodyState] for the list of available states.  
         *      
         *  **Note:** The state change doesn't take effect immediately. The state will change on the next physics frame.  
         */
        static body_set_state(body: RID, state: PhysicsServer2D.BodyState, value: any): void
        
        /** Returns the value of the given state of the body. See [enum BodyState] for the list of available states. */
        static body_get_state(body: RID, state: PhysicsServer2D.BodyState): any
        
        /** Applies a directional impulse to the body, at the body's center of mass. The impulse does not affect rotation.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  This is equivalent to using [method body_apply_impulse] at the body's center of mass.  
         */
        static body_apply_central_impulse(body: RID, impulse: Vector2): void
        
        /** Applies a rotational impulse to the body. The impulse does not affect position.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         */
        static body_apply_torque_impulse(body: RID, impulse: float64): void
        
        /** Applies a positioned impulse to the body. The impulse can affect rotation if [param position] is different from the body's center of mass.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        static body_apply_impulse(body: RID, impulse: Vector2, position: Vector2 = Vector2.ZERO): void
        
        /** Applies a directional force to the body, at the body's center of mass. The force does not affect rotation. A force is time dependent and meant to be applied every physics update.  
         *  This is equivalent to using [method body_apply_force] at the body's center of mass.  
         */
        static body_apply_central_force(body: RID, force: Vector2): void
        
        /** Applies a positioned force to the body. The force can affect rotation if [param position] is different from the body's center of mass. A force is time dependent and meant to be applied every physics update.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        static body_apply_force(body: RID, force: Vector2, position: Vector2 = Vector2.ZERO): void
        
        /** Applies a rotational force to the body. The force does not affect position. A force is time dependent and meant to be applied every physics update. */
        static body_apply_torque(body: RID, torque: float64): void
        
        /** Adds a constant directional force to the body. The force does not affect rotation. The force remains applied over time until cleared with `PhysicsServer2D.body_set_constant_force(body, Vector2(0, 0))`.  
         *  This is equivalent to using [method body_add_constant_force] at the body's center of mass.  
         */
        static body_add_constant_central_force(body: RID, force: Vector2): void
        
        /** Adds a constant positioned force to the body. The force can affect rotation if [param position] is different from the body's center of mass. The force remains applied over time until cleared with `PhysicsServer2D.body_set_constant_force(body, Vector2(0, 0))`.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        static body_add_constant_force(body: RID, force: Vector2, position: Vector2 = Vector2.ZERO): void
        
        /** Adds a constant rotational force to the body. The force does not affect position. The force remains applied over time until cleared with `PhysicsServer2D.body_set_constant_torque(body, 0)`. */
        static body_add_constant_torque(body: RID, torque: float64): void
        
        /** Sets the body's total constant positional force applied during each physics update.  
         *  See [method body_add_constant_force] and [method body_add_constant_central_force].  
         */
        static body_set_constant_force(body: RID, force: Vector2): void
        
        /** Returns the body's total constant positional force applied during each physics update.  
         *  See [method body_add_constant_force] and [method body_add_constant_central_force].  
         */
        static body_get_constant_force(body: RID): Vector2
        
        /** Sets the body's total constant rotational force applied during each physics update.  
         *  See [method body_add_constant_torque].  
         */
        static body_set_constant_torque(body: RID, torque: float64): void
        
        /** Returns the body's total constant rotational force applied during each physics update.  
         *  See [method body_add_constant_torque].  
         */
        static body_get_constant_torque(body: RID): float64
        
        /** Modifies the body's linear velocity so that its projection to the axis `axis_velocity.normalized()` is exactly `axis_velocity.length()`. This is useful for jumping behavior. */
        static body_set_axis_velocity(body: RID, axis_velocity: Vector2): void
        
        /** Adds [param excepted_body] to the body's list of collision exceptions, so that collisions with it are ignored. */
        static body_add_collision_exception(body: RID, excepted_body: RID): void
        
        /** Removes [param excepted_body] from the body's list of collision exceptions, so that collisions with it are no longer ignored. */
        static body_remove_collision_exception(body: RID, excepted_body: RID): void
        
        /** Sets the maximum number of contacts that the body can report. If [param amount] is greater than zero, then the body will keep track of at most this many contacts with other bodies. */
        static body_set_max_contacts_reported(body: RID, amount: int64): void
        
        /** Returns the maximum number of contacts that the body can report. See [method body_set_max_contacts_reported]. */
        static body_get_max_contacts_reported(body: RID): int64
        
        /** Sets whether the body omits the standard force integration. If [param enable] is `true`, the body will not automatically use applied forces, torques, and damping to update the body's linear and angular velocity. In this case, [method body_set_force_integration_callback] can be used to manually update the linear and angular velocity instead.  
         *  This method is called when the property [member RigidBody2D.custom_integrator] is set.  
         */
        static body_set_omit_force_integration(body: RID, enable: boolean): void
        
        /** Returns `true` if the body is omitting the standard force integration. See [method body_set_omit_force_integration]. */
        static body_is_omitting_force_integration(body: RID): boolean
        
        /** Sets the body's state synchronization callback function to [param callable]. Use an empty [Callable] ([code skip-lint]Callable()`) to clear the callback.  
         *  The function [param callable] will be called every physics frame, assuming that the body was active during the previous physics tick, and can be used to fetch the latest state from the physics server.  
         *  The function [param callable] must take the following parameters:  
         *  1. `state`: a [PhysicsDirectBodyState2D], used to retrieve the body's state.  
         */
        static body_set_state_sync_callback(body: RID, callable: Callable): void
        
        /** Sets the body's custom force integration callback function to [param callable]. Use an empty [Callable] ([code skip-lint]Callable()`) to clear the custom callback.  
         *  The function [param callable] will be called every physics tick, before the standard force integration (see [method body_set_omit_force_integration]). It can be used for example to update the body's linear and angular velocity based on contact with other bodies.  
         *  If [param userdata] is not `null`, the function [param callable] must take the following two parameters:  
         *  1. `state`: a [PhysicsDirectBodyState2D] used to retrieve and modify the body's state,  
         *  2. [code skip-lint]userdata`: a [Variant]; its value will be the [param userdata] passed into this method.  
         *  If [param userdata] is `null`, then [param callable] must take only the `state` parameter.  
         */
        static body_set_force_integration_callback(body: RID, callable: Callable, userdata: any = <any> {}): void
        
        /** Returns `true` if a collision would result from moving the body along a motion vector from a given point in space. See [PhysicsTestMotionParameters2D] for the available motion parameters. Optionally a [PhysicsTestMotionResult2D] object can be passed, which will be used to store the information about the resulting collision. */
        static body_test_motion(body: RID, parameters: PhysicsTestMotionParameters2D, result: PhysicsTestMotionResult2D = undefined): boolean
        
        /** Returns the [PhysicsDirectBodyState2D] of the body. Returns `null` if the body is destroyed or not assigned to a space. */
        static body_get_direct_state(body: RID): PhysicsDirectBodyState2D
        
        /** Creates a 2D joint in the physics server, and returns the [RID] that identifies it. To set the joint type, use [method joint_make_damped_spring], [method joint_make_groove] or [method joint_make_pin]. Use [method joint_set_param] to set generic joint parameters. */
        static joint_create(): RID
        
        /** Destroys the joint with the given [RID], creates a new uninitialized joint, and makes the [RID] refer to this new joint. */
        static joint_clear(joint: RID): void
        
        /** Sets the value of the given joint parameter. See [enum JointParam] for the list of available parameters. */
        static joint_set_param(joint: RID, param: PhysicsServer2D.JointParam, value: float64): void
        
        /** Returns the value of the given joint parameter. See [enum JointParam] for the list of available parameters. */
        static joint_get_param(joint: RID, param: PhysicsServer2D.JointParam): float64
        
        /** Sets whether the bodies attached to the [Joint2D] will collide with each other. */
        static joint_disable_collisions_between_bodies(joint: RID, disable: boolean): void
        
        /** Returns whether the bodies attached to the [Joint2D] will collide with each other. */
        static joint_is_disabled_collisions_between_bodies(joint: RID): boolean
        
        /** Makes the joint a pin joint. If [param body_b] is an empty [RID], then [param body_a] is pinned to the point [param anchor] (given in global coordinates); otherwise, [param body_a] is pinned to [param body_b] at the point [param anchor] (given in global coordinates). To set the parameters which are specific to the pin joint, see [method pin_joint_set_param]. */
        static joint_make_pin(joint: RID, anchor: Vector2, body_a: RID, body_b: RID = new RID()): void
        
        /** Makes the joint a groove joint. */
        static joint_make_groove(joint: RID, groove1_a: Vector2, groove2_a: Vector2, anchor_b: Vector2, body_a: RID = new RID(), body_b: RID = new RID()): void
        
        /** Makes the joint a damped spring joint, attached at the point [param anchor_a] (given in global coordinates) on the body [param body_a] and at the point [param anchor_b] (given in global coordinates) on the body [param body_b]. To set the parameters which are specific to the damped spring, see [method damped_spring_joint_set_param]. */
        static joint_make_damped_spring(joint: RID, anchor_a: Vector2, anchor_b: Vector2, body_a: RID, body_b: RID = new RID()): void
        
        /** Sets a pin joint flag (see [enum PinJointFlag] constants). */
        static pin_joint_set_flag(joint: RID, flag: PhysicsServer2D.PinJointFlag, enabled: boolean): void
        
        /** Gets a pin joint flag (see [enum PinJointFlag] constants). */
        static pin_joint_get_flag(joint: RID, flag: PhysicsServer2D.PinJointFlag): boolean
        
        /** Sets a pin joint parameter. See [enum PinJointParam] for a list of available parameters. */
        static pin_joint_set_param(joint: RID, param: PhysicsServer2D.PinJointParam, value: float64): void
        
        /** Returns the value of a pin joint parameter. See [enum PinJointParam] for a list of available parameters. */
        static pin_joint_get_param(joint: RID, param: PhysicsServer2D.PinJointParam): float64
        
        /** Sets the value of the given damped spring joint parameter. See [enum DampedSpringParam] for the list of available parameters. */
        static damped_spring_joint_set_param(joint: RID, param: PhysicsServer2D.DampedSpringParam, value: float64): void
        
        /** Returns the value of the given damped spring joint parameter. See [enum DampedSpringParam] for the list of available parameters. */
        static damped_spring_joint_get_param(joint: RID, param: PhysicsServer2D.DampedSpringParam): float64
        
        /** Returns the joint's type (see [enum JointType]). */
        static joint_get_type(joint: RID): PhysicsServer2D.JointType
        
        /** Destroys any of the objects created by PhysicsServer2D. If the [RID] passed is not one of the objects that can be created by PhysicsServer2D, an error will be printed to the console. */
        static free_rid(rid: RID): void
        
        /** Activates or deactivates the 2D physics server. If [param active] is `false`, then the physics server will not do anything in its physics step. */
        static set_active(active: boolean): void
        
        /** Returns information about the current state of the 2D physics engine. See [enum ProcessInfo] for the list of available states. */
        static get_process_info(process_info: PhysicsServer2D.ProcessInfo): int64
    }
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsserver3d.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_xrserver.html  
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
        
        /** If set to `true`, the scene will be rendered as if the camera is locked to the [XROrigin3D].  
         *      
         *  **Note:** This doesn't provide a very comfortable experience for users. This setting exists for doing benchmarking or automated testing, where you want to control what is rendered via code.  
         */
        get camera_locked_to_origin(): boolean
        set camera_locked_to_origin(value: boolean)
        
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
    // _singleton_class_: GDScriptLanguageProtocol
    /** @link https://docs.godotengine.org/en/4.4/classes/class_gdscriptlanguageprotocol.html */
    class GDScriptLanguageProtocol extends JSONRPC {
        static initialize(params: GDictionary): GDictionary
        static initialized(params: any): void
        static on_client_connected(): GError
        static on_client_disconnected(_unnamed_arg0: int64): void
        static notify_client(method: string, params: any = <any> {}, client_id: int64 = -1): void
        static is_smart_resolve_enabled(): boolean
        static get_text_document(): GDScriptTextDocument
        static get_workspace(): GDScriptWorkspace
        static is_initialized(): boolean
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_aescontext.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_astar2d.html  
     */
    class AStar2D extends RefCounted {
        constructor(identifier?: any)
        /** Called when estimating the cost between a point and the path's ending point.  
         *  Note that this function is hidden in the default [AStar2D] class.  
         */
        /* gdvirtual */ _estimate_cost(from_id: int64, end_id: int64): float64
        
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
        
        /** Reserves space internally for [param num_nodes] points. Useful if you're adding a known large number of points at once, such as points on a grid. The new capacity must be greater or equal to the old capacity. */
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
         *  Additionally, when [param allow_partial_path] is `true` and [param to_id] is disabled the search may take an unusually long time to finish.  
         */
        get_point_path(from_id: int64, to_id: int64, allow_partial_path: boolean = false): PackedVector2Array
        
        /** Returns an array with the IDs of the points that form the path found by AStar2D between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *      
         *  **Note:** When [param allow_partial_path] is `true` and [param to_id] is disabled the search may take an unusually long time to finish.  
         *    
         *  If you change the 2nd point's weight to 3, then the result will be `[1, 4, 3]` instead, because now even though the distance is longer, it's "easier" to get through point 4 than through point 2.  
         */
        get_id_path(from_id: int64, to_id: int64, allow_partial_path: boolean = false): PackedInt64Array
    }
    /** An implementation of A* for finding the shortest path between two vertices on a connected graph in 3D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_astar3d.html  
     */
    class AStar3D extends RefCounted {
        constructor(identifier?: any)
        /** Called when estimating the cost between a point and the path's ending point.  
         *  Note that this function is hidden in the default [AStar3D] class.  
         */
        /* gdvirtual */ _estimate_cost(from_id: int64, end_id: int64): float64
        
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
         *  Additionally, when [param allow_partial_path] is `true` and [param to_id] is disabled the search may take an unusually long time to finish.  
         */
        get_point_path(from_id: int64, to_id: int64, allow_partial_path: boolean = false): PackedVector3Array
        
        /** Returns an array with the IDs of the points that form the path found by AStar3D between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *      
         *  **Note:** When [param allow_partial_path] is `true` and [param to_id] is disabled the search may take an unusually long time to finish.  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_astargrid2d.html  
     */
    class AStarGrid2D extends RefCounted {
        constructor(identifier?: any)
        /** Called when estimating the cost between a point and the path's ending point.  
         *  Note that this function is hidden in the default [AStarGrid2D] class.  
         */
        /* gdvirtual */ _estimate_cost(from_id: Vector2i, end_id: Vector2i): float64
        
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
        
        /** Returns an array of dictionaries with point data (`id`: [Vector2i], `position`: [Vector2], `solid`: [bool], `weight_scale`: [float]) within a [param region]. */
        get_point_data_in_region(region: Rect2i): GArray
        
        /** Returns an array with the points that are in the path found by [AStarGrid2D] between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *      
         *  **Note:** This method is not thread-safe. If called from a [Thread], it will return an empty array and will print an error message.  
         *  Additionally, when [param allow_partial_path] is `true` and [param to_id] is solid the search may take an unusually long time to finish.  
         */
        get_point_path(from_id: Vector2i, to_id: Vector2i, allow_partial_path: boolean = false): PackedVector2Array
        
        /** Returns an array with the IDs of the points that form the path found by AStar2D between the given points. The array is ordered from the starting point to the ending point of the path.  
         *  If there is no valid path to the target, and [param allow_partial_path] is `true`, returns a path to the point closest to the target that can be reached.  
         *      
         *  **Note:** When [param allow_partial_path] is `true` and [param to_id] is solid the search may take an unusually long time to finish.  
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
    class AbstractPolygon2DEditor<Map extends Record<string, Node> = Record<string, Node>> extends HBoxContainer<Map> {
        constructor(identifier?: any)
    }
    class AbstractPolygon2DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** A base dialog used for user notification.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_acceptdialog.html  
     */
    class AcceptDialog<Map extends Record<string, Node> = Record<string, Node>> extends Window<Map> {
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
    class ActionMapEditor<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
        readonly action_added: Signal1<string>
        readonly action_edited: Signal2<string, GDictionary>
        readonly action_removed: Signal1<string>
        readonly action_renamed: Signal2<string, string>
        readonly action_reordered: Signal3<string, string, boolean>
        readonly filter_focused: Signal0
        readonly filter_unfocused: Signal0
    }
    class AnchorPresetPicker<Map extends Record<string, Node> = Record<string, Node>> extends ControlEditorPresetPicker<Map> {
        constructor(identifier?: any)
        readonly anchors_preset_selected: Signal1<int64>
    }
    /** A 2D physics body that can't be moved by external forces. When moved manually, it affects other bodies in its path.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animatablebody2d.html  
     */
    class AnimatableBody2D<Map extends Record<string, Node> = Record<string, Node>> extends StaticBody2D<Map> {
        constructor(identifier?: any)
        /** If `true`, the body's movement will be synchronized to the physics frame. This is useful when animating movement via [AnimationPlayer], for example on moving platforms. Do **not** use together with [method PhysicsBody2D.move_and_collide]. */
        get sync_to_physics(): boolean
        set sync_to_physics(value: boolean)
    }
    /** A 3D physics body that can't be moved by external forces. When moved manually, it affects other bodies in its path.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animatablebody3d.html  
     */
    class AnimatableBody3D<Map extends Record<string, Node> = Record<string, Node>> extends StaticBody3D<Map> {
        constructor(identifier?: any)
        /** If `true`, the body's movement will be synchronized to the physics frame. This is useful when animating movement via [AnimationPlayer], for example on moving platforms. Do **not** use together with [method PhysicsBody3D.move_and_collide]. */
        get sync_to_physics(): boolean
        set sync_to_physics(value: boolean)
    }
    /** Sprite node that contains multiple textures as frames to play for animation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animatedsprite2d.html  
     */
    class AnimatedSprite2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
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
        
        /** Sets [member frame] the [member frame_progress] to the given values. Unlike setting [member frame], this method does not reset the [member frame_progress] to `0.0` implicitly.  
         *  **Example:** Change the animation while keeping the same [member frame] and [member frame_progress]:  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animatedsprite3d.html  
     */
    class AnimatedSprite3D<Map extends Record<string, Node> = Record<string, Node>> extends SpriteBase3D<Map> {
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
        
        /** Sets [member frame] the [member frame_progress] to the given values. Unlike setting [member frame], this method does not reset the [member frame_progress] to `0.0` implicitly.  
         *  **Example:** Change the animation while keeping the same [member frame] and [member frame_progress]:  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animatedtexture.html  
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
        get "frame_0/texture"(): Texture2D
        set "frame_0/texture"(value: Texture2D)
        get "frame_0/duration"(): float64
        set "frame_0/duration"(value: float64)
        get "frame_1/texture"(): Texture2D
        set "frame_1/texture"(value: Texture2D)
        get "frame_1/duration"(): float64
        set "frame_1/duration"(value: float64)
        get "frame_2/texture"(): Texture2D
        set "frame_2/texture"(value: Texture2D)
        get "frame_2/duration"(): float64
        set "frame_2/duration"(value: float64)
        get "frame_3/texture"(): Texture2D
        set "frame_3/texture"(value: Texture2D)
        get "frame_3/duration"(): float64
        set "frame_3/duration"(value: float64)
        get "frame_4/texture"(): Texture2D
        set "frame_4/texture"(value: Texture2D)
        get "frame_4/duration"(): float64
        set "frame_4/duration"(value: float64)
        get "frame_5/texture"(): Texture2D
        set "frame_5/texture"(value: Texture2D)
        get "frame_5/duration"(): float64
        set "frame_5/duration"(value: float64)
        get "frame_6/texture"(): Texture2D
        set "frame_6/texture"(value: Texture2D)
        get "frame_6/duration"(): float64
        set "frame_6/duration"(value: float64)
        get "frame_7/texture"(): Texture2D
        set "frame_7/texture"(value: Texture2D)
        get "frame_7/duration"(): float64
        set "frame_7/duration"(value: float64)
        get "frame_8/texture"(): Texture2D
        set "frame_8/texture"(value: Texture2D)
        get "frame_8/duration"(): float64
        set "frame_8/duration"(value: float64)
        get "frame_9/texture"(): Texture2D
        set "frame_9/texture"(value: Texture2D)
        get "frame_9/duration"(): float64
        set "frame_9/duration"(value: float64)
        get "frame_10/texture"(): Texture2D
        set "frame_10/texture"(value: Texture2D)
        get "frame_10/duration"(): float64
        set "frame_10/duration"(value: float64)
        get "frame_11/texture"(): Texture2D
        set "frame_11/texture"(value: Texture2D)
        get "frame_11/duration"(): float64
        set "frame_11/duration"(value: float64)
        get "frame_12/texture"(): Texture2D
        set "frame_12/texture"(value: Texture2D)
        get "frame_12/duration"(): float64
        set "frame_12/duration"(value: float64)
        get "frame_13/texture"(): Texture2D
        set "frame_13/texture"(value: Texture2D)
        get "frame_13/duration"(): float64
        set "frame_13/duration"(value: float64)
        get "frame_14/texture"(): Texture2D
        set "frame_14/texture"(value: Texture2D)
        get "frame_14/duration"(): float64
        set "frame_14/duration"(value: float64)
        get "frame_15/texture"(): Texture2D
        set "frame_15/texture"(value: Texture2D)
        get "frame_15/duration"(): float64
        set "frame_15/duration"(value: float64)
        get "frame_16/texture"(): Texture2D
        set "frame_16/texture"(value: Texture2D)
        get "frame_16/duration"(): float64
        set "frame_16/duration"(value: float64)
        get "frame_17/texture"(): Texture2D
        set "frame_17/texture"(value: Texture2D)
        get "frame_17/duration"(): float64
        set "frame_17/duration"(value: float64)
        get "frame_18/texture"(): Texture2D
        set "frame_18/texture"(value: Texture2D)
        get "frame_18/duration"(): float64
        set "frame_18/duration"(value: float64)
        get "frame_19/texture"(): Texture2D
        set "frame_19/texture"(value: Texture2D)
        get "frame_19/duration"(): float64
        set "frame_19/duration"(value: float64)
        get "frame_20/texture"(): Texture2D
        set "frame_20/texture"(value: Texture2D)
        get "frame_20/duration"(): float64
        set "frame_20/duration"(value: float64)
        get "frame_21/texture"(): Texture2D
        set "frame_21/texture"(value: Texture2D)
        get "frame_21/duration"(): float64
        set "frame_21/duration"(value: float64)
        get "frame_22/texture"(): Texture2D
        set "frame_22/texture"(value: Texture2D)
        get "frame_22/duration"(): float64
        set "frame_22/duration"(value: float64)
        get "frame_23/texture"(): Texture2D
        set "frame_23/texture"(value: Texture2D)
        get "frame_23/duration"(): float64
        set "frame_23/duration"(value: float64)
        get "frame_24/texture"(): Texture2D
        set "frame_24/texture"(value: Texture2D)
        get "frame_24/duration"(): float64
        set "frame_24/duration"(value: float64)
        get "frame_25/texture"(): Texture2D
        set "frame_25/texture"(value: Texture2D)
        get "frame_25/duration"(): float64
        set "frame_25/duration"(value: float64)
        get "frame_26/texture"(): Texture2D
        set "frame_26/texture"(value: Texture2D)
        get "frame_26/duration"(): float64
        set "frame_26/duration"(value: float64)
        get "frame_27/texture"(): Texture2D
        set "frame_27/texture"(value: Texture2D)
        get "frame_27/duration"(): float64
        set "frame_27/duration"(value: float64)
        get "frame_28/texture"(): Texture2D
        set "frame_28/texture"(value: Texture2D)
        get "frame_28/duration"(): float64
        set "frame_28/duration"(value: float64)
        get "frame_29/texture"(): Texture2D
        set "frame_29/texture"(value: Texture2D)
        get "frame_29/duration"(): float64
        set "frame_29/duration"(value: float64)
        get "frame_30/texture"(): Texture2D
        set "frame_30/texture"(value: Texture2D)
        get "frame_30/duration"(): float64
        set "frame_30/duration"(value: float64)
        get "frame_31/texture"(): Texture2D
        set "frame_31/texture"(value: Texture2D)
        get "frame_31/duration"(): float64
        set "frame_31/duration"(value: float64)
        get "frame_32/texture"(): Texture2D
        set "frame_32/texture"(value: Texture2D)
        get "frame_32/duration"(): float64
        set "frame_32/duration"(value: float64)
        get "frame_33/texture"(): Texture2D
        set "frame_33/texture"(value: Texture2D)
        get "frame_33/duration"(): float64
        set "frame_33/duration"(value: float64)
        get "frame_34/texture"(): Texture2D
        set "frame_34/texture"(value: Texture2D)
        get "frame_34/duration"(): float64
        set "frame_34/duration"(value: float64)
        get "frame_35/texture"(): Texture2D
        set "frame_35/texture"(value: Texture2D)
        get "frame_35/duration"(): float64
        set "frame_35/duration"(value: float64)
        get "frame_36/texture"(): Texture2D
        set "frame_36/texture"(value: Texture2D)
        get "frame_36/duration"(): float64
        set "frame_36/duration"(value: float64)
        get "frame_37/texture"(): Texture2D
        set "frame_37/texture"(value: Texture2D)
        get "frame_37/duration"(): float64
        set "frame_37/duration"(value: float64)
        get "frame_38/texture"(): Texture2D
        set "frame_38/texture"(value: Texture2D)
        get "frame_38/duration"(): float64
        set "frame_38/duration"(value: float64)
        get "frame_39/texture"(): Texture2D
        set "frame_39/texture"(value: Texture2D)
        get "frame_39/duration"(): float64
        set "frame_39/duration"(value: float64)
        get "frame_40/texture"(): Texture2D
        set "frame_40/texture"(value: Texture2D)
        get "frame_40/duration"(): float64
        set "frame_40/duration"(value: float64)
        get "frame_41/texture"(): Texture2D
        set "frame_41/texture"(value: Texture2D)
        get "frame_41/duration"(): float64
        set "frame_41/duration"(value: float64)
        get "frame_42/texture"(): Texture2D
        set "frame_42/texture"(value: Texture2D)
        get "frame_42/duration"(): float64
        set "frame_42/duration"(value: float64)
        get "frame_43/texture"(): Texture2D
        set "frame_43/texture"(value: Texture2D)
        get "frame_43/duration"(): float64
        set "frame_43/duration"(value: float64)
        get "frame_44/texture"(): Texture2D
        set "frame_44/texture"(value: Texture2D)
        get "frame_44/duration"(): float64
        set "frame_44/duration"(value: float64)
        get "frame_45/texture"(): Texture2D
        set "frame_45/texture"(value: Texture2D)
        get "frame_45/duration"(): float64
        set "frame_45/duration"(value: float64)
        get "frame_46/texture"(): Texture2D
        set "frame_46/texture"(value: Texture2D)
        get "frame_46/duration"(): float64
        set "frame_46/duration"(value: float64)
        get "frame_47/texture"(): Texture2D
        set "frame_47/texture"(value: Texture2D)
        get "frame_47/duration"(): float64
        set "frame_47/duration"(value: float64)
        get "frame_48/texture"(): Texture2D
        set "frame_48/texture"(value: Texture2D)
        get "frame_48/duration"(): float64
        set "frame_48/duration"(value: float64)
        get "frame_49/texture"(): Texture2D
        set "frame_49/texture"(value: Texture2D)
        get "frame_49/duration"(): float64
        set "frame_49/duration"(value: float64)
        get "frame_50/texture"(): Texture2D
        set "frame_50/texture"(value: Texture2D)
        get "frame_50/duration"(): float64
        set "frame_50/duration"(value: float64)
        get "frame_51/texture"(): Texture2D
        set "frame_51/texture"(value: Texture2D)
        get "frame_51/duration"(): float64
        set "frame_51/duration"(value: float64)
        get "frame_52/texture"(): Texture2D
        set "frame_52/texture"(value: Texture2D)
        get "frame_52/duration"(): float64
        set "frame_52/duration"(value: float64)
        get "frame_53/texture"(): Texture2D
        set "frame_53/texture"(value: Texture2D)
        get "frame_53/duration"(): float64
        set "frame_53/duration"(value: float64)
        get "frame_54/texture"(): Texture2D
        set "frame_54/texture"(value: Texture2D)
        get "frame_54/duration"(): float64
        set "frame_54/duration"(value: float64)
        get "frame_55/texture"(): Texture2D
        set "frame_55/texture"(value: Texture2D)
        get "frame_55/duration"(): float64
        set "frame_55/duration"(value: float64)
        get "frame_56/texture"(): Texture2D
        set "frame_56/texture"(value: Texture2D)
        get "frame_56/duration"(): float64
        set "frame_56/duration"(value: float64)
        get "frame_57/texture"(): Texture2D
        set "frame_57/texture"(value: Texture2D)
        get "frame_57/duration"(): float64
        set "frame_57/duration"(value: float64)
        get "frame_58/texture"(): Texture2D
        set "frame_58/texture"(value: Texture2D)
        get "frame_58/duration"(): float64
        set "frame_58/duration"(value: float64)
        get "frame_59/texture"(): Texture2D
        set "frame_59/texture"(value: Texture2D)
        get "frame_59/duration"(): float64
        set "frame_59/duration"(value: float64)
        get "frame_60/texture"(): Texture2D
        set "frame_60/texture"(value: Texture2D)
        get "frame_60/duration"(): float64
        set "frame_60/duration"(value: float64)
        get "frame_61/texture"(): Texture2D
        set "frame_61/texture"(value: Texture2D)
        get "frame_61/duration"(): float64
        set "frame_61/duration"(value: float64)
        get "frame_62/texture"(): Texture2D
        set "frame_62/texture"(value: Texture2D)
        get "frame_62/duration"(): float64
        set "frame_62/duration"(value: float64)
        get "frame_63/texture"(): Texture2D
        set "frame_63/texture"(value: Texture2D)
        get "frame_63/duration"(): float64
        set "frame_63/duration"(value: float64)
        get "frame_64/texture"(): Texture2D
        set "frame_64/texture"(value: Texture2D)
        get "frame_64/duration"(): float64
        set "frame_64/duration"(value: float64)
        get "frame_65/texture"(): Texture2D
        set "frame_65/texture"(value: Texture2D)
        get "frame_65/duration"(): float64
        set "frame_65/duration"(value: float64)
        get "frame_66/texture"(): Texture2D
        set "frame_66/texture"(value: Texture2D)
        get "frame_66/duration"(): float64
        set "frame_66/duration"(value: float64)
        get "frame_67/texture"(): Texture2D
        set "frame_67/texture"(value: Texture2D)
        get "frame_67/duration"(): float64
        set "frame_67/duration"(value: float64)
        get "frame_68/texture"(): Texture2D
        set "frame_68/texture"(value: Texture2D)
        get "frame_68/duration"(): float64
        set "frame_68/duration"(value: float64)
        get "frame_69/texture"(): Texture2D
        set "frame_69/texture"(value: Texture2D)
        get "frame_69/duration"(): float64
        set "frame_69/duration"(value: float64)
        get "frame_70/texture"(): Texture2D
        set "frame_70/texture"(value: Texture2D)
        get "frame_70/duration"(): float64
        set "frame_70/duration"(value: float64)
        get "frame_71/texture"(): Texture2D
        set "frame_71/texture"(value: Texture2D)
        get "frame_71/duration"(): float64
        set "frame_71/duration"(value: float64)
        get "frame_72/texture"(): Texture2D
        set "frame_72/texture"(value: Texture2D)
        get "frame_72/duration"(): float64
        set "frame_72/duration"(value: float64)
        get "frame_73/texture"(): Texture2D
        set "frame_73/texture"(value: Texture2D)
        get "frame_73/duration"(): float64
        set "frame_73/duration"(value: float64)
        get "frame_74/texture"(): Texture2D
        set "frame_74/texture"(value: Texture2D)
        get "frame_74/duration"(): float64
        set "frame_74/duration"(value: float64)
        get "frame_75/texture"(): Texture2D
        set "frame_75/texture"(value: Texture2D)
        get "frame_75/duration"(): float64
        set "frame_75/duration"(value: float64)
        get "frame_76/texture"(): Texture2D
        set "frame_76/texture"(value: Texture2D)
        get "frame_76/duration"(): float64
        set "frame_76/duration"(value: float64)
        get "frame_77/texture"(): Texture2D
        set "frame_77/texture"(value: Texture2D)
        get "frame_77/duration"(): float64
        set "frame_77/duration"(value: float64)
        get "frame_78/texture"(): Texture2D
        set "frame_78/texture"(value: Texture2D)
        get "frame_78/duration"(): float64
        set "frame_78/duration"(value: float64)
        get "frame_79/texture"(): Texture2D
        set "frame_79/texture"(value: Texture2D)
        get "frame_79/duration"(): float64
        set "frame_79/duration"(value: float64)
        get "frame_80/texture"(): Texture2D
        set "frame_80/texture"(value: Texture2D)
        get "frame_80/duration"(): float64
        set "frame_80/duration"(value: float64)
        get "frame_81/texture"(): Texture2D
        set "frame_81/texture"(value: Texture2D)
        get "frame_81/duration"(): float64
        set "frame_81/duration"(value: float64)
        get "frame_82/texture"(): Texture2D
        set "frame_82/texture"(value: Texture2D)
        get "frame_82/duration"(): float64
        set "frame_82/duration"(value: float64)
        get "frame_83/texture"(): Texture2D
        set "frame_83/texture"(value: Texture2D)
        get "frame_83/duration"(): float64
        set "frame_83/duration"(value: float64)
        get "frame_84/texture"(): Texture2D
        set "frame_84/texture"(value: Texture2D)
        get "frame_84/duration"(): float64
        set "frame_84/duration"(value: float64)
        get "frame_85/texture"(): Texture2D
        set "frame_85/texture"(value: Texture2D)
        get "frame_85/duration"(): float64
        set "frame_85/duration"(value: float64)
        get "frame_86/texture"(): Texture2D
        set "frame_86/texture"(value: Texture2D)
        get "frame_86/duration"(): float64
        set "frame_86/duration"(value: float64)
        get "frame_87/texture"(): Texture2D
        set "frame_87/texture"(value: Texture2D)
        get "frame_87/duration"(): float64
        set "frame_87/duration"(value: float64)
        get "frame_88/texture"(): Texture2D
        set "frame_88/texture"(value: Texture2D)
        get "frame_88/duration"(): float64
        set "frame_88/duration"(value: float64)
        get "frame_89/texture"(): Texture2D
        set "frame_89/texture"(value: Texture2D)
        get "frame_89/duration"(): float64
        set "frame_89/duration"(value: float64)
        get "frame_90/texture"(): Texture2D
        set "frame_90/texture"(value: Texture2D)
        get "frame_90/duration"(): float64
        set "frame_90/duration"(value: float64)
        get "frame_91/texture"(): Texture2D
        set "frame_91/texture"(value: Texture2D)
        get "frame_91/duration"(): float64
        set "frame_91/duration"(value: float64)
        get "frame_92/texture"(): Texture2D
        set "frame_92/texture"(value: Texture2D)
        get "frame_92/duration"(): float64
        set "frame_92/duration"(value: float64)
        get "frame_93/texture"(): Texture2D
        set "frame_93/texture"(value: Texture2D)
        get "frame_93/duration"(): float64
        set "frame_93/duration"(value: float64)
        get "frame_94/texture"(): Texture2D
        set "frame_94/texture"(value: Texture2D)
        get "frame_94/duration"(): float64
        set "frame_94/duration"(value: float64)
        get "frame_95/texture"(): Texture2D
        set "frame_95/texture"(value: Texture2D)
        get "frame_95/duration"(): float64
        set "frame_95/duration"(value: float64)
        get "frame_96/texture"(): Texture2D
        set "frame_96/texture"(value: Texture2D)
        get "frame_96/duration"(): float64
        set "frame_96/duration"(value: float64)
        get "frame_97/texture"(): Texture2D
        set "frame_97/texture"(value: Texture2D)
        get "frame_97/duration"(): float64
        set "frame_97/duration"(value: float64)
        get "frame_98/texture"(): Texture2D
        set "frame_98/texture"(value: Texture2D)
        get "frame_98/duration"(): float64
        set "frame_98/duration"(value: float64)
        get "frame_99/texture"(): Texture2D
        set "frame_99/texture"(value: Texture2D)
        get "frame_99/duration"(): float64
        set "frame_99/duration"(value: float64)
        get "frame_100/texture"(): Texture2D
        set "frame_100/texture"(value: Texture2D)
        get "frame_100/duration"(): float64
        set "frame_100/duration"(value: float64)
        get "frame_101/texture"(): Texture2D
        set "frame_101/texture"(value: Texture2D)
        get "frame_101/duration"(): float64
        set "frame_101/duration"(value: float64)
        get "frame_102/texture"(): Texture2D
        set "frame_102/texture"(value: Texture2D)
        get "frame_102/duration"(): float64
        set "frame_102/duration"(value: float64)
        get "frame_103/texture"(): Texture2D
        set "frame_103/texture"(value: Texture2D)
        get "frame_103/duration"(): float64
        set "frame_103/duration"(value: float64)
        get "frame_104/texture"(): Texture2D
        set "frame_104/texture"(value: Texture2D)
        get "frame_104/duration"(): float64
        set "frame_104/duration"(value: float64)
        get "frame_105/texture"(): Texture2D
        set "frame_105/texture"(value: Texture2D)
        get "frame_105/duration"(): float64
        set "frame_105/duration"(value: float64)
        get "frame_106/texture"(): Texture2D
        set "frame_106/texture"(value: Texture2D)
        get "frame_106/duration"(): float64
        set "frame_106/duration"(value: float64)
        get "frame_107/texture"(): Texture2D
        set "frame_107/texture"(value: Texture2D)
        get "frame_107/duration"(): float64
        set "frame_107/duration"(value: float64)
        get "frame_108/texture"(): Texture2D
        set "frame_108/texture"(value: Texture2D)
        get "frame_108/duration"(): float64
        set "frame_108/duration"(value: float64)
        get "frame_109/texture"(): Texture2D
        set "frame_109/texture"(value: Texture2D)
        get "frame_109/duration"(): float64
        set "frame_109/duration"(value: float64)
        get "frame_110/texture"(): Texture2D
        set "frame_110/texture"(value: Texture2D)
        get "frame_110/duration"(): float64
        set "frame_110/duration"(value: float64)
        get "frame_111/texture"(): Texture2D
        set "frame_111/texture"(value: Texture2D)
        get "frame_111/duration"(): float64
        set "frame_111/duration"(value: float64)
        get "frame_112/texture"(): Texture2D
        set "frame_112/texture"(value: Texture2D)
        get "frame_112/duration"(): float64
        set "frame_112/duration"(value: float64)
        get "frame_113/texture"(): Texture2D
        set "frame_113/texture"(value: Texture2D)
        get "frame_113/duration"(): float64
        set "frame_113/duration"(value: float64)
        get "frame_114/texture"(): Texture2D
        set "frame_114/texture"(value: Texture2D)
        get "frame_114/duration"(): float64
        set "frame_114/duration"(value: float64)
        get "frame_115/texture"(): Texture2D
        set "frame_115/texture"(value: Texture2D)
        get "frame_115/duration"(): float64
        set "frame_115/duration"(value: float64)
        get "frame_116/texture"(): Texture2D
        set "frame_116/texture"(value: Texture2D)
        get "frame_116/duration"(): float64
        set "frame_116/duration"(value: float64)
        get "frame_117/texture"(): Texture2D
        set "frame_117/texture"(value: Texture2D)
        get "frame_117/duration"(): float64
        set "frame_117/duration"(value: float64)
        get "frame_118/texture"(): Texture2D
        set "frame_118/texture"(value: Texture2D)
        get "frame_118/duration"(): float64
        set "frame_118/duration"(value: float64)
        get "frame_119/texture"(): Texture2D
        set "frame_119/texture"(value: Texture2D)
        get "frame_119/duration"(): float64
        set "frame_119/duration"(value: float64)
        get "frame_120/texture"(): Texture2D
        set "frame_120/texture"(value: Texture2D)
        get "frame_120/duration"(): float64
        set "frame_120/duration"(value: float64)
        get "frame_121/texture"(): Texture2D
        set "frame_121/texture"(value: Texture2D)
        get "frame_121/duration"(): float64
        set "frame_121/duration"(value: float64)
        get "frame_122/texture"(): Texture2D
        set "frame_122/texture"(value: Texture2D)
        get "frame_122/duration"(): float64
        set "frame_122/duration"(value: float64)
        get "frame_123/texture"(): Texture2D
        set "frame_123/texture"(value: Texture2D)
        get "frame_123/duration"(): float64
        set "frame_123/duration"(value: float64)
        get "frame_124/texture"(): Texture2D
        set "frame_124/texture"(value: Texture2D)
        get "frame_124/duration"(): float64
        set "frame_124/duration"(value: float64)
        get "frame_125/texture"(): Texture2D
        set "frame_125/texture"(value: Texture2D)
        get "frame_125/duration"(): float64
        set "frame_125/duration"(value: float64)
        get "frame_126/texture"(): Texture2D
        set "frame_126/texture"(value: Texture2D)
        get "frame_126/duration"(): float64
        set "frame_126/duration"(value: float64)
        get "frame_127/texture"(): Texture2D
        set "frame_127/texture"(value: Texture2D)
        get "frame_127/duration"(): float64
        set "frame_127/duration"(value: float64)
        get "frame_128/texture"(): Texture2D
        set "frame_128/texture"(value: Texture2D)
        get "frame_128/duration"(): float64
        set "frame_128/duration"(value: float64)
        get "frame_129/texture"(): Texture2D
        set "frame_129/texture"(value: Texture2D)
        get "frame_129/duration"(): float64
        set "frame_129/duration"(value: float64)
        get "frame_130/texture"(): Texture2D
        set "frame_130/texture"(value: Texture2D)
        get "frame_130/duration"(): float64
        set "frame_130/duration"(value: float64)
        get "frame_131/texture"(): Texture2D
        set "frame_131/texture"(value: Texture2D)
        get "frame_131/duration"(): float64
        set "frame_131/duration"(value: float64)
        get "frame_132/texture"(): Texture2D
        set "frame_132/texture"(value: Texture2D)
        get "frame_132/duration"(): float64
        set "frame_132/duration"(value: float64)
        get "frame_133/texture"(): Texture2D
        set "frame_133/texture"(value: Texture2D)
        get "frame_133/duration"(): float64
        set "frame_133/duration"(value: float64)
        get "frame_134/texture"(): Texture2D
        set "frame_134/texture"(value: Texture2D)
        get "frame_134/duration"(): float64
        set "frame_134/duration"(value: float64)
        get "frame_135/texture"(): Texture2D
        set "frame_135/texture"(value: Texture2D)
        get "frame_135/duration"(): float64
        set "frame_135/duration"(value: float64)
        get "frame_136/texture"(): Texture2D
        set "frame_136/texture"(value: Texture2D)
        get "frame_136/duration"(): float64
        set "frame_136/duration"(value: float64)
        get "frame_137/texture"(): Texture2D
        set "frame_137/texture"(value: Texture2D)
        get "frame_137/duration"(): float64
        set "frame_137/duration"(value: float64)
        get "frame_138/texture"(): Texture2D
        set "frame_138/texture"(value: Texture2D)
        get "frame_138/duration"(): float64
        set "frame_138/duration"(value: float64)
        get "frame_139/texture"(): Texture2D
        set "frame_139/texture"(value: Texture2D)
        get "frame_139/duration"(): float64
        set "frame_139/duration"(value: float64)
        get "frame_140/texture"(): Texture2D
        set "frame_140/texture"(value: Texture2D)
        get "frame_140/duration"(): float64
        set "frame_140/duration"(value: float64)
        get "frame_141/texture"(): Texture2D
        set "frame_141/texture"(value: Texture2D)
        get "frame_141/duration"(): float64
        set "frame_141/duration"(value: float64)
        get "frame_142/texture"(): Texture2D
        set "frame_142/texture"(value: Texture2D)
        get "frame_142/duration"(): float64
        set "frame_142/duration"(value: float64)
        get "frame_143/texture"(): Texture2D
        set "frame_143/texture"(value: Texture2D)
        get "frame_143/duration"(): float64
        set "frame_143/duration"(value: float64)
        get "frame_144/texture"(): Texture2D
        set "frame_144/texture"(value: Texture2D)
        get "frame_144/duration"(): float64
        set "frame_144/duration"(value: float64)
        get "frame_145/texture"(): Texture2D
        set "frame_145/texture"(value: Texture2D)
        get "frame_145/duration"(): float64
        set "frame_145/duration"(value: float64)
        get "frame_146/texture"(): Texture2D
        set "frame_146/texture"(value: Texture2D)
        get "frame_146/duration"(): float64
        set "frame_146/duration"(value: float64)
        get "frame_147/texture"(): Texture2D
        set "frame_147/texture"(value: Texture2D)
        get "frame_147/duration"(): float64
        set "frame_147/duration"(value: float64)
        get "frame_148/texture"(): Texture2D
        set "frame_148/texture"(value: Texture2D)
        get "frame_148/duration"(): float64
        set "frame_148/duration"(value: float64)
        get "frame_149/texture"(): Texture2D
        set "frame_149/texture"(value: Texture2D)
        get "frame_149/duration"(): float64
        set "frame_149/duration"(value: float64)
        get "frame_150/texture"(): Texture2D
        set "frame_150/texture"(value: Texture2D)
        get "frame_150/duration"(): float64
        set "frame_150/duration"(value: float64)
        get "frame_151/texture"(): Texture2D
        set "frame_151/texture"(value: Texture2D)
        get "frame_151/duration"(): float64
        set "frame_151/duration"(value: float64)
        get "frame_152/texture"(): Texture2D
        set "frame_152/texture"(value: Texture2D)
        get "frame_152/duration"(): float64
        set "frame_152/duration"(value: float64)
        get "frame_153/texture"(): Texture2D
        set "frame_153/texture"(value: Texture2D)
        get "frame_153/duration"(): float64
        set "frame_153/duration"(value: float64)
        get "frame_154/texture"(): Texture2D
        set "frame_154/texture"(value: Texture2D)
        get "frame_154/duration"(): float64
        set "frame_154/duration"(value: float64)
        get "frame_155/texture"(): Texture2D
        set "frame_155/texture"(value: Texture2D)
        get "frame_155/duration"(): float64
        set "frame_155/duration"(value: float64)
        get "frame_156/texture"(): Texture2D
        set "frame_156/texture"(value: Texture2D)
        get "frame_156/duration"(): float64
        set "frame_156/duration"(value: float64)
        get "frame_157/texture"(): Texture2D
        set "frame_157/texture"(value: Texture2D)
        get "frame_157/duration"(): float64
        set "frame_157/duration"(value: float64)
        get "frame_158/texture"(): Texture2D
        set "frame_158/texture"(value: Texture2D)
        get "frame_158/duration"(): float64
        set "frame_158/duration"(value: float64)
        get "frame_159/texture"(): Texture2D
        set "frame_159/texture"(value: Texture2D)
        get "frame_159/duration"(): float64
        set "frame_159/duration"(value: float64)
        get "frame_160/texture"(): Texture2D
        set "frame_160/texture"(value: Texture2D)
        get "frame_160/duration"(): float64
        set "frame_160/duration"(value: float64)
        get "frame_161/texture"(): Texture2D
        set "frame_161/texture"(value: Texture2D)
        get "frame_161/duration"(): float64
        set "frame_161/duration"(value: float64)
        get "frame_162/texture"(): Texture2D
        set "frame_162/texture"(value: Texture2D)
        get "frame_162/duration"(): float64
        set "frame_162/duration"(value: float64)
        get "frame_163/texture"(): Texture2D
        set "frame_163/texture"(value: Texture2D)
        get "frame_163/duration"(): float64
        set "frame_163/duration"(value: float64)
        get "frame_164/texture"(): Texture2D
        set "frame_164/texture"(value: Texture2D)
        get "frame_164/duration"(): float64
        set "frame_164/duration"(value: float64)
        get "frame_165/texture"(): Texture2D
        set "frame_165/texture"(value: Texture2D)
        get "frame_165/duration"(): float64
        set "frame_165/duration"(value: float64)
        get "frame_166/texture"(): Texture2D
        set "frame_166/texture"(value: Texture2D)
        get "frame_166/duration"(): float64
        set "frame_166/duration"(value: float64)
        get "frame_167/texture"(): Texture2D
        set "frame_167/texture"(value: Texture2D)
        get "frame_167/duration"(): float64
        set "frame_167/duration"(value: float64)
        get "frame_168/texture"(): Texture2D
        set "frame_168/texture"(value: Texture2D)
        get "frame_168/duration"(): float64
        set "frame_168/duration"(value: float64)
        get "frame_169/texture"(): Texture2D
        set "frame_169/texture"(value: Texture2D)
        get "frame_169/duration"(): float64
        set "frame_169/duration"(value: float64)
        get "frame_170/texture"(): Texture2D
        set "frame_170/texture"(value: Texture2D)
        get "frame_170/duration"(): float64
        set "frame_170/duration"(value: float64)
        get "frame_171/texture"(): Texture2D
        set "frame_171/texture"(value: Texture2D)
        get "frame_171/duration"(): float64
        set "frame_171/duration"(value: float64)
        get "frame_172/texture"(): Texture2D
        set "frame_172/texture"(value: Texture2D)
        get "frame_172/duration"(): float64
        set "frame_172/duration"(value: float64)
        get "frame_173/texture"(): Texture2D
        set "frame_173/texture"(value: Texture2D)
        get "frame_173/duration"(): float64
        set "frame_173/duration"(value: float64)
        get "frame_174/texture"(): Texture2D
        set "frame_174/texture"(value: Texture2D)
        get "frame_174/duration"(): float64
        set "frame_174/duration"(value: float64)
        get "frame_175/texture"(): Texture2D
        set "frame_175/texture"(value: Texture2D)
        get "frame_175/duration"(): float64
        set "frame_175/duration"(value: float64)
        get "frame_176/texture"(): Texture2D
        set "frame_176/texture"(value: Texture2D)
        get "frame_176/duration"(): float64
        set "frame_176/duration"(value: float64)
        get "frame_177/texture"(): Texture2D
        set "frame_177/texture"(value: Texture2D)
        get "frame_177/duration"(): float64
        set "frame_177/duration"(value: float64)
        get "frame_178/texture"(): Texture2D
        set "frame_178/texture"(value: Texture2D)
        get "frame_178/duration"(): float64
        set "frame_178/duration"(value: float64)
        get "frame_179/texture"(): Texture2D
        set "frame_179/texture"(value: Texture2D)
        get "frame_179/duration"(): float64
        set "frame_179/duration"(value: float64)
        get "frame_180/texture"(): Texture2D
        set "frame_180/texture"(value: Texture2D)
        get "frame_180/duration"(): float64
        set "frame_180/duration"(value: float64)
        get "frame_181/texture"(): Texture2D
        set "frame_181/texture"(value: Texture2D)
        get "frame_181/duration"(): float64
        set "frame_181/duration"(value: float64)
        get "frame_182/texture"(): Texture2D
        set "frame_182/texture"(value: Texture2D)
        get "frame_182/duration"(): float64
        set "frame_182/duration"(value: float64)
        get "frame_183/texture"(): Texture2D
        set "frame_183/texture"(value: Texture2D)
        get "frame_183/duration"(): float64
        set "frame_183/duration"(value: float64)
        get "frame_184/texture"(): Texture2D
        set "frame_184/texture"(value: Texture2D)
        get "frame_184/duration"(): float64
        set "frame_184/duration"(value: float64)
        get "frame_185/texture"(): Texture2D
        set "frame_185/texture"(value: Texture2D)
        get "frame_185/duration"(): float64
        set "frame_185/duration"(value: float64)
        get "frame_186/texture"(): Texture2D
        set "frame_186/texture"(value: Texture2D)
        get "frame_186/duration"(): float64
        set "frame_186/duration"(value: float64)
        get "frame_187/texture"(): Texture2D
        set "frame_187/texture"(value: Texture2D)
        get "frame_187/duration"(): float64
        set "frame_187/duration"(value: float64)
        get "frame_188/texture"(): Texture2D
        set "frame_188/texture"(value: Texture2D)
        get "frame_188/duration"(): float64
        set "frame_188/duration"(value: float64)
        get "frame_189/texture"(): Texture2D
        set "frame_189/texture"(value: Texture2D)
        get "frame_189/duration"(): float64
        set "frame_189/duration"(value: float64)
        get "frame_190/texture"(): Texture2D
        set "frame_190/texture"(value: Texture2D)
        get "frame_190/duration"(): float64
        set "frame_190/duration"(value: float64)
        get "frame_191/texture"(): Texture2D
        set "frame_191/texture"(value: Texture2D)
        get "frame_191/duration"(): float64
        set "frame_191/duration"(value: float64)
        get "frame_192/texture"(): Texture2D
        set "frame_192/texture"(value: Texture2D)
        get "frame_192/duration"(): float64
        set "frame_192/duration"(value: float64)
        get "frame_193/texture"(): Texture2D
        set "frame_193/texture"(value: Texture2D)
        get "frame_193/duration"(): float64
        set "frame_193/duration"(value: float64)
        get "frame_194/texture"(): Texture2D
        set "frame_194/texture"(value: Texture2D)
        get "frame_194/duration"(): float64
        set "frame_194/duration"(value: float64)
        get "frame_195/texture"(): Texture2D
        set "frame_195/texture"(value: Texture2D)
        get "frame_195/duration"(): float64
        set "frame_195/duration"(value: float64)
        get "frame_196/texture"(): Texture2D
        set "frame_196/texture"(value: Texture2D)
        get "frame_196/duration"(): float64
        set "frame_196/duration"(value: float64)
        get "frame_197/texture"(): Texture2D
        set "frame_197/texture"(value: Texture2D)
        get "frame_197/duration"(): float64
        set "frame_197/duration"(value: float64)
        get "frame_198/texture"(): Texture2D
        set "frame_198/texture"(value: Texture2D)
        get "frame_198/duration"(): float64
        set "frame_198/duration"(value: float64)
        get "frame_199/texture"(): Texture2D
        set "frame_199/texture"(value: Texture2D)
        get "frame_199/duration"(): float64
        set "frame_199/duration"(value: float64)
        get "frame_200/texture"(): Texture2D
        set "frame_200/texture"(value: Texture2D)
        get "frame_200/duration"(): float64
        set "frame_200/duration"(value: float64)
        get "frame_201/texture"(): Texture2D
        set "frame_201/texture"(value: Texture2D)
        get "frame_201/duration"(): float64
        set "frame_201/duration"(value: float64)
        get "frame_202/texture"(): Texture2D
        set "frame_202/texture"(value: Texture2D)
        get "frame_202/duration"(): float64
        set "frame_202/duration"(value: float64)
        get "frame_203/texture"(): Texture2D
        set "frame_203/texture"(value: Texture2D)
        get "frame_203/duration"(): float64
        set "frame_203/duration"(value: float64)
        get "frame_204/texture"(): Texture2D
        set "frame_204/texture"(value: Texture2D)
        get "frame_204/duration"(): float64
        set "frame_204/duration"(value: float64)
        get "frame_205/texture"(): Texture2D
        set "frame_205/texture"(value: Texture2D)
        get "frame_205/duration"(): float64
        set "frame_205/duration"(value: float64)
        get "frame_206/texture"(): Texture2D
        set "frame_206/texture"(value: Texture2D)
        get "frame_206/duration"(): float64
        set "frame_206/duration"(value: float64)
        get "frame_207/texture"(): Texture2D
        set "frame_207/texture"(value: Texture2D)
        get "frame_207/duration"(): float64
        set "frame_207/duration"(value: float64)
        get "frame_208/texture"(): Texture2D
        set "frame_208/texture"(value: Texture2D)
        get "frame_208/duration"(): float64
        set "frame_208/duration"(value: float64)
        get "frame_209/texture"(): Texture2D
        set "frame_209/texture"(value: Texture2D)
        get "frame_209/duration"(): float64
        set "frame_209/duration"(value: float64)
        get "frame_210/texture"(): Texture2D
        set "frame_210/texture"(value: Texture2D)
        get "frame_210/duration"(): float64
        set "frame_210/duration"(value: float64)
        get "frame_211/texture"(): Texture2D
        set "frame_211/texture"(value: Texture2D)
        get "frame_211/duration"(): float64
        set "frame_211/duration"(value: float64)
        get "frame_212/texture"(): Texture2D
        set "frame_212/texture"(value: Texture2D)
        get "frame_212/duration"(): float64
        set "frame_212/duration"(value: float64)
        get "frame_213/texture"(): Texture2D
        set "frame_213/texture"(value: Texture2D)
        get "frame_213/duration"(): float64
        set "frame_213/duration"(value: float64)
        get "frame_214/texture"(): Texture2D
        set "frame_214/texture"(value: Texture2D)
        get "frame_214/duration"(): float64
        set "frame_214/duration"(value: float64)
        get "frame_215/texture"(): Texture2D
        set "frame_215/texture"(value: Texture2D)
        get "frame_215/duration"(): float64
        set "frame_215/duration"(value: float64)
        get "frame_216/texture"(): Texture2D
        set "frame_216/texture"(value: Texture2D)
        get "frame_216/duration"(): float64
        set "frame_216/duration"(value: float64)
        get "frame_217/texture"(): Texture2D
        set "frame_217/texture"(value: Texture2D)
        get "frame_217/duration"(): float64
        set "frame_217/duration"(value: float64)
        get "frame_218/texture"(): Texture2D
        set "frame_218/texture"(value: Texture2D)
        get "frame_218/duration"(): float64
        set "frame_218/duration"(value: float64)
        get "frame_219/texture"(): Texture2D
        set "frame_219/texture"(value: Texture2D)
        get "frame_219/duration"(): float64
        set "frame_219/duration"(value: float64)
        get "frame_220/texture"(): Texture2D
        set "frame_220/texture"(value: Texture2D)
        get "frame_220/duration"(): float64
        set "frame_220/duration"(value: float64)
        get "frame_221/texture"(): Texture2D
        set "frame_221/texture"(value: Texture2D)
        get "frame_221/duration"(): float64
        set "frame_221/duration"(value: float64)
        get "frame_222/texture"(): Texture2D
        set "frame_222/texture"(value: Texture2D)
        get "frame_222/duration"(): float64
        set "frame_222/duration"(value: float64)
        get "frame_223/texture"(): Texture2D
        set "frame_223/texture"(value: Texture2D)
        get "frame_223/duration"(): float64
        set "frame_223/duration"(value: float64)
        get "frame_224/texture"(): Texture2D
        set "frame_224/texture"(value: Texture2D)
        get "frame_224/duration"(): float64
        set "frame_224/duration"(value: float64)
        get "frame_225/texture"(): Texture2D
        set "frame_225/texture"(value: Texture2D)
        get "frame_225/duration"(): float64
        set "frame_225/duration"(value: float64)
        get "frame_226/texture"(): Texture2D
        set "frame_226/texture"(value: Texture2D)
        get "frame_226/duration"(): float64
        set "frame_226/duration"(value: float64)
        get "frame_227/texture"(): Texture2D
        set "frame_227/texture"(value: Texture2D)
        get "frame_227/duration"(): float64
        set "frame_227/duration"(value: float64)
        get "frame_228/texture"(): Texture2D
        set "frame_228/texture"(value: Texture2D)
        get "frame_228/duration"(): float64
        set "frame_228/duration"(value: float64)
        get "frame_229/texture"(): Texture2D
        set "frame_229/texture"(value: Texture2D)
        get "frame_229/duration"(): float64
        set "frame_229/duration"(value: float64)
        get "frame_230/texture"(): Texture2D
        set "frame_230/texture"(value: Texture2D)
        get "frame_230/duration"(): float64
        set "frame_230/duration"(value: float64)
        get "frame_231/texture"(): Texture2D
        set "frame_231/texture"(value: Texture2D)
        get "frame_231/duration"(): float64
        set "frame_231/duration"(value: float64)
        get "frame_232/texture"(): Texture2D
        set "frame_232/texture"(value: Texture2D)
        get "frame_232/duration"(): float64
        set "frame_232/duration"(value: float64)
        get "frame_233/texture"(): Texture2D
        set "frame_233/texture"(value: Texture2D)
        get "frame_233/duration"(): float64
        set "frame_233/duration"(value: float64)
        get "frame_234/texture"(): Texture2D
        set "frame_234/texture"(value: Texture2D)
        get "frame_234/duration"(): float64
        set "frame_234/duration"(value: float64)
        get "frame_235/texture"(): Texture2D
        set "frame_235/texture"(value: Texture2D)
        get "frame_235/duration"(): float64
        set "frame_235/duration"(value: float64)
        get "frame_236/texture"(): Texture2D
        set "frame_236/texture"(value: Texture2D)
        get "frame_236/duration"(): float64
        set "frame_236/duration"(value: float64)
        get "frame_237/texture"(): Texture2D
        set "frame_237/texture"(value: Texture2D)
        get "frame_237/duration"(): float64
        set "frame_237/duration"(value: float64)
        get "frame_238/texture"(): Texture2D
        set "frame_238/texture"(value: Texture2D)
        get "frame_238/duration"(): float64
        set "frame_238/duration"(value: float64)
        get "frame_239/texture"(): Texture2D
        set "frame_239/texture"(value: Texture2D)
        get "frame_239/duration"(): float64
        set "frame_239/duration"(value: float64)
        get "frame_240/texture"(): Texture2D
        set "frame_240/texture"(value: Texture2D)
        get "frame_240/duration"(): float64
        set "frame_240/duration"(value: float64)
        get "frame_241/texture"(): Texture2D
        set "frame_241/texture"(value: Texture2D)
        get "frame_241/duration"(): float64
        set "frame_241/duration"(value: float64)
        get "frame_242/texture"(): Texture2D
        set "frame_242/texture"(value: Texture2D)
        get "frame_242/duration"(): float64
        set "frame_242/duration"(value: float64)
        get "frame_243/texture"(): Texture2D
        set "frame_243/texture"(value: Texture2D)
        get "frame_243/duration"(): float64
        set "frame_243/duration"(value: float64)
        get "frame_244/texture"(): Texture2D
        set "frame_244/texture"(value: Texture2D)
        get "frame_244/duration"(): float64
        set "frame_244/duration"(value: float64)
        get "frame_245/texture"(): Texture2D
        set "frame_245/texture"(value: Texture2D)
        get "frame_245/duration"(): float64
        set "frame_245/duration"(value: float64)
        get "frame_246/texture"(): Texture2D
        set "frame_246/texture"(value: Texture2D)
        get "frame_246/duration"(): float64
        set "frame_246/duration"(value: float64)
        get "frame_247/texture"(): Texture2D
        set "frame_247/texture"(value: Texture2D)
        get "frame_247/duration"(): float64
        set "frame_247/duration"(value: float64)
        get "frame_248/texture"(): Texture2D
        set "frame_248/texture"(value: Texture2D)
        get "frame_248/duration"(): float64
        set "frame_248/duration"(value: float64)
        get "frame_249/texture"(): Texture2D
        set "frame_249/texture"(value: Texture2D)
        get "frame_249/duration"(): float64
        set "frame_249/duration"(value: float64)
        get "frame_250/texture"(): Texture2D
        set "frame_250/texture"(value: Texture2D)
        get "frame_250/duration"(): float64
        set "frame_250/duration"(value: float64)
        get "frame_251/texture"(): Texture2D
        set "frame_251/texture"(value: Texture2D)
        get "frame_251/duration"(): float64
        set "frame_251/duration"(value: float64)
        get "frame_252/texture"(): Texture2D
        set "frame_252/texture"(value: Texture2D)
        get "frame_252/duration"(): float64
        set "frame_252/duration"(value: float64)
        get "frame_253/texture"(): Texture2D
        set "frame_253/texture"(value: Texture2D)
        get "frame_253/duration"(): float64
        set "frame_253/duration"(value: float64)
        get "frame_254/texture"(): Texture2D
        set "frame_254/texture"(value: Texture2D)
        get "frame_254/duration"(): float64
        set "frame_254/duration"(value: float64)
        get "frame_255/texture"(): Texture2D
        set "frame_255/texture"(value: Texture2D)
        get "frame_255/duration"(): float64
        set "frame_255/duration"(value: float64)
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animation.html  
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
        
        /** Adds a marker to this Animation. */
        add_marker(name: StringName, time: float64): void
        
        /** Removes the marker with the given name from this Animation. */
        remove_marker(name: StringName): void
        
        /** Returns `true` if this Animation contains a marker with the given name. */
        has_marker(name: StringName): boolean
        
        /** Returns the name of the marker located at the given time. */
        get_marker_at_time(time: float64): StringName
        
        /** Returns the closest marker that comes after the given time. If no such marker exists, an empty string is returned. */
        get_next_marker(time: float64): StringName
        
        /** Returns the closest marker that comes before the given time. If no such marker exists, an empty string is returned. */
        get_prev_marker(time: float64): StringName
        
        /** Returns the given marker's time. */
        get_marker_time(name: StringName): float64
        
        /** Returns every marker in this Animation, sorted ascending by time. */
        get_marker_names(): PackedStringArray
        
        /** Returns the given marker's color. */
        get_marker_color(name: StringName): Color
        
        /** Sets the given marker's color. */
        set_marker_color(name: StringName, color: Color): void
        
        /** Clear the animation (clear all tracks and reset all). */
        clear(): void
        
        /** Adds a new track to [param to_animation] that is a copy of the given track from this animation. */
        copy_track(track_idx: int64, to_animation: Animation): void
        
        /** Optimize the animation and all its tracks in-place. This will preserve only as many keys as are necessary to keep the animation within the specified bounds. */
        optimize(allowed_velocity_err: float64 = 0.01, allowed_angular_err: float64 = 0.01, precision: int64 = 3): void
        
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
    class AnimationBezierTrackEdit<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationlibrary.html  
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
        
        /** Returns the key count for the [Animation]s stored in the library. */
        get_animation_list_size(): int64
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
    class AnimationLibraryEditor<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
        _update_editor(mixer: Object): void
        readonly update_editor: Signal0
    }
    class AnimationMarkerEdit<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
        _clear_selection_for_anim(_unnamed_arg0: Animation): void
        _select_key(_unnamed_arg0: StringName, _unnamed_arg1: boolean): void
        _deselect_key(_unnamed_arg0: StringName): void
    }
    class AnimationMarkerKeyEditEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
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
             *  If a value track has un-interpolatable type key values, it is internally converted to use [constant ANIMATION_CALLBACK_MODE_DISCRETE_RECESSIVE] with [constant Animation.UPDATE_DISCRETE].  
             *  Un-interpolatable type list:  
             *  - [constant @GlobalScope.TYPE_NIL]  
             *  - [constant @GlobalScope.TYPE_NODE_PATH]  
             *  - [constant @GlobalScope.TYPE_RID]  
             *  - [constant @GlobalScope.TYPE_OBJECT]  
             *  - [constant @GlobalScope.TYPE_CALLABLE]  
             *  - [constant @GlobalScope.TYPE_SIGNAL]  
             *  - [constant @GlobalScope.TYPE_DICTIONARY]  
             *  - [constant @GlobalScope.TYPE_PACKED_BYTE_ARRAY]  
             *  [constant @GlobalScope.TYPE_BOOL] and [constant @GlobalScope.TYPE_INT] are treated as [constant @GlobalScope.TYPE_FLOAT] during blending and rounded when the result is retrieved.  
             *  It is same for arrays and vectors with them such as [constant @GlobalScope.TYPE_PACKED_INT32_ARRAY] or [constant @GlobalScope.TYPE_VECTOR2I], they are treated as [constant @GlobalScope.TYPE_PACKED_FLOAT32_ARRAY] or [constant @GlobalScope.TYPE_VECTOR2]. Also note that for arrays, the size is also interpolated.  
             *  [constant @GlobalScope.TYPE_STRING] and [constant @GlobalScope.TYPE_STRING_NAME] are interpolated between character codes and lengths, but note that there is a difference in algorithm between interpolation between keys and interpolation by blending.  
             */
            ANIMATION_CALLBACK_MODE_DISCRETE_FORCE_CONTINUOUS = 2,
        }
    }
    /** Base class for [AnimationPlayer] and [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationmixer.html  
     */
    class AnimationMixer<Map extends Record<string, Node> = Record<string, Node>> extends Node<Map> {
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
         *  If [member root_motion_local] is `true`, return the pre-multiplied translation value with the inverted rotation.  
         *  In this case, the code can be written as follows:  
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
        
        /** If `true`, [method get_root_motion_position] value is extracted as a local translation value before blending. In other words, it is treated like the translation is done after the rotation. */
        get root_motion_local(): boolean
        set root_motion_local(value: boolean)
        
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnode.html  
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
        
        /** Returns `true` if the given path is filtered. */
        is_path_filtered(path: NodePath | string): boolean
        
        /** Returns the object id of the [AnimationTree] that owns this node.  
         *      
         *  **Note:** This method should only be called from within the [method AnimationNodeExtension._process_animation_node] method, and will return an invalid id otherwise.  
         */
        get_processing_animation_tree_instance_id(): int64
        
        /** Returns `true` if this animation node is being processed in test-only mode. */
        is_process_testing(): boolean
        
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeadd2.html  
     */
    class AnimationNodeAdd2 extends AnimationNodeSync {
        constructor(identifier?: any)
    }
    /** Blends two of three animations additively inside of an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeadd3.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeanimation.html  
     */
    class AnimationNodeAnimation extends AnimationRootNode {
        constructor(identifier?: any)
        /** Animation to use as an output. It is one of the animations provided by [member AnimationTree.anim_player]. */
        get animation(): StringName
        set animation(value: StringName)
        
        /** Determines the playback direction of the animation. */
        get play_mode(): int64
        set play_mode(value: int64)
        
        /** If `true`, on receiving a request to play an animation from the start, the first frame is not drawn, but only processed, and playback starts from the next frame.  
         *  See also the notes of [method AnimationPlayer.play].  
         */
        get advance_on_start(): boolean
        set advance_on_start(value: boolean)
        
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeblend2.html  
     */
    class AnimationNodeBlend2 extends AnimationNodeSync {
        constructor(identifier?: any)
    }
    /** Blends two of three animations linearly inside of an [AnimationNodeBlendTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeblend3.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeblendspace1d.html  
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
        get "blend_point_0/node"(): AnimationRootNode
        set "blend_point_0/node"(value: AnimationRootNode)
        get "blend_point_0/pos"(): float64
        set "blend_point_0/pos"(value: float64)
        get "blend_point_1/node"(): AnimationRootNode
        set "blend_point_1/node"(value: AnimationRootNode)
        get "blend_point_1/pos"(): float64
        set "blend_point_1/pos"(value: float64)
        get "blend_point_2/node"(): AnimationRootNode
        set "blend_point_2/node"(value: AnimationRootNode)
        get "blend_point_2/pos"(): float64
        set "blend_point_2/pos"(value: float64)
        get "blend_point_3/node"(): AnimationRootNode
        set "blend_point_3/node"(value: AnimationRootNode)
        get "blend_point_3/pos"(): float64
        set "blend_point_3/pos"(value: float64)
        get "blend_point_4/node"(): AnimationRootNode
        set "blend_point_4/node"(value: AnimationRootNode)
        get "blend_point_4/pos"(): float64
        set "blend_point_4/pos"(value: float64)
        get "blend_point_5/node"(): AnimationRootNode
        set "blend_point_5/node"(value: AnimationRootNode)
        get "blend_point_5/pos"(): float64
        set "blend_point_5/pos"(value: float64)
        get "blend_point_6/node"(): AnimationRootNode
        set "blend_point_6/node"(value: AnimationRootNode)
        get "blend_point_6/pos"(): float64
        set "blend_point_6/pos"(value: float64)
        get "blend_point_7/node"(): AnimationRootNode
        set "blend_point_7/node"(value: AnimationRootNode)
        get "blend_point_7/pos"(): float64
        set "blend_point_7/pos"(value: float64)
        get "blend_point_8/node"(): AnimationRootNode
        set "blend_point_8/node"(value: AnimationRootNode)
        get "blend_point_8/pos"(): float64
        set "blend_point_8/pos"(value: float64)
        get "blend_point_9/node"(): AnimationRootNode
        set "blend_point_9/node"(value: AnimationRootNode)
        get "blend_point_9/pos"(): float64
        set "blend_point_9/pos"(value: float64)
        get "blend_point_10/node"(): AnimationRootNode
        set "blend_point_10/node"(value: AnimationRootNode)
        get "blend_point_10/pos"(): float64
        set "blend_point_10/pos"(value: float64)
        get "blend_point_11/node"(): AnimationRootNode
        set "blend_point_11/node"(value: AnimationRootNode)
        get "blend_point_11/pos"(): float64
        set "blend_point_11/pos"(value: float64)
        get "blend_point_12/node"(): AnimationRootNode
        set "blend_point_12/node"(value: AnimationRootNode)
        get "blend_point_12/pos"(): float64
        set "blend_point_12/pos"(value: float64)
        get "blend_point_13/node"(): AnimationRootNode
        set "blend_point_13/node"(value: AnimationRootNode)
        get "blend_point_13/pos"(): float64
        set "blend_point_13/pos"(value: float64)
        get "blend_point_14/node"(): AnimationRootNode
        set "blend_point_14/node"(value: AnimationRootNode)
        get "blend_point_14/pos"(): float64
        set "blend_point_14/pos"(value: float64)
        get "blend_point_15/node"(): AnimationRootNode
        set "blend_point_15/node"(value: AnimationRootNode)
        get "blend_point_15/pos"(): float64
        set "blend_point_15/pos"(value: float64)
        get "blend_point_16/node"(): AnimationRootNode
        set "blend_point_16/node"(value: AnimationRootNode)
        get "blend_point_16/pos"(): float64
        set "blend_point_16/pos"(value: float64)
        get "blend_point_17/node"(): AnimationRootNode
        set "blend_point_17/node"(value: AnimationRootNode)
        get "blend_point_17/pos"(): float64
        set "blend_point_17/pos"(value: float64)
        get "blend_point_18/node"(): AnimationRootNode
        set "blend_point_18/node"(value: AnimationRootNode)
        get "blend_point_18/pos"(): float64
        set "blend_point_18/pos"(value: float64)
        get "blend_point_19/node"(): AnimationRootNode
        set "blend_point_19/node"(value: AnimationRootNode)
        get "blend_point_19/pos"(): float64
        set "blend_point_19/pos"(value: float64)
        get "blend_point_20/node"(): AnimationRootNode
        set "blend_point_20/node"(value: AnimationRootNode)
        get "blend_point_20/pos"(): float64
        set "blend_point_20/pos"(value: float64)
        get "blend_point_21/node"(): AnimationRootNode
        set "blend_point_21/node"(value: AnimationRootNode)
        get "blend_point_21/pos"(): float64
        set "blend_point_21/pos"(value: float64)
        get "blend_point_22/node"(): AnimationRootNode
        set "blend_point_22/node"(value: AnimationRootNode)
        get "blend_point_22/pos"(): float64
        set "blend_point_22/pos"(value: float64)
        get "blend_point_23/node"(): AnimationRootNode
        set "blend_point_23/node"(value: AnimationRootNode)
        get "blend_point_23/pos"(): float64
        set "blend_point_23/pos"(value: float64)
        get "blend_point_24/node"(): AnimationRootNode
        set "blend_point_24/node"(value: AnimationRootNode)
        get "blend_point_24/pos"(): float64
        set "blend_point_24/pos"(value: float64)
        get "blend_point_25/node"(): AnimationRootNode
        set "blend_point_25/node"(value: AnimationRootNode)
        get "blend_point_25/pos"(): float64
        set "blend_point_25/pos"(value: float64)
        get "blend_point_26/node"(): AnimationRootNode
        set "blend_point_26/node"(value: AnimationRootNode)
        get "blend_point_26/pos"(): float64
        set "blend_point_26/pos"(value: float64)
        get "blend_point_27/node"(): AnimationRootNode
        set "blend_point_27/node"(value: AnimationRootNode)
        get "blend_point_27/pos"(): float64
        set "blend_point_27/pos"(value: float64)
        get "blend_point_28/node"(): AnimationRootNode
        set "blend_point_28/node"(value: AnimationRootNode)
        get "blend_point_28/pos"(): float64
        set "blend_point_28/pos"(value: float64)
        get "blend_point_29/node"(): AnimationRootNode
        set "blend_point_29/node"(value: AnimationRootNode)
        get "blend_point_29/pos"(): float64
        set "blend_point_29/pos"(value: float64)
        get "blend_point_30/node"(): AnimationRootNode
        set "blend_point_30/node"(value: AnimationRootNode)
        get "blend_point_30/pos"(): float64
        set "blend_point_30/pos"(value: float64)
        get "blend_point_31/node"(): AnimationRootNode
        set "blend_point_31/node"(value: AnimationRootNode)
        get "blend_point_31/pos"(): float64
        set "blend_point_31/pos"(value: float64)
        get "blend_point_32/node"(): AnimationRootNode
        set "blend_point_32/node"(value: AnimationRootNode)
        get "blend_point_32/pos"(): float64
        set "blend_point_32/pos"(value: float64)
        get "blend_point_33/node"(): AnimationRootNode
        set "blend_point_33/node"(value: AnimationRootNode)
        get "blend_point_33/pos"(): float64
        set "blend_point_33/pos"(value: float64)
        get "blend_point_34/node"(): AnimationRootNode
        set "blend_point_34/node"(value: AnimationRootNode)
        get "blend_point_34/pos"(): float64
        set "blend_point_34/pos"(value: float64)
        get "blend_point_35/node"(): AnimationRootNode
        set "blend_point_35/node"(value: AnimationRootNode)
        get "blend_point_35/pos"(): float64
        set "blend_point_35/pos"(value: float64)
        get "blend_point_36/node"(): AnimationRootNode
        set "blend_point_36/node"(value: AnimationRootNode)
        get "blend_point_36/pos"(): float64
        set "blend_point_36/pos"(value: float64)
        get "blend_point_37/node"(): AnimationRootNode
        set "blend_point_37/node"(value: AnimationRootNode)
        get "blend_point_37/pos"(): float64
        set "blend_point_37/pos"(value: float64)
        get "blend_point_38/node"(): AnimationRootNode
        set "blend_point_38/node"(value: AnimationRootNode)
        get "blend_point_38/pos"(): float64
        set "blend_point_38/pos"(value: float64)
        get "blend_point_39/node"(): AnimationRootNode
        set "blend_point_39/node"(value: AnimationRootNode)
        get "blend_point_39/pos"(): float64
        set "blend_point_39/pos"(value: float64)
        get "blend_point_40/node"(): AnimationRootNode
        set "blend_point_40/node"(value: AnimationRootNode)
        get "blend_point_40/pos"(): float64
        set "blend_point_40/pos"(value: float64)
        get "blend_point_41/node"(): AnimationRootNode
        set "blend_point_41/node"(value: AnimationRootNode)
        get "blend_point_41/pos"(): float64
        set "blend_point_41/pos"(value: float64)
        get "blend_point_42/node"(): AnimationRootNode
        set "blend_point_42/node"(value: AnimationRootNode)
        get "blend_point_42/pos"(): float64
        set "blend_point_42/pos"(value: float64)
        get "blend_point_43/node"(): AnimationRootNode
        set "blend_point_43/node"(value: AnimationRootNode)
        get "blend_point_43/pos"(): float64
        set "blend_point_43/pos"(value: float64)
        get "blend_point_44/node"(): AnimationRootNode
        set "blend_point_44/node"(value: AnimationRootNode)
        get "blend_point_44/pos"(): float64
        set "blend_point_44/pos"(value: float64)
        get "blend_point_45/node"(): AnimationRootNode
        set "blend_point_45/node"(value: AnimationRootNode)
        get "blend_point_45/pos"(): float64
        set "blend_point_45/pos"(value: float64)
        get "blend_point_46/node"(): AnimationRootNode
        set "blend_point_46/node"(value: AnimationRootNode)
        get "blend_point_46/pos"(): float64
        set "blend_point_46/pos"(value: float64)
        get "blend_point_47/node"(): AnimationRootNode
        set "blend_point_47/node"(value: AnimationRootNode)
        get "blend_point_47/pos"(): float64
        set "blend_point_47/pos"(value: float64)
        get "blend_point_48/node"(): AnimationRootNode
        set "blend_point_48/node"(value: AnimationRootNode)
        get "blend_point_48/pos"(): float64
        set "blend_point_48/pos"(value: float64)
        get "blend_point_49/node"(): AnimationRootNode
        set "blend_point_49/node"(value: AnimationRootNode)
        get "blend_point_49/pos"(): float64
        set "blend_point_49/pos"(value: float64)
        get "blend_point_50/node"(): AnimationRootNode
        set "blend_point_50/node"(value: AnimationRootNode)
        get "blend_point_50/pos"(): float64
        set "blend_point_50/pos"(value: float64)
        get "blend_point_51/node"(): AnimationRootNode
        set "blend_point_51/node"(value: AnimationRootNode)
        get "blend_point_51/pos"(): float64
        set "blend_point_51/pos"(value: float64)
        get "blend_point_52/node"(): AnimationRootNode
        set "blend_point_52/node"(value: AnimationRootNode)
        get "blend_point_52/pos"(): float64
        set "blend_point_52/pos"(value: float64)
        get "blend_point_53/node"(): AnimationRootNode
        set "blend_point_53/node"(value: AnimationRootNode)
        get "blend_point_53/pos"(): float64
        set "blend_point_53/pos"(value: float64)
        get "blend_point_54/node"(): AnimationRootNode
        set "blend_point_54/node"(value: AnimationRootNode)
        get "blend_point_54/pos"(): float64
        set "blend_point_54/pos"(value: float64)
        get "blend_point_55/node"(): AnimationRootNode
        set "blend_point_55/node"(value: AnimationRootNode)
        get "blend_point_55/pos"(): float64
        set "blend_point_55/pos"(value: float64)
        get "blend_point_56/node"(): AnimationRootNode
        set "blend_point_56/node"(value: AnimationRootNode)
        get "blend_point_56/pos"(): float64
        set "blend_point_56/pos"(value: float64)
        get "blend_point_57/node"(): AnimationRootNode
        set "blend_point_57/node"(value: AnimationRootNode)
        get "blend_point_57/pos"(): float64
        set "blend_point_57/pos"(value: float64)
        get "blend_point_58/node"(): AnimationRootNode
        set "blend_point_58/node"(value: AnimationRootNode)
        get "blend_point_58/pos"(): float64
        set "blend_point_58/pos"(value: float64)
        get "blend_point_59/node"(): AnimationRootNode
        set "blend_point_59/node"(value: AnimationRootNode)
        get "blend_point_59/pos"(): float64
        set "blend_point_59/pos"(value: float64)
        get "blend_point_60/node"(): AnimationRootNode
        set "blend_point_60/node"(value: AnimationRootNode)
        get "blend_point_60/pos"(): float64
        set "blend_point_60/pos"(value: float64)
        get "blend_point_61/node"(): AnimationRootNode
        set "blend_point_61/node"(value: AnimationRootNode)
        get "blend_point_61/pos"(): float64
        set "blend_point_61/pos"(value: float64)
        get "blend_point_62/node"(): AnimationRootNode
        set "blend_point_62/node"(value: AnimationRootNode)
        get "blend_point_62/pos"(): float64
        set "blend_point_62/pos"(value: float64)
        get "blend_point_63/node"(): AnimationRootNode
        set "blend_point_63/node"(value: AnimationRootNode)
        get "blend_point_63/pos"(): float64
        set "blend_point_63/pos"(value: float64)
        
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
    class AnimationNodeBlendSpace1DEditor<Map extends Record<string, Node> = Record<string, Node>> extends AnimationTreeNodeEditorPlugin<Map> {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeblendspace2d.html  
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
        get "blend_point_0/node"(): AnimationRootNode
        set "blend_point_0/node"(value: AnimationRootNode)
        get "blend_point_0/pos"(): Vector2
        set "blend_point_0/pos"(value: Vector2)
        get "blend_point_1/node"(): AnimationRootNode
        set "blend_point_1/node"(value: AnimationRootNode)
        get "blend_point_1/pos"(): Vector2
        set "blend_point_1/pos"(value: Vector2)
        get "blend_point_2/node"(): AnimationRootNode
        set "blend_point_2/node"(value: AnimationRootNode)
        get "blend_point_2/pos"(): Vector2
        set "blend_point_2/pos"(value: Vector2)
        get "blend_point_3/node"(): AnimationRootNode
        set "blend_point_3/node"(value: AnimationRootNode)
        get "blend_point_3/pos"(): Vector2
        set "blend_point_3/pos"(value: Vector2)
        get "blend_point_4/node"(): AnimationRootNode
        set "blend_point_4/node"(value: AnimationRootNode)
        get "blend_point_4/pos"(): Vector2
        set "blend_point_4/pos"(value: Vector2)
        get "blend_point_5/node"(): AnimationRootNode
        set "blend_point_5/node"(value: AnimationRootNode)
        get "blend_point_5/pos"(): Vector2
        set "blend_point_5/pos"(value: Vector2)
        get "blend_point_6/node"(): AnimationRootNode
        set "blend_point_6/node"(value: AnimationRootNode)
        get "blend_point_6/pos"(): Vector2
        set "blend_point_6/pos"(value: Vector2)
        get "blend_point_7/node"(): AnimationRootNode
        set "blend_point_7/node"(value: AnimationRootNode)
        get "blend_point_7/pos"(): Vector2
        set "blend_point_7/pos"(value: Vector2)
        get "blend_point_8/node"(): AnimationRootNode
        set "blend_point_8/node"(value: AnimationRootNode)
        get "blend_point_8/pos"(): Vector2
        set "blend_point_8/pos"(value: Vector2)
        get "blend_point_9/node"(): AnimationRootNode
        set "blend_point_9/node"(value: AnimationRootNode)
        get "blend_point_9/pos"(): Vector2
        set "blend_point_9/pos"(value: Vector2)
        get "blend_point_10/node"(): AnimationRootNode
        set "blend_point_10/node"(value: AnimationRootNode)
        get "blend_point_10/pos"(): Vector2
        set "blend_point_10/pos"(value: Vector2)
        get "blend_point_11/node"(): AnimationRootNode
        set "blend_point_11/node"(value: AnimationRootNode)
        get "blend_point_11/pos"(): Vector2
        set "blend_point_11/pos"(value: Vector2)
        get "blend_point_12/node"(): AnimationRootNode
        set "blend_point_12/node"(value: AnimationRootNode)
        get "blend_point_12/pos"(): Vector2
        set "blend_point_12/pos"(value: Vector2)
        get "blend_point_13/node"(): AnimationRootNode
        set "blend_point_13/node"(value: AnimationRootNode)
        get "blend_point_13/pos"(): Vector2
        set "blend_point_13/pos"(value: Vector2)
        get "blend_point_14/node"(): AnimationRootNode
        set "blend_point_14/node"(value: AnimationRootNode)
        get "blend_point_14/pos"(): Vector2
        set "blend_point_14/pos"(value: Vector2)
        get "blend_point_15/node"(): AnimationRootNode
        set "blend_point_15/node"(value: AnimationRootNode)
        get "blend_point_15/pos"(): Vector2
        set "blend_point_15/pos"(value: Vector2)
        get "blend_point_16/node"(): AnimationRootNode
        set "blend_point_16/node"(value: AnimationRootNode)
        get "blend_point_16/pos"(): Vector2
        set "blend_point_16/pos"(value: Vector2)
        get "blend_point_17/node"(): AnimationRootNode
        set "blend_point_17/node"(value: AnimationRootNode)
        get "blend_point_17/pos"(): Vector2
        set "blend_point_17/pos"(value: Vector2)
        get "blend_point_18/node"(): AnimationRootNode
        set "blend_point_18/node"(value: AnimationRootNode)
        get "blend_point_18/pos"(): Vector2
        set "blend_point_18/pos"(value: Vector2)
        get "blend_point_19/node"(): AnimationRootNode
        set "blend_point_19/node"(value: AnimationRootNode)
        get "blend_point_19/pos"(): Vector2
        set "blend_point_19/pos"(value: Vector2)
        get "blend_point_20/node"(): AnimationRootNode
        set "blend_point_20/node"(value: AnimationRootNode)
        get "blend_point_20/pos"(): Vector2
        set "blend_point_20/pos"(value: Vector2)
        get "blend_point_21/node"(): AnimationRootNode
        set "blend_point_21/node"(value: AnimationRootNode)
        get "blend_point_21/pos"(): Vector2
        set "blend_point_21/pos"(value: Vector2)
        get "blend_point_22/node"(): AnimationRootNode
        set "blend_point_22/node"(value: AnimationRootNode)
        get "blend_point_22/pos"(): Vector2
        set "blend_point_22/pos"(value: Vector2)
        get "blend_point_23/node"(): AnimationRootNode
        set "blend_point_23/node"(value: AnimationRootNode)
        get "blend_point_23/pos"(): Vector2
        set "blend_point_23/pos"(value: Vector2)
        get "blend_point_24/node"(): AnimationRootNode
        set "blend_point_24/node"(value: AnimationRootNode)
        get "blend_point_24/pos"(): Vector2
        set "blend_point_24/pos"(value: Vector2)
        get "blend_point_25/node"(): AnimationRootNode
        set "blend_point_25/node"(value: AnimationRootNode)
        get "blend_point_25/pos"(): Vector2
        set "blend_point_25/pos"(value: Vector2)
        get "blend_point_26/node"(): AnimationRootNode
        set "blend_point_26/node"(value: AnimationRootNode)
        get "blend_point_26/pos"(): Vector2
        set "blend_point_26/pos"(value: Vector2)
        get "blend_point_27/node"(): AnimationRootNode
        set "blend_point_27/node"(value: AnimationRootNode)
        get "blend_point_27/pos"(): Vector2
        set "blend_point_27/pos"(value: Vector2)
        get "blend_point_28/node"(): AnimationRootNode
        set "blend_point_28/node"(value: AnimationRootNode)
        get "blend_point_28/pos"(): Vector2
        set "blend_point_28/pos"(value: Vector2)
        get "blend_point_29/node"(): AnimationRootNode
        set "blend_point_29/node"(value: AnimationRootNode)
        get "blend_point_29/pos"(): Vector2
        set "blend_point_29/pos"(value: Vector2)
        get "blend_point_30/node"(): AnimationRootNode
        set "blend_point_30/node"(value: AnimationRootNode)
        get "blend_point_30/pos"(): Vector2
        set "blend_point_30/pos"(value: Vector2)
        get "blend_point_31/node"(): AnimationRootNode
        set "blend_point_31/node"(value: AnimationRootNode)
        get "blend_point_31/pos"(): Vector2
        set "blend_point_31/pos"(value: Vector2)
        get "blend_point_32/node"(): AnimationRootNode
        set "blend_point_32/node"(value: AnimationRootNode)
        get "blend_point_32/pos"(): Vector2
        set "blend_point_32/pos"(value: Vector2)
        get "blend_point_33/node"(): AnimationRootNode
        set "blend_point_33/node"(value: AnimationRootNode)
        get "blend_point_33/pos"(): Vector2
        set "blend_point_33/pos"(value: Vector2)
        get "blend_point_34/node"(): AnimationRootNode
        set "blend_point_34/node"(value: AnimationRootNode)
        get "blend_point_34/pos"(): Vector2
        set "blend_point_34/pos"(value: Vector2)
        get "blend_point_35/node"(): AnimationRootNode
        set "blend_point_35/node"(value: AnimationRootNode)
        get "blend_point_35/pos"(): Vector2
        set "blend_point_35/pos"(value: Vector2)
        get "blend_point_36/node"(): AnimationRootNode
        set "blend_point_36/node"(value: AnimationRootNode)
        get "blend_point_36/pos"(): Vector2
        set "blend_point_36/pos"(value: Vector2)
        get "blend_point_37/node"(): AnimationRootNode
        set "blend_point_37/node"(value: AnimationRootNode)
        get "blend_point_37/pos"(): Vector2
        set "blend_point_37/pos"(value: Vector2)
        get "blend_point_38/node"(): AnimationRootNode
        set "blend_point_38/node"(value: AnimationRootNode)
        get "blend_point_38/pos"(): Vector2
        set "blend_point_38/pos"(value: Vector2)
        get "blend_point_39/node"(): AnimationRootNode
        set "blend_point_39/node"(value: AnimationRootNode)
        get "blend_point_39/pos"(): Vector2
        set "blend_point_39/pos"(value: Vector2)
        get "blend_point_40/node"(): AnimationRootNode
        set "blend_point_40/node"(value: AnimationRootNode)
        get "blend_point_40/pos"(): Vector2
        set "blend_point_40/pos"(value: Vector2)
        get "blend_point_41/node"(): AnimationRootNode
        set "blend_point_41/node"(value: AnimationRootNode)
        get "blend_point_41/pos"(): Vector2
        set "blend_point_41/pos"(value: Vector2)
        get "blend_point_42/node"(): AnimationRootNode
        set "blend_point_42/node"(value: AnimationRootNode)
        get "blend_point_42/pos"(): Vector2
        set "blend_point_42/pos"(value: Vector2)
        get "blend_point_43/node"(): AnimationRootNode
        set "blend_point_43/node"(value: AnimationRootNode)
        get "blend_point_43/pos"(): Vector2
        set "blend_point_43/pos"(value: Vector2)
        get "blend_point_44/node"(): AnimationRootNode
        set "blend_point_44/node"(value: AnimationRootNode)
        get "blend_point_44/pos"(): Vector2
        set "blend_point_44/pos"(value: Vector2)
        get "blend_point_45/node"(): AnimationRootNode
        set "blend_point_45/node"(value: AnimationRootNode)
        get "blend_point_45/pos"(): Vector2
        set "blend_point_45/pos"(value: Vector2)
        get "blend_point_46/node"(): AnimationRootNode
        set "blend_point_46/node"(value: AnimationRootNode)
        get "blend_point_46/pos"(): Vector2
        set "blend_point_46/pos"(value: Vector2)
        get "blend_point_47/node"(): AnimationRootNode
        set "blend_point_47/node"(value: AnimationRootNode)
        get "blend_point_47/pos"(): Vector2
        set "blend_point_47/pos"(value: Vector2)
        get "blend_point_48/node"(): AnimationRootNode
        set "blend_point_48/node"(value: AnimationRootNode)
        get "blend_point_48/pos"(): Vector2
        set "blend_point_48/pos"(value: Vector2)
        get "blend_point_49/node"(): AnimationRootNode
        set "blend_point_49/node"(value: AnimationRootNode)
        get "blend_point_49/pos"(): Vector2
        set "blend_point_49/pos"(value: Vector2)
        get "blend_point_50/node"(): AnimationRootNode
        set "blend_point_50/node"(value: AnimationRootNode)
        get "blend_point_50/pos"(): Vector2
        set "blend_point_50/pos"(value: Vector2)
        get "blend_point_51/node"(): AnimationRootNode
        set "blend_point_51/node"(value: AnimationRootNode)
        get "blend_point_51/pos"(): Vector2
        set "blend_point_51/pos"(value: Vector2)
        get "blend_point_52/node"(): AnimationRootNode
        set "blend_point_52/node"(value: AnimationRootNode)
        get "blend_point_52/pos"(): Vector2
        set "blend_point_52/pos"(value: Vector2)
        get "blend_point_53/node"(): AnimationRootNode
        set "blend_point_53/node"(value: AnimationRootNode)
        get "blend_point_53/pos"(): Vector2
        set "blend_point_53/pos"(value: Vector2)
        get "blend_point_54/node"(): AnimationRootNode
        set "blend_point_54/node"(value: AnimationRootNode)
        get "blend_point_54/pos"(): Vector2
        set "blend_point_54/pos"(value: Vector2)
        get "blend_point_55/node"(): AnimationRootNode
        set "blend_point_55/node"(value: AnimationRootNode)
        get "blend_point_55/pos"(): Vector2
        set "blend_point_55/pos"(value: Vector2)
        get "blend_point_56/node"(): AnimationRootNode
        set "blend_point_56/node"(value: AnimationRootNode)
        get "blend_point_56/pos"(): Vector2
        set "blend_point_56/pos"(value: Vector2)
        get "blend_point_57/node"(): AnimationRootNode
        set "blend_point_57/node"(value: AnimationRootNode)
        get "blend_point_57/pos"(): Vector2
        set "blend_point_57/pos"(value: Vector2)
        get "blend_point_58/node"(): AnimationRootNode
        set "blend_point_58/node"(value: AnimationRootNode)
        get "blend_point_58/pos"(): Vector2
        set "blend_point_58/pos"(value: Vector2)
        get "blend_point_59/node"(): AnimationRootNode
        set "blend_point_59/node"(value: AnimationRootNode)
        get "blend_point_59/pos"(): Vector2
        set "blend_point_59/pos"(value: Vector2)
        get "blend_point_60/node"(): AnimationRootNode
        set "blend_point_60/node"(value: AnimationRootNode)
        get "blend_point_60/pos"(): Vector2
        set "blend_point_60/pos"(value: Vector2)
        get "blend_point_61/node"(): AnimationRootNode
        set "blend_point_61/node"(value: AnimationRootNode)
        get "blend_point_61/pos"(): Vector2
        set "blend_point_61/pos"(value: Vector2)
        get "blend_point_62/node"(): AnimationRootNode
        set "blend_point_62/node"(value: AnimationRootNode)
        get "blend_point_62/pos"(): Vector2
        set "blend_point_62/pos"(value: Vector2)
        get "blend_point_63/node"(): AnimationRootNode
        set "blend_point_63/node"(value: AnimationRootNode)
        get "blend_point_63/pos"(): Vector2
        set "blend_point_63/pos"(value: Vector2)
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
    class AnimationNodeBlendSpace2DEditor<Map extends Record<string, Node> = Record<string, Node>> extends AnimationTreeNodeEditorPlugin<Map> {
        constructor(identifier?: any)
        _update_space(): void
        _update_tool_erase(): void
        _update_edited_point_pos(): void
    }
    /** A sub-tree of many type [AnimationNode]s used for complex animations. Used by [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeblendtree.html  
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
    class AnimationNodeBlendTreeEditor<Map extends Record<string, Node> = Record<string, Node>> extends AnimationTreeNodeEditorPlugin<Map> {
        constructor(identifier?: any)
        update_graph(): void
        _update_filters(_unnamed_arg0: AnimationNode): boolean
    }
    /** Base class for extending [AnimationRootNode]s from GDScript, C#, or C++.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeextension.html  
     */
    class AnimationNodeExtension extends AnimationNode {
        constructor(identifier?: any)
        /** A version of the [method AnimationNode._process] method that is meant to be overridden by custom nodes. It returns a [PackedFloat32Array] with the processed animation data.  
         *  The [PackedFloat64Array] parameter contains the playback information, containing the following values encoded as floating point numbers (in order): playback time and delta, start and end times, whether a seek was requested (encoded as a float greater than `0`), whether the seek request was externally requested (encoded as a float greater than `0`), the current [enum Animation.LoopedFlag] (encoded as a float), and the current blend weight.  
         *  The function must return a [PackedFloat32Array] of the node's time info, containing the following values (in order): animation length, time position, delta, [enum Animation.LoopMode] (encoded as a float), whether the animation is about to end (encoded as a float greater than `0`) and whether the animation is infinite (encoded as a float greater than `0`). All values must be included in the returned array.  
         */
        /* gdvirtual */ _process_animation_node(playback_info: PackedFloat64Array | float64[], test_only: boolean): PackedFloat32Array
        
        /** Returns `true` if the animation for the given [param node_info] is looping. */
        static is_looping(node_info: PackedFloat32Array | float32[]): boolean
        
        /** Returns the animation's remaining time for the given node info. For looping animations, it will only return the remaining time if [param break_loop] is `true`, a large integer value will be returned otherwise. */
        static get_remaining_time(node_info: PackedFloat32Array | float32[], break_loop: boolean): float64
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeoneshot.html  
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
        
        /** Determines how cross-fading between animations is eased. If empty, the transition will be linear. Should be a unit [Curve]. */
        get fadein_curve(): Curve
        set fadein_curve(value: Curve)
        
        /** The fade-out duration. For example, setting this to `1.0` for a 5 second length animation will produce a cross-fade that starts at 4 second and ends at 5 second during the animation.  
         *      
         *  **Note:** [AnimationNodeOneShot] transitions the current state after the end of the fading. When [AnimationNodeOutput] is considered as the most upstream, so the [member fadeout_time] is scaled depending on the downstream delta. For example, if this value is set to `1.0` and an [AnimationNodeTimeScale] with a value of `2.0` is chained downstream, the actual processing time will be 0.5 second.  
         */
        get fadeout_time(): float64
        set fadeout_time(value: float64)
        
        /** Determines how cross-fading between animations is eased. If empty, the transition will be linear. Should be a unit [Curve]. */
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodeoutput.html  
     */
    class AnimationNodeOutput extends AnimationNode {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodestatemachine.html  
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
    class AnimationNodeStateMachineEditor<Map extends Record<string, Node> = Record<string, Node>> extends AnimationTreeNodeEditorPlugin<Map> {
        constructor(identifier?: any)
        _update_graph(): void
    }
    /** Provides playback control for an [AnimationNodeStateMachine].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodestatemachineplayback.html  
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
            
            /** Automatically use this transition if the [member advance_condition] and [member advance_expression] checks are `true` (if assigned). */
            ADVANCE_MODE_AUTO = 2,
        }
    }
    /** A transition within an [AnimationNodeStateMachine] connecting two [AnimationRootNode]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodestatemachinetransition.html  
     */
    class AnimationNodeStateMachineTransition extends Resource {
        constructor(identifier?: any)
        /** The time to cross-fade between this state and the next.  
         *      
         *  **Note:** [AnimationNodeStateMachine] transitions the current state immediately after the start of the fading. The precise remaining time can only be inferred from the main animation. When [AnimationNodeOutput] is considered as the most upstream, so the [member xfade_time] is not scaled depending on the downstream delta. See also [member AnimationNodeOneShot.fadeout_time].  
         */
        get xfade_time(): float64
        set xfade_time(value: float64)
        
        /** Ease curve for better control over cross-fade between this state and the next. Should be a unit [Curve]. */
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
        
        /** Determines whether the transition should be disabled, enabled when using [method AnimationNodeStateMachinePlayback.travel], or traversed automatically if the [member advance_condition] and [member advance_expression] checks are `true` (if assigned). */
        get advance_mode(): int64
        set advance_mode(value: int64)
        
        /** Turn on auto advance when this condition is set. The provided name will become a boolean parameter on the [AnimationTree] that can be controlled from code (see [url=https://docs.godotengine.org/en/4.4/tutorials/animation/animation_tree.html#controlling-from-code]Using AnimationTree[/url]). For example, if [member AnimationTree.tree_root] is an [AnimationNodeStateMachine] and [member advance_condition] is set to `"idle"`:  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodesub2.html  
     */
    class AnimationNodeSub2 extends AnimationNodeSync {
        constructor(identifier?: any)
    }
    /** Base class for [AnimationNode]s with multiple input ports that must be synchronized.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodesync.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodetimescale.html  
     */
    class AnimationNodeTimeScale extends AnimationNode {
        constructor(identifier?: any)
    }
    /** A time-seeking animation node used in [AnimationTree].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodetimeseek.html  
     */
    class AnimationNodeTimeSeek extends AnimationNode {
        constructor(identifier?: any)
        /** If `true`, some processes are executed to handle keys between seeks, such as calculating root motion and finding the nearest discrete key. */
        get explicit_elapse(): boolean
        set explicit_elapse(value: boolean)
    }
    /** A transition within an [AnimationTree] connecting two [AnimationNode]s.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationnodetransition.html  
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
        
        /** Determines how cross-fading between animations is eased. If empty, the transition will be linear. Should be a unit [Curve]. */
        get xfade_curve(): Curve
        set xfade_curve(value: Curve)
        
        /** If `true`, allows transition to the self state. When the reset option is enabled in input, the animation is restarted. If `false`, nothing happens on the transition to the self state. */
        get allow_transition_to_self(): boolean
        set allow_transition_to_self(value: boolean)
        
        /** The number of enabled input ports for this animation node. */
        get input_count(): any /*Inputs,input_*/
        set input_count(value: any /*Inputs,input_*/)
    }
    namespace AnimationPlayer {
        enum AnimationProcessCallback {
            ANIMATION_PROCESS_PHYSICS = 0,
            ANIMATION_PROCESS_IDLE = 1,
            ANIMATION_PROCESS_MANUAL = 2,
        }
        enum AnimationMethodCallMode {
            ANIMATION_METHOD_CALL_DEFERRED = 0,
            ANIMATION_METHOD_CALL_IMMEDIATE = 1,
        }
    }
    /** A node used for animation playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationplayer.html  
     */
    class AnimationPlayer<Map extends Record<string, Node> = Record<string, Node>> extends AnimationMixer<Map> {
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
        
        /** Plays the animation with key [param name] and the section starting from [param start_marker] and ending on [param end_marker].  
         *  If the start marker is empty, the section starts from the beginning of the animation. If the end marker is empty, the section ends on the end of the animation. See also [method play].  
         */
        play_section_with_markers(name: StringName = '', start_marker: StringName = '', end_marker: StringName = '', custom_blend: float64 = -1, custom_speed: float64 = 1, from_end: boolean = false): void
        
        /** Plays the animation with key [param name] and the section starting from [param start_time] and ending on [param end_time]. See also [method play].  
         *  Setting [param start_time] to a value outside the range of the animation means the start of the animation will be used instead, and setting [param end_time] to a value outside the range of the animation means the end of the animation will be used instead. [param start_time] cannot be equal to [param end_time].  
         */
        play_section(name: StringName = '', start_time: float64 = -1, end_time: float64 = -1, custom_blend: float64 = -1, custom_speed: float64 = 1, from_end: boolean = false): void
        
        /** Plays the animation with key [param name] in reverse.  
         *  This method is a shorthand for [method play] with `custom_speed = -1.0` and `from_end = true`, so see its description for more information.  
         */
        play_backwards(name: StringName = '', custom_blend: float64 = -1): void
        
        /** Plays the animation with key [param name] and the section starting from [param start_marker] and ending on [param end_marker] in reverse.  
         *  This method is a shorthand for [method play_section_with_markers] with `custom_speed = -1.0` and `from_end = true`, see its description for more information.  
         */
        play_section_with_markers_backwards(name: StringName = '', start_marker: StringName = '', end_marker: StringName = '', custom_blend: float64 = -1): void
        
        /** Plays the animation with key [param name] and the section starting from [param start_time] and ending on [param end_time] in reverse.  
         *  This method is a shorthand for [method play_section] with `custom_speed = -1.0` and `from_end = true`, see its description for more information.  
         */
        play_section_backwards(name: StringName = '', start_time: float64 = -1, end_time: float64 = -1, custom_blend: float64 = -1): void
        
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
        
        /** Changes the start and end markers of the section being played. The current playback position will be clamped within the new section. See also [method play_section_with_markers].  
         *  If the argument is empty, the section uses the beginning or end of the animation. If both are empty, it means that the section is not set.  
         */
        set_section_with_markers(start_marker: StringName = '', end_marker: StringName = ''): void
        
        /** Changes the start and end times of the section being played. The current playback position will be clamped within the new section. See also [method play_section]. */
        set_section(start_time: float64 = -1, end_time: float64 = -1): void
        
        /** Resets the current section if section is set. */
        reset_section(): void
        
        /** Returns the start time of the section currently being played. */
        get_section_start_time(): float64
        
        /** Returns the end time of the section currently being played. */
        get_section_end_time(): float64
        
        /** Returns `true` if an animation is currently playing with section. */
        has_section(): boolean
        
        /** Seeks the animation to the [param seconds] point in time (in seconds). If [param update] is `true`, the animation updates too, otherwise it updates at process time. Events between the current frame and [param seconds] are skipped.  
         *  If [param update_only] is `true`, the method / audio / animation playback tracks will not be processed.  
         *      
         *  **Note:** Seeking to the end of the animation doesn't emit [signal AnimationMixer.animation_finished]. If you want to skip animation and emit the signal, use [method AnimationMixer.advance].  
         */
        seek(seconds: float64, update: boolean = false, update_only: boolean = false): void
        
        /** Sets the process notification in which to update animations. */
        set_process_callback(mode: AnimationPlayer.AnimationProcessCallback): void
        
        /** Returns the process notification in which to update animations. */
        get_process_callback(): AnimationPlayer.AnimationProcessCallback
        
        /** Sets the call mode used for "Call Method" tracks. */
        set_method_call_mode(mode: AnimationPlayer.AnimationMethodCallMode): void
        
        /** Returns the call mode used for "Call Method" tracks. */
        get_method_call_mode(): AnimationPlayer.AnimationMethodCallMode
        
        /** Sets the node which node path references will travel from. */
        set_root(path: NodePath | string): void
        
        /** Returns the node which node path references will travel from. */
        get_root(): NodePath
        
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
    class AnimationPlayerEditor<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        _animation_player_changed(_unnamed_arg0: Object): void
        _animation_update_key_frame(): void
        _start_onion_skinning(): void
        _stop_onion_skinning(): void
        readonly animation_selected: Signal1<string>
    }
    class AnimationPlayerEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** Base class for [AnimationNode]s that hold one or multiple composite animations. Usually used for [member AnimationTree.tree_root].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationrootnode.html  
     */
    class AnimationRootNode extends AnimationNode {
        constructor(identifier?: any)
    }
    class AnimationTimelineEdit<Map extends Record<string, Node> = Record<string, Node>> extends Range<Map> {
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
    class AnimationTrackEditor<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
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
    class AnimationTrackKeyEditEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    namespace AnimationTree {
        enum AnimationProcessCallback {
            ANIMATION_PROCESS_PHYSICS = 0,
            ANIMATION_PROCESS_IDLE = 1,
            ANIMATION_PROCESS_MANUAL = 2,
        }
    }
    /** A node used for advanced animation transitions in an [AnimationPlayer].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_animationtree.html  
     */
    class AnimationTree<Map extends Record<string, Node> = Record<string, Node>> extends AnimationMixer<Map> {
        constructor(identifier?: any)
        /** Sets the process notification in which to update animations. */
        set_process_callback(mode: AnimationTree.AnimationProcessCallback): void
        
        /** Returns the process notification in which to update animations. */
        get_process_callback(): AnimationTree.AnimationProcessCallback
        
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
    class AnimationTreeEditor<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
    }
    class AnimationTreeEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class AnimationTreeNodeEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_area2d.html  
     */
    class Area2D<Map extends Record<string, Node> = Record<string, Node>> extends CollisionObject2D<Map> {
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
         *  **Example:** Get the [CollisionShape2D] node from the shape index:  
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
         *  **Example:** Get the [CollisionShape2D] node from the shape index:  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_area3d.html  
     */
    class Area3D<Map extends Record<string, Node> = Record<string, Node>> extends CollisionObject3D<Map> {
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
         *  **Example:** Get the [CollisionShape3D] node from the shape index:  
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
         *  **Example:** Get the [CollisionShape3D] node from the shape index:  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_arraymesh.html  
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
         *  The [param flags] argument is the bitwise OR of, as required: One value of [enum Mesh.ArrayCustomFormat] left shifted by `ARRAY_FORMAT_CUSTOMn_SHIFT` for each custom channel in use, [constant Mesh.ARRAY_FLAG_USE_DYNAMIC_UPDATE], [constant Mesh.ARRAY_FLAG_USE_8_BONE_WEIGHTS], or [constant Mesh.ARRAY_FLAG_USES_EMPTY_VERTEX_ARRAY].  
         *      
         *  **Note:** When using indices, it is recommended to only use points, lines, or triangles.  
         */
        add_surface_from_arrays(primitive: Mesh.PrimitiveType, arrays: GArray, blend_shapes: GArray = [], lods: GDictionary = new GDictionary(), flags: Mesh.ArrayFormat = 0): void
        
        /** Removes all surfaces from this [ArrayMesh]. */
        clear_surfaces(): void
        
        /** Removes the surface at the given index from the Mesh, shifting surfaces with higher index down by one. */
        surface_remove(surf_idx: int64): void
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_arrayoccluder3d.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_aspectratiocontainer.html  
     */
    class AspectRatioContainer<Map extends Record<string, Node> = Record<string, Node>> extends Container<Map> {
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
    class AssetLibraryEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class AtlasMergingDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
    }
    /** A texture that crops out part of another Texture2D.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_atlastexture.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiobuslayout.html  
     */
    class AudioBusLayout extends Resource {
        constructor(identifier?: any)
    }
    class AudioBusesEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** Base class for audio effect resources.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffect.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectamplify.html  
     */
    class AudioEffectAmplify extends AudioEffect {
        constructor(identifier?: any)
        /** Amount of amplification in decibels. Positive values make the sound louder, negative values make it quieter. Value can range from -80 to 24. */
        get volume_db(): float64
        set volume_db(value: float64)
        
        /** Amount of amplification as a linear value.  
         *      
         *  **Note:** This member modifies [member volume_db] for convenience. The returned value is equivalent to the result of [method @GlobalScope.db_to_linear] on [member volume_db]. Setting this member is equivalent to setting [member volume_db] to the result of [method @GlobalScope.linear_to_db] on a value.  
         */
        get volume_linear(): float64
        set volume_linear(value: float64)
    }
    /** Adds a band limit filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectbandlimitfilter.html  
     */
    class AudioEffectBandLimitFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a band pass filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectbandpassfilter.html  
     */
    class AudioEffectBandPassFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Captures audio from an audio bus in real-time.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectcapture.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectchorus.html  
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
        
        /** The voice's signal delay. */
        get "voice/1/delay_ms"(): float64
        set "voice/1/delay_ms"(value: float64)
        
        /** The voice's filter rate. */
        get "voice/1/rate_hz"(): float64
        set "voice/1/rate_hz"(value: float64)
        
        /** The voice filter's depth. */
        get "voice/1/depth_ms"(): float64
        set "voice/1/depth_ms"(value: float64)
        
        /** The voice's volume. */
        get "voice/1/level_db"(): float64
        set "voice/1/level_db"(value: float64)
        
        /** The voice's cutoff frequency. */
        get "voice/1/cutoff_hz"(): float64
        set "voice/1/cutoff_hz"(value: float64)
        
        /** The voice's pan level. */
        get "voice/1/pan"(): float64
        set "voice/1/pan"(value: float64)
        
        /** The voice's signal delay. */
        get "voice/2/delay_ms"(): float64
        set "voice/2/delay_ms"(value: float64)
        
        /** The voice's filter rate. */
        get "voice/2/rate_hz"(): float64
        set "voice/2/rate_hz"(value: float64)
        
        /** The voice filter's depth. */
        get "voice/2/depth_ms"(): float64
        set "voice/2/depth_ms"(value: float64)
        
        /** The voice's volume. */
        get "voice/2/level_db"(): float64
        set "voice/2/level_db"(value: float64)
        
        /** The voice's cutoff frequency. */
        get "voice/2/cutoff_hz"(): float64
        set "voice/2/cutoff_hz"(value: float64)
        
        /** The voice's pan level. */
        get "voice/2/pan"(): float64
        set "voice/2/pan"(value: float64)
        
        /** The voice's signal delay. */
        get "voice/3/delay_ms"(): float64
        set "voice/3/delay_ms"(value: float64)
        
        /** The voice's filter rate. */
        get "voice/3/rate_hz"(): float64
        set "voice/3/rate_hz"(value: float64)
        
        /** The voice filter's depth. */
        get "voice/3/depth_ms"(): float64
        set "voice/3/depth_ms"(value: float64)
        
        /** The voice's volume. */
        get "voice/3/level_db"(): float64
        set "voice/3/level_db"(value: float64)
        
        /** The voice's cutoff frequency. */
        get "voice/3/cutoff_hz"(): float64
        set "voice/3/cutoff_hz"(value: float64)
        
        /** The voice's pan level. */
        get "voice/3/pan"(): float64
        set "voice/3/pan"(value: float64)
        
        /** The voice's signal delay. */
        get "voice/4/delay_ms"(): float64
        set "voice/4/delay_ms"(value: float64)
        
        /** The voice's filter rate. */
        get "voice/4/rate_hz"(): float64
        set "voice/4/rate_hz"(value: float64)
        
        /** The voice filter's depth. */
        get "voice/4/depth_ms"(): float64
        set "voice/4/depth_ms"(value: float64)
        
        /** The voice's volume. */
        get "voice/4/level_db"(): float64
        set "voice/4/level_db"(value: float64)
        
        /** The voice's cutoff frequency. */
        get "voice/4/cutoff_hz"(): float64
        set "voice/4/cutoff_hz"(value: float64)
        
        /** The voice's pan level. */
        get "voice/4/pan"(): float64
        set "voice/4/pan"(value: float64)
    }
    /** Adds a compressor audio effect to an audio bus.  
     *  Reduces sounds that exceed a certain threshold level, smooths out the dynamics and increases the overall volume.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectcompressor.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectdelay.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectdistortion.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffecteq.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffecteq10.html  
     */
    class AudioEffectEQ10 extends AudioEffectEQ {
        constructor(identifier?: any)
    }
    /** Adds a 21-band equalizer audio effect to an Audio bus. Gives you control over frequencies from 22 Hz to 22000 Hz.  
     *  Each frequency can be modulated between -60/+24 dB.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffecteq21.html  
     */
    class AudioEffectEQ21 extends AudioEffectEQ {
        constructor(identifier?: any)
    }
    /** Adds a 6-band equalizer audio effect to an audio bus. Gives you control over frequencies from 32 Hz to 10000 Hz.  
     *  Each frequency can be modulated between -60/+24 dB.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffecteq6.html  
     */
    class AudioEffectEQ6 extends AudioEffectEQ {
        constructor(identifier?: any)
    }
    namespace AudioEffectFilter {
        enum FilterDB {
            /** Cutting off at 6dB per octave. */
            FILTER_6DB = 0,
            
            /** Cutting off at 12dB per octave. */
            FILTER_12DB = 1,
            
            /** Cutting off at 18dB per octave. */
            FILTER_18DB = 2,
            
            /** Cutting off at 24dB per octave. */
            FILTER_24DB = 3,
        }
    }
    /** Adds a filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectfilter.html  
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
        
        /** Steepness of the cutoff curve in dB per octave, also known as the order of the filter. Higher orders have a more aggressive cutoff. */
        get db(): int64
        set db(value: int64)
    }
    /** Adds a hard limiter audio effect to an Audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffecthardlimiter.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffecthighpassfilter.html  
     */
    class AudioEffectHighPassFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a high-shelf filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffecthighshelffilter.html  
     */
    class AudioEffectHighShelfFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Manipulates the audio it receives for a given effect.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectinstance.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectlimiter.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectlowpassfilter.html  
     */
    class AudioEffectLowPassFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a low-shelf filter to the audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectlowshelffilter.html  
     */
    class AudioEffectLowShelfFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a notch filter to the Audio bus.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectnotchfilter.html  
     */
    class AudioEffectNotchFilter extends AudioEffectFilter {
        constructor(identifier?: any)
    }
    /** Adds a panner audio effect to an audio bus. Pans sound left or right.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectpanner.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectphaser.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectpitchshift.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectrecord.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectreverb.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectspectrumanalyzer.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectspectrumanalyzerinstance.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audioeffectstereoenhance.html  
     */
    class AudioEffectStereoEnhance extends AudioEffect {
        constructor(identifier?: any)
        /** Amplifies the difference between stereo channels, increasing or decreasing existing panning. A value of 0.0 will downmix stereo to mono. Does not affect a mono signal. */
        get pan_pullout(): float64
        set pan_pullout(value: float64)
        
        /** Widens sound stage through phase shifting in conjunction with [member surround]. Just delays the right channel if [member surround] is 0. */
        get time_pullout_ms(): float64
        set time_pullout_ms(value: float64)
        
        /** Widens sound stage through phase shifting in conjunction with [member time_pullout_ms]. Just pans sound to the left channel if [member time_pullout_ms] is 0. */
        get surround(): float64
        set surround(value: float64)
    }
    /** Overrides the location sounds are heard from.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiolistener2d.html  
     */
    class AudioListener2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiolistener3d.html  
     */
    class AudioListener3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiosample.html  
     */
    class AudioSample extends RefCounted {
        constructor(identifier?: any)
    }
    /** Meta class for playing back audio samples.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiosampleplayback.html  
     */
    class AudioSamplePlayback extends RefCounted {
        constructor(identifier?: any)
    }
    /** Base class for audio streams.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostream.html  
     */
    class AudioStream extends Resource {
        constructor(identifier?: any)
        /** Override this method to customize the returned value of [method instantiate_playback]. Should return a new [AudioStreamPlayback] created when the stream is played (such as by an [AudioStreamPlayer]). */
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
        
        /** Override this method to return `true` if this stream has a loop. */
        /* gdvirtual */ _has_loop(): boolean
        
        /** Override this method to return the bar beats of this stream. */
        /* gdvirtual */ _get_bar_beats(): int64
        
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
    class AudioStreamEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    namespace AudioStreamGenerator {
        enum AudioStreamGeneratorMixRate {
            /** Current [AudioServer] output mixing rate. */
            MIX_RATE_OUTPUT = 0,
            
            /** Current [AudioServer] input mixing rate. */
            MIX_RATE_INPUT = 1,
            
            /** Custom mixing rate, specified by [member mix_rate]. */
            MIX_RATE_CUSTOM = 2,
            
            /** Maximum value for the mixing rate mode enum. */
            MIX_RATE_MAX = 3,
        }
    }
    /** An audio stream with utilities for procedural sound generation.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamgenerator.html  
     */
    class AudioStreamGenerator extends AudioStream {
        constructor(identifier?: any)
        /** Mixing rate mode. If set to [constant MIX_RATE_CUSTOM], [member mix_rate] is used, otherwise current [AudioServer] mixing rate is used. */
        get mix_rate_mode(): int64
        set mix_rate_mode(value: int64)
        
        /** The sample rate to use (in Hz). Higher values are more demanding for the CPU to generate, but result in better quality.  
         *  In games, common sample rates in use are `11025`, `16000`, `22050`, `32000`, `44100`, and `48000`.  
         *  According to the [url=https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem]Nyquist-Shannon sampling theorem[/url], there is no quality difference to human hearing when going past 40,000 Hz (since most humans can only hear up to ~20,000 Hz, often less). If you are generating lower-pitched sounds such as voices, lower sample rates such as `32000` or `22050` may be usable with no loss in quality.  
         *      
         *  **Note:** [AudioStreamGenerator] is not automatically resampling input data, to produce expected result [member mix_rate_mode] should match the sampling rate of input data.  
         *      
         *  **Note:** If you are using [AudioEffectCapture] as the source of your data, set [member mix_rate_mode] to [constant MIX_RATE_INPUT] or [constant MIX_RATE_OUTPUT] to automatically match current [AudioServer] mixing rate.  
         */
        get mix_rate(): float64
        set mix_rate(value: float64)
        
        /** The length of the buffer to generate (in seconds). Lower values result in less latency, but require the script to generate audio data faster, resulting in increased CPU usage and more risk for audio cracking if the CPU can't keep up. */
        get buffer_length(): float64
        set buffer_length(value: float64)
    }
    /** Plays back audio generated using [AudioStreamGenerator].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamgeneratorplayback.html  
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
    class AudioStreamImportSettingsDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreaminteractive.html  
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
        
        /** Returns `true` if a given transition exists (was added via [method add_transition]). */
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
        
        /** Amount of clips contained in this interactive player. */
        get clip_count(): any /*Clips,clip_,page_size=999,unfoldable,numbered,swap_method=_inspector_array_swap_clip,add_button_text=Add Clip*/
        set clip_count(value: any /*Clips,clip_,page_size=999,unfoldable,numbered,swap_method=_inspector_array_swap_clip,add_button_text=Add Clip*/)
        get "clip_0/name"(): StringName
        set "clip_0/name"(value: StringName)
        get "clip_0/stream"(): AudioStream
        set "clip_0/stream"(value: AudioStream)
        get "clip_0/auto_advance"(): int64
        set "clip_0/auto_advance"(value: int64)
        get "clip_0/next_clip"(): int64
        set "clip_0/next_clip"(value: int64)
        get "clip_1/name"(): StringName
        set "clip_1/name"(value: StringName)
        get "clip_1/stream"(): AudioStream
        set "clip_1/stream"(value: AudioStream)
        get "clip_1/auto_advance"(): int64
        set "clip_1/auto_advance"(value: int64)
        get "clip_1/next_clip"(): int64
        set "clip_1/next_clip"(value: int64)
        get "clip_2/name"(): StringName
        set "clip_2/name"(value: StringName)
        get "clip_2/stream"(): AudioStream
        set "clip_2/stream"(value: AudioStream)
        get "clip_2/auto_advance"(): int64
        set "clip_2/auto_advance"(value: int64)
        get "clip_2/next_clip"(): int64
        set "clip_2/next_clip"(value: int64)
        get "clip_3/name"(): StringName
        set "clip_3/name"(value: StringName)
        get "clip_3/stream"(): AudioStream
        set "clip_3/stream"(value: AudioStream)
        get "clip_3/auto_advance"(): int64
        set "clip_3/auto_advance"(value: int64)
        get "clip_3/next_clip"(): int64
        set "clip_3/next_clip"(value: int64)
        get "clip_4/name"(): StringName
        set "clip_4/name"(value: StringName)
        get "clip_4/stream"(): AudioStream
        set "clip_4/stream"(value: AudioStream)
        get "clip_4/auto_advance"(): int64
        set "clip_4/auto_advance"(value: int64)
        get "clip_4/next_clip"(): int64
        set "clip_4/next_clip"(value: int64)
        get "clip_5/name"(): StringName
        set "clip_5/name"(value: StringName)
        get "clip_5/stream"(): AudioStream
        set "clip_5/stream"(value: AudioStream)
        get "clip_5/auto_advance"(): int64
        set "clip_5/auto_advance"(value: int64)
        get "clip_5/next_clip"(): int64
        set "clip_5/next_clip"(value: int64)
        get "clip_6/name"(): StringName
        set "clip_6/name"(value: StringName)
        get "clip_6/stream"(): AudioStream
        set "clip_6/stream"(value: AudioStream)
        get "clip_6/auto_advance"(): int64
        set "clip_6/auto_advance"(value: int64)
        get "clip_6/next_clip"(): int64
        set "clip_6/next_clip"(value: int64)
        get "clip_7/name"(): StringName
        set "clip_7/name"(value: StringName)
        get "clip_7/stream"(): AudioStream
        set "clip_7/stream"(value: AudioStream)
        get "clip_7/auto_advance"(): int64
        set "clip_7/auto_advance"(value: int64)
        get "clip_7/next_clip"(): int64
        set "clip_7/next_clip"(value: int64)
        get "clip_8/name"(): StringName
        set "clip_8/name"(value: StringName)
        get "clip_8/stream"(): AudioStream
        set "clip_8/stream"(value: AudioStream)
        get "clip_8/auto_advance"(): int64
        set "clip_8/auto_advance"(value: int64)
        get "clip_8/next_clip"(): int64
        set "clip_8/next_clip"(value: int64)
        get "clip_9/name"(): StringName
        set "clip_9/name"(value: StringName)
        get "clip_9/stream"(): AudioStream
        set "clip_9/stream"(value: AudioStream)
        get "clip_9/auto_advance"(): int64
        set "clip_9/auto_advance"(value: int64)
        get "clip_9/next_clip"(): int64
        set "clip_9/next_clip"(value: int64)
        get "clip_10/name"(): StringName
        set "clip_10/name"(value: StringName)
        get "clip_10/stream"(): AudioStream
        set "clip_10/stream"(value: AudioStream)
        get "clip_10/auto_advance"(): int64
        set "clip_10/auto_advance"(value: int64)
        get "clip_10/next_clip"(): int64
        set "clip_10/next_clip"(value: int64)
        get "clip_11/name"(): StringName
        set "clip_11/name"(value: StringName)
        get "clip_11/stream"(): AudioStream
        set "clip_11/stream"(value: AudioStream)
        get "clip_11/auto_advance"(): int64
        set "clip_11/auto_advance"(value: int64)
        get "clip_11/next_clip"(): int64
        set "clip_11/next_clip"(value: int64)
        get "clip_12/name"(): StringName
        set "clip_12/name"(value: StringName)
        get "clip_12/stream"(): AudioStream
        set "clip_12/stream"(value: AudioStream)
        get "clip_12/auto_advance"(): int64
        set "clip_12/auto_advance"(value: int64)
        get "clip_12/next_clip"(): int64
        set "clip_12/next_clip"(value: int64)
        get "clip_13/name"(): StringName
        set "clip_13/name"(value: StringName)
        get "clip_13/stream"(): AudioStream
        set "clip_13/stream"(value: AudioStream)
        get "clip_13/auto_advance"(): int64
        set "clip_13/auto_advance"(value: int64)
        get "clip_13/next_clip"(): int64
        set "clip_13/next_clip"(value: int64)
        get "clip_14/name"(): StringName
        set "clip_14/name"(value: StringName)
        get "clip_14/stream"(): AudioStream
        set "clip_14/stream"(value: AudioStream)
        get "clip_14/auto_advance"(): int64
        set "clip_14/auto_advance"(value: int64)
        get "clip_14/next_clip"(): int64
        set "clip_14/next_clip"(value: int64)
        get "clip_15/name"(): StringName
        set "clip_15/name"(value: StringName)
        get "clip_15/stream"(): AudioStream
        set "clip_15/stream"(value: AudioStream)
        get "clip_15/auto_advance"(): int64
        set "clip_15/auto_advance"(value: int64)
        get "clip_15/next_clip"(): int64
        set "clip_15/next_clip"(value: int64)
        get "clip_16/name"(): StringName
        set "clip_16/name"(value: StringName)
        get "clip_16/stream"(): AudioStream
        set "clip_16/stream"(value: AudioStream)
        get "clip_16/auto_advance"(): int64
        set "clip_16/auto_advance"(value: int64)
        get "clip_16/next_clip"(): int64
        set "clip_16/next_clip"(value: int64)
        get "clip_17/name"(): StringName
        set "clip_17/name"(value: StringName)
        get "clip_17/stream"(): AudioStream
        set "clip_17/stream"(value: AudioStream)
        get "clip_17/auto_advance"(): int64
        set "clip_17/auto_advance"(value: int64)
        get "clip_17/next_clip"(): int64
        set "clip_17/next_clip"(value: int64)
        get "clip_18/name"(): StringName
        set "clip_18/name"(value: StringName)
        get "clip_18/stream"(): AudioStream
        set "clip_18/stream"(value: AudioStream)
        get "clip_18/auto_advance"(): int64
        set "clip_18/auto_advance"(value: int64)
        get "clip_18/next_clip"(): int64
        set "clip_18/next_clip"(value: int64)
        get "clip_19/name"(): StringName
        set "clip_19/name"(value: StringName)
        get "clip_19/stream"(): AudioStream
        set "clip_19/stream"(value: AudioStream)
        get "clip_19/auto_advance"(): int64
        set "clip_19/auto_advance"(value: int64)
        get "clip_19/next_clip"(): int64
        set "clip_19/next_clip"(value: int64)
        get "clip_20/name"(): StringName
        set "clip_20/name"(value: StringName)
        get "clip_20/stream"(): AudioStream
        set "clip_20/stream"(value: AudioStream)
        get "clip_20/auto_advance"(): int64
        set "clip_20/auto_advance"(value: int64)
        get "clip_20/next_clip"(): int64
        set "clip_20/next_clip"(value: int64)
        get "clip_21/name"(): StringName
        set "clip_21/name"(value: StringName)
        get "clip_21/stream"(): AudioStream
        set "clip_21/stream"(value: AudioStream)
        get "clip_21/auto_advance"(): int64
        set "clip_21/auto_advance"(value: int64)
        get "clip_21/next_clip"(): int64
        set "clip_21/next_clip"(value: int64)
        get "clip_22/name"(): StringName
        set "clip_22/name"(value: StringName)
        get "clip_22/stream"(): AudioStream
        set "clip_22/stream"(value: AudioStream)
        get "clip_22/auto_advance"(): int64
        set "clip_22/auto_advance"(value: int64)
        get "clip_22/next_clip"(): int64
        set "clip_22/next_clip"(value: int64)
        get "clip_23/name"(): StringName
        set "clip_23/name"(value: StringName)
        get "clip_23/stream"(): AudioStream
        set "clip_23/stream"(value: AudioStream)
        get "clip_23/auto_advance"(): int64
        set "clip_23/auto_advance"(value: int64)
        get "clip_23/next_clip"(): int64
        set "clip_23/next_clip"(value: int64)
        get "clip_24/name"(): StringName
        set "clip_24/name"(value: StringName)
        get "clip_24/stream"(): AudioStream
        set "clip_24/stream"(value: AudioStream)
        get "clip_24/auto_advance"(): int64
        set "clip_24/auto_advance"(value: int64)
        get "clip_24/next_clip"(): int64
        set "clip_24/next_clip"(value: int64)
        get "clip_25/name"(): StringName
        set "clip_25/name"(value: StringName)
        get "clip_25/stream"(): AudioStream
        set "clip_25/stream"(value: AudioStream)
        get "clip_25/auto_advance"(): int64
        set "clip_25/auto_advance"(value: int64)
        get "clip_25/next_clip"(): int64
        set "clip_25/next_clip"(value: int64)
        get "clip_26/name"(): StringName
        set "clip_26/name"(value: StringName)
        get "clip_26/stream"(): AudioStream
        set "clip_26/stream"(value: AudioStream)
        get "clip_26/auto_advance"(): int64
        set "clip_26/auto_advance"(value: int64)
        get "clip_26/next_clip"(): int64
        set "clip_26/next_clip"(value: int64)
        get "clip_27/name"(): StringName
        set "clip_27/name"(value: StringName)
        get "clip_27/stream"(): AudioStream
        set "clip_27/stream"(value: AudioStream)
        get "clip_27/auto_advance"(): int64
        set "clip_27/auto_advance"(value: int64)
        get "clip_27/next_clip"(): int64
        set "clip_27/next_clip"(value: int64)
        get "clip_28/name"(): StringName
        set "clip_28/name"(value: StringName)
        get "clip_28/stream"(): AudioStream
        set "clip_28/stream"(value: AudioStream)
        get "clip_28/auto_advance"(): int64
        set "clip_28/auto_advance"(value: int64)
        get "clip_28/next_clip"(): int64
        set "clip_28/next_clip"(value: int64)
        get "clip_29/name"(): StringName
        set "clip_29/name"(value: StringName)
        get "clip_29/stream"(): AudioStream
        set "clip_29/stream"(value: AudioStream)
        get "clip_29/auto_advance"(): int64
        set "clip_29/auto_advance"(value: int64)
        get "clip_29/next_clip"(): int64
        set "clip_29/next_clip"(value: int64)
        get "clip_30/name"(): StringName
        set "clip_30/name"(value: StringName)
        get "clip_30/stream"(): AudioStream
        set "clip_30/stream"(value: AudioStream)
        get "clip_30/auto_advance"(): int64
        set "clip_30/auto_advance"(value: int64)
        get "clip_30/next_clip"(): int64
        set "clip_30/next_clip"(value: int64)
        get "clip_31/name"(): StringName
        set "clip_31/name"(value: StringName)
        get "clip_31/stream"(): AudioStream
        set "clip_31/stream"(value: AudioStream)
        get "clip_31/auto_advance"(): int64
        set "clip_31/auto_advance"(value: int64)
        get "clip_31/next_clip"(): int64
        set "clip_31/next_clip"(value: int64)
        get "clip_32/name"(): StringName
        set "clip_32/name"(value: StringName)
        get "clip_32/stream"(): AudioStream
        set "clip_32/stream"(value: AudioStream)
        get "clip_32/auto_advance"(): int64
        set "clip_32/auto_advance"(value: int64)
        get "clip_32/next_clip"(): int64
        set "clip_32/next_clip"(value: int64)
        get "clip_33/name"(): StringName
        set "clip_33/name"(value: StringName)
        get "clip_33/stream"(): AudioStream
        set "clip_33/stream"(value: AudioStream)
        get "clip_33/auto_advance"(): int64
        set "clip_33/auto_advance"(value: int64)
        get "clip_33/next_clip"(): int64
        set "clip_33/next_clip"(value: int64)
        get "clip_34/name"(): StringName
        set "clip_34/name"(value: StringName)
        get "clip_34/stream"(): AudioStream
        set "clip_34/stream"(value: AudioStream)
        get "clip_34/auto_advance"(): int64
        set "clip_34/auto_advance"(value: int64)
        get "clip_34/next_clip"(): int64
        set "clip_34/next_clip"(value: int64)
        get "clip_35/name"(): StringName
        set "clip_35/name"(value: StringName)
        get "clip_35/stream"(): AudioStream
        set "clip_35/stream"(value: AudioStream)
        get "clip_35/auto_advance"(): int64
        set "clip_35/auto_advance"(value: int64)
        get "clip_35/next_clip"(): int64
        set "clip_35/next_clip"(value: int64)
        get "clip_36/name"(): StringName
        set "clip_36/name"(value: StringName)
        get "clip_36/stream"(): AudioStream
        set "clip_36/stream"(value: AudioStream)
        get "clip_36/auto_advance"(): int64
        set "clip_36/auto_advance"(value: int64)
        get "clip_36/next_clip"(): int64
        set "clip_36/next_clip"(value: int64)
        get "clip_37/name"(): StringName
        set "clip_37/name"(value: StringName)
        get "clip_37/stream"(): AudioStream
        set "clip_37/stream"(value: AudioStream)
        get "clip_37/auto_advance"(): int64
        set "clip_37/auto_advance"(value: int64)
        get "clip_37/next_clip"(): int64
        set "clip_37/next_clip"(value: int64)
        get "clip_38/name"(): StringName
        set "clip_38/name"(value: StringName)
        get "clip_38/stream"(): AudioStream
        set "clip_38/stream"(value: AudioStream)
        get "clip_38/auto_advance"(): int64
        set "clip_38/auto_advance"(value: int64)
        get "clip_38/next_clip"(): int64
        set "clip_38/next_clip"(value: int64)
        get "clip_39/name"(): StringName
        set "clip_39/name"(value: StringName)
        get "clip_39/stream"(): AudioStream
        set "clip_39/stream"(value: AudioStream)
        get "clip_39/auto_advance"(): int64
        set "clip_39/auto_advance"(value: int64)
        get "clip_39/next_clip"(): int64
        set "clip_39/next_clip"(value: int64)
        get "clip_40/name"(): StringName
        set "clip_40/name"(value: StringName)
        get "clip_40/stream"(): AudioStream
        set "clip_40/stream"(value: AudioStream)
        get "clip_40/auto_advance"(): int64
        set "clip_40/auto_advance"(value: int64)
        get "clip_40/next_clip"(): int64
        set "clip_40/next_clip"(value: int64)
        get "clip_41/name"(): StringName
        set "clip_41/name"(value: StringName)
        get "clip_41/stream"(): AudioStream
        set "clip_41/stream"(value: AudioStream)
        get "clip_41/auto_advance"(): int64
        set "clip_41/auto_advance"(value: int64)
        get "clip_41/next_clip"(): int64
        set "clip_41/next_clip"(value: int64)
        get "clip_42/name"(): StringName
        set "clip_42/name"(value: StringName)
        get "clip_42/stream"(): AudioStream
        set "clip_42/stream"(value: AudioStream)
        get "clip_42/auto_advance"(): int64
        set "clip_42/auto_advance"(value: int64)
        get "clip_42/next_clip"(): int64
        set "clip_42/next_clip"(value: int64)
        get "clip_43/name"(): StringName
        set "clip_43/name"(value: StringName)
        get "clip_43/stream"(): AudioStream
        set "clip_43/stream"(value: AudioStream)
        get "clip_43/auto_advance"(): int64
        set "clip_43/auto_advance"(value: int64)
        get "clip_43/next_clip"(): int64
        set "clip_43/next_clip"(value: int64)
        get "clip_44/name"(): StringName
        set "clip_44/name"(value: StringName)
        get "clip_44/stream"(): AudioStream
        set "clip_44/stream"(value: AudioStream)
        get "clip_44/auto_advance"(): int64
        set "clip_44/auto_advance"(value: int64)
        get "clip_44/next_clip"(): int64
        set "clip_44/next_clip"(value: int64)
        get "clip_45/name"(): StringName
        set "clip_45/name"(value: StringName)
        get "clip_45/stream"(): AudioStream
        set "clip_45/stream"(value: AudioStream)
        get "clip_45/auto_advance"(): int64
        set "clip_45/auto_advance"(value: int64)
        get "clip_45/next_clip"(): int64
        set "clip_45/next_clip"(value: int64)
        get "clip_46/name"(): StringName
        set "clip_46/name"(value: StringName)
        get "clip_46/stream"(): AudioStream
        set "clip_46/stream"(value: AudioStream)
        get "clip_46/auto_advance"(): int64
        set "clip_46/auto_advance"(value: int64)
        get "clip_46/next_clip"(): int64
        set "clip_46/next_clip"(value: int64)
        get "clip_47/name"(): StringName
        set "clip_47/name"(value: StringName)
        get "clip_47/stream"(): AudioStream
        set "clip_47/stream"(value: AudioStream)
        get "clip_47/auto_advance"(): int64
        set "clip_47/auto_advance"(value: int64)
        get "clip_47/next_clip"(): int64
        set "clip_47/next_clip"(value: int64)
        get "clip_48/name"(): StringName
        set "clip_48/name"(value: StringName)
        get "clip_48/stream"(): AudioStream
        set "clip_48/stream"(value: AudioStream)
        get "clip_48/auto_advance"(): int64
        set "clip_48/auto_advance"(value: int64)
        get "clip_48/next_clip"(): int64
        set "clip_48/next_clip"(value: int64)
        get "clip_49/name"(): StringName
        set "clip_49/name"(value: StringName)
        get "clip_49/stream"(): AudioStream
        set "clip_49/stream"(value: AudioStream)
        get "clip_49/auto_advance"(): int64
        set "clip_49/auto_advance"(value: int64)
        get "clip_49/next_clip"(): int64
        set "clip_49/next_clip"(value: int64)
        get "clip_50/name"(): StringName
        set "clip_50/name"(value: StringName)
        get "clip_50/stream"(): AudioStream
        set "clip_50/stream"(value: AudioStream)
        get "clip_50/auto_advance"(): int64
        set "clip_50/auto_advance"(value: int64)
        get "clip_50/next_clip"(): int64
        set "clip_50/next_clip"(value: int64)
        get "clip_51/name"(): StringName
        set "clip_51/name"(value: StringName)
        get "clip_51/stream"(): AudioStream
        set "clip_51/stream"(value: AudioStream)
        get "clip_51/auto_advance"(): int64
        set "clip_51/auto_advance"(value: int64)
        get "clip_51/next_clip"(): int64
        set "clip_51/next_clip"(value: int64)
        get "clip_52/name"(): StringName
        set "clip_52/name"(value: StringName)
        get "clip_52/stream"(): AudioStream
        set "clip_52/stream"(value: AudioStream)
        get "clip_52/auto_advance"(): int64
        set "clip_52/auto_advance"(value: int64)
        get "clip_52/next_clip"(): int64
        set "clip_52/next_clip"(value: int64)
        get "clip_53/name"(): StringName
        set "clip_53/name"(value: StringName)
        get "clip_53/stream"(): AudioStream
        set "clip_53/stream"(value: AudioStream)
        get "clip_53/auto_advance"(): int64
        set "clip_53/auto_advance"(value: int64)
        get "clip_53/next_clip"(): int64
        set "clip_53/next_clip"(value: int64)
        get "clip_54/name"(): StringName
        set "clip_54/name"(value: StringName)
        get "clip_54/stream"(): AudioStream
        set "clip_54/stream"(value: AudioStream)
        get "clip_54/auto_advance"(): int64
        set "clip_54/auto_advance"(value: int64)
        get "clip_54/next_clip"(): int64
        set "clip_54/next_clip"(value: int64)
        get "clip_55/name"(): StringName
        set "clip_55/name"(value: StringName)
        get "clip_55/stream"(): AudioStream
        set "clip_55/stream"(value: AudioStream)
        get "clip_55/auto_advance"(): int64
        set "clip_55/auto_advance"(value: int64)
        get "clip_55/next_clip"(): int64
        set "clip_55/next_clip"(value: int64)
        get "clip_56/name"(): StringName
        set "clip_56/name"(value: StringName)
        get "clip_56/stream"(): AudioStream
        set "clip_56/stream"(value: AudioStream)
        get "clip_56/auto_advance"(): int64
        set "clip_56/auto_advance"(value: int64)
        get "clip_56/next_clip"(): int64
        set "clip_56/next_clip"(value: int64)
        get "clip_57/name"(): StringName
        set "clip_57/name"(value: StringName)
        get "clip_57/stream"(): AudioStream
        set "clip_57/stream"(value: AudioStream)
        get "clip_57/auto_advance"(): int64
        set "clip_57/auto_advance"(value: int64)
        get "clip_57/next_clip"(): int64
        set "clip_57/next_clip"(value: int64)
        get "clip_58/name"(): StringName
        set "clip_58/name"(value: StringName)
        get "clip_58/stream"(): AudioStream
        set "clip_58/stream"(value: AudioStream)
        get "clip_58/auto_advance"(): int64
        set "clip_58/auto_advance"(value: int64)
        get "clip_58/next_clip"(): int64
        set "clip_58/next_clip"(value: int64)
        get "clip_59/name"(): StringName
        set "clip_59/name"(value: StringName)
        get "clip_59/stream"(): AudioStream
        set "clip_59/stream"(value: AudioStream)
        get "clip_59/auto_advance"(): int64
        set "clip_59/auto_advance"(value: int64)
        get "clip_59/next_clip"(): int64
        set "clip_59/next_clip"(value: int64)
        get "clip_60/name"(): StringName
        set "clip_60/name"(value: StringName)
        get "clip_60/stream"(): AudioStream
        set "clip_60/stream"(value: AudioStream)
        get "clip_60/auto_advance"(): int64
        set "clip_60/auto_advance"(value: int64)
        get "clip_60/next_clip"(): int64
        set "clip_60/next_clip"(value: int64)
        get "clip_61/name"(): StringName
        set "clip_61/name"(value: StringName)
        get "clip_61/stream"(): AudioStream
        set "clip_61/stream"(value: AudioStream)
        get "clip_61/auto_advance"(): int64
        set "clip_61/auto_advance"(value: int64)
        get "clip_61/next_clip"(): int64
        set "clip_61/next_clip"(value: int64)
        get "clip_62/name"(): StringName
        set "clip_62/name"(value: StringName)
        get "clip_62/stream"(): AudioStream
        set "clip_62/stream"(value: AudioStream)
        get "clip_62/auto_advance"(): int64
        set "clip_62/auto_advance"(value: int64)
        get "clip_62/next_clip"(): int64
        set "clip_62/next_clip"(value: int64)
        
        /** Index of the initial clip, which will be played first when this stream is played. */
        get initial_clip(): int64
        set initial_clip(value: int64)
        get _transitions(): GDictionary
        set _transitions(value: GDictionary)
    }
    class AudioStreamInteractiveEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class AudioStreamInteractiveTransitionEditor<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
        _update_transitions(): void
    }
    /** MP3 audio stream driver.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreammp3.html  
     */
    class AudioStreamMP3 extends AudioStream {
        constructor(identifier?: any)
        /** Creates a new [AudioStreamMP3] instance from the given buffer. The buffer must contain MP3 data. */
        static load_from_buffer(stream_data: PackedByteArray | byte[] | ArrayBuffer): AudioStreamMP3
        
        /** Creates a new [AudioStreamMP3] instance from the given file path. The file must be in MP3 format. */
        static load_from_file(path: string): AudioStreamMP3
        
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreammicrophone.html  
     */
    class AudioStreamMicrophone extends AudioStream {
        constructor(identifier?: any)
    }
    /** A class representing an Ogg Vorbis audio stream.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamoggvorbis.html  
     */
    class AudioStreamOggVorbis extends AudioStream {
        constructor(identifier?: any)
        /** Creates a new [AudioStreamOggVorbis] instance from the given buffer. The buffer must contain Ogg Vorbis data. */
        static load_from_buffer(stream_data: PackedByteArray | byte[] | ArrayBuffer): AudioStreamOggVorbis
        
        /** Creates a new [AudioStreamOggVorbis] instance from the given file path. The file must be in Ogg Vorbis format. */
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplayback.html  
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
        
        /** Mixes up to [param frames] of audio from the stream from the current position, at a rate of [param rate_scale], advancing the stream.  
         *  Returns a [PackedVector2Array] where each element holds the left and right channel volume levels of each frame.  
         *      
         *  **Note:** Can return fewer frames than requested, make sure to use the size of the return value.  
         */
        mix_audio(rate_scale: float64, frames: int64): PackedVector2Array
        
        /** Starts the stream from the given [param from_pos], in seconds. */
        start(from_pos: float64 = 0): void
        
        /** Seeks the stream at the given [param time], in seconds. */
        seek(time: float64 = 0): void
        
        /** Stops the stream. */
        stop(): void
        
        /** Returns the number of times the stream has looped. */
        get_loop_count(): int64
        
        /** Returns the current position in the stream, in seconds. */
        get_playback_position(): float64
        
        /** Returns `true` if the stream is playing. */
        is_playing(): boolean
    }
    /** Playback component of [AudioStreamInteractive].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplaybackinteractive.html  
     */
    class AudioStreamPlaybackInteractive extends AudioStreamPlayback {
        constructor(identifier?: any)
        /** Switch to a clip (by name). */
        switch_to_clip_by_name(clip_name: StringName): void
        
        /** Switch to a clip (by index). */
        switch_to_clip(clip_index: int64): void
        
        /** Return the index of the currently playing clip. You can use this to get the name of the currently playing clip with [method AudioStreamInteractive.get_clip_name].  
         *  **Example:** Get the currently playing clip name from inside an [AudioStreamPlayer] node.  
         *    
         */
        get_current_clip_index(): int64
    }
    /** @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplaybackoggvorbis.html */
    class AudioStreamPlaybackOggVorbis extends AudioStreamPlaybackResampled {
        constructor(identifier?: any)
    }
    /** Playback class used for [AudioStreamPlaylist].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplaybackplaylist.html  
     */
    class AudioStreamPlaybackPlaylist extends AudioStreamPlayback {
        constructor(identifier?: any)
    }
    /** Playback instance for [AudioStreamPolyphonic].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplaybackpolyphonic.html  
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
        
        /** Returns `true` if the stream associated with the given integer ID is still playing. Check [method play_stream] for information on when this ID becomes invalid. */
        is_stream_playing(stream: int64): boolean
        
        /** Stop a stream. The [param stream] argument is an integer ID returned by [method play_stream], which becomes invalid after calling this function. */
        stop_stream(stream: int64): void
    }
    /** @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplaybackresampled.html */
    class AudioStreamPlaybackResampled extends AudioStreamPlayback {
        constructor(identifier?: any)
        /* gdvirtual */ _mix_resampled(dst_buffer: int64, frame_count: int64): int64
        /* gdvirtual */ _get_stream_sampling_rate(): float64
        begin_resample(): void
    }
    /** @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplaybacksynchronized.html */
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplayer.html  
     */
    class AudioStreamPlayer<Map extends Record<string, Node> = Record<string, Node>> extends Node<Map> {
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
         *      
         *  **Note:** This method always returns `0.0` if the [member stream] is an [AudioStreamInteractive], since it can have multiple clips playing at once.  
         */
        get_playback_position(): float64
        
        /** Returns `true` if any sound is active, even if [member stream_paused] is set to `true`. See also [member playing] and [method get_stream_playback]. */
        has_stream_playback(): boolean
        
        /** Returns the latest [AudioStreamPlayback] of this node, usually the most recently created by [method play]. If no sounds are playing, this method fails and returns an empty playback. */
        get_stream_playback(): AudioStreamPlayback
        
        /** The [AudioStream] resource to be played. Setting this property stops all currently playing sounds. If left empty, the [AudioStreamPlayer] does not work. */
        get stream(): AudioStream
        set stream(value: AudioStream)
        
        /** Volume of sound, in decibels. This is an offset of the [member stream]'s volume.  
         *      
         *  **Note:** To convert between decibel and linear energy (like most volume sliders do), use [member volume_linear], or [method @GlobalScope.db_to_linear] and [method @GlobalScope.linear_to_db].  
         */
        get volume_db(): float64
        set volume_db(value: float64)
        
        /** Volume of sound, as a linear value.  
         *      
         *  **Note:** This member modifies [member volume_db] for convenience. The returned value is equivalent to the result of [method @GlobalScope.db_to_linear] on [member volume_db]. Setting this member is equivalent to setting [member volume_db] to the result of [method @GlobalScope.linear_to_db] on a value.  
         */
        get volume_linear(): float64
        set volume_linear(value: float64)
        
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplayer2d.html  
     */
    class AudioStreamPlayer2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Queues the audio to play on the next physics frame, from the given position [param from_position], in seconds. */
        play(from_position: float64 = 0): void
        
        /** Sets the position from which audio will be played, in seconds. */
        seek(to_position: float64): void
        
        /** Stops the audio. */
        stop(): void
        
        /** Returns the position in the [AudioStream]. */
        get_playback_position(): float64
        
        /** Returns whether the [AudioStreamPlayer] can return the [AudioStreamPlayback] object or not. */
        has_stream_playback(): boolean
        
        /** Returns the [AudioStreamPlayback] object associated with this [AudioStreamPlayer2D]. */
        get_stream_playback(): AudioStreamPlayback
        
        /** The [AudioStream] object to be played. */
        get stream(): AudioStream
        set stream(value: AudioStream)
        
        /** Base volume before attenuation, in decibels. */
        get volume_db(): float64
        set volume_db(value: float64)
        
        /** Base volume before attenuation, as a linear value.  
         *      
         *  **Note:** This member modifies [member volume_db] for convenience. The returned value is equivalent to the result of [method @GlobalScope.db_to_linear] on [member volume_db]. Setting this member is equivalent to setting [member volume_db] to the result of [method @GlobalScope.linear_to_db] on a value.  
         */
        get volume_linear(): float64
        set volume_linear(value: float64)
        
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplayer3d.html  
     */
    class AudioStreamPlayer3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Queues the audio to play on the next physics frame, from the given position [param from_position], in seconds. */
        play(from_position: float64 = 0): void
        
        /** Sets the position from which audio will be played, in seconds. */
        seek(to_position: float64): void
        
        /** Stops the audio. */
        stop(): void
        
        /** Returns the position in the [AudioStream]. */
        get_playback_position(): float64
        
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
        
        /** The base sound level before attenuation, as a linear value.  
         *      
         *  **Note:** This member modifies [member volume_db] for convenience. The returned value is equivalent to the result of [method @GlobalScope.db_to_linear] on [member volume_db]. Setting this member is equivalent to setting [member volume_db] to the result of [method @GlobalScope.linear_to_db] on a value.  
         */
        get volume_linear(): float64
        set volume_linear(value: float64)
        
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamplaylist.html  
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreampolyphonic.html  
     */
    class AudioStreamPolyphonic extends AudioStream {
        constructor(identifier?: any)
        /** Maximum amount of simultaneous streams that can be played. */
        get polyphony(): int64
        set polyphony(value: int64)
    }
    class AudioStreamPreviewGenerator<Map extends Record<string, Node> = Record<string, Node>> extends Node<Map> {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamrandomizer.html  
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
    class AudioStreamRandomizerEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** Stream that can be fitted with sub-streams, which will be played in-sync.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamsynchronized.html  
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
        get "stream_0/stream"(): AudioStream
        set "stream_0/stream"(value: AudioStream)
        get "stream_0/volume"(): float64
        set "stream_0/volume"(value: float64)
        get "stream_1/stream"(): AudioStream
        set "stream_1/stream"(value: AudioStream)
        get "stream_1/volume"(): float64
        set "stream_1/volume"(value: float64)
        get "stream_2/stream"(): AudioStream
        set "stream_2/stream"(value: AudioStream)
        get "stream_2/volume"(): float64
        set "stream_2/volume"(value: float64)
        get "stream_3/stream"(): AudioStream
        set "stream_3/stream"(value: AudioStream)
        get "stream_3/volume"(): float64
        set "stream_3/volume"(value: float64)
        get "stream_4/stream"(): AudioStream
        set "stream_4/stream"(value: AudioStream)
        get "stream_4/volume"(): float64
        set "stream_4/volume"(value: float64)
        get "stream_5/stream"(): AudioStream
        set "stream_5/stream"(value: AudioStream)
        get "stream_5/volume"(): float64
        set "stream_5/volume"(value: float64)
        get "stream_6/stream"(): AudioStream
        set "stream_6/stream"(value: AudioStream)
        get "stream_6/volume"(): float64
        set "stream_6/volume"(value: float64)
        get "stream_7/stream"(): AudioStream
        set "stream_7/stream"(value: AudioStream)
        get "stream_7/volume"(): float64
        set "stream_7/volume"(value: float64)
        get "stream_8/stream"(): AudioStream
        set "stream_8/stream"(value: AudioStream)
        get "stream_8/volume"(): float64
        set "stream_8/volume"(value: float64)
        get "stream_9/stream"(): AudioStream
        set "stream_9/stream"(value: AudioStream)
        get "stream_9/volume"(): float64
        set "stream_9/volume"(value: float64)
        get "stream_10/stream"(): AudioStream
        set "stream_10/stream"(value: AudioStream)
        get "stream_10/volume"(): float64
        set "stream_10/volume"(value: float64)
        get "stream_11/stream"(): AudioStream
        set "stream_11/stream"(value: AudioStream)
        get "stream_11/volume"(): float64
        set "stream_11/volume"(value: float64)
        get "stream_12/stream"(): AudioStream
        set "stream_12/stream"(value: AudioStream)
        get "stream_12/volume"(): float64
        set "stream_12/volume"(value: float64)
        get "stream_13/stream"(): AudioStream
        set "stream_13/stream"(value: AudioStream)
        get "stream_13/volume"(): float64
        set "stream_13/volume"(value: float64)
        get "stream_14/stream"(): AudioStream
        set "stream_14/stream"(value: AudioStream)
        get "stream_14/volume"(): float64
        set "stream_14/volume"(value: float64)
        get "stream_15/stream"(): AudioStream
        set "stream_15/stream"(value: AudioStream)
        get "stream_15/volume"(): float64
        set "stream_15/volume"(value: float64)
        get "stream_16/stream"(): AudioStream
        set "stream_16/stream"(value: AudioStream)
        get "stream_16/volume"(): float64
        set "stream_16/volume"(value: float64)
        get "stream_17/stream"(): AudioStream
        set "stream_17/stream"(value: AudioStream)
        get "stream_17/volume"(): float64
        set "stream_17/volume"(value: float64)
        get "stream_18/stream"(): AudioStream
        set "stream_18/stream"(value: AudioStream)
        get "stream_18/volume"(): float64
        set "stream_18/volume"(value: float64)
        get "stream_19/stream"(): AudioStream
        set "stream_19/stream"(value: AudioStream)
        get "stream_19/volume"(): float64
        set "stream_19/volume"(value: float64)
        get "stream_20/stream"(): AudioStream
        set "stream_20/stream"(value: AudioStream)
        get "stream_20/volume"(): float64
        set "stream_20/volume"(value: float64)
        get "stream_21/stream"(): AudioStream
        set "stream_21/stream"(value: AudioStream)
        get "stream_21/volume"(): float64
        set "stream_21/volume"(value: float64)
        get "stream_22/stream"(): AudioStream
        set "stream_22/stream"(value: AudioStream)
        get "stream_22/volume"(): float64
        set "stream_22/volume"(value: float64)
        get "stream_23/stream"(): AudioStream
        set "stream_23/stream"(value: AudioStream)
        get "stream_23/volume"(): float64
        set "stream_23/volume"(value: float64)
        get "stream_24/stream"(): AudioStream
        set "stream_24/stream"(value: AudioStream)
        get "stream_24/volume"(): float64
        set "stream_24/volume"(value: float64)
        get "stream_25/stream"(): AudioStream
        set "stream_25/stream"(value: AudioStream)
        get "stream_25/volume"(): float64
        set "stream_25/volume"(value: float64)
        get "stream_26/stream"(): AudioStream
        set "stream_26/stream"(value: AudioStream)
        get "stream_26/volume"(): float64
        set "stream_26/volume"(value: float64)
        get "stream_27/stream"(): AudioStream
        set "stream_27/stream"(value: AudioStream)
        get "stream_27/volume"(): float64
        set "stream_27/volume"(value: float64)
        get "stream_28/stream"(): AudioStream
        set "stream_28/stream"(value: AudioStream)
        get "stream_28/volume"(): float64
        set "stream_28/volume"(value: float64)
        get "stream_29/stream"(): AudioStream
        set "stream_29/stream"(value: AudioStream)
        get "stream_29/volume"(): float64
        set "stream_29/volume"(value: float64)
        get "stream_30/stream"(): AudioStream
        set "stream_30/stream"(value: AudioStream)
        get "stream_30/volume"(): float64
        set "stream_30/volume"(value: float64)
        get "stream_31/stream"(): AudioStream
        set "stream_31/stream"(value: AudioStream)
        get "stream_31/volume"(): float64
        set "stream_31/volume"(value: float64)
    }
    namespace AudioStreamWAV {
        enum Format {
            /** 8-bit PCM audio codec. */
            FORMAT_8_BITS = 0,
            
            /** 16-bit PCM audio codec. */
            FORMAT_16_BITS = 1,
            
            /** Audio is lossily compressed as IMA ADPCM. */
            FORMAT_IMA_ADPCM = 2,
            
            /** Audio is lossily compressed as [url=https://qoaformat.org/]Quite OK Audio[/url]. */
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_audiostreamwav.html  
     */
    class AudioStreamWAV extends AudioStream {
        constructor(identifier?: any)
        /** Creates a new [AudioStreamWAV] instance from the given buffer. The buffer must contain WAV data.  
         *  The keys and values of [param options] match the properties of [ResourceImporterWAV]. The usage of [param options] is identical to [method AudioStreamWAV.load_from_file].  
         */
        static load_from_buffer(stream_data: PackedByteArray | byte[] | ArrayBuffer, options: GDictionary = new GDictionary()): AudioStreamWAV
        
        /** Creates a new [AudioStreamWAV] instance from the given file path. The file must be in WAV format.  
         *  The keys and values of [param options] match the properties of [ResourceImporterWAV].  
         *  **Example:** Load the first file dropped as a WAV and play it:  
         *    
         */
        static load_from_file(path: string, options: GDictionary = new GDictionary()): AudioStreamWAV
        
        /** Saves the AudioStreamWAV as a WAV file to [param path]. Samples with IMA ADPCM or Quite OK Audio formats can't be saved.  
         *      
         *  **Note:** A `.wav` extension is automatically appended to [param path] if it is missing.  
         */
        save_to_wav(path: string): GError
        
        /** Contains the audio data in bytes.  
         *      
         *  **Note:** If [member format] is set to [constant FORMAT_8_BITS], this property expects signed 8-bit PCM data. To convert from unsigned 8-bit PCM, subtract 128 from each byte.  
         *      
         *  **Note:** If [member format] is set to [constant FORMAT_QOA], this property expects data from a full QOA file.  
         */
        get data(): PackedByteArray
        set data(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** Audio format. See [enum Format] constants for values. */
        get format(): int64
        set format(value: int64)
        
        /** The loop mode. See [enum LoopMode] constants for values. */
        get loop_mode(): int64
        set loop_mode(value: int64)
        
        /** The loop start point (in number of samples, relative to the beginning of the stream). */
        get loop_begin(): int64
        set loop_begin(value: int64)
        
        /** The loop end point (in number of samples, relative to the beginning of the stream). */
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_backbuffercopy.html  
     */
    class BackBufferCopy<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Buffer mode. See [enum CopyMode] constants. */
        get copy_mode(): int64
        set copy_mode(value: int64)
        
        /** The area covered by the [BackBufferCopy]. Only used if [member copy_mode] is [constant COPY_MODE_RECT]. */
        get rect(): Rect2
        set rect(value: Rect2)
    }
    class BackgroundProgress<Map extends Record<string, Node> = Record<string, Node>> extends HBoxContainer<Map> {
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
     *  @link https://docs.godotengine.org/en/4.4/classes/class_basebutton.html  
     */
    class BaseButton<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
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
         *  **Note:** Changing the value of [member button_pressed] will result in [signal toggled] to be emitted. If you want to change the pressed state without emitting that signal, use [method set_pressed_no_signal].  
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
        
        /** If `true`, the button will add information about its shortcut in the tooltip.  
         *      
         *  **Note:** This property does nothing when the tooltip control is customized using [method Control._make_custom_tooltip].  
         */
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
}
