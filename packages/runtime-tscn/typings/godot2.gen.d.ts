// AUTO-GENERATED
/// <reference no-default-lib="true"/>
declare module "godot" {
    /** A syntax highlighter intended for code.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_codehighlighter.html  
     */
    class CodeHighlighter extends SyntaxHighlighter {
        constructor(identifier?: any)
        /** Sets the color for a keyword.  
         *  The keyword cannot contain any symbols except '_'.  
         */
        add_keyword_color(keyword: string, color: Color): void
        
        /** Removes the keyword. */
        remove_keyword_color(keyword: string): void
        
        /** Returns `true` if the keyword exists, else `false`. */
        has_keyword_color(keyword: string): boolean
        
        /** Returns the color for a keyword. */
        get_keyword_color(keyword: string): Color
        
        /** Removes all keywords. */
        clear_keyword_colors(): void
        
        /** Sets the color for a member keyword.  
         *  The member keyword cannot contain any symbols except '_'.  
         *  It will not be highlighted if preceded by a '.'.  
         */
        add_member_keyword_color(member_keyword: string, color: Color): void
        
        /** Removes the member keyword. */
        remove_member_keyword_color(member_keyword: string): void
        
        /** Returns `true` if the member keyword exists, else `false`. */
        has_member_keyword_color(member_keyword: string): boolean
        
        /** Returns the color for a member keyword. */
        get_member_keyword_color(member_keyword: string): Color
        
        /** Removes all member keywords. */
        clear_member_keyword_colors(): void
        
        /** Adds a color region (such as for comments or strings) from [param start_key] to [param end_key]. Both keys should be symbols, and [param start_key] must not be shared with other delimiters.  
         *  If [param line_only] is `true` or [param end_key] is an empty [String], the region does not carry over to the next line.  
         */
        add_color_region(start_key: string, end_key: string, color: Color, line_only: boolean = false): void
        
        /** Removes the color region that uses that start key. */
        remove_color_region(start_key: string): void
        
        /** Returns `true` if the start key exists, else `false`. */
        has_color_region(start_key: string): boolean
        
        /** Removes all color regions. */
        clear_color_regions(): void
        
        /** Sets the color for numbers. */
        get number_color(): Color
        set number_color(value: Color)
        
        /** Sets the color for symbols. */
        get symbol_color(): Color
        set symbol_color(value: Color)
        
        /** Sets color for functions. A function is a non-keyword string followed by a '('. */
        get function_color(): Color
        set function_color(value: Color)
        
        /** Sets color for member variables. A member variable is non-keyword, non-function string proceeded with a '.'. */
        get member_variable_color(): Color
        set member_variable_color(value: Color)
        
        /** Sets the keyword colors. All existing keywords will be removed. The [Dictionary] key is the keyword. The value is the keyword color. */
        get keyword_colors(): GDictionary
        set keyword_colors(value: GDictionary)
        
        /** Sets the member keyword colors. All existing member keyword will be removed. The [Dictionary] key is the member keyword. The value is the member keyword color. */
        get member_keyword_colors(): GDictionary
        set member_keyword_colors(value: GDictionary)
        
        /** Sets the color regions. All existing regions will be removed. The [Dictionary] key is the region start and end key, separated by a space. The value is the region color. */
        get color_regions(): GDictionary
        set color_regions(value: GDictionary)
    }
    namespace CollisionObject2D {
        enum DisableMode {
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], remove from the physics simulation to stop all physics interactions with this [CollisionObject2D].  
             *  Automatically re-added to the physics simulation when the [Node] is processed again.  
             */
            DISABLE_MODE_REMOVE = 0,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], make the body static. Doesn't affect [Area2D]. [PhysicsBody2D] can't be affected by forces or other bodies while static.  
             *  Automatically set [PhysicsBody2D] back to its original mode when the [Node] is processed again.  
             */
            DISABLE_MODE_MAKE_STATIC = 1,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], do not affect the physics simulation. */
            DISABLE_MODE_KEEP_ACTIVE = 2,
        }
    }
    /** Abstract base class for 2D physics objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_collisionobject2d.html  
     */
    class CollisionObject2D extends Node2D {
        constructor(identifier?: any)
        /** Accepts unhandled [InputEvent]s. [param shape_idx] is the child index of the clicked [Shape2D]. Connect to [signal input_event] to easily pick up these events.  
         *      
         *  **Note:** [method _input_event] requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set.  
         */
        /* gdvirtual */ _input_event(viewport: Viewport, event: InputEvent, shape_idx: int64): void
        
        /** Called when the mouse pointer enters any of this object's shapes. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject2D] won't cause this function to be called. */
        /* gdvirtual */ _mouse_enter(): void
        
        /** Called when the mouse pointer exits all this object's shapes. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject2D] won't cause this function to be called. */
        /* gdvirtual */ _mouse_exit(): void
        
        /** Called when the mouse pointer enters any of this object's shapes or moves from one shape to another. [param shape_idx] is the child index of the newly entered [Shape2D]. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be called. */
        /* gdvirtual */ _mouse_shape_enter(shape_idx: int64): void
        
        /** Called when the mouse pointer exits any of this object's shapes. [param shape_idx] is the child index of the exited [Shape2D]. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be called. */
        /* gdvirtual */ _mouse_shape_exit(shape_idx: int64): void
        
        /** Returns the object's [RID]. */
        get_rid(): RID
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_layer], given a [param layer_number] between 1 and 32. */
        set_collision_layer_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_layer] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_layer_value(layer_number: int64): boolean
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** Creates a new shape owner for the given object. Returns `owner_id` of the new owner for future reference. */
        create_shape_owner(owner: Object): int64
        
        /** Removes the given shape owner. */
        remove_shape_owner(owner_id: int64): void
        
        /** Returns an [Array] of `owner_id` identifiers. You can use these ids in other methods that take `owner_id` as an argument. */
        get_shape_owners(): PackedInt32Array
        
        /** Sets the [Transform2D] of the given shape owner. */
        shape_owner_set_transform(owner_id: int64, transform: Transform2D): void
        
        /** Returns the shape owner's [Transform2D]. */
        shape_owner_get_transform(owner_id: int64): Transform2D
        
        /** Returns the parent object of the given shape owner. */
        shape_owner_get_owner(owner_id: int64): Object
        
        /** If `true`, disables the given shape owner. */
        shape_owner_set_disabled(owner_id: int64, disabled: boolean): void
        
        /** If `true`, the shape owner and its shapes are disabled. */
        is_shape_owner_disabled(owner_id: int64): boolean
        
        /** If [param enable] is `true`, collisions for the shape owner originating from this [CollisionObject2D] will not be reported to collided with [CollisionObject2D]s. */
        shape_owner_set_one_way_collision(owner_id: int64, enable: boolean): void
        
        /** Returns `true` if collisions for the shape owner originating from this [CollisionObject2D] will not be reported to collided with [CollisionObject2D]s. */
        is_shape_owner_one_way_collision_enabled(owner_id: int64): boolean
        
        /** Sets the `one_way_collision_margin` of the shape owner identified by given [param owner_id] to [param margin] pixels. */
        shape_owner_set_one_way_collision_margin(owner_id: int64, margin: float64): void
        
        /** Returns the `one_way_collision_margin` of the shape owner identified by given [param owner_id]. */
        get_shape_owner_one_way_collision_margin(owner_id: int64): float64
        
        /** Adds a [Shape2D] to the shape owner. */
        shape_owner_add_shape(owner_id: int64, shape: Shape2D): void
        
        /** Returns the number of shapes the given shape owner contains. */
        shape_owner_get_shape_count(owner_id: int64): int64
        
        /** Returns the [Shape2D] with the given ID from the given shape owner. */
        shape_owner_get_shape(owner_id: int64, shape_id: int64): Shape2D
        
        /** Returns the child index of the [Shape2D] with the given ID from the given shape owner. */
        shape_owner_get_shape_index(owner_id: int64, shape_id: int64): int64
        
        /** Removes a shape from the given shape owner. */
        shape_owner_remove_shape(owner_id: int64, shape_id: int64): void
        
        /** Removes all shapes from the shape owner. */
        shape_owner_clear_shapes(owner_id: int64): void
        
        /** Returns the `owner_id` of the given shape. */
        shape_find_owner(shape_index: int64): int64
        
        /** Defines the behavior in physics when [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED]. See [enum DisableMode] for more details about the different modes. */
        get disable_mode(): int64
        set disable_mode(value: int64)
        
        /** The physics layers this CollisionObject2D is in. Collision objects can exist in one or more of 32 different layers. See also [member collision_mask].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.3/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_layer(): int64
        set collision_layer(value: int64)
        
        /** The physics layers this CollisionObject2D scans. Collision objects can scan one or more of 32 different layers. See also [member collision_layer].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.3/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The priority used to solve colliding when occurring penetration. The higher the priority is, the lower the penetration into the object will be. This can for example be used to prevent the player from breaking through the boundaries of a level. */
        get collision_priority(): float64
        set collision_priority(value: float64)
        
        /** If `true`, this object is pickable. A pickable object can detect the mouse pointer entering/leaving, and if the mouse is inside it, report input events. Requires at least one [member collision_layer] bit to be set. */
        get input_pickable(): boolean
        set input_pickable(value: boolean)
        
        /** Emitted when an input event occurs. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. See [method _input_event] for details. */
        readonly input_event: Signal3<Node, InputEvent, int64>
        
        /** Emitted when the mouse pointer enters any of this object's shapes. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject2D] won't cause this signal to be emitted.  
         *      
         *  **Note:** Due to the lack of continuous collision detection, this signal may not be emitted in the expected order if the mouse moves fast enough and the [CollisionObject2D]'s area is small. This signal may also not be emitted if another [CollisionObject2D] is overlapping the [CollisionObject2D] in question.  
         */
        readonly mouse_entered: Signal0
        
        /** Emitted when the mouse pointer exits all this object's shapes. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject2D] won't cause this signal to be emitted.  
         *      
         *  **Note:** Due to the lack of continuous collision detection, this signal may not be emitted in the expected order if the mouse moves fast enough and the [CollisionObject2D]'s area is small. This signal may also not be emitted if another [CollisionObject2D] is overlapping the [CollisionObject2D] in question.  
         */
        readonly mouse_exited: Signal0
        
        /** Emitted when the mouse pointer enters any of this object's shapes or moves from one shape to another. [param shape_idx] is the child index of the newly entered [Shape2D]. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. */
        readonly mouse_shape_entered: Signal1<int64>
        
        /** Emitted when the mouse pointer exits any of this object's shapes. [param shape_idx] is the child index of the exited [Shape2D]. Requires [member input_pickable] to be `true` and at least one [member collision_layer] bit to be set. */
        readonly mouse_shape_exited: Signal1<int64>
    }
    namespace CollisionObject3D {
        enum DisableMode {
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], remove from the physics simulation to stop all physics interactions with this [CollisionObject3D].  
             *  Automatically re-added to the physics simulation when the [Node] is processed again.  
             */
            DISABLE_MODE_REMOVE = 0,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], make the body static. Doesn't affect [Area3D]. [PhysicsBody3D] can't be affected by forces or other bodies while static.  
             *  Automatically set [PhysicsBody3D] back to its original mode when the [Node] is processed again.  
             */
            DISABLE_MODE_MAKE_STATIC = 1,
            
            /** When [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED], do not affect the physics simulation. */
            DISABLE_MODE_KEEP_ACTIVE = 2,
        }
    }
    /** Abstract base class for 3D physics objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_collisionobject3d.html  
     */
    class CollisionObject3D extends Node3D {
        constructor(identifier?: any)
        /** Receives unhandled [InputEvent]s. [param event_position] is the location in world space of the mouse pointer on the surface of the shape with index [param shape_idx] and [param normal] is the normal vector of the surface at that point. Connect to the [signal input_event] signal to easily pick up these events.  
         *      
         *  **Note:** [method _input_event] requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set.  
         */
        /* gdvirtual */ _input_event(camera: Camera3D, event: InputEvent, event_position: Vector3, normal: Vector3, shape_idx: int64): void
        
        /** Called when the mouse pointer enters any of this object's shapes. Requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject3D] won't cause this function to be called. */
        /* gdvirtual */ _mouse_enter(): void
        
        /** Called when the mouse pointer exits all this object's shapes. Requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set. Note that moving between different shapes within a single [CollisionObject3D] won't cause this function to be called. */
        /* gdvirtual */ _mouse_exit(): void
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_layer], given a [param layer_number] between 1 and 32. */
        set_collision_layer_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_layer] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_layer_value(layer_number: int64): boolean
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** Returns the object's [RID]. */
        get_rid(): RID
        
        /** Creates a new shape owner for the given object. Returns `owner_id` of the new owner for future reference. */
        create_shape_owner(owner: Object): int64
        
        /** Removes the given shape owner. */
        remove_shape_owner(owner_id: int64): void
        
        /** Returns an [Array] of `owner_id` identifiers. You can use these ids in other methods that take `owner_id` as an argument. */
        get_shape_owners(): PackedInt32Array
        
        /** Sets the [Transform3D] of the given shape owner. */
        shape_owner_set_transform(owner_id: int64, transform: Transform3D): void
        
        /** Returns the shape owner's [Transform3D]. */
        shape_owner_get_transform(owner_id: int64): Transform3D
        
        /** Returns the parent object of the given shape owner. */
        shape_owner_get_owner(owner_id: int64): Object
        
        /** If `true`, disables the given shape owner. */
        shape_owner_set_disabled(owner_id: int64, disabled: boolean): void
        
        /** If `true`, the shape owner and its shapes are disabled. */
        is_shape_owner_disabled(owner_id: int64): boolean
        
        /** Adds a [Shape3D] to the shape owner. */
        shape_owner_add_shape(owner_id: int64, shape: Shape3D): void
        
        /** Returns the number of shapes the given shape owner contains. */
        shape_owner_get_shape_count(owner_id: int64): int64
        
        /** Returns the [Shape3D] with the given ID from the given shape owner. */
        shape_owner_get_shape(owner_id: int64, shape_id: int64): Shape3D
        
        /** Returns the child index of the [Shape3D] with the given ID from the given shape owner. */
        shape_owner_get_shape_index(owner_id: int64, shape_id: int64): int64
        
        /** Removes a shape from the given shape owner. */
        shape_owner_remove_shape(owner_id: int64, shape_id: int64): void
        
        /** Removes all shapes from the shape owner. */
        shape_owner_clear_shapes(owner_id: int64): void
        
        /** Returns the `owner_id` of the given shape. */
        shape_find_owner(shape_index: int64): int64
        
        /** Defines the behavior in physics when [member Node.process_mode] is set to [constant Node.PROCESS_MODE_DISABLED]. See [enum DisableMode] for more details about the different modes. */
        get disable_mode(): int64
        set disable_mode(value: int64)
        
        /** The physics layers this CollisionObject3D **is in**. Collision objects can exist in one or more of 32 different layers. See also [member collision_mask].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.3/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_layer(): int64
        set collision_layer(value: int64)
        
        /** The physics layers this CollisionObject3D **scans**. Collision objects can scan one or more of 32 different layers. See also [member collision_layer].  
         *      
         *  **Note:** Object A can detect a contact with object B only if object B is in any of the layers that object A scans. See [url=https://docs.godotengine.org/en/4.3/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information.  
         */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The priority used to solve colliding when occurring penetration. The higher the priority is, the lower the penetration into the object will be. This can for example be used to prevent the player from breaking through the boundaries of a level. */
        get collision_priority(): float64
        set collision_priority(value: float64)
        
        /** If `true`, this object is pickable. A pickable object can detect the mouse pointer entering/leaving, and if the mouse is inside it, report input events. Requires at least one [member collision_layer] bit to be set. */
        get input_ray_pickable(): boolean
        set input_ray_pickable(value: boolean)
        
        /** If `true`, the [CollisionObject3D] will continue to receive input events as the mouse is dragged across its shapes. */
        get input_capture_on_drag(): boolean
        set input_capture_on_drag(value: boolean)
        
        /** Emitted when the object receives an unhandled [InputEvent]. [param event_position] is the location in world space of the mouse pointer on the surface of the shape with index [param shape_idx] and [param normal] is the normal vector of the surface at that point. */
        readonly input_event: Signal5<Node, InputEvent, Vector3, Vector3, int64>
        
        /** Emitted when the mouse pointer enters any of this object's shapes. Requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set.  
         *      
         *  **Note:** Due to the lack of continuous collision detection, this signal may not be emitted in the expected order if the mouse moves fast enough and the [CollisionObject3D]'s area is small. This signal may also not be emitted if another [CollisionObject3D] is overlapping the [CollisionObject3D] in question.  
         */
        readonly mouse_entered: Signal0
        
        /** Emitted when the mouse pointer exits all this object's shapes. Requires [member input_ray_pickable] to be `true` and at least one [member collision_layer] bit to be set.  
         *      
         *  **Note:** Due to the lack of continuous collision detection, this signal may not be emitted in the expected order if the mouse moves fast enough and the [CollisionObject3D]'s area is small. This signal may also not be emitted if another [CollisionObject3D] is overlapping the [CollisionObject3D] in question.  
         */
        readonly mouse_exited: Signal0
    }
    class CollisionObject3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    namespace CollisionPolygon2D {
        enum BuildMode {
            /** Collisions will include the polygon and its contained area. In this mode the node has the same effect as several [ConvexPolygonShape2D] nodes, one for each convex shape in the convex decomposition of the polygon (but without the overhead of multiple nodes). */
            BUILD_SOLIDS = 0,
            
            /** Collisions will only include the polygon edges. In this mode the node has the same effect as a single [ConcavePolygonShape2D] made of segments, with the restriction that each segment (after the first one) starts where the previous one ends, and the last one ends where the first one starts (forming a closed but hollow polygon). */
            BUILD_SEGMENTS = 1,
        }
    }
    /** A node that provides a polygon shape to a [CollisionObject2D] parent.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_collisionpolygon2d.html  
     */
    class CollisionPolygon2D extends Node2D {
        constructor(identifier?: any)
        /** Collision build mode. Use one of the [enum BuildMode] constants. */
        get build_mode(): int64
        set build_mode(value: int64)
        
        /** The polygon's list of vertices. Each point will be connected to the next, and the final point will be connected to the first.  
         *      
         *  **Note:** The returned vertices are in the local coordinate space of the given [CollisionPolygon2D].  
         */
        get polygon(): PackedVector2Array
        set polygon(value: PackedVector2Array | Vector2[])
        
        /** If `true`, no collisions will be detected. */
        get disabled(): boolean
        set disabled(value: boolean)
        
        /** If `true`, only edges that face up, relative to [CollisionPolygon2D]'s rotation, will collide with other objects.  
         *      
         *  **Note:** This property has no effect if this [CollisionPolygon2D] is a child of an [Area2D] node.  
         */
        get one_way_collision(): boolean
        set one_way_collision(value: boolean)
        
        /** The margin used for one-way collision (in pixels). Higher values will make the shape thicker, and work better for colliders that enter the polygon at a high velocity. */
        get one_way_collision_margin(): float64
        set one_way_collision_margin(value: float64)
    }
    class CollisionPolygon2DEditor extends AbstractPolygon2DEditor {
        constructor(identifier?: any)
    }
    class CollisionPolygon2DEditorPlugin extends AbstractPolygon2DEditorPlugin {
        constructor(identifier?: any)
    }
    /** A node that provides a thickened polygon shape (a prism) to a [CollisionObject3D] parent.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_collisionpolygon3d.html  
     */
    class CollisionPolygon3D extends Node3D {
        constructor(identifier?: any)
        _is_editable_3d_polygon(): boolean
        
        /** Length that the resulting collision extends in either direction perpendicular to its 2D polygon. */
        get depth(): float64
        set depth(value: float64)
        
        /** If `true`, no collision will be produced. */
        get disabled(): boolean
        set disabled(value: boolean)
        
        /** Array of vertices which define the 2D polygon in the local XY plane. */
        get polygon(): PackedVector2Array
        set polygon(value: PackedVector2Array | Vector2[])
        
        /** The collision margin for the generated [Shape3D]. See [member Shape3D.margin] for more details. */
        get margin(): float64
        set margin(value: float64)
    }
    class CollisionPolygon3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** A node that provides a [Shape2D] to a [CollisionObject2D] parent.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_collisionshape2d.html  
     */
    class CollisionShape2D extends Node2D {
        constructor(identifier?: any)
        /** The actual shape owned by this collision shape. */
        get shape(): Shape2D
        set shape(value: Shape2D)
        
        /** A disabled collision shape has no effect in the world. This property should be changed with [method Object.set_deferred]. */
        get disabled(): boolean
        set disabled(value: boolean)
        
        /** Sets whether this collision shape should only detect collision on one side (top or bottom).  
         *      
         *  **Note:** This property has no effect if this [CollisionShape2D] is a child of an [Area2D] node.  
         */
        get one_way_collision(): boolean
        set one_way_collision(value: boolean)
        
        /** The margin used for one-way collision (in pixels). Higher values will make the shape thicker, and work better for colliders that enter the shape at a high velocity. */
        get one_way_collision_margin(): float64
        set one_way_collision_margin(value: float64)
        
        /** The collision shape debug color.  
         *      
         *  **Note:** The default value is [member ProjectSettings.debug/shapes/collision/shape_color]. The `Color(0, 0, 0, 1)` value documented here is a placeholder, and not the actual default debug color.  
         */
        get debug_color(): Color
        set debug_color(value: Color)
    }
    class CollisionShape2DEditor extends Control {
        constructor(identifier?: any)
    }
    class CollisionShape2DEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** A node that provides a [Shape3D] to a [CollisionObject3D] parent.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_collisionshape3d.html  
     */
    class CollisionShape3D extends Node3D {
        constructor(identifier?: any)
        /** This method does nothing. */
        resource_changed(resource: Resource): void
        
        /** Sets the collision shape's shape to the addition of all its convexed [MeshInstance3D] siblings geometry. */
        make_convex_from_siblings(): void
        
        /** The actual shape owned by this collision shape. */
        get shape(): Shape3D
        set shape(value: Shape3D)
        
        /** A disabled collision shape has no effect in the world. */
        get disabled(): boolean
        set disabled(value: boolean)
    }
    class CollisionShape3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    namespace ColorPicker {
        enum ColorModeType {
            /** Allows editing the color with Red/Green/Blue sliders. */
            MODE_RGB = 0,
            
            /** Allows editing the color with Hue/Saturation/Value sliders. */
            MODE_HSV = 1,
            
            /** Allows the color R, G, B component values to go beyond 1.0, which can be used for certain special operations that require it (like tinting without darkening or rendering sprites in HDR). */
            MODE_RAW = 2,
            
            /** Allows editing the color with Hue/Saturation/Lightness sliders.  
             *  OKHSL is a new color space similar to HSL but that better match perception by leveraging the Oklab color space which is designed to be simple to use, while doing a good job at predicting perceived lightness, chroma and hue.  
             *  [url=https://bottosson.github.io/posts/colorpicker/]Okhsv and Okhsl color spaces[/url]  
             */
            MODE_OKHSL = 3,
        }
        enum PickerShapeType {
            /** HSV Color Model rectangle color space. */
            SHAPE_HSV_RECTANGLE = 0,
            
            /** HSV Color Model rectangle color space with a wheel. */
            SHAPE_HSV_WHEEL = 1,
            
            /** HSV Color Model circle color space. Use Saturation as a radius. */
            SHAPE_VHS_CIRCLE = 2,
            
            /** HSL OK Color Model circle color space. */
            SHAPE_OKHSL_CIRCLE = 3,
            
            /** The color space shape and the shape select button are hidden. Can't be selected from the shapes popup. */
            SHAPE_NONE = 4,
        }
    }
    /** A widget that provides an interface for selecting or modifying a color.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_colorpicker.html  
     */
    class ColorPicker extends VBoxContainer {
        constructor(identifier?: any)
        /** Adds the given color to a list of color presets. The presets are displayed in the color picker and the user will be able to select them.  
         *      
         *  **Note:** The presets list is only for  *this*  color picker.  
         */
        add_preset(color: Color): void
        
        /** Removes the given color from the list of color presets of this color picker. */
        erase_preset(color: Color): void
        
        /** Returns the list of colors in the presets of the color picker. */
        get_presets(): PackedColorArray
        
        /** Adds the given color to a list of color recent presets so that it can be picked later. Recent presets are the colors that were picked recently, a new preset is automatically created and added to recent presets when you pick a new color.  
         *      
         *  **Note:** The recent presets list is only for  *this*  color picker.  
         */
        add_recent_preset(color: Color): void
        
        /** Removes the given color from the list of color recent presets of this color picker. */
        erase_recent_preset(color: Color): void
        
        /** Returns the list of colors in the recent presets of the color picker. */
        get_recent_presets(): PackedColorArray
        
        /** The currently selected color. */
        get color(): Color
        set color(value: Color)
        
        /** If `true`, shows an alpha channel slider (opacity). */
        get edit_alpha(): boolean
        set edit_alpha(value: boolean)
        
        /** The currently selected color mode. See [enum ColorModeType]. */
        get color_mode(): int64
        set color_mode(value: int64)
        
        /** If `true`, the color will apply only after the user releases the mouse button, otherwise it will apply immediately even in mouse motion event (which can cause performance issues). */
        get deferred_mode(): boolean
        set deferred_mode(value: boolean)
        
        /** The shape of the color space view. See [enum PickerShapeType]. */
        get picker_shape(): int64
        set picker_shape(value: int64)
        
        /** If `true`, it's possible to add presets under Swatches. If `false`, the button to add presets is disabled. */
        get can_add_swatches(): boolean
        set can_add_swatches(value: boolean)
        
        /** If `true`, the color sampler and color preview are visible. */
        get sampler_visible(): boolean
        set sampler_visible(value: boolean)
        
        /** If `true`, the color mode buttons are visible. */
        get color_modes_visible(): boolean
        set color_modes_visible(value: boolean)
        
        /** If `true`, the color sliders are visible. */
        get sliders_visible(): boolean
        set sliders_visible(value: boolean)
        
        /** If `true`, the hex color code input field is visible. */
        get hex_visible(): boolean
        set hex_visible(value: boolean)
        
        /** If `true`, the Swatches and Recent Colors presets are visible. */
        get presets_visible(): boolean
        set presets_visible(value: boolean)
        
        /** Emitted when the color is changed. */
        readonly color_changed: Signal1<Color>
        
        /** Emitted when a preset is added. */
        readonly preset_added: Signal1<Color>
        
        /** Emitted when a preset is removed. */
        readonly preset_removed: Signal1<Color>
    }
    /** A button that brings up a [ColorPicker] when pressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_colorpickerbutton.html  
     */
    class ColorPickerButton extends Button {
        constructor(identifier?: any)
        /** Returns the [ColorPicker] that this node toggles.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_picker(): ColorPicker
        
        /** Returns the control's [PopupPanel] which allows you to connect to popup signals. This allows you to handle events when the ColorPicker is shown or hidden.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member Window.visible] property.  
         */
        get_popup(): PopupPanel
        _about_to_popup(): void
        
        /** The currently selected color. */
        get color(): Color
        set color(value: Color)
        
        /** If `true`, the alpha channel in the displayed [ColorPicker] will be visible. */
        get edit_alpha(): boolean
        set edit_alpha(value: boolean)
        
        /** Emitted when the color changes. */
        readonly color_changed: Signal1<Color>
        
        /** Emitted when the [ColorPicker] is closed. */
        readonly popup_closed: Signal0
        
        /** Emitted when the [ColorPicker] is created (the button is pressed for the first time). */
        readonly picker_created: Signal0
    }
    /** A control that displays a solid color rectangle.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_colorrect.html  
     */
    class ColorRect extends Control {
        constructor(identifier?: any)
        /** The fill color of the rectangle. */
        get color(): Color
        set color(value: Color)
    }
    /** Stores attributes used to customize how a Viewport is rendered.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_compositor.html  
     */
    class Compositor extends Resource {
        constructor(identifier?: any)
        /** The custom [CompositorEffect]s that are applied during rendering of viewports using this compositor. */
        get compositor_effects(): GArray
        set compositor_effects(value: GArray)
    }
    namespace CompositorEffect {
        enum EffectCallbackType {
            /** The callback is called before our opaque rendering pass, but after depth prepass (if applicable). */
            EFFECT_CALLBACK_TYPE_PRE_OPAQUE = 0,
            
            /** The callback is called after our opaque rendering pass, but before our sky is rendered. */
            EFFECT_CALLBACK_TYPE_POST_OPAQUE = 1,
            
            /** The callback is called after our sky is rendered, but before our back buffers are created (and if enabled, before subsurface scattering and/or screen space reflections). */
            EFFECT_CALLBACK_TYPE_POST_SKY = 2,
            
            /** The callback is called before our transparent rendering pass, but after our sky is rendered and we've created our back buffers. */
            EFFECT_CALLBACK_TYPE_PRE_TRANSPARENT = 3,
            
            /** The callback is called after our transparent rendering pass, but before any build in post effects and output to our render target. */
            EFFECT_CALLBACK_TYPE_POST_TRANSPARENT = 4,
            
            /** Represents the size of the [enum EffectCallbackType] enum. */
            EFFECT_CALLBACK_TYPE_MAX = 5,
        }
    }
    /** This resource allows for creating a custom rendering effect.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_compositoreffect.html  
     */
    class CompositorEffect extends Resource {
        constructor(identifier?: any)
        /** Implement this function with your custom rendering code. [param effect_callback_type] should always match the effect callback type you've specified in [member effect_callback_type]. [param render_data] provides access to the rendering state, it is only valid during rendering and should not be stored. */
        /* gdvirtual */ _render_callback(effect_callback_type: int64, render_data: RenderData): void
        
        /** If `true` this rendering effect is applied to any viewport it is added to. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** The type of effect that is implemented, determines at what stage of rendering the callback is called. */
        get effect_callback_type(): int64
        set effect_callback_type(value: int64)
        
        /** If `true` and MSAA is enabled, this will trigger a color buffer resolve before the effect is run.  
         *      
         *  **Note:** In [method _render_callback], to access the resolved buffer use:  
         *    
         */
        get access_resolved_color(): boolean
        set access_resolved_color(value: boolean)
        
        /** If `true` and MSAA is enabled, this will trigger a depth buffer resolve before the effect is run.  
         *      
         *  **Note:** In [method _render_callback], to access the resolved buffer use:  
         *    
         */
        get access_resolved_depth(): boolean
        set access_resolved_depth(value: boolean)
        
        /** If `true` this triggers motion vectors being calculated during the opaque render state.  
         *      
         *  **Note:** In [method _render_callback], to access the motion vector buffer use:  
         *    
         */
        get needs_motion_vectors(): boolean
        set needs_motion_vectors(value: boolean)
        
        /** If `true` this triggers normal and roughness data to be output during our depth pre-pass, only applicable for the Forward+ renderer.  
         *      
         *  **Note:** In [method _render_callback], to access the roughness buffer use:  
         *    
         */
        get needs_normal_roughness(): boolean
        set needs_normal_roughness(value: boolean)
        
        /** If `true` this triggers specular data being rendered to a separate buffer and combined after effects have been applied, only applicable for the Forward+ renderer. */
        get needs_separate_specular(): boolean
        set needs_separate_specular(value: boolean)
    }
    /** An optionally compressed [Cubemap].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_compressedcubemap.html  
     */
    class CompressedCubemap extends CompressedTextureLayered {
        constructor(identifier?: any)
    }
    /** An optionally compressed [CubemapArray].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_compressedcubemaparray.html  
     */
    class CompressedCubemapArray extends CompressedTextureLayered {
        constructor(identifier?: any)
    }
    /** Texture with 2 dimensions, optionally compressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_compressedtexture2d.html  
     */
    class CompressedTexture2D extends Texture2D {
        constructor(identifier?: any)
        /** The [CompressedTexture2D]'s file path to a `.ctex` file. */
        get load_path(): string
        set load_path(value: string)
    }
    /** Array of 2-dimensional textures, optionally compressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_compressedtexture2darray.html  
     */
    class CompressedTexture2DArray extends CompressedTextureLayered {
        constructor(identifier?: any)
    }
    /** Texture with 3 dimensions, optionally compressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_compressedtexture3d.html  
     */
    class CompressedTexture3D extends Texture3D {
        constructor(identifier?: any)
        /** The [CompressedTexture3D]'s file path to a `.ctex3d` file. */
        get load_path(): string
        set load_path(value: string)
    }
    /** Base class for texture arrays that can optionally be compressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_compressedtexturelayered.html  
     */
    class CompressedTextureLayered extends TextureLayered {
        constructor(identifier?: any)
        /** The path the texture should be loaded from. */
        get load_path(): string
        set load_path(value: string)
    }
    /** A 2D polyline shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_concavepolygonshape2d.html  
     */
    class ConcavePolygonShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The array of points that make up the [ConcavePolygonShape2D]'s line segments. The array (of length divisible by two) is naturally divided into pairs (one pair for each segment); each pair consists of the starting point of a segment and the endpoint of a segment. */
        get segments(): PackedVector2Array
        set segments(value: PackedVector2Array | Vector2[])
    }
    /** A 3D trimesh shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_concavepolygonshape3d.html  
     */
    class ConcavePolygonShape3D extends Shape3D {
        constructor(identifier?: any)
        get data(): PackedVector3Array
        set data(value: PackedVector3Array | Vector3[])
        
        /** If set to `true`, collisions occur on both sides of the concave shape faces. Otherwise they occur only along the face normals. */
        get backface_collision(): boolean
        set backface_collision(value: boolean)
    }
    namespace ConeTwistJoint3D {
        enum Param {
            /** Swing is rotation from side to side, around the axis perpendicular to the twist axis.  
             *  The swing span defines, how much rotation will not get corrected along the swing axis.  
             *  Could be defined as looseness in the [ConeTwistJoint3D].  
             *  If below 0.05, this behavior is locked.  
             */
            PARAM_SWING_SPAN = 0,
            
            /** Twist is the rotation around the twist axis, this value defined how far the joint can twist.  
             *  Twist is locked if below 0.05.  
             */
            PARAM_TWIST_SPAN = 1,
            
            /** The speed with which the swing or twist will take place.  
             *  The higher, the faster.  
             */
            PARAM_BIAS = 2,
            
            /** The ease with which the joint starts to twist. If it's too low, it takes more force to start twisting the joint. */
            PARAM_SOFTNESS = 3,
            
            /** Defines, how fast the swing- and twist-speed-difference on both sides gets synced. */
            PARAM_RELAXATION = 4,
            
            /** Represents the size of the [enum Param] enum. */
            PARAM_MAX = 5,
        }
    }
    /** A physics joint that connects two 3D physics bodies in a way that simulates a ball-and-socket joint.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_conetwistjoint3d.html  
     */
    class ConeTwistJoint3D extends Joint3D {
        constructor(identifier?: any)
        /** Sets the value of the specified parameter. */
        set_param(param: ConeTwistJoint3D.Param, value: float64): void
        
        /** Returns the value of the specified parameter. */
        get_param(param: ConeTwistJoint3D.Param): float64
        
        /** Swing is rotation from side to side, around the axis perpendicular to the twist axis.  
         *  The swing span defines, how much rotation will not get corrected along the swing axis.  
         *  Could be defined as looseness in the [ConeTwistJoint3D].  
         *  If below 0.05, this behavior is locked.  
         */
        get swing_span(): float64
        set swing_span(value: float64)
        
        /** Twist is the rotation around the twist axis, this value defined how far the joint can twist.  
         *  Twist is locked if below 0.05.  
         */
        get twist_span(): float64
        set twist_span(value: float64)
        
        /** The speed with which the swing or twist will take place.  
         *  The higher, the faster.  
         */
        get bias(): float64
        set bias(value: float64)
        
        /** The ease with which the joint starts to twist. If it's too low, it takes more force to start twisting the joint. */
        get softness(): float64
        set softness(value: float64)
        
        /** Defines, how fast the swing- and twist-speed-difference on both sides gets synced. */
        get relaxation(): float64
        set relaxation(value: float64)
    }
    /** Helper class to handle INI-style files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_configfile.html  
     */
    class ConfigFile extends RefCounted {
        constructor(identifier?: any)
        /** Assigns a value to the specified key of the specified section. If either the section or the key do not exist, they are created. Passing a `null` value deletes the specified key if it exists, and deletes the section if it ends up empty once the key has been removed. */
        set_value(section: string, key: string, value: any): void
        
        /** Returns the current value for the specified section and key. If either the section or the key do not exist, the method returns the fallback [param default] value. If [param default] is not specified or set to `null`, an error is also raised. */
        get_value(section: string, key: string, default_: any = <any> {}): any
        
        /** Returns `true` if the specified section exists. */
        has_section(section: string): boolean
        
        /** Returns `true` if the specified section-key pair exists. */
        has_section_key(section: string, key: string): boolean
        
        /** Returns an array of all defined section identifiers. */
        get_sections(): PackedStringArray
        
        /** Returns an array of all defined key identifiers in the specified section. Raises an error and returns an empty array if the section does not exist. */
        get_section_keys(section: string): PackedStringArray
        
        /** Deletes the specified section along with all the key-value pairs inside. Raises an error if the section does not exist. */
        erase_section(section: string): void
        
        /** Deletes the specified key in a section. Raises an error if either the section or the key do not exist. */
        erase_section_key(section: string, key: string): void
        
        /** Loads the config file specified as a parameter. The file's contents are parsed and loaded in the [ConfigFile] object which the method was called on.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        load(path: string): GError
        
        /** Parses the passed string as the contents of a config file. The string is parsed and loaded in the ConfigFile object which the method was called on.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        parse(data: string): GError
        
        /** Saves the contents of the [ConfigFile] object to the file specified as a parameter. The output file uses an INI-style structure.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        save(path: string): GError
        
        /** Obtain the text version of this config file (the same text that would be written to a file). */
        encode_to_text(): string
        
        /** Loads the encrypted config file specified as a parameter, using the provided [param key] to decrypt it. The file's contents are parsed and loaded in the [ConfigFile] object which the method was called on.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        load_encrypted(path: string, key: PackedByteArray | byte[] | ArrayBuffer): GError
        
        /** Loads the encrypted config file specified as a parameter, using the provided [param password] to decrypt it. The file's contents are parsed and loaded in the [ConfigFile] object which the method was called on.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        load_encrypted_pass(path: string, password: string): GError
        
        /** Saves the contents of the [ConfigFile] object to the AES-256 encrypted file specified as a parameter, using the provided [param key] to encrypt it. The output file uses an INI-style structure.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        save_encrypted(path: string, key: PackedByteArray | byte[] | ArrayBuffer): GError
        
        /** Saves the contents of the [ConfigFile] object to the AES-256 encrypted file specified as a parameter, using the provided [param password] to encrypt it. The output file uses an INI-style structure.  
         *  Returns [constant OK] on success, or one of the other [enum Error] values if the operation failed.  
         */
        save_encrypted_pass(path: string, password: string): GError
        
        /** Removes the entire contents of the config. */
        clear(): void
    }
    /** A dialog used for confirmation of actions.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_confirmationdialog.html  
     */
    class ConfirmationDialog extends AcceptDialog {
        constructor(identifier?: any)
        /** Returns the cancel button.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_cancel_button(): Button
        
        /** The text displayed by the cancel button (see [method get_cancel_button]). */
        get cancel_button_text(): string
        set cancel_button_text(value: string)
    }
    class ConnectDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly connected: Signal0
    }
    class ConnectDialogBinds extends Object {
        constructor(identifier?: any)
    }
    class ConnectionsDock extends VBoxContainer {
        constructor(identifier?: any)
        update_tree(): void
    }
    /** Base class for all GUI containers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_container.html  
     */
    class Container extends Control {
        /** Notification just before children are going to be sorted, in case there's something to process beforehand. */
        static readonly NOTIFICATION_PRE_SORT_CHILDREN = 50
        
        /** Notification for when sorting the children, it must be obeyed immediately. */
        static readonly NOTIFICATION_SORT_CHILDREN = 51
        constructor(identifier?: any)
        
        /** Implement to return a list of allowed horizontal [enum Control.SizeFlags] for child nodes. This doesn't technically prevent the usages of any other size flags, if your implementation requires that. This only limits the options available to the user in the Inspector dock.  
         *      
         *  **Note:** Having no size flags is equal to having [constant Control.SIZE_SHRINK_BEGIN]. As such, this value is always implicitly allowed.  
         */
        /* gdvirtual */ _get_allowed_size_flags_horizontal(): PackedInt32Array
        
        /** Implement to return a list of allowed vertical [enum Control.SizeFlags] for child nodes. This doesn't technically prevent the usages of any other size flags, if your implementation requires that. This only limits the options available to the user in the Inspector dock.  
         *      
         *  **Note:** Having no size flags is equal to having [constant Control.SIZE_SHRINK_BEGIN]. As such, this value is always implicitly allowed.  
         */
        /* gdvirtual */ _get_allowed_size_flags_vertical(): PackedInt32Array
        
        /** Queue resort of the contained children. This is called automatically anyway, but can be called upon request. */
        queue_sort(): void
        
        /** Fit a child control in a given rect. This is mainly a helper for creating custom container classes. */
        fit_child_in_rect(child: Control, rect: Rect2): void
        
        /** Emitted when children are going to be sorted. */
        readonly pre_sort_children: Signal0
        
        /** Emitted when sorting the children is needed. */
        readonly sort_children: Signal0
    }
    namespace Control {
        enum FocusMode {
            /** The node cannot grab focus. Use with [member focus_mode]. */
            FOCUS_NONE = 0,
            
            /** The node can only grab focus on mouse clicks. Use with [member focus_mode]. */
            FOCUS_CLICK = 1,
            
            /** The node can grab focus on mouse click, using the arrows and the Tab keys on the keyboard, or using the D-pad buttons on a gamepad. Use with [member focus_mode]. */
            FOCUS_ALL = 2,
        }
        enum CursorShape {
            /** Show the system's arrow mouse cursor when the user hovers the node. Use with [member mouse_default_cursor_shape]. */
            CURSOR_ARROW = 0,
            
            /** Show the system's I-beam mouse cursor when the user hovers the node. The I-beam pointer has a shape similar to "I". It tells the user they can highlight or insert text. */
            CURSOR_IBEAM = 1,
            
            /** Show the system's pointing hand mouse cursor when the user hovers the node. */
            CURSOR_POINTING_HAND = 2,
            
            /** Show the system's cross mouse cursor when the user hovers the node. */
            CURSOR_CROSS = 3,
            
            /** Show the system's wait mouse cursor when the user hovers the node. Often an hourglass. */
            CURSOR_WAIT = 4,
            
            /** Show the system's busy mouse cursor when the user hovers the node. Often an arrow with a small hourglass. */
            CURSOR_BUSY = 5,
            
            /** Show the system's drag mouse cursor, often a closed fist or a cross symbol, when the user hovers the node. It tells the user they're currently dragging an item, like a node in the Scene dock. */
            CURSOR_DRAG = 6,
            
            /** Show the system's drop mouse cursor when the user hovers the node. It can be an open hand. It tells the user they can drop an item they're currently grabbing, like a node in the Scene dock. */
            CURSOR_CAN_DROP = 7,
            
            /** Show the system's forbidden mouse cursor when the user hovers the node. Often a crossed circle. */
            CURSOR_FORBIDDEN = 8,
            
            /** Show the system's vertical resize mouse cursor when the user hovers the node. A double-headed vertical arrow. It tells the user they can resize the window or the panel vertically. */
            CURSOR_VSIZE = 9,
            
            /** Show the system's horizontal resize mouse cursor when the user hovers the node. A double-headed horizontal arrow. It tells the user they can resize the window or the panel horizontally. */
            CURSOR_HSIZE = 10,
            
            /** Show the system's window resize mouse cursor when the user hovers the node. The cursor is a double-headed arrow that goes from the bottom left to the top right. It tells the user they can resize the window or the panel both horizontally and vertically. */
            CURSOR_BDIAGSIZE = 11,
            
            /** Show the system's window resize mouse cursor when the user hovers the node. The cursor is a double-headed arrow that goes from the top left to the bottom right, the opposite of [constant CURSOR_BDIAGSIZE]. It tells the user they can resize the window or the panel both horizontally and vertically. */
            CURSOR_FDIAGSIZE = 12,
            
            /** Show the system's move mouse cursor when the user hovers the node. It shows 2 double-headed arrows at a 90 degree angle. It tells the user they can move a UI element freely. */
            CURSOR_MOVE = 13,
            
            /** Show the system's vertical split mouse cursor when the user hovers the node. On Windows, it's the same as [constant CURSOR_VSIZE]. */
            CURSOR_VSPLIT = 14,
            
            /** Show the system's horizontal split mouse cursor when the user hovers the node. On Windows, it's the same as [constant CURSOR_HSIZE]. */
            CURSOR_HSPLIT = 15,
            
            /** Show the system's help mouse cursor when the user hovers the node, a question mark. */
            CURSOR_HELP = 16,
        }
        enum LayoutPreset {
            /** Snap all 4 anchors to the top-left of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_TOP_LEFT = 0,
            
            /** Snap all 4 anchors to the top-right of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_TOP_RIGHT = 1,
            
            /** Snap all 4 anchors to the bottom-left of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_BOTTOM_LEFT = 2,
            
            /** Snap all 4 anchors to the bottom-right of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_BOTTOM_RIGHT = 3,
            
            /** Snap all 4 anchors to the center of the left edge of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER_LEFT = 4,
            
            /** Snap all 4 anchors to the center of the top edge of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER_TOP = 5,
            
            /** Snap all 4 anchors to the center of the right edge of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER_RIGHT = 6,
            
            /** Snap all 4 anchors to the center of the bottom edge of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER_BOTTOM = 7,
            
            /** Snap all 4 anchors to the center of the parent control's bounds. Use with [method set_anchors_preset]. */
            PRESET_CENTER = 8,
            
            /** Snap all 4 anchors to the left edge of the parent control. The left offset becomes relative to the left edge and the top offset relative to the top left corner of the node's parent. Use with [method set_anchors_preset]. */
            PRESET_LEFT_WIDE = 9,
            
            /** Snap all 4 anchors to the top edge of the parent control. The left offset becomes relative to the top left corner, the top offset relative to the top edge, and the right offset relative to the top right corner of the node's parent. Use with [method set_anchors_preset]. */
            PRESET_TOP_WIDE = 10,
            
            /** Snap all 4 anchors to the right edge of the parent control. The right offset becomes relative to the right edge and the top offset relative to the top right corner of the node's parent. Use with [method set_anchors_preset]. */
            PRESET_RIGHT_WIDE = 11,
            
            /** Snap all 4 anchors to the bottom edge of the parent control. The left offset becomes relative to the bottom left corner, the bottom offset relative to the bottom edge, and the right offset relative to the bottom right corner of the node's parent. Use with [method set_anchors_preset]. */
            PRESET_BOTTOM_WIDE = 12,
            
            /** Snap all 4 anchors to a vertical line that cuts the parent control in half. Use with [method set_anchors_preset]. */
            PRESET_VCENTER_WIDE = 13,
            
            /** Snap all 4 anchors to a horizontal line that cuts the parent control in half. Use with [method set_anchors_preset]. */
            PRESET_HCENTER_WIDE = 14,
            
            /** Snap all 4 anchors to the respective corners of the parent control. Set all 4 offsets to 0 after you applied this preset and the [Control] will fit its parent control. Use with [method set_anchors_preset]. */
            PRESET_FULL_RECT = 15,
        }
        enum LayoutPresetMode {
            /** The control will be resized to its minimum size. */
            PRESET_MODE_MINSIZE = 0,
            
            /** The control's width will not change. */
            PRESET_MODE_KEEP_WIDTH = 1,
            
            /** The control's height will not change. */
            PRESET_MODE_KEEP_HEIGHT = 2,
            
            /** The control's size will not change. */
            PRESET_MODE_KEEP_SIZE = 3,
        }
        enum SizeFlags {
            /** Tells the parent [Container] to align the node with its start, either the top or the left edge. It is mutually exclusive with [constant SIZE_FILL] and other shrink size flags, but can be used with [constant SIZE_EXPAND] in some containers. Use with [member size_flags_horizontal] and [member size_flags_vertical].  
             *      
             *  **Note:** Setting this flag is equal to not having any size flags.  
             */
            SIZE_SHRINK_BEGIN = 0,
            
            /** Tells the parent [Container] to expand the bounds of this node to fill all the available space without pushing any other node. It is mutually exclusive with shrink size flags. Use with [member size_flags_horizontal] and [member size_flags_vertical]. */
            SIZE_FILL = 1,
            
            /** Tells the parent [Container] to let this node take all the available space on the axis you flag. If multiple neighboring nodes are set to expand, they'll share the space based on their stretch ratio. See [member size_flags_stretch_ratio]. Use with [member size_flags_horizontal] and [member size_flags_vertical]. */
            SIZE_EXPAND = 2,
            
            /** Sets the node's size flags to both fill and expand. See [constant SIZE_FILL] and [constant SIZE_EXPAND] for more information. */
            SIZE_EXPAND_FILL = 3,
            
            /** Tells the parent [Container] to center the node in the available space. It is mutually exclusive with [constant SIZE_FILL] and other shrink size flags, but can be used with [constant SIZE_EXPAND] in some containers. Use with [member size_flags_horizontal] and [member size_flags_vertical]. */
            SIZE_SHRINK_CENTER = 4,
            
            /** Tells the parent [Container] to align the node with its end, either the bottom or the right edge. It is mutually exclusive with [constant SIZE_FILL] and other shrink size flags, but can be used with [constant SIZE_EXPAND] in some containers. Use with [member size_flags_horizontal] and [member size_flags_vertical]. */
            SIZE_SHRINK_END = 8,
        }
        enum MouseFilter {
            /** The control will receive mouse movement input events and mouse button input events if clicked on through [method _gui_input]. And the control will receive the [signal mouse_entered] and [signal mouse_exited] signals. These events are automatically marked as handled, and they will not propagate further to other controls. This also results in blocking signals in other controls. */
            MOUSE_FILTER_STOP = 0,
            
            /** The control will receive mouse movement input events and mouse button input events if clicked on through [method _gui_input]. And the control will receive the [signal mouse_entered] and [signal mouse_exited] signals. If this control does not handle the event, the parent control (if any) will be considered, and so on until there is no more parent control to potentially handle it. This also allows signals to fire in other controls. If no control handled it, the event will be passed to [method Node._shortcut_input] for further processing. */
            MOUSE_FILTER_PASS = 1,
            
            /** The control will not receive mouse movement input events and mouse button input events if clicked on through [method _gui_input]. The control will also not receive the [signal mouse_entered] nor [signal mouse_exited] signals. This will not block other controls from receiving these events or firing the signals. Ignored events will not be handled automatically.  
             *      
             *  **Note:** If the control has received [signal mouse_entered] but not [signal mouse_exited], changing the [member mouse_filter] to [constant MOUSE_FILTER_IGNORE] will cause [signal mouse_exited] to be emitted.  
             */
            MOUSE_FILTER_IGNORE = 2,
        }
        enum GrowDirection {
            /** The control will grow to the left or top to make up if its minimum size is changed to be greater than its current size on the respective axis. */
            GROW_DIRECTION_BEGIN = 0,
            
            /** The control will grow to the right or bottom to make up if its minimum size is changed to be greater than its current size on the respective axis. */
            GROW_DIRECTION_END = 1,
            
            /** The control will grow in both directions equally to make up if its minimum size is changed to be greater than its current size. */
            GROW_DIRECTION_BOTH = 2,
        }
        enum Anchor {
            /** Snaps one of the 4 anchor's sides to the origin of the node's `Rect`, in the top left. Use it with one of the `anchor_*` member variables, like [member anchor_left]. To change all 4 anchors at once, use [method set_anchors_preset]. */
            ANCHOR_BEGIN = 0,
            
            /** Snaps one of the 4 anchor's sides to the end of the node's `Rect`, in the bottom right. Use it with one of the `anchor_*` member variables, like [member anchor_left]. To change all 4 anchors at once, use [method set_anchors_preset]. */
            ANCHOR_END = 1,
        }
        enum LayoutDirection {
            /** Automatic layout direction, determined from the parent control layout direction. */
            LAYOUT_DIRECTION_INHERITED = 0,
            
            /** Automatic layout direction, determined from the current locale. */
            LAYOUT_DIRECTION_LOCALE = 1,
            
            /** Left-to-right layout direction. */
            LAYOUT_DIRECTION_LTR = 2,
            
            /** Right-to-left layout direction. */
            LAYOUT_DIRECTION_RTL = 3,
        }
        enum TextDirection {
            /** Text writing direction is the same as layout direction. */
            TEXT_DIRECTION_INHERITED = 3,
            
            /** Automatic text writing direction, determined from the current locale and text content. */
            TEXT_DIRECTION_AUTO = 0,
            
            /** Left-to-right text writing direction. */
            TEXT_DIRECTION_LTR = 1,
            
            /** Right-to-left text writing direction. */
            TEXT_DIRECTION_RTL = 2,
        }
    }
    /** Base class for all GUI controls. Adapts its position and size based on its parent control.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_control.html  
     */
    class Control extends CanvasItem {
        /** Sent when the node changes size. Use [member size] to get the new size. */
        static readonly NOTIFICATION_RESIZED = 40
        
        /** Sent when the mouse cursor enters the control's (or any child control's) visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect which Control receives the notification.  
         *  See also [constant NOTIFICATION_MOUSE_ENTER_SELF].  
         */
        static readonly NOTIFICATION_MOUSE_ENTER = 41
        
        /** Sent when the mouse cursor leaves the control's (and all child control's) visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect which Control receives the notification.  
         *  See also [constant NOTIFICATION_MOUSE_EXIT_SELF].  
         */
        static readonly NOTIFICATION_MOUSE_EXIT = 42
        
        /** Sent when the mouse cursor enters the control's visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect which Control receives the notification.  
         *  See also [constant NOTIFICATION_MOUSE_ENTER].  
         */
        static readonly NOTIFICATION_MOUSE_ENTER_SELF = 60
        
        /** Sent when the mouse cursor leaves the control's visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect which Control receives the notification.  
         *  See also [constant NOTIFICATION_MOUSE_EXIT].  
         */
        static readonly NOTIFICATION_MOUSE_EXIT_SELF = 61
        
        /** Sent when the node grabs focus. */
        static readonly NOTIFICATION_FOCUS_ENTER = 43
        
        /** Sent when the node loses focus. */
        static readonly NOTIFICATION_FOCUS_EXIT = 44
        
        /** Sent when the node needs to refresh its theme items. This happens in one of the following cases:  
         *  - The [member theme] property is changed on this node or any of its ancestors.  
         *  - The [member theme_type_variation] property is changed on this node.  
         *  - One of the node's theme property overrides is changed.  
         *  - The node enters the scene tree.  
         *      
         *  **Note:** As an optimization, this notification won't be sent from changes that occur while this node is outside of the scene tree. Instead, all of the theme item updates can be applied at once when the node enters the scene tree.  
         *      
         *  **Note:** This notification is received alongside [constant Node.NOTIFICATION_ENTER_TREE], so if you are instantiating a scene, the child nodes will not be initialized yet. You can use it to setup theming for this node, child nodes created from script, or if you want to access child nodes added in the editor, make sure the node is ready using [method Node.is_node_ready].  
         *    
         */
        static readonly NOTIFICATION_THEME_CHANGED = 45
        
        /** Sent when this node is inside a [ScrollContainer] which has begun being scrolled when dragging the scrollable area  *with a touch event* . This notification is  *not*  sent when scrolling by dragging the scrollbar, scrolling with the mouse wheel or scrolling with keyboard/gamepad events.  
         *      
         *  **Note:** This signal is only emitted on Android or iOS, or on desktop/web platforms when [member ProjectSettings.input_devices/pointing/emulate_touch_from_mouse] is enabled.  
         */
        static readonly NOTIFICATION_SCROLL_BEGIN = 47
        
        /** Sent when this node is inside a [ScrollContainer] which has stopped being scrolled when dragging the scrollable area  *with a touch event* . This notification is  *not*  sent when scrolling by dragging the scrollbar, scrolling with the mouse wheel or scrolling with keyboard/gamepad events.  
         *      
         *  **Note:** This signal is only emitted on Android or iOS, or on desktop/web platforms when [member ProjectSettings.input_devices/pointing/emulate_touch_from_mouse] is enabled.  
         */
        static readonly NOTIFICATION_SCROLL_END = 48
        
        /** Sent when control layout direction is changed. */
        static readonly NOTIFICATION_LAYOUT_DIRECTION_CHANGED = 49
        constructor(identifier?: any)
        
        /** Virtual method to be implemented by the user. Returns whether the given [param point] is inside this control.  
         *  If not overridden, default behavior is checking if the point is within control's Rect.  
         *      
         *  **Note:** If you want to check if a point is inside the control, you can use `Rect2(Vector2.ZERO, size).has_point(point)`.  
         */
        /* gdvirtual */ _has_point(point: Vector2): boolean
        
        /** User defined BiDi algorithm override function.  
         *  Returns an [Array] of [Vector3i] text ranges and text base directions, in the left-to-right order. Ranges should cover full source [param text] without overlaps. BiDi algorithm will be used on each range separately.  
         */
        /* gdvirtual */ _structured_text_parser(args: GArray, text: string): GArray
        
        /** Virtual method to be implemented by the user. Returns the minimum size for this control. Alternative to [member custom_minimum_size] for controlling minimum size via code. The actual minimum size will be the max value of these two (in each axis separately).  
         *  If not overridden, defaults to [constant Vector2.ZERO].  
         *      
         *  **Note:** This method will not be called when the script is attached to a [Control] node that already overrides its minimum size (e.g. [Label], [Button], [PanelContainer] etc.). It can only be used with most basic GUI nodes, like [Control], [Container], [Panel] etc.  
         */
        /* gdvirtual */ _get_minimum_size(): Vector2
        
        /** Virtual method to be implemented by the user. Returns the tooltip text for the position [param at_position] in control's local coordinates, which will typically appear when the cursor is resting over this control. See [method get_tooltip].  
         *      
         *  **Note:** If this method returns an empty [String], no tooltip is displayed.  
         */
        /* gdvirtual */ _get_tooltip(at_position: Vector2): string
        
        /** Godot calls this method to get data that can be dragged and dropped onto controls that expect drop data. Returns `null` if there is no data to drag. Controls that want to receive drop data should implement [method _can_drop_data] and [method _drop_data]. [param at_position] is local to this control. Drag may be forced with [method force_drag].  
         *  A preview that will follow the mouse that should represent the data can be set with [method set_drag_preview]. A good time to set the preview is in this method.  
         *    
         */
        /* gdvirtual */ _get_drag_data(at_position: Vector2): any
        
        /** Godot calls this method to test if [param data] from a control's [method _get_drag_data] can be dropped at [param at_position]. [param at_position] is local to this control.  
         *  This method should only be used to test the data. Process the data in [method _drop_data].  
         *    
         */
        /* gdvirtual */ _can_drop_data(at_position: Vector2, data: any): boolean
        
        /** Godot calls this method to pass you the [param data] from a control's [method _get_drag_data] result. Godot first calls [method _can_drop_data] to test if [param data] is allowed to drop at [param at_position] where [param at_position] is local to this control.  
         *    
         */
        /* gdvirtual */ _drop_data(at_position: Vector2, data: any): void
        
        /** Virtual method to be implemented by the user. Returns a [Control] node that should be used as a tooltip instead of the default one. The [param for_text] includes the contents of the [member tooltip_text] property.  
         *  The returned node must be of type [Control] or Control-derived. It can have child nodes of any type. It is freed when the tooltip disappears, so make sure you always provide a new instance (if you want to use a pre-existing node from your scene tree, you can duplicate it and pass the duplicated instance). When `null` or a non-Control node is returned, the default tooltip will be used instead.  
         *  The returned node will be added as child to a [PopupPanel], so you should only provide the contents of that panel. That [PopupPanel] can be themed using [method Theme.set_stylebox] for the type `"TooltipPanel"` (see [member tooltip_text] for an example).  
         *      
         *  **Note:** The tooltip is shrunk to minimal size. If you want to ensure it's fully visible, you might want to set its [member custom_minimum_size] to some non-zero value.  
         *      
         *  **Note:** The node (and any relevant children) should be [member CanvasItem.visible] when returned, otherwise, the viewport that instantiates it will not be able to calculate its minimum size reliably.  
         *  **Example of usage with a custom-constructed node:**  
         *    
         *  **Example of usage with a custom scene instance:**  
         *    
         */
        /* gdvirtual */ _make_custom_tooltip(for_text: string): Object
        
        /** Virtual method to be implemented by the user. Use this method to process and accept inputs on UI elements. See [method accept_event].  
         *  **Example usage for clicking a control:**  
         *    
         *  The event won't trigger if:  
         *  * clicking outside the control (see [method _has_point]);  
         *  * control has [member mouse_filter] set to [constant MOUSE_FILTER_IGNORE];  
         *  * control is obstructed by another [Control] on top of it, which doesn't have [member mouse_filter] set to [constant MOUSE_FILTER_IGNORE];  
         *  * control's parent has [member mouse_filter] set to [constant MOUSE_FILTER_STOP] or has accepted the event;  
         *  * it happens outside the parent's rectangle and the parent has either [member clip_contents] enabled.  
         *      
         *  **Note:** Event position is relative to the control origin.  
         */
        /* gdvirtual */ _gui_input(event: InputEvent): void
        
        /** Marks an input event as handled. Once you accept an input event, it stops propagating, even to nodes listening to [method Node._unhandled_input] or [method Node._unhandled_key_input].  
         *      
         *  **Note:** This does not affect the methods in [Input], only the way events are propagated.  
         */
        accept_event(): void
        
        /** Returns the minimum size for this control. See [member custom_minimum_size]. */
        get_minimum_size(): Vector2
        
        /** Returns combined minimum size from [member custom_minimum_size] and [method get_minimum_size]. */
        get_combined_minimum_size(): Vector2
        
        /** Sets the anchors to a [param preset] from [enum Control.LayoutPreset] enum. This is the code equivalent to using the Layout menu in the 2D editor.  
         *  If [param keep_offsets] is `true`, control's position will also be updated.  
         */
        set_anchors_preset(preset: Control.LayoutPreset, keep_offsets: boolean = false): void
        
        /** Sets the offsets to a [param preset] from [enum Control.LayoutPreset] enum. This is the code equivalent to using the Layout menu in the 2D editor.  
         *  Use parameter [param resize_mode] with constants from [enum Control.LayoutPresetMode] to better determine the resulting size of the [Control]. Constant size will be ignored if used with presets that change size, e.g. [constant PRESET_LEFT_WIDE].  
         *  Use parameter [param margin] to determine the gap between the [Control] and the edges.  
         */
        set_offsets_preset(preset: Control.LayoutPreset, resize_mode: Control.LayoutPresetMode = 0, margin: int64 = 0): void
        
        /** Sets both anchor preset and offset preset. See [method set_anchors_preset] and [method set_offsets_preset]. */
        set_anchors_and_offsets_preset(preset: Control.LayoutPreset, resize_mode: Control.LayoutPresetMode = 0, margin: int64 = 0): void
        _set_anchor(side: Side, anchor: float64): void
        
        /** Sets the anchor for the specified [enum Side] to [param anchor]. A setter method for [member anchor_bottom], [member anchor_left], [member anchor_right] and [member anchor_top].  
         *  If [param keep_offset] is `true`, offsets aren't updated after this operation.  
         *  If [param push_opposite_anchor] is `true` and the opposite anchor overlaps this anchor, the opposite one will have its value overridden. For example, when setting left anchor to 1 and the right anchor has value of 0.5, the right anchor will also get value of 1. If [param push_opposite_anchor] was `false`, the left anchor would get value 0.5.  
         */
        set_anchor(side: Side, anchor: float64, keep_offset: boolean = false, push_opposite_anchor: boolean = true): void
        
        /** Returns the anchor for the specified [enum Side]. A getter method for [member anchor_bottom], [member anchor_left], [member anchor_right] and [member anchor_top]. */
        get_anchor(side: Side): float64
        
        /** Sets the offset for the specified [enum Side] to [param offset]. A setter method for [member offset_bottom], [member offset_left], [member offset_right] and [member offset_top]. */
        set_offset(side: Side, offset: float64): void
        
        /** Returns the offset for the specified [enum Side]. A getter method for [member offset_bottom], [member offset_left], [member offset_right] and [member offset_top]. */
        get_offset(offset: Side): float64
        
        /** Works the same as [method set_anchor], but instead of `keep_offset` argument and automatic update of offset, it allows to set the offset yourself (see [method set_offset]). */
        set_anchor_and_offset(side: Side, anchor: float64, offset: float64, push_opposite_anchor: boolean = false): void
        
        /** Sets [member offset_left] and [member offset_top] at the same time. Equivalent of changing [member position]. */
        set_begin(position: Vector2): void
        
        /** Sets [member offset_right] and [member offset_bottom] at the same time. */
        set_end(position: Vector2): void
        
        /** Sets the [member position] to given [param position].  
         *  If [param keep_offsets] is `true`, control's anchors will be updated instead of offsets.  
         */
        set_position(position: Vector2, keep_offsets: boolean = false): void
        
        /** Sets the size (see [member size]).  
         *  If [param keep_offsets] is `true`, control's anchors will be updated instead of offsets.  
         */
        set_size(size: Vector2, keep_offsets: boolean = false): void
        
        /** Resets the size to [method get_combined_minimum_size]. This is equivalent to calling `set_size(Vector2())` (or any size below the minimum). */
        reset_size(): void
        
        /** Sets the [member global_position] to given [param position].  
         *  If [param keep_offsets] is `true`, control's anchors will be updated instead of offsets.  
         */
        set_global_position(position: Vector2, keep_offsets: boolean = false): void
        
        /** Returns [member offset_left] and [member offset_top]. See also [member position]. */
        get_begin(): Vector2
        
        /** Returns [member offset_right] and [member offset_bottom]. */
        get_end(): Vector2
        
        /** Returns the width/height occupied in the parent control. */
        get_parent_area_size(): Vector2
        
        /** Returns the position of this [Control] in global screen coordinates (i.e. taking window position into account). Mostly useful for editor plugins.  
         *  Equals to [member global_position] if the window is embedded (see [member Viewport.gui_embed_subwindows]).  
         *  **Example usage for showing a popup:**  
         *    
         */
        get_screen_position(): Vector2
        
        /** Returns the position and size of the control in the coordinate system of the containing node. See [member position], [member scale] and [member size].  
         *      
         *  **Note:** If [member rotation] is not the default rotation, the resulting size is not meaningful.  
         *      
         *  **Note:** Setting [member Viewport.gui_snap_controls_to_pixels] to `true` can lead to rounding inaccuracies between the displayed control and the returned [Rect2].  
         */
        get_rect(): Rect2
        
        /** Returns the position and size of the control relative to the containing canvas. See [member global_position] and [member size].  
         *      
         *  **Note:** If the node itself or any parent [CanvasItem] between the node and the canvas have a non default rotation or skew, the resulting size is likely not meaningful.  
         *      
         *  **Note:** Setting [member Viewport.gui_snap_controls_to_pixels] to `true` can lead to rounding inaccuracies between the displayed control and the returned [Rect2].  
         */
        get_global_rect(): Rect2
        
        /** Returns `true` if this is the current focused control. See [member focus_mode]. */
        has_focus(): boolean
        
        /** Steal the focus from another control and become the focused control (see [member focus_mode]).  
         *      
         *  **Note:** Using this method together with [method Callable.call_deferred] makes it more reliable, especially when called inside [method Node._ready].  
         */
        grab_focus(): void
        
        /** Give up the focus. No other control will be able to receive input. */
        release_focus(): void
        
        /** Finds the previous (above in the tree) [Control] that can receive the focus. */
        find_prev_valid_focus(): Control
        
        /** Finds the next (below in the tree) [Control] that can receive the focus. */
        find_next_valid_focus(): Control
        
        /** Finds the next [Control] that can receive the focus on the specified [enum Side].  
         *      
         *  **Note:** This is different from [method get_focus_neighbor], which returns the path of a specified focus neighbor.  
         */
        find_valid_focus_neighbor(side: Side): Control
        
        /** Prevents `*_theme_*_override` methods from emitting [constant NOTIFICATION_THEME_CHANGED] until [method end_bulk_theme_override] is called. */
        begin_bulk_theme_override(): void
        
        /** Ends a bulk theme override update. See [method begin_bulk_theme_override]. */
        end_bulk_theme_override(): void
        
        /** Creates a local override for a theme icon with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_icon_override].  
         *  See also [method get_theme_icon].  
         */
        add_theme_icon_override(name: StringName, texture: Texture2D): void
        
        /** Creates a local override for a theme [StyleBox] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_stylebox_override].  
         *  See also [method get_theme_stylebox].  
         *  **Example of modifying a property in a StyleBox by duplicating it:**  
         *    
         */
        add_theme_stylebox_override(name: StringName, stylebox: StyleBox): void
        
        /** Creates a local override for a theme [Font] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_font_override].  
         *  See also [method get_theme_font].  
         */
        add_theme_font_override(name: StringName, font: Font): void
        
        /** Creates a local override for a theme font size with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_font_size_override].  
         *  See also [method get_theme_font_size].  
         */
        add_theme_font_size_override(name: StringName, font_size: int64): void
        
        /** Creates a local override for a theme [Color] with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_color_override].  
         *  See also [method get_theme_color].  
         *  **Example of overriding a label's color and resetting it later:**  
         *    
         */
        add_theme_color_override(name: StringName, color: Color): void
        
        /** Creates a local override for a theme constant with the specified [param name]. Local overrides always take precedence when fetching theme items for the control. An override can be removed with [method remove_theme_constant_override].  
         *  See also [method get_theme_constant].  
         */
        add_theme_constant_override(name: StringName, constant: int64): void
        
        /** Removes a local override for a theme icon with the specified [param name] previously added by [method add_theme_icon_override] or via the Inspector dock. */
        remove_theme_icon_override(name: StringName): void
        
        /** Removes a local override for a theme [StyleBox] with the specified [param name] previously added by [method add_theme_stylebox_override] or via the Inspector dock. */
        remove_theme_stylebox_override(name: StringName): void
        
        /** Removes a local override for a theme [Font] with the specified [param name] previously added by [method add_theme_font_override] or via the Inspector dock. */
        remove_theme_font_override(name: StringName): void
        
        /** Removes a local override for a theme font size with the specified [param name] previously added by [method add_theme_font_size_override] or via the Inspector dock. */
        remove_theme_font_size_override(name: StringName): void
        
        /** Removes a local override for a theme [Color] with the specified [param name] previously added by [method add_theme_color_override] or via the Inspector dock. */
        remove_theme_color_override(name: StringName): void
        
        /** Removes a local override for a theme constant with the specified [param name] previously added by [method add_theme_constant_override] or via the Inspector dock. */
        remove_theme_constant_override(name: StringName): void
        
        /** Returns an icon from the first matching [Theme] in the tree if that [Theme] has an icon item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_icon(name: StringName, theme_type: StringName = ''): Texture2D
        
        /** Returns a [StyleBox] from the first matching [Theme] in the tree if that [Theme] has a stylebox item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_stylebox(name: StringName, theme_type: StringName = ''): StyleBox
        
        /** Returns a [Font] from the first matching [Theme] in the tree if that [Theme] has a font item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_font(name: StringName, theme_type: StringName = ''): Font
        
        /** Returns a font size from the first matching [Theme] in the tree if that [Theme] has a font size item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_font_size(name: StringName, theme_type: StringName = ''): int64
        
        /** Returns a [Color] from the first matching [Theme] in the tree if that [Theme] has a color item with the specified [param name] and [param theme_type]. If [param theme_type] is omitted the class name of the current control is used as the type, or [member theme_type_variation] if it is defined. If the type is a class name its parent classes are also checked, in order of inheritance. If the type is a variation its base types are checked, in order of dependency, then the control's class name and its parent classes are checked.  
         *  For the current control its local overrides are considered first (see [method add_theme_color_override]), then its assigned [member theme]. After the current control, each parent control and its assigned [member theme] are considered; controls without a [member theme] assigned are skipped. If no matching [Theme] is found in the tree, the custom project [Theme] (see [member ProjectSettings.gui/theme/custom]) and the default [Theme] are used (see [ThemeDB]).  
         *    
         */
        get_theme_color(name: StringName, theme_type: StringName = ''): Color
        
        /** Returns a constant from the first matching [Theme] in the tree if that [Theme] has a constant item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        get_theme_constant(name: StringName, theme_type: StringName = ''): int64
        
        /** Returns `true` if there is a local override for a theme icon with the specified [param name] in this [Control] node.  
         *  See [method add_theme_icon_override].  
         */
        has_theme_icon_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [StyleBox] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_stylebox_override].  
         */
        has_theme_stylebox_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [Font] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_font_override].  
         */
        has_theme_font_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme font size with the specified [param name] in this [Control] node.  
         *  See [method add_theme_font_size_override].  
         */
        has_theme_font_size_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme [Color] with the specified [param name] in this [Control] node.  
         *  See [method add_theme_color_override].  
         */
        has_theme_color_override(name: StringName): boolean
        
        /** Returns `true` if there is a local override for a theme constant with the specified [param name] in this [Control] node.  
         *  See [method add_theme_constant_override].  
         */
        has_theme_constant_override(name: StringName): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has an icon item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_icon(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a stylebox item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_stylebox(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a font item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_font(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a font size item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_font_size(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a color item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_color(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns `true` if there is a matching [Theme] in the tree that has a constant item with the specified [param name] and [param theme_type].  
         *  See [method get_theme_color] for details.  
         */
        has_theme_constant(name: StringName, theme_type: StringName = ''): boolean
        
        /** Returns the default base scale value from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_base_scale] value.  
         *  See [method get_theme_color] for details.  
         */
        get_theme_default_base_scale(): float64
        
        /** Returns the default font from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_font] value.  
         *  See [method get_theme_color] for details.  
         */
        get_theme_default_font(): Font
        
        /** Returns the default font size value from the first matching [Theme] in the tree if that [Theme] has a valid [member Theme.default_font_size] value.  
         *  See [method get_theme_color] for details.  
         */
        get_theme_default_font_size(): int64
        
        /** Returns the parent control node. */
        get_parent_control(): Control
        
        /** Returns the tooltip text for the position [param at_position] in control's local coordinates, which will typically appear when the cursor is resting over this control. By default, it returns [member tooltip_text].  
         *  This method can be overridden to customize its behavior. See [method _get_tooltip].  
         *      
         *  **Note:** If this method returns an empty [String], no tooltip is displayed.  
         */
        get_tooltip(at_position: Vector2 = Vector2.ZERO): string
        
        /** Returns the mouse cursor shape the control displays on mouse hover. See [enum CursorShape]. */
        get_cursor_shape(position: Vector2 = Vector2.ZERO): Control.CursorShape
        
        /** Sets the focus neighbor for the specified [enum Side] to the [Control] at [param neighbor] node path. A setter method for [member focus_neighbor_bottom], [member focus_neighbor_left], [member focus_neighbor_right] and [member focus_neighbor_top]. */
        set_focus_neighbor(side: Side, neighbor: NodePath | string): void
        
        /** Returns the focus neighbor for the specified [enum Side]. A getter method for [member focus_neighbor_bottom], [member focus_neighbor_left], [member focus_neighbor_right] and [member focus_neighbor_top].  
         *      
         *  **Note:** To find the next [Control] on the specific [enum Side], even if a neighbor is not assigned, use [method find_valid_focus_neighbor].  
         */
        get_focus_neighbor(side: Side): NodePath
        
        /** Forces drag and bypasses [method _get_drag_data] and [method set_drag_preview] by passing [param data] and [param preview]. Drag will start even if the mouse is neither over nor pressed on this control.  
         *  The methods [method _can_drop_data] and [method _drop_data] must be implemented on controls that want to receive drop data.  
         */
        force_drag(data: any, preview: Control): void
        
        /** Creates an [InputEventMouseButton] that attempts to click the control. If the event is received, the control acquires focus.  
         *    
         */
        grab_click_focus(): void
        
        /** Forwards the handling of this control's [method _get_drag_data],  [method _can_drop_data] and [method _drop_data] virtual functions to delegate callables.  
         *  For each argument, if not empty, the delegate callable is used, otherwise the local (virtual) function is used.  
         *  The function format for each callable should be exactly the same as the virtual functions described above.  
         */
        set_drag_forwarding(drag_func: Callable, can_drop_func: Callable, drop_func: Callable): void
        
        /** Shows the given control at the mouse pointer. A good time to call this method is in [method _get_drag_data]. The control must not be in the scene tree. You should not free the control, and you should not keep a reference to the control beyond the duration of the drag. It will be deleted automatically after the drag has ended.  
         *    
         */
        set_drag_preview(control: Control): void
        
        /** Returns `true` if a drag operation is successful. Alternative to [method Viewport.gui_is_drag_successful].  
         *  Best used with [constant Node.NOTIFICATION_DRAG_END].  
         */
        is_drag_successful(): boolean
        
        /** Moves the mouse cursor to [param position], relative to [member position] of this [Control].  
         *      
         *  **Note:** [method warp_mouse] is only supported on Windows, macOS and Linux. It has no effect on Android, iOS and Web.  
         */
        warp_mouse(position: Vector2): void
        
        /** Invalidates the size cache in this node and in parent nodes up to top level. Intended to be used with [method get_minimum_size] when the return value is changed. Setting [member custom_minimum_size] directly calls this method automatically. */
        update_minimum_size(): void
        
        /** Returns `true` if layout is right-to-left. */
        is_layout_rtl(): boolean
        
        /** Enables whether rendering of [CanvasItem] based children should be clipped to this control's rectangle. If `true`, parts of a child which would be visibly outside of this control's rectangle will not be rendered and won't receive input. */
        get clip_contents(): boolean
        set clip_contents(value: boolean)
        
        /** The minimum size of the node's bounding rectangle. If you set it to a value greater than `(0, 0)`, the node's bounding rectangle will always have at least this size. Note that [Control] nodes have their internal minimum size returned by [method get_minimum_size]. It depends on the control's contents, like text, textures, or style boxes. The actual minimum size is the maximum value of this property and the internal minimum size (see [method get_combined_minimum_size]). */
        get custom_minimum_size(): Vector2
        set custom_minimum_size(value: Vector2)
        
        /** Controls layout direction and text writing direction. Right-to-left layouts are necessary for certain languages (e.g. Arabic and Hebrew). */
        get layout_direction(): int64
        set layout_direction(value: int64)
        get layout_mode(): int64
        set layout_mode(value: int64)
        get anchors_preset(): int64
        set anchors_preset(value: int64)
        
        /** Anchors the left edge of the node to the origin, the center or the end of its parent control. It changes how the left offset updates when the node moves or changes size. You can use one of the [enum Anchor] constants for convenience. */
        get anchor_left(): float64
        set anchor_left(value: float64)
        
        /** Anchors the top edge of the node to the origin, the center or the end of its parent control. It changes how the top offset updates when the node moves or changes size. You can use one of the [enum Anchor] constants for convenience. */
        get anchor_top(): float64
        set anchor_top(value: float64)
        
        /** Anchors the right edge of the node to the origin, the center or the end of its parent control. It changes how the right offset updates when the node moves or changes size. You can use one of the [enum Anchor] constants for convenience. */
        get anchor_right(): float64
        set anchor_right(value: float64)
        
        /** Anchors the bottom edge of the node to the origin, the center, or the end of its parent control. It changes how the bottom offset updates when the node moves or changes size. You can use one of the [enum Anchor] constants for convenience. */
        get anchor_bottom(): float64
        set anchor_bottom(value: float64)
        
        /** Distance between the node's left edge and its parent control, based on [member anchor_left].  
         *  Offsets are often controlled by one or multiple parent [Container] nodes, so you should not modify them manually if your node is a direct child of a [Container]. Offsets update automatically when you move or resize the node.  
         */
        get offset_left(): int64
        set offset_left(value: int64)
        
        /** Distance between the node's top edge and its parent control, based on [member anchor_top].  
         *  Offsets are often controlled by one or multiple parent [Container] nodes, so you should not modify them manually if your node is a direct child of a [Container]. Offsets update automatically when you move or resize the node.  
         */
        get offset_top(): int64
        set offset_top(value: int64)
        
        /** Distance between the node's right edge and its parent control, based on [member anchor_right].  
         *  Offsets are often controlled by one or multiple parent [Container] nodes, so you should not modify them manually if your node is a direct child of a [Container]. Offsets update automatically when you move or resize the node.  
         */
        get offset_right(): int64
        set offset_right(value: int64)
        
        /** Distance between the node's bottom edge and its parent control, based on [member anchor_bottom].  
         *  Offsets are often controlled by one or multiple parent [Container] nodes, so you should not modify them manually if your node is a direct child of a [Container]. Offsets update automatically when you move or resize the node.  
         */
        get offset_bottom(): int64
        set offset_bottom(value: int64)
        
        /** Controls the direction on the horizontal axis in which the control should grow if its horizontal minimum size is changed to be greater than its current size, as the control always has to be at least the minimum size. */
        get grow_horizontal(): int64
        set grow_horizontal(value: int64)
        
        /** Controls the direction on the vertical axis in which the control should grow if its vertical minimum size is changed to be greater than its current size, as the control always has to be at least the minimum size. */
        get grow_vertical(): int64
        set grow_vertical(value: int64)
        
        /** The size of the node's bounding rectangle, in the node's coordinate system. [Container] nodes update this property automatically. */
        get size(): Vector2
        set size(value: Vector2)
        
        /** The node's position, relative to its containing node. It corresponds to the rectangle's top-left corner. The property is not affected by [member pivot_offset]. */
        get position(): Vector2
        set position(value: Vector2)
        
        /** The node's global position, relative to the world (usually to the [CanvasLayer]). */
        get global_position(): Vector2
        set global_position(value: Vector2)
        
        /** The node's rotation around its pivot, in radians. See [member pivot_offset] to change the pivot's position.  
         *      
         *  **Note:** This property is edited in the inspector in degrees. If you want to use degrees in a script, use [member rotation_degrees].  
         */
        get rotation(): float64
        set rotation(value: float64)
        
        /** Helper property to access [member rotation] in degrees instead of radians. */
        get rotation_degrees(): float64
        set rotation_degrees(value: float64)
        
        /** The node's scale, relative to its [member size]. Change this property to scale the node around its [member pivot_offset]. The Control's [member tooltip_text] will also scale according to this value.  
         *      
         *  **Note:** This property is mainly intended to be used for animation purposes. To support multiple resolutions in your project, use an appropriate viewport stretch mode as described in the [url=https://docs.godotengine.org/en/4.3/tutorials/rendering/multiple_resolutions.html]documentation[/url] instead of scaling Controls individually.  
         *      
         *  **Note:** [member FontFile.oversampling] does  *not*  take [Control] [member scale] into account. This means that scaling up/down will cause bitmap fonts and rasterized (non-MSDF) dynamic fonts to appear blurry or pixelated. To ensure text remains crisp regardless of scale, you can enable MSDF font rendering by enabling [member ProjectSettings.gui/theme/default_font_multichannel_signed_distance_field] (applies to the default project font only), or enabling **Multichannel Signed Distance Field** in the import options of a DynamicFont for custom fonts. On system fonts, [member SystemFont.multichannel_signed_distance_field] can be enabled in the inspector.  
         *      
         *  **Note:** If the Control node is a child of a [Container] node, the scale will be reset to `Vector2(1, 1)` when the scene is instantiated. To set the Control's scale when it's instantiated, wait for one frame using `await get_tree().process_frame` then set its [member scale] property.  
         */
        get scale(): Vector2
        set scale(value: Vector2)
        
        /** By default, the node's pivot is its top-left corner. When you change its [member rotation] or [member scale], it will rotate or scale around this pivot. Set this property to [member size] / 2 to pivot around the Control's center. */
        get pivot_offset(): Vector2
        set pivot_offset(value: Vector2)
        
        /** Tells the parent [Container] nodes how they should resize and place the node on the X axis. Use a combination of the [enum SizeFlags] constants to change the flags. See the constants to learn what each does. */
        get size_flags_horizontal(): int64
        set size_flags_horizontal(value: int64)
        
        /** Tells the parent [Container] nodes how they should resize and place the node on the Y axis. Use a combination of the [enum SizeFlags] constants to change the flags. See the constants to learn what each does. */
        get size_flags_vertical(): int64
        set size_flags_vertical(value: int64)
        
        /** If the node and at least one of its neighbors uses the [constant SIZE_EXPAND] size flag, the parent [Container] will let it take more or less space depending on this property. If this node has a stretch ratio of 2 and its neighbor a ratio of 1, this node will take two thirds of the available space. */
        get size_flags_stretch_ratio(): float64
        set size_flags_stretch_ratio(value: float64)
        
        /** If `true`, automatically converts code line numbers, list indices, [SpinBox] and [ProgressBar] values from the Western Arabic (0..9) to the numeral systems used in current locale.  
         *      
         *  **Note:** Numbers within the text are not automatically converted, it can be done manually, using [method TextServer.format_number].  
         */
        get localize_numeral_system(): boolean
        set localize_numeral_system(value: boolean)
        
        /** Toggles if any text should automatically change to its translated version depending on the current locale. */
        get auto_translate(): boolean
        set auto_translate(value: boolean)
        
        /** The default tooltip text. The tooltip appears when the user's mouse cursor stays idle over this control for a few moments, provided that the [member mouse_filter] property is not [constant MOUSE_FILTER_IGNORE]. The time required for the tooltip to appear can be changed with the [member ProjectSettings.gui/timers/tooltip_delay_sec] option. See also [method get_tooltip].  
         *  The tooltip popup will use either a default implementation, or a custom one that you can provide by overriding [method _make_custom_tooltip]. The default tooltip includes a [PopupPanel] and [Label] whose theme properties can be customized using [Theme] methods with the `"TooltipPanel"` and `"TooltipLabel"` respectively. For example:  
         *    
         */
        get tooltip_text(): string
        set tooltip_text(value: string)
        
        /** Tells Godot which node it should give focus to if the user presses the left arrow on the keyboard or left on a gamepad by default. You can change the key by editing the [member ProjectSettings.input/ui_left] input action. The node must be a [Control]. If this property is not set, Godot will give focus to the closest [Control] to the left of this one. */
        get focus_neighbor_left(): NodePath
        set focus_neighbor_left(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses the top arrow on the keyboard or top on a gamepad by default. You can change the key by editing the [member ProjectSettings.input/ui_up] input action. The node must be a [Control]. If this property is not set, Godot will give focus to the closest [Control] to the top of this one. */
        get focus_neighbor_top(): NodePath
        set focus_neighbor_top(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses the right arrow on the keyboard or right on a gamepad by default. You can change the key by editing the [member ProjectSettings.input/ui_right] input action. The node must be a [Control]. If this property is not set, Godot will give focus to the closest [Control] to the right of this one. */
        get focus_neighbor_right(): NodePath
        set focus_neighbor_right(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses the down arrow on the keyboard or down on a gamepad by default. You can change the key by editing the [member ProjectSettings.input/ui_down] input action. The node must be a [Control]. If this property is not set, Godot will give focus to the closest [Control] to the bottom of this one. */
        get focus_neighbor_bottom(): NodePath
        set focus_neighbor_bottom(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses [kbd]Tab[/kbd] on a keyboard by default. You can change the key by editing the [member ProjectSettings.input/ui_focus_next] input action.  
         *  If this property is not set, Godot will select a "best guess" based on surrounding nodes in the scene tree.  
         */
        get focus_next(): NodePath
        set focus_next(value: NodePath | string)
        
        /** Tells Godot which node it should give focus to if the user presses [kbd]Shift + Tab[/kbd] on a keyboard by default. You can change the key by editing the [member ProjectSettings.input/ui_focus_prev] input action.  
         *  If this property is not set, Godot will select a "best guess" based on surrounding nodes in the scene tree.  
         */
        get focus_previous(): NodePath
        set focus_previous(value: NodePath | string)
        
        /** The focus access mode for the control (None, Click or All). Only one Control can be focused at the same time, and it will receive keyboard, gamepad, and mouse signals. */
        get focus_mode(): int64
        set focus_mode(value: int64)
        
        /** Controls whether the control will be able to receive mouse button input events through [method _gui_input] and how these events should be handled. Also controls whether the control can receive the [signal mouse_entered], and [signal mouse_exited] signals. See the constants to learn what each does. */
        get mouse_filter(): int64
        set mouse_filter(value: int64)
        
        /** When enabled, scroll wheel events processed by [method _gui_input] will be passed to the parent control even if [member mouse_filter] is set to [constant MOUSE_FILTER_STOP]. As it defaults to true, this allows nested scrollable containers to work out of the box.  
         *  You should disable it on the root of your UI if you do not want scroll events to go to the [method Node._unhandled_input] processing.  
         */
        get mouse_force_pass_scroll_events(): boolean
        set mouse_force_pass_scroll_events(value: boolean)
        
        /** The default cursor shape for this control. Useful for Godot plugins and applications or games that use the system's mouse cursors.  
         *      
         *  **Note:** On Linux, shapes may vary depending on the cursor theme of the system.  
         */
        get mouse_default_cursor_shape(): int64
        set mouse_default_cursor_shape(value: int64)
        
        /** The [Node] which must be a parent of the focused [Control] for the shortcut to be activated. If `null`, the shortcut can be activated when any control is focused (a global shortcut). This allows shortcuts to be accepted only when the user has a certain area of the GUI focused. */
        get shortcut_context(): Object
        set shortcut_context(value: Object)
        
        /** The [Theme] resource this node and all its [Control] and [Window] children use. If a child node has its own [Theme] resource set, theme items are merged with child's definitions having higher priority.  
         *      
         *  **Note:** [Window] styles will have no effect unless the window is embedded.  
         */
        get theme(): Theme
        set theme(value: Theme)
        
        /** The name of a theme type variation used by this [Control] to look up its own theme items. When empty, the class name of the node is used (e.g. [code skip-lint]Button` for the [Button] control), as well as the class names of all parent classes (in order of inheritance).  
         *  When set, this property gives the highest priority to the type of the specified name. This type can in turn extend another type, forming a dependency chain. See [method Theme.set_type_variation]. If the theme item cannot be found using this type or its base types, lookup falls back on the class names.  
         *      
         *  **Note:** To look up [Control]'s own items use various `get_theme_*` methods without specifying `theme_type`.  
         *      
         *  **Note:** Theme items are looked for in the tree order, from branch to root, where each [Control] node is checked for its [member theme] property. The earliest match against any type/class name is returned. The project-level Theme and the default Theme are checked last.  
         */
        get theme_type_variation(): string
        set theme_type_variation(value: string)
        
        /** Emitted when the control changes size. */
        readonly resized: Signal0
        
        /** Emitted when the node receives an [InputEvent]. */
        readonly gui_input: Signal1<InputEvent>
        
        /** Emitted when the mouse cursor enters the control's (or any child control's) visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect, which Control receives the signal.  
         */
        readonly mouse_entered: Signal0
        
        /** Emitted when the mouse cursor leaves the control's (and all child control's) visible area, that is not occluded behind other Controls or Windows, provided its [member mouse_filter] lets the event reach it and regardless if it's currently focused or not.  
         *      
         *  **Note:** [member CanvasItem.z_index] doesn't affect, which Control receives the signal.  
         *      
         *  **Note:** If you want to check whether the mouse truly left the area, ignoring any top nodes, you can use code like this:  
         *    
         */
        readonly mouse_exited: Signal0
        
        /** Emitted when the node gains focus. */
        readonly focus_entered: Signal0
        
        /** Emitted when the node loses focus. */
        readonly focus_exited: Signal0
        
        /** Emitted when one of the size flags changes. See [member size_flags_horizontal] and [member size_flags_vertical]. */
        readonly size_flags_changed: Signal0
        
        /** Emitted when the node's minimum size changes. */
        readonly minimum_size_changed: Signal0
        
        /** Emitted when the [constant NOTIFICATION_THEME_CHANGED] notification is sent. */
        readonly theme_changed: Signal0
    }
    class ControlEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    class ControlEditorPopupButton extends Button {
        constructor(identifier?: any)
    }
    class ControlEditorPresetPicker extends MarginContainer {
        constructor(identifier?: any)
    }
    class ControlEditorToolbar extends HBoxContainer {
        constructor(identifier?: any)
    }
    /** A 2D convex polygon shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_convexpolygonshape2d.html  
     */
    class ConvexPolygonShape2D extends Shape2D {
        constructor(identifier?: any)
        /** Based on the set of points provided, this assigns the [member points] property using the convex hull algorithm, removing all unneeded points. See [method Geometry2D.convex_hull] for details. */
        set_point_cloud(point_cloud: PackedVector2Array | Vector2[]): void
        
        /** The polygon's list of vertices that form a convex hull. Can be in either clockwise or counterclockwise order.  
         *  **Warning:** Only set this property to a list of points that actually form a convex hull. Use [method set_point_cloud] to generate the convex hull of an arbitrary set of points.  
         */
        get points(): PackedVector2Array
        set points(value: PackedVector2Array | Vector2[])
    }
    /** A 3D convex polyhedron shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_convexpolygonshape3d.html  
     */
    class ConvexPolygonShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The list of 3D points forming the convex polygon shape. */
        get points(): GArray
        set points(value: GArray)
    }
    class CreateDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly create: Signal0
        readonly favorites_updated: Signal0
    }
    /** Provides access to advanced cryptographic functionalities.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_crypto.html  
     */
    class Crypto extends RefCounted {
        constructor(identifier?: any)
        /** Generates a [PackedByteArray] of cryptographically secure random bytes with given [param size]. */
        generate_random_bytes(size: int64): PackedByteArray
        
        /** Generates an RSA [CryptoKey] that can be used for creating self-signed certificates and passed to [method StreamPeerTLS.accept_stream]. */
        generate_rsa(size: int64): CryptoKey
        
        /** Generates a self-signed [X509Certificate] from the given [CryptoKey] and [param issuer_name]. The certificate validity will be defined by [param not_before] and [param not_after] (first valid date and last valid date). The [param issuer_name] must contain at least "CN=" (common name, i.e. the domain name), "O=" (organization, i.e. your company name), "C=" (country, i.e. 2 lettered ISO-3166 code of the country the organization is based in).  
         *  A small example to generate an RSA key and an X509 self-signed certificate.  
         *    
         */
        generate_self_signed_certificate(key: CryptoKey, issuer_name: string = 'CN=myserver,O=myorganisation,C=IT', not_before: string = '20140101000000', not_after: string = '20340101000000'): X509Certificate
        
        /** Sign a given [param hash] of type [param hash_type] with the provided private [param key]. */
        sign(hash_type: HashingContext.HashType, hash: PackedByteArray | byte[] | ArrayBuffer, key: CryptoKey): PackedByteArray
        
        /** Verify that a given [param signature] for [param hash] of type [param hash_type] against the provided public [param key]. */
        verify(hash_type: HashingContext.HashType, hash: PackedByteArray | byte[] | ArrayBuffer, signature: PackedByteArray | byte[] | ArrayBuffer, key: CryptoKey): boolean
        
        /** Encrypt the given [param plaintext] with the provided public [param key].  
         *      
         *  **Note:** The maximum size of accepted plaintext is limited by the key size.  
         */
        encrypt(key: CryptoKey, plaintext: PackedByteArray | byte[] | ArrayBuffer): PackedByteArray
        
        /** Decrypt the given [param ciphertext] with the provided private [param key].  
         *      
         *  **Note:** The maximum size of accepted ciphertext is limited by the key size.  
         */
        decrypt(key: CryptoKey, ciphertext: PackedByteArray | byte[] | ArrayBuffer): PackedByteArray
        
        /** Generates an [url=https://en.wikipedia.org/wiki/HMAC]HMAC[/url] digest of [param msg] using [param key]. The [param hash_type] parameter is the hashing algorithm that is used for the inner and outer hashes.  
         *  Currently, only [constant HashingContext.HASH_SHA256] and [constant HashingContext.HASH_SHA1] are supported.  
         */
        hmac_digest(hash_type: HashingContext.HashType, key: PackedByteArray | byte[] | ArrayBuffer, msg: PackedByteArray | byte[] | ArrayBuffer): PackedByteArray
        
        /** Compares two [PackedByteArray]s for equality without leaking timing information in order to prevent timing attacks.  
         *  See [url=https://paragonie.com/blog/2015/11/preventing-timing-attacks-on-string-comparison-with-double-hmac-strategy]this blog post[/url] for more information.  
         */
        constant_time_compare(trusted: PackedByteArray | byte[] | ArrayBuffer, received: PackedByteArray | byte[] | ArrayBuffer): boolean
    }
    /** A cryptographic key (RSA or elliptic-curve).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cryptokey.html  
     */
    class CryptoKey extends Resource {
        constructor(identifier?: any)
        /** Saves a key to the given [param path]. If [param public_only] is `true`, only the public key will be saved.  
         *      
         *  **Note:** [param path] should be a "*.pub" file if [param public_only] is `true`, a "*.key" file otherwise.  
         */
        save(path: string, public_only: boolean = false): GError
        
        /** Loads a key from [param path]. If [param public_only] is `true`, only the public key will be loaded.  
         *      
         *  **Note:** [param path] should be a "*.pub" file if [param public_only] is `true`, a "*.key" file otherwise.  
         */
        load(path: string, public_only: boolean = false): GError
        
        /** Returns `true` if this CryptoKey only has the public part, and not the private one. */
        is_public_only(): boolean
        
        /** Returns a string containing the key in PEM format. If [param public_only] is `true`, only the public key will be included. */
        save_to_string(public_only: boolean = false): string
        
        /** Loads a key from the given [param string_key]. If [param public_only] is `true`, only the public key will be loaded. */
        load_from_string(string_key: string, public_only: boolean = false): GError
    }
    /** Six square textures representing the faces of a cube. Commonly used as a skybox.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cubemap.html  
     */
    class Cubemap extends ImageTextureLayered {
        constructor(identifier?: any)
        /** Creates a placeholder version of this resource ([PlaceholderCubemap]). */
        create_placeholder(): Resource
    }
    /** An array of [Cubemap]s, stored together and with a single reference.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cubemaparray.html  
     */
    class CubemapArray extends ImageTextureLayered {
        constructor(identifier?: any)
        /** Creates a placeholder version of this resource ([PlaceholderCubemapArray]). */
        create_placeholder(): Resource
    }
    namespace Curve {
        enum TangentMode {
            /** The tangent on this side of the point is user-defined. */
            TANGENT_FREE = 0,
            
            /** The curve calculates the tangent on this side of the point as the slope halfway towards the adjacent point. */
            TANGENT_LINEAR = 1,
            
            /** The total number of available tangent modes. */
            TANGENT_MODE_COUNT = 2,
        }
    }
    /** A mathematical curve.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_curve.html  
     */
    class Curve extends Resource {
        constructor(identifier?: any)
        /** Adds a point to the curve. For each side, if the `*_mode` is [constant TANGENT_LINEAR], the `*_tangent` angle (in degrees) uses the slope of the curve halfway to the adjacent point. Allows custom assignments to the `*_tangent` angle if `*_mode` is set to [constant TANGENT_FREE]. */
        add_point(position: Vector2, left_tangent: float64 = 0, right_tangent: float64 = 0, left_mode: Curve.TangentMode = 0, right_mode: Curve.TangentMode = 0): int64
        
        /** Removes the point at [param index] from the curve. */
        remove_point(index: int64): void
        
        /** Removes all points from the curve. */
        clear_points(): void
        
        /** Returns the curve coordinates for the point at [param index]. */
        get_point_position(index: int64): Vector2
        
        /** Assigns the vertical position [param y] to the point at [param index]. */
        set_point_value(index: int64, y: float64): void
        
        /** Sets the offset from `0.5`. */
        set_point_offset(index: int64, offset: float64): int64
        
        /** Returns the Y value for the point that would exist at the X position [param offset] along the curve. */
        sample(offset: float64): float64
        
        /** Returns the Y value for the point that would exist at the X position [param offset] along the curve using the baked cache. Bakes the curve's points if not already baked. */
        sample_baked(offset: float64): float64
        
        /** Returns the left tangent angle (in degrees) for the point at [param index]. */
        get_point_left_tangent(index: int64): float64
        
        /** Returns the right tangent angle (in degrees) for the point at [param index]. */
        get_point_right_tangent(index: int64): float64
        
        /** Returns the left [enum TangentMode] for the point at [param index]. */
        get_point_left_mode(index: int64): Curve.TangentMode
        
        /** Returns the right [enum TangentMode] for the point at [param index]. */
        get_point_right_mode(index: int64): Curve.TangentMode
        
        /** Sets the left tangent angle for the point at [param index] to [param tangent]. */
        set_point_left_tangent(index: int64, tangent: float64): void
        
        /** Sets the right tangent angle for the point at [param index] to [param tangent]. */
        set_point_right_tangent(index: int64, tangent: float64): void
        
        /** Sets the left [enum TangentMode] for the point at [param index] to [param mode]. */
        set_point_left_mode(index: int64, mode: Curve.TangentMode): void
        
        /** Sets the right [enum TangentMode] for the point at [param index] to [param mode]. */
        set_point_right_mode(index: int64, mode: Curve.TangentMode): void
        
        /** Removes duplicate points, i.e. points that are less than 0.00001 units (engine epsilon value) away from their neighbor on the curve. */
        clean_dupes(): void
        
        /** Recomputes the baked cache of points for the curve. */
        bake(): void
        
        /** The minimum value the curve can reach. */
        get min_value(): float64
        set min_value(value: float64)
        
        /** The maximum value the curve can reach. */
        get max_value(): float64
        set max_value(value: float64)
        
        /** The number of points to include in the baked (i.e. cached) curve data. */
        get bake_resolution(): int64
        set bake_resolution(value: int64)
        get _data(): int64
        set _data(value: int64)
        
        /** The number of points describing the curve. */
        get point_count(): any /*Points,point_*/
        set point_count(value: any /*Points,point_*/)
        
        /** Emitted when [member max_value] or [member min_value] is changed. */
        readonly range_changed: Signal0
    }
    /** Describes a Bézier curve in 2D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_curve2d.html  
     */
    class Curve2D extends Resource {
        constructor(identifier?: any)
        /** Adds a point with the specified [param position] relative to the curve's own position, with control points [param in] and [param out]. Appends the new point at the end of the point list.  
         *  If [param index] is given, the new point is inserted before the existing point identified by index [param index]. Every existing point starting from [param index] is shifted further down the list of points. The index must be greater than or equal to `0` and must not exceed the number of existing points in the line. See [member point_count].  
         */
        add_point(position: Vector2, in_: Vector2 = Vector2.ZERO, out_: Vector2 = Vector2.ZERO, index: int64 = -1): void
        
        /** Sets the position for the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. */
        set_point_position(idx: int64, position: Vector2): void
        
        /** Returns the position of the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0)`. */
        get_point_position(idx: int64): Vector2
        
        /** Sets the position of the control point leading to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. The position is relative to the vertex. */
        set_point_in(idx: int64, position: Vector2): void
        
        /** Returns the position of the control point leading to the vertex [param idx]. The returned position is relative to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0)`. */
        get_point_in(idx: int64): Vector2
        
        /** Sets the position of the control point leading out of the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. The position is relative to the vertex. */
        set_point_out(idx: int64, position: Vector2): void
        
        /** Returns the position of the control point leading out of the vertex [param idx]. The returned position is relative to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0)`. */
        get_point_out(idx: int64): Vector2
        
        /** Deletes the point [param idx] from the curve. Sends an error to the console if [param idx] is out of bounds. */
        remove_point(idx: int64): void
        
        /** Removes all points from the curve. */
        clear_points(): void
        
        /** Returns the position between the vertex [param idx] and the vertex `idx + 1`, where [param t] controls if the point is the first vertex (`t = 0.0`), the last vertex (`t = 1.0`), or in between. Values of [param t] outside the range (`0.0 <= t <= 1.0`) give strange, but predictable results.  
         *  If [param idx] is out of bounds it is truncated to the first or last vertex, and [param t] is ignored. If the curve has no points, the function sends an error to the console, and returns `(0, 0)`.  
         */
        sample(idx: int64, t: float64): Vector2
        
        /** Returns the position at the vertex [param fofs]. It calls [method sample] using the integer part of [param fofs] as `idx`, and its fractional part as `t`. */
        samplef(fofs: float64): Vector2
        
        /** Returns the total length of the curve, based on the cached points. Given enough density (see [member bake_interval]), it should be approximate enough. */
        get_baked_length(): float64
        
        /** Returns a point within the curve at position [param offset], where [param offset] is measured as a pixel distance along the curve.  
         *  To do that, it finds the two cached points where the [param offset] lies between, then interpolates the values. This interpolation is cubic if [param cubic] is set to `true`, or linear if set to `false`.  
         *  Cubic interpolation tends to follow the curves better, but linear is faster (and often, precise enough).  
         */
        sample_baked(offset: float64 = 0, cubic: boolean = false): Vector2
        
        /** Similar to [method sample_baked], but returns [Transform2D] that includes a rotation along the curve, with [member Transform2D.origin] as the point position and the [member Transform2D.x] vector pointing in the direction of the path at that point. Returns an empty transform if the length of the curve is `0`.  
         *    
         */
        sample_baked_with_rotation(offset: float64 = 0, cubic: boolean = false): Transform2D
        
        /** Returns the cache of points as a [PackedVector2Array]. */
        get_baked_points(): PackedVector2Array
        
        /** Returns the closest point on baked segments (in curve's local space) to [param to_point].  
         *  [param to_point] must be in this curve's local space.  
         */
        get_closest_point(to_point: Vector2): Vector2
        
        /** Returns the closest offset to [param to_point]. This offset is meant to be used in [method sample_baked].  
         *  [param to_point] must be in this curve's local space.  
         */
        get_closest_offset(to_point: Vector2): float64
        
        /** Returns a list of points along the curve, with a curvature controlled point density. That is, the curvier parts will have more points than the straighter parts.  
         *  This approximation makes straight segments between each point, then subdivides those segments until the resulting shape is similar enough.  
         *  [param max_stages] controls how many subdivisions a curve segment may face before it is considered approximate enough. Each subdivision splits the segment in half, so the default 5 stages may mean up to 32 subdivisions per curve segment. Increase with care!  
         *  [param tolerance_degrees] controls how many degrees the midpoint of a segment may deviate from the real curve, before the segment has to be subdivided.  
         */
        tessellate(max_stages: int64 = 5, tolerance_degrees: float64 = 4): PackedVector2Array
        
        /** Returns a list of points along the curve, with almost uniform density. [param max_stages] controls how many subdivisions a curve segment may face before it is considered approximate enough. Each subdivision splits the segment in half, so the default 5 stages may mean up to 32 subdivisions per curve segment. Increase with care!  
         *  [param tolerance_length] controls the maximal distance between two neighboring points, before the segment has to be subdivided.  
         */
        tessellate_even_length(max_stages: int64 = 5, tolerance_length: float64 = 20): PackedVector2Array
        
        /** The distance in pixels between two adjacent cached points. Changing it forces the cache to be recomputed the next time the [method get_baked_points] or [method get_baked_length] function is called. The smaller the distance, the more points in the cache and the more memory it will consume, so use with care. */
        get bake_interval(): float64
        set bake_interval(value: float64)
        get _data(): int64
        set _data(value: int64)
        
        /** The number of points describing the curve. */
        get point_count(): any /*Points,point_*/
        set point_count(value: any /*Points,point_*/)
    }
    /** Describes a Bézier curve in 3D space.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_curve3d.html  
     */
    class Curve3D extends Resource {
        constructor(identifier?: any)
        /** Adds a point with the specified [param position] relative to the curve's own position, with control points [param in] and [param out]. Appends the new point at the end of the point list.  
         *  If [param index] is given, the new point is inserted before the existing point identified by index [param index]. Every existing point starting from [param index] is shifted further down the list of points. The index must be greater than or equal to `0` and must not exceed the number of existing points in the line. See [member point_count].  
         */
        add_point(position: Vector3, in_: Vector3 = new Vector3(0, 0, 0), out_: Vector3 = new Vector3(0, 0, 0), index: int64 = -1): void
        
        /** Sets the position for the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. */
        set_point_position(idx: int64, position: Vector3): void
        
        /** Returns the position of the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0, 0)`. */
        get_point_position(idx: int64): Vector3
        
        /** Sets the tilt angle in radians for the point [param idx]. If the index is out of bounds, the function sends an error to the console.  
         *  The tilt controls the rotation along the look-at axis an object traveling the path would have. In the case of a curve controlling a [PathFollow3D], this tilt is an offset over the natural tilt the [PathFollow3D] calculates.  
         */
        set_point_tilt(idx: int64, tilt: float64): void
        
        /** Returns the tilt angle in radians for the point [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `0`. */
        get_point_tilt(idx: int64): float64
        
        /** Sets the position of the control point leading to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. The position is relative to the vertex. */
        set_point_in(idx: int64, position: Vector3): void
        
        /** Returns the position of the control point leading to the vertex [param idx]. The returned position is relative to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0, 0)`. */
        get_point_in(idx: int64): Vector3
        
        /** Sets the position of the control point leading out of the vertex [param idx]. If the index is out of bounds, the function sends an error to the console. The position is relative to the vertex. */
        set_point_out(idx: int64, position: Vector3): void
        
        /** Returns the position of the control point leading out of the vertex [param idx]. The returned position is relative to the vertex [param idx]. If the index is out of bounds, the function sends an error to the console, and returns `(0, 0, 0)`. */
        get_point_out(idx: int64): Vector3
        
        /** Deletes the point [param idx] from the curve. Sends an error to the console if [param idx] is out of bounds. */
        remove_point(idx: int64): void
        
        /** Removes all points from the curve. */
        clear_points(): void
        
        /** Returns the position between the vertex [param idx] and the vertex `idx + 1`, where [param t] controls if the point is the first vertex (`t = 0.0`), the last vertex (`t = 1.0`), or in between. Values of [param t] outside the range (`0.0 >= t <=1`) give strange, but predictable results.  
         *  If [param idx] is out of bounds it is truncated to the first or last vertex, and [param t] is ignored. If the curve has no points, the function sends an error to the console, and returns `(0, 0, 0)`.  
         */
        sample(idx: int64, t: float64): Vector3
        
        /** Returns the position at the vertex [param fofs]. It calls [method sample] using the integer part of [param fofs] as `idx`, and its fractional part as `t`. */
        samplef(fofs: float64): Vector3
        
        /** Returns the total length of the curve, based on the cached points. Given enough density (see [member bake_interval]), it should be approximate enough. */
        get_baked_length(): float64
        
        /** Returns a point within the curve at position [param offset], where [param offset] is measured as a distance in 3D units along the curve. To do that, it finds the two cached points where the [param offset] lies between, then interpolates the values. This interpolation is cubic if [param cubic] is set to `true`, or linear if set to `false`.  
         *  Cubic interpolation tends to follow the curves better, but linear is faster (and often, precise enough).  
         */
        sample_baked(offset: float64 = 0, cubic: boolean = false): Vector3
        
        /** Returns a [Transform3D] with `origin` as point position, `basis.x` as sideway vector, `basis.y` as up vector, `basis.z` as forward vector. When the curve length is 0, there is no reasonable way to calculate the rotation, all vectors aligned with global space axes. See also [method sample_baked]. */
        sample_baked_with_rotation(offset: float64 = 0, cubic: boolean = false, apply_tilt: boolean = false): Transform3D
        
        /** Returns an up vector within the curve at position [param offset], where [param offset] is measured as a distance in 3D units along the curve. To do that, it finds the two cached up vectors where the [param offset] lies between, then interpolates the values. If [param apply_tilt] is `true`, an interpolated tilt is applied to the interpolated up vector.  
         *  If the curve has no up vectors, the function sends an error to the console, and returns `(0, 1, 0)`.  
         */
        sample_baked_up_vector(offset: float64, apply_tilt: boolean = false): Vector3
        
        /** Returns the cache of points as a [PackedVector3Array]. */
        get_baked_points(): PackedVector3Array
        
        /** Returns the cache of tilts as a [PackedFloat32Array]. */
        get_baked_tilts(): PackedFloat32Array
        
        /** Returns the cache of up vectors as a [PackedVector3Array].  
         *  If [member up_vector_enabled] is `false`, the cache will be empty.  
         */
        get_baked_up_vectors(): PackedVector3Array
        
        /** Returns the closest point on baked segments (in curve's local space) to [param to_point].  
         *  [param to_point] must be in this curve's local space.  
         */
        get_closest_point(to_point: Vector3): Vector3
        
        /** Returns the closest offset to [param to_point]. This offset is meant to be used in [method sample_baked] or [method sample_baked_up_vector].  
         *  [param to_point] must be in this curve's local space.  
         */
        get_closest_offset(to_point: Vector3): float64
        
        /** Returns a list of points along the curve, with a curvature controlled point density. That is, the curvier parts will have more points than the straighter parts.  
         *  This approximation makes straight segments between each point, then subdivides those segments until the resulting shape is similar enough.  
         *  [param max_stages] controls how many subdivisions a curve segment may face before it is considered approximate enough. Each subdivision splits the segment in half, so the default 5 stages may mean up to 32 subdivisions per curve segment. Increase with care!  
         *  [param tolerance_degrees] controls how many degrees the midpoint of a segment may deviate from the real curve, before the segment has to be subdivided.  
         */
        tessellate(max_stages: int64 = 5, tolerance_degrees: float64 = 4): PackedVector3Array
        
        /** Returns a list of points along the curve, with almost uniform density. [param max_stages] controls how many subdivisions a curve segment may face before it is considered approximate enough. Each subdivision splits the segment in half, so the default 5 stages may mean up to 32 subdivisions per curve segment. Increase with care!  
         *  [param tolerance_length] controls the maximal distance between two neighboring points, before the segment has to be subdivided.  
         */
        tessellate_even_length(max_stages: int64 = 5, tolerance_length: float64 = 0.2): PackedVector3Array
        
        /** The distance in meters between two adjacent cached points. Changing it forces the cache to be recomputed the next time the [method get_baked_points] or [method get_baked_length] function is called. The smaller the distance, the more points in the cache and the more memory it will consume, so use with care. */
        get bake_interval(): float64
        set bake_interval(value: float64)
        get _data(): int64
        set _data(value: int64)
        
        /** The number of points describing the curve. */
        get point_count(): any /*Points,point_*/
        set point_count(value: any /*Points,point_*/)
        
        /** If `true`, the curve will bake up vectors used for orientation. This is used when [member PathFollow3D.rotation_mode] is set to [constant PathFollow3D.ROTATION_ORIENTED]. Changing it forces the cache to be recomputed. */
        get up_vector_enabled(): boolean
        set up_vector_enabled(value: boolean)
    }
    class CurveEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    class CurvePreviewGenerator extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    namespace CurveTexture {
        enum TextureMode {
            /** Store the curve equally across the red, green and blue channels. This uses more video memory, but is more compatible with shaders that only read the green and blue values. */
            TEXTURE_MODE_RGB = 0,
            
            /** Store the curve only in the red channel. This saves video memory, but some custom shaders may not be able to work with this. */
            TEXTURE_MODE_RED = 1,
        }
    }
    /** A 1D texture where pixel brightness corresponds to points on a curve.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_curvetexture.html  
     */
    class CurveTexture extends Texture2D {
        constructor(identifier?: any)
        /** The width of the texture (in pixels). Higher values make it possible to represent high-frequency data better (such as sudden direction changes), at the cost of increased generation time and memory usage. */
        get width(): int64
        set width(value: int64)
        
        /** The format the texture should be generated with. When passing a CurveTexture as an input to a [Shader], this may need to be adjusted. */
        get texture_mode(): int64
        set texture_mode(value: int64)
        
        /** The [Curve] that is rendered onto the texture. */
        get curve(): Curve
        set curve(value: Curve)
    }
    /** A 1D texture where the red, green, and blue color channels correspond to points on 3 curves.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_curvexyztexture.html  
     */
    class CurveXYZTexture extends Texture2D {
        constructor(identifier?: any)
        /** The width of the texture (in pixels). Higher values make it possible to represent high-frequency data better (such as sudden direction changes), at the cost of increased generation time and memory usage. */
        get width(): int64
        set width(value: int64)
        
        /** The [Curve] that is rendered onto the texture's red channel. */
        get curve_x(): Curve
        set curve_x(value: Curve)
        
        /** The [Curve] that is rendered onto the texture's green channel. */
        get curve_y(): Curve
        set curve_y(value: Curve)
        
        /** The [Curve] that is rendered onto the texture's blue channel. */
        get curve_z(): Curve
        set curve_z(value: Curve)
    }
    /** Class representing a cylindrical [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cylindermesh.html  
     */
    class CylinderMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** Top radius of the cylinder. If set to `0.0`, the top faces will not be generated, resulting in a conic shape. See also [member cap_top]. */
        get top_radius(): float64
        set top_radius(value: float64)
        
        /** Bottom radius of the cylinder. If set to `0.0`, the bottom faces will not be generated, resulting in a conic shape. See also [member cap_bottom]. */
        get bottom_radius(): float64
        set bottom_radius(value: float64)
        
        /** Full height of the cylinder. */
        get height(): float64
        set height(value: float64)
        
        /** Number of radial segments on the cylinder. Higher values result in a more detailed cylinder/cone at the cost of performance. */
        get radial_segments(): int64
        set radial_segments(value: int64)
        
        /** Number of edge rings along the height of the cylinder. Changing [member rings] does not have any visual impact unless a shader or procedural mesh tool is used to alter the vertex data. Higher values result in more subdivisions, which can be used to create smoother-looking effects with shaders or procedural mesh tools (at the cost of performance). When not altering the vertex data using a shader or procedural mesh tool, [member rings] should be kept to its default value. */
        get rings(): int64
        set rings(value: int64)
        
        /** If `true`, generates a cap at the top of the cylinder. This can be set to `false` to speed up generation and rendering when the cap is never seen by the camera. See also [member top_radius].  
         *      
         *  **Note:** If [member top_radius] is `0.0`, cap generation is always skipped even if [member cap_top] is `true`.  
         */
        get cap_top(): boolean
        set cap_top(value: boolean)
        
        /** If `true`, generates a cap at the bottom of the cylinder. This can be set to `false` to speed up generation and rendering when the cap is never seen by the camera. See also [member bottom_radius].  
         *      
         *  **Note:** If [member bottom_radius] is `0.0`, cap generation is always skipped even if [member cap_bottom] is `true`.  
         */
        get cap_bottom(): boolean
        set cap_bottom(value: boolean)
    }
    /** A 3D cylinder shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_cylindershape3d.html  
     */
    class CylinderShape3D extends Shape3D {
        constructor(identifier?: any)
        /** The cylinder's height. */
        get height(): float64
        set height(value: float64)
        
        /** The cylinder's radius. */
        get radius(): float64
        set radius(value: float64)
    }
    /** Helper class to implement a DTLS server.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_dtlsserver.html  
     */
    class DTLSServer extends RefCounted {
        constructor(identifier?: any)
        /** Setup the DTLS server to use the given [param server_options]. See [method TLSOptions.server]. */
        setup(server_options: TLSOptions): GError
        
        /** Try to initiate the DTLS handshake with the given [param udp_peer] which must be already connected (see [method PacketPeerUDP.connect_to_host]).  
         *      
         *  **Note:** You must check that the state of the return PacketPeerUDP is [constant PacketPeerDTLS.STATUS_HANDSHAKING], as it is normal that 50% of the new connections will be invalid due to cookie exchange.  
         */
        take_connection(udp_peer: PacketPeerUDP): PacketPeerDTLS
    }
    /** A physics joint that connects two 2D physics bodies with a spring-like force.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_dampedspringjoint2d.html  
     */
    class DampedSpringJoint2D extends Joint2D {
        constructor(identifier?: any)
        /** The spring joint's maximum length. The two attached bodies cannot stretch it past this value. */
        get length(): float64
        set length(value: float64)
        
        /** When the bodies attached to the spring joint move they stretch or squash it. The joint always tries to resize towards this length. */
        get rest_length(): float64
        set rest_length(value: float64)
        
        /** The higher the value, the less the bodies attached to the joint will deform it. The joint applies an opposing force to the bodies, the product of the stiffness multiplied by the size difference from its resting length. */
        get stiffness(): float64
        set stiffness(value: float64)
        
        /** The spring joint's damping ratio. A value between `0` and `1`. When the two bodies move into different directions the system tries to align them to the spring axis again. A high [member damping] value forces the attached bodies to align faster. */
        get damping(): float64
        set damping(value: float64)
    }
    class DebugAdapterParser extends Object {
        constructor(identifier?: any)
        req_initialize(params: GDictionary): GDictionary
        req_disconnect(params: GDictionary): GDictionary
        req_launch(params: GDictionary): GDictionary
        req_attach(params: GDictionary): GDictionary
        req_restart(params: GDictionary): GDictionary
        req_terminate(params: GDictionary): GDictionary
        req_configurationDone(params: GDictionary): GDictionary
        req_pause(params: GDictionary): GDictionary
        req_continue(params: GDictionary): GDictionary
        req_threads(params: GDictionary): GDictionary
        req_stackTrace(params: GDictionary): GDictionary
        req_setBreakpoints(params: GDictionary): GDictionary
        req_breakpointLocations(params: GDictionary): GDictionary
        req_scopes(params: GDictionary): GDictionary
        req_variables(params: GDictionary): GDictionary
        req_next(params: GDictionary): GDictionary
        req_stepIn(params: GDictionary): GDictionary
        req_evaluate(params: GDictionary): GDictionary
        ["req_godot/put_msg"]: (params: GDictionary) => GDictionary
    }
    class DebugAdapterServer extends EditorPlugin {
        constructor(identifier?: any)
    }
    class DebuggerEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    namespace Decal {
        enum DecalTexture {
            /** [Texture2D] corresponding to [member texture_albedo]. */
            TEXTURE_ALBEDO = 0,
            
            /** [Texture2D] corresponding to [member texture_normal]. */
            TEXTURE_NORMAL = 1,
            
            /** [Texture2D] corresponding to [member texture_orm]. */
            TEXTURE_ORM = 2,
            
            /** [Texture2D] corresponding to [member texture_emission]. */
            TEXTURE_EMISSION = 3,
            
            /** Max size of [enum DecalTexture] enum. */
            TEXTURE_MAX = 4,
        }
    }
    /** Node that projects a texture onto a [MeshInstance3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_decal.html  
     */
    class Decal extends VisualInstance3D {
        constructor(identifier?: any)
        /** Sets the [Texture2D] associated with the specified [enum DecalTexture]. This is a convenience method, in most cases you should access the texture directly.  
         *  For example, instead of `$Decal.set_texture(Decal.TEXTURE_ALBEDO, albedo_tex)`, use `$Decal.texture_albedo = albedo_tex`.  
         *  One case where this is better than accessing the texture directly is when you want to copy one Decal's textures to another. For example:  
         *    
         */
        set_texture(type: Decal.DecalTexture, texture: Texture2D): void
        
        /** Returns the [Texture2D] associated with the specified [enum DecalTexture]. This is a convenience method, in most cases you should access the texture directly.  
         *  For example, instead of `albedo_tex = $Decal.get_texture(Decal.TEXTURE_ALBEDO)`, use `albedo_tex = $Decal.texture_albedo`.  
         *  One case where this is better than accessing the texture directly is when you want to copy one Decal's textures to another. For example:  
         *    
         */
        get_texture(type: Decal.DecalTexture): Texture2D
        
        /** Sets the size of the [AABB] used by the decal. All dimensions must be set to a value greater than zero (they will be clamped to `0.001` if this is not the case). The AABB goes from `-size/2` to `size/2`.  
         *      
         *  **Note:** To improve culling efficiency of "hard surface" decals, set their [member upper_fade] and [member lower_fade] to `0.0` and set the Y component of the [member size] as low as possible. This will reduce the decals' AABB size without affecting their appearance.  
         */
        get size(): Vector3
        set size(value: Vector3)
        
        /** [Texture2D] with the base [Color] of the Decal. Either this or the [member texture_emission] must be set for the Decal to be visible. Use the alpha channel like a mask to smoothly blend the edges of the decal with the underlying object.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for [Decal] textures is set globally with [member ProjectSettings.rendering/textures/decals/filter].  
         */
        get texture_albedo(): Texture2D
        set texture_albedo(value: Texture2D)
        
        /** [Texture2D] with the per-pixel normal map for the decal. Use this to add extra detail to decals.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for [Decal] textures is set globally with [member ProjectSettings.rendering/textures/decals/filter].  
         *      
         *  **Note:** Setting this texture alone will not result in a visible decal, as [member texture_albedo] must also be set. To create a normal-only decal, load an albedo texture into [member texture_albedo] and set [member albedo_mix] to `0.0`. The albedo texture's alpha channel will be used to determine where the underlying surface's normal map should be overridden (and its intensity).  
         */
        get texture_normal(): Texture2D
        set texture_normal(value: Texture2D)
        
        /** [Texture2D] storing ambient occlusion, roughness, and metallic for the decal. Use this to add extra detail to decals.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for [Decal] textures is set globally with [member ProjectSettings.rendering/textures/decals/filter].  
         *      
         *  **Note:** Setting this texture alone will not result in a visible decal, as [member texture_albedo] must also be set. To create an ORM-only decal, load an albedo texture into [member texture_albedo] and set [member albedo_mix] to `0.0`. The albedo texture's alpha channel will be used to determine where the underlying surface's ORM map should be overridden (and its intensity).  
         */
        get texture_orm(): Texture2D
        set texture_orm(value: Texture2D)
        
        /** [Texture2D] with the emission [Color] of the Decal. Either this or the [member texture_albedo] must be set for the Decal to be visible. Use the alpha channel like a mask to smoothly blend the edges of the decal with the underlying object.  
         *      
         *  **Note:** Unlike [BaseMaterial3D] whose filter mode can be adjusted on a per-material basis, the filter mode for [Decal] textures is set globally with [member ProjectSettings.rendering/textures/decals/filter].  
         */
        get texture_emission(): Texture2D
        set texture_emission(value: Texture2D)
        
        /** Energy multiplier for the emission texture. This will make the decal emit light at a higher or lower intensity, independently of the albedo color. See also [member modulate]. */
        get emission_energy(): float64
        set emission_energy(value: float64)
        
        /** Changes the [Color] of the Decal by multiplying the albedo and emission colors with this value. The alpha component is only taken into account when multiplying the albedo color, not the emission color. See also [member emission_energy] and [member albedo_mix] to change the emission and albedo intensity independently of each other. */
        get modulate(): Color
        set modulate(value: Color)
        
        /** Blends the albedo [Color] of the decal with albedo [Color] of the underlying mesh. This can be set to `0.0` to create a decal that only affects normal or ORM. In this case, an albedo texture is still required as its alpha channel will determine where the normal and ORM will be overridden. See also [member modulate]. */
        get albedo_mix(): float64
        set albedo_mix(value: float64)
        
        /** Fades the Decal if the angle between the Decal's [AABB] and the target surface becomes too large. A value of `0` projects the Decal regardless of angle, a value of `1` limits the Decal to surfaces that are nearly perpendicular.  
         *      
         *  **Note:** Setting [member normal_fade] to a value greater than `0.0` has a small performance cost due to the added normal angle computations.  
         */
        get normal_fade(): float64
        set normal_fade(value: float64)
        
        /** Sets the curve over which the decal will fade as the surface gets further from the center of the [AABB]. Only positive values are valid (negative values will be clamped to `0.0`). See also [member lower_fade]. */
        get upper_fade(): float64
        set upper_fade(value: float64)
        
        /** Sets the curve over which the decal will fade as the surface gets further from the center of the [AABB]. Only positive values are valid (negative values will be clamped to `0.0`). See also [member upper_fade]. */
        get lower_fade(): float64
        set lower_fade(value: float64)
        
        /** If `true`, decals will smoothly fade away when far from the active [Camera3D] starting at [member distance_fade_begin]. The Decal will fade out over [member distance_fade_begin] + [member distance_fade_length], after which it will be culled and not sent to the shader at all. Use this to reduce the number of active Decals in a scene and thus improve performance. */
        get distance_fade_enabled(): boolean
        set distance_fade_enabled(value: boolean)
        
        /** The distance from the camera at which the Decal begins to fade away (in 3D units). */
        get distance_fade_begin(): float64
        set distance_fade_begin(value: float64)
        
        /** The distance over which the Decal fades (in 3D units). The Decal becomes slowly more transparent over this distance and is completely invisible at the end. Higher values result in a smoother fade-out transition, which is more suited when the camera moves fast. */
        get distance_fade_length(): float64
        set distance_fade_length(value: float64)
        
        /** Specifies which [member VisualInstance3D.layers] this decal will project on. By default, Decals affect all layers. This is used so you can specify which types of objects receive the Decal and which do not. This is especially useful so you can ensure that dynamic objects don't accidentally receive a Decal intended for the terrain under them. */
        get cull_mask(): int64
        set cull_mask(value: int64)
    }
    class DecalGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    class DefaultThemeEditorPreview extends ThemeEditorPreview {
        constructor(identifier?: any)
    }
    class DependencyEditor extends AcceptDialog {
        constructor(identifier?: any)
    }
    class DependencyEditorOwners extends AcceptDialog {
        constructor(identifier?: any)
    }
    class DependencyErrorDialog extends ConfirmationDialog {
        constructor(identifier?: any)
    }
    class DependencyRemoveDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly resource_removed: Signal1<Object>
        readonly file_removed: Signal1<string>
        readonly folder_removed: Signal1<string>
    }
    /** Provides methods for managing directories and their content.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_diraccess.html  
     */
    class DirAccess extends RefCounted {
        constructor(identifier?: any)
        /** Creates a new [DirAccess] object and opens an existing directory of the filesystem. The [param path] argument can be within the project tree (`res://folder`), the user directory (`user://folder`) or an absolute path of the user filesystem (e.g. `/tmp/folder` or `C:\tmp\folder`).  
         *  Returns `null` if opening the directory failed. You can use [method get_open_error] to check the error that occurred.  
         */
        static open(path: string): DirAccess
        
        /** Returns the result of the last [method open] call in the current thread. */
        static get_open_error(): GError
        
        /** Initializes the stream used to list all files and directories using the [method get_next] function, closing the currently opened stream if needed. Once the stream has been processed, it should typically be closed with [method list_dir_end].  
         *  Affected by [member include_hidden] and [member include_navigational].  
         *      
         *  **Note:** The order of files and directories returned by this method is not deterministic, and can vary between operating systems. If you want a list of all files or folders sorted alphabetically, use [method get_files] or [method get_directories].  
         */
        list_dir_begin(): GError
        
        /** Returns the next element (file or directory) in the current directory.  
         *  The name of the file or directory is returned (and not its full path). Once the stream has been fully processed, the method returns an empty [String] and closes the stream automatically (i.e. [method list_dir_end] would not be mandatory in such a case).  
         */
        get_next(): string
        
        /** Returns whether the current item processed with the last [method get_next] call is a directory (`.` and `..` are considered directories). */
        current_is_dir(): boolean
        
        /** Closes the current stream opened with [method list_dir_begin] (whether it has been fully processed with [method get_next] does not matter). */
        list_dir_end(): void
        
        /** Returns a [PackedStringArray] containing filenames of the directory contents, excluding directories. The array is sorted alphabetically.  
         *  Affected by [member include_hidden].  
         *      
         *  **Note:** When used on a `res://` path in an exported project, only the files actually included in the PCK at the given folder level are returned. In practice, this means that since imported resources are stored in a top-level `.godot/` folder, only paths to `*.gd` and `*.import` files are returned (plus a few files such as `project.godot` or `project.binary` and the project icon). In an exported project, the list of returned files will also vary depending on whether [member ProjectSettings.editor/export/convert_text_resources_to_binary] is `true`.  
         */
        get_files(): PackedStringArray
        
        /** Returns a [PackedStringArray] containing filenames of the directory contents, excluding directories, at the given [param path]. The array is sorted alphabetically.  
         *  Use [method get_files] if you want more control of what gets included.  
         */
        static get_files_at(path: string): PackedStringArray
        
        /** Returns a [PackedStringArray] containing filenames of the directory contents, excluding files. The array is sorted alphabetically.  
         *  Affected by [member include_hidden] and [member include_navigational].  
         */
        get_directories(): PackedStringArray
        
        /** Returns a [PackedStringArray] containing filenames of the directory contents, excluding files, at the given [param path]. The array is sorted alphabetically.  
         *  Use [method get_directories] if you want more control of what gets included.  
         */
        static get_directories_at(path: string): PackedStringArray
        
        /** On Windows, returns the number of drives (partitions) mounted on the current filesystem.  
         *  On macOS, returns the number of mounted volumes.  
         *  On Linux, returns the number of mounted volumes and GTK 3 bookmarks.  
         *  On other platforms, the method returns 0.  
         */
        static get_drive_count(): int64
        
        /** On Windows, returns the name of the drive (partition) passed as an argument (e.g. `C:`).  
         *  On macOS, returns the path to the mounted volume passed as an argument.  
         *  On Linux, returns the path to the mounted volume or GTK 3 bookmark passed as an argument.  
         *  On other platforms, or if the requested drive does not exist, the method returns an empty String.  
         */
        static get_drive_name(idx: int64): string
        
        /** Returns the currently opened directory's drive index. See [method get_drive_name] to convert returned index to the name of the drive. */
        get_current_drive(): int64
        
        /** Changes the currently opened directory to the one passed as an argument. The argument can be relative to the current directory (e.g. `newdir` or `../newdir`), or an absolute path (e.g. `/tmp/newdir` or `res://somedir/newdir`).  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         *      
         *  **Note:** The new directory must be within the same scope, e.g. when you had opened a directory inside `res://`, you can't change it to `user://` directory. If you need to open a directory in another access scope, use [method open] to create a new instance instead.  
         */
        change_dir(to_dir: string): GError
        
        /** Returns the absolute path to the currently opened directory (e.g. `res://folder` or `C:\tmp\folder`). */
        get_current_dir(include_drive: boolean = true): string
        
        /** Creates a directory. The argument can be relative to the current directory, or an absolute path. The target directory should be placed in an already existing directory (to create the full path recursively, see [method make_dir_recursive]).  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        make_dir(path: string): GError
        
        /** Static version of [method make_dir]. Supports only absolute paths. */
        static make_dir_absolute(path: string): GError
        
        /** Creates a target directory and all necessary intermediate directories in its path, by calling [method make_dir] recursively. The argument can be relative to the current directory, or an absolute path.  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        make_dir_recursive(path: string): GError
        
        /** Static version of [method make_dir_recursive]. Supports only absolute paths. */
        static make_dir_recursive_absolute(path: string): GError
        
        /** Returns whether the target file exists. The argument can be relative to the current directory, or an absolute path.  
         *  For a static equivalent, use [method FileAccess.file_exists].  
         */
        file_exists(path: string): boolean
        
        /** Returns whether the target directory exists. The argument can be relative to the current directory, or an absolute path. */
        dir_exists(path: string): boolean
        
        /** Static version of [method dir_exists]. Supports only absolute paths. */
        static dir_exists_absolute(path: string): boolean
        
        /** Returns the available space on the current directory's disk, in bytes. Returns `0` if the platform-specific method to query the available space fails. */
        get_space_left(): int64
        
        /** Copies the [param from] file to the [param to] destination. Both arguments should be paths to files, either relative or absolute. If the destination file exists and is not access-protected, it will be overwritten.  
         *  If [param chmod_flags] is different than `-1`, the Unix permissions for the destination path will be set to the provided value, if available on the current operating system.  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        copy(from: string, to: string, chmod_flags: int64 = -1): GError
        
        /** Static version of [method copy]. Supports only absolute paths. */
        static copy_absolute(from: string, to: string, chmod_flags: int64 = -1): GError
        
        /** Renames (move) the [param from] file or directory to the [param to] destination. Both arguments should be paths to files or directories, either relative or absolute. If the destination file or directory exists and is not access-protected, it will be overwritten.  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        rename(from: string, to: string): GError
        
        /** Static version of [method rename]. Supports only absolute paths. */
        static rename_absolute(from: string, to: string): GError
        
        /** Permanently deletes the target file or an empty directory. The argument can be relative to the current directory, or an absolute path. If the target directory is not empty, the operation will fail.  
         *  If you don't want to delete the file/directory permanently, use [method OS.move_to_trash] instead.  
         *  Returns one of the [enum Error] code constants ([constant OK] on success).  
         */
        remove(path: string): GError
        
        /** Static version of [method remove]. Supports only absolute paths. */
        static remove_absolute(path: string): GError
        
        /** Returns `true` if the file or directory is a symbolic link, directory junction, or other reparse point.  
         *      
         *  **Note:** This method is implemented on macOS, Linux, and Windows.  
         */
        is_link(path: string): boolean
        
        /** Returns target of the symbolic link.  
         *      
         *  **Note:** This method is implemented on macOS, Linux, and Windows.  
         */
        read_link(path: string): string
        
        /** Creates symbolic link between files or folders.  
         *      
         *  **Note:** On Windows, this method works only if the application is running with elevated privileges or Developer Mode is enabled.  
         *      
         *  **Note:** This method is implemented on macOS, Linux, and Windows.  
         */
        create_link(source: string, target: string): GError
        
        /** Returns `true` if the file system or directory use case sensitive file names.  
         *      
         *  **Note:** This method is implemented on macOS, Linux (for EXT4 and F2FS filesystems only) and Windows. On other platforms, it always returns `true`.  
         */
        is_case_sensitive(path: string): boolean
        
        /** If `true`, `.` and `..` are included when navigating the directory.  
         *  Affects [method list_dir_begin] and [method get_directories].  
         */
        get include_navigational(): boolean
        set include_navigational(value: boolean)
        
        /** If `true`, hidden files are included when navigating the directory.  
         *  Affects [method list_dir_begin], [method get_directories] and [method get_files].  
         */
        get include_hidden(): boolean
        set include_hidden(value: boolean)
    }
    /** Directional 2D light from a distance.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_directionallight2d.html  
     */
    class DirectionalLight2D extends Light2D {
        constructor(identifier?: any)
        /** The height of the light. Used with 2D normal mapping. Ranges from 0 (parallel to the plane) to 1 (perpendicular to the plane). */
        get height(): float64
        set height(value: float64)
        
        /** The maximum distance from the camera center objects can be before their shadows are culled (in pixels). Decreasing this value can prevent objects located outside the camera from casting shadows (while also improving performance). [member Camera2D.zoom] is not taken into account by [member max_distance], which means that at higher zoom values, shadows will appear to fade out sooner when zooming onto a given point. */
        get max_distance(): float64
        set max_distance(value: float64)
    }
    namespace DirectionalLight3D {
        enum ShadowMode {
            /** Renders the entire scene's shadow map from an orthogonal point of view. This is the fastest directional shadow mode. May result in blurrier shadows on close objects. */
            SHADOW_ORTHOGONAL = 0,
            
            /** Splits the view frustum in 2 areas, each with its own shadow map. This shadow mode is a compromise between [constant SHADOW_ORTHOGONAL] and [constant SHADOW_PARALLEL_4_SPLITS] in terms of performance. */
            SHADOW_PARALLEL_2_SPLITS = 1,
            
            /** Splits the view frustum in 4 areas, each with its own shadow map. This is the slowest directional shadow mode. */
            SHADOW_PARALLEL_4_SPLITS = 2,
        }
        enum SkyMode {
            /** Makes the light visible in both scene lighting and sky rendering. */
            SKY_MODE_LIGHT_AND_SKY = 0,
            
            /** Makes the light visible in scene lighting only (including direct lighting and global illumination). When using this mode, the light will not be visible from sky shaders. */
            SKY_MODE_LIGHT_ONLY = 1,
            
            /** Makes the light visible to sky shaders only. When using this mode the light will not cast light into the scene (either through direct lighting or through global illumination), but can be accessed through sky shaders. This can be useful, for example, when you want to control sky effects without illuminating the scene (during a night cycle, for example). */
            SKY_MODE_SKY_ONLY = 2,
        }
    }
    /** Directional light from a distance, as from the Sun.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_directionallight3d.html  
     */
    class DirectionalLight3D extends Light3D {
        constructor(identifier?: any)
        /** The light's shadow rendering algorithm. See [enum ShadowMode]. */
        get directional_shadow_mode(): int64
        set directional_shadow_mode(value: int64)
        
        /** The distance from camera to shadow split 1. Relative to [member directional_shadow_max_distance]. Only used when [member directional_shadow_mode] is [constant SHADOW_PARALLEL_2_SPLITS] or [constant SHADOW_PARALLEL_4_SPLITS]. */
        get directional_shadow_split_1(): float64
        set directional_shadow_split_1(value: float64)
        
        /** The distance from shadow split 1 to split 2. Relative to [member directional_shadow_max_distance]. Only used when [member directional_shadow_mode] is [constant SHADOW_PARALLEL_4_SPLITS]. */
        get directional_shadow_split_2(): float64
        set directional_shadow_split_2(value: float64)
        
        /** The distance from shadow split 2 to split 3. Relative to [member directional_shadow_max_distance]. Only used when [member directional_shadow_mode] is [constant SHADOW_PARALLEL_4_SPLITS]. */
        get directional_shadow_split_3(): float64
        set directional_shadow_split_3(value: float64)
        
        /** If `true`, shadow detail is sacrificed in exchange for smoother transitions between splits. Enabling shadow blend splitting also has a moderate performance cost. This is ignored when [member directional_shadow_mode] is [constant SHADOW_ORTHOGONAL]. */
        get directional_shadow_blend_splits(): boolean
        set directional_shadow_blend_splits(value: boolean)
        
        /** Proportion of [member directional_shadow_max_distance] at which point the shadow starts to fade. At [member directional_shadow_max_distance], the shadow will disappear. The default value is a balance between smooth fading and distant shadow visibility. If the camera moves fast and the [member directional_shadow_max_distance] is low, consider lowering [member directional_shadow_fade_start] below `0.8` to make shadow transitions less noticeable. On the other hand, if you tuned [member directional_shadow_max_distance] to cover the entire scene, you can set [member directional_shadow_fade_start] to `1.0` to prevent the shadow from fading in the distance (it will suddenly cut off instead). */
        get directional_shadow_fade_start(): float64
        set directional_shadow_fade_start(value: float64)
        
        /** The maximum distance for shadow splits. Increasing this value will make directional shadows visible from further away, at the cost of lower overall shadow detail and performance (since more objects need to be included in the directional shadow rendering). */
        get directional_shadow_max_distance(): float64
        set directional_shadow_max_distance(value: float64)
        
        /** Sets the size of the directional shadow pancake. The pancake offsets the start of the shadow's camera frustum to provide a higher effective depth resolution for the shadow. However, a high pancake size can cause artifacts in the shadows of large objects that are close to the edge of the frustum. Reducing the pancake size can help. Setting the size to `0` turns off the pancaking effect. */
        get directional_shadow_pancake_size(): float64
        set directional_shadow_pancake_size(value: float64)
        
        /** Set whether this [DirectionalLight3D] is visible in the sky, in the scene, or both in the sky and in the scene. See [enum SkyMode] for options. */
        get sky_mode(): int64
        set sky_mode(value: int64)
    }
    class DirectoryCreateDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly dir_created: Signal1<string>
    }
    class DockContextPopup extends PopupPanel {
        constructor(identifier?: any)
    }
    class DockSplitContainer extends SplitContainer {
        constructor(identifier?: any)
    }
    class DynamicFontImportSettingsData extends RefCounted {
        constructor(identifier?: any)
    }
    class DynamicFontImportSettingsDialog extends ConfirmationDialog {
        constructor(identifier?: any)
    }
    namespace ENetConnection {
        enum CompressionMode {
            /** No compression. This uses the most bandwidth, but has the upside of requiring the fewest CPU resources. This option may also be used to make network debugging using tools like Wireshark easier. */
            COMPRESS_NONE = 0,
            
            /** ENet's built-in range encoding. Works well on small packets, but is not the most efficient algorithm on packets larger than 4 KB. */
            COMPRESS_RANGE_CODER = 1,
            
            /** [url=https://fastlz.org/]FastLZ[/url] compression. This option uses less CPU resources compared to [constant COMPRESS_ZLIB], at the expense of using more bandwidth. */
            COMPRESS_FASTLZ = 2,
            
            /** [url=https://www.zlib.net/]Zlib[/url] compression. This option uses less bandwidth compared to [constant COMPRESS_FASTLZ], at the expense of using more CPU resources. */
            COMPRESS_ZLIB = 3,
            
            /** [url=https://facebook.github.io/zstd/]Zstandard[/url] compression. Note that this algorithm is not very efficient on packets smaller than 4 KB. Therefore, it's recommended to use other compression algorithms in most cases. */
            COMPRESS_ZSTD = 4,
        }
        enum EventType {
            /** An error occurred during [method service]. You will likely need to [method destroy] the host and recreate it. */
            EVENT_ERROR = -1,
            
            /** No event occurred within the specified time limit. */
            EVENT_NONE = 0,
            
            /** A connection request initiated by enet_host_connect has completed. The array will contain the peer which successfully connected. */
            EVENT_CONNECT = 1,
            
            /** A peer has disconnected. This event is generated on a successful completion of a disconnect initiated by [method ENetPacketPeer.peer_disconnect], if a peer has timed out, or if a connection request initialized by [method connect_to_host] has timed out. The array will contain the peer which disconnected. The data field contains user supplied data describing the disconnection, or 0, if none is available. */
            EVENT_DISCONNECT = 2,
            
            /** A packet has been received from a peer. The array will contain the peer which sent the packet and the channel number upon which the packet was received. The received packet will be queued to the associated [ENetPacketPeer]. */
            EVENT_RECEIVE = 3,
        }
        enum HostStatistic {
            /** Total data sent. */
            HOST_TOTAL_SENT_DATA = 0,
            
            /** Total UDP packets sent. */
            HOST_TOTAL_SENT_PACKETS = 1,
            
            /** Total data received. */
            HOST_TOTAL_RECEIVED_DATA = 2,
            
            /** Total UDP packets received. */
            HOST_TOTAL_RECEIVED_PACKETS = 3,
        }
    }
    /** A wrapper class for an [url=http://enet.bespin.org/group__host.html]ENetHost[/url].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_enetconnection.html  
     */
    class ENetConnection extends RefCounted {
        constructor(identifier?: any)
        /** Creates an ENetHost bound to the given [param bind_address] and [param bind_port] that allows up to [param max_peers] connected peers, each allocating up to [param max_channels] channels, optionally limiting bandwidth to [param in_bandwidth] and [param out_bandwidth] (if greater than zero).  
         *      
         *  **Note:** It is necessary to create a host in both client and server in order to establish a connection.  
         */
        create_host_bound(bind_address: string, bind_port: int64, max_peers: int64 = 32, max_channels: int64 = 0, in_bandwidth: int64 = 0, out_bandwidth: int64 = 0): GError
        
        /** Creates an ENetHost that allows up to [param max_peers] connected peers, each allocating up to [param max_channels] channels, optionally limiting bandwidth to [param in_bandwidth] and [param out_bandwidth] (if greater than zero).  
         *  This method binds a random available dynamic UDP port on the host machine at the  *unspecified*  address. Use [method create_host_bound] to specify the address and port.  
         *      
         *  **Note:** It is necessary to create a host in both client and server in order to establish a connection.  
         */
        create_host(max_peers: int64 = 32, max_channels: int64 = 0, in_bandwidth: int64 = 0, out_bandwidth: int64 = 0): GError
        
        /** Destroys the host and all resources associated with it. */
        destroy(): void
        
        /** Initiates a connection to a foreign [param address] using the specified [param port] and allocating the requested [param channels]. Optional [param data] can be passed during connection in the form of a 32 bit integer.  
         *      
         *  **Note:** You must call either [method create_host] or [method create_host_bound] on both ends before calling this method.  
         */
        connect_to_host(address: string, port: int64, channels: int64 = 0, data: int64 = 0): ENetPacketPeer
        
        /** Waits for events on this connection and shuttles packets between the host and its peers, with the given [param timeout] (in milliseconds). The returned [Array] will have 4 elements. An [enum EventType], the [ENetPacketPeer] which generated the event, the event associated data (if any), the event associated channel (if any). If the generated event is [constant EVENT_RECEIVE], the received packet will be queued to the associated [ENetPacketPeer].  
         *  Call this function regularly to handle connections, disconnections, and to receive new packets.  
         *      
         *  **Note:** This method must be called on both ends involved in the event (sending and receiving hosts).  
         */
        service(timeout: int64 = 0): GArray
        
        /** Sends any queued packets on the host specified to its designated peers. */
        flush(): void
        
        /** Adjusts the bandwidth limits of a host. */
        bandwidth_limit(in_bandwidth: int64 = 0, out_bandwidth: int64 = 0): void
        
        /** Limits the maximum allowed channels of future incoming connections. */
        channel_limit(limit: int64): void
        
        /** Queues a [param packet] to be sent to all peers associated with the host over the specified [param channel]. See [ENetPacketPeer] `FLAG_*` constants for available packet flags. */
        broadcast(channel: int64, packet: PackedByteArray | byte[] | ArrayBuffer, flags: int64): void
        
        /** Sets the compression method used for network packets. These have different tradeoffs of compression speed versus bandwidth, you may need to test which one works best for your use case if you use compression at all.  
         *      
         *  **Note:** Most games' network design involve sending many small packets frequently (smaller than 4 KB each). If in doubt, it is recommended to keep the default compression algorithm as it works best on these small packets.  
         *      
         *  **Note:** The compression mode must be set to the same value on both the server and all its clients. Clients will fail to connect if the compression mode set on the client differs from the one set on the server.  
         */
        compress(mode: ENetConnection.CompressionMode): void
        
        /** Configure this ENetHost to use the custom Godot extension allowing DTLS encryption for ENet servers. Call this right after [method create_host_bound] to have ENet expect peers to connect using DTLS. See [method TLSOptions.server]. */
        dtls_server_setup(server_options: TLSOptions): GError
        
        /** Configure this ENetHost to use the custom Godot extension allowing DTLS encryption for ENet clients. Call this before [method connect_to_host] to have ENet connect using DTLS validating the server certificate against [param hostname]. You can pass the optional [param client_options] parameter to customize the trusted certification authorities, or disable the common name verification. See [method TLSOptions.client] and [method TLSOptions.client_unsafe]. */
        dtls_client_setup(hostname: string, client_options: TLSOptions = undefined): GError
        
        /** Configures the DTLS server to automatically drop new connections.  
         *      
         *  **Note:** This method is only relevant after calling [method dtls_server_setup].  
         */
        refuse_new_connections(refuse: boolean): void
        
        /** Returns and resets host statistics. See [enum HostStatistic] for more info. */
        pop_statistic(statistic: ENetConnection.HostStatistic): float64
        
        /** Returns the maximum number of channels allowed for connected peers. */
        get_max_channels(): int64
        
        /** Returns the local port to which this peer is bound. */
        get_local_port(): int64
        
        /** Returns the list of peers associated with this host.  
         *      
         *  **Note:** This list might include some peers that are not fully connected or are still being disconnected.  
         */
        get_peers(): GArray
        
        /** Sends a [param packet] toward a destination from the address and port currently bound by this ENetConnection instance.  
         *  This is useful as it serves to establish entries in NAT routing tables on all devices between this bound instance and the public facing internet, allowing a prospective client's connection packets to be routed backward through the NAT device(s) between the public internet and this host.  
         *  This requires forward knowledge of a prospective client's address and communication port as seen by the public internet - after any NAT devices have handled their connection request. This information can be obtained by a [url=https://en.wikipedia.org/wiki/STUN]STUN[/url] service, and must be handed off to your host by an entity that is not the prospective client. This will never work for a client behind a Symmetric NAT due to the nature of the Symmetric NAT routing algorithm, as their IP and Port cannot be known beforehand.  
         */
        socket_send(destination_address: string, destination_port: int64, packet: PackedByteArray | byte[] | ArrayBuffer): void
    }
    /** A MultiplayerPeer implementation using the [url=http://enet.bespin.org/index.html]ENet[/url] library.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_enetmultiplayerpeer.html  
     */
    class ENetMultiplayerPeer extends MultiplayerPeer {
        constructor(identifier?: any)
        /** Create server that listens to connections via [param port]. The port needs to be an available, unused port between 0 and 65535. Note that ports below 1024 are privileged and may require elevated permissions depending on the platform. To change the interface the server listens on, use [method set_bind_ip]. The default IP is the wildcard `"*"`, which listens on all available interfaces. [param max_clients] is the maximum number of clients that are allowed at once, any number up to 4095 may be used, although the achievable number of simultaneous clients may be far lower and depends on the application. For additional details on the bandwidth parameters, see [method create_client]. Returns [constant OK] if a server was created, [constant ERR_ALREADY_IN_USE] if this ENetMultiplayerPeer instance already has an open connection (in which case you need to call [method MultiplayerPeer.close] first) or [constant ERR_CANT_CREATE] if the server could not be created. */
        create_server(port: int64, max_clients: int64 = 32, max_channels: int64 = 0, in_bandwidth: int64 = 0, out_bandwidth: int64 = 0): GError
        
        /** Create client that connects to a server at [param address] using specified [param port]. The given address needs to be either a fully qualified domain name (e.g. `"www.example.com"`) or an IP address in IPv4 or IPv6 format (e.g. `"192.168.1.1"`). The [param port] is the port the server is listening on. The [param channel_count] parameter can be used to specify the number of ENet channels allocated for the connection. The [param in_bandwidth] and [param out_bandwidth] parameters can be used to limit the incoming and outgoing bandwidth to the given number of bytes per second. The default of 0 means unlimited bandwidth. Note that ENet will strategically drop packets on specific sides of a connection between peers to ensure the peer's bandwidth is not overwhelmed. The bandwidth parameters also determine the window size of a connection which limits the amount of reliable packets that may be in transit at any given time. Returns [constant OK] if a client was created, [constant ERR_ALREADY_IN_USE] if this ENetMultiplayerPeer instance already has an open connection (in which case you need to call [method MultiplayerPeer.close] first) or [constant ERR_CANT_CREATE] if the client could not be created. If [param local_port] is specified, the client will also listen to the given port; this is useful for some NAT traversal techniques. */
        create_client(address: string, port: int64, channel_count: int64 = 0, in_bandwidth: int64 = 0, out_bandwidth: int64 = 0, local_port: int64 = 0): GError
        
        /** Initialize this [MultiplayerPeer] in mesh mode. The provided [param unique_id] will be used as the local peer network unique ID once assigned as the [member MultiplayerAPI.multiplayer_peer]. In the mesh configuration you will need to set up each new peer manually using [ENetConnection] before calling [method add_mesh_peer]. While this technique is more advanced, it allows for better control over the connection process (e.g. when dealing with NAT punch-through) and for better distribution of the network load (which would otherwise be more taxing on the server). */
        create_mesh(unique_id: int64): GError
        
        /** Add a new remote peer with the given [param peer_id] connected to the given [param host].  
         *      
         *  **Note:** The [param host] must have exactly one peer in the [constant ENetPacketPeer.STATE_CONNECTED] state.  
         */
        add_mesh_peer(peer_id: int64, host: ENetConnection): GError
        
        /** The IP used when creating a server. This is set to the wildcard `"*"` by default, which binds to all available interfaces. The given IP needs to be in IPv4 or IPv6 address format, for example: `"192.168.1.1"`. */
        set_bind_ip(ip: string): void
        
        /** Returns the [ENetPacketPeer] associated to the given [param id]. */
        get_peer(id: int64): ENetPacketPeer
        
        /** The underlying [ENetConnection] created after [method create_client] and [method create_server]. */
        get host(): ENetConnection
    }
    namespace ENetPacketPeer {
        enum PeerState {
            /** The peer is disconnected. */
            STATE_DISCONNECTED = 0,
            
            /** The peer is currently attempting to connect. */
            STATE_CONNECTING = 1,
            
            /** The peer has acknowledged the connection request. */
            STATE_ACKNOWLEDGING_CONNECT = 2,
            
            /** The peer is currently connecting. */
            STATE_CONNECTION_PENDING = 3,
            
            /** The peer has successfully connected, but is not ready to communicate with yet ([constant STATE_CONNECTED]). */
            STATE_CONNECTION_SUCCEEDED = 4,
            
            /** The peer is currently connected and ready to communicate with. */
            STATE_CONNECTED = 5,
            
            /** The peer is slated to disconnect after it has no more outgoing packets to send. */
            STATE_DISCONNECT_LATER = 6,
            
            /** The peer is currently disconnecting. */
            STATE_DISCONNECTING = 7,
            
            /** The peer has acknowledged the disconnection request. */
            STATE_ACKNOWLEDGING_DISCONNECT = 8,
            
            /** The peer has lost connection, but is not considered truly disconnected (as the peer didn't acknowledge the disconnection request). */
            STATE_ZOMBIE = 9,
        }
        enum PeerStatistic {
            /** Mean packet loss of reliable packets as a ratio with respect to the [constant PACKET_LOSS_SCALE]. */
            PEER_PACKET_LOSS = 0,
            
            /** Packet loss variance. */
            PEER_PACKET_LOSS_VARIANCE = 1,
            
            /** The time at which packet loss statistics were last updated (in milliseconds since the connection started). The interval for packet loss statistics updates is 10 seconds, and at least one packet must have been sent since the last statistics update. */
            PEER_PACKET_LOSS_EPOCH = 2,
            
            /** Mean packet round trip time for reliable packets. */
            PEER_ROUND_TRIP_TIME = 3,
            
            /** Variance of the mean round trip time. */
            PEER_ROUND_TRIP_TIME_VARIANCE = 4,
            
            /** Last recorded round trip time for a reliable packet. */
            PEER_LAST_ROUND_TRIP_TIME = 5,
            
            /** Variance of the last trip time recorded. */
            PEER_LAST_ROUND_TRIP_TIME_VARIANCE = 6,
            
            /** The peer's current throttle status. */
            PEER_PACKET_THROTTLE = 7,
            
            /** The maximum number of unreliable packets that should not be dropped. This value is always greater than or equal to `1`. The initial value is equal to [constant PACKET_THROTTLE_SCALE]. */
            PEER_PACKET_THROTTLE_LIMIT = 8,
            
            /** Internal value used to increment the packet throttle counter. The value is hardcoded to `7` and cannot be changed. You probably want to look at [constant PEER_PACKET_THROTTLE_ACCELERATION] instead. */
            PEER_PACKET_THROTTLE_COUNTER = 9,
            
            /** The time at which throttle statistics were last updated (in milliseconds since the connection started). The interval for throttle statistics updates is [constant PEER_PACKET_THROTTLE_INTERVAL]. */
            PEER_PACKET_THROTTLE_EPOCH = 10,
            
            /** The throttle's acceleration factor. Higher values will make ENet adapt to fluctuating network conditions faster, causing unrelaible packets to be sent  *more*  often. The default value is `2`. */
            PEER_PACKET_THROTTLE_ACCELERATION = 11,
            
            /** The throttle's deceleration factor. Higher values will make ENet adapt to fluctuating network conditions faster, causing unrelaible packets to be sent  *less*  often. The default value is `2`. */
            PEER_PACKET_THROTTLE_DECELERATION = 12,
            
            /** The interval over which the lowest mean round trip time should be measured for use by the throttle mechanism (in milliseconds). The default value is `5000`. */
            PEER_PACKET_THROTTLE_INTERVAL = 13,
        }
    }
    /** A wrapper class for an [url=http://enet.bespin.org/group__peer.html]ENetPeer[/url].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_enetpacketpeer.html  
     */
    class ENetPacketPeer extends PacketPeer {
        /** The reference scale for packet loss. See [method get_statistic] and [constant PEER_PACKET_LOSS]. */
        static readonly PACKET_LOSS_SCALE = 65536
        
        /** The reference value for throttle configuration. The default value is `32`. See [method throttle_configure]. */
        static readonly PACKET_THROTTLE_SCALE = 32
        
        /** Mark the packet to be sent as reliable. */
        static readonly FLAG_RELIABLE = 1
        
        /** Mark the packet to be sent unsequenced (unreliable). */
        static readonly FLAG_UNSEQUENCED = 2
        
        /** Mark the packet to be sent unreliable even if the packet is too big and needs fragmentation (increasing the chance of it being dropped). */
        static readonly FLAG_UNRELIABLE_FRAGMENT = 8
        constructor(identifier?: any)
        
        /** Request a disconnection from a peer. An [constant ENetConnection.EVENT_DISCONNECT] will be generated during [method ENetConnection.service] once the disconnection is complete. */
        peer_disconnect(data: int64 = 0): void
        
        /** Request a disconnection from a peer, but only after all queued outgoing packets are sent. An [constant ENetConnection.EVENT_DISCONNECT] will be generated during [method ENetConnection.service] once the disconnection is complete. */
        peer_disconnect_later(data: int64 = 0): void
        
        /** Force an immediate disconnection from a peer. No [constant ENetConnection.EVENT_DISCONNECT] will be generated. The foreign peer is not guaranteed to receive the disconnect notification, and is reset immediately upon return from this function. */
        peer_disconnect_now(data: int64 = 0): void
        
        /** Sends a ping request to a peer. ENet automatically pings all connected peers at regular intervals, however, this function may be called to ensure more frequent ping requests. */
        ping(): void
        
        /** Sets the [param ping_interval] in milliseconds at which pings will be sent to a peer. Pings are used both to monitor the liveness of the connection and also to dynamically adjust the throttle during periods of low traffic so that the throttle has reasonable responsiveness during traffic spikes. The default ping interval is `500` milliseconds. */
        ping_interval(ping_interval: int64): void
        
        /** Forcefully disconnects a peer. The foreign host represented by the peer is not notified of the disconnection and will timeout on its connection to the local host. */
        reset(): void
        
        /** Queues a [param packet] to be sent over the specified [param channel]. See `FLAG_*` constants for available packet flags. */
        send(channel: int64, packet: PackedByteArray | byte[] | ArrayBuffer, flags: int64): GError
        
        /** Configures throttle parameter for a peer.  
         *  Unreliable packets are dropped by ENet in response to the varying conditions of the Internet connection to the peer. The throttle represents a probability that an unreliable packet should not be dropped and thus sent by ENet to the peer. By measuring fluctuations in round trip times of reliable packets over the specified [param interval], ENet will either increase the probability by the amount specified in the [param acceleration] parameter, or decrease it by the amount specified in the [param deceleration] parameter (both are ratios to [constant PACKET_THROTTLE_SCALE]).  
         *  When the throttle has a value of [constant PACKET_THROTTLE_SCALE], no unreliable packets are dropped by ENet, and so 100% of all unreliable packets will be sent.  
         *  When the throttle has a value of `0`, all unreliable packets are dropped by ENet, and so 0% of all unreliable packets will be sent.  
         *  Intermediate values for the throttle represent intermediate probabilities between 0% and 100% of unreliable packets being sent. The bandwidth limits of the local and foreign hosts are taken into account to determine a sensible limit for the throttle probability above which it should not raise even in the best of conditions.  
         */
        throttle_configure(interval: int64, acceleration: int64, deceleration: int64): void
        
        /** Sets the timeout parameters for a peer. The timeout parameters control how and when a peer will timeout from a failure to acknowledge reliable traffic. Timeout values are expressed in milliseconds.  
         *  The [param timeout] is a factor that, multiplied by a value based on the average round trip time, will determine the timeout limit for a reliable packet. When that limit is reached, the timeout will be doubled, and the peer will be disconnected if that limit has reached [param timeout_min]. The [param timeout_max] parameter, on the other hand, defines a fixed timeout for which any packet must be acknowledged or the peer will be dropped.  
         */
        set_timeout(timeout: int64, timeout_min: int64, timeout_max: int64): void
        
        /** Returns the IP address of this peer. */
        get_remote_address(): string
        
        /** Returns the remote port of this peer. */
        get_remote_port(): int64
        
        /** Returns the requested [param statistic] for this peer. See [enum PeerStatistic]. */
        get_statistic(statistic: ENetPacketPeer.PeerStatistic): float64
        
        /** Returns the current peer state. See [enum PeerState]. */
        get_state(): ENetPacketPeer.PeerState
        
        /** Returns the number of channels allocated for communication with peer. */
        get_channels(): int64
        
        /** Returns `true` if the peer is currently active (i.e. the associated [ENetConnection] is still valid). */
        is_active(): boolean
    }
    class EditorAbout extends AcceptDialog {
        constructor(identifier?: any)
    }
    class EditorAssetLibrary extends PanelContainer {
        constructor(identifier?: any)
        readonly install_asset: Signal2<string, string>
    }
    class EditorAudioBus extends PanelContainer {
        constructor(identifier?: any)
        update_bus(): void
        update_send(): void
        readonly duplicate_request: Signal0
        readonly delete_request: Signal0
        readonly vol_reset_request: Signal0
        readonly drop_end_request: Signal0
        readonly dropped: Signal0
    }
    class EditorAudioBuses extends VBoxContainer {
        constructor(identifier?: any)
        _update_bus(_unnamed_arg0: int64): void
        _update_sends(): void
    }
    class EditorAudioMeterNotches extends Control {
        constructor(identifier?: any)
        add_notch(_unnamed_arg0: float64, _unnamed_arg1: float64, _unnamed_arg2: boolean): void
        _draw_audio_notches(): void
    }
    class EditorAudioStreamPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorAudioStreamTooltipPlugin extends EditorResourceTooltipPlugin {
        constructor(identifier?: any)
    }
    class EditorAutoloadSettings extends VBoxContainer {
        constructor(identifier?: any)
        update_autoload(): void
        autoload_add(_unnamed_arg0: string, _unnamed_arg1: string): boolean
        autoload_remove(_unnamed_arg0: string): void
        readonly autoload_changed: Signal0
    }
    class EditorBitmapPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorBottomPanel extends PanelContainer {
        constructor(identifier?: any)
    }
    namespace EditorBuildProfile {
        enum BuildOption {
            BUILD_OPTION_3D = 0,
            BUILD_OPTION_PHYSICS_2D = 1,
            BUILD_OPTION_PHYSICS_3D = 2,
            BUILD_OPTION_NAVIGATION = 3,
            BUILD_OPTION_XR = 4,
            BUILD_OPTION_RENDERING_DEVICE = 5,
            BUILD_OPTION_OPENGL = 6,
            BUILD_OPTION_VULKAN = 7,
            BUILD_OPTION_TEXT_SERVER_FALLBACK = 8,
            BUILD_OPTION_TEXT_SERVER_ADVANCED = 9,
            BUILD_OPTION_DYNAMIC_FONTS = 10,
            BUILD_OPTION_WOFF2_FONTS = 11,
            BUILD_OPTION_GRPAHITE_FONTS = 12,
            BUILD_OPTION_MSDFGEN = 13,
            BUILD_OPTION_MAX = 14,
        }
        enum BuildOptionCategory {
            BUILD_OPTION_CATEGORY_GENERAL = 0,
            BUILD_OPTION_CATEGORY_TEXT_SERVER = 1,
            BUILD_OPTION_CATEGORY_MAX = 2,
        }
    }
    class EditorBuildProfile extends RefCounted {
        constructor(identifier?: any)
        set_disable_class(class_name: StringName, disable: boolean): void
        is_class_disabled(class_name: StringName): boolean
        set_disable_build_option(build_option: EditorBuildProfile.BuildOption, disable: boolean): void
        is_build_option_disabled(build_option: EditorBuildProfile.BuildOption): boolean
        get_build_option_name(build_option: EditorBuildProfile.BuildOption): string
        save_to_file(path: string): GError
        load_from_file(path: string): GError
    }
    class EditorBuildProfileManager extends AcceptDialog {
        constructor(identifier?: any)
        _update_selected_profile(): void
    }
    /** Godot editor's command palette.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorcommandpalette.html  
     */
    class EditorCommandPalette extends ConfirmationDialog {
        constructor(identifier?: any)
        /** Adds a custom command to EditorCommandPalette.  
         *  - [param command_name]: [String] (Name of the **Command**. This is displayed to the user.)  
         *  - [param key_name]: [String] (Name of the key for a particular **Command**. This is used to uniquely identify the **Command**.)  
         *  - [param binded_callable]: [Callable] (Callable of the **Command**. This will be executed when the **Command** is selected.)  
         *  - [param shortcut_text]: [String] (Shortcut text of the **Command** if available.)  
         */
        add_command(command_name: string, key_name: string, binded_callable: Callable, shortcut_text: string = 'None'): void
        
        /** Removes the custom command from EditorCommandPalette.  
         *  - [param key_name]: [String] (Name of the key for a particular **Command**.)  
         */
        remove_command(key_name: string): void
    }
    class EditorDebuggerInspector extends EditorInspector {
        constructor(identifier?: any)
        readonly object_selected: Signal1<int64>
        readonly object_edited: Signal3<int64, string, any /*value*/>
        readonly object_property_updated: Signal2<int64, string>
    }
    class EditorDebuggerNode extends MarginContainer {
        constructor(identifier?: any)
        live_debug_create_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: string, _unnamed_arg2: string): void
        live_debug_instantiate_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: string, _unnamed_arg2: string): void
        live_debug_remove_node(_unnamed_arg0: NodePath | string): void
        live_debug_remove_and_keep_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: int64): void
        live_debug_restore_node(_unnamed_arg0: int64, _unnamed_arg1: NodePath | string, _unnamed_arg2: int64): void
        live_debug_duplicate_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: string): void
        live_debug_reparent_node(_unnamed_arg0: NodePath | string, _unnamed_arg1: NodePath | string, _unnamed_arg2: string, _unnamed_arg3: int64): void
        readonly goto_script_line: Signal0
        readonly set_execution: Signal2<any /*script*/, int64>
        readonly clear_execution: Signal1<any /*script*/>
        readonly breaked: Signal2<boolean, boolean>
        readonly breakpoint_toggled: Signal3<string, int64, boolean>
        readonly breakpoint_set_in_tree: Signal4<any /*script*/, int64, boolean, int64>
        readonly breakpoints_cleared_in_tree: Signal1<int64>
    }
    /** A base class to implement debugger plugins.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editordebuggerplugin.html  
     */
    class EditorDebuggerPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Override this method to be notified whenever a new [EditorDebuggerSession] is created (the session may be inactive during this stage). */
        /* gdvirtual */ _setup_session(session_id: int64): void
        
        /** Override this method to enable receiving messages from the debugger. If [param capture] is "my_message" then messages starting with "my_message:" will be passes to the [method _capture] method. */
        /* gdvirtual */ _has_capture(capture: string): boolean
        
        /** Override this method to process incoming messages. The [param session_id] is the ID of the [EditorDebuggerSession] that received the message (which you can retrieve via [method get_session]). */
        /* gdvirtual */ _capture(message: string, data: GArray, session_id: int64): boolean
        
        /** Override this method to be notified when a breakpoint line has been clicked in the debugger breakpoint panel. */
        /* gdvirtual */ _goto_script_line(script: Script, line: int64): void
        
        /** Override this method to be notified when all breakpoints are cleared in the editor. */
        /* gdvirtual */ _breakpoints_cleared_in_tree(): void
        
        /** Override this method to be notified when a breakpoint is set in the editor. */
        /* gdvirtual */ _breakpoint_set_in_tree(script: Script, line: int64, enabled: boolean): void
        
        /** Returns the [EditorDebuggerSession] with the given [param id]. */
        get_session(id: int64): EditorDebuggerSession
        
        /** Returns an array of [EditorDebuggerSession] currently available to this debugger plugin.  
         *      
         *  **Note:** Sessions in the array may be inactive, check their state via [method EditorDebuggerSession.is_active].  
         */
        get_sessions(): GArray
    }
    class EditorDebuggerRemoteObject extends Object {
        constructor(identifier?: any)
        get_title(): string
        get_variant(_unnamed_arg0: StringName): any
        clear(): void
        get_remote_object_id(): int64
        readonly value_edited: Signal3<int64, string, any /*value*/>
    }
    /** A class to interact with the editor debugger.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editordebuggersession.html  
     */
    class EditorDebuggerSession extends RefCounted {
        constructor(identifier?: any)
        /** Sends the given [param message] to the attached remote instance, optionally passing additionally [param data]. See [EngineDebugger] for how to retrieve those messages. */
        send_message(message: string, data: GArray = []): void
        
        /** Toggle the given [param profiler] on the attached remote instance, optionally passing additionally [param data]. See [EngineProfiler] for more details. */
        toggle_profiler(profiler: string, enable: boolean, data: GArray = []): void
        
        /** Returns `true` if the attached remote instance is currently in the debug loop. */
        is_breaked(): boolean
        
        /** Returns `true` if the attached remote instance can be debugged. */
        is_debuggable(): boolean
        
        /** Returns `true` if the debug session is currently attached to a remote instance. */
        is_active(): boolean
        
        /** Adds the given [param control] to the debug session UI in the debugger bottom panel. */
        add_session_tab(control: Control): void
        
        /** Removes the given [param control] from the debug session UI in the debugger bottom panel. */
        remove_session_tab(control: Control): void
        
        /** Enables or disables a specific breakpoint based on [param enabled], updating the Editor Breakpoint Panel accordingly. */
        set_breakpoint(path: string, line: int64, enabled: boolean): void
        
        /** Emitted when a remote instance is attached to this session (i.e. the session becomes active). */
        readonly started: Signal0
        
        /** Emitted when a remote instance is detached from this session (i.e. the session becomes inactive). */
        readonly stopped: Signal0
        
        /** Emitted when the attached remote instance enters a break state. If [param can_debug] is `true`, the remote instance will enter the debug loop. */
        readonly breaked: Signal1<boolean>
        
        /** Emitted when the attached remote instance exits a break state. */
        readonly continued: Signal0
    }
    class EditorDebuggerTree extends Tree {
        constructor(identifier?: any)
        readonly object_selected: Signal2<int64, int64>
        readonly save_node: Signal3<int64, string, int64>
        readonly open: Signal0
    }
    class EditorDirDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly copy_pressed: Signal1<string>
        readonly move_pressed: Signal1<string>
    }
    class EditorDockManager extends Object {
        constructor(identifier?: any)
    }
    class EditorExport extends Node {
        constructor(identifier?: any)
        readonly export_presets_updated: Signal0
        readonly export_presets_runnable_updated: Signal0
    }
    class EditorExportGDScript extends EditorExportPlugin {
        constructor(identifier?: any)
    }
    /** Identifies a supported export platform, and internally provides the functionality of exporting to that platform.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplatform.html  
     */
    class EditorExportPlatform extends RefCounted {
        constructor(identifier?: any)
        /** Returns the name of the export operating system handled by this [EditorExportPlatform] class, as a friendly string. Possible return values are `Windows`, `Linux`, `macOS`, `Android`, `iOS`, and `Web`. */
        get_os_name(): string
    }
    /** Exporter for Android.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplatformandroid.html  
     */
    class EditorExportPlatformAndroid extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Exporter for iOS.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplatformios.html  
     */
    class EditorExportPlatformIOS extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Exporter for Linux/BSD.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplatformlinuxbsd.html  
     */
    class EditorExportPlatformLinuxBSD extends EditorExportPlatformPC {
        constructor(identifier?: any)
    }
    /** Exporter for macOS.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplatformmacos.html  
     */
    class EditorExportPlatformMacOS extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Base class for the desktop platform exporter (Windows and Linux/BSD).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplatformpc.html  
     */
    class EditorExportPlatformPC extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Exporter for the Web.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplatformweb.html  
     */
    class EditorExportPlatformWeb extends EditorExportPlatform {
        constructor(identifier?: any)
    }
    /** Exporter for Windows.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplatformwindows.html  
     */
    class EditorExportPlatformWindows extends EditorExportPlatformPC {
        constructor(identifier?: any)
    }
    /** A script that is executed when exporting the project.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorexportplugin.html  
     */
    class EditorExportPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Virtual method to be overridden by the user. Called for each exported file before [method _customize_resource] and [method _customize_scene]. The arguments can be used to identify the file. [param path] is the path of the file, [param type] is the [Resource] represented by the file (e.g. [PackedScene]), and [param features] is the list of features for the export.  
         *  Calling [method skip] inside this callback will make the file not included in the export.  
         */
        /* gdvirtual */ _export_file(path: string, type: string, features: PackedStringArray | string[]): void
        
        /** Virtual method to be overridden by the user. It is called when the export starts and provides all information about the export. [param features] is the list of features for the export, [param is_debug] is `true` for debug builds, [param path] is the target path for the exported project. [param flags] is only used when running a runnable profile, e.g. when using native run on Android. */
        /* gdvirtual */ _export_begin(features: PackedStringArray | string[], is_debug: boolean, path: string, flags: int64): void
        
        /** Virtual method to be overridden by the user. Called when the export is finished. */
        /* gdvirtual */ _export_end(): void
        
        /** Return `true` if this plugin will customize resources based on the platform and features used.  
         *  When enabled, [method _get_customization_configuration_hash] and [method _customize_resource] will be called and must be implemented.  
         */
        /* gdvirtual */ _begin_customize_resources(platform: EditorExportPlatform, features: PackedStringArray | string[]): boolean
        
        /** Customize a resource. If changes are made to it, return the same or a new resource. Otherwise, return `null`.  
         *  The  *path*  argument is only used when customizing an actual file, otherwise this means that this resource is part of another one and it will be empty.  
         *  Implementing this method is required if [method _begin_customize_resources] returns `true`.  
         */
        /* gdvirtual */ _customize_resource(resource: Resource, path: string): Resource
        
        /** Return `true` if this plugin will customize scenes based on the platform and features used.  
         *  When enabled, [method _get_customization_configuration_hash] and [method _customize_scene] will be called and must be implemented.  
         */
        /* gdvirtual */ _begin_customize_scenes(platform: EditorExportPlatform, features: PackedStringArray | string[]): boolean
        
        /** Customize a scene. If changes are made to it, return the same or a new scene. Otherwise, return `null`. If a new scene is returned, it is up to you to dispose of the old one.  
         *  Implementing this method is required if [method _begin_customize_scenes] returns `true`.  
         */
        /* gdvirtual */ _customize_scene(scene: Node, path: string): Node
        
        /** Return a hash based on the configuration passed (for both scenes and resources). This helps keep separate caches for separate export configurations.  
         *  Implementing this method is required if [method _begin_customize_resources] returns `true`.  
         */
        /* gdvirtual */ _get_customization_configuration_hash(): int64
        
        /** This is called when the customization process for scenes ends. */
        /* gdvirtual */ _end_customize_scenes(): void
        
        /** This is called when the customization process for resources ends. */
        /* gdvirtual */ _end_customize_resources(): void
        
        /** Return a list of export options that can be configured for this export plugin.  
         *  Each element in the return value is a [Dictionary] with the following keys:  
         *  - `option`: A dictionary with the structure documented by [method Object.get_property_list], but all keys are optional.  
         *  - `default_value`: The default value for this option.  
         *  - `update_visibility`: An optional boolean value. If set to `true`, the preset will emit [signal Object.property_list_changed] when the option is changed.  
         */
        /* gdvirtual */ _get_export_options(platform: EditorExportPlatform): GArray
        
        /** Return a [Dictionary] of override values for export options, that will be used instead of user-provided values. Overridden options will be hidden from the user interface.  
         *    
         */
        /* gdvirtual */ _get_export_options_overrides(platform: EditorExportPlatform): GDictionary
        
        /** Return `true`, if the result of [method _get_export_options] has changed and the export options of preset corresponding to [param platform] should be updated. */
        /* gdvirtual */ _should_update_export_options(platform: EditorExportPlatform): boolean
        
        /** Check the requirements for the given [param option] and return a non-empty warning string if they are not met.  
         *      
         *  **Note:** Use [method get_option] to check the value of the export options.  
         */
        /* gdvirtual */ _get_export_option_warning(platform: EditorExportPlatform, option: string): string
        
        /** Return a [PackedStringArray] of additional features this preset, for the given [param platform], should have. */
        /* gdvirtual */ _get_export_features(platform: EditorExportPlatform, debug: boolean): PackedStringArray
        
        /** Return the name identifier of this plugin (for future identification by the exporter). The plugins are sorted by name before exporting.  
         *  Implementing this method is required.  
         */
        /* gdvirtual */ _get_name(): string
        
        /** Return `true` if the plugin supports the given [param platform]. */
        /* gdvirtual */ _supports_platform(platform: EditorExportPlatform): boolean
        
        /** Virtual method to be overridden by the user. This is called to retrieve the set of Android dependencies provided by this plugin. Each returned Android dependency should have the format of an Android remote binary dependency: `org.godot.example:my-plugin:0.0.0`  
         *  For more information see [url=https://developer.android.com/build/dependencies?agpversion=4.1#dependency-types]Android documentation on dependencies[/url].  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_dependencies(platform: EditorExportPlatform, debug: boolean): PackedStringArray
        
        /** Virtual method to be overridden by the user. This is called to retrieve the URLs of Maven repositories for the set of Android dependencies provided by this plugin.  
         *  For more information see [url=https://docs.gradle.org/current/userguide/dependency_management.html#sec:maven_repo]Gradle documentation on dependency management[/url].  
         *      
         *  **Note:** Google's Maven repo and the Maven Central repo are already included by default.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_dependencies_maven_repos(platform: EditorExportPlatform, debug: boolean): PackedStringArray
        
        /** Virtual method to be overridden by the user. This is called to retrieve the local paths of the Android libraries archive (AAR) files provided by this plugin.  
         *      
         *  **Note:** Relative paths **must** be relative to Godot's `res://addons/` directory. For example, an AAR file located under `res://addons/hello_world_plugin/HelloWorld.release.aar` can be returned as an absolute path using `res://addons/hello_world_plugin/HelloWorld.release.aar` or a relative path using `hello_world_plugin/HelloWorld.release.aar`.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_libraries(platform: EditorExportPlatform, debug: boolean): PackedStringArray
        
        /** Virtual method to be overridden by the user. This is used at export time to update the contents of the `activity` element in the generated Android manifest.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_manifest_activity_element_contents(platform: EditorExportPlatform, debug: boolean): string
        
        /** Virtual method to be overridden by the user. This is used at export time to update the contents of the `application` element in the generated Android manifest.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_manifest_application_element_contents(platform: EditorExportPlatform, debug: boolean): string
        
        /** Virtual method to be overridden by the user. This is used at export time to update the contents of the `manifest` element in the generated Android manifest.  
         *      
         *  **Note:** Only supported on Android and requires [member EditorExportPlatformAndroid.gradle_build/use_gradle_build] to be enabled.  
         */
        /* gdvirtual */ _get_android_manifest_element_contents(platform: EditorExportPlatform, debug: boolean): string
        
        /** Adds a shared object or a directory containing only shared objects with the given [param tags] and destination [param path].  
         *      
         *  **Note:** In case of macOS exports, those shared objects will be added to `Frameworks` directory of app bundle.  
         *  In case of a directory code-sign will error if you place non code object in directory.  
         */
        add_shared_object(path: string, tags: PackedStringArray | string[], target: string): void
        
        /** Adds a static lib from the given [param path] to the iOS project. */
        add_ios_project_static_lib(path: string): void
        
        /** Adds a custom file to be exported. [param path] is the virtual path that can be used to load the file, [param file] is the binary data of the file.  
         *  When called inside [method _export_file] and [param remap] is `true`, the current file will not be exported, but instead remapped to this custom file. [param remap] is ignored when called in other places.  
         *  [param file] will not be imported, so consider using [method _customize_resource] to remap imported resources.  
         */
        add_file(path: string, file: PackedByteArray | byte[] | ArrayBuffer, remap: boolean): void
        
        /** Adds a static library (*.a) or dynamic library (*.dylib, *.framework) to Linking Phase in iOS's Xcode project. */
        add_ios_framework(path: string): void
        
        /** Adds a dynamic library (*.dylib, *.framework) to Linking Phase in iOS's Xcode project and embeds it into resulting binary.  
         *      
         *  **Note:** For static libraries (*.a) works in same way as [method add_ios_framework].  
         *      
         *  **Note:** This method should not be used for System libraries as they are already present on the device.  
         */
        add_ios_embedded_framework(path: string): void
        
        /** Adds content for iOS Property List files. */
        add_ios_plist_content(plist_content: string): void
        
        /** Adds linker flags for the iOS export. */
        add_ios_linker_flags(flags: string): void
        
        /** Adds an iOS bundle file from the given [param path] to the exported project. */
        add_ios_bundle_file(path: string): void
        
        /** Adds a C++ code to the iOS export. The final code is created from the code appended by each active export plugin. */
        add_ios_cpp_code(code: string): void
        
        /** Adds file or directory matching [param path] to `PlugIns` directory of macOS app bundle.  
         *      
         *  **Note:** This is useful only for macOS exports.  
         */
        add_macos_plugin_file(path: string): void
        
        /** To be called inside [method _export_file]. Skips the current file, so it's not included in the export. */
        skip(): void
        
        /** Returns the current value of an export option supplied by [method _get_export_options]. */
        get_option(name: StringName): any
    }
    namespace EditorFeatureProfile {
        enum Feature {
            /** The 3D editor. If this feature is disabled, the 3D editor won't display but 3D nodes will still display in the Create New Node dialog. */
            FEATURE_3D = 0,
            
            /** The Script tab, which contains the script editor and class reference browser. If this feature is disabled, the Script tab won't display. */
            FEATURE_SCRIPT = 1,
            
            /** The AssetLib tab. If this feature is disabled, the AssetLib tab won't display. */
            FEATURE_ASSET_LIB = 2,
            
            /** Scene tree editing. If this feature is disabled, the Scene tree dock will still be visible but will be read-only. */
            FEATURE_SCENE_TREE = 3,
            
            /** The Node dock. If this feature is disabled, signals and groups won't be visible and modifiable from the editor. */
            FEATURE_NODE_DOCK = 4,
            
            /** The FileSystem dock. If this feature is disabled, the FileSystem dock won't be visible. */
            FEATURE_FILESYSTEM_DOCK = 5,
            
            /** The Import dock. If this feature is disabled, the Import dock won't be visible. */
            FEATURE_IMPORT_DOCK = 6,
            
            /** The History dock. If this feature is disabled, the History dock won't be visible. */
            FEATURE_HISTORY_DOCK = 7,
            
            /** Represents the size of the [enum Feature] enum. */
            FEATURE_MAX = 8,
        }
    }
    /** An editor feature profile which can be used to disable specific features.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorfeatureprofile.html  
     */
    class EditorFeatureProfile extends RefCounted {
        constructor(identifier?: any)
        /** If [param disable] is `true`, disables the class specified by [param class_name]. When disabled, the class won't appear in the Create New Node dialog. */
        set_disable_class(class_name: StringName, disable: boolean): void
        
        /** Returns `true` if the class specified by [param class_name] is disabled. When disabled, the class won't appear in the Create New Node dialog. */
        is_class_disabled(class_name: StringName): boolean
        
        /** If [param disable] is `true`, disables editing for the class specified by [param class_name]. When disabled, the class will still appear in the Create New Node dialog but the Inspector will be read-only when selecting a node that extends the class. */
        set_disable_class_editor(class_name: StringName, disable: boolean): void
        
        /** Returns `true` if editing for the class specified by [param class_name] is disabled. When disabled, the class will still appear in the Create New Node dialog but the Inspector will be read-only when selecting a node that extends the class. */
        is_class_editor_disabled(class_name: StringName): boolean
        
        /** If [param disable] is `true`, disables editing for [param property] in the class specified by [param class_name]. When a property is disabled, it won't appear in the Inspector when selecting a node that extends the class specified by [param class_name]. */
        set_disable_class_property(class_name: StringName, property: StringName, disable: boolean): void
        
        /** Returns `true` if [param property] is disabled in the class specified by [param class_name]. When a property is disabled, it won't appear in the Inspector when selecting a node that extends the class specified by [param class_name]. */
        is_class_property_disabled(class_name: StringName, property: StringName): boolean
        
        /** If [param disable] is `true`, disables the editor feature specified in [param feature]. When a feature is disabled, it will disappear from the editor entirely. */
        set_disable_feature(feature: EditorFeatureProfile.Feature, disable: boolean): void
        
        /** Returns `true` if the [param feature] is disabled. When a feature is disabled, it will disappear from the editor entirely. */
        is_feature_disabled(feature: EditorFeatureProfile.Feature): boolean
        
        /** Returns the specified [param feature]'s human-readable name. */
        get_feature_name(feature: EditorFeatureProfile.Feature): string
        
        /** Saves the editor feature profile to a file in JSON format. It can then be imported using the feature profile manager's **Import** button or the [method load_from_file] method.  
         *      
         *  **Note:** Feature profiles created via the user interface are saved in the `feature_profiles` directory, as a file with the `.profile` extension. The editor configuration folder can be found by using [method EditorPaths.get_config_dir].  
         */
        save_to_file(path: string): GError
        
        /** Loads an editor feature profile from a file. The file must follow the JSON format obtained by using the feature profile manager's **Export** button or the [method save_to_file] method.  
         *      
         *  **Note:** Feature profiles created via the user interface are loaded from the `feature_profiles` directory, as a file with the `.profile` extension. The editor configuration folder can be found by using [method EditorPaths.get_config_dir].  
         */
        load_from_file(path: string): GError
    }
    class EditorFeatureProfileManager extends AcceptDialog {
        constructor(identifier?: any)
        readonly current_feature_profile_changed: Signal0
    }
    namespace EditorFileDialog {
        enum FileMode {
            /** The [EditorFileDialog] can select only one file. Accepting the window will open the file. */
            FILE_MODE_OPEN_FILE = 0,
            
            /** The [EditorFileDialog] can select multiple files. Accepting the window will open all files. */
            FILE_MODE_OPEN_FILES = 1,
            
            /** The [EditorFileDialog] can select only one directory. Accepting the window will open the directory. */
            FILE_MODE_OPEN_DIR = 2,
            
            /** The [EditorFileDialog] can select a file or directory. Accepting the window will open it. */
            FILE_MODE_OPEN_ANY = 3,
            
            /** The [EditorFileDialog] can select only one file. Accepting the window will save the file. */
            FILE_MODE_SAVE_FILE = 4,
        }
        enum Access {
            /** The [EditorFileDialog] can only view `res://` directory contents. */
            ACCESS_RESOURCES = 0,
            
            /** The [EditorFileDialog] can only view `user://` directory contents. */
            ACCESS_USERDATA = 1,
            
            /** The [EditorFileDialog] can view the entire local file system. */
            ACCESS_FILESYSTEM = 2,
        }
        enum DisplayMode {
            /** The [EditorFileDialog] displays resources as thumbnails. */
            DISPLAY_THUMBNAILS = 0,
            
            /** The [EditorFileDialog] displays resources as a list of filenames. */
            DISPLAY_LIST = 1,
        }
    }
    /** A modified version of [FileDialog] used by the editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorfiledialog.html  
     */
    class EditorFileDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        _cancel_pressed(): void
        
        /** Removes all filters except for "All Files (*)". */
        clear_filters(): void
        
        /** Adds a comma-delimited file name [param filter] option to the [EditorFileDialog] with an optional [param description], which restricts what files can be picked.  
         *  A [param filter] should be of the form `"filename.extension"`, where filename and extension can be `*` to match any string. Filters starting with `.` (i.e. empty filenames) are not allowed.  
         *  For example, a [param filter] of `"*.tscn, *.scn"` and a [param description] of `"Scenes"` results in filter text "Scenes (*.tscn, *.scn)".  
         */
        add_filter(filter: string, description: string = ''): void
        
        /** Returns the name of the [OptionButton] or [CheckBox] with index [param option]. */
        get_option_name(option: int64): string
        
        /** Returns an array of values of the [OptionButton] with index [param option]. */
        get_option_values(option: int64): PackedStringArray
        
        /** Returns the default value index of the [OptionButton] or [CheckBox] with index [param option]. */
        get_option_default(option: int64): int64
        
        /** Sets the name of the [OptionButton] or [CheckBox] with index [param option]. */
        set_option_name(option: int64, name: string): void
        
        /** Sets the option values of the [OptionButton] with index [param option]. */
        set_option_values(option: int64, values: PackedStringArray | string[]): void
        
        /** Sets the default value index of the [OptionButton] or [CheckBox] with index [param option]. */
        set_option_default(option: int64, default_value_index: int64): void
        
        /** Adds an additional [OptionButton] to the file dialog. If [param values] is empty, a [CheckBox] is added instead.  
         *  [param default_value_index] should be an index of the value in the [param values]. If [param values] is empty it should be either `1` (checked), or `0` (unchecked).  
         */
        add_option(name: string, values: PackedStringArray | string[], default_value_index: int64): void
        
        /** Returns a [Dictionary] with the selected values of the additional [OptionButton]s and/or [CheckBox]es. [Dictionary] keys are names and values are selected value indices. */
        get_selected_options(): GDictionary
        
        /** Returns the [VBoxContainer] used to display the file system.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_vbox(): VBoxContainer
        
        /** Returns the LineEdit for the selected file.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_line_edit(): LineEdit
        _thumbnail_done(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: any): void
        _thumbnail_result(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: any): void
        
        /** Adds the given [param menu] to the side of the file dialog with the given [param title] text on top. Only one side menu is allowed. */
        add_side_menu(menu: Control, title: string = ''): void
        
        /** Shows the [EditorFileDialog] at the default size and position for file dialogs in the editor, and selects the file name if there is a current file. */
        popup_file_dialog(): void
        
        /** Notify the [EditorFileDialog] that its view of the data is no longer accurate. Updates the view contents on next view update. */
        invalidate(): void
        
        /** The location from which the user may select a file, including `res://`, `user://`, and the local file system. */
        get access(): int64
        set access(value: int64)
        
        /** The view format in which the [EditorFileDialog] displays resources to the user. */
        get display_mode(): int64
        set display_mode(value: int64)
        
        /** The dialog's open or save mode, which affects the selection behavior. See [enum FileMode]. */
        get file_mode(): int64
        set file_mode(value: int64)
        
        /** The currently occupied directory. */
        get current_dir(): string
        set current_dir(value: string)
        
        /** The currently selected file. */
        get current_file(): string
        set current_file(value: string)
        
        /** The file system path in the address bar. */
        get current_path(): string
        set current_path(value: string)
        
        /** The available file type filters. For example, this shows only `.png` and `.gd` files: `set_filters(PackedStringArray(["*.png ; PNG Images","*.gd ; GDScript Files"]))`. Multiple file types can also be specified in a single filter. `"*.png, *.jpg, *.jpeg ; Supported Images"` will show both PNG and JPEG files when selected. */
        get filters(): PackedStringArray
        set filters(value: PackedStringArray | string[])
        
        /** The number of additional [OptionButton]s and [CheckBox]es in the dialog. */
        get option_count(): any /*Options,option_*/
        set option_count(value: any /*Options,option_*/)
        
        /** If `true`, hidden files and directories will be visible in the [EditorFileDialog]. This property is synchronized with [member EditorSettings.filesystem/file_dialog/show_hidden_files]. */
        get show_hidden_files(): boolean
        set show_hidden_files(value: boolean)
        
        /** If `true`, the [EditorFileDialog] will not warn the user before overwriting files. */
        get disable_overwrite_warning(): boolean
        set disable_overwrite_warning(value: boolean)
        
        /** Emitted when a file is selected. */
        readonly file_selected: Signal1<string>
        
        /** Emitted when multiple files are selected. */
        readonly files_selected: Signal1<PackedStringArray | string[]>
        
        /** Emitted when a directory is selected. */
        readonly dir_selected: Signal1<string>
    }
    class EditorFileServer extends Object {
        constructor(identifier?: any)
    }
    /** Resource filesystem, as the editor sees it.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorfilesystem.html  
     */
    class EditorFileSystem extends Node {
        constructor(identifier?: any)
        /** Gets the root directory object. */
        get_filesystem(): EditorFileSystemDirectory
        
        /** Returns `true` if the filesystem is being scanned. */
        is_scanning(): boolean
        
        /** Returns the scan progress for 0 to 1 if the FS is being scanned. */
        get_scanning_progress(): float64
        
        /** Scan the filesystem for changes. */
        scan(): void
        
        /** Check if the source of any imported resource changed. */
        scan_sources(): void
        
        /** Add a file in an existing directory, or schedule file information to be updated on editor restart. Can be used to update text files saved by an external program.  
         *  This will not import the file. To reimport, call [method reimport_files] or [method scan] methods.  
         */
        update_file(path: string): void
        
        /** Returns a view into the filesystem at [param path]. */
        get_filesystem_path(path: string): EditorFileSystemDirectory
        
        /** Returns the resource type of the file, given the full path. This returns a string such as `"Resource"` or `"GDScript"`,  *not*  a file extension such as `".gd"`. */
        get_file_type(path: string): string
        
        /** Reimports a set of files. Call this if these files or their `.import` files were directly edited by script or an external program.  
         *  If the file type changed or the file was newly created, use [method update_file] or [method scan].  
         *      
         *  **Note:** This function blocks until the import is finished. However, the main loop iteration, including timers and [method Node._process], will occur during the import process due to progress bar updates. Avoid calls to [method reimport_files] or [method scan] while an import is in progress.  
         */
        reimport_files(files: PackedStringArray | string[]): void
        
        /** Emitted if the filesystem changed. */
        readonly filesystem_changed: Signal0
        
        /** Emitted when the list of global script classes gets updated. */
        readonly script_classes_updated: Signal0
        
        /** Emitted if the source of any imported file changed. */
        readonly sources_changed: Signal1<boolean>
        
        /** Emitted before a resource is reimported. */
        readonly resources_reimporting: Signal1<PackedStringArray | string[]>
        
        /** Emitted if a resource is reimported. */
        readonly resources_reimported: Signal1<PackedStringArray | string[]>
        
        /** Emitted if at least one resource is reloaded when the filesystem is scanned. */
        readonly resources_reload: Signal1<PackedStringArray | string[]>
    }
    /** A directory for the resource filesystem.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorfilesystemdirectory.html  
     */
    class EditorFileSystemDirectory extends Object {
        constructor(identifier?: any)
        /** Returns the number of subdirectories in this directory. */
        get_subdir_count(): int64
        
        /** Returns the subdirectory at index [param idx]. */
        get_subdir(idx: int64): EditorFileSystemDirectory
        
        /** Returns the number of files in this directory. */
        get_file_count(): int64
        
        /** Returns the name of the file at index [param idx]. */
        get_file(idx: int64): string
        
        /** Returns the path to the file at index [param idx]. */
        get_file_path(idx: int64): string
        
        /** Returns the resource type of the file at index [param idx]. This returns a string such as `"Resource"` or `"GDScript"`,  *not*  a file extension such as `".gd"`. */
        get_file_type(idx: int64): StringName
        
        /** Returns the name of the script class defined in the file at index [param idx]. If the file doesn't define a script class using the `class_name` syntax, this will return an empty string. */
        get_file_script_class_name(idx: int64): string
        
        /** Returns the base class of the script class defined in the file at index [param idx]. If the file doesn't define a script class using the `class_name` syntax, this will return an empty string. */
        get_file_script_class_extends(idx: int64): string
        
        /** Returns `true` if the file at index [param idx] imported properly. */
        get_file_import_is_valid(idx: int64): boolean
        
        /** Returns the name of this directory. */
        get_name(): string
        
        /** Returns the path to this directory. */
        get_path(): string
        
        /** Returns the parent directory for this directory or `null` if called on a directory at `res://` or `user://`. */
        get_parent(): EditorFileSystemDirectory
        
        /** Returns the index of the file with name [param name] or `-1` if not found. */
        find_file_index(name: string): int64
        
        /** Returns the index of the directory with name [param name] or `-1` if not found. */
        find_dir_index(name: string): int64
    }
    /** Used to query and configure import format support.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorfilesystemimportformatsupportquery.html  
     */
    class EditorFileSystemImportFormatSupportQuery extends RefCounted {
        constructor(identifier?: any)
        /** Return whether this importer is active. */
        /* gdvirtual */ _is_active(): boolean
        
        /** Return the file extensions supported. */
        /* gdvirtual */ _get_file_extensions(): PackedStringArray
        
        /** Query support. Return false if import must not continue. */
        /* gdvirtual */ _query(): boolean
    }
    class EditorFileSystemImportFormatSupportQueryBlend extends EditorFileSystemImportFormatSupportQuery {
        constructor(identifier?: any)
    }
    class EditorFontPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorGradientPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorHelpBit extends VBoxContainer {
        constructor(identifier?: any)
        readonly request_hide: Signal0
    }
    class EditorHelpSearch extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly go_to_help: Signal0
    }
    class EditorImagePreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorImportBlendRunner extends Node {
        constructor(identifier?: any)
    }
    /** Registers a custom resource importer in the editor. Use the class to parse any file and import it as a new resource type.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorimportplugin.html  
     */
    class EditorImportPlugin extends ResourceImporter {
        constructor(identifier?: any)
        /** Gets the unique name of the importer. */
        /* gdvirtual */ _get_importer_name(): string
        
        /** Gets the name to display in the import window. You should choose this name as a continuation to "Import as", e.g. "Import as Special Mesh". */
        /* gdvirtual */ _get_visible_name(): string
        
        /** Gets the number of initial presets defined by the plugin. Use [method _get_import_options] to get the default options for the preset and [method _get_preset_name] to get the name of the preset. */
        /* gdvirtual */ _get_preset_count(): int64
        
        /** Gets the name of the options preset at this index. */
        /* gdvirtual */ _get_preset_name(preset_index: int64): string
        
        /** Gets the list of file extensions to associate with this loader (case-insensitive). e.g. `["obj"]`. */
        /* gdvirtual */ _get_recognized_extensions(): PackedStringArray
        
        /** Gets the options and default values for the preset at this index. Returns an Array of Dictionaries with the following keys: `name`, `default_value`, `property_hint` (optional), `hint_string` (optional), `usage` (optional). */
        /* gdvirtual */ _get_import_options(path: string, preset_index: int64): GArray
        
        /** Gets the extension used to save this resource in the `.godot/imported` directory (see [member ProjectSettings.application/config/use_hidden_project_data_directory]). */
        /* gdvirtual */ _get_save_extension(): string
        
        /** Gets the Godot resource type associated with this loader. e.g. `"Mesh"` or `"Animation"`. */
        /* gdvirtual */ _get_resource_type(): string
        
        /** Gets the priority of this plugin for the recognized extension. Higher priority plugins will be preferred. The default priority is `1.0`. */
        /* gdvirtual */ _get_priority(): float64
        
        /** Gets the order of this importer to be run when importing resources. Importers with  *lower*  import orders will be called first, and higher values will be called later. Use this to ensure the importer runs after the dependencies are already imported. The default import order is `0` unless overridden by a specific importer. See [enum ResourceImporter.ImportOrder] for some predefined values. */
        /* gdvirtual */ _get_import_order(): int64
        
        /** This method can be overridden to hide specific import options if conditions are met. This is mainly useful for hiding options that depend on others if one of them is disabled. For example:  
         *    
         *  Returns `true` to make all options always visible.  
         */
        /* gdvirtual */ _get_option_visibility(path: string, option_name: StringName, options: GDictionary): boolean
        
        /** Imports [param source_file] into [param save_path] with the import [param options] specified. The [param platform_variants] and [param gen_files] arrays will be modified by this function.  
         *  This method must be overridden to do the actual importing work. See this class' description for an example of overriding this method.  
         */
        /* gdvirtual */ _import(source_file: string, save_path: string, options: GDictionary, platform_variants: GArray, gen_files: GArray): GError
        
        /** Tells whether this importer can be run in parallel on threads, or, on the contrary, it's only safe for the editor to call it from the main thread, for one file at a time.  
         *  If this method is not overridden, it will return `true` by default (i.e., safe for parallel importing).  
         */
        /* gdvirtual */ _can_import_threaded(): boolean
        
        /** This function can only be called during the [method _import] callback and it allows manually importing resources from it. This is useful when the imported file generates external resources that require importing (as example, images). Custom parameters for the ".import" file can be passed via the [param custom_options]. Additionally, in cases where multiple importers can handle a file, the [param custom_importer] can be specified to force a specific one. This function performs a resource import and returns immediately with a success or error code. [param generator_parameters] defines optional extra metadata which will be stored as [code skip-lint]generator_parameters` in the `remap` section of the `.import` file, for example to store a md5 hash of the source data. */
        append_import_external_resource(path: string, custom_options: GDictionary = new GDictionary(), custom_importer: string = '', generator_parameters: any = <any> {}): GError
    }
    /** A control used to edit properties of an object.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorinspector.html  
     */
    class EditorInspector extends ScrollContainer {
        constructor(identifier?: any)
        _edit_request_change(_unnamed_arg0: Object, _unnamed_arg1: string): void
        
        /** Gets the path of the currently selected property. */
        get_selected_path(): string
        
        /** Returns the object currently selected in this inspector. */
        get_edited_object(): Object
        
        /** Emitted when a property is selected in the inspector. */
        readonly property_selected: Signal1<string>
        
        /** Emitted when a property is keyed in the inspector. Properties can be keyed by clicking the "key" icon next to a property when the Animation panel is toggled. */
        readonly property_keyed: Signal3<string, any, boolean>
        
        /** Emitted when a property is removed from the inspector. */
        readonly property_deleted: Signal1<string>
        
        /** Emitted when a resource is selected in the inspector. */
        readonly resource_selected: Signal2<Resource, string>
        
        /** Emitted when the Edit button of an [Object] has been pressed in the inspector. This is mainly used in the remote scene tree Inspector. */
        readonly object_id_selected: Signal1<int64>
        
        /** Emitted when a property is edited in the inspector. */
        readonly property_edited: Signal1<string>
        
        /** Emitted when a boolean property is toggled in the inspector.  
         *      
         *  **Note:** This signal is never emitted if the internal `autoclear` property enabled. Since this property is always enabled in the editor inspector, this signal is never emitted by the editor itself.  
         */
        readonly property_toggled: Signal2<string, boolean>
        
        /** Emitted when the object being edited by the inspector has changed. */
        readonly edited_object_changed: Signal0
        
        /** Emitted when a property that requires a restart to be applied is edited in the inspector. This is only used in the Project Settings and Editor Settings. */
        readonly restart_requested: Signal0
    }
    class EditorInspectorCategory extends Control {
        constructor(identifier?: any)
    }
    class EditorInspectorDefaultPlugin extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorParticleProcessMaterialPlugin extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    /** Plugin for adding custom property editors on the inspector.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorinspectorplugin.html  
     */
    class EditorInspectorPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Returns `true` if this object can be handled by this plugin. */
        /* gdvirtual */ _can_handle(object: Object): boolean
        
        /** Called to allow adding controls at the beginning of the property list for [param object]. */
        /* gdvirtual */ _parse_begin(object: Object): void
        
        /** Called to allow adding controls at the beginning of a category in the property list for [param object]. */
        /* gdvirtual */ _parse_category(object: Object, category: string): void
        
        /** Called to allow adding controls at the beginning of a group or a sub-group in the property list for [param object]. */
        /* gdvirtual */ _parse_group(object: Object, group: string): void
        
        /** Called to allow adding property-specific editors to the property list for [param object]. The added editor control must extend [EditorProperty]. Returning `true` removes the built-in editor for this property, otherwise allows to insert a custom editor before the built-in one. */
        /* gdvirtual */ _parse_property(object: Object, type: Variant.Type, name: string, hint_type: PropertyHint, hint_string: string, usage_flags: PropertyUsageFlags, wide: boolean): boolean
        
        /** Called to allow adding controls at the end of the property list for [param object]. */
        /* gdvirtual */ _parse_end(object: Object): void
        
        /** Adds a custom control, which is not necessarily a property editor. */
        add_custom_control(control: Control): void
        
        /** Adds a property editor for an individual property. The [param editor] control must extend [EditorProperty].  
         *  There can be multiple property editors for a property. If [param add_to_end] is `true`, this newly added editor will be displayed after all the other editors of the property whose [param add_to_end] is `false`. For example, the editor uses this parameter to add an "Edit Region" button for [member Sprite2D.region_rect] below the regular [Rect2] editor.  
         *  [param label] can be used to choose a custom label for the property editor in the inspector. If left empty, the label is computed from the name of the property instead.  
         */
        add_property_editor(property: string, editor: Control, add_to_end: boolean = false, label: string = ''): void
        
        /** Adds an editor that allows modifying multiple properties. The [param editor] control must extend [EditorProperty]. */
        add_property_editor_for_multiple_properties(label: string, properties: PackedStringArray | string[], editor: Control): void
    }
    class EditorInspectorPlugin3DTexture extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginAnimationTrackKeyEdit extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginAudioStream extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginAudioStreamInteractive extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginBitMap extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginBoneMap extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginControl extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginCurve extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginFontPreview extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginFontVariation extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginGradient extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginGradientTexture2D extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginInputEvent extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginLayeredTexture extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginMaterial extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginMesh extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginPackedScene extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginSkeleton extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginStyleBox extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginSubViewportPreview extends EditorInspectorPluginTexture {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginSystemFont extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginTexture extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginTextureRegion extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorPluginTileData extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorRootMotionPlugin extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorInspectorVisualShaderModePlugin extends EditorInspectorPlugin {
        constructor(identifier?: any)
    }
    class EditorJSONSyntaxHighlighter extends EditorSyntaxHighlighter {
        constructor(identifier?: any)
    }
    class EditorLayoutsDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly name_confirmed: Signal1<string>
    }
    class EditorLocaleDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly locale_selected: Signal1<string>
    }
    class EditorLog extends HBoxContainer {
        constructor(identifier?: any)
    }
    class EditorMaterialPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorMeshPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorNativeShaderSourceVisualizer extends AcceptDialog {
        constructor(identifier?: any)
        _inspect_shader(_unnamed_arg0: RID): void
    }
    class EditorNetworkProfiler extends VBoxContainer {
        constructor(identifier?: any)
        readonly enable_profiling: Signal1<boolean>
        readonly open_request: Signal1<string>
    }
    class EditorNode extends Node {
        constructor(identifier?: any)
        push_item(object: Object, property: string = '', inspector_only: boolean = false): void
        set_edited_scene(_unnamed_arg0: Node): void
        stop_child_process(_unnamed_arg0: int64): void
        readonly request_help_search: Signal0
        readonly script_add_function_request: Signal3<Object, string, PackedStringArray | string[]>
        readonly resource_saved: Signal1<Object>
        readonly scene_saved: Signal1<string>
        readonly scene_changed: Signal0
        readonly scene_closed: Signal1<string>
    }
    /** Gizmo for editing [Node3D] objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editornode3dgizmo.html  
     */
    class EditorNode3DGizmo extends Node3DGizmo {
        constructor(identifier?: any)
        /** Override this method to add all the gizmo elements whenever a gizmo update is requested. It's common to call [method clear] at the beginning of this method and then add visual elements depending on the node's properties. */
        /* gdvirtual */ _redraw(): void
        
        /** Override this method to return the name of an edited handle (handles must have been previously added by [method add_handles]). Handles can be named for reference to the user when editing.  
         *  The [param secondary] argument is `true` when the requested handle is secondary (see [method add_handles] for more information).  
         */
        /* gdvirtual */ _get_handle_name(id: int64, secondary: boolean): string
        
        /** Override this method to return `true` whenever the given handle should be highlighted in the editor.  
         *  The [param secondary] argument is `true` when the requested handle is secondary (see [method add_handles] for more information).  
         */
        /* gdvirtual */ _is_handle_highlighted(id: int64, secondary: boolean): boolean
        
        /** Override this method to return the current value of a handle. This value will be requested at the start of an edit and used as the `restore` argument in [method _commit_handle].  
         *  The [param secondary] argument is `true` when the requested handle is secondary (see [method add_handles] for more information).  
         */
        /* gdvirtual */ _get_handle_value(id: int64, secondary: boolean): any
        /* gdvirtual */ _begin_handle_action(id: int64, secondary: boolean): void
        
        /** Override this method to update the node properties when the user drags a gizmo handle (previously added with [method add_handles]). The provided [param point] is the mouse position in screen coordinates and the [param camera] can be used to convert it to raycasts.  
         *  The [param secondary] argument is `true` when the edited handle is secondary (see [method add_handles] for more information).  
         */
        /* gdvirtual */ _set_handle(id: int64, secondary: boolean, camera: Camera3D, point: Vector2): void
        
        /** Override this method to commit a handle being edited (handles must have been previously added by [method add_handles]). This usually means creating an [UndoRedo] action for the change, using the current handle value as "do" and the [param restore] argument as "undo".  
         *  If the [param cancel] argument is `true`, the [param restore] value should be directly set, without any [UndoRedo] action.  
         *  The [param secondary] argument is `true` when the committed handle is secondary (see [method add_handles] for more information).  
         */
        /* gdvirtual */ _commit_handle(id: int64, secondary: boolean, restore: any, cancel: boolean): void
        
        /** Override this method to allow selecting subgizmos using mouse clicks. Given a [param camera] and a [param point] in screen coordinates, this method should return which subgizmo should be selected. The returned value should be a unique subgizmo identifier, which can have any non-negative value and will be used in other virtual methods like [method _get_subgizmo_transform] or [method _commit_subgizmos]. */
        /* gdvirtual */ _subgizmos_intersect_ray(camera: Camera3D, point: Vector2): int64
        
        /** Override this method to allow selecting subgizmos using mouse drag box selection. Given a [param camera] and a [param frustum], this method should return which subgizmos are contained within the frustum. The [param frustum] argument consists of an array with all the [Plane]s that make up the selection frustum. The returned value should contain a list of unique subgizmo identifiers, which can have any non-negative value and will be used in other virtual methods like [method _get_subgizmo_transform] or [method _commit_subgizmos]. */
        /* gdvirtual */ _subgizmos_intersect_frustum(camera: Camera3D, frustum: GArray): PackedInt32Array
        
        /** Override this method to update the node properties during subgizmo editing (see [method _subgizmos_intersect_ray] and [method _subgizmos_intersect_frustum]). The [param transform] is given in the [Node3D]'s local coordinate system. */
        /* gdvirtual */ _set_subgizmo_transform(id: int64, transform: Transform3D): void
        
        /** Override this method to return the current transform of a subgizmo. This transform will be requested at the start of an edit and used as the `restore` argument in [method _commit_subgizmos]. */
        /* gdvirtual */ _get_subgizmo_transform(id: int64): Transform3D
        
        /** Override this method to commit a group of subgizmos being edited (see [method _subgizmos_intersect_ray] and [method _subgizmos_intersect_frustum]). This usually means creating an [UndoRedo] action for the change, using the current transforms as "do" and the [param restores] transforms as "undo".  
         *  If the [param cancel] argument is `true`, the [param restores] transforms should be directly set, without any [UndoRedo] action.  
         */
        /* gdvirtual */ _commit_subgizmos(ids: PackedInt32Array | int32[], restores: GArray, cancel: boolean): void
        
        /** Adds lines to the gizmo (as sets of 2 points), with a given material. The lines are used for visualizing the gizmo. Call this method during [method _redraw]. */
        add_lines(lines: PackedVector3Array | Vector3[], material: Material, billboard: boolean = false, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Adds a mesh to the gizmo with the specified [param material], local [param transform] and [param skeleton]. Call this method during [method _redraw]. */
        add_mesh(mesh: Mesh, material: Material = undefined, transform: Transform3D = new Transform3D(), skeleton: SkinReference = undefined): void
        
        /** Adds the specified [param segments] to the gizmo's collision shape for picking. Call this method during [method _redraw]. */
        add_collision_segments(segments: PackedVector3Array | Vector3[]): void
        
        /** Adds collision triangles to the gizmo for picking. A [TriangleMesh] can be generated from a regular [Mesh] too. Call this method during [method _redraw]. */
        add_collision_triangles(triangles: TriangleMesh): void
        
        /** Adds an unscaled billboard for visualization and selection. Call this method during [method _redraw]. */
        add_unscaled_billboard(material: Material, default_scale: float64 = 1, modulate: Color = new Color(1, 1, 1, 1)): void
        
        /** Adds a list of handles (points) which can be used to edit the properties of the gizmo's [Node3D]. The [param ids] argument can be used to specify a custom identifier for each handle, if an empty array is passed, the ids will be assigned automatically from the [param handles] argument order.  
         *  The [param secondary] argument marks the added handles as secondary, meaning they will normally have lower selection priority than regular handles. When the user is holding the shift key secondary handles will switch to have higher priority than regular handles. This change in priority can be used to place multiple handles at the same point while still giving the user control on their selection.  
         *  There are virtual methods which will be called upon editing of these handles. Call this method during [method _redraw].  
         */
        add_handles(handles: PackedVector3Array | Vector3[], material: Material, ids: PackedInt32Array | int32[], billboard: boolean = false, secondary: boolean = false): void
        
        /** Sets the reference [Node3D] node for the gizmo. [param node] must inherit from [Node3D]. */
        set_node_3d(node: Node): void
        
        /** Returns the [Node3D] node associated with this gizmo. */
        get_node_3d(): Node3D
        
        /** Returns the [EditorNode3DGizmoPlugin] that owns this gizmo. It's useful to retrieve materials using [method EditorNode3DGizmoPlugin.get_material]. */
        get_plugin(): EditorNode3DGizmoPlugin
        
        /** Removes everything in the gizmo including meshes, collisions and handles. */
        clear(): void
        
        /** Sets the gizmo's hidden state. If `true`, the gizmo will be hidden. If `false`, it will be shown. */
        set_hidden(hidden: boolean): void
        
        /** Returns `true` if the given subgizmo is currently selected. Can be used to highlight selected elements during [method _redraw]. */
        is_subgizmo_selected(id: int64): boolean
        
        /** Returns a list of the currently selected subgizmos. Can be used to highlight selected elements during [method _redraw]. */
        get_subgizmo_selection(): PackedInt32Array
    }
    /** A class used by the editor to define Node3D gizmo types.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editornode3dgizmoplugin.html  
     */
    class EditorNode3DGizmoPlugin extends Resource {
        constructor(identifier?: any)
        /** Override this method to define which Node3D nodes have a gizmo from this plugin. Whenever a [Node3D] node is added to a scene this method is called, if it returns `true` the node gets a generic [EditorNode3DGizmo] assigned and is added to this plugin's list of active gizmos. */
        /* gdvirtual */ _has_gizmo(for_node_3d: Node3D): boolean
        
        /** Override this method to return a custom [EditorNode3DGizmo] for the spatial nodes of your choice, return `null` for the rest of nodes. See also [method _has_gizmo]. */
        /* gdvirtual */ _create_gizmo(for_node_3d: Node3D): EditorNode3DGizmo
        
        /** Override this method to provide the name that will appear in the gizmo visibility menu. */
        /* gdvirtual */ _get_gizmo_name(): string
        
        /** Override this method to set the gizmo's priority. Gizmos with higher priority will have precedence when processing inputs like handles or subgizmos selection.  
         *  All built-in editor gizmos return a priority of `-1`. If not overridden, this method will return `0`, which means custom gizmos will automatically get higher priority than built-in gizmos.  
         */
        /* gdvirtual */ _get_priority(): int64
        
        /** Override this method to define whether the gizmos handled by this plugin can be hidden or not. Returns `true` if not overridden. */
        /* gdvirtual */ _can_be_hidden(): boolean
        
        /** Override this method to define whether Node3D with this gizmo should be selectable even when the gizmo is hidden. */
        /* gdvirtual */ _is_selectable_when_hidden(): boolean
        
        /** Override this method to add all the gizmo elements whenever a gizmo update is requested. It's common to call [method EditorNode3DGizmo.clear] at the beginning of this method and then add visual elements depending on the node's properties. */
        /* gdvirtual */ _redraw(gizmo: EditorNode3DGizmo): void
        
        /** Override this method to provide gizmo's handle names. The [param secondary] argument is `true` when the requested handle is secondary (see [method EditorNode3DGizmo.add_handles] for more information). Called for this plugin's active gizmos. */
        /* gdvirtual */ _get_handle_name(gizmo: EditorNode3DGizmo, handle_id: int64, secondary: boolean): string
        
        /** Override this method to return `true` whenever to given handle should be highlighted in the editor. The [param secondary] argument is `true` when the requested handle is secondary (see [method EditorNode3DGizmo.add_handles] for more information). Called for this plugin's active gizmos. */
        /* gdvirtual */ _is_handle_highlighted(gizmo: EditorNode3DGizmo, handle_id: int64, secondary: boolean): boolean
        
        /** Override this method to return the current value of a handle. This value will be requested at the start of an edit and used as the `restore` argument in [method _commit_handle].  
         *  The [param secondary] argument is `true` when the requested handle is secondary (see [method EditorNode3DGizmo.add_handles] for more information).  
         *  Called for this plugin's active gizmos.  
         */
        /* gdvirtual */ _get_handle_value(gizmo: EditorNode3DGizmo, handle_id: int64, secondary: boolean): any
        /* gdvirtual */ _begin_handle_action(gizmo: EditorNode3DGizmo, handle_id: int64, secondary: boolean): void
        
        /** Override this method to update the node's properties when the user drags a gizmo handle (previously added with [method EditorNode3DGizmo.add_handles]). The provided [param screen_pos] is the mouse position in screen coordinates and the [param camera] can be used to convert it to raycasts.  
         *  The [param secondary] argument is `true` when the edited handle is secondary (see [method EditorNode3DGizmo.add_handles] for more information).  
         *  Called for this plugin's active gizmos.  
         */
        /* gdvirtual */ _set_handle(gizmo: EditorNode3DGizmo, handle_id: int64, secondary: boolean, camera: Camera3D, screen_pos: Vector2): void
        
        /** Override this method to commit a handle being edited (handles must have been previously added by [method EditorNode3DGizmo.add_handles] during [method _redraw]). This usually means creating an [UndoRedo] action for the change, using the current handle value as "do" and the [param restore] argument as "undo".  
         *  If the [param cancel] argument is `true`, the [param restore] value should be directly set, without any [UndoRedo] action.  
         *  The [param secondary] argument is `true` when the committed handle is secondary (see [method EditorNode3DGizmo.add_handles] for more information).  
         *  Called for this plugin's active gizmos.  
         */
        /* gdvirtual */ _commit_handle(gizmo: EditorNode3DGizmo, handle_id: int64, secondary: boolean, restore: any, cancel: boolean): void
        
        /** Override this method to allow selecting subgizmos using mouse clicks. Given a [param camera] and a [param screen_pos] in screen coordinates, this method should return which subgizmo should be selected. The returned value should be a unique subgizmo identifier, which can have any non-negative value and will be used in other virtual methods like [method _get_subgizmo_transform] or [method _commit_subgizmos]. Called for this plugin's active gizmos. */
        /* gdvirtual */ _subgizmos_intersect_ray(gizmo: EditorNode3DGizmo, camera: Camera3D, screen_pos: Vector2): int64
        
        /** Override this method to allow selecting subgizmos using mouse drag box selection. Given a [param camera] and [param frustum_planes], this method should return which subgizmos are contained within the frustums. The [param frustum_planes] argument consists of an array with all the [Plane]s that make up the selection frustum. The returned value should contain a list of unique subgizmo identifiers, these identifiers can have any non-negative value and will be used in other virtual methods like [method _get_subgizmo_transform] or [method _commit_subgizmos]. Called for this plugin's active gizmos. */
        /* gdvirtual */ _subgizmos_intersect_frustum(gizmo: EditorNode3DGizmo, camera: Camera3D, frustum_planes: GArray): PackedInt32Array
        
        /** Override this method to return the current transform of a subgizmo. As with all subgizmo methods, the transform should be in local space respect to the gizmo's Node3D. This transform will be requested at the start of an edit and used in the `restore` argument in [method _commit_subgizmos]. Called for this plugin's active gizmos. */
        /* gdvirtual */ _get_subgizmo_transform(gizmo: EditorNode3DGizmo, subgizmo_id: int64): Transform3D
        
        /** Override this method to update the node properties during subgizmo editing (see [method _subgizmos_intersect_ray] and [method _subgizmos_intersect_frustum]). The [param transform] is given in the Node3D's local coordinate system. Called for this plugin's active gizmos. */
        /* gdvirtual */ _set_subgizmo_transform(gizmo: EditorNode3DGizmo, subgizmo_id: int64, transform: Transform3D): void
        
        /** Override this method to commit a group of subgizmos being edited (see [method _subgizmos_intersect_ray] and [method _subgizmos_intersect_frustum]). This usually means creating an [UndoRedo] action for the change, using the current transforms as "do" and the [param restores] transforms as "undo".  
         *  If the [param cancel] argument is `true`, the [param restores] transforms should be directly set, without any [UndoRedo] action. As with all subgizmo methods, transforms are given in local space respect to the gizmo's Node3D. Called for this plugin's active gizmos.  
         */
        /* gdvirtual */ _commit_subgizmos(gizmo: EditorNode3DGizmo, ids: PackedInt32Array | int32[], restores: GArray, cancel: boolean): void
        
        /** Creates an unshaded material with its variants (selected and/or editable) and adds them to the internal material list. They can then be accessed with [method get_material] and used in [method EditorNode3DGizmo.add_mesh] and [method EditorNode3DGizmo.add_lines]. Should not be overridden. */
        create_material(name: string, color: Color, billboard: boolean = false, on_top: boolean = false, use_vertex_color: boolean = false): void
        
        /** Creates an icon material with its variants (selected and/or editable) and adds them to the internal material list. They can then be accessed with [method get_material] and used in [method EditorNode3DGizmo.add_unscaled_billboard]. Should not be overridden. */
        create_icon_material(name: string, texture: Texture2D, on_top: boolean = false, color: Color = new Color(1, 1, 1, 1)): void
        
        /** Creates a handle material with its variants (selected and/or editable) and adds them to the internal material list. They can then be accessed with [method get_material] and used in [method EditorNode3DGizmo.add_handles]. Should not be overridden.  
         *  You can optionally provide a texture to use instead of the default icon.  
         */
        create_handle_material(name: string, billboard: boolean = false, texture: Texture2D = undefined): void
        
        /** Adds a new material to the internal material list for the plugin. It can then be accessed with [method get_material]. Should not be overridden. */
        add_material(name: string, material: StandardMaterial3D): void
        
        /** Gets material from the internal list of materials. If an [EditorNode3DGizmo] is provided, it will try to get the corresponding variant (selected and/or editable). */
        get_material(name: string, gizmo: EditorNode3DGizmo = undefined): StandardMaterial3D
    }
    class EditorOBJImporter extends EditorSceneFormatImporter {
        constructor(identifier?: any)
    }
    class EditorObjectSelector extends Button {
        constructor(identifier?: any)
    }
    class EditorPackedScenePreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    /** Editor-only singleton that returns paths to various OS-specific data folders and files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorpaths.html  
     */
    class EditorPaths extends Object {
        constructor(identifier?: any)
        /** Returns the absolute path to the user's data folder. This folder should be used for  *persistent*  user data files such as installed export templates.  
         *  **Default paths per platform:**  
         *  [codeblock lang=text]  
         *  - Windows: %APPDATA%\Godot\                    (same as `get_config_dir()`)  
         *  - macOS: ~/Library/Application Support/Godot/  (same as `get_config_dir()`)  
         *  - Linux: ~/.local/share/godot/  
         *  [/codeblock]  
         */
        get_data_dir(): string
        
        /** Returns the absolute path to the user's configuration folder. This folder should be used for  *persistent*  user configuration files.  
         *  **Default paths per platform:**  
         *  [codeblock lang=text]  
         *  - Windows: %APPDATA%\Godot\                    (same as `get_data_dir()`)  
         *  - macOS: ~/Library/Application Support/Godot/  (same as `get_data_dir()`)  
         *  - Linux: ~/.config/godot/  
         *  [/codeblock]  
         */
        get_config_dir(): string
        
        /** Returns the absolute path to the user's cache folder. This folder should be used for temporary data that can be removed safely whenever the editor is closed (such as generated resource thumbnails).  
         *  **Default paths per platform:**  
         *  [codeblock lang=text]  
         *  - Windows: %LOCALAPPDATA%\Godot\  
         *  - macOS: ~/Library/Caches/Godot/  
         *  - Linux: ~/.cache/godot/  
         *  [/codeblock]  
         */
        get_cache_dir(): string
        
        /** Returns `true` if the editor is marked as self-contained, `false` otherwise. When self-contained mode is enabled, user configuration, data and cache files are saved in an `editor_data/` folder next to the editor binary. This makes portable usage easier and ensures the Godot editor minimizes file writes outside its own folder. Self-contained mode is not available for exported projects.  
         *  Self-contained mode can be enabled by creating a file named `._sc_` or `_sc_` in the same folder as the editor binary or macOS .app bundle while the editor is not running. See also [method get_self_contained_file].  
         *      
         *  **Note:** On macOS, quarantine flag should be manually removed before using self-contained mode, see [url=https://docs.godotengine.org/en/stable/tutorials/export/running_on_macos.html]Running on macOS[/url].  
         *      
         *  **Note:** On macOS, placing `_sc_` or any other file inside .app bundle will break digital signature and make it non-portable, consider placing it in the same folder as the .app bundle instead.  
         *      
         *  **Note:** The Steam release of Godot uses self-contained mode by default.  
         */
        is_self_contained(): boolean
        
        /** Returns the absolute path to the self-contained file that makes the current Godot editor instance be considered as self-contained. Returns an empty string if the current Godot editor instance isn't self-contained. See also [method is_self_contained]. */
        get_self_contained_file(): string
        
        /** Returns the project-specific editor settings path. Projects all have a unique subdirectory inside the settings path where project-specific editor settings are saved. */
        get_project_settings_dir(): string
    }
    class EditorPerformanceProfiler extends HSplitContainer {
        constructor(identifier?: any)
    }
    namespace EditorPlugin {
        enum CustomControlContainer {
            /** Main editor toolbar, next to play buttons. */
            CONTAINER_TOOLBAR = 0,
            
            /** The toolbar that appears when 3D editor is active. */
            CONTAINER_SPATIAL_EDITOR_MENU = 1,
            
            /** Left sidebar of the 3D editor. */
            CONTAINER_SPATIAL_EDITOR_SIDE_LEFT = 2,
            
            /** Right sidebar of the 3D editor. */
            CONTAINER_SPATIAL_EDITOR_SIDE_RIGHT = 3,
            
            /** Bottom panel of the 3D editor. */
            CONTAINER_SPATIAL_EDITOR_BOTTOM = 4,
            
            /** The toolbar that appears when 2D editor is active. */
            CONTAINER_CANVAS_EDITOR_MENU = 5,
            
            /** Left sidebar of the 2D editor. */
            CONTAINER_CANVAS_EDITOR_SIDE_LEFT = 6,
            
            /** Right sidebar of the 2D editor. */
            CONTAINER_CANVAS_EDITOR_SIDE_RIGHT = 7,
            
            /** Bottom panel of the 2D editor. */
            CONTAINER_CANVAS_EDITOR_BOTTOM = 8,
            
            /** Bottom section of the inspector. */
            CONTAINER_INSPECTOR_BOTTOM = 9,
            
            /** Tab of Project Settings dialog, to the left of other tabs. */
            CONTAINER_PROJECT_SETTING_TAB_LEFT = 10,
            
            /** Tab of Project Settings dialog, to the right of other tabs. */
            CONTAINER_PROJECT_SETTING_TAB_RIGHT = 11,
        }
        enum DockSlot {
            /** Dock slot, left side, upper-left (empty in default layout). */
            DOCK_SLOT_LEFT_UL = 0,
            
            /** Dock slot, left side, bottom-left (empty in default layout). */
            DOCK_SLOT_LEFT_BL = 1,
            
            /** Dock slot, left side, upper-right (in default layout includes Scene and Import docks). */
            DOCK_SLOT_LEFT_UR = 2,
            
            /** Dock slot, left side, bottom-right (in default layout includes FileSystem dock). */
            DOCK_SLOT_LEFT_BR = 3,
            
            /** Dock slot, right side, upper-left (in default layout includes Inspector, Node, and History docks). */
            DOCK_SLOT_RIGHT_UL = 4,
            
            /** Dock slot, right side, bottom-left (empty in default layout). */
            DOCK_SLOT_RIGHT_BL = 5,
            
            /** Dock slot, right side, upper-right (empty in default layout). */
            DOCK_SLOT_RIGHT_UR = 6,
            
            /** Dock slot, right side, bottom-right (empty in default layout). */
            DOCK_SLOT_RIGHT_BR = 7,
            
            /** Represents the size of the [enum DockSlot] enum. */
            DOCK_SLOT_MAX = 8,
        }
        enum AfterGUIInput {
            /** Forwards the [InputEvent] to other EditorPlugins. */
            AFTER_GUI_INPUT_PASS = 0,
            
            /** Prevents the [InputEvent] from reaching other Editor classes. */
            AFTER_GUI_INPUT_STOP = 1,
            
            /** Pass the [InputEvent] to other editor plugins except the main [Node3D] one. This can be used to prevent node selection changes and work with sub-gizmos instead. */
            AFTER_GUI_INPUT_CUSTOM = 2,
        }
    }
    /** Used by the editor to extend its functionality.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorplugin.html  
     */
    class EditorPlugin extends Node {
        constructor(identifier?: any)
        /** Called when there is a root node in the current edited scene, [method _handles] is implemented and an [InputEvent] happens in the 2D viewport. Intercepts the [InputEvent], if `return true` [EditorPlugin] consumes the [param event], otherwise forwards [param event] to other Editor classes.  
         *  **Example:**  
         *    
         *  Must `return false` in order to forward the [InputEvent] to other Editor classes.  
         *  **Example:**  
         *    
         */
        /* gdvirtual */ _forward_canvas_gui_input(event: InputEvent): boolean
        
        /** Called by the engine when the 2D editor's viewport is updated. Use the `overlay` [Control] for drawing. You can update the viewport manually by calling [method update_overlays].  
         *    
         */
        /* gdvirtual */ _forward_canvas_draw_over_viewport(viewport_control: Control): void
        
        /** This method is the same as [method _forward_canvas_draw_over_viewport], except it draws on top of everything. Useful when you need an extra layer that shows over anything else.  
         *  You need to enable calling of this method by using [method set_force_draw_over_forwarding_enabled].  
         */
        /* gdvirtual */ _forward_canvas_force_draw_over_viewport(viewport_control: Control): void
        
        /** Called when there is a root node in the current edited scene, [method _handles] is implemented, and an [InputEvent] happens in the 3D viewport. The return value decides whether the [InputEvent] is consumed or forwarded to other [EditorPlugin]s. See [enum AfterGUIInput] for options.  
         *  **Example:**  
         *    
         *  Must `return EditorPlugin.AFTER_GUI_INPUT_PASS` in order to forward the [InputEvent] to other Editor classes.  
         *  **Example:**  
         *    
         */
        /* gdvirtual */ _forward_3d_gui_input(viewport_camera: Camera3D, event: InputEvent): int64
        
        /** Called by the engine when the 3D editor's viewport is updated. Use the `overlay` [Control] for drawing. You can update the viewport manually by calling [method update_overlays].  
         *    
         */
        /* gdvirtual */ _forward_3d_draw_over_viewport(viewport_control: Control): void
        
        /** This method is the same as [method _forward_3d_draw_over_viewport], except it draws on top of everything. Useful when you need an extra layer that shows over anything else.  
         *  You need to enable calling of this method by using [method set_force_draw_over_forwarding_enabled].  
         */
        /* gdvirtual */ _forward_3d_force_draw_over_viewport(viewport_control: Control): void
        
        /** Override this method in your plugin to provide the name of the plugin when displayed in the Godot editor.  
         *  For main screen plugins, this appears at the top of the screen, to the right of the "2D", "3D", "Script", and "AssetLib" buttons.  
         */
        /* gdvirtual */ _get_plugin_name(): string
        
        /** Override this method in your plugin to return a [Texture2D] in order to give it an icon.  
         *  For main screen plugins, this appears at the top of the screen, to the right of the "2D", "3D", "Script", and "AssetLib" buttons.  
         *  Ideally, the plugin icon should be white with a transparent background and 16×16 pixels in size.  
         *    
         */
        /* gdvirtual */ _get_plugin_icon(): Texture2D
        
        /** Returns `true` if this is a main screen editor plugin (it goes in the workspace selector together with **2D**, **3D**, **Script** and **AssetLib**).  
         *  When the plugin's workspace is selected, other main screen plugins will be hidden, but your plugin will not appear automatically. It needs to be added as a child of [method EditorInterface.get_editor_main_screen] and made visible inside [method _make_visible].  
         *  Use [method _get_plugin_name] and [method _get_plugin_icon] to customize the plugin button's appearance.  
         *    
         */
        /* gdvirtual */ _has_main_screen(): boolean
        
        /** This function will be called when the editor is requested to become visible. It is used for plugins that edit a specific object type.  
         *  Remember that you have to manage the visibility of all your editor controls manually.  
         */
        /* gdvirtual */ _make_visible(visible: boolean): void
        
        /** This function is used for plugins that edit specific object types (nodes or resources). It requests the editor to edit the given object.  
         *  [param object] can be `null` if the plugin was editing an object, but there is no longer any selected object handled by this plugin. It can be used to cleanup editing state.  
         */
        /* gdvirtual */ _edit(object: Object): void
        
        /** Implement this function if your plugin edits a specific type of object (Resource or Node). If you return `true`, then you will get the functions [method _edit] and [method _make_visible] called when the editor requests them. If you have declared the methods [method _forward_canvas_gui_input] and [method _forward_3d_gui_input] these will be called too.  
         *      
         *  **Note:** Each plugin should handle only one type of objects at a time. If a plugin handles more types of objects and they are edited at the same time, it will result in errors.  
         */
        /* gdvirtual */ _handles(object: Object): boolean
        
        /** Override this method to provide a state data you want to be saved, like view position, grid settings, folding, etc. This is used when saving the scene (so state is kept when opening it again) and for switching tabs (so state can be restored when the tab returns). This data is automatically saved for each scene in an `editstate` file in the editor metadata folder. If you want to store global (scene-independent) editor data for your plugin, you can use [method _get_window_layout] instead.  
         *  Use [method _set_state] to restore your saved state.  
         *      
         *  **Note:** This method should not be used to save important settings that should persist with the project.  
         *      
         *  **Note:** You must implement [method _get_plugin_name] for the state to be stored and restored correctly.  
         *    
         */
        /* gdvirtual */ _get_state(): GDictionary
        
        /** Restore the state saved by [method _get_state]. This method is called when the current scene tab is changed in the editor.  
         *      
         *  **Note:** Your plugin must implement [method _get_plugin_name], otherwise it will not be recognized and this method will not be called.  
         *    
         */
        /* gdvirtual */ _set_state(state: GDictionary): void
        
        /** Clear all the state and reset the object being edited to zero. This ensures your plugin does not keep editing a currently existing node, or a node from the wrong scene. */
        /* gdvirtual */ _clear(): void
        
        /** Override this method to provide a custom message that lists unsaved changes. The editor will call this method when exiting or when closing a scene, and display the returned string in a confirmation dialog. Return empty string if the plugin has no unsaved changes.  
         *  When closing a scene, [param for_scene] is the path to the scene being closed. You can use it to handle built-in resources in that scene.  
         *  If the user confirms saving, [method _save_external_data] will be called, before closing the editor.  
         *    
         *  If the plugin has no scene-specific changes, you can ignore the calls when closing scenes:  
         *    
         */
        /* gdvirtual */ _get_unsaved_status(for_scene: string): string
        
        /** This method is called after the editor saves the project or when it's closed. It asks the plugin to save edited external scenes/resources. */
        /* gdvirtual */ _save_external_data(): void
        
        /** This method is called when the editor is about to save the project, switch to another tab, etc. It asks the plugin to apply any pending state changes to ensure consistency.  
         *  This is used, for example, in shader editors to let the plugin know that it must apply the shader code being written by the user to the object.  
         */
        /* gdvirtual */ _apply_changes(): void
        
        /** This is for editors that edit script-based objects. You can return a list of breakpoints in the format (`script:line`), for example: `res://path_to_script.gd:25`. */
        /* gdvirtual */ _get_breakpoints(): PackedStringArray
        
        /** Restore the plugin GUI layout and data saved by [method _get_window_layout]. This method is called for every plugin on editor startup. Use the provided [param configuration] file to read your saved data.  
         *    
         */
        /* gdvirtual */ _set_window_layout(configuration: ConfigFile): void
        
        /** Override this method to provide the GUI layout of the plugin or any other data you want to be stored. This is used to save the project's editor layout when [method queue_save_layout] is called or the editor layout was changed (for example changing the position of a dock). The data is stored in the `editor_layout.cfg` file in the editor metadata directory.  
         *  Use [method _set_window_layout] to restore your saved layout.  
         *    
         */
        /* gdvirtual */ _get_window_layout(configuration: ConfigFile): void
        
        /** This method is called when the editor is about to run the project. The plugin can then perform required operations before the project runs.  
         *  This method must return a boolean. If this method returns `false`, the project will not run. The run is aborted immediately, so this also prevents all other plugins' [method _build] methods from running.  
         */
        /* gdvirtual */ _build(): boolean
        
        /** Called by the engine when the user enables the [EditorPlugin] in the Plugin tab of the project settings window. */
        /* gdvirtual */ _enable_plugin(): void
        
        /** Called by the engine when the user disables the [EditorPlugin] in the Plugin tab of the project settings window. */
        /* gdvirtual */ _disable_plugin(): void
        
        /** Adds a custom control to a container (see [enum CustomControlContainer]). There are many locations where custom controls can be added in the editor UI.  
         *  Please remember that you have to manage the visibility of your custom controls yourself (and likely hide it after adding it).  
         *  When your plugin is deactivated, make sure to remove your custom control with [method remove_control_from_container] and free it with [method Node.queue_free].  
         */
        add_control_to_container(container: EditorPlugin.CustomControlContainer, control: Control): void
        
        /** Adds a control to the bottom panel (together with Output, Debug, Animation, etc). Returns a reference to the button added. It's up to you to hide/show the button when needed. When your plugin is deactivated, make sure to remove your custom control with [method remove_control_from_bottom_panel] and free it with [method Node.queue_free].  
         *  Optionally, you can specify a shortcut parameter. When pressed, this shortcut will toggle the bottom panel's visibility. See the default editor bottom panel shortcuts in the Editor Settings for inspiration. Per convention, they all use [kbd]Alt[/kbd] modifier.  
         */
        add_control_to_bottom_panel(control: Control, title: string, shortcut: Shortcut = undefined): Button
        
        /** Adds the control to a specific dock slot (see [enum DockSlot] for options).  
         *  If the dock is repositioned and as long as the plugin is active, the editor will save the dock position on further sessions.  
         *  When your plugin is deactivated, make sure to remove your custom control with [method remove_control_from_docks] and free it with [method Node.queue_free].  
         *  Optionally, you can specify a shortcut parameter. When pressed, this shortcut will toggle the dock's visibility once it's moved to the bottom panel (this shortcut does not affect the dock otherwise). See the default editor bottom panel shortcuts in the Editor Settings for inspiration. Per convention, they all use [kbd]Alt[/kbd] modifier.  
         */
        add_control_to_dock(slot: EditorPlugin.DockSlot, control: Control, shortcut: Shortcut = undefined): void
        
        /** Removes the control from the dock. You have to manually [method Node.queue_free] the control. */
        remove_control_from_docks(control: Control): void
        
        /** Removes the control from the bottom panel. You have to manually [method Node.queue_free] the control. */
        remove_control_from_bottom_panel(control: Control): void
        
        /** Removes the control from the specified container. You have to manually [method Node.queue_free] the control. */
        remove_control_from_container(container: EditorPlugin.CustomControlContainer, control: Control): void
        
        /** Sets the tab icon for the given control in a dock slot. Setting to `null` removes the icon. */
        set_dock_tab_icon(control: Control, icon: Texture2D): void
        
        /** Adds a custom menu item to **Project > Tools** named [param name]. When clicked, the provided [param callable] will be called. */
        add_tool_menu_item(name: string, callable: Callable): void
        
        /** Adds a custom [PopupMenu] submenu under **Project > Tools >** [param name]. Use [method remove_tool_menu_item] on plugin clean up to remove the menu. */
        add_tool_submenu_item(name: string, submenu: PopupMenu): void
        
        /** Removes a menu [param name] from **Project > Tools**. */
        remove_tool_menu_item(name: string): void
        
        /** Returns the [PopupMenu] under **Scene > Export As...**. */
        get_export_as_menu(): PopupMenu
        
        /** Adds a custom type, which will appear in the list of nodes or resources.  
         *  When a given node or resource is selected, the base type will be instantiated (e.g. "Node3D", "Control", "Resource"), then the script will be loaded and set to this object.  
         *      
         *  **Note:** The base type is the base engine class which this type's class hierarchy inherits, not any custom type parent classes.  
         *  You can use the virtual method [method _handles] to check if your custom object is being edited by checking the script or using the `is` keyword.  
         *  During run-time, this will be a simple object with a script so this function does not need to be called then.  
         *      
         *  **Note:** Custom types added this way are not true classes. They are just a helper to create a node with specific script.  
         */
        add_custom_type(type: string, base: string, script: Script, icon: Texture2D): void
        
        /** Removes a custom type added by [method add_custom_type]. */
        remove_custom_type(type: string): void
        
        /** Adds a script at [param path] to the Autoload list as [param name]. */
        add_autoload_singleton(name: string, path: string): void
        
        /** Removes an Autoload [param name] from the list. */
        remove_autoload_singleton(name: string): void
        
        /** Updates the overlays of the 2D and 3D editor viewport. Causes methods [method _forward_canvas_draw_over_viewport], [method _forward_canvas_force_draw_over_viewport], [method _forward_3d_draw_over_viewport] and [method _forward_3d_force_draw_over_viewport] to be called. */
        update_overlays(): int64
        
        /** Makes a specific item in the bottom panel visible. */
        make_bottom_panel_item_visible(item: Control): void
        
        /** Minimizes the bottom panel. */
        hide_bottom_panel(): void
        
        /** Gets the undo/redo object. Most actions in the editor can be undoable, so use this object to make sure this happens when it's worth it. */
        get_undo_redo(): EditorUndoRedoManager
        
        /** Hooks a callback into the undo/redo action creation when a property is modified in the inspector. This allows, for example, to save other properties that may be lost when a given property is modified.  
         *  The callback should have 4 arguments: [Object] `undo_redo`, [Object] `modified_object`, [String] `property` and [Variant] `new_value`. They are, respectively, the [UndoRedo] object used by the inspector, the currently modified object, the name of the modified property and the new value the property is about to take.  
         */
        add_undo_redo_inspector_hook_callback(callable: Callable): void
        
        /** Removes a callback previously added by [method add_undo_redo_inspector_hook_callback]. */
        remove_undo_redo_inspector_hook_callback(callable: Callable): void
        
        /** Queue save the project's editor layout. */
        queue_save_layout(): void
        
        /** Registers a custom translation parser plugin for extracting translatable strings from custom files. */
        add_translation_parser_plugin(parser: EditorTranslationParserPlugin): void
        
        /** Removes a custom translation parser plugin registered by [method add_translation_parser_plugin]. */
        remove_translation_parser_plugin(parser: EditorTranslationParserPlugin): void
        
        /** Registers a new [EditorImportPlugin]. Import plugins are used to import custom and unsupported assets as a custom [Resource] type.  
         *  If [param first_priority] is `true`, the new import plugin is inserted first in the list and takes precedence over pre-existing plugins.  
         *      
         *  **Note:** If you want to import custom 3D asset formats use [method add_scene_format_importer_plugin] instead.  
         *  See [method add_inspector_plugin] for an example of how to register a plugin.  
         */
        add_import_plugin(importer: EditorImportPlugin, first_priority: boolean = false): void
        
        /** Removes an import plugin registered by [method add_import_plugin]. */
        remove_import_plugin(importer: EditorImportPlugin): void
        
        /** Registers a new [EditorSceneFormatImporter]. Scene importers are used to import custom 3D asset formats as scenes.  
         *  If [param first_priority] is `true`, the new import plugin is inserted first in the list and takes precedence over pre-existing plugins.  
         */
        add_scene_format_importer_plugin(scene_format_importer: EditorSceneFormatImporter, first_priority: boolean = false): void
        
        /** Removes a scene format importer registered by [method add_scene_format_importer_plugin]. */
        remove_scene_format_importer_plugin(scene_format_importer: EditorSceneFormatImporter): void
        
        /** Add a [EditorScenePostImportPlugin]. These plugins allow customizing the import process of 3D assets by adding new options to the import dialogs.  
         *  If [param first_priority] is `true`, the new import plugin is inserted first in the list and takes precedence over pre-existing plugins.  
         */
        add_scene_post_import_plugin(scene_import_plugin: EditorScenePostImportPlugin, first_priority: boolean = false): void
        
        /** Remove the [EditorScenePostImportPlugin], added with [method add_scene_post_import_plugin]. */
        remove_scene_post_import_plugin(scene_import_plugin: EditorScenePostImportPlugin): void
        
        /** Registers a new [EditorExportPlugin]. Export plugins are used to perform tasks when the project is being exported.  
         *  See [method add_inspector_plugin] for an example of how to register a plugin.  
         */
        add_export_plugin(plugin: EditorExportPlugin): void
        
        /** Removes an export plugin registered by [method add_export_plugin]. */
        remove_export_plugin(plugin: EditorExportPlugin): void
        
        /** Registers a new [EditorNode3DGizmoPlugin]. Gizmo plugins are used to add custom gizmos to the 3D preview viewport for a [Node3D].  
         *  See [method add_inspector_plugin] for an example of how to register a plugin.  
         */
        add_node_3d_gizmo_plugin(plugin: EditorNode3DGizmoPlugin): void
        
        /** Removes a gizmo plugin registered by [method add_node_3d_gizmo_plugin]. */
        remove_node_3d_gizmo_plugin(plugin: EditorNode3DGizmoPlugin): void
        
        /** Registers a new [EditorInspectorPlugin]. Inspector plugins are used to extend [EditorInspector] and provide custom configuration tools for your object's properties.  
         *      
         *  **Note:** Always use [method remove_inspector_plugin] to remove the registered [EditorInspectorPlugin] when your [EditorPlugin] is disabled to prevent leaks and an unexpected behavior.  
         *    
         */
        add_inspector_plugin(plugin: EditorInspectorPlugin): void
        
        /** Removes an inspector plugin registered by [method add_import_plugin] */
        remove_inspector_plugin(plugin: EditorInspectorPlugin): void
        
        /** Registers a new [EditorResourceConversionPlugin]. Resource conversion plugins are used to add custom resource converters to the editor inspector.  
         *  See [EditorResourceConversionPlugin] for an example of how to create a resource conversion plugin.  
         */
        add_resource_conversion_plugin(plugin: EditorResourceConversionPlugin): void
        
        /** Removes a resource conversion plugin registered by [method add_resource_conversion_plugin]. */
        remove_resource_conversion_plugin(plugin: EditorResourceConversionPlugin): void
        
        /** Use this method if you always want to receive inputs from 3D view screen inside [method _forward_3d_gui_input]. It might be especially usable if your plugin will want to use raycast in the scene. */
        set_input_event_forwarding_always_enabled(): void
        
        /** Enables calling of [method _forward_canvas_force_draw_over_viewport] for the 2D editor and [method _forward_3d_force_draw_over_viewport] for the 3D editor when their viewports are updated. You need to call this method only once and it will work permanently for this plugin. */
        set_force_draw_over_forwarding_enabled(): void
        
        /** Returns the [EditorInterface] singleton instance. */
        get_editor_interface(): EditorInterface
        
        /** Gets the Editor's dialog used for making scripts.  
         *      
         *  **Note:** Users can configure it before use.  
         *  **Warning:** Removing and freeing this node will render a part of the editor useless and may cause a crash.  
         */
        get_script_create_dialog(): ScriptCreateDialog
        
        /** Adds a [Script] as debugger plugin to the Debugger. The script must extend [EditorDebuggerPlugin]. */
        add_debugger_plugin(script: EditorDebuggerPlugin): void
        
        /** Removes the debugger plugin with given script from the Debugger. */
        remove_debugger_plugin(script: EditorDebuggerPlugin): void
        
        /** Provide the version of the plugin declared in the `plugin.cfg` config file. */
        get_plugin_version(): string
        
        /** Emitted when the scene is changed in the editor. The argument will return the root node of the scene that has just become active. If this scene is new and empty, the argument will be `null`. */
        readonly scene_changed: Signal1<Node>
        
        /** Emitted when user closes a scene. The argument is a file path to the closed scene. */
        readonly scene_closed: Signal1<string>
        
        /** Emitted when user changes the workspace (**2D**, **3D**, **Script**, **AssetLib**). Also works with custom screens defined by plugins. */
        readonly main_screen_changed: Signal1<string>
        
        /** Emitted when the given [param resource] was saved on disc. See also [signal scene_saved]. */
        readonly resource_saved: Signal1<Resource>
        
        /** Emitted when a scene was saved on disc. The argument is a file path to the saved scene. See also [signal resource_saved]. */
        readonly scene_saved: Signal1<string>
        
        /** Emitted when any project setting has changed. */
        readonly project_settings_changed: Signal0
    }
    class EditorPluginCSG extends EditorPlugin {
        constructor(identifier?: any)
    }
    class EditorPluginSettings extends VBoxContainer {
        constructor(identifier?: any)
    }
    class EditorProfiler extends VBoxContainer {
        constructor(identifier?: any)
        readonly enable_profiling: Signal1<boolean>
        readonly break_request: Signal0
    }
    /** Custom control for editing properties that can be added to the [EditorInspector].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorproperty.html  
     */
    class EditorProperty extends Container {
        constructor(identifier?: any)
        /** When this virtual function is called, you must update your editor. */
        /* gdvirtual */ _update_property(): void
        
        /** Called when the read-only status of the property is changed. It may be used to change custom controls into a read-only or modifiable state. */
        /* gdvirtual */ _set_read_only(read_only: boolean): void
        
        /** Gets the edited property. If your editor is for a single property (added via [method EditorInspectorPlugin._parse_property]), then this will return the property. */
        get_edited_property(): StringName
        
        /** Gets the edited object. */
        get_edited_object(): Object
        
        /** Forces refresh of the property display. */
        update_property(): void
        
        /** If any of the controls added can gain keyboard focus, add it here. This ensures that focus will be restored if the inspector is refreshed. */
        add_focusable(control: Control): void
        
        /** Puts the [param editor] control below the property label. The control must be previously added using [method Node.add_child]. */
        set_bottom_editor(editor: Control): void
        
        /** If one or several properties have changed, this must be called. [param field] is used in case your editor can modify fields separately (as an example, Vector3.x). The [param changing] argument avoids the editor requesting this property to be refreshed (leave as `false` if unsure). */
        emit_changed(property: StringName, value: any, field: StringName = '', changing: boolean = false): void
        _update_editor_property_status(): void
        
        /** Set this property to change the label (if you want to show one). */
        get label(): string
        set label(value: string)
        
        /** Used by the inspector, set to `true` when the property is read-only. */
        get read_only(): boolean
        set read_only(value: boolean)
        
        /** Used by the inspector, set to `true` when the property is checkable. */
        get checkable(): boolean
        set checkable(value: boolean)
        
        /** Used by the inspector, set to `true` when the property is checked. */
        get checked(): boolean
        set checked(value: boolean)
        
        /** Used by the inspector, set to `true` when the property is drawn with the editor theme's warning color. This is used for editable children's properties. */
        get draw_warning(): boolean
        set draw_warning(value: boolean)
        
        /** Used by the inspector, set to `true` when the property can add keys for animation. */
        get keying(): boolean
        set keying(value: boolean)
        
        /** Used by the inspector, set to `true` when the property can be deleted by the user. */
        get deletable(): boolean
        set deletable(value: boolean)
        
        /** Do not emit this manually, use the [method emit_changed] method instead. */
        readonly property_changed: Signal4<StringName, any, StringName, boolean>
        
        /** Emit it if you want multiple properties modified at the same time. Do not use if added via [method EditorInspectorPlugin._parse_property]. */
        readonly multiple_properties_changed: Signal2<PackedStringArray | string[], GArray>
        
        /** Emit it if you want to add this value as an animation key (check for keying being enabled first). */
        readonly property_keyed: Signal1<StringName>
        
        /** Emitted when a property was deleted. Used internally. */
        readonly property_deleted: Signal1<StringName>
        
        /** Emit it if you want to key a property with a single value. */
        readonly property_keyed_with_value: Signal2<StringName, any>
        
        /** Emitted when a property was checked. Used internally. */
        readonly property_checked: Signal2<StringName, boolean>
        
        /** Emit it if you want to mark (or unmark) the value of a property for being saved regardless of being equal to the default value.  
         *  The default value is the one the property will get when the node is just instantiated and can come from an ancestor scene in the inheritance/instantiation chain, a script or a builtin class.  
         */
        readonly property_pinned: Signal2<StringName, boolean>
        
        /** Emitted when the revertability (i.e., whether it has a non-default value and thus is displayed with a revert icon) of a property has changed. */
        readonly property_can_revert_changed: Signal2<StringName, boolean>
        
        /** If you want a sub-resource to be edited, emit this signal with the resource. */
        readonly resource_selected: Signal2<string, Resource>
        
        /** Used by sub-inspectors. Emit it if what was selected was an Object ID. */
        readonly object_id_selected: Signal2<StringName, int64>
        
        /** Emitted when selected. Used internally. */
        readonly selected: Signal2<string, int64>
    }
    class EditorPropertyCheck extends EditorProperty {
        constructor(identifier?: any)
    }
    class EditorPropertyDictionaryObject extends RefCounted {
        constructor(identifier?: any)
    }
    class EditorPropertyInteger extends EditorProperty {
        constructor(identifier?: any)
    }
    class EditorPropertyLocalizableString extends EditorProperty {
        constructor(identifier?: any)
    }
    class EditorPropertyMultilineText extends EditorProperty {
        constructor(identifier?: any)
    }
    class EditorPropertyNameProcessor extends Node {
        constructor(identifier?: any)
    }
    class EditorPropertyPath extends EditorProperty {
        constructor(identifier?: any)
    }
    class EditorPropertyResource extends EditorProperty {
        constructor(identifier?: any)
    }
    class EditorPropertyText extends EditorProperty {
        constructor(identifier?: any)
    }
    class EditorPropertyVector2i extends EditorPropertyVectorN {
        constructor(identifier?: any)
    }
    class EditorPropertyVectorN extends EditorProperty {
        constructor(identifier?: any)
    }
    class EditorQuickOpen extends ConfirmationDialog {
        constructor(identifier?: any)
        readonly quick_open: Signal0
    }
    /** Plugin for adding custom converters from one resource format to another in the editor resource picker context menu; for example, converting a [StandardMaterial3D] to a [ShaderMaterial].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorresourceconversionplugin.html  
     */
    class EditorResourceConversionPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Returns the class name of the target type of [Resource] that this plugin converts source resources to. */
        /* gdvirtual */ _converts_to(): string
        
        /** Called to determine whether a particular [Resource] can be converted to the target resource type by this plugin. */
        /* gdvirtual */ _handles(resource: Resource): boolean
        
        /** Takes an input [Resource] and converts it to the type given in [method _converts_to]. The returned [Resource] is the result of the conversion, and the input [Resource] remains unchanged. */
        /* gdvirtual */ _convert(resource: Resource): Resource
    }
    /** Godot editor's control for selecting [Resource] type properties.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorresourcepicker.html  
     */
    class EditorResourcePicker extends HBoxContainer {
        constructor(identifier?: any)
        /** This virtual method is called when updating the context menu of [EditorResourcePicker]. Implement this method to override the "New ..." items with your own options. [param menu_node] is a reference to the [PopupMenu] node.  
         *      
         *  **Note:** Implement [method _handle_menu_selected] to handle these custom items.  
         */
        /* gdvirtual */ _set_create_options(menu_node: Object): void
        
        /** This virtual method can be implemented to handle context menu items not handled by default. See [method _set_create_options]. */
        /* gdvirtual */ _handle_menu_selected(id: int64): boolean
        _update_resource_preview(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: int64): void
        
        /** Returns a list of all allowed types and subtypes corresponding to the [member base_type]. If the [member base_type] is empty, an empty list is returned. */
        get_allowed_types(): PackedStringArray
        
        /** Sets the toggle mode state for the main button. Works only if [member toggle_mode] is set to `true`. */
        set_toggle_pressed(pressed: boolean): void
        
        /** The base type of allowed resource types. Can be a comma-separated list of several options. */
        get base_type(): string
        set base_type(value: string)
        
        /** The edited resource value. */
        get edited_resource(): Resource
        set edited_resource(value: Resource)
        
        /** If `true`, the value can be selected and edited. */
        get editable(): boolean
        set editable(value: boolean)
        
        /** If `true`, the main button with the resource preview works in the toggle mode. Use [method set_toggle_pressed] to manually set the state. */
        get toggle_mode(): boolean
        set toggle_mode(value: boolean)
        
        /** Emitted when the resource value was set and user clicked to edit it. When [param inspect] is `true`, the signal was caused by the context menu "Edit" or "Inspect" option. */
        readonly resource_selected: Signal2<Resource, boolean>
        
        /** Emitted when the value of the edited resource was changed. */
        readonly resource_changed: Signal1<Resource>
    }
    /** A node used to generate previews of resources or files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorresourcepreview.html  
     */
    class EditorResourcePreview extends Node {
        constructor(identifier?: any)
        /** Queue a resource file located at [param path] for preview. Once the preview is ready, the [param receiver]'s [param receiver_func] will be called. The [param receiver_func] must take the following four arguments: [String] path, [Texture2D] preview, [Texture2D] thumbnail_preview, [Variant] userdata. [param userdata] can be anything, and will be returned when [param receiver_func] is called.  
         *      
         *  **Note:** If it was not possible to create the preview the [param receiver_func] will still be called, but the preview will be null.  
         */
        queue_resource_preview(path: string, receiver: Object, receiver_func: StringName, userdata: any): void
        
        /** Queue the [param resource] being edited for preview. Once the preview is ready, the [param receiver]'s [param receiver_func] will be called. The [param receiver_func] must take the following four arguments: [String] path, [Texture2D] preview, [Texture2D] thumbnail_preview, [Variant] userdata. [param userdata] can be anything, and will be returned when [param receiver_func] is called.  
         *      
         *  **Note:** If it was not possible to create the preview the [param receiver_func] will still be called, but the preview will be null.  
         */
        queue_edited_resource_preview(resource: Resource, receiver: Object, receiver_func: StringName, userdata: any): void
        
        /** Create an own, custom preview generator. */
        add_preview_generator(generator: EditorResourcePreviewGenerator): void
        
        /** Removes a custom preview generator. */
        remove_preview_generator(generator: EditorResourcePreviewGenerator): void
        
        /** Check if the resource changed, if so, it will be invalidated and the corresponding signal emitted. */
        check_for_invalidation(path: string): void
        
        /** Emitted if a preview was invalidated (changed). [param path] corresponds to the path of the preview. */
        readonly preview_invalidated: Signal1<string>
    }
    /** Custom generator of previews.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorresourcepreviewgenerator.html  
     */
    class EditorResourcePreviewGenerator extends RefCounted {
        constructor(identifier?: any)
        /** Returns `true` if your generator supports the resource of type [param type]. */
        /* gdvirtual */ _handles(type: string): boolean
        
        /** Generate a preview from a given resource with the specified size. This must always be implemented.  
         *  Returning an empty texture is an OK way to fail and let another generator take care.  
         *  Care must be taken because this function is always called from a thread (not the main thread).  
         *  [param metadata] dictionary can be modified to store file-specific metadata that can be used in [method EditorResourceTooltipPlugin._make_tooltip_for_path] (like image size, sample length etc.).  
         */
        /* gdvirtual */ _generate(resource: Resource, size: Vector2i, metadata: GDictionary): Texture2D
        
        /** Generate a preview directly from a path with the specified size. Implementing this is optional, as default code will load and call [method _generate].  
         *  Returning an empty texture is an OK way to fail and let another generator take care.  
         *  Care must be taken because this function is always called from a thread (not the main thread).  
         *  [param metadata] dictionary can be modified to store file-specific metadata that can be used in [method EditorResourceTooltipPlugin._make_tooltip_for_path] (like image size, sample length etc.).  
         */
        /* gdvirtual */ _generate_from_path(path: string, size: Vector2i, metadata: GDictionary): Texture2D
        
        /** If this function returns `true`, the generator will automatically generate the small previews from the normal preview texture generated by the methods [method _generate] or [method _generate_from_path].  
         *  By default, it returns `false`.  
         */
        /* gdvirtual */ _generate_small_preview_automatically(): boolean
        
        /** If this function returns `true`, the generator will call [method _generate] or [method _generate_from_path] for small previews as well.  
         *  By default, it returns `false`.  
         */
        /* gdvirtual */ _can_generate_small_preview(): boolean
    }
    /** A plugin that advanced tooltip for its handled resource type.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorresourcetooltipplugin.html  
     */
    class EditorResourceTooltipPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Return `true` if the plugin is going to handle the given [Resource] [param type]. */
        /* gdvirtual */ _handles(type: string): boolean
        
        /** Create and return a tooltip that will be displayed when the user hovers a resource under the given [param path] in filesystem dock.  
         *  The [param metadata] dictionary is provided by preview generator (see [method EditorResourcePreviewGenerator._generate]).  
         *  [param base] is the base default tooltip, which is a [VBoxContainer] with a file name, type and size labels. If another plugin handled the same file type, [param base] will be output from the previous plugin. For best result, make sure the base tooltip is part of the returned [Control].  
         *      
         *  **Note:** It's unadvised to use [method ResourceLoader.load], especially with heavy resources like models or textures, because it will make the editor unresponsive when creating the tooltip. You can use [method request_thumbnail] if you want to display a preview in your tooltip.  
         *      
         *  **Note:** If you decide to discard the [param base], make sure to call [method Node.queue_free], because it's not freed automatically.  
         *    
         */
        /* gdvirtual */ _make_tooltip_for_path(path: string, metadata: GDictionary, base: Control): Control
        _thumbnail_ready(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: any): void
        
        /** Requests a thumbnail for the given [TextureRect]. The thumbnail is created asynchronously by [EditorResourcePreview] and automatically set when available. */
        request_thumbnail(path: string, control: TextureRect): void
    }
    class EditorRunBar extends MarginContainer {
        constructor(identifier?: any)
        readonly play_pressed: Signal0
        readonly stop_pressed: Signal0
    }
    class EditorRunNative extends HBoxContainer {
        constructor(identifier?: any)
        readonly native_run: Signal1<any /*EditorExportPreset*/>
    }
    class EditorSceneExporterGLTFSettings extends RefCounted {
        constructor(identifier?: any)
        get copyright(): string
        set copyright(value: string)
        get bake_fps(): float64
        set bake_fps(value: float64)
    }
    /** Imports scenes from third-parties' 3D files.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorsceneformatimporter.html  
     */
    class EditorSceneFormatImporter extends RefCounted {
        static readonly IMPORT_SCENE = 1
        static readonly IMPORT_ANIMATION = 2
        static readonly IMPORT_FAIL_ON_MISSING_DEPENDENCIES = 4
        static readonly IMPORT_GENERATE_TANGENT_ARRAYS = 8
        static readonly IMPORT_USE_NAMED_SKIN_BINDS = 16
        static readonly IMPORT_DISCARD_MESHES_AND_MATERIALS = 32
        static readonly IMPORT_FORCE_DISABLE_MESH_COMPRESSION = 64
        constructor(identifier?: any)
        /* gdvirtual */ _get_import_flags(): int64
        /* gdvirtual */ _get_extensions(): PackedStringArray
        /* gdvirtual */ _import_scene(path: string, flags: int64, options: GDictionary): Object
        /* gdvirtual */ _get_import_options(path: string): void
        /* gdvirtual */ _get_option_visibility(path: string, for_animation: boolean, option: string): any
    }
    /** Importer for Blender's `.blend` scene file format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorsceneformatimporterblend.html  
     */
    class EditorSceneFormatImporterBlend extends EditorSceneFormatImporter {
        constructor(identifier?: any)
    }
    class EditorSceneFormatImporterCollada extends EditorSceneFormatImporter {
        constructor(identifier?: any)
    }
    class EditorSceneFormatImporterESCN extends EditorSceneFormatImporter {
        constructor(identifier?: any)
    }
    /** Importer for the `.fbx` scene file format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorsceneformatimporterfbx2gltf.html  
     */
    class EditorSceneFormatImporterFBX2GLTF extends EditorSceneFormatImporter {
        constructor(identifier?: any)
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_editorsceneformatimportergltf.html */
    class EditorSceneFormatImporterGLTF extends EditorSceneFormatImporter {
        constructor(identifier?: any)
    }
    /** Import FBX files using the ufbx library.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorsceneformatimporterufbx.html  
     */
    class EditorSceneFormatImporterUFBX extends EditorSceneFormatImporter {
        constructor(identifier?: any)
    }
    /** Post-processes scenes after import.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorscenepostimport.html  
     */
    class EditorScenePostImport extends RefCounted {
        constructor(identifier?: any)
        /** Called after the scene was imported. This method must return the modified version of the scene. */
        /* gdvirtual */ _post_import(scene: Node): Object
        
        /** Returns the source file path which got imported (e.g. `res://scene.dae`). */
        get_source_file(): string
    }
    namespace EditorScenePostImportPlugin {
        enum InternalImportCategory {
            INTERNAL_IMPORT_CATEGORY_NODE = 0,
            INTERNAL_IMPORT_CATEGORY_MESH_3D_NODE = 1,
            INTERNAL_IMPORT_CATEGORY_MESH = 2,
            INTERNAL_IMPORT_CATEGORY_MATERIAL = 3,
            INTERNAL_IMPORT_CATEGORY_ANIMATION = 4,
            INTERNAL_IMPORT_CATEGORY_ANIMATION_NODE = 5,
            INTERNAL_IMPORT_CATEGORY_SKELETON_3D_NODE = 6,
            INTERNAL_IMPORT_CATEGORY_MAX = 7,
        }
    }
    /** Plugin to control and modifying the process of importing a scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorscenepostimportplugin.html  
     */
    class EditorScenePostImportPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Override to add internal import options. These will appear in the 3D scene import dialog. Add options via [method add_import_option] and [method add_import_option_advanced]. */
        /* gdvirtual */ _get_internal_import_options(category: int64): void
        
        /** Return true or false whether a given option should be visible. Return null to ignore. */
        /* gdvirtual */ _get_internal_option_visibility(category: int64, for_animation: boolean, option: string): any
        
        /** Return true whether updating the 3D view of the import dialog needs to be updated if an option has changed. */
        /* gdvirtual */ _get_internal_option_update_view_required(category: int64, option: string): any
        
        /** Process a specific node or resource for a given category. */
        /* gdvirtual */ _internal_process(category: int64, base_node: Node, node: Node, resource: Resource): void
        
        /** Override to add general import options. These will appear in the main import dock on the editor. Add options via [method add_import_option] and [method add_import_option_advanced]. */
        /* gdvirtual */ _get_import_options(path: string): void
        
        /** Return true or false whether a given option should be visible. Return null to ignore. */
        /* gdvirtual */ _get_option_visibility(path: string, for_animation: boolean, option: string): any
        
        /** Pre Process the scene. This function is called right after the scene format loader loaded the scene and no changes have been made. */
        /* gdvirtual */ _pre_process(scene: Node): void
        
        /** Post process the scene. This function is called after the final scene has been configured. */
        /* gdvirtual */ _post_process(scene: Node): void
        
        /** Query the value of an option. This function can only be called from those querying visibility, or processing. */
        get_option_value(name: StringName): any
        
        /** Add a specific import option (name and default value only). This function can only be called from [method _get_import_options] and [method _get_internal_import_options]. */
        add_import_option(name: string, value: any): void
        
        /** Add a specific import option. This function can only be called from [method _get_import_options] and [method _get_internal_import_options]. */
        add_import_option_advanced(type: Variant.Type, name: string, default_value: any, hint: PropertyHint = 0, hint_string: string = '', usage_flags: int64 = 6): void
    }
    class EditorSceneTabs extends MarginContainer {
        constructor(identifier?: any)
        _tab_preview_done(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: any): void
        readonly tab_changed: Signal1<int64>
        readonly tab_closed: Signal1<int64>
    }
    /** Base script that can be used to add extension functions to the editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorscript.html  
     */
    class EditorScript extends RefCounted {
        constructor(identifier?: any)
        /** This method is executed by the Editor when **File > Run** is used. */
        /* gdvirtual */ _run(): void
        
        /** Makes [param node] root of the currently opened scene. Only works if the scene is empty. If the [param node] is a scene instance, an inheriting scene will be created. */
        add_root_node(node: Node): void
        
        /** Returns the edited (current) scene's root [Node]. Equivalent of [method EditorInterface.get_edited_scene_root]. */
        get_scene(): Node
        
        /** Returns the [EditorInterface] singleton instance. */
        get_editor_interface(): EditorInterface
    }
    /** Godot editor's control for selecting the `script` property of a [Node].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorscriptpicker.html  
     */
    class EditorScriptPicker extends EditorResourcePicker {
        constructor(identifier?: any)
        /** The owner [Node] of the script property that holds the edited resource. */
        get script_owner(): Node
        set script_owner(value: Node)
    }
    class EditorScriptPreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    /** Manages the SceneTree selection in the editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorselection.html  
     */
    class EditorSelection extends Object {
        constructor(identifier?: any)
        /** Clear the selection. */
        clear(): void
        
        /** Adds a node to the selection.  
         *      
         *  **Note:** The newly selected node will not be automatically edited in the inspector. If you want to edit a node, use [method EditorInterface.edit_node].  
         */
        add_node(node: Node): void
        
        /** Removes a node from the selection. */
        remove_node(node: Node): void
        
        /** Returns the list of selected nodes. */
        get_selected_nodes(): GArray
        
        /** Returns the list of selected nodes, optimized for transform operations (i.e. moving them, rotating, etc.). This list can be used to avoid situations where a node is selected and is also a child/grandchild. */
        get_transformable_selected_nodes(): GArray
        
        /** Emitted when the selection changes. */
        readonly selection_changed: Signal0
    }
    /** Object that holds the project-independent editor settings.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorsettings.html  
     */
    class EditorSettings extends Resource {
        /** Emitted after any editor setting has changed. It's used by various editor plugins to update their visuals on theme changes or logic on configuration changes. */
        static readonly NOTIFICATION_EDITOR_SETTINGS_CHANGED = 10000
        constructor(identifier?: any)
        
        /** Returns `true` if the setting specified by [param name] exists, `false` otherwise. */
        has_setting(name: string): boolean
        
        /** Sets the [param value] of the setting specified by [param name]. This is equivalent to using [method Object.set] on the EditorSettings instance. */
        set_setting(name: string, value: any): void
        
        /** Returns the value of the setting specified by [param name]. This is equivalent to using [method Object.get] on the EditorSettings instance. */
        get_setting(name: string): any
        
        /** Erases the setting whose name is specified by [param property]. */
        erase(property: string): void
        
        /** Sets the initial value of the setting specified by [param name] to [param value]. This is used to provide a value for the Revert button in the Editor Settings. If [param update_current] is true, the current value of the setting will be set to [param value] as well. */
        set_initial_value(name: StringName, value: any, update_current: boolean): void
        
        /** Adds a custom property info to a property. The dictionary must contain:  
         *  - `name`: [String] (the name of the property)  
         *  - `type`: [int] (see [enum Variant.Type])  
         *  - optionally `hint`: [int] (see [enum PropertyHint]) and `hint_string`: [String]  
         *  **Example:**  
         *    
         */
        add_property_info(info: GDictionary): void
        
        /** Sets project-specific metadata with the [param section], [param key] and [param data] specified. This metadata is stored outside the project folder and therefore won't be checked into version control. See also [method get_project_metadata]. */
        set_project_metadata(section: string, key: string, data: any): void
        
        /** Returns project-specific metadata for the [param section] and [param key] specified. If the metadata doesn't exist, [param default] will be returned instead. See also [method set_project_metadata]. */
        get_project_metadata(section: string, key: string, default_: any = <any> {}): any
        
        /** Sets the list of favorite files and directories for this project. */
        set_favorites(dirs: PackedStringArray | string[]): void
        
        /** Returns the list of favorite files and directories for this project. */
        get_favorites(): PackedStringArray
        
        /** Sets the list of recently visited folders in the file dialog for this project. */
        set_recent_dirs(dirs: PackedStringArray | string[]): void
        
        /** Returns the list of recently visited folders in the file dialog for this project. */
        get_recent_dirs(): PackedStringArray
        
        /** Overrides the built-in editor action [param name] with the input actions defined in [param actions_list]. */
        set_builtin_action_override(name: string, actions_list: GArray): void
        
        /** Checks if any settings with the prefix [param setting_prefix] exist in the set of changed settings. See also [method get_changed_settings]. */
        check_changed_settings_in_group(setting_prefix: string): boolean
        
        /** Gets an array of the settings which have been changed since the last save. Note that internally `changed_settings` is cleared after a successful save, so generally the most appropriate place to use this method is when processing [constant NOTIFICATION_EDITOR_SETTINGS_CHANGED]. */
        get_changed_settings(): PackedStringArray
        
        /** Marks the passed editor setting as being changed, see [method get_changed_settings]. Only settings which exist (see [method has_setting]) will be accepted. */
        mark_setting_changed(setting: string): void
        
        /** Emitted after any editor setting has changed. */
        readonly settings_changed: Signal0
    }
    class EditorSettingsDialog extends AcceptDialog {
        constructor(identifier?: any)
        _update_shortcuts(): void
        _settings_changed(): void
    }
    /** Godot editor's control for editing numeric values.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorspinslider.html  
     */
    class EditorSpinSlider extends Range {
        constructor(identifier?: any)
        /** The text that displays to the left of the value. */
        get label(): string
        set label(value: string)
        
        /** The suffix to display after the value (in a faded color). This should generally be a plural word. You may have to use an abbreviation if the suffix is too long to be displayed. */
        get suffix(): string
        set suffix(value: string)
        
        /** If `true`, the slider can't be interacted with. */
        get read_only(): boolean
        set read_only(value: boolean)
        
        /** If `true`, the slider will not draw background. */
        get flat(): boolean
        set flat(value: boolean)
        
        /** If `true`, the slider and up/down arrows are hidden. */
        get hide_slider(): boolean
        set hide_slider(value: boolean)
        
        /** Emitted when the spinner/slider is grabbed. */
        readonly grabbed: Signal0
        
        /** Emitted when the spinner/slider is ungrabbed. */
        readonly ungrabbed: Signal0
        
        /** Emitted when the value form gains focus. */
        readonly value_focus_entered: Signal0
        
        /** Emitted when the value form loses focus. */
        readonly value_focus_exited: Signal0
    }
    /** Base class for [SyntaxHighlighter] used by the [ScriptEditor].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorsyntaxhighlighter.html  
     */
    class EditorSyntaxHighlighter extends SyntaxHighlighter {
        constructor(identifier?: any)
        /** Virtual method which can be overridden to return the syntax highlighter name. */
        /* gdvirtual */ _get_name(): string
        
        /** Virtual method which can be overridden to return the supported language names. */
        /* gdvirtual */ _get_supported_languages(): PackedStringArray
        _get_edited_resource(): RefCounted
    }
    class EditorTexturePreviewPlugin extends EditorResourcePreviewGenerator {
        constructor(identifier?: any)
    }
    class EditorTextureTooltipPlugin extends EditorResourceTooltipPlugin {
        constructor(identifier?: any)
    }
    class EditorTheme extends Theme {
        constructor(identifier?: any)
    }
    class EditorTitleBar extends HBoxContainer {
        constructor(identifier?: any)
    }
    class EditorToaster extends HBoxContainer {
        constructor(identifier?: any)
    }
    /** Plugin for adding custom parsers to extract strings that are to be translated from custom files (.csv, .json etc.).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editortranslationparserplugin.html  
     */
    class EditorTranslationParserPlugin extends RefCounted {
        constructor(identifier?: any)
        /** Override this method to define a custom parsing logic to extract the translatable strings. */
        /* gdvirtual */ _parse_file(path: string, msgids: GArray, msgids_context_plural: GArray): void
        
        /** Gets the list of file extensions to associate with this parser, e.g. `["csv"]`. */
        /* gdvirtual */ _get_recognized_extensions(): PackedStringArray
    }
    namespace EditorUndoRedoManager {
        enum SpecialHistory {
            /** Global history not associated with any scene, but with external resources etc. */
            GLOBAL_HISTORY = 0,
            
            /** History associated with remote inspector. Used when live editing a running project. */
            REMOTE_HISTORY = -9,
            
            /** Invalid "null" history. It's a special value, not associated with any object. */
            INVALID_HISTORY = -99,
        }
    }
    /** Manages undo history of scenes opened in the editor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorundoredomanager.html  
     */
    class EditorUndoRedoManager extends Object {
        constructor(identifier?: any)
        /** Create a new action. After this is called, do all your calls to [method add_do_method], [method add_undo_method], [method add_do_property], and [method add_undo_property], then commit the action with [method commit_action].  
         *  The way actions are merged is dictated by the [param merge_mode] argument. See [enum UndoRedo.MergeMode] for details.  
         *  If [param custom_context] object is provided, it will be used for deducing target history (instead of using the first operation).  
         *  The way undo operation are ordered in actions is dictated by [param backward_undo_ops]. When [param backward_undo_ops] is `false` undo option are ordered in the same order they were added. Which means the first operation to be added will be the first to be undone.  
         */
        create_action(name: string, merge_mode: UndoRedo.MergeMode = 0, custom_context: Object = undefined, backward_undo_ops: boolean = false): void
        
        /** Commit the action. If [param execute] is true (default), all "do" methods/properties are called/set when this function is called. */
        commit_action(execute: boolean = true): void
        
        /** Returns `true` if the [EditorUndoRedoManager] is currently committing the action, i.e. running its "do" method or property change (see [method commit_action]). */
        is_committing_action(): boolean
        
        /** Forces the next operation (e.g. [method add_do_method]) to use the action's history rather than guessing it from the object. This is sometimes needed when a history can't be correctly determined, like for a nested resource that doesn't have a path yet.  
         *  This method should only be used when absolutely necessary, otherwise it might cause invalid history state. For most of complex cases, the `custom_context` parameter of [method create_action] is sufficient.  
         */
        force_fixed_history(): void
        
        /** Register a method that will be called when the action is committed (i.e. the "do" action).  
         *  If this is the first operation, the [param object] will be used to deduce target undo history.  
         */
        add_do_method(object: Object, method: StringName, ...vargargs: any[]): void
        
        /** Register a method that will be called when the action is undone (i.e. the "undo" action).  
         *  If this is the first operation, the [param object] will be used to deduce target undo history.  
         */
        add_undo_method(object: Object, method: StringName, ...vargargs: any[]): void
        
        /** Register a property value change for "do".  
         *  If this is the first operation, the [param object] will be used to deduce target undo history.  
         */
        add_do_property(object: Object, property: StringName, value: any): void
        
        /** Register a property value change for "undo".  
         *  If this is the first operation, the [param object] will be used to deduce target undo history.  
         */
        add_undo_property(object: Object, property: StringName, value: any): void
        
        /** Register a reference for "do" that will be erased if the "do" history is lost. This is useful mostly for new nodes created for the "do" call. Do not use for resources. */
        add_do_reference(object: Object): void
        
        /** Register a reference for "undo" that will be erased if the "undo" history is lost. This is useful mostly for nodes removed with the "do" call (not the "undo" call!). */
        add_undo_reference(object: Object): void
        
        /** Returns the history ID deduced from the given [param object]. It can be used with [method get_history_undo_redo]. */
        get_object_history_id(object: Object): int64
        
        /** Returns the [UndoRedo] object associated with the given history [param id].  
         *  [param id] above `0` are mapped to the opened scene tabs (but it doesn't match their order). [param id] of `0` or lower have special meaning (see [enum SpecialHistory]).  
         *  Best used with [method get_object_history_id]. This method is only provided in case you need some more advanced methods of [UndoRedo] (but keep in mind that directly operating on the [UndoRedo] object might affect editor's stability).  
         */
        get_history_undo_redo(id: int64): UndoRedo
        
        /** Emitted when the list of actions in any history has changed, either when an action is committed or a history is cleared. */
        readonly history_changed: Signal0
        
        /** Emitted when the version of any history has changed as a result of undo or redo call. */
        readonly version_changed: Signal0
    }
    namespace EditorVCSInterface {
        enum ChangeType {
            /** A new file has been added. */
            CHANGE_TYPE_NEW = 0,
            
            /** An earlier added file has been modified. */
            CHANGE_TYPE_MODIFIED = 1,
            
            /** An earlier added file has been renamed. */
            CHANGE_TYPE_RENAMED = 2,
            
            /** An earlier added file has been deleted. */
            CHANGE_TYPE_DELETED = 3,
            
            /** An earlier added file has been typechanged. */
            CHANGE_TYPE_TYPECHANGE = 4,
            
            /** A file is left unmerged. */
            CHANGE_TYPE_UNMERGED = 5,
        }
        enum TreeArea {
            /** A commit is encountered from the commit area. */
            TREE_AREA_COMMIT = 0,
            
            /** A file is encountered from the staged area. */
            TREE_AREA_STAGED = 1,
            
            /** A file is encountered from the unstaged area. */
            TREE_AREA_UNSTAGED = 2,
        }
    }
    /** Version Control System (VCS) interface, which reads and writes to the local VCS in use.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_editorvcsinterface.html  
     */
    class EditorVCSInterface extends Object {
        constructor(identifier?: any)
        /** Initializes the VCS plugin when called from the editor. Returns whether or not the plugin was successfully initialized. A VCS project is initialized at [param project_path]. */
        /* gdvirtual */ _initialize(project_path: string): boolean
        
        /** Set user credentials in the underlying VCS. [param username] and [param password] are used only during HTTPS authentication unless not already mentioned in the remote URL. [param ssh_public_key_path], [param ssh_private_key_path], and [param ssh_passphrase] are only used during SSH authentication. */
        /* gdvirtual */ _set_credentials(username: string, password: string, ssh_public_key_path: string, ssh_private_key_path: string, ssh_passphrase: string): void
        
        /** Returns an [Array] of [Dictionary] items (see [method create_status_file]), each containing the status data of every modified file in the project folder. */
        /* gdvirtual */ _get_modified_files_data(): GArray
        
        /** Stages the file present at [param file_path] to the staged area. */
        /* gdvirtual */ _stage_file(file_path: string): void
        
        /** Unstages the file present at [param file_path] from the staged area to the unstaged area. */
        /* gdvirtual */ _unstage_file(file_path: string): void
        
        /** Discards the changes made in a file present at [param file_path]. */
        /* gdvirtual */ _discard_file(file_path: string): void
        
        /** Commits the currently staged changes and applies the commit [param msg] to the resulting commit. */
        /* gdvirtual */ _commit(msg: string): void
        
        /** Returns an array of [Dictionary] items (see [method create_diff_file], [method create_diff_hunk], [method create_diff_line], [method add_line_diffs_into_diff_hunk] and [method add_diff_hunks_into_diff_file]), each containing information about a diff. If [param identifier] is a file path, returns a file diff, and if it is a commit identifier, then returns a commit diff. */
        /* gdvirtual */ _get_diff(identifier: string, area: int64): GArray
        
        /** Shuts down VCS plugin instance. Called when the user either closes the editor or shuts down the VCS plugin through the editor UI. */
        /* gdvirtual */ _shut_down(): boolean
        
        /** Returns the name of the underlying VCS provider. */
        /* gdvirtual */ _get_vcs_name(): string
        
        /** Returns an [Array] of [Dictionary] items (see [method create_commit]), each containing the data for a past commit. */
        /* gdvirtual */ _get_previous_commits(max_commits: int64): GArray
        
        /** Gets an instance of an [Array] of [String]s containing available branch names in the VCS. */
        /* gdvirtual */ _get_branch_list(): GArray
        
        /** Returns an [Array] of [String]s, each containing the name of a remote configured in the VCS. */
        /* gdvirtual */ _get_remotes(): GArray
        
        /** Creates a new branch named [param branch_name] in the VCS. */
        /* gdvirtual */ _create_branch(branch_name: string): void
        
        /** Remove a branch from the local VCS. */
        /* gdvirtual */ _remove_branch(branch_name: string): void
        
        /** Creates a new remote destination with name [param remote_name] and points it to [param remote_url]. This can be an HTTPS remote or an SSH remote. */
        /* gdvirtual */ _create_remote(remote_name: string, remote_url: string): void
        
        /** Remove a remote from the local VCS. */
        /* gdvirtual */ _remove_remote(remote_name: string): void
        
        /** Gets the current branch name defined in the VCS. */
        /* gdvirtual */ _get_current_branch_name(): string
        
        /** Checks out a [param branch_name] in the VCS. */
        /* gdvirtual */ _checkout_branch(branch_name: string): boolean
        
        /** Pulls changes from the remote. This can give rise to merge conflicts. */
        /* gdvirtual */ _pull(remote: string): void
        
        /** Pushes changes to the [param remote]. If [param force] is `true`, a force push will override the change history already present on the remote. */
        /* gdvirtual */ _push(remote: string, force: boolean): void
        
        /** Fetches new changes from the [param remote], but doesn't write changes to the current working directory. Equivalent to `git fetch`. */
        /* gdvirtual */ _fetch(remote: string): void
        
        /** Returns an [Array] of [Dictionary] items (see [method create_diff_hunk]), each containing a line diff between a file at [param file_path] and the [param text] which is passed in. */
        /* gdvirtual */ _get_line_diff(file_path: string, text: string): GArray
        
        /** Helper function to create a [Dictionary] for storing a line diff. [param new_line_no] is the line number in the new file (can be `-1` if the line is deleted). [param old_line_no] is the line number in the old file (can be `-1` if the line is added). [param content] is the diff text. [param status] is a single character string which stores the line origin. */
        create_diff_line(new_line_no: int64, old_line_no: int64, content: string, status: string): GDictionary
        
        /** Helper function to create a [Dictionary] for storing diff hunk data. [param old_start] is the starting line number in old file. [param new_start] is the starting line number in new file. [param old_lines] is the number of lines in the old file. [param new_lines] is the number of lines in the new file. */
        create_diff_hunk(old_start: int64, new_start: int64, old_lines: int64, new_lines: int64): GDictionary
        
        /** Helper function to create a [Dictionary] for storing old and new diff file paths. */
        create_diff_file(new_file: string, old_file: string): GDictionary
        
        /** Helper function to create a commit [Dictionary] item. [param msg] is the commit message of the commit. [param author] is a single human-readable string containing all the author's details, e.g. the email and name configured in the VCS. [param id] is the identifier of the commit, in whichever format your VCS may provide an identifier to commits. [param unix_timestamp] is the UTC Unix timestamp of when the commit was created. [param offset_minutes] is the timezone offset in minutes, recorded from the system timezone where the commit was created. */
        create_commit(msg: string, author: string, id: string, unix_timestamp: int64, offset_minutes: int64): GDictionary
        
        /** Helper function to create a [Dictionary] used by editor to read the status of a file. */
        create_status_file(file_path: string, change_type: EditorVCSInterface.ChangeType, area: EditorVCSInterface.TreeArea): GDictionary
        
        /** Helper function to add an array of [param diff_hunks] into a [param diff_file]. */
        add_diff_hunks_into_diff_file(diff_file: GDictionary, diff_hunks: GArray): GDictionary
        
        /** Helper function to add an array of [param line_diffs] into a [param diff_hunk]. */
        add_line_diffs_into_diff_hunk(diff_hunk: GDictionary, line_diffs: GArray): GDictionary
        
        /** Pops up an error message in the editor which is shown as coming from the underlying VCS. Use this to show VCS specific error messages. */
        popup_error(msg: string): void
    }
    class EditorValidationPanel extends PanelContainer {
        constructor(identifier?: any)
    }
    class EditorVisualProfiler extends VBoxContainer {
        constructor(identifier?: any)
        readonly enable_profiling: Signal1<boolean>
    }
    class EditorZoomWidget extends HBoxContainer {
        constructor(identifier?: any)
        set_zoom_by_increments(increment: int64, integer_only: boolean): void
        get zoom(): float64
        set zoom(value: float64)
        readonly zoom_changed: Signal1<float64>
    }
    /** Holds a reference to an [Object]'s instance ID.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_encodedobjectasid.html  
     */
    class EncodedObjectAsID extends RefCounted {
        constructor(identifier?: any)
        /** The [Object] identifier stored in this [EncodedObjectAsID] instance. The object instance can be retrieved with [method @GlobalScope.instance_from_id]. */
        get object_id(): int64
        set object_id(value: int64)
    }
    /** Base class for creating custom profilers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_engineprofiler.html  
     */
    class EngineProfiler extends RefCounted {
        constructor(identifier?: any)
        /** Called when the profiler is enabled/disabled, along with a set of [param options]. */
        /* gdvirtual */ _toggle(enable: boolean, options: GArray): void
        
        /** Called when data is added to profiler using [method EngineDebugger.profiler_add_frame_data]. */
        /* gdvirtual */ _add_frame(data: GArray): void
        
        /** Called once every engine iteration when the profiler is active with information about the current frame. All time values are in seconds. Lower values represent faster processing times and are therefore considered better. */
        /* gdvirtual */ _tick(frame_time: float64, process_time: float64, physics_time: float64, physics_frame_time: float64): void
    }
    namespace Environment {
        enum BGMode {
            /** Clears the background using the clear color defined in [member ProjectSettings.rendering/environment/defaults/default_clear_color]. */
            BG_CLEAR_COLOR = 0,
            
            /** Clears the background using a custom clear color. */
            BG_COLOR = 1,
            
            /** Displays a user-defined sky in the background. */
            BG_SKY = 2,
            
            /** Displays a [CanvasLayer] in the background. */
            BG_CANVAS = 3,
            
            /** Keeps on screen every pixel drawn in the background. This is the fastest background mode, but it can only be safely used in fully-interior scenes (no visible sky or sky reflections). If enabled in a scene where the background is visible, "ghost trail" artifacts will be visible when moving the camera. */
            BG_KEEP = 4,
            
            /** Displays a camera feed in the background. */
            BG_CAMERA_FEED = 5,
            
            /** Represents the size of the [enum BGMode] enum. */
            BG_MAX = 6,
        }
        enum AmbientSource {
            /** Gather ambient light from whichever source is specified as the background. */
            AMBIENT_SOURCE_BG = 0,
            
            /** Disable ambient light. This provides a slight performance boost over [constant AMBIENT_SOURCE_SKY]. */
            AMBIENT_SOURCE_DISABLED = 1,
            
            /** Specify a specific [Color] for ambient light. This provides a slight performance boost over [constant AMBIENT_SOURCE_SKY]. */
            AMBIENT_SOURCE_COLOR = 2,
            
            /** Gather ambient light from the [Sky] regardless of what the background is. */
            AMBIENT_SOURCE_SKY = 3,
        }
        enum ReflectionSource {
            /** Use the background for reflections. */
            REFLECTION_SOURCE_BG = 0,
            
            /** Disable reflections. This provides a slight performance boost over other options. */
            REFLECTION_SOURCE_DISABLED = 1,
            
            /** Use the [Sky] for reflections regardless of what the background is. */
            REFLECTION_SOURCE_SKY = 2,
        }
        enum ToneMapper {
            /** Linear tonemapper operator. Reads the linear data and passes it on unmodified. This can cause bright lighting to look blown out, with noticeable clipping in the output colors. */
            TONE_MAPPER_LINEAR = 0,
            
            /** Reinhardt tonemapper operator. Performs a variation on rendered pixels' colors by this formula: `color = color / (1 + color)`. This avoids clipping bright highlights, but the resulting image can look a bit dull. */
            TONE_MAPPER_REINHARDT = 1,
            
            /** Filmic tonemapper operator. This avoids clipping bright highlights, with a resulting image that usually looks more vivid than [constant TONE_MAPPER_REINHARDT]. */
            TONE_MAPPER_FILMIC = 2,
            
            /** Use the Academy Color Encoding System tonemapper. ACES is slightly more expensive than other options, but it handles bright lighting in a more realistic fashion by desaturating it as it becomes brighter. ACES typically has a more contrasted output compared to [constant TONE_MAPPER_REINHARDT] and [constant TONE_MAPPER_FILMIC].  
             *      
             *  **Note:** This tonemapping operator is called "ACES Fitted" in Godot 3.x.  
             */
            TONE_MAPPER_ACES = 3,
        }
        enum GlowBlendMode {
            /** Additive glow blending mode. Mostly used for particles, glows (bloom), lens flare, bright sources. */
            GLOW_BLEND_MODE_ADDITIVE = 0,
            
            /** Screen glow blending mode. Increases brightness, used frequently with bloom. */
            GLOW_BLEND_MODE_SCREEN = 1,
            
            /** Soft light glow blending mode. Modifies contrast, exposes shadows and highlights (vivid bloom). */
            GLOW_BLEND_MODE_SOFTLIGHT = 2,
            
            /** Replace glow blending mode. Replaces all pixels' color by the glow value. This can be used to simulate a full-screen blur effect by tweaking the glow parameters to match the original image's brightness. */
            GLOW_BLEND_MODE_REPLACE = 3,
            
            /** Mixes the glow with the underlying color to avoid increasing brightness as much while still maintaining a glow effect. */
            GLOW_BLEND_MODE_MIX = 4,
        }
        enum FogMode {
            /** Use a physically-based fog model defined primarily by fog density. */
            FOG_MODE_EXPONENTIAL = 0,
            
            /** Use a simple fog model defined by start and end positions and a custom curve. While not physically accurate, this model can be useful when you need more artistic control. */
            FOG_MODE_DEPTH = 1,
        }
        enum SDFGIYScale {
            /** Use 50% scale for SDFGI on the Y (vertical) axis. SDFGI cells will be twice as short as they are wide. This allows providing increased GI detail and reduced light leaking with thin floors and ceilings. This is usually the best choice for scenes that don't feature much verticality. */
            SDFGI_Y_SCALE_50_PERCENT = 0,
            
            /** Use 75% scale for SDFGI on the Y (vertical) axis. This is a balance between the 50% and 100% SDFGI Y scales. */
            SDFGI_Y_SCALE_75_PERCENT = 1,
            
            /** Use 100% scale for SDFGI on the Y (vertical) axis. SDFGI cells will be as tall as they are wide. This is usually the best choice for highly vertical scenes. The downside is that light leaking may become more noticeable with thin floors and ceilings. */
            SDFGI_Y_SCALE_100_PERCENT = 2,
        }
    }
    /** Resource for environment nodes (like [WorldEnvironment]) that define multiple rendering options.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_environment.html  
     */
    class Environment extends Resource {
        constructor(identifier?: any)
        /** Sets the intensity of the glow level [param idx]. A value above `0.0` enables the level. Each level relies on the previous level. This means that enabling higher glow levels will slow down the glow effect rendering, even if previous levels aren't enabled. */
        set_glow_level(idx: int64, intensity: float64): void
        
        /** Returns the intensity of the glow level [param idx]. */
        get_glow_level(idx: int64): float64
        
        /** The background mode. See [enum BGMode] for possible values. */
        get background_mode(): int64
        set background_mode(value: int64)
        
        /** The [Color] displayed for clear areas of the scene. Only effective when using the [constant BG_COLOR] background mode. */
        get background_color(): Color
        set background_color(value: Color)
        
        /** Multiplier for background energy. Increase to make background brighter, decrease to make background dimmer. */
        get background_energy_multiplier(): float64
        set background_energy_multiplier(value: float64)
        
        /** Luminance of background measured in nits (candela per square meter). Only used when [member ProjectSettings.rendering/lights_and_shadows/use_physical_light_units] is enabled. The default value is roughly equivalent to the sky at midday. */
        get background_intensity(): float64
        set background_intensity(value: float64)
        
        /** The maximum layer ID to display. Only effective when using the [constant BG_CANVAS] background mode. */
        get background_canvas_max_layer(): int64
        set background_canvas_max_layer(value: int64)
        
        /** The ID of the camera feed to show in the background. */
        get background_camera_feed_id(): int64
        set background_camera_feed_id(value: int64)
        
        /** The [Sky] resource used for this [Environment]. */
        get sky(): Sky
        set sky(value: Sky)
        
        /** If set to a value greater than `0.0`, overrides the field of view to use for sky rendering. If set to `0.0`, the same FOV as the current [Camera3D] is used for sky rendering. */
        get sky_custom_fov(): float64
        set sky_custom_fov(value: float64)
        
        /** The rotation to use for sky rendering. */
        get sky_rotation(): Vector3
        set sky_rotation(value: Vector3)
        
        /** The ambient light source to use for rendering materials and global illumination. */
        get ambient_light_source(): int64
        set ambient_light_source(value: int64)
        
        /** The ambient light's [Color]. Only effective if [member ambient_light_sky_contribution] is lower than `1.0` (exclusive). */
        get ambient_light_color(): Color
        set ambient_light_color(value: Color)
        
        /** Defines the amount of light that the sky brings on the scene. A value of `0.0` means that the sky's light emission has no effect on the scene illumination, thus all ambient illumination is provided by the ambient light. On the contrary, a value of `1.0` means that  *all*  the light that affects the scene is provided by the sky, thus the ambient light parameter has no effect on the scene.  
         *      
         *  **Note:** [member ambient_light_sky_contribution] is internally clamped between `0.0` and `1.0` (inclusive).  
         */
        get ambient_light_sky_contribution(): float64
        set ambient_light_sky_contribution(value: float64)
        
        /** The ambient light's energy. The higher the value, the stronger the light. Only effective if [member ambient_light_sky_contribution] is lower than `1.0` (exclusive). */
        get ambient_light_energy(): float64
        set ambient_light_energy(value: float64)
        
        /** The reflected (specular) light source. */
        get reflected_light_source(): int64
        set reflected_light_source(value: int64)
        
        /** The tonemapping mode to use. Tonemapping is the process that "converts" HDR values to be suitable for rendering on an LDR display. (Godot doesn't support rendering on HDR displays yet.) */
        get tonemap_mode(): int64
        set tonemap_mode(value: int64)
        
        /** The default exposure used for tonemapping. Higher values result in a brighter image. See also [member tonemap_white]. */
        get tonemap_exposure(): float64
        set tonemap_exposure(value: float64)
        
        /** The white reference value for tonemapping (also called "whitepoint"). Higher values can make highlights look less blown out, and will also slightly darken the whole scene as a result. Only effective if the [member tonemap_mode] isn't set to [constant TONE_MAPPER_LINEAR]. See also [member tonemap_exposure]. */
        get tonemap_white(): float64
        set tonemap_white(value: float64)
        
        /** If `true`, screen-space reflections are enabled. Screen-space reflections are more accurate than reflections from [VoxelGI]s or [ReflectionProbe]s, but are slower and can't reflect surfaces occluded by others.  
         *      
         *  **Note:** SSR is only supported in the Forward+ rendering method, not Mobile or Compatibility.  
         */
        get ssr_enabled(): boolean
        set ssr_enabled(value: boolean)
        
        /** The maximum number of steps for screen-space reflections. Higher values are slower. */
        get ssr_max_steps(): int64
        set ssr_max_steps(value: int64)
        
        /** The fade-in distance for screen-space reflections. Affects the area from the reflected material to the screen-space reflection. Only positive values are valid (negative values will be clamped to `0.0`). */
        get ssr_fade_in(): float64
        set ssr_fade_in(value: float64)
        
        /** The fade-out distance for screen-space reflections. Affects the area from the screen-space reflection to the "global" reflection. Only positive values are valid (negative values will be clamped to `0.0`). */
        get ssr_fade_out(): float64
        set ssr_fade_out(value: float64)
        
        /** The depth tolerance for screen-space reflections. */
        get ssr_depth_tolerance(): float64
        set ssr_depth_tolerance(value: float64)
        
        /** If `true`, the screen-space ambient occlusion effect is enabled. This darkens objects' corners and cavities to simulate ambient light not reaching the entire object as in real life. This works well for small, dynamic objects, but baked lighting or ambient occlusion textures will do a better job at displaying ambient occlusion on large static objects. Godot uses a form of SSAO called Adaptive Screen Space Ambient Occlusion which is itself a form of Horizon Based Ambient Occlusion.  
         *      
         *  **Note:** SSAO is only supported in the Forward+ rendering method, not Mobile or Compatibility.  
         */
        get ssao_enabled(): boolean
        set ssao_enabled(value: boolean)
        
        /** The distance at which objects can occlude each other when calculating screen-space ambient occlusion. Higher values will result in occlusion over a greater distance at the cost of performance and quality. */
        get ssao_radius(): float64
        set ssao_radius(value: float64)
        
        /** The primary screen-space ambient occlusion intensity. Acts as a multiplier for the screen-space ambient occlusion effect. A higher value results in darker occlusion. */
        get ssao_intensity(): float64
        set ssao_intensity(value: float64)
        
        /** The distribution of occlusion. A higher value results in darker occlusion, similar to [member ssao_intensity], but with a sharper falloff. */
        get ssao_power(): float64
        set ssao_power(value: float64)
        
        /** Sets the strength of the additional level of detail for the screen-space ambient occlusion effect. A high value makes the detail pass more prominent, but it may contribute to aliasing in your final image. */
        get ssao_detail(): float64
        set ssao_detail(value: float64)
        
        /** The threshold for considering whether a given point on a surface is occluded or not represented as an angle from the horizon mapped into the `0.0-1.0` range. A value of `1.0` results in no occlusion. */
        get ssao_horizon(): float64
        set ssao_horizon(value: float64)
        
        /** The amount that the screen-space ambient occlusion effect is allowed to blur over the edges of objects. Setting too high will result in aliasing around the edges of objects. Setting too low will make object edges appear blurry. */
        get ssao_sharpness(): float64
        set ssao_sharpness(value: float64)
        
        /** The screen-space ambient occlusion intensity in direct light. In real life, ambient occlusion only applies to indirect light, which means its effects can't be seen in direct light. Values higher than `0` will make the SSAO effect visible in direct light. */
        get ssao_light_affect(): float64
        set ssao_light_affect(value: float64)
        
        /** The screen-space ambient occlusion intensity on materials that have an AO texture defined. Values higher than `0` will make the SSAO effect visible in areas darkened by AO textures. */
        get ssao_ao_channel_affect(): float64
        set ssao_ao_channel_affect(value: float64)
        
        /** If `true`, the screen-space indirect lighting effect is enabled. Screen space indirect lighting is a form of indirect lighting that allows diffuse light to bounce between nearby objects. Screen-space indirect lighting works very similarly to screen-space ambient occlusion, in that it only affects a limited range. It is intended to be used along with a form of proper global illumination like SDFGI or [VoxelGI]. Screen-space indirect lighting is not affected by individual light's [member Light3D.light_indirect_energy].  
         *      
         *  **Note:** SSIL is only supported in the Forward+ rendering method, not Mobile or Compatibility.  
         */
        get ssil_enabled(): boolean
        set ssil_enabled(value: boolean)
        
        /** The distance that bounced lighting can travel when using the screen space indirect lighting effect. A larger value will result in light bouncing further in a scene, but may result in under-sampling artifacts which look like long spikes surrounding light sources. */
        get ssil_radius(): float64
        set ssil_radius(value: float64)
        
        /** The brightness multiplier for the screen-space indirect lighting effect. A higher value will result in brighter light. */
        get ssil_intensity(): float64
        set ssil_intensity(value: float64)
        
        /** The amount that the screen-space indirect lighting effect is allowed to blur over the edges of objects. Setting too high will result in aliasing around the edges of objects. Setting too low will make object edges appear blurry. */
        get ssil_sharpness(): float64
        set ssil_sharpness(value: float64)
        
        /** Amount of normal rejection used when calculating screen-space indirect lighting. Normal rejection uses the normal of a given sample point to reject samples that are facing away from the current pixel. Normal rejection is necessary to avoid light leaking when only one side of an object is illuminated. However, normal rejection can be disabled if light leaking is desirable, such as when the scene mostly contains emissive objects that emit light from faces that cannot be seen from the camera. */
        get ssil_normal_rejection(): float64
        set ssil_normal_rejection(value: float64)
        
        /** If `true`, enables signed distance field global illumination for meshes that have their [member GeometryInstance3D.gi_mode] set to [constant GeometryInstance3D.GI_MODE_STATIC]. SDFGI is a real-time global illumination technique that works well with procedurally generated and user-built levels, including in situations where geometry is created during gameplay. The signed distance field is automatically generated around the camera as it moves. Dynamic lights are supported, but dynamic occluders and emissive surfaces are not.  
         *      
         *  **Note:** SDFGI is only supported in the Forward+ rendering method, not Mobile or Compatibility.  
         *  **Performance:** SDFGI is relatively demanding on the GPU and is not suited to low-end hardware such as integrated graphics (consider [LightmapGI] instead). To improve SDFGI performance, enable [member ProjectSettings.rendering/global_illumination/gi/use_half_resolution] in the Project Settings.  
         *      
         *  **Note:** Meshes should have sufficiently thick walls to avoid light leaks (avoid one-sided walls). For interior levels, enclose your level geometry in a sufficiently large box and bridge the loops to close the mesh.  
         */
        get sdfgi_enabled(): boolean
        set sdfgi_enabled(value: boolean)
        
        /** If `true`, SDFGI uses an occlusion detection approach to reduce light leaking. Occlusion may however introduce dark blotches in certain spots, which may be undesired in mostly outdoor scenes. [member sdfgi_use_occlusion] has a performance impact and should only be enabled when needed. */
        get sdfgi_use_occlusion(): boolean
        set sdfgi_use_occlusion(value: boolean)
        
        /** If `true`, SDFGI takes the environment lighting into account. This should be set to `false` for interior scenes. */
        get sdfgi_read_sky_light(): boolean
        set sdfgi_read_sky_light(value: boolean)
        
        /** The energy multiplier applied to light every time it bounces from a surface when using SDFGI. Values greater than `0.0` will simulate multiple bounces, resulting in a more realistic appearance. Increasing [member sdfgi_bounce_feedback] generally has no performance impact. See also [member sdfgi_energy].  
         *      
         *  **Note:** Values greater than `0.5` can cause infinite feedback loops and should be avoided in scenes with bright materials.  
         *      
         *  **Note:** If [member sdfgi_bounce_feedback] is `0.0`, indirect lighting will not be represented in reflections as light will only bounce one time.  
         */
        get sdfgi_bounce_feedback(): float64
        set sdfgi_bounce_feedback(value: float64)
        
        /** The number of cascades to use for SDFGI (between 1 and 8). A higher number of cascades allows displaying SDFGI further away while preserving detail up close, at the cost of performance. When using SDFGI on small-scale levels, [member sdfgi_cascades] can often be decreased between `1` and `4` to improve performance. */
        get sdfgi_cascades(): int64
        set sdfgi_cascades(value: int64)
        
        /** The cell size to use for the closest SDFGI cascade (in 3D units). Lower values allow SDFGI to be more precise up close, at the cost of making SDFGI updates more demanding. This can cause stuttering when the camera moves fast. Higher values allow SDFGI to cover more ground, while also reducing the performance impact of SDFGI updates.  
         *      
         *  **Note:** This property is linked to [member sdfgi_max_distance] and [member sdfgi_cascade0_distance]. Changing its value will automatically change those properties as well.  
         */
        get sdfgi_min_cell_size(): float64
        set sdfgi_min_cell_size(value: float64)
        
        /**     
         *  **Note:** This property is linked to [member sdfgi_min_cell_size] and [member sdfgi_max_distance]. Changing its value will automatically change those properties as well.  
         */
        get sdfgi_cascade0_distance(): float64
        set sdfgi_cascade0_distance(value: float64)
        
        /** The maximum distance at which SDFGI is visible. Beyond this distance, environment lighting or other sources of GI such as [ReflectionProbe] will be used as a fallback.  
         *      
         *  **Note:** This property is linked to [member sdfgi_min_cell_size] and [member sdfgi_cascade0_distance]. Changing its value will automatically change those properties as well.  
         */
        get sdfgi_max_distance(): float64
        set sdfgi_max_distance(value: float64)
        
        /** The Y scale to use for SDFGI cells. Lower values will result in SDFGI cells being packed together more closely on the Y axis. This is used to balance between quality and covering a lot of vertical ground. [member sdfgi_y_scale] should be set depending on how vertical your scene is (and how fast your camera may move on the Y axis). */
        get sdfgi_y_scale(): int64
        set sdfgi_y_scale(value: int64)
        
        /** The energy multiplier to use for SDFGI. Higher values will result in brighter indirect lighting and reflections. See also [member sdfgi_bounce_feedback]. */
        get sdfgi_energy(): float64
        set sdfgi_energy(value: float64)
        
        /** The normal bias to use for SDFGI probes. Increasing this value can reduce visible streaking artifacts on sloped surfaces, at the cost of increased light leaking. */
        get sdfgi_normal_bias(): float64
        set sdfgi_normal_bias(value: float64)
        
        /** The constant bias to use for SDFGI probes. Increasing this value can reduce visible streaking artifacts on sloped surfaces, at the cost of increased light leaking. */
        get sdfgi_probe_bias(): float64
        set sdfgi_probe_bias(value: float64)
        
        /** If `true`, the glow effect is enabled. This simulates real world eye/camera behavior where bright pixels bleed onto surrounding pixels.  
         *      
         *  **Note:** When using the Mobile rendering method, glow looks different due to the lower dynamic range available in the Mobile rendering method.  
         *      
         *  **Note:** When using the Compatibility rendering method, glow uses a different implementation with some properties being unavailable and hidden from the inspector: `glow_levels/*`, [member glow_normalized], [member glow_strength], [member glow_blend_mode], [member glow_mix], [member glow_map], and [member glow_map_strength]. This implementation is optimized to run on low-end devices and is less flexible as a result.  
         */
        get glow_enabled(): boolean
        set glow_enabled(value: boolean)
        
        /** If `true`, glow levels will be normalized so that summed together their intensities equal `1.0`.  
         *      
         *  **Note:** [member glow_normalized] has no effect when using the Compatibility rendering method, due to this rendering method using a simpler glow implementation optimized for low-end devices.  
         */
        get glow_normalized(): boolean
        set glow_normalized(value: boolean)
        
        /** The overall brightness multiplier of the glow effect. When using the Mobile rendering method (which only supports a lower dynamic range up to `2.0`), this should be increased to `1.5` to compensate. */
        get glow_intensity(): float64
        set glow_intensity(value: float64)
        
        /** The strength of the glow effect. This applies as the glow is blurred across the screen and increases the distance and intensity of the blur. When using the Mobile rendering method, this should be increased to compensate for the lower dynamic range.  
         *      
         *  **Note:** [member glow_strength] has no effect when using the Compatibility rendering method, due to this rendering method using a simpler glow implementation optimized for low-end devices.  
         */
        get glow_strength(): float64
        set glow_strength(value: float64)
        
        /** When using the [constant GLOW_BLEND_MODE_MIX] [member glow_blend_mode], this controls how much the source image is blended with the glow layer. A value of `0.0` makes the glow rendering invisible, while a value of `1.0` is equivalent to [constant GLOW_BLEND_MODE_REPLACE].  
         *      
         *  **Note:** [member glow_mix] has no effect when using the Compatibility rendering method, due to this rendering method using a simpler glow implementation optimized for low-end devices.  
         */
        get glow_mix(): float64
        set glow_mix(value: float64)
        
        /** The bloom's intensity. If set to a value higher than `0`, this will make glow visible in areas darker than the [member glow_hdr_threshold]. */
        get glow_bloom(): float64
        set glow_bloom(value: float64)
        
        /** The glow blending mode.  
         *      
         *  **Note:** [member glow_blend_mode] has no effect when using the Compatibility rendering method, due to this rendering method using a simpler glow implementation optimized for low-end devices.  
         */
        get glow_blend_mode(): int64
        set glow_blend_mode(value: int64)
        
        /** The lower threshold of the HDR glow. When using the Mobile rendering method (which only supports a lower dynamic range up to `2.0`), this may need to be below `1.0` for glow to be visible. A value of `0.9` works well in this case. This value also needs to be decreased below `1.0` when using glow in 2D, as 2D rendering is performed in SDR. */
        get glow_hdr_threshold(): float64
        set glow_hdr_threshold(value: float64)
        
        /** The bleed scale of the HDR glow. */
        get glow_hdr_scale(): float64
        set glow_hdr_scale(value: float64)
        
        /** The higher threshold of the HDR glow. Areas brighter than this threshold will be clamped for the purposes of the glow effect. */
        get glow_hdr_luminance_cap(): float64
        set glow_hdr_luminance_cap(value: float64)
        
        /** How strong of an impact the [member glow_map] should have on the overall glow effect. A strength of `0.0` means the glow map has no effect on the overall glow effect. A strength of `1.0` means the glow has a full effect on the overall glow effect (and can turn off glow entirely in specific areas of the screen if the glow map has black areas).  
         *      
         *  **Note:** [member glow_map_strength] has no effect when using the Compatibility rendering method, due to this rendering method using a simpler glow implementation optimized for low-end devices.  
         */
        get glow_map_strength(): float64
        set glow_map_strength(value: float64)
        
        /** The texture that should be used as a glow map to  *multiply*  the resulting glow color according to [member glow_map_strength]. This can be used to create a "lens dirt" effect. The texture's RGB color channels are used for modulation, but the alpha channel is ignored.  
         *      
         *  **Note:** The texture will be stretched to fit the screen. Therefore, it's recommended to use a texture with an aspect ratio that matches your project's base aspect ratio (typically 16:9).  
         *      
         *  **Note:** [member glow_map] has no effect when using the Compatibility rendering method, due to this rendering method using a simpler glow implementation optimized for low-end devices.  
         */
        get glow_map(): Texture2D
        set glow_map(value: Texture2D)
        
        /** If `true`, fog effects are enabled. */
        get fog_enabled(): boolean
        set fog_enabled(value: boolean)
        
        /** The fog mode. See [enum FogMode] for possible values. */
        get fog_mode(): int64
        set fog_mode(value: int64)
        
        /** The fog's color. */
        get fog_light_color(): Color
        set fog_light_color(value: Color)
        
        /** The fog's brightness. Higher values result in brighter fog. */
        get fog_light_energy(): float64
        set fog_light_energy(value: float64)
        
        /** If set above `0.0`, renders the scene's directional light(s) in the fog color depending on the view angle. This can be used to give the impression that the sun is "piercing" through the fog. */
        get fog_sun_scatter(): float64
        set fog_sun_scatter(value: float64)
        
        /** The fog density to be used. This is demonstrated in different ways depending on the [member fog_mode] mode chosen:  
         *  **Exponential Fog Mode:** Higher values result in denser fog. The fog rendering is exponential like in real life.  
         *  **Depth Fog mode:** The maximum intensity of the deep fog, effect will appear in the distance (relative to the camera). At `1.0` the fog will fully obscure the scene, at `0.0` the fog will not be visible.  
         */
        get fog_density(): float64
        set fog_density(value: float64)
        
        /** If set above `0.0` (exclusive), blends between the fog's color and the color of the background [Sky]. This has a small performance cost when set above `0.0`. Must have [member background_mode] set to [constant BG_SKY].  
         *  This is useful to simulate [url=https://en.wikipedia.org/wiki/Aerial_perspective]aerial perspective[/url] in large scenes with low density fog. However, it is not very useful for high-density fog, as the sky will shine through. When set to `1.0`, the fog color comes completely from the [Sky]. If set to `0.0`, aerial perspective is disabled.  
         */
        get fog_aerial_perspective(): float64
        set fog_aerial_perspective(value: float64)
        
        /** The factor to use when affecting the sky with non-volumetric fog. `1.0` means that fog can fully obscure the sky. Lower values reduce the impact of fog on sky rendering, with `0.0` not affecting sky rendering at all.  
         *      
         *  **Note:** [member fog_sky_affect] has no visual effect if [member fog_aerial_perspective] is `1.0`.  
         */
        get fog_sky_affect(): float64
        set fog_sky_affect(value: float64)
        
        /** The height at which the height fog effect begins. */
        get fog_height(): float64
        set fog_height(value: float64)
        
        /** The density used to increase fog as height decreases. To make fog increase as height increases, use a negative value. */
        get fog_height_density(): float64
        set fog_height_density(value: float64)
        
        /** The fog depth's intensity curve. A number of presets are available in the Inspector by right-clicking the curve. Only available when [member fog_mode] is set to [constant FOG_MODE_DEPTH]. */
        get fog_depth_curve(): float64
        set fog_depth_curve(value: float64)
        
        /** The fog's depth starting distance from the camera. Only available when [member fog_mode] is set to [constant FOG_MODE_DEPTH]. */
        get fog_depth_begin(): float64
        set fog_depth_begin(value: float64)
        
        /** The fog's depth end distance from the camera. If this value is set to `0`, it will be equal to the current camera's [member Camera3D.far] value. Only available when [member fog_mode] is set to [constant FOG_MODE_DEPTH]. */
        get fog_depth_end(): float64
        set fog_depth_end(value: float64)
        
        /** Enables the volumetric fog effect. Volumetric fog uses a screen-aligned froxel buffer to calculate accurate volumetric scattering in the short to medium range. Volumetric fog interacts with [FogVolume]s and lights to calculate localized and global fog. Volumetric fog uses a PBR single-scattering model based on extinction, scattering, and emission which it exposes to users as density, albedo, and emission.  
         *      
         *  **Note:** Volumetric fog is only supported in the Forward+ rendering method, not Mobile or Compatibility.  
         */
        get volumetric_fog_enabled(): boolean
        set volumetric_fog_enabled(value: boolean)
        
        /** The base  *exponential*  density of the volumetric fog. Set this to the lowest density you want to have globally. [FogVolume]s can be used to add to or subtract from this density in specific areas. Fog rendering is exponential as in real life.  
         *  A value of `0.0` disables global volumetric fog while allowing [FogVolume]s to display volumetric fog in specific areas.  
         *  To make volumetric fog work as a volumetric  *lighting*  solution, set [member volumetric_fog_density] to the lowest non-zero value (`0.0001`) then increase lights' [member Light3D.light_volumetric_fog_energy] to values between `10000` and `100000` to compensate for the very low density.  
         */
        get volumetric_fog_density(): float64
        set volumetric_fog_density(value: float64)
        
        /** The [Color] of the volumetric fog when interacting with lights. Mist and fog have an albedo close to `Color(1, 1, 1, 1)` while smoke has a darker albedo. */
        get volumetric_fog_albedo(): Color
        set volumetric_fog_albedo(value: Color)
        
        /** The emitted light from the volumetric fog. Even with emission, volumetric fog will not cast light onto other surfaces. Emission is useful to establish an ambient color. As the volumetric fog effect uses single-scattering only, fog tends to need a little bit of emission to soften the harsh shadows. */
        get volumetric_fog_emission(): Color
        set volumetric_fog_emission(value: Color)
        
        /** The brightness of the emitted light from the volumetric fog. */
        get volumetric_fog_emission_energy(): float64
        set volumetric_fog_emission_energy(value: float64)
        
        /** Scales the strength of Global Illumination used in the volumetric fog's albedo color. A value of `0.0` means that Global Illumination will not impact the volumetric fog. [member volumetric_fog_gi_inject] has a small performance cost when set above `0.0`.  
         *      
         *  **Note:** This has no visible effect if [member volumetric_fog_density] is `0.0` or if [member volumetric_fog_albedo] is a fully black color.  
         *      
         *  **Note:** Only [VoxelGI] and SDFGI ([member Environment.sdfgi_enabled]) are taken into account when using [member volumetric_fog_gi_inject]. Global illumination from [LightmapGI], [ReflectionProbe] and SSIL (see [member ssil_enabled]) will be ignored by volumetric fog.  
         */
        get volumetric_fog_gi_inject(): float64
        set volumetric_fog_gi_inject(value: float64)
        
        /** The direction of scattered light as it goes through the volumetric fog. A value close to `1.0` means almost all light is scattered forward. A value close to `0.0` means light is scattered equally in all directions. A value close to `-1.0` means light is scattered mostly backward. Fog and mist scatter light slightly forward, while smoke scatters light equally in all directions. */
        get volumetric_fog_anisotropy(): float64
        set volumetric_fog_anisotropy(value: float64)
        
        /** The distance over which the volumetric fog is computed. Increase to compute fog over a greater range, decrease to add more detail when a long range is not needed. For best quality fog, keep this as low as possible. See also [member ProjectSettings.rendering/environment/volumetric_fog/volume_depth]. */
        get volumetric_fog_length(): float64
        set volumetric_fog_length(value: float64)
        
        /** The distribution of size down the length of the froxel buffer. A higher value compresses the froxels closer to the camera and places more detail closer to the camera. */
        get volumetric_fog_detail_spread(): float64
        set volumetric_fog_detail_spread(value: float64)
        
        /** Scales the strength of ambient light used in the volumetric fog. A value of `0.0` means that ambient light will not impact the volumetric fog. [member volumetric_fog_ambient_inject] has a small performance cost when set above `0.0`.  
         *      
         *  **Note:** This has no visible effect if [member volumetric_fog_density] is `0.0` or if [member volumetric_fog_albedo] is a fully black color.  
         */
        get volumetric_fog_ambient_inject(): float64
        set volumetric_fog_ambient_inject(value: float64)
        
        /** The factor to use when affecting the sky with volumetric fog. `1.0` means that volumetric fog can fully obscure the sky. Lower values reduce the impact of volumetric fog on sky rendering, with `0.0` not affecting sky rendering at all.  
         *      
         *  **Note:** [member volumetric_fog_sky_affect] also affects [FogVolume]s, even if [member volumetric_fog_density] is `0.0`. If you notice [FogVolume]s are disappearing when looking towards the sky, set [member volumetric_fog_sky_affect] to `1.0`.  
         */
        get volumetric_fog_sky_affect(): float64
        set volumetric_fog_sky_affect(value: float64)
        
        /** Enables temporal reprojection in the volumetric fog. Temporal reprojection blends the current frame's volumetric fog with the last frame's volumetric fog to smooth out jagged edges. The performance cost is minimal; however, it leads to moving [FogVolume]s and [Light3D]s "ghosting" and leaving a trail behind them. When temporal reprojection is enabled, try to avoid moving [FogVolume]s or [Light3D]s too fast. Short-lived dynamic lighting effects should have [member Light3D.light_volumetric_fog_energy] set to `0.0` to avoid ghosting. */
        get volumetric_fog_temporal_reprojection_enabled(): boolean
        set volumetric_fog_temporal_reprojection_enabled(value: boolean)
        
        /** The amount by which to blend the last frame with the current frame. A higher number results in smoother volumetric fog, but makes "ghosting" much worse. A lower value reduces ghosting but can result in the per-frame temporal jitter becoming visible. */
        get volumetric_fog_temporal_reprojection_amount(): float64
        set volumetric_fog_temporal_reprojection_amount(value: float64)
        
        /** If `true`, enables the `adjustment_*` properties provided by this resource. If `false`, modifications to the `adjustment_*` properties will have no effect on the rendered scene. */
        get adjustment_enabled(): boolean
        set adjustment_enabled(value: boolean)
        
        /** The global brightness value of the rendered scene. Effective only if [member adjustment_enabled] is `true`. */
        get adjustment_brightness(): float64
        set adjustment_brightness(value: float64)
        
        /** The global contrast value of the rendered scene (default value is 1). Effective only if [member adjustment_enabled] is `true`. */
        get adjustment_contrast(): float64
        set adjustment_contrast(value: float64)
        
        /** The global color saturation value of the rendered scene (default value is 1). Effective only if [member adjustment_enabled] is `true`. */
        get adjustment_saturation(): float64
        set adjustment_saturation(value: float64)
        
        /** The [Texture2D] or [Texture3D] lookup table (LUT) to use for the built-in post-process color grading. Can use a [GradientTexture1D] for a 1-dimensional LUT, or a [Texture3D] for a more complex LUT. Effective only if [member adjustment_enabled] is `true`. */
        get adjustment_color_correction(): Texture2D | Texture3D
        set adjustment_color_correction(value: Texture2D | Texture3D)
    }
    class EventListenerLineEdit extends LineEdit {
        constructor(identifier?: any)
        readonly event_changed: Signal1<InputEvent>
    }
    class ExportTemplateManager extends AcceptDialog {
        constructor(identifier?: any)
    }
    /** A class that stores an expression you can execute.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_expression.html  
     */
    class Expression extends RefCounted {
        constructor(identifier?: any)
        /** Parses the expression and returns an [enum Error] code.  
         *  You can optionally specify names of variables that may appear in the expression with [param input_names], so that you can bind them when it gets executed.  
         */
        parse(expression: string, input_names: PackedStringArray | string[] = []): GError
        
        /** Executes the expression that was previously parsed by [method parse] and returns the result. Before you use the returned object, you should check if the method failed by calling [method has_execute_failed].  
         *  If you defined input variables in [method parse], you can specify their values in the inputs array, in the same order.  
         */
        execute(inputs: GArray = [], base_instance: Object = undefined, show_error: boolean = true, const_calls_only: boolean = false): any
        
        /** Returns `true` if [method execute] has failed. */
        has_execute_failed(): boolean
        
        /** Returns the error text if [method parse] or [method execute] has failed. */
        get_error_text(): string
    }
    /** Handles FBX documents.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_fbxdocument.html  
     */
    class FBXDocument extends GLTFDocument {
        constructor(identifier?: any)
    }
    class FBXImporterManager extends ConfirmationDialog {
        constructor(identifier?: any)
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_fbxstate.html */
    class FBXState extends GLTFState {
        constructor(identifier?: any)
        /** If `true`, the import process used auxiliary nodes called geometry helper nodes. These nodes help preserve the pivots and transformations of the original 3D model during import. */
        get allow_geometry_helper_nodes(): boolean
        set allow_geometry_helper_nodes(value: boolean)
    }
    namespace FastNoiseLite {
        enum NoiseType {
            /** A lattice of points are assigned random values then interpolated based on neighboring values. */
            TYPE_VALUE = 5,
            
            /** Similar to Value noise, but slower. Has more variance in peaks and valleys.  
             *  Cubic noise can be used to avoid certain artifacts when using value noise to create a bumpmap. In general, you should always use this mode if the value noise is being used for a heightmap or bumpmap.  
             */
            TYPE_VALUE_CUBIC = 4,
            
            /** A lattice of random gradients. Their dot products are interpolated to obtain values in between the lattices. */
            TYPE_PERLIN = 3,
            
            /** Cellular includes both Worley noise and Voronoi diagrams which creates various regions of the same value. */
            TYPE_CELLULAR = 2,
            
            /** As opposed to [constant TYPE_PERLIN], gradients exist in a simplex lattice rather than a grid lattice, avoiding directional artifacts. */
            TYPE_SIMPLEX = 0,
            
            /** Modified, higher quality version of [constant TYPE_SIMPLEX], but slower. */
            TYPE_SIMPLEX_SMOOTH = 1,
        }
        enum FractalType {
            /** No fractal noise. */
            FRACTAL_NONE = 0,
            
            /** Method using Fractional Brownian Motion to combine octaves into a fractal. */
            FRACTAL_FBM = 1,
            
            /** Method of combining octaves into a fractal resulting in a "ridged" look. */
            FRACTAL_RIDGED = 2,
            
            /** Method of combining octaves into a fractal with a ping pong effect. */
            FRACTAL_PING_PONG = 3,
        }
        enum CellularDistanceFunction {
            /** Euclidean distance to the nearest point. */
            DISTANCE_EUCLIDEAN = 0,
            
            /** Squared Euclidean distance to the nearest point. */
            DISTANCE_EUCLIDEAN_SQUARED = 1,
            
            /** Manhattan distance (taxicab metric) to the nearest point. */
            DISTANCE_MANHATTAN = 2,
            
            /** Blend of [constant DISTANCE_EUCLIDEAN] and [constant DISTANCE_MANHATTAN] to give curved cell boundaries */
            DISTANCE_HYBRID = 3,
        }
        enum CellularReturnType {
            /** The cellular distance function will return the same value for all points within a cell. */
            RETURN_CELL_VALUE = 0,
            
            /** The cellular distance function will return a value determined by the distance to the nearest point. */
            RETURN_DISTANCE = 1,
            
            /** The cellular distance function returns the distance to the second-nearest point. */
            RETURN_DISTANCE2 = 2,
            
            /** The distance to the nearest point is added to the distance to the second-nearest point. */
            RETURN_DISTANCE2_ADD = 3,
            
            /** The distance to the nearest point is subtracted from the distance to the second-nearest point. */
            RETURN_DISTANCE2_SUB = 4,
            
            /** The distance to the nearest point is multiplied with the distance to the second-nearest point. */
            RETURN_DISTANCE2_MUL = 5,
            
            /** The distance to the nearest point is divided by the distance to the second-nearest point. */
            RETURN_DISTANCE2_DIV = 6,
        }
        enum DomainWarpType {
            /** The domain is warped using the simplex noise algorithm. */
            DOMAIN_WARP_SIMPLEX = 0,
            
            /** The domain is warped using a simplified version of the simplex noise algorithm. */
            DOMAIN_WARP_SIMPLEX_REDUCED = 1,
            
            /** The domain is warped using a simple noise grid (not as smooth as the other methods, but more performant). */
            DOMAIN_WARP_BASIC_GRID = 2,
        }
        enum DomainWarpFractalType {
            /** No fractal noise for warping the space. */
            DOMAIN_WARP_FRACTAL_NONE = 0,
            
            /** Warping the space progressively, octave for octave, resulting in a more "liquified" distortion. */
            DOMAIN_WARP_FRACTAL_PROGRESSIVE = 1,
            
            /** Warping the space independently for each octave, resulting in a more chaotic distortion. */
            DOMAIN_WARP_FRACTAL_INDEPENDENT = 2,
        }
    }
    /** Generates noise using the FastNoiseLite library.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_fastnoiselite.html  
     */
    class FastNoiseLite extends Noise {
        constructor(identifier?: any)
        _changed(): void
        
        /** The noise algorithm used. See [enum NoiseType]. */
        get noise_type(): int64
        set noise_type(value: int64)
        
        /** The random number seed for all noise types. */
        get seed(): int64
        set seed(value: int64)
        
        /** The frequency for all noise types. Low frequency results in smooth noise while high frequency results in rougher, more granular noise. */
        get frequency(): float64
        set frequency(value: float64)
        
        /** Translate the noise input coordinates by the given [Vector3]. */
        get offset(): Vector3
        set offset(value: Vector3)
        
        /** The method for combining octaves into a fractal. See [enum FractalType]. */
        get fractal_type(): int64
        set fractal_type(value: int64)
        
        /** The number of noise layers that are sampled to get the final value for fractal noise types. */
        get fractal_octaves(): int64
        set fractal_octaves(value: int64)
        
        /** Frequency multiplier between subsequent octaves. Increasing this value results in higher octaves producing noise with finer details and a rougher appearance. */
        get fractal_lacunarity(): float64
        set fractal_lacunarity(value: float64)
        
        /** Determines the strength of each subsequent layer of noise in fractal noise.  
         *  A low value places more emphasis on the lower frequency base layers, while a high value puts more emphasis on the higher frequency layers.  
         */
        get fractal_gain(): float64
        set fractal_gain(value: float64)
        
        /** Higher weighting means higher octaves have less impact if lower octaves have a large impact. */
        get fractal_weighted_strength(): float64
        set fractal_weighted_strength(value: float64)
        
        /** Sets the strength of the fractal ping pong type. */
        get fractal_ping_pong_strength(): float64
        set fractal_ping_pong_strength(value: float64)
        
        /** Determines how the distance to the nearest/second-nearest point is computed. See [enum CellularDistanceFunction] for options. */
        get cellular_distance_function(): int64
        set cellular_distance_function(value: int64)
        
        /** Maximum distance a point can move off of its grid position. Set to `0` for an even grid. */
        get cellular_jitter(): float64
        set cellular_jitter(value: float64)
        
        /** Return type from cellular noise calculations. See [enum CellularReturnType]. */
        get cellular_return_type(): int64
        set cellular_return_type(value: int64)
        
        /** If enabled, another FastNoiseLite instance is used to warp the space, resulting in a distortion of the noise. */
        get domain_warp_enabled(): boolean
        set domain_warp_enabled(value: boolean)
        
        /** Sets the warp algorithm. See [enum DomainWarpType]. */
        get domain_warp_type(): int64
        set domain_warp_type(value: int64)
        
        /** Sets the maximum warp distance from the origin. */
        get domain_warp_amplitude(): float64
        set domain_warp_amplitude(value: float64)
        
        /** Frequency of the noise which warps the space. Low frequency results in smooth noise while high frequency results in rougher, more granular noise. */
        get domain_warp_frequency(): float64
        set domain_warp_frequency(value: float64)
        
        /** The method for combining octaves into a fractal which is used to warp the space. See [enum DomainWarpFractalType]. */
        get domain_warp_fractal_type(): int64
        set domain_warp_fractal_type(value: int64)
        
        /** The number of noise layers that are sampled to get the final value for the fractal noise which warps the space. */
        get domain_warp_fractal_octaves(): int64
        set domain_warp_fractal_octaves(value: int64)
        
        /** Octave lacunarity of the fractal noise which warps the space. Increasing this value results in higher octaves producing noise with finer details and a rougher appearance. */
        get domain_warp_fractal_lacunarity(): float64
        set domain_warp_fractal_lacunarity(value: float64)
        
        /** Determines the strength of each subsequent layer of the noise which is used to warp the space.  
         *  A low value places more emphasis on the lower frequency base layers, while a high value puts more emphasis on the higher frequency layers.  
         */
        get domain_warp_fractal_gain(): float64
        set domain_warp_fractal_gain(value: float64)
    }
    namespace FileAccess {
        enum ModeFlags {
            /** Opens the file for read operations. The cursor is positioned at the beginning of the file. */
            READ = 1,
            
            /** Opens the file for write operations. The file is created if it does not exist, and truncated if it does.  
             *      
             *  **Note:** When creating a file it must be in an already existing directory. To recursively create directories for a file path, see [method DirAccess.make_dir_recursive].  
             */
            WRITE = 2,
            
            /** Opens the file for read and write operations. Does not truncate the file. The cursor is positioned at the beginning of the file. */
            READ_WRITE = 3,
            
            /** Opens the file for read and write operations. The file is created if it does not exist, and truncated if it does. The cursor is positioned at the beginning of the file.  
             *      
             *  **Note:** When creating a file it must be in an already existing directory. To recursively create directories for a file path, see [method DirAccess.make_dir_recursive].  
             */
            WRITE_READ = 7,
        }
        enum CompressionMode {
            /** Uses the [url=https://fastlz.org/]FastLZ[/url] compression method. */
            COMPRESSION_FASTLZ = 0,
            
            /** Uses the [url=https://en.wikipedia.org/wiki/DEFLATE]DEFLATE[/url] compression method. */
            COMPRESSION_DEFLATE = 1,
            
            /** Uses the [url=https://facebook.github.io/zstd/]Zstandard[/url] compression method. */
            COMPRESSION_ZSTD = 2,
            
            /** Uses the [url=https://www.gzip.org/]gzip[/url] compression method. */
            COMPRESSION_GZIP = 3,
            
            /** Uses the [url=https://github.com/google/brotli]brotli[/url] compression method (only decompression is supported). */
            COMPRESSION_BROTLI = 4,
        }
        enum UnixPermissionFlags {
            /** Read for owner bit. */
            UNIX_READ_OWNER = 256,
            
            /** Write for owner bit. */
            UNIX_WRITE_OWNER = 128,
            
            /** Execute for owner bit. */
            UNIX_EXECUTE_OWNER = 64,
            
            /** Read for group bit. */
            UNIX_READ_GROUP = 32,
            
            /** Write for group bit. */
            UNIX_WRITE_GROUP = 16,
            
            /** Execute for group bit. */
            UNIX_EXECUTE_GROUP = 8,
            
            /** Read for other bit. */
            UNIX_READ_OTHER = 4,
            
            /** Write for other bit. */
            UNIX_WRITE_OTHER = 2,
            
            /** Execute for other bit. */
            UNIX_EXECUTE_OTHER = 1,
            
            /** Set user id on execution bit. */
            UNIX_SET_USER_ID = 2048,
            
            /** Set group id on execution bit. */
            UNIX_SET_GROUP_ID = 1024,
            
            /** Restricted deletion (sticky) bit. */
            UNIX_RESTRICTED_DELETE = 512,
        }
    }
    /** Provides methods for file reading and writing operations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_fileaccess.html  
     */
    class FileAccess extends RefCounted {
        constructor(identifier?: any)
        /** Creates a new [FileAccess] object and opens the file for writing or reading, depending on the flags.  
         *  Returns `null` if opening the file failed. You can use [method get_open_error] to check the error that occurred.  
         */
        static open(path: string, flags: FileAccess.ModeFlags): FileAccess
        
        /** Creates a new [FileAccess] object and opens an encrypted file in write or read mode. You need to pass a binary key to encrypt/decrypt it.  
         *      
         *  **Note:** The provided key must be 32 bytes long.  
         *  Returns `null` if opening the file failed. You can use [method get_open_error] to check the error that occurred.  
         */
        static open_encrypted(path: string, mode_flags: FileAccess.ModeFlags, key: PackedByteArray | byte[] | ArrayBuffer): FileAccess
        
        /** Creates a new [FileAccess] object and opens an encrypted file in write or read mode. You need to pass a password to encrypt/decrypt it.  
         *  Returns `null` if opening the file failed. You can use [method get_open_error] to check the error that occurred.  
         */
        static open_encrypted_with_pass(path: string, mode_flags: FileAccess.ModeFlags, pass: string): FileAccess
        
        /** Creates a new [FileAccess] object and opens a compressed file for reading or writing.  
         *      
         *  **Note:** [method open_compressed] can only read files that were saved by Godot, not third-party compression formats. See [url=https://github.com/godotengine/godot/issues/28999]GitHub issue #28999[/url] for a workaround.  
         *  Returns `null` if opening the file failed. You can use [method get_open_error] to check the error that occurred.  
         */
        static open_compressed(path: string, mode_flags: FileAccess.ModeFlags, compression_mode: FileAccess.CompressionMode = 0): FileAccess
        
        /** Returns the result of the last [method open] call in the current thread. */
        static get_open_error(): GError
        
        /** Returns the whole [param path] file contents as a [PackedByteArray] without any decoding.  
         *  Returns an empty [PackedByteArray] if an error occurred while opening the file. You can use [method get_open_error] to check the error that occurred.  
         */
        static get_file_as_bytes(path: string): PackedByteArray
        
        /** Returns the whole [param path] file contents as a [String]. Text is interpreted as being UTF-8 encoded.  
         *  Returns an empty [String] if an error occurred while opening the file. You can use [method get_open_error] to check the error that occurred.  
         */
        static get_file_as_string(path: string): string
        
        /** Resizes the file to a specified length. The file must be open in a mode that permits writing. If the file is extended, NUL characters are appended. If the file is truncated, all data from the end file to the original length of the file is lost. */
        resize(length: int64): GError
        
        /** Writes the file's buffer to disk. Flushing is automatically performed when the file is closed. This means you don't need to call [method flush] manually before closing a file. Still, calling [method flush] can be used to ensure the data is safe even if the project crashes instead of being closed gracefully.  
         *      
         *  **Note:** Only call [method flush] when you actually need it. Otherwise, it will decrease performance due to constant disk writes.  
         */
        flush(): void
        
        /** Returns the path as a [String] for the current open file. */
        get_path(): string
        
        /** Returns the absolute path as a [String] for the current open file. */
        get_path_absolute(): string
        
        /** Returns `true` if the file is currently opened. */
        is_open(): boolean
        
        /** Changes the file reading/writing cursor to the specified position (in bytes from the beginning of the file). */
        seek(position: int64): void
        
        /** Changes the file reading/writing cursor to the specified position (in bytes from the end of the file).  
         *      
         *  **Note:** This is an offset, so you should use negative numbers or the cursor will be at the end of the file.  
         */
        seek_end(position: int64 = 0): void
        
        /** Returns the file cursor's position. */
        get_position(): int64
        
        /** Returns the size of the file in bytes. */
        get_length(): int64
        
        /** Returns `true` if the file cursor has already read past the end of the file.  
         *      
         *  **Note:** `eof_reached() == false` cannot be used to check whether there is more data available. To loop while there is more data available, use:  
         *    
         */
        eof_reached(): boolean
        
        /** Returns the next 8 bits from the file as an integer. See [method store_8] for details on what values can be stored and retrieved this way. */
        get_8(): int64
        
        /** Returns the next 16 bits from the file as an integer. See [method store_16] for details on what values can be stored and retrieved this way. */
        get_16(): int64
        
        /** Returns the next 32 bits from the file as an integer. See [method store_32] for details on what values can be stored and retrieved this way. */
        get_32(): int64
        
        /** Returns the next 64 bits from the file as an integer. See [method store_64] for details on what values can be stored and retrieved this way. */
        get_64(): int64
        
        /** Returns the next 32 bits from the file as a floating-point number. */
        get_float(): float64
        
        /** Returns the next 64 bits from the file as a floating-point number. */
        get_double(): float64
        
        /** Returns the next bits from the file as a floating-point number. */
        get_real(): float64
        
        /** Returns next [param length] bytes of the file as a [PackedByteArray]. */
        get_buffer(length: int64): PackedByteArray
        
        /** Returns the next line of the file as a [String]. The returned string doesn't include newline (`\n`) or carriage return (`\r`) characters, but does include any other leading or trailing whitespace.  
         *  Text is interpreted as being UTF-8 encoded.  
         */
        get_line(): string
        
        /** Returns the next value of the file in CSV (Comma-Separated Values) format. You can pass a different delimiter [param delim] to use other than the default `","` (comma). This delimiter must be one-character long, and cannot be a double quotation mark.  
         *  Text is interpreted as being UTF-8 encoded. Text values must be enclosed in double quotes if they include the delimiter character. Double quotes within a text value can be escaped by doubling their occurrence.  
         *  For example, the following CSV lines are valid and will be properly parsed as two strings each:  
         *  [codeblock lang=text]  
         *  Alice,"Hello, Bob!"  
         *  Bob,Alice! What a surprise!  
         *  Alice,"I thought you'd reply with ""Hello, world""."  
         *  [/codeblock]  
         *  Note how the second line can omit the enclosing quotes as it does not include the delimiter. However it  *could*  very well use quotes, it was only written without for demonstration purposes. The third line must use `""` for each quotation mark that needs to be interpreted as such instead of the end of a text value.  
         */
        get_csv_line(delim: string = ','): PackedStringArray
        
        /** Returns the whole file as a [String]. Text is interpreted as being UTF-8 encoded.  
         *  If [param skip_cr] is `true`, carriage return characters (`\r`, CR) will be ignored when parsing the UTF-8, so that only line feed characters (`\n`, LF) represent a new line (Unix convention).  
         */
        get_as_text(skip_cr: boolean = false): string
        
        /** Returns an MD5 String representing the file at the given path or an empty [String] on failure. */
        static get_md5(path: string): string
        
        /** Returns an SHA-256 [String] representing the file at the given path or an empty [String] on failure. */
        static get_sha256(path: string): string
        
        /** Returns the last error that happened when trying to perform operations. Compare with the `ERR_FILE_*` constants from [enum Error]. */
        get_error(): GError
        
        /** Returns the next [Variant] value from the file. If [param allow_objects] is `true`, decoding objects is allowed.  
         *  Internally, this uses the same decoding mechanism as the [method @GlobalScope.bytes_to_var] method.  
         *  **Warning:** Deserialized objects can contain code which gets executed. Do not use this option if the serialized object comes from untrusted sources to avoid potential security threats such as remote code execution.  
         */
        get_var(allow_objects: boolean = false): any
        
        /** Stores an integer as 8 bits in the file.  
         *      
         *  **Note:** The [param value] should lie in the interval `[0, 255]`. Any other value will overflow and wrap around.  
         *  To store a signed integer, use [method store_64], or convert it manually (see [method store_16] for an example).  
         */
        store_8(value: int64): void
        
        /** Stores an integer as 16 bits in the file.  
         *      
         *  **Note:** The [param value] should lie in the interval `[0, 2^16 - 1]`. Any other value will overflow and wrap around.  
         *  To store a signed integer, use [method store_64] or store a signed integer from the interval `[-2^15, 2^15 - 1]` (i.e. keeping one bit for the signedness) and compute its sign manually when reading. For example:  
         *    
         */
        store_16(value: int64): void
        
        /** Stores an integer as 32 bits in the file.  
         *      
         *  **Note:** The [param value] should lie in the interval `[0, 2^32 - 1]`. Any other value will overflow and wrap around.  
         *  To store a signed integer, use [method store_64], or convert it manually (see [method store_16] for an example).  
         */
        store_32(value: int64): void
        
        /** Stores an integer as 64 bits in the file.  
         *      
         *  **Note:** The [param value] must lie in the interval `[-2^63, 2^63 - 1]` (i.e. be a valid [int] value).  
         */
        store_64(value: int64): void
        
        /** Stores a floating-point number as 32 bits in the file. */
        store_float(value: float64): void
        
        /** Stores a floating-point number as 64 bits in the file. */
        store_double(value: float64): void
        
        /** Stores a floating-point number in the file. */
        store_real(value: float64): void
        
        /** Stores the given array of bytes in the file. */
        store_buffer(buffer: PackedByteArray | byte[] | ArrayBuffer): void
        
        /** Appends [param line] to the file followed by a line return character (`\n`), encoding the text as UTF-8. */
        store_line(line: string): void
        
        /** Store the given [PackedStringArray] in the file as a line formatted in the CSV (Comma-Separated Values) format. You can pass a different delimiter [param delim] to use other than the default `","` (comma). This delimiter must be one-character long.  
         *  Text will be encoded as UTF-8.  
         */
        store_csv_line(values: PackedStringArray | string[], delim: string = ','): void
        
        /** Appends [param string] to the file without a line return, encoding the text as UTF-8.  
         *      
         *  **Note:** This method is intended to be used to write text files. The string is stored as a UTF-8 encoded buffer without string length or terminating zero, which means that it can't be loaded back easily. If you want to store a retrievable string in a binary file, consider using [method store_pascal_string] instead. For retrieving strings from a text file, you can use `get_buffer(length).get_string_from_utf8()` (if you know the length) or [method get_as_text].  
         */
        store_string(string_: string): void
        
        /** Stores any Variant value in the file. If [param full_objects] is `true`, encoding objects is allowed (and can potentially include code).  
         *  Internally, this uses the same encoding mechanism as the [method @GlobalScope.var_to_bytes] method.  
         *      
         *  **Note:** Not all properties are included. Only properties that are configured with the [constant PROPERTY_USAGE_STORAGE] flag set will be serialized. You can add a new usage flag to a property by overriding the [method Object._get_property_list] method in your class. You can also check how property usage is configured by calling [method Object._get_property_list]. See [enum PropertyUsageFlags] for the possible usage flags.  
         */
        store_var(value: any, full_objects: boolean = false): void
        
        /** Stores the given [String] as a line in the file in Pascal format (i.e. also store the length of the string).  
         *  Text will be encoded as UTF-8.  
         */
        store_pascal_string(string_: string): void
        
        /** Returns a [String] saved in Pascal format from the file.  
         *  Text is interpreted as being UTF-8 encoded.  
         */
        get_pascal_string(): string
        
        /** Closes the currently opened file and prevents subsequent read/write operations. Use [method flush] to persist the data to disk without closing the file.  
         *      
         *  **Note:** [FileAccess] will automatically close when it's freed, which happens when it goes out of scope or when it gets assigned with `null`. In C# the reference must be disposed after we are done using it, this can be done with the `using` statement or calling the `Dispose` method directly.  
         */
        close(): void
        
        /** Returns `true` if the file exists in the given path.  
         *      
         *  **Note:** Many resources types are imported (e.g. textures or sound files), and their source asset will not be included in the exported game, as only the imported version is used. See [method ResourceLoader.exists] for an alternative approach that takes resource remapping into account.  
         *  For a non-static, relative equivalent, use [method DirAccess.file_exists].  
         */
        static file_exists(path: string): boolean
        
        /** Returns the last time the [param file] was modified in Unix timestamp format, or `0` on error. This Unix timestamp can be converted to another format using the [Time] singleton. */
        static get_modified_time(file: string): int64
        
        /** Returns file UNIX permissions.  
         *      
         *  **Note:** This method is implemented on iOS, Linux/BSD, and macOS.  
         */
        static get_unix_permissions(file: string): FileAccess.UnixPermissionFlags
        
        /** Sets file UNIX permissions.  
         *      
         *  **Note:** This method is implemented on iOS, Linux/BSD, and macOS.  
         */
        static set_unix_permissions(file: string, permissions: FileAccess.UnixPermissionFlags): GError
        
        /** Returns `true`, if file `hidden` attribute is set.  
         *      
         *  **Note:** This method is implemented on iOS, BSD, macOS, and Windows.  
         */
        static get_hidden_attribute(file: string): boolean
        
        /** Sets file **hidden** attribute.  
         *      
         *  **Note:** This method is implemented on iOS, BSD, macOS, and Windows.  
         */
        static set_hidden_attribute(file: string, hidden: boolean): GError
        
        /** Sets file **read only** attribute.  
         *      
         *  **Note:** This method is implemented on iOS, BSD, macOS, and Windows.  
         */
        static set_read_only_attribute(file: string, ro: boolean): GError
        
        /** Returns `true`, if file `read only` attribute is set.  
         *      
         *  **Note:** This method is implemented on iOS, BSD, macOS, and Windows.  
         */
        static get_read_only_attribute(file: string): boolean
        
        /** If `true`, the file is read with big-endian [url=https://en.wikipedia.org/wiki/Endianness]endianness[/url]. If `false`, the file is read with little-endian endianness. If in doubt, leave this to `false` as most files are written with little-endian endianness.  
         *      
         *  **Note:** [member big_endian] is only about the file format, not the CPU type. The CPU endianness doesn't affect the default endianness for files written.  
         *      
         *  **Note:** This is always reset to `false` whenever you open the file. Therefore, you must set [member big_endian]  *after*  opening the file, not before.  
         */
        get big_endian(): boolean
        set big_endian(value: boolean)
    }
    namespace FileDialog {
        enum FileMode {
            /** The dialog allows selecting one, and only one file. */
            FILE_MODE_OPEN_FILE = 0,
            
            /** The dialog allows selecting multiple files. */
            FILE_MODE_OPEN_FILES = 1,
            
            /** The dialog only allows selecting a directory, disallowing the selection of any file. */
            FILE_MODE_OPEN_DIR = 2,
            
            /** The dialog allows selecting one file or directory. */
            FILE_MODE_OPEN_ANY = 3,
            
            /** The dialog will warn when a file exists. */
            FILE_MODE_SAVE_FILE = 4,
        }
        enum Access {
            /** The dialog only allows accessing files under the [Resource] path (`res://`). */
            ACCESS_RESOURCES = 0,
            
            /** The dialog only allows accessing files under user data path (`user://`). */
            ACCESS_USERDATA = 1,
            
            /** The dialog allows accessing files on the whole file system. */
            ACCESS_FILESYSTEM = 2,
        }
    }
    /** A dialog for selecting files or directories in the filesystem.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_filedialog.html  
     */
    class FileDialog extends ConfirmationDialog {
        constructor(identifier?: any)
        _cancel_pressed(): void
        
        /** Clear all the added filters in the dialog. */
        clear_filters(): void
        
        /** Adds a comma-delimited file name [param filter] option to the [FileDialog] with an optional [param description], which restricts what files can be picked.  
         *  A [param filter] should be of the form `"filename.extension"`, where filename and extension can be `*` to match any string. Filters starting with `.` (i.e. empty filenames) are not allowed.  
         *  For example, a [param filter] of `"*.png, *.jpg"` and a [param description] of `"Images"` results in filter text "Images (*.png, *.jpg)".  
         */
        add_filter(filter: string, description: string = ''): void
        
        /** Returns the name of the [OptionButton] or [CheckBox] with index [param option]. */
        get_option_name(option: int64): string
        
        /** Returns an array of values of the [OptionButton] with index [param option]. */
        get_option_values(option: int64): PackedStringArray
        
        /** Returns the default value index of the [OptionButton] or [CheckBox] with index [param option]. */
        get_option_default(option: int64): int64
        
        /** Sets the name of the [OptionButton] or [CheckBox] with index [param option]. */
        set_option_name(option: int64, name: string): void
        
        /** Sets the option values of the [OptionButton] with index [param option]. */
        set_option_values(option: int64, values: PackedStringArray | string[]): void
        
        /** Sets the default value index of the [OptionButton] or [CheckBox] with index [param option]. */
        set_option_default(option: int64, default_value_index: int64): void
        
        /** Adds an additional [OptionButton] to the file dialog. If [param values] is empty, a [CheckBox] is added instead.  
         *  [param default_value_index] should be an index of the value in the [param values]. If [param values] is empty it should be either `1` (checked), or `0` (unchecked).  
         */
        add_option(name: string, values: PackedStringArray | string[], default_value_index: int64): void
        
        /** Returns a [Dictionary] with the selected values of the additional [OptionButton]s and/or [CheckBox]es. [Dictionary] keys are names and values are selected value indices. */
        get_selected_options(): GDictionary
        
        /** Returns the vertical box container of the dialog, custom controls can be added to it.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         *      
         *  **Note:** Changes to this node are ignored by native file dialogs, use [method add_option] to add custom elements to the dialog instead.  
         */
        get_vbox(): VBoxContainer
        
        /** Returns the LineEdit for the selected file.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_line_edit(): LineEdit
        
        /** Clear all currently selected items in the dialog. */
        deselect_all(): void
        
        /** Invalidate and update the current dialog content list.  
         *      
         *  **Note:** This method does nothing on native file dialogs.  
         */
        invalidate(): void
        
        /** If `true`, changing the [member file_mode] property will set the window title accordingly (e.g. setting [member file_mode] to [constant FILE_MODE_OPEN_FILE] will change the window title to "Open a File"). */
        get mode_overrides_title(): boolean
        set mode_overrides_title(value: boolean)
        
        /** The dialog's open or save mode, which affects the selection behavior. See [enum FileMode]. */
        get file_mode(): int64
        set file_mode(value: int64)
        
        /** The file system access scope. See [enum Access] constants.  
         *  **Warning:** In Web builds, FileDialog cannot access the host file system. In sandboxed Linux and macOS environments, [member use_native_dialog] is automatically used to allow limited access to host file system.  
         */
        get access(): int64
        set access(value: int64)
        
        /** If non-empty, the given sub-folder will be "root" of this [FileDialog], i.e. user won't be able to go to its parent directory.  
         *      
         *  **Note:** This property is ignored by native file dialogs.  
         */
        get root_subfolder(): string
        set root_subfolder(value: string)
        
        /** The available file type filters. Each filter string in the array should be formatted like this: `*.txt,*.doc;Text Files`. The description text of the filter is optional and can be omitted. */
        get filters(): PackedStringArray
        set filters(value: PackedStringArray | string[])
        
        /** The number of additional [OptionButton]s and [CheckBox]es in the dialog. */
        get option_count(): any /*Options,option_*/
        set option_count(value: any /*Options,option_*/)
        
        /** If `true`, the dialog will show hidden files.  
         *      
         *  **Note:** This property is ignored by native file dialogs on Linux.  
         */
        get show_hidden_files(): boolean
        set show_hidden_files(value: boolean)
        
        /** If `true`, [member access] is set to [constant ACCESS_FILESYSTEM], and it is supported by the current [DisplayServer], OS native dialog will be used instead of custom one.  
         *      
         *  **Note:** On Linux and macOS, sandboxed apps always use native dialogs to access the host file system.  
         *      
         *  **Note:** On macOS, sandboxed apps will save security-scoped bookmarks to retain access to the opened folders across multiple sessions. Use [method OS.get_granted_permissions] to get a list of saved bookmarks.  
         *      
         *  **Note:** Native dialogs are isolated from the base process, file dialog properties can't be modified once the dialog is shown.  
         */
        get use_native_dialog(): boolean
        set use_native_dialog(value: boolean)
        
        /** The current working directory of the file dialog.  
         *      
         *  **Note:** For native file dialogs, this property is only treated as a hint and may not be respected by specific OS implementations.  
         */
        get current_dir(): string
        set current_dir(value: string)
        
        /** The currently selected file of the file dialog. */
        get current_file(): string
        set current_file(value: string)
        
        /** The currently selected file path of the file dialog. */
        get current_path(): string
        set current_path(value: string)
        
        /** Emitted when the user selects a file by double-clicking it or pressing the **OK** button. */
        readonly file_selected: Signal1<string>
        
        /** Emitted when the user selects multiple files. */
        readonly files_selected: Signal1<PackedStringArray | string[]>
        
        /** Emitted when the user selects a directory. */
        readonly dir_selected: Signal1<string>
    }
    /** Godot editor's dock for managing files in the project.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_filesystemdock.html  
     */
    class FileSystemDock extends VBoxContainer {
        constructor(identifier?: any)
        _file_list_thumbnail_done(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: any): void
        _tree_thumbnail_done(_unnamed_arg0: string, _unnamed_arg1: Texture2D, _unnamed_arg2: Texture2D, _unnamed_arg3: any): void
        
        /** Sets the given [param path] as currently selected, ensuring that the selected file/directory is visible. */
        navigate_to_path(path: string): void
        
        /** Registers a new [EditorResourceTooltipPlugin]. */
        add_resource_tooltip_plugin(plugin: EditorResourceTooltipPlugin): void
        
        /** Removes an [EditorResourceTooltipPlugin]. Fails if the plugin wasn't previously added. */
        remove_resource_tooltip_plugin(plugin: EditorResourceTooltipPlugin): void
        _set_dock_horizontal(enable: boolean): void
        _can_dock_horizontal(): boolean
        
        /** Emitted when a new scene is created that inherits the scene at [param file] path. */
        readonly inherit: Signal1<string>
        
        /** Emitted when the given scenes are being instantiated in the editor. */
        readonly instantiate: Signal1<PackedStringArray | string[]>
        
        /** Emitted when an external [param resource] had its file removed. */
        readonly resource_removed: Signal1<Resource>
        
        /** Emitted when the given [param file] was removed. */
        readonly file_removed: Signal1<string>
        
        /** Emitted when the given [param folder] was removed. */
        readonly folder_removed: Signal1<string>
        
        /** Emitted when a file is moved from [param old_file] path to [param new_file] path. */
        readonly files_moved: Signal2<string, string>
        
        /** Emitted when a folder is moved from [param old_folder] path to [param new_folder] path. */
        readonly folder_moved: Signal2<string, string>
        
        /** Emitted when folders change color. */
        readonly folder_color_changed: Signal0
        
        /** Emitted when the user switches file display mode or split mode. */
        readonly display_mode_changed: Signal0
    }
    class FileSystemList extends ItemList {
        constructor(identifier?: any)
        readonly item_edited: Signal0
    }
    class FindInFiles extends Node {
        constructor(identifier?: any)
        readonly result_found: Signal5<string, int64, int64, int64, string>
        readonly finished: Signal0
    }
    class FindInFilesDialog extends AcceptDialog {
        constructor(identifier?: any)
        readonly find_requested: Signal0
        readonly replace_requested: Signal0
    }
    class FindInFilesPanel extends Control {
        constructor(identifier?: any)
        _on_result_found(_unnamed_arg0: string, _unnamed_arg1: int64, _unnamed_arg2: int64, _unnamed_arg3: int64, _unnamed_arg4: string): void
        _on_finished(): void
        readonly result_selected: Signal4<string, int64, int64, int64>
        readonly files_modified: Signal1<string>
        readonly close_button_clicked: Signal0
    }
    class FindReplaceBar extends HBoxContainer {
        constructor(identifier?: any)
        _search_current(): boolean
        readonly error: Signal0
    }
    namespace FlowContainer {
        enum AlignmentMode {
            /** The child controls will be arranged at the beginning of the container, i.e. top if orientation is vertical, left if orientation is horizontal (right for RTL layout). */
            ALIGNMENT_BEGIN = 0,
            
            /** The child controls will be centered in the container. */
            ALIGNMENT_CENTER = 1,
            
            /** The child controls will be arranged at the end of the container, i.e. bottom if orientation is vertical, right if orientation is horizontal (left for RTL layout). */
            ALIGNMENT_END = 2,
        }
        enum LastWrapAlignmentMode {
            /** The last partially filled row or column will wrap aligned to the previous row or column in accordance with [member alignment]. */
            LAST_WRAP_ALIGNMENT_INHERIT = 0,
            
            /** The last partially filled row or column will wrap aligned to the beginning of the previous row or column. */
            LAST_WRAP_ALIGNMENT_BEGIN = 1,
            
            /** The last partially filled row or column will wrap aligned to the center of the previous row or column. */
            LAST_WRAP_ALIGNMENT_CENTER = 2,
            
            /** The last partially filled row or column will wrap aligned to the end of the previous row or column. */
            LAST_WRAP_ALIGNMENT_END = 3,
        }
    }
    /** A container that arranges its child controls horizontally or vertically and wraps them around at the borders.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_flowcontainer.html  
     */
    class FlowContainer extends Container {
        constructor(identifier?: any)
        /** Returns the current line count. */
        get_line_count(): int64
        
        /** The alignment of the container's children (must be one of [constant ALIGNMENT_BEGIN], [constant ALIGNMENT_CENTER], or [constant ALIGNMENT_END]). */
        get alignment(): int64
        set alignment(value: int64)
        
        /** The wrap behavior of the last, partially filled row or column (must be one of [constant LAST_WRAP_ALIGNMENT_INHERIT], [constant LAST_WRAP_ALIGNMENT_BEGIN], [constant LAST_WRAP_ALIGNMENT_CENTER], or [constant LAST_WRAP_ALIGNMENT_END]). */
        get last_wrap_alignment(): int64
        set last_wrap_alignment(value: int64)
        
        /** If `true`, the [FlowContainer] will arrange its children vertically, rather than horizontally.  
         *  Can't be changed when using [HFlowContainer] and [VFlowContainer].  
         */
        get vertical(): boolean
        set vertical(value: boolean)
        
        /** If `true`, reverses fill direction. Horizontal [FlowContainer]s will fill rows bottom to top, vertical [FlowContainer]s will fill columns right to left.  
         *  When using a vertical [FlowContainer] with a right to left [member Control.layout_direction], columns will fill left to right instead.  
         */
        get reverse_fill(): boolean
        set reverse_fill(value: boolean)
    }
    /** A material that controls how volumetric fog is rendered, to be assigned to a [FogVolume].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_fogmaterial.html  
     */
    class FogMaterial extends Material {
        constructor(identifier?: any)
        /** The density of the [FogVolume]. Denser objects are more opaque, but may suffer from under-sampling artifacts that look like stripes. Negative values can be used to subtract fog from other [FogVolume]s or global volumetric fog.  
         *      
         *  **Note:** Due to limited precision, [member density] values between `-0.001` and `0.001` (exclusive) act like `0.0`. This does not apply to [member Environment.volumetric_fog_density].  
         */
        get density(): float64
        set density(value: float64)
        
        /** The single-scattering [Color] of the [FogVolume]. Internally, [member albedo] is converted into single-scattering, which is additively blended with other [FogVolume]s and the [member Environment.volumetric_fog_albedo]. */
        get albedo(): Color
        set albedo(value: Color)
        
        /** The [Color] of the light emitted by the [FogVolume]. Emitted light will not cast light or shadows on other objects, but can be useful for modulating the [Color] of the [FogVolume] independently from light sources. */
        get emission(): Color
        set emission(value: Color)
        
        /** The rate by which the height-based fog decreases in density as height increases in world space. A high falloff will result in a sharp transition, while a low falloff will result in a smoother transition. A value of `0.0` results in uniform-density fog. The height threshold is determined by the height of the associated [FogVolume]. */
        get height_falloff(): float64
        set height_falloff(value: float64)
        
        /** The hardness of the edges of the [FogVolume]. A higher value will result in softer edges, while a lower value will result in harder edges. */
        get edge_fade(): float64
        set edge_fade(value: float64)
        
        /** The 3D texture that is used to scale the [member density] of the [FogVolume]. This can be used to vary fog density within the [FogVolume] with any kind of static pattern. For animated effects, consider using a custom [url=https://docs.godotengine.org/en/4.3/tutorials/shaders/shader_reference/fog_shader.html]fog shader[/url]. */
        get density_texture(): Texture3D
        set density_texture(value: Texture3D)
    }
    class FogMaterialConversionPlugin extends EditorResourceConversionPlugin {
        constructor(identifier?: any)
    }
    /** A region that contributes to the default volumetric fog from the world environment.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_fogvolume.html  
     */
    class FogVolume extends VisualInstance3D {
        constructor(identifier?: any)
        /** The size of the [FogVolume] when [member shape] is [constant RenderingServer.FOG_VOLUME_SHAPE_ELLIPSOID], [constant RenderingServer.FOG_VOLUME_SHAPE_CONE], [constant RenderingServer.FOG_VOLUME_SHAPE_CYLINDER] or [constant RenderingServer.FOG_VOLUME_SHAPE_BOX].  
         *      
         *  **Note:** Thin fog volumes may appear to flicker when the camera moves or rotates. This can be alleviated by increasing [member ProjectSettings.rendering/environment/volumetric_fog/volume_depth] (at a performance cost) or by decreasing [member Environment.volumetric_fog_length] (at no performance cost, but at the cost of lower fog range). Alternatively, the [FogVolume] can be made thicker and use a lower density in the [member material].  
         *      
         *  **Note:** If [member shape] is [constant RenderingServer.FOG_VOLUME_SHAPE_CONE] or [constant RenderingServer.FOG_VOLUME_SHAPE_CYLINDER], the cone/cylinder will be adjusted to fit within the size. Non-uniform scaling of cone/cylinder shapes via the [member size] property is not supported, but you can scale the [FogVolume] node instead.  
         */
        get size(): Vector3
        set size(value: Vector3)
        
        /** The shape of the [FogVolume]. This can be set to either [constant RenderingServer.FOG_VOLUME_SHAPE_ELLIPSOID], [constant RenderingServer.FOG_VOLUME_SHAPE_CONE], [constant RenderingServer.FOG_VOLUME_SHAPE_CYLINDER], [constant RenderingServer.FOG_VOLUME_SHAPE_BOX] or [constant RenderingServer.FOG_VOLUME_SHAPE_WORLD]. */
        get shape(): int64
        set shape(value: int64)
        
        /** The [Material] used by the [FogVolume]. Can be either a built-in [FogMaterial] or a custom [ShaderMaterial]. */
        get material(): FogMaterial | ShaderMaterial
        set material(value: FogMaterial | ShaderMaterial)
    }
    class FogVolumeGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** Abstract base class for fonts and font variations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_font.html  
     */
    class Font extends Resource {
        constructor(identifier?: any)
        /** Returns [TextServer] RID of the font cache for specific variation. */
        find_variation(variation_coordinates: GDictionary, face_index: int64 = 0, strength: float64 = 0, transform: Transform2D = new Transform2D(), spacing_top: int64 = 0, spacing_bottom: int64 = 0, spacing_space: int64 = 0, spacing_glyph: int64 = 0, baseline_offset: float64 = 0): RID
        
        /** Returns [Array] of valid [Font] [RID]s, which can be passed to the [TextServer] methods. */
        get_rids(): GArray
        
        /** Returns the total average font height (ascent plus descent) in pixels.  
         *      
         *  **Note:** Real height of the string is context-dependent and can be significantly different from the value returned by this function. Use it only as rough estimate (e.g. as the height of empty line).  
         */
        get_height(font_size: int64 = 16): float64
        
        /** Returns the average font ascent (number of pixels above the baseline).  
         *      
         *  **Note:** Real ascent of the string is context-dependent and can be significantly different from the value returned by this function. Use it only as rough estimate (e.g. as the ascent of empty line).  
         */
        get_ascent(font_size: int64 = 16): float64
        
        /** Returns the average font descent (number of pixels below the baseline).  
         *      
         *  **Note:** Real descent of the string is context-dependent and can be significantly different from the value returned by this function. Use it only as rough estimate (e.g. as the descent of empty line).  
         */
        get_descent(font_size: int64 = 16): float64
        
        /** Returns average pixel offset of the underline below the baseline.  
         *      
         *  **Note:** Real underline position of the string is context-dependent and can be significantly different from the value returned by this function. Use it only as rough estimate.  
         */
        get_underline_position(font_size: int64 = 16): float64
        
        /** Returns average thickness of the underline.  
         *      
         *  **Note:** Real underline thickness of the string is context-dependent and can be significantly different from the value returned by this function. Use it only as rough estimate.  
         */
        get_underline_thickness(font_size: int64 = 16): float64
        
        /** Returns font family name. */
        get_font_name(): string
        
        /** Returns font style name. */
        get_font_style_name(): string
        
        /** Returns [Dictionary] with OpenType font name strings (localized font names, version, description, license information, sample text, etc.). */
        get_ot_name_strings(): GDictionary
        
        /** Returns font style flags, see [enum TextServer.FontStyle]. */
        get_font_style(): TextServer.FontStyle
        
        /** Returns weight (boldness) of the font. A value in the `100...999` range, normal font weight is `400`, bold font weight is `700`. */
        get_font_weight(): int64
        
        /** Returns font stretch amount, compared to a normal width. A percentage value between `50%` and `200%`. */
        get_font_stretch(): int64
        
        /** Returns the spacing for the given `type` (see [enum TextServer.SpacingType]). */
        get_spacing(spacing: TextServer.SpacingType): int64
        
        /** Returns a set of OpenType feature tags. More info: [url=https://docs.microsoft.com/en-us/typography/opentype/spec/featuretags]OpenType feature tags[/url]. */
        get_opentype_features(): GDictionary
        
        /** Sets LRU cache capacity for `draw_*` methods. */
        set_cache_capacity(single_line: int64, multi_line: int64): void
        
        /** Returns the size of a bounding box of a single-line string, taking kerning, advance and subpixel positioning into account. See also [method get_multiline_string_size] and [method draw_string].  
         *  For example, to get the string size as displayed by a single-line Label, use:  
         *    
         *      
         *  **Note:** Since kerning, advance and subpixel positioning are taken into account by [method get_string_size], using separate [method get_string_size] calls on substrings of a string then adding the results together will return a different result compared to using a single [method get_string_size] call on the full string.  
         *      
         *  **Note:** Real height of the string is context-dependent and can be significantly different from the value returned by [method get_height].  
         */
        get_string_size(text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): Vector2
        
        /** Returns the size of a bounding box of a string broken into the lines, taking kerning and advance into account.  
         *  See also [method draw_multiline_string].  
         */
        get_multiline_string_size(text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, max_lines: int64 = -1, brk_flags: TextServer.LineBreakFlag = 3, justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): Vector2
        
        /** Draw [param text] into a canvas item using the font, at a given position, with [param modulate] color, optionally clipping the width and aligning horizontally. [param pos] specifies the baseline, not the top. To draw from the top,  *ascent*  must be added to the Y axis.  
         *  See also [method CanvasItem.draw_string].  
         */
        draw_string(canvas_item: RID, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, modulate: Color = new Color(1, 1, 1, 1), justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Breaks [param text] into lines using rules specified by [param brk_flags] and draws it into a canvas item using the font, at a given position, with [param modulate] color, optionally clipping the width and aligning horizontally. [param pos] specifies the baseline of the first line, not the top. To draw from the top,  *ascent*  must be added to the Y axis.  
         *  See also [method CanvasItem.draw_multiline_string].  
         */
        draw_multiline_string(canvas_item: RID, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, max_lines: int64 = -1, modulate: Color = new Color(1, 1, 1, 1), brk_flags: TextServer.LineBreakFlag = 3, justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Draw [param text] outline into a canvas item using the font, at a given position, with [param modulate] color and [param size] outline size, optionally clipping the width and aligning horizontally. [param pos] specifies the baseline, not the top. To draw from the top,  *ascent*  must be added to the Y axis.  
         *  See also [method CanvasItem.draw_string_outline].  
         */
        draw_string_outline(canvas_item: RID, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, size: int64 = 1, modulate: Color = new Color(1, 1, 1, 1), justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Breaks [param text] to the lines using rules specified by [param brk_flags] and draws text outline into a canvas item using the font, at a given position, with [param modulate] color and [param size] outline size, optionally clipping the width and aligning horizontally. [param pos] specifies the baseline of the first line, not the top. To draw from the top,  *ascent*  must be added to the Y axis.  
         *  See also [method CanvasItem.draw_multiline_string_outline].  
         */
        draw_multiline_string_outline(canvas_item: RID, pos: Vector2, text: string, alignment: HorizontalAlignment = 0, width: float64 = -1, font_size: int64 = 16, max_lines: int64 = -1, size: int64 = 1, modulate: Color = new Color(1, 1, 1, 1), brk_flags: TextServer.LineBreakFlag = 3, justification_flags: TextServer.JustificationFlag = 3, direction: TextServer.Direction = 0, orientation: TextServer.Orientation = 0): void
        
        /** Returns the size of a character. Does not take kerning into account.  
         *      
         *  **Note:** Do not use this function to calculate width of the string character by character, use [method get_string_size] or [TextLine] instead. The height returned is the font height (see also [method get_height]) and has no relation to the glyph height.  
         */
        get_char_size(char: int64, font_size: int64): Vector2
        
        /** Draw a single Unicode character [param char] into a canvas item using the font, at a given position, with [param modulate] color. [param pos] specifies the baseline, not the top. To draw from the top,  *ascent*  must be added to the Y axis.  
         *      
         *  **Note:** Do not use this function to draw strings character by character, use [method draw_string] or [TextLine] instead.  
         */
        draw_char(canvas_item: RID, pos: Vector2, char: int64, font_size: int64, modulate: Color = new Color(1, 1, 1, 1)): float64
        
        /** Draw a single Unicode character [param char] outline into a canvas item using the font, at a given position, with [param modulate] color and [param size] outline size. [param pos] specifies the baseline, not the top. To draw from the top,  *ascent*  must be added to the Y axis.  
         *      
         *  **Note:** Do not use this function to draw strings character by character, use [method draw_string] or [TextLine] instead.  
         */
        draw_char_outline(canvas_item: RID, pos: Vector2, char: int64, font_size: int64, size: int64 = -1, modulate: Color = new Color(1, 1, 1, 1)): float64
        
        /** Returns `true` if a Unicode [param char] is available in the font. */
        has_char(char: int64): boolean
        
        /** Returns a string containing all the characters available in the font.  
         *  If a given character is included in more than one font data source, it appears only once in the returned string.  
         */
        get_supported_chars(): string
        
        /** Returns `true`, if font supports given language ([url=https://en.wikipedia.org/wiki/ISO_639-1]ISO 639[/url] code). */
        is_language_supported(language: string): boolean
        
        /** Returns `true`, if font supports given script ([url=https://en.wikipedia.org/wiki/ISO_15924]ISO 15924[/url] code). */
        is_script_supported(script: string): boolean
        
        /** Returns list of OpenType features supported by font. */
        get_supported_feature_list(): GDictionary
        
        /** Returns list of supported [url=https://docs.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg]variation coordinates[/url], each coordinate is returned as `tag: Vector3i(min_value,max_value,default_value)`.  
         *  Font variations allow for continuous change of glyph characteristics along some given design axis, such as weight, width or slant.  
         *  To print available variation axes of a variable font:  
         *    
         *      
         *  **Note:** To set and get variation coordinates of a [FontVariation], use [member FontVariation.variation_opentype].  
         */
        get_supported_variation_list(): GDictionary
        
        /** Returns number of faces in the TrueType / OpenType collection. */
        get_face_count(): int64
        
        /** Array of fallback [Font]s to use as a substitute if a glyph is not found in this current [Font].  
         *  If this array is empty in a [FontVariation], the [member FontVariation.base_font]'s fallbacks are used instead.  
         */
        get fallbacks(): GArray
        set fallbacks(value: GArray)
    }
    class FontEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** Holds font source data and prerendered glyph cache, imported from a dynamic or a bitmap font.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_fontfile.html  
     */
    class FontFile extends Font {
        constructor(identifier?: any)
        /** Loads an AngelCode BMFont (.fnt, .font) bitmap font from file [param path].  
         *  **Warning:** This method should only be used in the editor or in cases when you need to load external fonts at run-time, such as fonts located at the `user://` directory.  
         */
        load_bitmap_font(path: string): GError
        
        /** Loads a TrueType (.ttf), OpenType (.otf), WOFF (.woff), WOFF2 (.woff2) or Type 1 (.pfb, .pfm) dynamic font from file [param path].  
         *  **Warning:** This method should only be used in the editor or in cases when you need to load external fonts at run-time, such as fonts located at the `user://` directory.  
         */
        load_dynamic_font(path: string): GError
        
        /** Returns number of the font cache entries. */
        get_cache_count(): int64
        
        /** Removes all font cache entries. */
        clear_cache(): void
        
        /** Removes specified font cache entry. */
        remove_cache(cache_index: int64): void
        
        /** Returns list of the font sizes in the cache. Each size is [Vector2i] with font size and outline size. */
        get_size_cache_list(cache_index: int64): GArray
        
        /** Removes all font sizes from the cache entry */
        clear_size_cache(cache_index: int64): void
        
        /** Removes specified font size from the cache entry. */
        remove_size_cache(cache_index: int64, size: Vector2i): void
        
        /** Sets variation coordinates for the specified font cache entry. See [method Font.get_supported_variation_list] for more info. */
        set_variation_coordinates(cache_index: int64, variation_coordinates: GDictionary): void
        
        /** Returns variation coordinates for the specified font cache entry. See [method Font.get_supported_variation_list] for more info. */
        get_variation_coordinates(cache_index: int64): GDictionary
        
        /** Sets embolden strength, if is not equal to zero, emboldens the font outlines. Negative values reduce the outline thickness. */
        set_embolden(cache_index: int64, strength: float64): void
        
        /** Returns embolden strength, if is not equal to zero, emboldens the font outlines. Negative values reduce the outline thickness. */
        get_embolden(cache_index: int64): float64
        
        /** Sets 2D transform, applied to the font outlines, can be used for slanting, flipping, and rotating glyphs. */
        set_transform(cache_index: int64, transform: Transform2D): void
        
        /** Returns 2D transform, applied to the font outlines, can be used for slanting, flipping and rotating glyphs. */
        get_transform(cache_index: int64): Transform2D
        
        /** Sets the spacing for [param spacing] (see [enum TextServer.SpacingType]) to [param value] in pixels (not relative to the font size). */
        set_extra_spacing(cache_index: int64, spacing: TextServer.SpacingType, value: int64): void
        
        /** Returns spacing for [param spacing] (see [enum TextServer.SpacingType]) in pixels (not relative to the font size). */
        get_extra_spacing(cache_index: int64, spacing: TextServer.SpacingType): int64
        
        /** Sets extra baseline offset (as a fraction of font height). */
        set_extra_baseline_offset(cache_index: int64, baseline_offset: float64): void
        
        /** Returns extra baseline offset (as a fraction of font height). */
        get_extra_baseline_offset(cache_index: int64): float64
        
        /** Sets an active face index in the TrueType / OpenType collection. */
        set_face_index(cache_index: int64, face_index: int64): void
        
        /** Returns an active face index in the TrueType / OpenType collection. */
        get_face_index(cache_index: int64): int64
        
        /** Sets the font ascent (number of pixels above the baseline). */
        set_cache_ascent(cache_index: int64, size: int64, ascent: float64): void
        
        /** Returns the font ascent (number of pixels above the baseline). */
        get_cache_ascent(cache_index: int64, size: int64): float64
        
        /** Sets the font descent (number of pixels below the baseline). */
        set_cache_descent(cache_index: int64, size: int64, descent: float64): void
        
        /** Returns the font descent (number of pixels below the baseline). */
        get_cache_descent(cache_index: int64, size: int64): float64
        
        /** Sets pixel offset of the underline below the baseline. */
        set_cache_underline_position(cache_index: int64, size: int64, underline_position: float64): void
        
        /** Returns pixel offset of the underline below the baseline. */
        get_cache_underline_position(cache_index: int64, size: int64): float64
        
        /** Sets thickness of the underline in pixels. */
        set_cache_underline_thickness(cache_index: int64, size: int64, underline_thickness: float64): void
        
        /** Returns thickness of the underline in pixels. */
        get_cache_underline_thickness(cache_index: int64, size: int64): float64
        
        /** Sets scaling factor of the color bitmap font. */
        set_cache_scale(cache_index: int64, size: int64, scale: float64): void
        
        /** Returns scaling factor of the color bitmap font. */
        get_cache_scale(cache_index: int64, size: int64): float64
        
        /** Returns number of textures used by font cache entry. */
        get_texture_count(cache_index: int64, size: Vector2i): int64
        
        /** Removes all textures from font cache entry.  
         *      
         *  **Note:** This function will not remove glyphs associated with the texture, use [method remove_glyph] to remove them manually.  
         */
        clear_textures(cache_index: int64, size: Vector2i): void
        
        /** Removes specified texture from the cache entry.  
         *      
         *  **Note:** This function will not remove glyphs associated with the texture. Remove them manually using [method remove_glyph].  
         */
        remove_texture(cache_index: int64, size: Vector2i, texture_index: int64): void
        
        /** Sets font cache texture image. */
        set_texture_image(cache_index: int64, size: Vector2i, texture_index: int64, image: Image): void
        
        /** Returns a copy of the font cache texture image. */
        get_texture_image(cache_index: int64, size: Vector2i, texture_index: int64): Image
        
        /** Sets array containing glyph packing data. */
        set_texture_offsets(cache_index: int64, size: Vector2i, texture_index: int64, offset: PackedInt32Array | int32[]): void
        
        /** Returns a copy of the array containing glyph packing data. */
        get_texture_offsets(cache_index: int64, size: Vector2i, texture_index: int64): PackedInt32Array
        
        /** Returns list of rendered glyphs in the cache entry. */
        get_glyph_list(cache_index: int64, size: Vector2i): PackedInt32Array
        
        /** Removes all rendered glyph information from the cache entry.  
         *      
         *  **Note:** This function will not remove textures associated with the glyphs, use [method remove_texture] to remove them manually.  
         */
        clear_glyphs(cache_index: int64, size: Vector2i): void
        
        /** Removes specified rendered glyph information from the cache entry.  
         *      
         *  **Note:** This function will not remove textures associated with the glyphs, use [method remove_texture] to remove them manually.  
         */
        remove_glyph(cache_index: int64, size: Vector2i, glyph: int64): void
        
        /** Sets glyph advance (offset of the next glyph).  
         *      
         *  **Note:** Advance for glyphs outlines is the same as the base glyph advance and is not saved.  
         */
        set_glyph_advance(cache_index: int64, size: int64, glyph: int64, advance: Vector2): void
        
        /** Returns glyph advance (offset of the next glyph).  
         *      
         *  **Note:** Advance for glyphs outlines is the same as the base glyph advance and is not saved.  
         */
        get_glyph_advance(cache_index: int64, size: int64, glyph: int64): Vector2
        
        /** Sets glyph offset from the baseline. */
        set_glyph_offset(cache_index: int64, size: Vector2i, glyph: int64, offset: Vector2): void
        
        /** Returns glyph offset from the baseline. */
        get_glyph_offset(cache_index: int64, size: Vector2i, glyph: int64): Vector2
        
        /** Sets glyph size. */
        set_glyph_size(cache_index: int64, size: Vector2i, glyph: int64, gl_size: Vector2): void
        
        /** Returns glyph size. */
        get_glyph_size(cache_index: int64, size: Vector2i, glyph: int64): Vector2
        
        /** Sets rectangle in the cache texture containing the glyph. */
        set_glyph_uv_rect(cache_index: int64, size: Vector2i, glyph: int64, uv_rect: Rect2): void
        
        /** Returns rectangle in the cache texture containing the glyph. */
        get_glyph_uv_rect(cache_index: int64, size: Vector2i, glyph: int64): Rect2
        
        /** Sets index of the cache texture containing the glyph. */
        set_glyph_texture_idx(cache_index: int64, size: Vector2i, glyph: int64, texture_idx: int64): void
        
        /** Returns index of the cache texture containing the glyph. */
        get_glyph_texture_idx(cache_index: int64, size: Vector2i, glyph: int64): int64
        
        /** Returns list of the kerning overrides. */
        get_kerning_list(cache_index: int64, size: int64): GArray
        
        /** Removes all kerning overrides. */
        clear_kerning_map(cache_index: int64, size: int64): void
        
        /** Removes kerning override for the pair of glyphs. */
        remove_kerning(cache_index: int64, size: int64, glyph_pair: Vector2i): void
        
        /** Sets kerning for the pair of glyphs. */
        set_kerning(cache_index: int64, size: int64, glyph_pair: Vector2i, kerning: Vector2): void
        
        /** Returns kerning for the pair of glyphs. */
        get_kerning(cache_index: int64, size: int64, glyph_pair: Vector2i): Vector2
        
        /** Renders the range of characters to the font cache texture. */
        render_range(cache_index: int64, size: Vector2i, start: int64, end: int64): void
        
        /** Renders specified glyph to the font cache texture. */
        render_glyph(cache_index: int64, size: Vector2i, index: int64): void
        
        /** Adds override for [method Font.is_language_supported]. */
        set_language_support_override(language: string, supported: boolean): void
        
        /** Returns `true` if support override is enabled for the [param language]. */
        get_language_support_override(language: string): boolean
        
        /** Remove language support override. */
        remove_language_support_override(language: string): void
        
        /** Returns list of language support overrides. */
        get_language_support_overrides(): PackedStringArray
        
        /** Adds override for [method Font.is_script_supported]. */
        set_script_support_override(script: string, supported: boolean): void
        
        /** Returns `true` if support override is enabled for the [param script]. */
        get_script_support_override(script: string): boolean
        
        /** Removes script support override. */
        remove_script_support_override(script: string): void
        
        /** Returns list of script support overrides. */
        get_script_support_overrides(): PackedStringArray
        
        /** Returns the glyph index of a [param char], optionally modified by the [param variation_selector]. */
        get_glyph_index(size: int64, char: int64, variation_selector: int64): int64
        
        /** Returns character code associated with [param glyph_index], or `0` if [param glyph_index] is invalid. See [method get_glyph_index]. */
        get_char_from_glyph_index(size: int64, glyph_index: int64): int64
        
        /** Contents of the dynamic font source file. */
        get data(): PackedByteArray
        set data(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** If set to `true`, generate mipmaps for the font textures. */
        get generate_mipmaps(): boolean
        set generate_mipmaps(value: boolean)
        
        /** If set to `true`, embedded font bitmap loading is disabled (bitmap-only and color fonts ignore this property). */
        get disable_embedded_bitmaps(): boolean
        set disable_embedded_bitmaps(value: boolean)
        
        /** Font anti-aliasing mode. */
        get antialiasing(): int64
        set antialiasing(value: int64)
        
        /** Font family name. */
        get font_name(): string
        set font_name(value: string)
        
        /** Font style name. */
        get style_name(): string
        set style_name(value: string)
        
        /** Font style flags, see [enum TextServer.FontStyle]. */
        get font_style(): int64
        set font_style(value: int64)
        
        /** Weight (boldness) of the font. A value in the `100...999` range, normal font weight is `400`, bold font weight is `700`. */
        get font_weight(): int64
        set font_weight(value: int64)
        
        /** Font stretch amount, compared to a normal width. A percentage value between `50%` and `200%`. */
        get font_stretch(): int64
        set font_stretch(value: int64)
        
        /** Font glyph subpixel positioning mode. Subpixel positioning provides shaper text and better kerning for smaller font sizes, at the cost of higher memory usage and lower font rasterization speed. Use [constant TextServer.SUBPIXEL_POSITIONING_AUTO] to automatically enable it based on the font size. */
        get subpixel_positioning(): int64
        set subpixel_positioning(value: int64)
        
        /** If set to `true`, glyphs of all sizes are rendered using single multichannel signed distance field (MSDF) generated from the dynamic font vector data. Since this approach does not rely on rasterizing the font every time its size changes, this allows for resizing the font in real-time without any performance penalty. Text will also not look grainy for [Control]s that are scaled down (or for [Label3D]s viewed from a long distance). As a downside, font hinting is not available with MSDF. The lack of font hinting may result in less crisp and less readable fonts at small sizes.  
         *      
         *  **Note:** If using font outlines, [member msdf_pixel_range] must be set to at least  *twice*  the size of the largest font outline.  
         *      
         *  **Note:** MSDF font rendering does not render glyphs with overlapping shapes correctly. Overlapping shapes are not valid per the OpenType standard, but are still commonly found in many font files, especially those converted by Google Fonts. To avoid issues with overlapping glyphs, consider downloading the font file directly from the type foundry instead of relying on Google Fonts.  
         */
        get multichannel_signed_distance_field(): boolean
        set multichannel_signed_distance_field(value: boolean)
        
        /** The width of the range around the shape between the minimum and maximum representable signed distance. If using font outlines, [member msdf_pixel_range] must be set to at least  *twice*  the size of the largest font outline. The default [member msdf_pixel_range] value of `16` allows outline sizes up to `8` to look correct. */
        get msdf_pixel_range(): int64
        set msdf_pixel_range(value: int64)
        
        /** Source font size used to generate MSDF textures. Higher values allow for more precision, but are slower to render and require more memory. Only increase this value if you notice a visible lack of precision in glyph rendering. */
        get msdf_size(): int64
        set msdf_size(value: int64)
        
        /** If set to `true`, system fonts can be automatically used as fallbacks. */
        get allow_system_fallback(): boolean
        set allow_system_fallback(value: boolean)
        
        /** If set to `true`, auto-hinting is supported and preferred over font built-in hinting. Used by dynamic fonts only (MSDF fonts don't support hinting). */
        get force_autohinter(): boolean
        set force_autohinter(value: boolean)
        
        /** Font hinting mode. Used by dynamic fonts only. */
        get hinting(): int64
        set hinting(value: int64)
        
        /** Font oversampling factor. If set to `0.0`, the global oversampling factor is used instead. Used by dynamic fonts only (MSDF fonts ignore oversampling). */
        get oversampling(): float64
        set oversampling(value: float64)
        
        /** Font size, used only for the bitmap fonts. */
        get fixed_size(): int64
        set fixed_size(value: int64)
        
        /** Scaling mode, used only for the bitmap fonts with [member fixed_size] greater than zero. */
        get fixed_size_scale_mode(): int64
        set fixed_size_scale_mode(value: int64)
        
        /** Font OpenType feature set override. */
        get opentype_feature_overrides(): GDictionary
        set opentype_feature_overrides(value: GDictionary)
    }
    /** A variation of a font with additional settings.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_fontvariation.html  
     */
    class FontVariation extends Font {
        constructor(identifier?: any)
        /** Sets the spacing for [param spacing] (see [enum TextServer.SpacingType]) to [param value] in pixels (not relative to the font size). */
        set_spacing(spacing: TextServer.SpacingType, value: int64): void
        
        /** Base font used to create a variation. If not set, default [Theme] font is used. */
        get base_font(): Font
        set base_font(value: Font)
        
        /** Font OpenType variation coordinates. More info: [url=https://docs.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg]OpenType variation tags[/url].  
         *      
         *  **Note:** This [Dictionary] uses OpenType tags as keys. Variation axes can be identified both by tags ([int], e.g. `0x77678674`) and names ([String], e.g. `wght`). Some axes might be accessible by multiple names. For example, `wght` refers to the same axis as `weight`. Tags on the other hand are unique. To convert between names and tags, use [method TextServer.name_to_tag] and [method TextServer.tag_to_name].  
         *      
         *  **Note:** To get available variation axes of a font, use [method Font.get_supported_variation_list].  
         */
        get variation_opentype(): GDictionary
        set variation_opentype(value: GDictionary)
        
        /** Active face index in the TrueType / OpenType collection file. */
        get variation_face_index(): int64
        set variation_face_index(value: int64)
        
        /** If is not equal to zero, emboldens the font outlines. Negative values reduce the outline thickness.  
         *      
         *  **Note:** Emboldened fonts might have self-intersecting outlines, which will prevent MSDF fonts and [TextMesh] from working correctly.  
         */
        get variation_embolden(): float64
        set variation_embolden(value: float64)
        
        /** 2D transform, applied to the font outlines, can be used for slanting, flipping and rotating glyphs.  
         *  For example, to simulate italic typeface by slanting, apply the following transform `Transform2D(1.0, slant, 0.0, 1.0, 0.0, 0.0)`.  
         */
        get variation_transform(): Transform2D
        set variation_transform(value: Transform2D)
        
        /** A set of OpenType feature tags. More info: [url=https://docs.microsoft.com/en-us/typography/opentype/spec/featuretags]OpenType feature tags[/url]. */
        get opentype_features(): GDictionary
        set opentype_features(value: GDictionary)
        
        /** Extra spacing between graphical glyphs. */
        get spacing_glyph(): int64
        set spacing_glyph(value: int64)
        
        /** Extra width of the space glyphs. */
        get spacing_space(): int64
        set spacing_space(value: int64)
        
        /** Extra spacing at the top of the line in pixels. */
        get spacing_top(): int64
        set spacing_top(value: int64)
        
        /** Extra spacing at the bottom of the line in pixels. */
        get spacing_bottom(): int64
        set spacing_bottom(value: int64)
        
        /** Extra baseline offset (as a fraction of font height). */
        get baseline_offset(): float64
        set baseline_offset(value: float64)
    }
    /** Framebuffer cache manager for Rendering Device based renderers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_framebuffercacherd.html  
     */
    class FramebufferCacheRD extends Object {
        constructor(identifier?: any)
        /** Creates, or obtains a cached, framebuffer. [param textures] lists textures accessed. [param passes] defines the subpasses and texture allocation, if left empty a single pass is created and textures are allocated depending on their usage flags. [param views] defines the number of views used when rendering. */
        static get_cache_multipass(textures: GArray, passes: GArray, views: int64): RID
    }
    namespace GDExtension {
        enum InitializationLevel {
            /** The library is initialized at the same time as the core features of the engine. */
            INITIALIZATION_LEVEL_CORE = 0,
            
            /** The library is initialized at the same time as the engine's servers (such as [RenderingServer] or [PhysicsServer3D]). */
            INITIALIZATION_LEVEL_SERVERS = 1,
            
            /** The library is initialized at the same time as the engine's scene-related classes. */
            INITIALIZATION_LEVEL_SCENE = 2,
            
            /** The library is initialized at the same time as the engine's editor classes. Only happens when loading the GDExtension in the editor. */
            INITIALIZATION_LEVEL_EDITOR = 3,
        }
    }
    /** A native library for GDExtension.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gdextension.html  
     */
    class GDExtension extends Resource {
        constructor(identifier?: any)
        /** Returns `true` if this extension's library has been opened. */
        is_library_open(): boolean
        
        /** Returns the lowest level required for this extension to be properly initialized (see the [enum InitializationLevel] enum). */
        get_minimum_library_initialization_level(): GDExtension.InitializationLevel
    }
    class GDScriptLanguageServer extends EditorPlugin {
        constructor(identifier?: any)
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_gdscripttextdocument.html */
    class GDScriptTextDocument extends RefCounted {
        constructor(identifier?: any)
        didOpen(_unnamed_arg0: any): void
        didClose(_unnamed_arg0: any): void
        didChange(_unnamed_arg0: any): void
        willSaveWaitUntil(_unnamed_arg0: any): void
        didSave(_unnamed_arg0: any): void
        nativeSymbol(_unnamed_arg0: GDictionary): any
        documentSymbol(_unnamed_arg0: GDictionary): GArray
        completion(_unnamed_arg0: GDictionary): GArray
        resolve(_unnamed_arg0: GDictionary): GDictionary
        rename(_unnamed_arg0: GDictionary): GDictionary
        prepareRename(_unnamed_arg0: GDictionary): any
        references(_unnamed_arg0: GDictionary): GArray
        foldingRange(_unnamed_arg0: GDictionary): GArray
        codeLens(_unnamed_arg0: GDictionary): GArray
        documentLink(_unnamed_arg0: GDictionary): GArray
        colorPresentation(_unnamed_arg0: GDictionary): GArray
        hover(_unnamed_arg0: GDictionary): any
        definition(_unnamed_arg0: GDictionary): GArray
        declaration(_unnamed_arg0: GDictionary): any
        signatureHelp(_unnamed_arg0: GDictionary): any
        show_native_symbol_in_editor(_unnamed_arg0: string): void
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_gdscriptworkspace.html */
    class GDScriptWorkspace extends RefCounted {
        constructor(identifier?: any)
        apply_new_signal(_unnamed_arg0: Object, _unnamed_arg1: string, _unnamed_arg2: PackedStringArray | string[]): void
        didDeleteFiles(_unnamed_arg0: GDictionary): void
        parse_script(path: string, content: string): GError
        parse_local_script(path: string): GError
        get_file_path(uri: string): string
        get_file_uri(path: string): string
        publish_diagnostics(path: string): void
        generate_script_api(path: string): GDictionary
    }
    namespace GLTFAccessor {
        enum GLTFAccessorType {
            /** Accessor type "SCALAR". For the glTF object model, this can be used to map to a single float, int, or bool value, or a float array. */
            TYPE_SCALAR = 0,
            
            /** Accessor type "VEC2". For the glTF object model, this maps to "float2", represented in the glTF JSON as an array of two floats. */
            TYPE_VEC2 = 1,
            
            /** Accessor type "VEC3". For the glTF object model, this maps to "float3", represented in the glTF JSON as an array of three floats. */
            TYPE_VEC3 = 2,
            
            /** Accessor type "VEC4". For the glTF object model, this maps to "float4", represented in the glTF JSON as an array of four floats. */
            TYPE_VEC4 = 3,
            
            /** Accessor type "MAT2". For the glTF object model, this maps to "float2x2", represented in the glTF JSON as an array of four floats. */
            TYPE_MAT2 = 4,
            
            /** Accessor type "MAT3". For the glTF object model, this maps to "float3x3", represented in the glTF JSON as an array of nine floats. */
            TYPE_MAT3 = 5,
            
            /** Accessor type "MAT4". For the glTF object model, this maps to "float4x4", represented in the glTF JSON as an array of sixteen floats. */
            TYPE_MAT4 = 6,
        }
    }
    /** Represents a GLTF accessor.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfaccessor.html  
     */
    class GLTFAccessor extends Resource {
        constructor(identifier?: any)
        /** The index of the buffer view this accessor is referencing. If `-1`, this accessor is not referencing any buffer view. */
        get buffer_view(): int64
        set buffer_view(value: int64)
        
        /** The offset relative to the start of the buffer view in bytes. */
        get byte_offset(): int64
        set byte_offset(value: int64)
        
        /** The GLTF component type as an enum. Possible values are 5120 for "BYTE", 5121 for "UNSIGNED_BYTE", 5122 for "SHORT", 5123 for "UNSIGNED_SHORT", 5125 for "UNSIGNED_INT", and 5126 for "FLOAT". A value of 5125 or "UNSIGNED_INT" must not be used for any accessor that is not referenced by mesh.primitive.indices. */
        get component_type(): int64
        set component_type(value: int64)
        
        /** Specifies whether integer data values are normalized before usage. */
        get normalized(): boolean
        set normalized(value: boolean)
        
        /** The number of elements referenced by this accessor. */
        get count(): int64
        set count(value: int64)
        
        /** The GLTF accessor type as an enum. Possible values are 0 for "SCALAR", 1 for "VEC2", 2 for "VEC3", 3 for "VEC4", 4 for "MAT2", 5 for "MAT3", and 6 for "MAT4". */
        get accessor_type(): int64
        set accessor_type(value: int64)
        
        /** The GLTF accessor type as an enum. Use [member accessor_type] instead. */
        get type(): int64
        set type(value: int64)
        
        /** Minimum value of each component in this accessor. */
        get min(): PackedFloat64Array
        set min(value: PackedFloat64Array | float64[])
        
        /** Maximum value of each component in this accessor. */
        get max(): PackedFloat64Array
        set max(value: PackedFloat64Array | float64[])
        
        /** Number of deviating accessor values stored in the sparse array. */
        get sparse_count(): int64
        set sparse_count(value: int64)
        
        /** The index of the buffer view with sparse indices. The referenced buffer view MUST NOT have its target or byteStride properties defined. The buffer view and the optional byteOffset MUST be aligned to the componentType byte length. */
        get sparse_indices_buffer_view(): int64
        set sparse_indices_buffer_view(value: int64)
        
        /** The offset relative to the start of the buffer view in bytes. */
        get sparse_indices_byte_offset(): int64
        set sparse_indices_byte_offset(value: int64)
        
        /** The indices component data type as an enum. Possible values are 5121 for "UNSIGNED_BYTE", 5123 for "UNSIGNED_SHORT", and 5125 for "UNSIGNED_INT". */
        get sparse_indices_component_type(): int64
        set sparse_indices_component_type(value: int64)
        
        /** The index of the bufferView with sparse values. The referenced buffer view MUST NOT have its target or byteStride properties defined. */
        get sparse_values_buffer_view(): int64
        set sparse_values_buffer_view(value: int64)
        
        /** The offset relative to the start of the bufferView in bytes. */
        get sparse_values_byte_offset(): int64
        set sparse_values_byte_offset(value: int64)
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_gltfanimation.html */
    class GLTFAnimation extends Resource {
        constructor(identifier?: any)
        /** Gets additional arbitrary data in this [GLTFAnimation] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the GLTF file), and the return value can be anything you set. If nothing was set, the return value is null.  
         */
        get_additional_data(extension_name: StringName): any
        
        /** Sets additional arbitrary data in this [GLTFAnimation] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The first argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the GLTF file), and the second argument can be anything you want.  
         */
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The original name of the animation. */
        get original_name(): string
        set original_name(value: string)
        get loop(): boolean
        set loop(value: boolean)
    }
    /** Represents a GLTF buffer view.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfbufferview.html  
     */
    class GLTFBufferView extends Resource {
        constructor(identifier?: any)
        /** Loads the buffer view data from the buffer referenced by this buffer view in the given [GLTFState]. Interleaved data with a byte stride is not yet supported by this method. The data is returned as a [PackedByteArray]. */
        load_buffer_view_data(state: GLTFState): PackedByteArray
        
        /** The index of the buffer this buffer view is referencing. If `-1`, this buffer view is not referencing any buffer. */
        get buffer(): int64
        set buffer(value: int64)
        
        /** The offset, in bytes, from the start of the buffer to the start of this buffer view. */
        get byte_offset(): int64
        set byte_offset(value: int64)
        
        /** The length, in bytes, of this buffer view. If `0`, this buffer view is empty. */
        get byte_length(): int64
        set byte_length(value: int64)
        
        /** The stride, in bytes, between interleaved data. If `-1`, this buffer view is not interleaved. */
        get byte_stride(): int64
        set byte_stride(value: int64)
        
        /** True if the GLTFBufferView's OpenGL GPU buffer type is an `ELEMENT_ARRAY_BUFFER` used for vertex indices (integer constant `34963`). False if the buffer type is any other value. See [url=https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/gltfTutorial_005_BuffersBufferViewsAccessors.md]Buffers, BufferViews, and Accessors[/url] for possible values. This property is set on import and used on export. */
        get indices(): boolean
        set indices(value: boolean)
        
        /** True if the GLTFBufferView's OpenGL GPU buffer type is an `ARRAY_BUFFER` used for vertex attributes (integer constant `34962`). False if the buffer type is any other value. See [url=https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/gltfTutorial_005_BuffersBufferViewsAccessors.md]Buffers, BufferViews, and Accessors[/url] for possible values. This property is set on import and used on export. */
        get vertex_attributes(): boolean
        set vertex_attributes(value: boolean)
    }
    /** Represents a GLTF camera.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfcamera.html  
     */
    class GLTFCamera extends Resource {
        constructor(identifier?: any)
        /** Create a new GLTFCamera instance from the given Godot [Camera3D] node. */
        static from_node(camera_node: Camera3D): GLTFCamera
        
        /** Converts this GLTFCamera instance into a Godot [Camera3D] node. */
        to_node(): Camera3D
        
        /** Creates a new GLTFCamera instance by parsing the given [Dictionary]. */
        static from_dictionary(dictionary: GDictionary): GLTFCamera
        
        /** Serializes this GLTFCamera instance into a [Dictionary]. */
        to_dictionary(): GDictionary
        
        /** Whether or not the camera is in perspective mode. If false, the camera is in orthographic/orthogonal mode. This maps to GLTF's camera `type` property. See [member Camera3D.projection] and the GLTF spec for more information. */
        get perspective(): boolean
        set perspective(value: boolean)
        
        /** The FOV of the camera. This class and GLTF define the camera FOV in radians, while Godot uses degrees. This maps to GLTF's `yfov` property. This value is only used for perspective cameras, when [member perspective] is true. */
        get fov(): float64
        set fov(value: float64)
        
        /** The size of the camera. This class and GLTF define the camera size magnitude as a radius in meters, while Godot defines it as a diameter in meters. This maps to GLTF's `ymag` property. This value is only used for orthographic/orthogonal cameras, when [member perspective] is false. */
        get size_mag(): float64
        set size_mag(value: float64)
        
        /** The distance to the far culling boundary for this camera relative to its local Z axis, in meters. This maps to GLTF's `zfar` property. */
        get depth_far(): float64
        set depth_far(value: float64)
        
        /** The distance to the near culling boundary for this camera relative to its local Z axis, in meters. This maps to GLTF's `znear` property. */
        get depth_near(): float64
        set depth_near(value: float64)
    }
    namespace GLTFDocument {
        enum RootNodeMode {
            /** Treat the Godot scene's root node as the root node of the glTF file, and mark it as the single root node via the `GODOT_single_root` glTF extension. This will be parsed the same as [constant ROOT_NODE_MODE_KEEP_ROOT] if the implementation does not support `GODOT_single_root`. */
            ROOT_NODE_MODE_SINGLE_ROOT = 0,
            
            /** Treat the Godot scene's root node as the root node of the glTF file, but do not mark it as anything special. An extra root node will be generated when importing into Godot. This uses only vanilla glTF features. This is equivalent to the behavior in Godot 4.1 and earlier. */
            ROOT_NODE_MODE_KEEP_ROOT = 1,
            
            /** Treat the Godot scene's root node as the name of the glTF scene, and add all of its children as root nodes of the glTF file. This uses only vanilla glTF features. This avoids an extra root node, but only the name of the Godot scene's root node will be preserved, as it will not be saved as a node. */
            ROOT_NODE_MODE_MULTI_ROOT = 2,
        }
    }
    /** Class for importing and exporting glTF files in and out of Godot.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfdocument.html  
     */
    class GLTFDocument extends Resource {
        constructor(identifier?: any)
        /** Takes a path to a GLTF file and imports the data at that file path to the given [GLTFState] object through the [param state] parameter.  
         *      
         *  **Note:** The [param base_path] tells [method append_from_file] where to find dependencies and can be empty.  
         */
        append_from_file(path: string, state: GLTFState, flags: int64 = 0, base_path: string = ''): GError
        
        /** Takes a [PackedByteArray] defining a GLTF and imports the data to the given [GLTFState] object through the [param state] parameter.  
         *      
         *  **Note:** The [param base_path] tells [method append_from_buffer] where to find dependencies and can be empty.  
         */
        append_from_buffer(bytes: PackedByteArray | byte[] | ArrayBuffer, base_path: string, state: GLTFState, flags: int64 = 0): GError
        
        /** Takes a Godot Engine scene node and exports it and its descendants to the given [GLTFState] object through the [param state] parameter. */
        append_from_scene(node: Node, state: GLTFState, flags: int64 = 0): GError
        
        /** Takes a [GLTFState] object through the [param state] parameter and returns a Godot Engine scene node.  
         *  The [param bake_fps] parameter overrides the bake_fps in [param state].  
         */
        generate_scene(state: GLTFState, bake_fps: float64 = 30, trimming: boolean = false, remove_immutable_tracks: boolean = true): Node
        
        /** Takes a [GLTFState] object through the [param state] parameter and returns a GLTF [PackedByteArray]. */
        generate_buffer(state: GLTFState): PackedByteArray
        
        /** Takes a [GLTFState] object through the [param state] parameter and writes a glTF file to the filesystem.  
         *      
         *  **Note:** The extension of the glTF file determines if it is a .glb binary file or a .gltf text file.  
         */
        write_to_filesystem(state: GLTFState, path: string): GError
        
        /** Registers the given [GLTFDocumentExtension] instance with GLTFDocument. If [param first_priority] is true, this extension will be run first. Otherwise, it will be run last.  
         *      
         *  **Note:** Like GLTFDocument itself, all GLTFDocumentExtension classes must be stateless in order to function properly. If you need to store data, use the `set_additional_data` and `get_additional_data` methods in [GLTFState] or [GLTFNode].  
         */
        static register_gltf_document_extension(extension: GLTFDocumentExtension, first_priority: boolean = false): void
        
        /** Unregisters the given [GLTFDocumentExtension] instance. */
        static unregister_gltf_document_extension(extension: GLTFDocumentExtension): void
        
        /** The user-friendly name of the export image format. This is used when exporting the GLTF file, including writing to a file and writing to a byte array.  
         *  By default, Godot allows the following options: "None", "PNG", "JPEG", "Lossless WebP", and "Lossy WebP". Support for more image formats can be added in [GLTFDocumentExtension] classes.  
         */
        get image_format(): string
        set image_format(value: string)
        
        /** If [member image_format] is a lossy image format, this determines the lossy quality of the image. On a range of `0.0` to `1.0`, where `0.0` is the lowest quality and `1.0` is the highest quality. A lossy quality of `1.0` is not the same as lossless. */
        get lossy_quality(): float64
        set lossy_quality(value: float64)
        
        /** How to process the root node during export. See [enum RootNodeMode] for details. The default and recommended value is [constant ROOT_NODE_MODE_SINGLE_ROOT].  
         *      
         *  **Note:** Regardless of how the glTF file is exported, when importing, the root node type and name can be overridden in the scene import settings tab.  
         */
        get root_node_mode(): int64
        set root_node_mode(value: int64)
    }
    /** [GLTFDocument] extension class.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfdocumentextension.html  
     */
    class GLTFDocumentExtension extends Resource {
        constructor(identifier?: any)
        /** Part of the import process. This method is run first, before all other parts of the import process.  
         *  The return value is used to determine if this [GLTFDocumentExtension] instance should be used for importing a given GLTF file. If [constant OK], the import will use this [GLTFDocumentExtension] instance. If not overridden, [constant OK] is returned.  
         */
        /* gdvirtual */ _import_preflight(state: GLTFState, extensions: PackedStringArray | string[]): GError
        
        /** Part of the import process. This method is run after [method _import_preflight] and before [method _parse_node_extensions].  
         *  Returns an array of the GLTF extensions supported by this GLTFDocumentExtension class. This is used to validate if a GLTF file with required extensions can be loaded.  
         */
        /* gdvirtual */ _get_supported_extensions(): PackedStringArray
        
        /** Part of the import process. This method is run after [method _get_supported_extensions] and before [method _import_post_parse].  
         *  Runs when parsing the node extensions of a GLTFNode. This method can be used to process the extension JSON data into a format that can be used by [method _generate_scene_node]. The return value should be a member of the [enum Error] enum.  
         */
        /* gdvirtual */ _parse_node_extensions(state: GLTFState, gltf_node: GLTFNode, extensions: GDictionary): GError
        
        /** Part of the import process. This method is run after [method _parse_node_extensions] and before [method _parse_texture_json].  
         *  Runs when parsing image data from a GLTF file. The data could be sourced from a separate file, a URI, or a buffer, and then is passed as a byte array.  
         */
        /* gdvirtual */ _parse_image_data(state: GLTFState, image_data: PackedByteArray | byte[] | ArrayBuffer, mime_type: string, ret_image: Image): GError
        
        /** Returns the file extension to use for saving image data into, for example, `".png"`. If defined, when this extension is used to handle images, and the images are saved to a separate file, the image bytes will be copied to a file with this extension. If this is set, there should be a [ResourceImporter] class able to import the file. If not defined or empty, Godot will save the image into a PNG file. */
        /* gdvirtual */ _get_image_file_extension(): string
        
        /** Part of the import process. This method is run after [method _parse_image_data] and before [method _generate_scene_node].  
         *  Runs when parsing the texture JSON from the GLTF textures array. This can be used to set the source image index to use as the texture.  
         */
        /* gdvirtual */ _parse_texture_json(state: GLTFState, texture_json: GDictionary, ret_gltf_texture: GLTFTexture): GError
        
        /** Part of the import process. This method is run after [method _import_post_parse] and before [method _import_node].  
         *  Runs when generating a Godot scene node from a GLTFNode. The returned node will be added to the scene tree. Multiple nodes can be generated in this step if they are added as a child of the returned node.  
         *      
         *  **Note:** The [param scene_parent] parameter may be null if this is the single root node.  
         */
        /* gdvirtual */ _generate_scene_node(state: GLTFState, gltf_node: GLTFNode, scene_parent: Node): Node3D
        
        /** Part of the import process. This method is run after [method _parse_node_extensions] and before [method _generate_scene_node].  
         *  This method can be used to modify any of the data imported so far after parsing, before generating the nodes and then running the final per-node import step.  
         */
        /* gdvirtual */ _import_post_parse(state: GLTFState): GError
        
        /** Part of the import process. This method is run after [method _generate_scene_node] and before [method _import_post].  
         *  This method can be used to make modifications to each of the generated Godot scene nodes.  
         */
        /* gdvirtual */ _import_node(state: GLTFState, gltf_node: GLTFNode, json: GDictionary, node: Node): GError
        
        /** Part of the import process. This method is run last, after all other parts of the import process.  
         *  This method can be used to modify the final Godot scene generated by the import process.  
         */
        /* gdvirtual */ _import_post(state: GLTFState, root: Node): GError
        
        /** Part of the export process. This method is run first, before all other parts of the export process.  
         *  The return value is used to determine if this [GLTFDocumentExtension] instance should be used for exporting a given GLTF file. If [constant OK], the export will use this [GLTFDocumentExtension] instance. If not overridden, [constant OK] is returned.  
         */
        /* gdvirtual */ _export_preflight(state: GLTFState, root: Node): GError
        
        /** Part of the export process. This method is run after [method _export_preflight] and before [method _export_preserialize].  
         *  Runs when converting the data from a Godot scene node. This method can be used to process the Godot scene node data into a format that can be used by [method _export_node].  
         */
        /* gdvirtual */ _convert_scene_node(state: GLTFState, gltf_node: GLTFNode, scene_node: Node): void
        
        /** Part of the export process. This method is run after [method _convert_scene_node] and before [method _get_saveable_image_formats].  
         *  This method can be used to alter the state before performing serialization. It runs every time when generating a buffer with [method GLTFDocument.generate_buffer] or writing to the file system with [method GLTFDocument.write_to_filesystem].  
         */
        /* gdvirtual */ _export_preserialize(state: GLTFState): GError
        
        /** Part of the export process. This method is run after [method _convert_scene_node] and before [method _export_node].  
         *  Returns an array of the image formats that can be saved/exported by this extension. This extension will only be selected as the image exporter if the [GLTFDocument]'s [member GLTFDocument.image_format] is in this array. If this [GLTFDocumentExtension] is selected as the image exporter, one of the [method _save_image_at_path] or [method _serialize_image_to_bytes] methods will run next, otherwise [method _export_node] will run next. If the format name contains `"Lossy"`, the lossy quality slider will be displayed.  
         */
        /* gdvirtual */ _get_saveable_image_formats(): PackedStringArray
        
        /** Part of the export process. This method is run after [method _get_saveable_image_formats] and before [method _serialize_texture_json].  
         *  This method is run when embedding images in the GLTF file. When images are saved separately, [method _save_image_at_path] runs instead. Note that these methods only run when this [GLTFDocumentExtension] is selected as the image exporter.  
         *  This method must set the image MIME type in the [param image_dict] with the `"mimeType"` key. For example, for a PNG image, it would be set to `"image/png"`. The return value must be a [PackedByteArray] containing the image data.  
         */
        /* gdvirtual */ _serialize_image_to_bytes(state: GLTFState, image: Image, image_dict: GDictionary, image_format: string, lossy_quality: float64): PackedByteArray
        
        /** Part of the export process. This method is run after [method _get_saveable_image_formats] and before [method _serialize_texture_json].  
         *  This method is run when saving images separately from the GLTF file. When images are embedded, [method _serialize_image_to_bytes] runs instead. Note that these methods only run when this [GLTFDocumentExtension] is selected as the image exporter.  
         */
        /* gdvirtual */ _save_image_at_path(state: GLTFState, image: Image, file_path: string, image_format: string, lossy_quality: float64): GError
        
        /** Part of the export process. This method is run after [method _save_image_at_path] or [method _serialize_image_to_bytes], and before [method _export_node]. Note that this method only runs when this [GLTFDocumentExtension] is selected as the image exporter.  
         *  This method can be used to set up the extensions for the texture JSON by editing [param texture_json]. The extension must also be added as used extension with [method GLTFState.add_used_extension], be sure to set `required` to `true` if you are not providing a fallback.  
         */
        /* gdvirtual */ _serialize_texture_json(state: GLTFState, texture_json: GDictionary, gltf_texture: GLTFTexture, image_format: string): GError
        
        /** Part of the export process. This method is run after [method _get_saveable_image_formats] and before [method _export_post]. If this [GLTFDocumentExtension] is used for exporting images, this runs after [method _serialize_texture_json].  
         *  This method can be used to modify the final JSON of each node. Data should be primarily stored in [param gltf_node] prior to serializing the JSON, but the original Godot [param node] is also provided if available. The node may be null if not available, such as when exporting GLTF data not generated from a Godot scene.  
         */
        /* gdvirtual */ _export_node(state: GLTFState, gltf_node: GLTFNode, json: GDictionary, node: Node): GError
        
        /** Part of the export process. This method is run last, after all other parts of the export process.  
         *  This method can be used to modify the final JSON of the generated GLTF file.  
         */
        /* gdvirtual */ _export_post(state: GLTFState): GError
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_gltfdocumentextensionconvertimportermesh.html */
    class GLTFDocumentExtensionConvertImporterMesh extends GLTFDocumentExtension {
        constructor(identifier?: any)
    }
    class GLTFDocumentExtensionPhysics extends GLTFDocumentExtension {
        constructor(identifier?: any)
    }
    class GLTFDocumentExtensionTextureKTX extends GLTFDocumentExtension {
        constructor(identifier?: any)
    }
    class GLTFDocumentExtensionTextureWebP extends GLTFDocumentExtension {
        constructor(identifier?: any)
    }
    /** Represents a GLTF light.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltflight.html  
     */
    class GLTFLight extends Resource {
        constructor(identifier?: any)
        /** Create a new GLTFLight instance from the given Godot [Light3D] node. */
        static from_node(light_node: Light3D): GLTFLight
        
        /** Converts this GLTFLight instance into a Godot [Light3D] node. */
        to_node(): Light3D
        
        /** Creates a new GLTFLight instance by parsing the given [Dictionary]. */
        static from_dictionary(dictionary: GDictionary): GLTFLight
        
        /** Serializes this GLTFLight instance into a [Dictionary]. */
        to_dictionary(): GDictionary
        get_additional_data(extension_name: StringName): any
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The [Color] of the light. Defaults to white. A black color causes the light to have no effect. */
        get color(): Color
        set color(value: Color)
        
        /** The intensity of the light. This is expressed in candelas (lumens per steradian) for point and spot lights, and lux (lumens per m²) for directional lights. When creating a Godot light, this value is converted to a unitless multiplier. */
        get intensity(): float64
        set intensity(value: float64)
        
        /** The type of the light. The values accepted by Godot are "point", "spot", and "directional", which correspond to Godot's [OmniLight3D], [SpotLight3D], and [DirectionalLight3D] respectively. */
        get light_type(): string
        set light_type(value: string)
        
        /** The range of the light, beyond which the light has no effect. GLTF lights with no range defined behave like physical lights (which have infinite range). When creating a Godot light, the range is clamped to 4096. */
        get range(): float64
        set range(value: float64)
        
        /** The inner angle of the cone in a spotlight. Must be less than or equal to the outer cone angle.  
         *  Within this angle, the light is at full brightness. Between the inner and outer cone angles, there is a transition from full brightness to zero brightness. When creating a Godot [SpotLight3D], the ratio between the inner and outer cone angles is used to calculate the attenuation of the light.  
         */
        get inner_cone_angle(): float64
        set inner_cone_angle(value: float64)
        
        /** The outer angle of the cone in a spotlight. Must be greater than or equal to the inner angle.  
         *  At this angle, the light drops off to zero brightness. Between the inner and outer cone angles, there is a transition from full brightness to zero brightness. If this angle is a half turn, then the spotlight emits in all directions. When creating a Godot [SpotLight3D], the outer cone angle is used as the angle of the spotlight.  
         */
        get outer_cone_angle(): float64
        set outer_cone_angle(value: float64)
    }
    /** GLTFMesh represents a GLTF mesh.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfmesh.html  
     */
    class GLTFMesh extends Resource {
        constructor(identifier?: any)
        /** Gets additional arbitrary data in this [GLTFMesh] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the GLTF file), and the return value can be anything you set. If nothing was set, the return value is null.  
         */
        get_additional_data(extension_name: StringName): any
        
        /** Sets additional arbitrary data in this [GLTFMesh] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The first argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the GLTF file), and the second argument can be anything you want.  
         */
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The original name of the mesh. */
        get original_name(): string
        set original_name(value: string)
        
        /** The [ImporterMesh] object representing the mesh itself. */
        get mesh(): Object
        set mesh(value: Object)
        
        /** An array of floats representing the blend weights of the mesh. */
        get blend_weights(): PackedFloat32Array
        set blend_weights(value: PackedFloat32Array | float32[])
        
        /** An array of Material objects representing the materials used in the mesh. */
        get instance_materials(): GArray
        set instance_materials(value: GArray)
    }
    /** GLTF node class.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfnode.html  
     */
    class GLTFNode extends Resource {
        constructor(identifier?: any)
        /** Gets additional arbitrary data in this [GLTFNode] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the GLTF file), and the return value can be anything you set. If nothing was set, the return value is null.  
         */
        get_additional_data(extension_name: StringName): any
        
        /** Sets additional arbitrary data in this [GLTFNode] instance. This can be used to keep per-node state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The first argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the GLTF file), and the second argument can be anything you want.  
         */
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The original name of the node. */
        get original_name(): string
        set original_name(value: string)
        
        /** The index of the parent node in the [GLTFState]. If -1, this node is a root node. */
        get parent(): int64
        set parent(value: int64)
        
        /** How deep into the node hierarchy this node is. A root node will have a height of 0, its children will have a height of 1, and so on. If -1, the height has not been calculated. */
        get height(): int64
        set height(value: int64)
        
        /** The transform of the GLTF node relative to its parent. This property is usually unused since the position, rotation, and scale properties are preferred. */
        get xform(): Transform3D
        set xform(value: Transform3D)
        
        /** If this GLTF node is a mesh, the index of the [GLTFMesh] in the [GLTFState] that describes the mesh's properties. If -1, this node is not a mesh. */
        get mesh(): int64
        set mesh(value: int64)
        
        /** If this GLTF node is a camera, the index of the [GLTFCamera] in the [GLTFState] that describes the camera's properties. If -1, this node is not a camera. */
        get camera(): int64
        set camera(value: int64)
        
        /** If this GLTF node has a skin, the index of the [GLTFSkin] in the [GLTFState] that describes the skin's properties. If -1, this node does not have a skin. */
        get skin(): int64
        set skin(value: int64)
        
        /** If this GLTF node has a skeleton, the index of the [GLTFSkeleton] in the [GLTFState] that describes the skeleton's properties. If -1, this node does not have a skeleton. */
        get skeleton(): int64
        set skeleton(value: int64)
        
        /** The position of the GLTF node relative to its parent. */
        get position(): Vector3
        set position(value: Vector3)
        
        /** The rotation of the GLTF node relative to its parent. */
        get rotation(): Quaternion
        set rotation(value: Quaternion)
        
        /** The scale of the GLTF node relative to its parent. */
        get scale(): Vector3
        set scale(value: Vector3)
        
        /** The indices of the child nodes in the [GLTFState]. If this GLTF node has no children, this will be an empty array. */
        get children(): PackedInt32Array
        set children(value: PackedInt32Array | int32[])
        
        /** If this GLTF node is a light, the index of the [GLTFLight] in the [GLTFState] that describes the light's properties. If -1, this node is not a light. */
        get light(): int64
        set light(value: int64)
    }
    /** Represents a GLTF physics body.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfphysicsbody.html  
     */
    class GLTFPhysicsBody extends Resource {
        constructor(identifier?: any)
        /** Creates a new GLTFPhysicsBody instance from the given Godot [CollisionObject3D] node. */
        static from_node(body_node: CollisionObject3D): GLTFPhysicsBody
        
        /** Converts this GLTFPhysicsBody instance into a Godot [CollisionObject3D] node. */
        to_node(): CollisionObject3D
        
        /** Creates a new GLTFPhysicsBody instance by parsing the given [Dictionary] in the `OMI_physics_body` GLTF extension format. */
        static from_dictionary(dictionary: GDictionary): GLTFPhysicsBody
        
        /** Serializes this GLTFPhysicsBody instance into a [Dictionary]. It will be in the format expected by the `OMI_physics_body` GLTF extension. */
        to_dictionary(): GDictionary
        
        /** The type of the body. When importing, this controls what type of [CollisionObject3D] node Godot should generate. Valid values are "static", "animatable", "character", "rigid", "vehicle", and "trigger". When exporting, this will be squashed down to one of "static", "kinematic", or "dynamic" motion types, or the "trigger" property. */
        get body_type(): string
        set body_type(value: string)
        
        /** The mass of the physics body, in kilograms. This is only used when the body type is "rigid" or "vehicle". */
        get mass(): float64
        set mass(value: float64)
        
        /** The linear velocity of the physics body, in meters per second. This is only used when the body type is "rigid" or "vehicle". */
        get linear_velocity(): Vector3
        set linear_velocity(value: Vector3)
        
        /** The angular velocity of the physics body, in radians per second. This is only used when the body type is "rigid" or "vehicle". */
        get angular_velocity(): Vector3
        set angular_velocity(value: Vector3)
        
        /** The center of mass of the body, in meters. This is in local space relative to the body. By default, the center of the mass is the body's origin. */
        get center_of_mass(): Vector3
        set center_of_mass(value: Vector3)
        
        /** The inertia strength of the physics body, in kilogram meter squared (kg⋅m²). This represents the inertia around the principle axes, the diagonal of the inertia tensor matrix. This is only used when the body type is "rigid" or "vehicle".  
         *  When converted to a Godot [RigidBody3D] node, if this value is zero, then the inertia will be calculated automatically.  
         */
        get inertia_diagonal(): Vector3
        set inertia_diagonal(value: Vector3)
        
        /** The inertia orientation of the physics body. This defines the rotation of the inertia's principle axes relative to the object's local axes. This is only used when the body type is "rigid" or "vehicle" and [member inertia_diagonal] is set to a non-zero value. */
        get inertia_orientation(): Quaternion
        set inertia_orientation(value: Quaternion)
        
        /** The inertia tensor of the physics body, in kilogram meter squared (kg⋅m²). This is only used when the body type is "rigid" or "vehicle".  
         *  When converted to a Godot [RigidBody3D] node, if this value is zero, then the inertia will be calculated automatically.  
         */
        get inertia_tensor(): Basis
        set inertia_tensor(value: Basis)
    }
    /** Represents a GLTF physics shape.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfphysicsshape.html  
     */
    class GLTFPhysicsShape extends Resource {
        constructor(identifier?: any)
        /** Creates a new GLTFPhysicsShape instance from the given Godot [CollisionShape3D] node. */
        static from_node(shape_node: CollisionShape3D): GLTFPhysicsShape
        
        /** Converts this GLTFPhysicsShape instance into a Godot [CollisionShape3D] node. */
        to_node(cache_shapes: boolean = false): CollisionShape3D
        
        /** Creates a new GLTFPhysicsShape instance from the given Godot [Shape3D] resource. */
        static from_resource(shape_resource: Shape3D): GLTFPhysicsShape
        
        /** Converts this GLTFPhysicsShape instance into a Godot [Shape3D] resource. */
        to_resource(cache_shapes: boolean = false): Shape3D
        
        /** Creates a new GLTFPhysicsShape instance by parsing the given [Dictionary]. */
        static from_dictionary(dictionary: GDictionary): GLTFPhysicsShape
        
        /** Serializes this GLTFPhysicsShape instance into a [Dictionary] in the format defined by `OMI_physics_shape`. */
        to_dictionary(): GDictionary
        
        /** The type of shape this shape represents. Valid values are "box", "capsule", "cylinder", "sphere", "hull", and "trimesh". */
        get shape_type(): string
        set shape_type(value: string)
        
        /** The size of the shape, in meters. This is only used when the shape type is "box", and it represents the "diameter" of the box. This value should not be negative. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** The radius of the shape, in meters. This is only used when the shape type is "capsule", "cylinder", or "sphere". This value should not be negative. */
        get radius(): float64
        set radius(value: float64)
        
        /** The height of the shape, in meters. This is only used when the shape type is "capsule" or "cylinder". This value should not be negative, and for "capsule" it should be at least twice the radius. */
        get height(): float64
        set height(value: float64)
        
        /** If `true`, indicates that this shape is a trigger. For Godot, this means that the shape should be a child of an Area3D node.  
         *  This is the only variable not used in the [method to_node] method, it's intended to be used alongside when deciding where to add the generated node as a child.  
         */
        get is_trigger(): boolean
        set is_trigger(value: boolean)
        
        /** The index of the shape's mesh in the GLTF file. This is only used when the shape type is "hull" (convex hull) or "trimesh" (concave trimesh). */
        get mesh_index(): int64
        set mesh_index(value: int64)
        
        /** The [ImporterMesh] resource of the shape. This is only used when the shape type is "hull" (convex hull) or "trimesh" (concave trimesh). */
        get importer_mesh(): ImporterMesh
        set importer_mesh(value: ImporterMesh)
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_gltfskeleton.html */
    class GLTFSkeleton extends Resource {
        constructor(identifier?: any)
        get_godot_skeleton(): Skeleton3D
        get_bone_attachment_count(): int64
        get_bone_attachment(idx: int64): BoneAttachment3D
        get joints(): PackedInt32Array
        set joints(value: PackedInt32Array | int32[])
        get roots(): PackedInt32Array
        set roots(value: PackedInt32Array | int32[])
        get unique_names(): GArray
        set unique_names(value: GArray)
        get godot_bone_node(): GDictionary
        set godot_bone_node(value: GDictionary)
    }
    /** @link https://docs.godotengine.org/en/4.3/classes/class_gltfskin.html */
    class GLTFSkin extends Resource {
        constructor(identifier?: any)
        get skin_root(): int64
        set skin_root(value: int64)
        get joints_original(): PackedInt32Array
        set joints_original(value: PackedInt32Array | int32[])
        get inverse_binds(): GArray
        set inverse_binds(value: GArray)
        get joints(): PackedInt32Array
        set joints(value: PackedInt32Array | int32[])
        get non_joints(): PackedInt32Array
        set non_joints(value: PackedInt32Array | int32[])
        get roots(): PackedInt32Array
        set roots(value: PackedInt32Array | int32[])
        get skeleton(): int64
        set skeleton(value: int64)
        get joint_i_to_bone_i(): GDictionary
        set joint_i_to_bone_i(value: GDictionary)
        get joint_i_to_name(): GDictionary
        set joint_i_to_name(value: GDictionary)
        get godot_skin(): Skin
        set godot_skin(value: Skin)
    }
    /** Archived GLTF extension for specular/glossy materials.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfspecgloss.html  
     */
    class GLTFSpecGloss extends Resource {
        constructor(identifier?: any)
        /** The diffuse texture. */
        get diffuse_img(): Object
        set diffuse_img(value: Object)
        
        /** The reflected diffuse factor of the material. */
        get diffuse_factor(): Color
        set diffuse_factor(value: Color)
        
        /** The glossiness or smoothness of the material. */
        get gloss_factor(): float64
        set gloss_factor(value: float64)
        
        /** The specular RGB color of the material. The alpha channel is unused. */
        get specular_factor(): Color
        set specular_factor(value: Color)
        
        /** The specular-glossiness texture. */
        get spec_gloss_img(): Object
        set spec_gloss_img(value: Object)
    }
    /** Represents all data of a GLTF file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltfstate.html  
     */
    class GLTFState extends Resource {
        /** Discards all embedded textures and uses untextured materials. */
        static readonly HANDLE_BINARY_DISCARD_TEXTURES = 0
        
        /** Extracts embedded textures to be reimported and compressed. Editor only. Acts as uncompressed at runtime. */
        static readonly HANDLE_BINARY_EXTRACT_TEXTURES = 1
        
        /** Embeds textures VRAM compressed with Basis Universal into the generated scene. */
        static readonly HANDLE_BINARY_EMBED_AS_BASISU = 2
        
        /** Embeds textures compressed losslessly into the generated scene, matching old behavior. */
        static readonly HANDLE_BINARY_EMBED_AS_UNCOMPRESSED = 3
        constructor(identifier?: any)
        
        /** Appends an extension to the list of extensions used by this GLTF file during serialization. If [param required] is true, the extension will also be added to the list of required extensions. Do not run this in [method GLTFDocumentExtension._export_post], as that stage is too late to add extensions. The final list is sorted alphabetically. */
        add_used_extension(extension_name: string, required: boolean): void
        
        /** Appends the given byte array data to the buffers and creates a [GLTFBufferView] for it. The index of the destination [GLTFBufferView] is returned. If [param deduplication] is true, the buffers will first be searched for duplicate data, otherwise new bytes will always be appended. */
        append_data_to_buffers(data: PackedByteArray | byte[] | ArrayBuffer, deduplication: boolean): int64
        
        /** Returns the number of [AnimationPlayer] nodes in this [GLTFState]. These nodes are only used during the export process when converting Godot [AnimationPlayer] nodes to GLTF animations. */
        get_animation_players_count(idx: int64): int64
        
        /** Returns the [AnimationPlayer] node with the given index. These nodes are only used during the export process when converting Godot [AnimationPlayer] nodes to GLTF animations. */
        get_animation_player(idx: int64): AnimationPlayer
        
        /** Returns the Godot scene node that corresponds to the same index as the [GLTFNode] it was generated from. This is the inverse of [method get_node_index]. Useful during the import process.  
         *      
         *  **Note:** Not every [GLTFNode] will have a scene node generated, and not every generated scene node will have a corresponding [GLTFNode]. If there is no scene node for this [GLTFNode] index, `null` is returned.  
         */
        get_scene_node(idx: int64): Node
        
        /** Returns the index of the [GLTFNode] corresponding to this Godot scene node. This is the inverse of [method get_scene_node]. Useful during the export process.  
         *      
         *  **Note:** Not every Godot scene node will have a corresponding [GLTFNode], and not every [GLTFNode] will have a scene node generated. If there is no [GLTFNode] index for this scene node, `-1` is returned.  
         */
        get_node_index(scene_node: Node): int64
        
        /** Gets additional arbitrary data in this [GLTFState] instance. This can be used to keep per-file state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the GLTF file), and the return value can be anything you set. If nothing was set, the return value is null.  
         */
        get_additional_data(extension_name: StringName): any
        
        /** Sets additional arbitrary data in this [GLTFState] instance. This can be used to keep per-file state data in [GLTFDocumentExtension] classes, which is important because they are stateless.  
         *  The first argument should be the [GLTFDocumentExtension] name (does not have to match the extension name in the GLTF file), and the second argument can be anything you want.  
         */
        set_additional_data(extension_name: StringName, additional_data: any): void
        
        /** The original raw JSON document corresponding to this GLTFState. */
        get json(): GDictionary
        set json(value: GDictionary)
        get major_version(): int64
        set major_version(value: int64)
        get minor_version(): int64
        set minor_version(value: int64)
        
        /** The copyright string in the asset header of the GLTF file. This is set during import if present and export if non-empty. See the GLTF asset header documentation for more information. */
        get copyright(): string
        set copyright(value: string)
        
        /** The binary buffer attached to a .glb file. */
        get glb_data(): PackedByteArray
        set glb_data(value: PackedByteArray | byte[] | ArrayBuffer)
        get use_named_skin_binds(): boolean
        set use_named_skin_binds(value: boolean)
        get nodes(): GArray
        set nodes(value: GArray)
        get buffers(): GArray
        set buffers(value: GArray)
        get buffer_views(): GArray
        set buffer_views(value: GArray)
        get accessors(): GArray
        set accessors(value: GArray)
        get meshes(): GArray
        set meshes(value: GArray)
        get materials(): GArray
        set materials(value: GArray)
        
        /** The name of the scene. When importing, if not specified, this will be the file name. When exporting, if specified, the scene name will be saved to the GLTF file. */
        get scene_name(): string
        set scene_name(value: string)
        
        /** The folder path associated with this GLTF data. This is used to find other files the GLTF file references, like images or binary buffers. This will be set during import when appending from a file, and will be set during export when writing to a file. */
        get base_path(): string
        set base_path(value: string)
        
        /** The file name associated with this GLTF data. If it ends with `.gltf`, this is text-based GLTF, otherwise this is binary GLB. This will be set during import when appending from a file, and will be set during export when writing to a file. If writing to a buffer, this will be an empty string. */
        get filename(): string
        set filename(value: string)
        
        /** The root nodes of the GLTF file. Typically, a GLTF file will only have one scene, and therefore one root node. However, a GLTF file may have multiple scenes and therefore multiple root nodes, which will be generated as siblings of each other and as children of the root node of the generated Godot scene. */
        get root_nodes(): PackedInt32Array
        set root_nodes(value: PackedInt32Array | int32[])
        get textures(): GArray
        set textures(value: GArray)
        get texture_samplers(): GArray
        set texture_samplers(value: GArray)
        get images(): GArray
        set images(value: GArray)
        get skins(): GArray
        set skins(value: GArray)
        get cameras(): GArray
        set cameras(value: GArray)
        get lights(): GArray
        set lights(value: GArray)
        get unique_names(): GArray
        set unique_names(value: GArray)
        get unique_animation_names(): GArray
        set unique_animation_names(value: GArray)
        get skeletons(): GArray
        set skeletons(value: GArray)
        get create_animations(): boolean
        set create_animations(value: boolean)
        
        /** True to force all GLTFNodes in the document to be bones of a single Skeleton3D godot node. */
        get import_as_skeleton_bones(): boolean
        set import_as_skeleton_bones(value: boolean)
        get animations(): GArray
        set animations(value: GArray)
        get handle_binary_image(): int64
        set handle_binary_image(value: int64)
        
        /** The baking fps of the animation for either import or export. */
        get bake_fps(): float64
        set bake_fps(value: float64)
    }
    /** GLTFTexture represents a texture in a GLTF file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltftexture.html  
     */
    class GLTFTexture extends Resource {
        constructor(identifier?: any)
        /** The index of the image associated with this texture, see [method GLTFState.get_images]. If -1, then this texture does not have an image assigned. */
        get src_image(): int64
        set src_image(value: int64)
        
        /** ID of the texture sampler to use when sampling the image. If -1, then the default texture sampler is used (linear filtering, and repeat wrapping in both axes). */
        get sampler(): int64
        set sampler(value: int64)
    }
    /** Represents a GLTF texture sampler  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gltftexturesampler.html  
     */
    class GLTFTextureSampler extends Resource {
        constructor(identifier?: any)
        /** Texture's magnification filter, used when texture appears larger on screen than the source image. */
        get mag_filter(): int64
        set mag_filter(value: int64)
        
        /** Texture's minification filter, used when the texture appears smaller on screen than the source image. */
        get min_filter(): int64
        set min_filter(value: int64)
        
        /** Wrapping mode to use for S-axis (horizontal) texture coordinates. */
        get wrap_s(): int64
        set wrap_s(value: int64)
        
        /** Wrapping mode to use for T-axis (vertical) texture coordinates. */
        get wrap_t(): int64
        set wrap_t(value: int64)
    }
    namespace GPUParticles2D {
        enum DrawOrder {
            /** Particles are drawn in the order emitted. */
            DRAW_ORDER_INDEX = 0,
            
            /** Particles are drawn in order of remaining lifetime. In other words, the particle with the highest lifetime is drawn at the front. */
            DRAW_ORDER_LIFETIME = 1,
            
            /** Particles are drawn in reverse order of remaining lifetime. In other words, the particle with the lowest lifetime is drawn at the front. */
            DRAW_ORDER_REVERSE_LIFETIME = 2,
        }
        enum EmitFlags {
            /** Particle starts at the specified position. */
            EMIT_FLAG_POSITION = 1,
            
            /** Particle starts with specified rotation and scale. */
            EMIT_FLAG_ROTATION_SCALE = 2,
            
            /** Particle starts with the specified velocity vector, which defines the emission direction and speed. */
            EMIT_FLAG_VELOCITY = 4,
            
            /** Particle starts with specified color. */
            EMIT_FLAG_COLOR = 8,
            
            /** Particle starts with specified `CUSTOM` data. */
            EMIT_FLAG_CUSTOM = 16,
        }
    }
    /** A 2D particle emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gpuparticles2d.html  
     */
    class GPUParticles2D extends Node2D {
        constructor(identifier?: any)
        /** Returns a rectangle containing the positions of all existing particles.  
         *      
         *  **Note:** When using threaded rendering this method synchronizes the rendering thread. Calling it often may have a negative impact on performance.  
         */
        capture_rect(): Rect2
        
        /** Restarts the particle emission cycle, clearing existing particles. To avoid particles vanishing from the viewport, wait for the [signal finished] signal before calling.  
         *      
         *  **Note:** The [signal finished] signal is only emitted by [member one_shot] emitters.  
         */
        restart(): void
        
        /** Emits a single particle. Whether [param xform], [param velocity], [param color] and [param custom] are applied depends on the value of [param flags]. See [enum EmitFlags].  
         *  The default ParticleProcessMaterial will overwrite [param color] and use the contents of [param custom] as `(rotation, age, animation, lifetime)`.  
         */
        emit_particle(xform: Transform2D, velocity: Vector2, color: Color, custom: Color, flags: int64): void
        
        /** Sets this node's properties to match a given [CPUParticles2D] node. */
        convert_from_particles(particles: Node): void
        
        /** If `true`, particles are being emitted. [member emitting] can be used to start and stop particles from emitting. However, if [member one_shot] is `true` setting [member emitting] to `true` will not restart the emission cycle unless all active particles have finished processing. Use the [signal finished] signal to be notified once all active particles finish processing.  
         *      
         *  **Note:** For [member one_shot] emitters, due to the particles being computed on the GPU, there may be a short period after receiving the [signal finished] signal during which setting this to `true` will not restart the emission cycle.  
         *  **Tip:** If your [member one_shot] emitter needs to immediately restart emitting particles once [signal finished] signal is received, consider calling [method restart] instead of setting [member emitting].  
         */
        get emitting(): boolean
        set emitting(value: boolean)
        
        /** The number of particles to emit in one emission cycle. The effective emission rate is `(amount * amount_ratio) / lifetime` particles per second. Higher values will increase GPU requirements, even if not all particles are visible at a given time or if [member amount_ratio] is decreased.  
         *      
         *  **Note:** Changing this value will cause the particle system to restart. To avoid this, change [member amount_ratio] instead.  
         */
        get amount(): int64
        set amount(value: int64)
        
        /** The ratio of particles that should actually be emitted. If set to a value lower than `1.0`, this will set the amount of emitted particles throughout the lifetime to `amount * amount_ratio`. Unlike changing [member amount], changing [member amount_ratio] while emitting does not affect already-emitted particles and doesn't cause the particle system to restart. [member amount_ratio] can be used to create effects that make the number of emitted particles vary over time.  
         *      
         *  **Note:** Reducing the [member amount_ratio] has no performance benefit, since resources need to be allocated and processed for the total [member amount] of particles regardless of the [member amount_ratio]. If you don't intend to change the number of particles emitted while the particles are emitting, make sure [member amount_ratio] is set to `1` and change [member amount] to your liking instead.  
         */
        get amount_ratio(): float64
        set amount_ratio(value: float64)
        
        /** Path to another [GPUParticles2D] node that will be used as a subemitter (see [member ParticleProcessMaterial.sub_emitter_mode]). Subemitters can be used to achieve effects such as fireworks, sparks on collision, bubbles popping into water drops, and more.  
         *      
         *  **Note:** When [member sub_emitter] is set, the target [GPUParticles2D] node will no longer emit particles on its own.  
         */
        get sub_emitter(): NodePath
        set sub_emitter(value: NodePath | string)
        
        /** [Material] for processing particles. Can be a [ParticleProcessMaterial] or a [ShaderMaterial]. */
        get process_material(): ParticleProcessMaterial | ShaderMaterial
        set process_material(value: ParticleProcessMaterial | ShaderMaterial)
        
        /** Particle texture. If `null`, particles will be squares with a size of 1×1 pixels.  
         *      
         *  **Note:** To use a flipbook texture, assign a new [CanvasItemMaterial] to the [GPUParticles2D]'s [member CanvasItem.material] property, then enable [member CanvasItemMaterial.particles_animation] and set [member CanvasItemMaterial.particles_anim_h_frames], [member CanvasItemMaterial.particles_anim_v_frames], and [member CanvasItemMaterial.particles_anim_loop] to match the flipbook texture.  
         */
        get texture(): Texture2D
        set texture(value: Texture2D)
        
        /** The amount of time each particle will exist (in seconds). The effective emission rate is `(amount * amount_ratio) / lifetime` particles per second. */
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
        
        /** The particle system's frame rate is fixed to a value. For example, changing the value to 2 will make the particles render at 2 frames per second. Note this does not slow down the simulation of the particle system itself. */
        get fixed_fps(): int64
        set fixed_fps(value: int64)
        
        /** Enables particle interpolation, which makes the particle movement smoother when their [member fixed_fps] is lower than the screen refresh rate. */
        get interpolate(): boolean
        set interpolate(value: boolean)
        
        /** If `true`, results in fractional delta calculation which has a smoother particles display effect. */
        get fract_delta(): boolean
        set fract_delta(value: boolean)
        
        /** Causes all the particles in this node to interpolate towards the end of their lifetime.  
         *      
         *  **Note:** This only works when used with a [ParticleProcessMaterial]. It needs to be manually implemented for custom process shaders.  
         */
        get interp_to_end(): float64
        set interp_to_end(value: float64)
        
        /** Multiplier for particle's collision radius. `1.0` corresponds to the size of the sprite. If particles appear to sink into the ground when colliding, increase this value. If particles appear to float when colliding, decrease this value. Only effective if [member ParticleProcessMaterial.collision_mode] is [constant ParticleProcessMaterial.COLLISION_RIGID] or [constant ParticleProcessMaterial.COLLISION_HIDE_ON_CONTACT].  
         *      
         *  **Note:** Particles always have a spherical collision shape.  
         */
        get collision_base_size(): float64
        set collision_base_size(value: float64)
        
        /** The [Rect2] that determines the node's region which needs to be visible on screen for the particle system to be active.  
         *  Grow the rect if particles suddenly appear/disappear when the node enters/exits the screen. The [Rect2] can be grown via code or with the **Particles → Generate Visibility Rect** editor tool.  
         */
        get visibility_rect(): Rect2
        set visibility_rect(value: Rect2)
        
        /** If `true`, particles use the parent node's coordinate space (known as local coordinates). This will cause particles to move and rotate along the [GPUParticles2D] node (and its parents) when it is moved or rotated. If `false`, particles use global coordinates; they will not move or rotate along the [GPUParticles2D] node (and its parents) when it is moved or rotated. */
        get local_coords(): boolean
        set local_coords(value: boolean)
        
        /** Particle draw order. Uses [enum DrawOrder] values. */
        get draw_order(): int64
        set draw_order(value: int64)
        
        /** If `true`, enables particle trails using a mesh skinning system.  
         *      
         *  **Note:** Unlike [GPUParticles3D], the number of trail sections and subdivisions is set with the [member trail_sections] and [member trail_section_subdivisions] properties.  
         */
        get trail_enabled(): boolean
        set trail_enabled(value: boolean)
        
        /** The amount of time the particle's trail should represent (in seconds). Only effective if [member trail_enabled] is `true`. */
        get trail_lifetime(): float64
        set trail_lifetime(value: float64)
        
        /** The number of sections to use for the particle trail rendering. Higher values can result in smoother trail curves, at the cost of performance due to increased mesh complexity. See also [member trail_section_subdivisions]. Only effective if [member trail_enabled] is `true`. */
        get trail_sections(): int64
        set trail_sections(value: int64)
        
        /** The number of subdivisions to use for the particle trail rendering. Higher values can result in smoother trail curves, at the cost of performance due to increased mesh complexity. See also [member trail_sections]. Only effective if [member trail_enabled] is `true`. */
        get trail_section_subdivisions(): int64
        set trail_section_subdivisions(value: int64)
        
        /** Emitted when all active particles have finished processing. To immediately restart the emission cycle, call [method restart].  
         *  Never emitted when [member one_shot] is disabled, as particles will be emitted and processed continuously.  
         *      
         *  **Note:** For [member one_shot] emitters, due to the particles being computed on the GPU, there may be a short period after receiving the signal during which setting [member emitting] to `true` will not restart the emission cycle. This delay is avoided by instead calling [method restart].  
         */
        readonly finished: Signal0
    }
    class GPUParticles2DEditorPlugin extends EditorPlugin {
        constructor(identifier?: any)
    }
    namespace GPUParticles3D {
        enum DrawOrder {
            /** Particles are drawn in the order emitted. */
            DRAW_ORDER_INDEX = 0,
            
            /** Particles are drawn in order of remaining lifetime. In other words, the particle with the highest lifetime is drawn at the front. */
            DRAW_ORDER_LIFETIME = 1,
            
            /** Particles are drawn in reverse order of remaining lifetime. In other words, the particle with the lowest lifetime is drawn at the front. */
            DRAW_ORDER_REVERSE_LIFETIME = 2,
            
            /** Particles are drawn in order of depth. */
            DRAW_ORDER_VIEW_DEPTH = 3,
        }
        enum EmitFlags {
            /** Particle starts at the specified position. */
            EMIT_FLAG_POSITION = 1,
            
            /** Particle starts with specified rotation and scale. */
            EMIT_FLAG_ROTATION_SCALE = 2,
            
            /** Particle starts with the specified velocity vector, which defines the emission direction and speed. */
            EMIT_FLAG_VELOCITY = 4,
            
            /** Particle starts with specified color. */
            EMIT_FLAG_COLOR = 8,
            
            /** Particle starts with specified `CUSTOM` data. */
            EMIT_FLAG_CUSTOM = 16,
        }
        enum TransformAlign {
            TRANSFORM_ALIGN_DISABLED = 0,
            TRANSFORM_ALIGN_Z_BILLBOARD = 1,
            TRANSFORM_ALIGN_Y_TO_VELOCITY = 2,
            TRANSFORM_ALIGN_Z_BILLBOARD_Y_TO_VELOCITY = 3,
        }
    }
    /** A 3D particle emitter.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.3/classes/class_gpuparticles3d.html  
     */
    class GPUParticles3D extends GeometryInstance3D {
        /** Maximum number of draw passes supported. */
        static readonly MAX_DRAW_PASSES = 4
        constructor(identifier?: any)
        
        /** Sets the [Mesh] that is drawn at index [param pass]. */
        set_draw_pass_mesh(pass: int64, mesh: Mesh): void
        
        /** Returns the [Mesh] that is drawn at index [param pass]. */
        get_draw_pass_mesh(pass: int64): Mesh
        
        /** Restarts the particle emission cycle, clearing existing particles. To avoid particles vanishing from the viewport, wait for the [signal finished] signal before calling.  
         *      
         *  **Note:** The [signal finished] signal is only emitted by [member one_shot] emitters.  
         */
        restart(): void
        
        /** Returns the axis-aligned bounding box that contains all the particles that are active in the current frame. */
        capture_aabb(): AABB
        
        /** Emits a single particle. Whether [param xform], [param velocity], [param color] and [param custom] are applied depends on the value of [param flags]. See [enum EmitFlags].  
         *  The default ParticleProcessMaterial will overwrite [param color] and use the contents of [param custom] as `(rotation, age, animation, lifetime)`.  
         */
        emit_particle(xform: Transform3D, velocity: Vector3, color: Color, custom: Color, flags: int64): void
        
        /** Sets this node's properties to match a given [CPUParticles3D] node. */
        convert_from_particles(particles: Node): void
        
        /** If `true`, particles are being emitted. [member emitting] can be used to start and stop particles from emitting. However, if [member one_shot] is `true` setting [member emitting] to `true` will not restart the emission cycle unless all active particles have finished processing. Use the [signal finished] signal to be notified once all active particles finish processing.  
         *      
         *  **Note:** For [member one_shot] emitters, due to the particles being computed on the GPU, there may be a short period after receiving the [signal finished] signal during which setting this to `true` will not restart the emission cycle.  
         *  **Tip:** If your [member one_shot] emitter needs to immediately restart emitting particles once [signal finished] signal is received, consider calling [method restart] instead of setting [member emitting].  
         */
        get emitting(): boolean
        set emitting(value: boolean)
        
        /** The number of particles to emit in one emission cycle. The effective emission rate is `(amount * amount_ratio) / lifetime` particles per second. Higher values will increase GPU requirements, even if not all particles are visible at a given time or if [member amount_ratio] is decreased.  
         *      
         *  **Note:** Changing this value will cause the particle system to restart. To avoid this, change [member amount_ratio] instead.  
         */
        get amount(): int64
        set amount(value: int64)
        
        /** The ratio of particles that should actually be emitted. If set to a value lower than `1.0`, this will set the amount of emitted particles throughout the lifetime to `amount * amount_ratio`. Unlike changing [member amount], changing [member amount_ratio] while emitting does not affect already-emitted particles and doesn't cause the particle system to restart. [member amount_ratio] can be used to create effects that make the number of emitted particles vary over time.  
         *      
         *  **Note:** Reducing the [member amount_ratio] has no performance benefit, since resources need to be allocated and processed for the total [member amount] of particles regardless of the [member amount_ratio]. If you don't intend to change the number of particles emitted while the particles are emitting, make sure [member amount_ratio] is set to `1` and change [member amount] to your liking instead.  
         */
        get amount_ratio(): float64
        set amount_ratio(value: float64)
        
        /** Path to another [GPUParticles3D] node that will be used as a subemitter (see [member ParticleProcessMaterial.sub_emitter_mode]). Subemitters can be used to achieve effects such as fireworks, sparks on collision, bubbles popping into water drops, and more.  
         *      
         *  **Note:** When [member sub_emitter] is set, the target [GPUParticles3D] node will no longer emit particles on its own.  
         */
        get sub_emitter(): NodePath
        set sub_emitter(value: NodePath | string)
        
        /** The amount of time each particle will exist (in seconds). The effective emission rate is `(amount * amount_ratio) / lifetime` particles per second. */
        get lifetime(): float64
        set lifetime(value: float64)
        
        /** Causes all the particles in this node to interpolate towards the end of their lifetime.  
         *      
         *  **Note:** This only works when used with a [ParticleProcessMaterial]. It needs to be manually implemented for custom process shaders.  
         */
        get interp_to_end(): float64
        set interp_to_end(value: float64)
        
        /** If `true`, only the number of particles equal to [member amount] will be emitted. */
        get one_shot(): boolean
        set one_shot(value: boolean)
        
        /** Amount of time to preprocess the particles before animation starts. Lets you start the animation some time after particles have started emitting. */
        get preprocess(): float64
        set preprocess(value: float64)
        
        /** Speed scaling ratio. A value of `0` can be used to pause the particles. */
        get speed_scale(): float64
        set speed_scale(value: float64)
        
        /** Time ratio between each emission. If `0`, particles are emitted continuously. If `1`, all particles are emitted simultaneously. */
        get explosiveness(): float64
        set explosiveness(value: float64)
        
        /** Emission randomness ratio. */
        get randomness(): float64
        set randomness(value: float64)
        
        /** The particle system's frame rate is fixed to a value. For example, changing the value to 2 will make the particles render at 2 frames per second. Note this does not slow down the simulation of the particle system itself. */
        get fixed_fps(): int64
        set fixed_fps(value: int64)
        
        /** Enables particle interpolation, which makes the particle movement smoother when their [member fixed_fps] is lower than the screen refresh rate. */
        get interpolate(): boolean
        set interpolate(value: boolean)
        
        /** If `true`, results in fractional delta calculation which has a smoother particles display effect. */
        get fract_delta(): boolean
        set fract_delta(value: boolean)
        
        /** The base diameter for particle collision in meters. If particles appear to sink into the ground when colliding, increase this value. If particles appear to float when colliding, decrease this value. Only effective if [member ParticleProcessMaterial.collision_mode] is [constant ParticleProcessMaterial.COLLISION_RIGID] or [constant ParticleProcessMaterial.COLLISION_HIDE_ON_CONTACT].  
         *      
         *  **Note:** Particles always have a spherical collision shape.  
         */
        get collision_base_size(): float64
        set collision_base_size(value: float64)
        
        /** The [AABB] that determines the node's region which needs to be visible on screen for the particle system to be active. [member GeometryInstance3D.extra_cull_margin] is added on each of the AABB's axes. Particle collisions and attraction will only occur within this area.  
         *  Grow the box if particles suddenly appear/disappear when the node enters/exits the screen. The [AABB] can be grown via code or with the **Particles → Generate AABB** editor tool.  
         *      
         *  **Note:** [member visibility_aabb] is overridden by [member GeometryInstance3D.custom_aabb] if that property is set to a non-default value.  
         */
        get visibility_aabb(): AABB
        set visibility_aabb(value: AABB)
        
        /** If `true`, particles use the parent node's coordinate space (known as local coordinates). This will cause particles to move and rotate along the [GPUParticles3D] node (and its parents) when it is moved or rotated. If `false`, particles use global coordinates; they will not move or rotate along the [GPUParticles3D] node (and its parents) when it is moved or rotated. */
        get local_coords(): boolean
        set local_coords(value: boolean)
        
        /** Particle draw order. Uses [enum DrawOrder] values.  
         *      
         *  **Note:** [constant DRAW_ORDER_INDEX] is the only option that supports motion vectors for effects like TAA. It is suggested to use this draw order if the particles are opaque to fix ghosting artifacts.  
         */
        get draw_order(): int64
        set draw_order(value: int64)
        get transform_align(): int64
        set transform_align(value: int64)
        
        /** If `true`, enables particle trails using a mesh skinning system. Designed to work with [RibbonTrailMesh] and [TubeTrailMesh].  
         *      
         *  **Note:** [member BaseMaterial3D.use_particle_trails] must also be enabled on the particle mesh's material. Otherwise, setting [member trail_enabled] to `true` will have no effect.  
         *      
         *  **Note:** Unlike [GPUParticles2D], the number of trail sections and subdivisions is set in the [RibbonTrailMesh] or the [TubeTrailMesh]'s properties.  
         */
        get trail_enabled(): boolean
        set trail_enabled(value: boolean)
        
        /** The amount of time the particle's trail should represent (in seconds). Only effective if [member trail_enabled] is `true`. */
        get trail_lifetime(): float64
        set trail_lifetime(value: float64)
        
        /** [Material] for processing particles. Can be a [ParticleProcessMaterial] or a [ShaderMaterial]. */
        get process_material(): ParticleProcessMaterial | ShaderMaterial
        set process_material(value: ParticleProcessMaterial | ShaderMaterial)
        
        /** The number of draw passes when rendering particles. */
        get draw_passes(): int64
        set draw_passes(value: int64)
        
        /** [Mesh] that is drawn for the first draw pass. */
        get draw_pass_1(): Mesh
        set draw_pass_1(value: Mesh)
        
        /** [Mesh] that is drawn for the second draw pass. */
        get draw_pass_2(): Mesh
        set draw_pass_2(value: Mesh)
        
        /** [Mesh] that is drawn for the third draw pass. */
        get draw_pass_3(): Mesh
        set draw_pass_3(value: Mesh)
        
        /** [Mesh] that is drawn for the fourth draw pass. */
        get draw_pass_4(): Mesh
        set draw_pass_4(value: Mesh)
        get draw_skin(): Skin
        set draw_skin(value: Skin)
        
        /** Emitted when all active particles have finished processing. To immediately emit new particles, call [method restart].  
         *  Never emitted when [member one_shot] is disabled, as particles will be emitted and processed continuously.  
         *      
         *  **Note:** For [member one_shot] emitters, due to the particles being computed on the GPU, there may be a short period after receiving the signal during which setting [member emitting] to `true` will not restart the emission cycle. This delay is avoided by instead calling [method restart].  
         */
        readonly finished: Signal0
    }
}
