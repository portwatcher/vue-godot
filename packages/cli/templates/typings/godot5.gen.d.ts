// AUTO-GENERATED
/// <reference no-default-lib="true"/>
declare module "godot" {
    /** Draws a stereo correct visibility mask.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_openxrvisibilitymask.html  
     */
    class OpenXRVisibilityMask<Map extends Record<string, Node> = Record<string, Node>> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
    }
    /** An optimized translation, used by default for CSV Translations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_optimizedtranslation.html  
     */
    class OptimizedTranslation extends Translation {
        constructor(identifier?: any)
        /** Generates and sets an optimized translation from the given [Translation] resource.  
         *      
         *  **Note:** This method is intended to be used in the editor. It does nothing when called from an exported project.  
         */
        generate(from: Translation): void
    }
    /** A button that brings up a dropdown with selectable options when pressed.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_optionbutton.html  
     */
    class OptionButton<Map extends Record<string, Node> = Record<string, Node>> extends Button<Map> {
        constructor(identifier?: any)
        /** Adds an item, with text [param label] and (optionally) [param id]. If no [param id] is passed, the item index will be used as the item's ID. New items are appended at the end. */
        add_item(label: string, id: int64 = -1): void
        
        /** Adds an item, with a [param texture] icon, text [param label] and (optionally) [param id]. If no [param id] is passed, the item index will be used as the item's ID. New items are appended at the end. */
        add_icon_item(texture: Texture2D, label: string, id: int64 = -1): void
        
        /** Sets the text of the item at index [param idx]. */
        set_item_text(idx: int64, text: string): void
        
        /** Sets the icon of the item at index [param idx]. */
        set_item_icon(idx: int64, texture: Texture2D): void
        
        /** Sets whether the item at index [param idx] is disabled.  
         *  Disabled items are drawn differently in the dropdown and are not selectable by the user. If the current selected item is set as disabled, it will remain selected.  
         */
        set_item_disabled(idx: int64, disabled: boolean): void
        
        /** Sets the ID of the item at index [param idx]. */
        set_item_id(idx: int64, id: int64): void
        
        /** Sets the metadata of an item. Metadata may be of any type and can be used to store extra information about an item, such as an external string ID. */
        set_item_metadata(idx: int64, metadata: any): void
        
        /** Sets the tooltip of the item at index [param idx]. */
        set_item_tooltip(idx: int64, tooltip: string): void
        
        /** Returns the text of the item at index [param idx]. */
        get_item_text(idx: int64): string
        
        /** Returns the icon of the item at index [param idx]. */
        get_item_icon(idx: int64): Texture2D
        
        /** Returns the ID of the item at index [param idx]. */
        get_item_id(idx: int64): int64
        
        /** Returns the index of the item with the given [param id]. */
        get_item_index(id: int64): int64
        
        /** Retrieves the metadata of an item. Metadata may be any type and can be used to store extra information about an item, such as an external string ID. */
        get_item_metadata(idx: int64): any
        
        /** Returns the tooltip of the item at index [param idx]. */
        get_item_tooltip(idx: int64): string
        
        /** Returns `true` if the item at index [param idx] is disabled. */
        is_item_disabled(idx: int64): boolean
        
        /** Returns `true` if the item at index [param idx] is marked as a separator. */
        is_item_separator(idx: int64): boolean
        
        /** Adds a separator to the list of items. Separators help to group items, and can optionally be given a [param text] header. A separator also gets an index assigned, and is appended at the end of the item list. */
        add_separator(text: string = ''): void
        
        /** Clears all the items in the [OptionButton]. */
        clear(): void
        
        /** Selects an item by index and makes it the current item. This will work even if the item is disabled.  
         *  Passing `-1` as the index deselects any currently selected item.  
         */
        select(idx: int64): void
        
        /** Returns the ID of the selected item, or `-1` if no item is selected. */
        get_selected_id(): int64
        
        /** Gets the metadata of the selected item. Metadata for items can be set using [method set_item_metadata]. */
        get_selected_metadata(): any
        
        /** Removes the item at index [param idx]. */
        remove_item(idx: int64): void
        
        /** Returns the [PopupMenu] contained in this button.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member Window.visible] property.  
         */
        get_popup(): PopupMenu
        
        /** Adjusts popup position and sizing for the [OptionButton], then shows the [PopupMenu]. Prefer this over using `get_popup().popup()`. */
        show_popup(): void
        
        /** Returns `true` if this button contains at least one item which is not disabled, or marked as a separator. */
        has_selectable_items(): boolean
        
        /** Returns the index of the first item which is not disabled, or marked as a separator. If [param from_last] is `true`, the items will be searched in reverse order.  
         *  Returns `-1` if no item is found.  
         */
        get_selectable_item(from_last: boolean = false): int64
        
        /** If `true`, shortcuts are disabled and cannot be used to trigger the button. */
        set_disable_shortcuts(disabled: boolean): void
        
        /** The index of the currently selected item, or `-1` if no item is selected. */
        get selected(): int64
        set selected(value: int64)
        
        /** If `true`, minimum size will be determined by the longest item's text, instead of the currently selected one's.  
         *      
         *  **Note:** For performance reasons, the minimum size doesn't update immediately when adding, removing or modifying items.  
         */
        get fit_to_longest_item(): boolean
        set fit_to_longest_item(value: boolean)
        
        /** If `true`, the currently selected item can be selected again. */
        get allow_reselect(): boolean
        set allow_reselect(value: boolean)
        
        /** The number of items to select from. */
        get item_count(): any /*Items,popup/item_*/
        set item_count(value: any /*Items,popup/item_*/)
        
        /** Emitted when the current item has been changed by the user. The index of the item selected is passed as argument.  
         *  [member allow_reselect] must be enabled to reselect an item.  
         */
        readonly item_selected: Signal1<int64>
        
        /** Emitted when the user navigates to an item using the [member ProjectSettings.input/ui_up] or [member ProjectSettings.input/ui_down] input actions. The index of the item selected is passed as argument. */
        readonly item_focused: Signal1<int64>
    }
    class OrphanResourcesDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
    }
    /** Creates packages that can be loaded into a running project.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_pckpacker.html  
     */
    class PCKPacker extends RefCounted {
        constructor(identifier?: any)
        /** Creates a new PCK file at the file path [param pck_path]. The `.pck` file extension isn't added automatically, so it should be part of [param pck_path] (even though it's not required). */
        pck_start(pck_path: string, alignment: int64 = 32, key: string = '0000000000000000000000000000000000000000000000000000000000000000', encrypt_directory: boolean = false): GError
        
        /** Adds the [param source_path] file to the current PCK package at the [param target_path] internal path. The `res://` prefix for [param target_path] is optional and stripped internally. */
        add_file(target_path: string, source_path: string, encrypt: boolean = false): GError
        
        /** Registers a file removal of the [param target_path] internal path to the PCK. This is mainly used for patches. If the file at this path has been loaded from a previous PCK, it will be removed. The `res://` prefix for [param target_path] is optional and stripped internally. */
        add_file_removal(target_path: string): GError
        
        /** Writes the files specified using all [method add_file] calls since the last flush. If [param verbose] is `true`, a list of files added will be printed to the console for easier debugging. */
        flush(verbose: boolean = false): GError
    }
    /** Efficiently packs and serializes [Array] or [Dictionary].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packeddatacontainer.html  
     */
    class PackedDataContainer extends Resource {
        constructor(identifier?: any)
        _iter_init(_unnamed_arg0: GArray): any
        _iter_get(_unnamed_arg0: any): any
        _iter_next(_unnamed_arg0: GArray): any
        
        /** Packs the given container into a binary representation. The [param value] must be either [Array] or [Dictionary], any other type will result in invalid data error.  
         *      
         *  **Note:** Subsequent calls to this method will overwrite the existing data.  
         */
        pack(value: any): GError
        
        /** Returns the size of the packed container (see [method Array.size] and [method Dictionary.size]). */
        size(): int64
        get __data__(): PackedByteArray
        set __data__(value: PackedByteArray | byte[] | ArrayBuffer)
    }
    /** An internal class used by [PackedDataContainer] to pack nested arrays and dictionaries.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packeddatacontainerref.html  
     */
    class PackedDataContainerRef extends RefCounted {
        constructor(identifier?: any)
        /** Returns the size of the packed container (see [method Array.size] and [method Dictionary.size]). */
        size(): int64
        _iter_init(_unnamed_arg0: GArray): any
        _iter_get(_unnamed_arg0: any): any
        _iter_next(_unnamed_arg0: GArray): any
    }
    namespace PackedScene {
        enum GenEditState {
            /** If passed to [method instantiate], blocks edits to the scene state. */
            GEN_EDIT_STATE_DISABLED = 0,
            
            /** If passed to [method instantiate], provides local scene resources to the local scene.  
             *      
             *  **Note:** Only available in editor builds.  
             */
            GEN_EDIT_STATE_INSTANCE = 1,
            
            /** If passed to [method instantiate], provides local scene resources to the local scene. Only the main scene should receive the main edit state.  
             *      
             *  **Note:** Only available in editor builds.  
             */
            GEN_EDIT_STATE_MAIN = 2,
            
            /** It's similar to [constant GEN_EDIT_STATE_MAIN], but for the case where the scene is being instantiated to be the base of another one.  
             *      
             *  **Note:** Only available in editor builds.  
             */
            GEN_EDIT_STATE_MAIN_INHERITED = 3,
        }
    }
    /** An abstraction of a serialized scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packedscene.html  
     */
    class PackedScene extends Resource {
        constructor(identifier?: any)
        /** Packs the [param path] node, and all owned sub-nodes, into this [PackedScene]. Any existing data will be cleared. See [member Node.owner]. */
        pack(path: Node): GError
        
        /** Instantiates the scene's node hierarchy. Triggers child scene instantiation(s). Triggers a [constant Node.NOTIFICATION_SCENE_INSTANTIATED] notification on the root node. */
        instantiate(edit_state: PackedScene.GenEditState = 0): Node
        
        /** Returns `true` if the scene file has nodes. */
        can_instantiate(): boolean
        
        /** Returns the [SceneState] representing the scene file contents. */
        get_state(): SceneState
        get _bundled(): GDictionary
        set _bundled(value: GDictionary)
    }
    class PackedSceneEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class PackedSceneEditorTranslationParserPlugin extends EditorTranslationParserPlugin {
        constructor(identifier?: any)
    }
    /** Abstraction and base class for packet-based protocols.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packetpeer.html  
     */
    class PacketPeer extends RefCounted {
        constructor(identifier?: any)
        /** Gets a Variant. If [param allow_objects] is `true`, decoding objects is allowed.  
         *  Internally, this uses the same decoding mechanism as the [method @GlobalScope.bytes_to_var] method.  
         *  **Warning:** Deserialized objects can contain code which gets executed. Do not use this option if the serialized object comes from untrusted sources to avoid potential security threats such as remote code execution.  
         */
        get_var(allow_objects: boolean = false): any
        
        /** Sends a [Variant] as a packet. If [param full_objects] is `true`, encoding objects is allowed (and can potentially include code).  
         *  Internally, this uses the same encoding mechanism as the [method @GlobalScope.var_to_bytes] method.  
         */
        put_var(var_: any, full_objects: boolean = false): GError
        
        /** Gets a raw packet. */
        get_packet(): PackedByteArray
        
        /** Sends a raw packet. */
        put_packet(buffer: PackedByteArray | byte[] | ArrayBuffer): GError
        
        /** Returns the error state of the last packet received (via [method get_packet] and [method get_var]). */
        get_packet_error(): GError
        
        /** Returns the number of packets currently available in the ring-buffer. */
        get_available_packet_count(): int64
        
        /** Maximum buffer size allowed when encoding [Variant]s. Raise this value to support heavier memory allocations.  
         *  The [method put_var] method allocates memory on the stack, and the buffer used will grow automatically to the closest power of two to match the size of the [Variant]. If the [Variant] is bigger than [member encode_buffer_max_size], the method will error out with [constant ERR_OUT_OF_MEMORY].  
         */
        get encode_buffer_max_size(): int64
        set encode_buffer_max_size(value: int64)
    }
    namespace PacketPeerDTLS {
        enum Status {
            /** A status representing a [PacketPeerDTLS] that is disconnected. */
            STATUS_DISCONNECTED = 0,
            
            /** A status representing a [PacketPeerDTLS] that is currently performing the handshake with a remote peer. */
            STATUS_HANDSHAKING = 1,
            
            /** A status representing a [PacketPeerDTLS] that is connected to a remote peer. */
            STATUS_CONNECTED = 2,
            
            /** A status representing a [PacketPeerDTLS] in a generic error state. */
            STATUS_ERROR = 3,
            
            /** An error status that shows a mismatch in the DTLS certificate domain presented by the host and the domain requested for validation. */
            STATUS_ERROR_HOSTNAME_MISMATCH = 4,
        }
    }
    /** DTLS packet peer.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packetpeerdtls.html  
     */
    class PacketPeerDTLS extends PacketPeer {
        constructor(identifier?: any)
        /** Poll the connection to check for incoming packets. Call this frequently to update the status and keep the connection working. */
        poll(): void
        
        /** Connects a [param packet_peer] beginning the DTLS handshake using the underlying [PacketPeerUDP] which must be connected (see [method PacketPeerUDP.connect_to_host]). You can optionally specify the [param client_options] to be used while verifying the TLS connections. See [method TLSOptions.client] and [method TLSOptions.client_unsafe]. */
        connect_to_peer(packet_peer: PacketPeerUDP, hostname: string, client_options: TLSOptions = undefined): GError
        
        /** Returns the status of the connection. See [enum Status] for values. */
        get_status(): PacketPeerDTLS.Status
        
        /** Disconnects this peer, terminating the DTLS session. */
        disconnect_from_peer(): void
    }
    /** @link https://docs.godotengine.org/en/4.4/classes/class_packetpeerextension.html */
    class PacketPeerExtension extends PacketPeer {
        constructor(identifier?: any)
        /* gdvirtual */ _get_packet(r_buffer: int64, r_buffer_size: int64): GError
        /* gdvirtual */ _put_packet(p_buffer: int64, p_buffer_size: int64): GError
        /* gdvirtual */ _get_available_packet_count(): int64
        /* gdvirtual */ _get_max_packet_size(): int64
    }
    /** Wrapper to use a PacketPeer over a StreamPeer.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packetpeerstream.html  
     */
    class PacketPeerStream extends PacketPeer {
        constructor(identifier?: any)
        get input_buffer_max_size(): int64
        set input_buffer_max_size(value: int64)
        get output_buffer_max_size(): int64
        set output_buffer_max_size(value: int64)
        
        /** The wrapped [StreamPeer] object. */
        get stream_peer(): StreamPeer
        set stream_peer(value: StreamPeer)
    }
    /** UDP packet peer.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_packetpeerudp.html  
     */
    class PacketPeerUDP extends PacketPeer {
        constructor(identifier?: any)
        /** Binds this [PacketPeerUDP] to the specified [param port] and [param bind_address] with a buffer size [param recv_buf_size], allowing it to receive incoming packets.  
         *  If [param bind_address] is set to `"*"` (default), the peer will be bound on all available addresses (both IPv4 and IPv6).  
         *  If [param bind_address] is set to `"0.0.0.0"` (for IPv4) or `"::"` (for IPv6), the peer will be bound to all available addresses matching that IP type.  
         *  If [param bind_address] is set to any valid address (e.g. `"192.168.1.101"`, `"::1"`, etc.), the peer will only be bound to the interface with that address (or fail if no interface with the given address exists).  
         */
        bind(port: int64, bind_address: string = '*', recv_buf_size: int64 = 65536): GError
        
        /** Closes the [PacketPeerUDP]'s underlying UDP socket. */
        close(): void
        
        /** Waits for a packet to arrive on the bound address. See [method bind].  
         *      
         *  **Note:** [method wait] can't be interrupted once it has been called. This can be worked around by allowing the other party to send a specific "death pill" packet like this:  
         *    
         */
        wait(): GError
        
        /** Returns whether this [PacketPeerUDP] is bound to an address and can receive packets. */
        is_bound(): boolean
        
        /** Calling this method connects this UDP peer to the given [param host]/[param port] pair. UDP is in reality connectionless, so this option only means that incoming packets from different addresses are automatically discarded, and that outgoing packets are always sent to the connected address (future calls to [method set_dest_address] are not allowed). This method does not send any data to the remote peer, to do that, use [method PacketPeer.put_var] or [method PacketPeer.put_packet] as usual. See also [UDPServer].  
         *      
         *  **Note:** Connecting to the remote peer does not help to protect from malicious attacks like IP spoofing, etc. Think about using an encryption technique like TLS or DTLS if you feel like your application is transferring sensitive information.  
         */
        connect_to_host(host: string, port: int64): GError
        
        /** Returns `true` if the UDP socket is open and has been connected to a remote address. See [method connect_to_host]. */
        is_socket_connected(): boolean
        
        /** Returns the IP of the remote peer that sent the last packet(that was received with [method PacketPeer.get_packet] or [method PacketPeer.get_var]). */
        get_packet_ip(): string
        
        /** Returns the port of the remote peer that sent the last packet(that was received with [method PacketPeer.get_packet] or [method PacketPeer.get_var]). */
        get_packet_port(): int64
        
        /** Returns the local port to which this peer is bound. */
        get_local_port(): int64
        
        /** Sets the destination address and port for sending packets and variables. A hostname will be resolved using DNS if needed.  
         *      
         *  **Note:** [method set_broadcast_enabled] must be enabled before sending packets to a broadcast address (e.g. `255.255.255.255`).  
         */
        set_dest_address(host: string, port: int64): GError
        
        /** Enable or disable sending of broadcast packets (e.g. `set_dest_address("255.255.255.255", 4343)`. This option is disabled by default.  
         *      
         *  **Note:** Some Android devices might require the `CHANGE_WIFI_MULTICAST_STATE` permission and this option to be enabled to receive broadcast packets too.  
         */
        set_broadcast_enabled(enabled: boolean): void
        
        /** Joins the multicast group specified by [param multicast_address] using the interface identified by [param interface_name].  
         *  You can join the same multicast group with multiple interfaces. Use [method IP.get_local_interfaces] to know which are available.  
         *      
         *  **Note:** Some Android devices might require the `CHANGE_WIFI_MULTICAST_STATE` permission for multicast to work.  
         */
        join_multicast_group(multicast_address: string, interface_name: string): GError
        
        /** Removes the interface identified by [param interface_name] from the multicast group specified by [param multicast_address]. */
        leave_multicast_group(multicast_address: string, interface_name: string): GError
    }
    /** A GUI control that displays a [StyleBox].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_panel.html  
     */
    class Panel<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
    }
    /** A container that keeps its child controls within the area of a [StyleBox].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_panelcontainer.html  
     */
    class PanelContainer<Map extends Record<string, Node> = Record<string, Node>> extends Container<Map> {
        constructor(identifier?: any)
    }
    /** A material that provides a special texture to a [Sky], usually an HDR panorama.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_panoramaskymaterial.html  
     */
    class PanoramaSkyMaterial extends Material {
        constructor(identifier?: any)
        /** [Texture2D] to be applied to the [PanoramaSkyMaterial]. */
        get panorama(): Texture2D
        set panorama(value: Texture2D)
        
        /** A boolean value to determine if the background texture should be filtered or not. */
        get filter(): boolean
        set filter(value: boolean)
        
        /** The sky's overall brightness multiplier. Higher values result in a brighter sky. */
        get energy_multiplier(): float64
        set energy_multiplier(value: float64)
    }
    class PanoramaSkyMaterialConversionPlugin extends EditorResourceConversionPlugin {
        constructor(identifier?: any)
    }
    /** A node used to create a parallax scrolling background.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_parallax2d.html  
     */
    class Parallax2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        _camera_moved(transform: Transform2D, screen_offset: Vector2, adj_screen_offset: Vector2): void
        
        /** Multiplier to the final [Parallax2D]'s offset. Can be used to simulate distance from the camera.  
         *  For example, a value of `1` scrolls at the same speed as the camera. A value greater than `1` scrolls faster, making objects appear closer. Less than `1` scrolls slower, making objects appear further, and a value of `0` stops the objects completely.  
         */
        get scroll_scale(): Vector2
        set scroll_scale(value: Vector2)
        
        /** The [Parallax2D]'s offset. Similar to [member screen_offset] and [member Node2D.position], but will not be overridden.  
         *      
         *  **Note:** Values will loop if [member repeat_size] is set higher than `0`.  
         */
        get scroll_offset(): Vector2
        set scroll_offset(value: Vector2)
        
        /** Repeats the [Texture2D] of each of this node's children and offsets them by this value. When scrolling, the node's position loops, giving the illusion of an infinite scrolling background if the values are larger than the screen size. If an axis is set to `0`, the [Texture2D] will not be repeated. */
        get repeat_size(): Vector2
        set repeat_size(value: Vector2)
        
        /** Velocity at which the offset scrolls automatically, in pixels per second. */
        get autoscroll(): Vector2
        set autoscroll(value: Vector2)
        
        /** Overrides the amount of times the texture repeats. Each texture copy spreads evenly from the original by [member repeat_size]. Useful for when zooming out with a camera. */
        get repeat_times(): int64
        set repeat_times(value: int64)
        
        /** Top-left limits for scrolling to begin. If the camera is outside of this limit, the [Parallax2D] stops scrolling. Must be lower than [member limit_end] minus the viewport size to work. */
        get limit_begin(): Vector2
        set limit_begin(value: Vector2)
        
        /** Bottom-right limits for scrolling to end. If the camera is outside of this limit, the [Parallax2D] will stop scrolling. Must be higher than [member limit_begin] and the viewport size combined to work. */
        get limit_end(): Vector2
        set limit_end(value: Vector2)
        
        /** If `true`, this [Parallax2D] is offset by the current camera's position. If the [Parallax2D] is in a [CanvasLayer] separate from the current camera, it may be desired to match the value with [member CanvasLayer.follow_viewport_enabled]. */
        get follow_viewport(): boolean
        set follow_viewport(value: boolean)
        
        /** If `true`, [Parallax2D]'s position is not affected by the position of the camera. */
        get ignore_camera_scroll(): boolean
        set ignore_camera_scroll(value: boolean)
        
        /** Offset used to scroll this [Parallax2D]. This value is updated automatically unless [member ignore_camera_scroll] is `true`. */
        get screen_offset(): Vector2
        set screen_offset(value: Vector2)
    }
    /** A node used to create a parallax scrolling background.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_parallaxbackground.html  
     */
    class ParallaxBackground<Map extends Record<string, Node> = Record<string, Node>> extends CanvasLayer<Map> {
        constructor(identifier?: any)
        _camera_moved(_unnamed_arg0: Transform2D, _unnamed_arg1: Vector2, _unnamed_arg2: Vector2): void
        
        /** The ParallaxBackground's scroll value. Calculated automatically when using a [Camera2D], but can be used to manually manage scrolling when no camera is present. */
        get scroll_offset(): Vector2
        set scroll_offset(value: Vector2)
        
        /** The base position offset for all [ParallaxLayer] children. */
        get scroll_base_offset(): Vector2
        set scroll_base_offset(value: Vector2)
        
        /** The base motion scale for all [ParallaxLayer] children. */
        get scroll_base_scale(): Vector2
        set scroll_base_scale(value: Vector2)
        
        /** Top-left limits for scrolling to begin. If the camera is outside of this limit, the background will stop scrolling. Must be lower than [member scroll_limit_end] to work. */
        get scroll_limit_begin(): Vector2
        set scroll_limit_begin(value: Vector2)
        
        /** Bottom-right limits for scrolling to end. If the camera is outside of this limit, the background will stop scrolling. Must be higher than [member scroll_limit_begin] to work. */
        get scroll_limit_end(): Vector2
        set scroll_limit_end(value: Vector2)
        
        /** If `true`, elements in [ParallaxLayer] child aren't affected by the zoom level of the camera. */
        get scroll_ignore_camera_zoom(): boolean
        set scroll_ignore_camera_zoom(value: boolean)
    }
    class ParallaxBackgroundEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** A parallax scrolling layer to be used with [ParallaxBackground].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_parallaxlayer.html  
     */
    class ParallaxLayer<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Multiplies the ParallaxLayer's motion. If an axis is set to `0`, it will not scroll. */
        get motion_scale(): Vector2
        set motion_scale(value: Vector2)
        
        /** The ParallaxLayer's offset relative to the parent ParallaxBackground's [member ParallaxBackground.scroll_offset]. */
        get motion_offset(): Vector2
        set motion_offset(value: Vector2)
        
        /** The interval, in pixels, at which the [ParallaxLayer] is drawn repeatedly. Useful for creating an infinitely scrolling background. If an axis is set to `0`, the [ParallaxLayer] will be drawn only once along that direction.  
         *      
         *  **Note:** If you want the repetition to pixel-perfect match a [Texture2D] displayed by a child node, you should account for any scale applied to the texture when defining this interval. For example, if you use a child [Sprite2D] scaled to `0.5` to display a 600x600 texture, and want this sprite to be repeated continuously horizontally, you should set the mirroring to `Vector2(300, 0)`.  
         *      
         *  **Note:** If the length of the viewport axis is bigger than twice the repeated axis size, it will not repeat infinitely, as the parallax layer only draws 2 instances of the layer at any given time. The visibility window is calculated from the parent [ParallaxBackground]'s position, not the layer's own position. So, if you use mirroring, **do not** change the [ParallaxLayer] position relative to its parent. Instead, if you need to adjust the background's position, set the [member CanvasLayer.offset] property in the parent [ParallaxBackground].  
         *      
         *  **Note:** Despite the name, the layer will not be mirrored, it will only be repeated.  
         */
        get motion_mirroring(): Vector2
        set motion_mirroring(value: Vector2)
    }
    namespace ParticleProcessMaterial {
        enum Parameter {
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set initial velocity properties. */
            PARAM_INITIAL_LINEAR_VELOCITY = 0,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set angular velocity properties. */
            PARAM_ANGULAR_VELOCITY = 1,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set orbital velocity properties. */
            PARAM_ORBIT_VELOCITY = 2,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set linear acceleration properties. */
            PARAM_LINEAR_ACCEL = 3,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set radial acceleration properties. */
            PARAM_RADIAL_ACCEL = 4,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set tangential acceleration properties. */
            PARAM_TANGENTIAL_ACCEL = 5,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set damping properties. */
            PARAM_DAMPING = 6,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set angle properties. */
            PARAM_ANGLE = 7,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set scale properties. */
            PARAM_SCALE = 8,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set hue variation properties. */
            PARAM_HUE_VARIATION = 9,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set animation speed properties. */
            PARAM_ANIM_SPEED = 10,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set animation offset properties. */
            PARAM_ANIM_OFFSET = 11,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set radial velocity properties. */
            PARAM_RADIAL_VELOCITY = 15,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set directional velocity properties. */
            PARAM_DIRECTIONAL_VELOCITY = 16,
            
            /** Use with [method set_param_min], [method set_param_max], and [method set_param_texture] to set scale over velocity properties. */
            PARAM_SCALE_OVER_VELOCITY = 17,
            
            /** Represents the size of the [enum Parameter] enum. */
            PARAM_MAX = 18,
            
            /** Use with [method set_param_min] and [method set_param_max] to set the turbulence minimum und maximum influence on each particles velocity. */
            PARAM_TURB_VEL_INFLUENCE = 13,
            
            /** Use with [method set_param_min] and [method set_param_max] to set the turbulence minimum and maximum displacement of the particles spawn position. */
            PARAM_TURB_INIT_DISPLACEMENT = 14,
            
            /** Use with [method set_param_texture] to set the turbulence influence over the particles life time. */
            PARAM_TURB_INFLUENCE_OVER_LIFE = 12,
        }
        enum ParticleFlags {
            /** Use with [method set_particle_flag] to set [member particle_flag_align_y]. */
            PARTICLE_FLAG_ALIGN_Y_TO_VELOCITY = 0,
            
            /** Use with [method set_particle_flag] to set [member particle_flag_rotate_y]. */
            PARTICLE_FLAG_ROTATE_Y = 1,
            
            /** Use with [method set_particle_flag] to set [member particle_flag_disable_z]. */
            PARTICLE_FLAG_DISABLE_Z = 2,
            PARTICLE_FLAG_DAMPING_AS_FRICTION = 3,
            
            /** Represents the size of the [enum ParticleFlags] enum. */
            PARTICLE_FLAG_MAX = 4,
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
            
            /** Particles will be emitted at a position determined by sampling a random point on the [member emission_point_texture]. Particle color will be modulated by [member emission_color_texture]. */
            EMISSION_SHAPE_POINTS = 4,
            
            /** Particles will be emitted at a position determined by sampling a random point on the [member emission_point_texture]. Particle velocity and rotation will be set based on [member emission_normal_texture]. Particle color will be modulated by [member emission_color_texture]. */
            EMISSION_SHAPE_DIRECTED_POINTS = 5,
            
            /** Particles will be emitted in a ring or cylinder. */
            EMISSION_SHAPE_RING = 6,
            
            /** Represents the size of the [enum EmissionShape] enum. */
            EMISSION_SHAPE_MAX = 7,
        }
        enum SubEmitterMode {
            SUB_EMITTER_DISABLED = 0,
            SUB_EMITTER_CONSTANT = 1,
            SUB_EMITTER_AT_END = 2,
            SUB_EMITTER_AT_COLLISION = 3,
            SUB_EMITTER_AT_START = 4,
            
            /** Represents the size of the [enum SubEmitterMode] enum. */
            SUB_EMITTER_MAX = 5,
        }
        enum CollisionMode {
            /** No collision for particles. Particles will go through [GPUParticlesCollision3D] nodes. */
            COLLISION_DISABLED = 0,
            
            /** [RigidBody3D]-style collision for particles using [GPUParticlesCollision3D] nodes. */
            COLLISION_RIGID = 1,
            
            /** Hide particles instantly when colliding with a [GPUParticlesCollision3D] node. This can be combined with a subemitter that uses the [constant COLLISION_RIGID] collision mode to "replace" the parent particle with the subemitter on impact. */
            COLLISION_HIDE_ON_CONTACT = 2,
            
            /** Represents the size of the [enum CollisionMode] enum. */
            COLLISION_MAX = 3,
        }
    }
    /** Holds a particle configuration for [GPUParticles2D] or [GPUParticles3D] nodes.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_particleprocessmaterial.html  
     */
    class ParticleProcessMaterial extends Material {
        constructor(identifier?: any)
        /** Sets the minimum and maximum values of the given [param param].  
         *  The `x` component of the argument vector corresponds to minimum and the `y` component corresponds to maximum.  
         */
        set_param(param: ParticleProcessMaterial.Parameter, value: Vector2): void
        
        /** Returns the minimum and maximum values of the given [param param] as a vector.  
         *  The `x` component of the returned vector corresponds to minimum and the `y` component corresponds to maximum.  
         */
        get_param(param: ParticleProcessMaterial.Parameter): Vector2
        
        /** Sets the minimum value range for the given parameter. */
        set_param_min(param: ParticleProcessMaterial.Parameter, value: float64): void
        
        /** Returns the minimum value range for the given parameter. */
        get_param_min(param: ParticleProcessMaterial.Parameter): float64
        
        /** Sets the maximum value range for the given parameter. */
        set_param_max(param: ParticleProcessMaterial.Parameter, value: float64): void
        
        /** Returns the maximum value range for the given parameter. */
        get_param_max(param: ParticleProcessMaterial.Parameter): float64
        
        /** Sets the [Texture2D] for the specified [enum Parameter]. */
        set_param_texture(param: ParticleProcessMaterial.Parameter, texture: Texture2D): void
        
        /** Returns the [Texture2D] used by the specified parameter. */
        get_param_texture(param: ParticleProcessMaterial.Parameter): Texture2D
        
        /** If `true`, enables the specified particle flag. See [enum ParticleFlags] for options. */
        set_particle_flag(particle_flag: ParticleProcessMaterial.ParticleFlags, enable: boolean): void
        
        /** Returns `true` if the specified particle flag is enabled. See [enum ParticleFlags] for options. */
        get_particle_flag(particle_flag: ParticleProcessMaterial.ParticleFlags): boolean
        
        /** Particle lifetime randomness ratio. The equation for the lifetime of a particle is `lifetime * (1.0 - randf() * lifetime_randomness)`. For example, a [member lifetime_randomness] of `0.4` scales the lifetime between `0.6` to `1.0` of its original value. */
        get lifetime_randomness(): float64
        set lifetime_randomness(value: float64)
        
        /** Align Y axis of particle with the direction of its velocity. */
        get particle_flag_align_y(): boolean
        set particle_flag_align_y(value: boolean)
        
        /** If `true`, particles rotate around Y axis by [member angle_min]. */
        get particle_flag_rotate_y(): boolean
        set particle_flag_rotate_y(value: boolean)
        
        /** If `true`, particles will not move on the z axis. */
        get particle_flag_disable_z(): boolean
        set particle_flag_disable_z(value: boolean)
        
        /** Changes the behavior of the damping properties from a linear deceleration to a deceleration based on speed percentage. */
        get particle_flag_damping_as_friction(): boolean
        set particle_flag_damping_as_friction(value: boolean)
        
        /** The offset for the [member emission_shape], in local space. */
        get emission_shape_offset(): Vector3
        set emission_shape_offset(value: Vector3)
        
        /** The scale of the [member emission_shape], in local space. */
        get emission_shape_scale(): Vector3
        set emission_shape_scale(value: Vector3)
        
        /** Particles will be emitted inside this region. Use [enum EmissionShape] constants for values. */
        get emission_shape(): int64
        set emission_shape(value: int64)
        
        /** The sphere's radius if [member emission_shape] is set to [constant EMISSION_SHAPE_SPHERE]. */
        get emission_sphere_radius(): float64
        set emission_sphere_radius(value: float64)
        
        /** The box's extents if [member emission_shape] is set to [constant EMISSION_SHAPE_BOX].  
         *      
         *  **Note:** [member emission_box_extents] starts from the center point and applies the X, Y, and Z values in both directions. The size is twice the area of the extents.  
         */
        get emission_box_extents(): Vector3
        set emission_box_extents(value: Vector3)
        
        /** Particles will be emitted at positions determined by sampling this texture at a random position. Used with [constant EMISSION_SHAPE_POINTS] and [constant EMISSION_SHAPE_DIRECTED_POINTS]. Can be created automatically from mesh or node by selecting "Create Emission Points from Mesh/Node" under the "Particles" tool in the toolbar. */
        get emission_point_texture(): Texture2D
        set emission_point_texture(value: Texture2D)
        
        /** Particle velocity and rotation will be set by sampling this texture at the same point as the [member emission_point_texture]. Used only in [constant EMISSION_SHAPE_DIRECTED_POINTS]. Can be created automatically from mesh or node by selecting "Create Emission Points from Mesh/Node" under the "Particles" tool in the toolbar. */
        get emission_normal_texture(): Texture2D
        set emission_normal_texture(value: Texture2D)
        
        /** Particle color will be modulated by color determined by sampling this texture at the same point as the [member emission_point_texture].  
         *      
         *  **Note:** [member emission_color_texture] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member emission_color_texture] will have no visible effect.  
         */
        get emission_color_texture(): Texture2D
        set emission_color_texture(value: Texture2D)
        
        /** The number of emission points if [member emission_shape] is set to [constant EMISSION_SHAPE_POINTS] or [constant EMISSION_SHAPE_DIRECTED_POINTS]. */
        get emission_point_count(): int64
        set emission_point_count(value: int64)
        
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
        
        /** The angle of the cone when using the emitter [constant EMISSION_SHAPE_RING]. The default angle of 90 degrees results in a ring, while an angle of 0 degrees results in a cone. Intermediate values will result in a ring where one end is larger than the other.  
         *      
         *  **Note:** Depending on [member emission_ring_height], the angle may be clamped if the ring's end is reached to form a perfect cone.  
         */
        get emission_ring_cone_angle(): float64
        set emission_ring_cone_angle(value: float64)
        get angle(): Vector2
        set angle(value: Vector2)
        
        /** Minimum equivalent of [member angle_max]. */
        get angle_min(): float64
        set angle_min(value: float64)
        
        /** Maximum initial rotation applied to each particle, in degrees.  
         *  Only applied when [member particle_flag_disable_z] or [member particle_flag_rotate_y] are `true` or the [BaseMaterial3D] being used to draw the particle is using [constant BaseMaterial3D.BILLBOARD_PARTICLES].  
         */
        get angle_max(): float64
        set angle_max(value: float64)
        
        /** Each particle's rotation will be animated along this [CurveTexture]. */
        get angle_curve(): CurveTexture
        set angle_curve(value: CurveTexture)
        
        /** Percentage of the velocity of the respective [GPUParticles2D] or [GPUParticles3D] inherited by each particle when spawning. */
        get inherit_velocity_ratio(): float64
        set inherit_velocity_ratio(value: float64)
        
        /** A pivot point used to calculate radial and orbital velocity of particles. */
        get velocity_pivot(): Vector3
        set velocity_pivot(value: Vector3)
        
        /** Unit vector specifying the particles' emission direction. */
        get direction(): Vector3
        set direction(value: Vector3)
        
        /** Each particle's initial direction range from `+spread` to `-spread` degrees. */
        get spread(): float64
        set spread(value: float64)
        
        /** Amount of [member spread] along the Y axis. */
        get flatness(): float64
        set flatness(value: float64)
        get initial_velocity(): Vector2
        set initial_velocity(value: Vector2)
        
        /** Minimum equivalent of [member initial_velocity_max]. */
        get initial_velocity_min(): float64
        set initial_velocity_min(value: float64)
        
        /** Maximum initial velocity magnitude for each particle. Direction comes from [member direction] and [member spread]. */
        get initial_velocity_max(): float64
        set initial_velocity_max(value: float64)
        get angular_velocity(): Vector2
        set angular_velocity(value: Vector2)
        
        /** Minimum equivalent of [member angular_velocity_max]. */
        get angular_velocity_min(): float64
        set angular_velocity_min(value: float64)
        
        /** Maximum initial angular velocity (rotation speed) applied to each particle in  *degrees*  per second.  
         *  Only applied when [member particle_flag_disable_z] or [member particle_flag_rotate_y] are `true` or the [BaseMaterial3D] being used to draw the particle is using [constant BaseMaterial3D.BILLBOARD_PARTICLES].  
         */
        get angular_velocity_max(): float64
        set angular_velocity_max(value: float64)
        
        /** Each particle's angular velocity (rotation speed) will vary along this [CurveTexture] over its lifetime. */
        get angular_velocity_curve(): CurveTexture
        set angular_velocity_curve(value: CurveTexture)
        get directional_velocity(): Vector2
        set directional_velocity(value: Vector2)
        
        /** Minimum directional velocity value, which is multiplied by [member directional_velocity_curve].  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get directional_velocity_min(): float64
        set directional_velocity_min(value: float64)
        
        /** Maximum directional velocity value, which is multiplied by [member directional_velocity_curve].  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get directional_velocity_max(): float64
        set directional_velocity_max(value: float64)
        
        /** A curve that specifies the velocity along each of the axes of the particle system along its lifetime.  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get directional_velocity_curve(): CurveXYZTexture
        set directional_velocity_curve(value: CurveXYZTexture)
        get orbit_velocity(): Vector2
        set orbit_velocity(value: Vector2)
        
        /** Minimum equivalent of [member orbit_velocity_max].  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get orbit_velocity_min(): float64
        set orbit_velocity_min(value: float64)
        
        /** Maximum orbital velocity applied to each particle. Makes the particles circle around origin. Specified in number of full rotations around origin per second.  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get orbit_velocity_max(): float64
        set orbit_velocity_max(value: float64)
        
        /** Each particle's orbital velocity will vary along this [CurveTexture].  
         *      
         *  **Note:** For 3D orbital velocity, use a [CurveXYZTexture].  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get orbit_velocity_curve(): CurveTexture | CurveXYZTexture
        set orbit_velocity_curve(value: CurveTexture | CurveXYZTexture)
        get radial_velocity(): Vector2
        set radial_velocity(value: Vector2)
        
        /** Minimum radial velocity applied to each particle. Makes particles move away from the [member velocity_pivot], or toward it if negative.  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get radial_velocity_min(): float64
        set radial_velocity_min(value: float64)
        
        /** Maximum radial velocity applied to each particle. Makes particles move away from the [member velocity_pivot], or toward it if negative.  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get radial_velocity_max(): float64
        set radial_velocity_max(value: float64)
        
        /** A [CurveTexture] that defines the velocity over the particle's lifetime away (or toward) the [member velocity_pivot].  
         *      
         *  **Note:** Animated velocities will not be affected by damping, use [member velocity_limit_curve] instead.  
         */
        get radial_velocity_curve(): CurveTexture
        set radial_velocity_curve(value: CurveTexture)
        
        /** A [CurveTexture] that defines the maximum velocity of a particle during its lifetime. */
        get velocity_limit_curve(): CurveTexture
        set velocity_limit_curve(value: CurveTexture)
        
        /** Gravity applied to every particle. */
        get gravity(): Vector3
        set gravity(value: Vector3)
        get linear_accel(): Vector2
        set linear_accel(value: Vector2)
        
        /** Minimum equivalent of [member linear_accel_max]. */
        get linear_accel_min(): float64
        set linear_accel_min(value: float64)
        
        /** Maximum linear acceleration applied to each particle in the direction of motion. */
        get linear_accel_max(): float64
        set linear_accel_max(value: float64)
        
        /** Each particle's linear acceleration will vary along this [CurveTexture]. */
        get linear_accel_curve(): CurveTexture
        set linear_accel_curve(value: CurveTexture)
        get radial_accel(): Vector2
        set radial_accel(value: Vector2)
        
        /** Minimum equivalent of [member radial_accel_max]. */
        get radial_accel_min(): float64
        set radial_accel_min(value: float64)
        
        /** Maximum radial acceleration applied to each particle. Makes particle accelerate away from the origin or towards it if negative. */
        get radial_accel_max(): float64
        set radial_accel_max(value: float64)
        
        /** Each particle's radial acceleration will vary along this [CurveTexture]. */
        get radial_accel_curve(): CurveTexture
        set radial_accel_curve(value: CurveTexture)
        get tangential_accel(): Vector2
        set tangential_accel(value: Vector2)
        
        /** Minimum equivalent of [member tangential_accel_max]. */
        get tangential_accel_min(): float64
        set tangential_accel_min(value: float64)
        
        /** Maximum tangential acceleration applied to each particle. Tangential acceleration is perpendicular to the particle's velocity giving the particles a swirling motion. */
        get tangential_accel_max(): float64
        set tangential_accel_max(value: float64)
        
        /** Each particle's tangential acceleration will vary along this [CurveTexture]. */
        get tangential_accel_curve(): CurveTexture
        set tangential_accel_curve(value: CurveTexture)
        get damping(): Vector2
        set damping(value: Vector2)
        
        /** Minimum equivalent of [member damping_max]. */
        get damping_min(): float64
        set damping_min(value: float64)
        
        /** The maximum rate at which particles lose velocity. For example value of `100` means that the particle will go from `100` velocity to `0` in `1` second. */
        get damping_max(): float64
        set damping_max(value: float64)
        
        /** Damping will vary along this [CurveTexture]. */
        get damping_curve(): CurveTexture
        set damping_curve(value: CurveTexture)
        
        /** If `true`, interaction with particle attractors is enabled. In 3D, attraction only occurs within the area defined by the [GPUParticles3D] node's [member GPUParticles3D.visibility_aabb]. */
        get attractor_interaction_enabled(): boolean
        set attractor_interaction_enabled(value: boolean)
        get scale(): Vector2
        set scale(value: Vector2)
        
        /** Minimum equivalent of [member scale_max]. */
        get scale_min(): float64
        set scale_min(value: float64)
        
        /** Maximum initial scale applied to each particle. */
        get scale_max(): float64
        set scale_max(value: float64)
        
        /** Each particle's scale will vary along this [CurveTexture] over its lifetime. If a [CurveXYZTexture] is supplied instead, the scale will be separated per-axis. */
        get scale_curve(): CurveTexture | CurveXYZTexture
        set scale_curve(value: CurveTexture | CurveXYZTexture)
        get scale_over_velocity(): Vector2
        set scale_over_velocity(value: Vector2)
        
        /** Minimum velocity value reference for [member scale_over_velocity_curve].  
         *  [member scale_over_velocity_curve] will be interpolated between [member scale_over_velocity_min] and [member scale_over_velocity_max].  
         */
        get scale_over_velocity_min(): float64
        set scale_over_velocity_min(value: float64)
        
        /** Maximum velocity value reference for [member scale_over_velocity_curve].  
         *  [member scale_over_velocity_curve] will be interpolated between [member scale_over_velocity_min] and [member scale_over_velocity_max].  
         */
        get scale_over_velocity_max(): float64
        set scale_over_velocity_max(value: float64)
        
        /** Either a [CurveTexture] or a [CurveXYZTexture] that scales each particle based on its velocity. */
        get scale_over_velocity_curve(): CurveTexture | CurveXYZTexture
        set scale_over_velocity_curve(value: CurveTexture | CurveXYZTexture)
        
        /** Each particle's initial color. If the [GPUParticles2D]'s `texture` is defined, it will be multiplied by this color.  
         *      
         *  **Note:** [member color] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color] will have no visible effect.  
         */
        get color(): Color
        set color(value: Color)
        
        /** Each particle's color will vary along this [GradientTexture1D] over its lifetime (multiplied with [member color]).  
         *      
         *  **Note:** [member color_ramp] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color_ramp] will have no visible effect.  
         */
        get color_ramp(): GradientTexture1D
        set color_ramp(value: GradientTexture1D)
        
        /** Each particle's initial color will vary along this [GradientTexture1D] (multiplied with [member color]).  
         *      
         *  **Note:** [member color_initial_ramp] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member color_initial_ramp] will have no visible effect.  
         */
        get color_initial_ramp(): GradientTexture1D
        set color_initial_ramp(value: GradientTexture1D)
        
        /** The alpha value of each particle's color will be multiplied by this [CurveTexture] over its lifetime.  
         *      
         *  **Note:** [member alpha_curve] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member alpha_curve] will have no visible effect.  
         */
        get alpha_curve(): CurveTexture
        set alpha_curve(value: CurveTexture)
        
        /** Each particle's color will be multiplied by this [CurveTexture] over its lifetime.  
         *      
         *  **Note:** [member emission_curve] multiplies the particle mesh's vertex colors. To have a visible effect on a [BaseMaterial3D], [member BaseMaterial3D.vertex_color_use_as_albedo]  *must*  be `true`. For a [ShaderMaterial], `ALBEDO *= COLOR.rgb;` must be inserted in the shader's `fragment()` function. Otherwise, [member emission_curve] will have no visible effect.  
         */
        get emission_curve(): CurveTexture
        set emission_curve(value: CurveTexture)
        get hue_variation(): Vector2
        set hue_variation(value: Vector2)
        
        /** Minimum equivalent of [member hue_variation_max]. */
        get hue_variation_min(): float64
        set hue_variation_min(value: float64)
        
        /** Maximum initial hue variation applied to each particle. It will shift the particle color's hue. */
        get hue_variation_max(): float64
        set hue_variation_max(value: float64)
        
        /** Each particle's hue will vary along this [CurveTexture]. */
        get hue_variation_curve(): CurveTexture
        set hue_variation_curve(value: CurveTexture)
        get anim_speed(): Vector2
        set anim_speed(value: Vector2)
        
        /** Minimum equivalent of [member anim_speed_max]. */
        get anim_speed_min(): float64
        set anim_speed_min(value: float64)
        
        /** Maximum particle animation speed. Animation speed of `1` means that the particles will make full `0` to `1` offset cycle during lifetime, `2` means `2` cycles etc.  
         *  With animation speed greater than `1`, remember to enable [member CanvasItemMaterial.particles_anim_loop] property if you want the animation to repeat.  
         */
        get anim_speed_max(): float64
        set anim_speed_max(value: float64)
        
        /** Each particle's animation speed will vary along this [CurveTexture]. */
        get anim_speed_curve(): CurveTexture
        set anim_speed_curve(value: CurveTexture)
        get anim_offset(): Vector2
        set anim_offset(value: Vector2)
        
        /** Minimum equivalent of [member anim_offset_max]. */
        get anim_offset_min(): float64
        set anim_offset_min(value: float64)
        
        /** Maximum animation offset that corresponds to frame index in the texture. `0` is the first frame, `1` is the last one. See [member CanvasItemMaterial.particles_animation]. */
        get anim_offset_max(): float64
        set anim_offset_max(value: float64)
        
        /** Each particle's animation offset will vary along this [CurveTexture]. */
        get anim_offset_curve(): CurveTexture
        set anim_offset_curve(value: CurveTexture)
        
        /** If `true`, enables turbulence for the particle system. Turbulence can be used to vary particle movement according to its position (based on a 3D noise pattern). In 3D, [GPUParticlesAttractorVectorField3D] with [NoiseTexture3D] can be used as an alternative to turbulence that works in world space and with multiple particle systems reacting in the same way.  
         *      
         *  **Note:** Enabling turbulence has a high performance cost on the GPU. Only enable turbulence on a few particle systems at once at most, and consider disabling it when targeting mobile/web platforms.  
         */
        get turbulence_enabled(): boolean
        set turbulence_enabled(value: boolean)
        
        /** The turbulence noise strength. Increasing this will result in a stronger, more contrasting, flow pattern. */
        get turbulence_noise_strength(): float64
        set turbulence_noise_strength(value: float64)
        
        /** This value controls the overall scale/frequency of the turbulence noise pattern.  
         *  A small scale will result in smaller features with more detail while a high scale will result in smoother noise with larger features.  
         */
        get turbulence_noise_scale(): float64
        set turbulence_noise_scale(value: float64)
        
        /** A scrolling velocity for the turbulence field. This sets a directional trend for the pattern to move in over time.  
         *  The default value of `Vector3(0, 0, 0)` turns off the scrolling.  
         */
        get turbulence_noise_speed(): Vector3
        set turbulence_noise_speed(value: Vector3)
        
        /** The in-place rate of change of the turbulence field. This defines how quickly the noise pattern varies over time.  
         *  A value of 0.0 will result in a fixed pattern.  
         */
        get turbulence_noise_speed_random(): float64
        set turbulence_noise_speed_random(value: float64)
        get turbulence_influence(): Vector2
        set turbulence_influence(value: Vector2)
        
        /** Minimum turbulence influence on each particle.  
         *  The actual amount of turbulence influence on each particle is calculated as a random value between [member turbulence_influence_min] and [member turbulence_influence_max] and multiplied by the amount of turbulence influence from [member turbulence_influence_over_life].  
         */
        get turbulence_influence_min(): float64
        set turbulence_influence_min(value: float64)
        
        /** Maximum turbulence influence on each particle.  
         *  The actual amount of turbulence influence on each particle is calculated as a random value between [member turbulence_influence_min] and [member turbulence_influence_max] and multiplied by the amount of turbulence influence from [member turbulence_influence_over_life].  
         */
        get turbulence_influence_max(): float64
        set turbulence_influence_max(value: float64)
        get turbulence_initial_displacement(): Vector2
        set turbulence_initial_displacement(value: Vector2)
        
        /** Minimum displacement of each particle's spawn position by the turbulence.  
         *  The actual amount of displacement will be a factor of the underlying turbulence multiplied by a random value between [member turbulence_initial_displacement_min] and [member turbulence_initial_displacement_max].  
         */
        get turbulence_initial_displacement_min(): float64
        set turbulence_initial_displacement_min(value: float64)
        
        /** Maximum displacement of each particle's spawn position by the turbulence.  
         *  The actual amount of displacement will be a factor of the underlying turbulence multiplied by a random value between [member turbulence_initial_displacement_min] and [member turbulence_initial_displacement_max].  
         */
        get turbulence_initial_displacement_max(): float64
        set turbulence_initial_displacement_max(value: float64)
        
        /** Each particle's amount of turbulence will be influenced along this [CurveTexture] over its life time. */
        get turbulence_influence_over_life(): CurveTexture
        set turbulence_influence_over_life(value: CurveTexture)
        
        /** The particles' collision mode.  
         *      
         *  **Note:** 3D Particles can only collide with [GPUParticlesCollision3D] nodes, not [PhysicsBody3D] nodes. To make particles collide with various objects, you can add [GPUParticlesCollision3D] nodes as children of [PhysicsBody3D] nodes. In 3D, collisions only occur within the area defined by the [GPUParticles3D] node's [member GPUParticles3D.visibility_aabb].  
         *      
         *  **Note:** 2D Particles can only collide with [LightOccluder2D] nodes, not [PhysicsBody2D] nodes.  
         */
        get collision_mode(): int64
        set collision_mode(value: int64)
        
        /** The particles' friction. Values range from `0` (frictionless) to `1` (maximum friction). Only effective if [member collision_mode] is [constant COLLISION_RIGID]. */
        get collision_friction(): float64
        set collision_friction(value: float64)
        
        /** The particles' bounciness. Values range from `0` (no bounce) to `1` (full bounciness). Only effective if [member collision_mode] is [constant COLLISION_RIGID]. */
        get collision_bounce(): float64
        set collision_bounce(value: float64)
        
        /** If `true`, [member GPUParticles3D.collision_base_size] is multiplied by the particle's effective scale (see [member scale_min], [member scale_max], [member scale_curve], and [member scale_over_velocity_curve]). */
        get collision_use_scale(): boolean
        set collision_use_scale(value: boolean)
        
        /** The particle subemitter mode (see [member GPUParticles2D.sub_emitter] and [member GPUParticles3D.sub_emitter]). */
        get sub_emitter_mode(): int64
        set sub_emitter_mode(value: int64)
        
        /** The frequency at which particles should be emitted from the subemitter node. One particle will be spawned every [member sub_emitter_frequency] seconds.  
         *      
         *  **Note:** This value shouldn't exceed [member GPUParticles2D.amount] or [member GPUParticles3D.amount] defined on the  *subemitter node*  (not the main node), relative to the subemitter's particle lifetime. If the number of particles is exceeded, no new particles will spawn from the subemitter until enough particles have expired.  
         */
        get sub_emitter_frequency(): float64
        set sub_emitter_frequency(value: float64)
        
        /** The amount of particles to spawn from the subemitter node when the particle expires.  
         *      
         *  **Note:** This value shouldn't exceed [member GPUParticles2D.amount] or [member GPUParticles3D.amount] defined on the  *subemitter node*  (not the main node), relative to the subemitter's particle lifetime. If the number of particles is exceeded, no new particles will spawn from the subemitter until enough particles have expired.  
         */
        get sub_emitter_amount_at_end(): int64
        set sub_emitter_amount_at_end(value: int64)
        
        /** The amount of particles to spawn from the subemitter node when a collision occurs. When combined with [constant COLLISION_HIDE_ON_CONTACT] on the main particles material, this can be used to achieve effects such as raindrops hitting the ground.  
         *      
         *  **Note:** This value shouldn't exceed [member GPUParticles2D.amount] or [member GPUParticles3D.amount] defined on the  *subemitter node*  (not the main node), relative to the subemitter's particle lifetime. If the number of particles is exceeded, no new particles will spawn from the subemitter until enough particles have expired.  
         */
        get sub_emitter_amount_at_collision(): int64
        set sub_emitter_amount_at_collision(value: int64)
        
        /** The amount of particles to spawn from the subemitter node when the particle spawns.  
         *      
         *  **Note:** This value shouldn't exceed [member GPUParticles2D.amount] or [member GPUParticles3D.amount] defined on the  *subemitter node*  (not the main node), relative to the subemitter's particle lifetime. If the number of particles is exceeded, no new particles will spawn from the subemitter until enough particles have expired.  
         */
        get sub_emitter_amount_at_start(): int64
        set sub_emitter_amount_at_start(value: int64)
        
        /** If `true`, the subemitter inherits the parent particle's velocity when it spawns. */
        get sub_emitter_keep_velocity(): boolean
        set sub_emitter_keep_velocity(value: boolean)
        
        /** Emitted when this material's emission shape is changed in any way. This includes changes to [member emission_shape], [member emission_shape_scale], or [member emission_sphere_radius], and any other property that affects the emission shape's offset, size, scale, or orientation.  
         *      
         *  **Note:** This signal is only emitted inside the editor for performance reasons.  
         */
        readonly emission_shape_changed: Signal0
    }
    class ParticleProcessMaterialConversionPlugin extends EditorResourceConversionPlugin {
        constructor(identifier?: any)
    }
    class Particles2DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends ParticlesEditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class Particles3DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends ParticlesEditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class Particles3DEmissionShapeGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    class ParticlesEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** Contains a [Curve2D] path for [PathFollow2D] nodes to follow.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_path2d.html  
     */
    class Path2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** A [Curve2D] describing the path. */
        get curve(): Curve2D
        set curve(value: Curve2D)
    }
    class Path2DEditor<Map extends Record<string, Node> = Record<string, Node>> extends HBoxContainer<Map> {
        constructor(identifier?: any)
        _update_toolbar(): void
        _clear_curve_points(_unnamed_arg0: Path2D): void
        _restore_curve_points(_unnamed_arg0: Path2D, _unnamed_arg1: PackedVector2Array | Vector2[]): void
    }
    class Path2DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** Contains a [Curve3D] path for [PathFollow3D] nodes to follow.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_path3d.html  
     */
    class Path3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** A [Curve3D] describing the path. */
        get curve(): Curve3D
        set curve(value: Curve3D)
        
        /** Emitted when the [member curve] changes. */
        readonly curve_changed: Signal0
    }
    class Path3DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
        _update_toolbar(): void
        _clear_curve_points(): void
        _restore_curve_points(_unnamed_arg0: PackedVector3Array | Vector3[]): void
    }
    class Path3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** Point sampler for a [Path2D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_pathfollow2d.html  
     */
    class PathFollow2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** The distance along the path, in pixels. Changing this value sets this node's position to a point within the path. */
        get progress(): float64
        set progress(value: float64)
        
        /** The distance along the path as a number in the range 0.0 (for the first vertex) to 1.0 (for the last). This is just another way of expressing the progress within the path, as the offset supplied is multiplied internally by the path's length.  
         *  It can be set or get only if the [PathFollow2D] is the child of a [Path2D] which is part of the scene tree, and that this [Path2D] has a [Curve2D] with a non-zero length. Otherwise, trying to set this field will print an error, and getting this field will return `0.0`.  
         */
        get progress_ratio(): float64
        set progress_ratio(value: float64)
        
        /** The node's offset along the curve. */
        get h_offset(): float64
        set h_offset(value: float64)
        
        /** The node's offset perpendicular to the curve. */
        get v_offset(): float64
        set v_offset(value: float64)
        
        /** If `true`, this node rotates to follow the path, with the +X direction facing forward on the path. */
        get rotates(): boolean
        set rotates(value: boolean)
        
        /** If `true`, the position between two cached points is interpolated cubically, and linearly otherwise.  
         *  The points along the [Curve2D] of the [Path2D] are precomputed before use, for faster calculations. The point at the requested offset is then calculated interpolating between two adjacent cached points. This may present a problem if the curve makes sharp turns, as the cached points may not follow the curve closely enough.  
         *  There are two answers to this problem: either increase the number of cached points and increase memory consumption, or make a cubic interpolation between two points at the cost of (slightly) slower calculations.  
         */
        get cubic_interp(): boolean
        set cubic_interp(value: boolean)
        
        /** If `true`, any offset outside the path's length will wrap around, instead of stopping at the ends. Use it for cyclic paths. */
        get loop(): boolean
        set loop(value: boolean)
    }
    namespace PathFollow3D {
        enum RotationMode {
            /** Forbids the PathFollow3D to rotate. */
            ROTATION_NONE = 0,
            
            /** Allows the PathFollow3D to rotate in the Y axis only. */
            ROTATION_Y = 1,
            
            /** Allows the PathFollow3D to rotate in both the X, and Y axes. */
            ROTATION_XY = 2,
            
            /** Allows the PathFollow3D to rotate in any axis. */
            ROTATION_XYZ = 3,
            
            /** Uses the up vector information in a [Curve3D] to enforce orientation. This rotation mode requires the [Path3D]'s [member Curve3D.up_vector_enabled] property to be set to `true`. */
            ROTATION_ORIENTED = 4,
        }
    }
    /** Point sampler for a [Path3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_pathfollow3d.html  
     */
    class PathFollow3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Correct the [param transform]. [param rotation_mode] implicitly specifies how posture (forward, up and sideway direction) is calculated. */
        static correct_posture(transform: Transform3D, rotation_mode: PathFollow3D.RotationMode): Transform3D
        
        /** The distance from the first vertex, measured in 3D units along the path. Changing this value sets this node's position to a point within the path. */
        get progress(): float64
        set progress(value: float64)
        
        /** The distance from the first vertex, considering 0.0 as the first vertex and 1.0 as the last. This is just another way of expressing the progress within the path, as the progress supplied is multiplied internally by the path's length.  
         *  It can be set or get only if the [PathFollow3D] is the child of a [Path3D] which is part of the scene tree, and that this [Path3D] has a [Curve3D] with a non-zero length. Otherwise, trying to set this field will print an error, and getting this field will return `0.0`.  
         */
        get progress_ratio(): float64
        set progress_ratio(value: float64)
        
        /** The node's offset along the curve. */
        get h_offset(): float64
        set h_offset(value: float64)
        
        /** The node's offset perpendicular to the curve. */
        get v_offset(): float64
        set v_offset(value: float64)
        
        /** Allows or forbids rotation on one or more axes, depending on the [enum RotationMode] constants being used. */
        get rotation_mode(): int64
        set rotation_mode(value: int64)
        
        /** If `true`, the node moves on the travel path with orienting the +Z axis as forward. See also [constant Vector3.FORWARD] and [constant Vector3.MODEL_FRONT]. */
        get use_model_front(): boolean
        set use_model_front(value: boolean)
        
        /** If `true`, the position between two cached points is interpolated cubically, and linearly otherwise.  
         *  The points along the [Curve3D] of the [Path3D] are precomputed before use, for faster calculations. The point at the requested offset is then calculated interpolating between two adjacent cached points. This may present a problem if the curve makes sharp turns, as the cached points may not follow the curve closely enough.  
         *  There are two answers to this problem: either increase the number of cached points and increase memory consumption, or make a cubic interpolation between two points at the cost of (slightly) slower calculations.  
         */
        get cubic_interp(): boolean
        set cubic_interp(value: boolean)
        
        /** If `true`, any offset outside the path's length will wrap around, instead of stopping at the ends. Use it for cyclic paths. */
        get loop(): boolean
        set loop(value: boolean)
        
        /** If `true`, the tilt property of [Curve3D] takes effect. */
        get tilt_enabled(): boolean
        set tilt_enabled(value: boolean)
    }
    /** A [RigidBody2D]-derived node used to make [Bone2D]s in a [Skeleton2D] react to physics.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicalbone2d.html  
     */
    class PhysicalBone2D<Map extends Record<string, Node> = Record<string, Node>> extends RigidBody2D<Map> {
        constructor(identifier?: any)
        /** Returns the first [Joint2D] child node, if one exists. This is mainly a helper function to make it easier to get the [Joint2D] that the [PhysicalBone2D] is autoconfiguring. */
        get_joint(): Joint2D
        
        /** Returns a boolean that indicates whether the [PhysicalBone2D] is running and simulating using the Godot 2D physics engine. When `true`, the PhysicalBone2D node is using physics. */
        is_simulating_physics(): boolean
        
        /** The [NodePath] to the [Bone2D] that this [PhysicalBone2D] should simulate. */
        get bone2d_nodepath(): NodePath
        set bone2d_nodepath(value: NodePath | string)
        
        /** The index of the [Bone2D] that this [PhysicalBone2D] should simulate. */
        get bone2d_index(): int64
        set bone2d_index(value: int64)
        
        /** If `true`, the [PhysicalBone2D] will automatically configure the first [Joint2D] child node. The automatic configuration is limited to setting up the node properties and positioning the [Joint2D]. */
        get auto_configure_joint(): boolean
        set auto_configure_joint(value: boolean)
        
        /** If `true`, the [PhysicalBone2D] will start simulating using physics. If `false`, the [PhysicalBone2D] will follow the transform of the [Bone2D] node.  
         *      
         *  **Note:** To have the [Bone2D]s visually follow the [PhysicalBone2D], use a [SkeletonModification2DPhysicalBones] modification on the [Skeleton2D] node with the [Bone2D] nodes.  
         */
        get simulate_physics(): boolean
        set simulate_physics(value: boolean)
        
        /** If `true`, the [PhysicalBone2D] will keep the transform of the bone it is bound to when simulating physics. */
        get follow_bone_when_simulating(): boolean
        set follow_bone_when_simulating(value: boolean)
    }
    namespace PhysicalBone3D {
        enum DampMode {
            /** In this mode, the body's damping value is added to any value set in areas or the default value. */
            DAMP_MODE_COMBINE = 0,
            
            /** In this mode, the body's damping value replaces any value set in areas or the default value. */
            DAMP_MODE_REPLACE = 1,
        }
        enum JointType {
            /** No joint is applied to the PhysicsBone3D. */
            JOINT_TYPE_NONE = 0,
            
            /** A pin joint is applied to the PhysicsBone3D. */
            JOINT_TYPE_PIN = 1,
            
            /** A cone joint is applied to the PhysicsBone3D. */
            JOINT_TYPE_CONE = 2,
            
            /** A hinge joint is applied to the PhysicsBone3D. */
            JOINT_TYPE_HINGE = 3,
            
            /** A slider joint is applied to the PhysicsBone3D. */
            JOINT_TYPE_SLIDER = 4,
            
            /** A 6 degrees of freedom joint is applied to the PhysicsBone3D. */
            JOINT_TYPE_6DOF = 5,
        }
    }
    /** A physics body used to make bones in a [Skeleton3D] react to physics.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicalbone3d.html  
     */
    class PhysicalBone3D<Map extends Record<string, Node> = Record<string, Node>> extends PhysicsBody3D<Map> {
        constructor(identifier?: any)
        /** Called during physics processing, allowing you to read and safely modify the simulation state for the object. By default, it is called before the standard force integration, but the [member custom_integrator] property allows you to disable the standard force integration and do fully custom force integration for a body. */
        /* gdvirtual */ _integrate_forces(state: PhysicsDirectBodyState3D): void
        
        /** Applies a directional impulse without affecting rotation.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_integrate_forces" functions otherwise).  
         *  This is equivalent to using [method apply_impulse] at the body's center of mass.  
         */
        apply_central_impulse(impulse: Vector3): void
        
        /** Applies a positioned impulse to the PhysicsBone3D.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_integrate_forces" functions otherwise).  
         *  [param position] is the offset from the PhysicsBone3D origin in global coordinates.  
         */
        apply_impulse(impulse: Vector3, position: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Returns `true` if the PhysicsBone3D is allowed to simulate physics. */
        get_simulate_physics(): boolean
        
        /** Returns `true` if the PhysicsBone3D is currently simulating physics. */
        is_simulating_physics(): boolean
        
        /** Returns the unique identifier of the PhysicsBone3D. */
        get_bone_id(): int64
        
        /** Sets the joint type. See [enum JointType] for possible values. */
        get joint_type(): int64
        set joint_type(value: int64)
        
        /** Sets the joint's transform. */
        get joint_offset(): Transform3D
        set joint_offset(value: Transform3D)
        
        /** Sets the joint's rotation in radians. */
        get joint_rotation(): Vector3
        set joint_rotation(value: Vector3)
        
        /** Sets the body's transform. */
        get body_offset(): Transform3D
        set body_offset(value: Transform3D)
        
        /** The body's mass. */
        get mass(): float64
        set mass(value: float64)
        
        /** The body's friction, from `0` (frictionless) to `1` (max friction). */
        get friction(): float64
        set friction(value: float64)
        
        /** The body's bounciness. Values range from `0` (no bounce) to `1` (full bounciness).  
         *      
         *  **Note:** Even with [member bounce] set to `1.0`, some energy will be lost over time due to linear and angular damping. To have a [PhysicalBone3D] that preserves all its energy over time, set [member bounce] to `1.0`, [member linear_damp_mode] to [constant DAMP_MODE_REPLACE], [member linear_damp] to `0.0`, [member angular_damp_mode] to [constant DAMP_MODE_REPLACE], and [member angular_damp] to `0.0`.  
         */
        get bounce(): float64
        set bounce(value: float64)
        
        /** This is multiplied by [member ProjectSettings.physics/3d/default_gravity] to produce this body's gravity. For example, a value of `1.0` will apply normal gravity, `2.0` will apply double the gravity, and `0.5` will apply half the gravity to this body. */
        get gravity_scale(): float64
        set gravity_scale(value: float64)
        
        /** If `true`, the standard force integration (like gravity or damping) will be disabled for this body. Other than collision response, the body will only move as determined by the [method _integrate_forces] method, if that virtual method is overridden.  
         *  Setting this property will call the method [method PhysicsServer3D.body_set_omit_force_integration] internally.  
         */
        get custom_integrator(): boolean
        set custom_integrator(value: boolean)
        
        /** Defines how [member linear_damp] is applied. See [enum DampMode] for possible values. */
        get linear_damp_mode(): int64
        set linear_damp_mode(value: int64)
        
        /** Damps the body's movement. By default, the body will use [member ProjectSettings.physics/3d/default_linear_damp] or any value override set by an [Area3D] the body is in. Depending on [member linear_damp_mode], [member linear_damp] may be added to or replace the body's damping value.  
         *  See [member ProjectSettings.physics/3d/default_linear_damp] for more details about damping.  
         */
        get linear_damp(): float64
        set linear_damp(value: float64)
        
        /** Defines how [member angular_damp] is applied. See [enum DampMode] for possible values. */
        get angular_damp_mode(): int64
        set angular_damp_mode(value: int64)
        
        /** Damps the body's rotation. By default, the body will use the [member ProjectSettings.physics/3d/default_angular_damp] project setting or any value override set by an [Area3D] the body is in. Depending on [member angular_damp_mode], you can set [member angular_damp] to be added to or to replace the body's damping value.  
         *  See [member ProjectSettings.physics/3d/default_angular_damp] for more details about damping.  
         */
        get angular_damp(): float64
        set angular_damp(value: float64)
        
        /** The body's linear velocity in units per second. Can be used sporadically, but **don't set this every frame**, because physics may run in another thread and runs at a different granularity. Use [method _integrate_forces] as your process loop for precise control of the body state. */
        get linear_velocity(): Vector3
        set linear_velocity(value: Vector3)
        
        /** The PhysicalBone3D's rotational velocity in  *radians*  per second. */
        get angular_velocity(): Vector3
        set angular_velocity(value: Vector3)
        
        /** If `true`, the body is deactivated when there is no movement, so it will not take part in the simulation until it is awakened by an external force. */
        get can_sleep(): boolean
        set can_sleep(value: boolean)
    }
    class PhysicalBone3DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class PhysicalBone3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** Node that can be the parent of [PhysicalBone3D] and can apply the simulation results to [Skeleton3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicalbonesimulator3d.html  
     */
    class PhysicalBoneSimulator3D<Map extends Record<string, Node> = Record<string, Node>> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** Returns a boolean that indicates whether the [PhysicalBoneSimulator3D] is running and simulating. */
        is_simulating_physics(): boolean
        
        /** Tells the [PhysicalBone3D] nodes in the Skeleton to stop simulating. */
        physical_bones_stop_simulation(): void
        
        /** Tells the [PhysicalBone3D] nodes in the Skeleton to start simulating and reacting to the physics world.  
         *  Optionally, a list of bone names can be passed-in, allowing only the passed-in bones to be simulated.  
         */
        physical_bones_start_simulation(bones: GArray = []): void
        
        /** Adds a collision exception to the physical bone.  
         *  Works just like the [RigidBody3D] node.  
         */
        physical_bones_add_collision_exception(exception: RID): void
        
        /** Removes a collision exception to the physical bone.  
         *  Works just like the [RigidBody3D] node.  
         */
        physical_bones_remove_collision_exception(exception: RID): void
    }
    /** A material that defines a sky for a [Sky] resource by a set of physical properties.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicalskymaterial.html  
     */
    class PhysicalSkyMaterial extends Material {
        constructor(identifier?: any)
        /** Controls the strength of the [url=https://en.wikipedia.org/wiki/Rayleigh_scattering]Rayleigh scattering[/url]. Rayleigh scattering results from light colliding with small particles. It is responsible for the blue color of the sky. */
        get rayleigh_coefficient(): float64
        set rayleigh_coefficient(value: float64)
        
        /** Controls the [Color] of the [url=https://en.wikipedia.org/wiki/Rayleigh_scattering]Rayleigh scattering[/url]. While not physically accurate, this allows for the creation of alien-looking planets. For example, setting this to a red [Color] results in a Mars-looking atmosphere with a corresponding blue sunset. */
        get rayleigh_color(): Color
        set rayleigh_color(value: Color)
        
        /** Controls the strength of [url=https://en.wikipedia.org/wiki/Mie_scattering]Mie scattering[/url] for the sky. Mie scattering results from light colliding with larger particles (like water). On earth, Mie scattering results in a whitish color around the sun and horizon. */
        get mie_coefficient(): float64
        set mie_coefficient(value: float64)
        
        /** Controls the direction of the [url=https://en.wikipedia.org/wiki/Mie_scattering]Mie scattering[/url]. A value of `1` means that when light hits a particle it's passing through straight forward. A value of `-1` means that all light is scatter backwards. */
        get mie_eccentricity(): float64
        set mie_eccentricity(value: float64)
        
        /** Controls the [Color] of the [url=https://en.wikipedia.org/wiki/Mie_scattering]Mie scattering[/url] effect. While not physically accurate, this allows for the creation of alien-looking planets. */
        get mie_color(): Color
        set mie_color(value: Color)
        
        /** Sets the thickness of the atmosphere. High turbidity creates a foggy-looking atmosphere, while a low turbidity results in a clearer atmosphere. */
        get turbidity(): float64
        set turbidity(value: float64)
        
        /** Sets the size of the sun disk. Default value is based on Sol's perceived size from Earth. */
        get sun_disk_scale(): float64
        set sun_disk_scale(value: float64)
        
        /** Modulates the [Color] on the bottom half of the sky to represent the ground. */
        get ground_color(): Color
        set ground_color(value: Color)
        
        /** The sky's overall brightness multiplier. Higher values result in a brighter sky. */
        get energy_multiplier(): float64
        set energy_multiplier(value: float64)
        
        /** If `true`, enables debanding. Debanding adds a small amount of noise which helps reduce banding that appears from the smooth changes in color in the sky. */
        get use_debanding(): boolean
        set use_debanding(value: boolean)
        
        /** [Texture2D] for the night sky. This is added to the sky, so if it is bright enough, it may be visible during the day. */
        get night_sky(): Texture2D
        set night_sky(value: Texture2D)
    }
    class PhysicalSkyMaterialConversionPlugin extends EditorResourceConversionPlugin {
        constructor(identifier?: any)
    }
    /** Abstract base class for 2D game objects affected by physics.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsbody2d.html  
     */
    class PhysicsBody2D<Map extends Record<string, Node> = Record<string, Node>> extends CollisionObject2D<Map> {
        constructor(identifier?: any)
        /** Moves the body along the vector [param motion]. In order to be frame rate independent in [method Node._physics_process] or [method Node._process], [param motion] should be computed using `delta`.  
         *  Returns a [KinematicCollision2D], which contains information about the collision when stopped, or when touching another body along the motion.  
         *  If [param test_only] is `true`, the body does not move but the would-be collision information is given.  
         *  [param safe_margin] is the extra margin used for collision recovery (see [member CharacterBody2D.safe_margin] for more details).  
         *  If [param recovery_as_collision] is `true`, any depenetration from the recovery phase is also reported as a collision; this is used e.g. by [CharacterBody2D] for improving floor detection during floor snapping.  
         */
        move_and_collide(motion: Vector2, test_only: boolean = false, safe_margin: float64 = 0.08, recovery_as_collision: boolean = false): KinematicCollision2D
        
        /** Checks for collisions without moving the body. In order to be frame rate independent in [method Node._physics_process] or [method Node._process], [param motion] should be computed using `delta`.  
         *  Virtually sets the node's position, scale and rotation to that of the given [Transform2D], then tries to move the body along the vector [param motion]. Returns `true` if a collision would stop the body from moving along the whole path.  
         *  [param collision] is an optional object of type [KinematicCollision2D], which contains additional information about the collision when stopped, or when touching another body along the motion.  
         *  [param safe_margin] is the extra margin used for collision recovery (see [member CharacterBody2D.safe_margin] for more details).  
         *  If [param recovery_as_collision] is `true`, any depenetration from the recovery phase is also reported as a collision; this is useful for checking whether the body would  *touch*  any other bodies.  
         */
        test_move(from: Transform2D, motion: Vector2, collision: KinematicCollision2D = undefined, safe_margin: float64 = 0.08, recovery_as_collision: boolean = false): boolean
        
        /** Returns the gravity vector computed from all sources that can affect the body, including all gravity overrides from [Area2D] nodes and the global world gravity. */
        get_gravity(): Vector2
        
        /** Returns an array of nodes that were added as collision exceptions for this body. */
        get_collision_exceptions(): GArray
        
        /** Adds a body to the list of bodies that this body can't collide with. */
        add_collision_exception_with(body: Node): void
        
        /** Removes a body from the list of bodies that this body can't collide with. */
        remove_collision_exception_with(body: Node): void
    }
    /** Abstract base class for 3D game objects affected by physics.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsbody3d.html  
     */
    class PhysicsBody3D<Map extends Record<string, Node> = Record<string, Node>> extends CollisionObject3D<Map> {
        constructor(identifier?: any)
        /** Moves the body along the vector [param motion]. In order to be frame rate independent in [method Node._physics_process] or [method Node._process], [param motion] should be computed using `delta`.  
         *  The body will stop if it collides. Returns a [KinematicCollision3D], which contains information about the collision when stopped, or when touching another body along the motion.  
         *  If [param test_only] is `true`, the body does not move but the would-be collision information is given.  
         *  [param safe_margin] is the extra margin used for collision recovery (see [member CharacterBody3D.safe_margin] for more details).  
         *  If [param recovery_as_collision] is `true`, any depenetration from the recovery phase is also reported as a collision; this is used e.g. by [CharacterBody3D] for improving floor detection during floor snapping.  
         *  [param max_collisions] allows to retrieve more than one collision result.  
         */
        move_and_collide(motion: Vector3, test_only: boolean = false, safe_margin: float64 = 0.001, recovery_as_collision: boolean = false, max_collisions: int64 = 1): KinematicCollision3D
        
        /** Checks for collisions without moving the body. In order to be frame rate independent in [method Node._physics_process] or [method Node._process], [param motion] should be computed using `delta`.  
         *  Virtually sets the node's position, scale and rotation to that of the given [Transform3D], then tries to move the body along the vector [param motion]. Returns `true` if a collision would stop the body from moving along the whole path.  
         *  [param collision] is an optional object of type [KinematicCollision3D], which contains additional information about the collision when stopped, or when touching another body along the motion.  
         *  [param safe_margin] is the extra margin used for collision recovery (see [member CharacterBody3D.safe_margin] for more details).  
         *  If [param recovery_as_collision] is `true`, any depenetration from the recovery phase is also reported as a collision; this is useful for checking whether the body would  *touch*  any other bodies.  
         *  [param max_collisions] allows to retrieve more than one collision result.  
         */
        test_move(from: Transform3D, motion: Vector3, collision: KinematicCollision3D = undefined, safe_margin: float64 = 0.001, recovery_as_collision: boolean = false, max_collisions: int64 = 1): boolean
        
        /** Returns the gravity vector computed from all sources that can affect the body, including all gravity overrides from [Area3D] nodes and the global world gravity. */
        get_gravity(): Vector3
        
        /** Locks or unlocks the specified linear or rotational [param axis] depending on the value of [param lock]. */
        set_axis_lock(axis: PhysicsServer3D.BodyAxis, lock: boolean): void
        
        /** Returns `true` if the specified linear or rotational [param axis] is locked. */
        get_axis_lock(axis: PhysicsServer3D.BodyAxis): boolean
        
        /** Returns an array of nodes that were added as collision exceptions for this body. */
        get_collision_exceptions(): GArray
        
        /** Adds a body to the list of bodies that this body can't collide with. */
        add_collision_exception_with(body: Node): void
        
        /** Removes a body from the list of bodies that this body can't collide with. */
        remove_collision_exception_with(body: Node): void
        
        /** Lock the body's linear movement in the X axis. */
        get axis_lock_linear_x(): boolean
        set axis_lock_linear_x(value: boolean)
        
        /** Lock the body's linear movement in the Y axis. */
        get axis_lock_linear_y(): boolean
        set axis_lock_linear_y(value: boolean)
        
        /** Lock the body's linear movement in the Z axis. */
        get axis_lock_linear_z(): boolean
        set axis_lock_linear_z(value: boolean)
        
        /** Lock the body's rotation in the X axis. */
        get axis_lock_angular_x(): boolean
        set axis_lock_angular_x(value: boolean)
        
        /** Lock the body's rotation in the Y axis. */
        get axis_lock_angular_y(): boolean
        set axis_lock_angular_y(value: boolean)
        
        /** Lock the body's rotation in the Z axis. */
        get axis_lock_angular_z(): boolean
        set axis_lock_angular_z(value: boolean)
    }
    /** Provides direct access to a physics body in the [PhysicsServer2D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsdirectbodystate2d.html  
     */
    class PhysicsDirectBodyState2D extends Object {
        constructor(identifier?: any)
        /** Returns the body's velocity at the given relative position, including both translation and rotation. */
        get_velocity_at_local_position(local_position: Vector2): Vector2
        
        /** Applies a directional impulse without affecting rotation.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  This is equivalent to using [method apply_impulse] at the body's center of mass.  
         */
        apply_central_impulse(impulse: Vector2): void
        
        /** Applies a rotational impulse to the body without affecting the position.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *      
         *  **Note:** [member inverse_inertia] is required for this to work. To have [member inverse_inertia], an active [CollisionShape2D] must be a child of the node, or you can manually set [member inverse_inertia].  
         */
        apply_torque_impulse(impulse: float64): void
        
        /** Applies a positioned impulse to the body.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        apply_impulse(impulse: Vector2, position: Vector2 = Vector2.ZERO): void
        
        /** Applies a directional force without affecting rotation. A force is time dependent and meant to be applied every physics update.  
         *  This is equivalent to using [method apply_force] at the body's center of mass.  
         */
        apply_central_force(force: Vector2 = Vector2.ZERO): void
        
        /** Applies a positioned force to the body. A force is time dependent and meant to be applied every physics update.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        apply_force(force: Vector2, position: Vector2 = Vector2.ZERO): void
        
        /** Applies a rotational force without affecting position. A force is time dependent and meant to be applied every physics update.  
         *      
         *  **Note:** [member inverse_inertia] is required for this to work. To have [member inverse_inertia], an active [CollisionShape2D] must be a child of the node, or you can manually set [member inverse_inertia].  
         */
        apply_torque(torque: float64): void
        
        /** Adds a constant directional force without affecting rotation that keeps being applied over time until cleared with `constant_force = Vector2(0, 0)`.  
         *  This is equivalent to using [method add_constant_force] at the body's center of mass.  
         */
        add_constant_central_force(force: Vector2 = Vector2.ZERO): void
        
        /** Adds a constant positioned force to the body that keeps being applied over time until cleared with `constant_force = Vector2(0, 0)`.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        add_constant_force(force: Vector2, position: Vector2 = Vector2.ZERO): void
        
        /** Adds a constant rotational force without affecting position that keeps being applied over time until cleared with `constant_torque = 0`. */
        add_constant_torque(torque: float64): void
        
        /** Sets the body's total constant positional forces applied during each physics update.  
         *  See [method add_constant_force] and [method add_constant_central_force].  
         */
        set_constant_force(force: Vector2): void
        
        /** Returns the body's total constant positional forces applied during each physics update.  
         *  See [method add_constant_force] and [method add_constant_central_force].  
         */
        get_constant_force(): Vector2
        
        /** Sets the body's total constant rotational forces applied during each physics update.  
         *  See [method add_constant_torque].  
         */
        set_constant_torque(torque: float64): void
        
        /** Returns the body's total constant rotational forces applied during each physics update.  
         *  See [method add_constant_torque].  
         */
        get_constant_torque(): float64
        
        /** Returns the number of contacts this body has with other bodies.  
         *      
         *  **Note:** By default, this returns 0 unless bodies are configured to monitor contacts. See [member RigidBody2D.contact_monitor].  
         */
        get_contact_count(): int64
        
        /** Returns the position of the contact point on the body in the global coordinate system. */
        get_contact_local_position(contact_idx: int64): Vector2
        
        /** Returns the local normal at the contact point. */
        get_contact_local_normal(contact_idx: int64): Vector2
        
        /** Returns the local shape index of the collision. */
        get_contact_local_shape(contact_idx: int64): int64
        
        /** Returns the velocity vector at the body's contact point. */
        get_contact_local_velocity_at_position(contact_idx: int64): Vector2
        
        /** Returns the collider's [RID]. */
        get_contact_collider(contact_idx: int64): RID
        
        /** Returns the position of the contact point on the collider in the global coordinate system. */
        get_contact_collider_position(contact_idx: int64): Vector2
        
        /** Returns the collider's object id. */
        get_contact_collider_id(contact_idx: int64): int64
        
        /** Returns the collider object. This depends on how it was created (will return a scene node if such was used to create it). */
        get_contact_collider_object(contact_idx: int64): Object
        
        /** Returns the collider's shape index. */
        get_contact_collider_shape(contact_idx: int64): int64
        
        /** Returns the velocity vector at the collider's contact point. */
        get_contact_collider_velocity_at_position(contact_idx: int64): Vector2
        
        /** Returns the impulse created by the contact. */
        get_contact_impulse(contact_idx: int64): Vector2
        
        /** Updates the body's linear and angular velocity by applying gravity and damping for the equivalent of one physics tick. */
        integrate_forces(): void
        
        /** Returns the current state of the space, useful for queries. */
        get_space_state(): PhysicsDirectSpaceState2D
        
        /** The timestep (delta) used for the simulation. */
        get step(): float64
        
        /** The inverse of the mass of the body. */
        get inverse_mass(): float64
        
        /** The inverse of the inertia of the body. */
        get inverse_inertia(): float64
        
        /** The rate at which the body stops rotating, if there are not any other forces moving it. */
        get total_angular_damp(): float64
        
        /** The rate at which the body stops moving, if there are not any other forces moving it. */
        get total_linear_damp(): float64
        
        /** The total gravity vector being currently applied to this body. */
        get total_gravity(): Vector2
        
        /** The body's center of mass position relative to the body's center in the global coordinate system. */
        get center_of_mass(): Vector2
        
        /** The body's center of mass position in the body's local coordinate system. */
        get center_of_mass_local(): Vector2
        
        /** The body's rotational velocity in  *radians*  per second. */
        get angular_velocity(): float64
        set angular_velocity(value: float64)
        
        /** The body's linear velocity in pixels per second. */
        get linear_velocity(): Vector2
        set linear_velocity(value: Vector2)
        
        /** If `true`, this body is currently sleeping (not active). */
        get sleeping(): boolean
        set sleeping(value: boolean)
        
        /** The body's transformation matrix. */
        get transform(): Transform2D
        set transform(value: Transform2D)
    }
    /** Provides virtual methods that can be overridden to create custom [PhysicsDirectBodyState2D] implementations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsdirectbodystate2dextension.html  
     */
    class PhysicsDirectBodyState2DExtension extends PhysicsDirectBodyState2D {
        constructor(identifier?: any)
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.total_gravity] and its respective getter. */
        /* gdvirtual */ _get_total_gravity(): Vector2
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.total_linear_damp] and its respective getter. */
        /* gdvirtual */ _get_total_linear_damp(): float64
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.total_angular_damp] and its respective getter. */
        /* gdvirtual */ _get_total_angular_damp(): float64
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.center_of_mass] and its respective getter. */
        /* gdvirtual */ _get_center_of_mass(): Vector2
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.center_of_mass_local] and its respective getter. */
        /* gdvirtual */ _get_center_of_mass_local(): Vector2
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.inverse_mass] and its respective getter. */
        /* gdvirtual */ _get_inverse_mass(): float64
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.inverse_inertia] and its respective getter. */
        /* gdvirtual */ _get_inverse_inertia(): float64
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.linear_velocity] and its respective setter. */
        /* gdvirtual */ _set_linear_velocity(velocity: Vector2): void
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.linear_velocity] and its respective getter. */
        /* gdvirtual */ _get_linear_velocity(): Vector2
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.angular_velocity] and its respective setter. */
        /* gdvirtual */ _set_angular_velocity(velocity: float64): void
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.angular_velocity] and its respective getter. */
        /* gdvirtual */ _get_angular_velocity(): float64
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.transform] and its respective setter. */
        /* gdvirtual */ _set_transform(transform: Transform2D): void
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.transform] and its respective getter. */
        /* gdvirtual */ _get_transform(): Transform2D
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_velocity_at_local_position]. */
        /* gdvirtual */ _get_velocity_at_local_position(local_position: Vector2): Vector2
        
        /** Overridable version of [method PhysicsDirectBodyState2D.apply_central_impulse]. */
        /* gdvirtual */ _apply_central_impulse(impulse: Vector2): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.apply_impulse]. */
        /* gdvirtual */ _apply_impulse(impulse: Vector2, position: Vector2): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.apply_torque_impulse]. */
        /* gdvirtual */ _apply_torque_impulse(impulse: float64): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.apply_central_force]. */
        /* gdvirtual */ _apply_central_force(force: Vector2): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.apply_force]. */
        /* gdvirtual */ _apply_force(force: Vector2, position: Vector2): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.apply_torque]. */
        /* gdvirtual */ _apply_torque(torque: float64): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.add_constant_central_force]. */
        /* gdvirtual */ _add_constant_central_force(force: Vector2): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.add_constant_force]. */
        /* gdvirtual */ _add_constant_force(force: Vector2, position: Vector2): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.add_constant_torque]. */
        /* gdvirtual */ _add_constant_torque(torque: float64): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.set_constant_force]. */
        /* gdvirtual */ _set_constant_force(force: Vector2): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_constant_force]. */
        /* gdvirtual */ _get_constant_force(): Vector2
        
        /** Overridable version of [method PhysicsDirectBodyState2D.set_constant_torque]. */
        /* gdvirtual */ _set_constant_torque(torque: float64): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_constant_torque]. */
        /* gdvirtual */ _get_constant_torque(): float64
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.sleeping] and its respective setter. */
        /* gdvirtual */ _set_sleep_state(enabled: boolean): void
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.sleeping] and its respective getter. */
        /* gdvirtual */ _is_sleeping(): boolean
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_count]. */
        /* gdvirtual */ _get_contact_count(): int64
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_local_position]. */
        /* gdvirtual */ _get_contact_local_position(contact_idx: int64): Vector2
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_local_normal]. */
        /* gdvirtual */ _get_contact_local_normal(contact_idx: int64): Vector2
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_local_shape]. */
        /* gdvirtual */ _get_contact_local_shape(contact_idx: int64): int64
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_local_velocity_at_position]. */
        /* gdvirtual */ _get_contact_local_velocity_at_position(contact_idx: int64): Vector2
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_collider]. */
        /* gdvirtual */ _get_contact_collider(contact_idx: int64): RID
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_collider_position]. */
        /* gdvirtual */ _get_contact_collider_position(contact_idx: int64): Vector2
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_collider_id]. */
        /* gdvirtual */ _get_contact_collider_id(contact_idx: int64): int64
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_collider_object]. */
        /* gdvirtual */ _get_contact_collider_object(contact_idx: int64): Object
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_collider_shape]. */
        /* gdvirtual */ _get_contact_collider_shape(contact_idx: int64): int64
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_collider_velocity_at_position]. */
        /* gdvirtual */ _get_contact_collider_velocity_at_position(contact_idx: int64): Vector2
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_contact_impulse]. */
        /* gdvirtual */ _get_contact_impulse(contact_idx: int64): Vector2
        
        /** Implement to override the behavior of [member PhysicsDirectBodyState2D.step] and its respective getter. */
        /* gdvirtual */ _get_step(): float64
        
        /** Overridable version of [method PhysicsDirectBodyState2D.integrate_forces]. */
        /* gdvirtual */ _integrate_forces(): void
        
        /** Overridable version of [method PhysicsDirectBodyState2D.get_space_state]. */
        /* gdvirtual */ _get_space_state(): PhysicsDirectSpaceState2D
    }
    /** Provides direct access to a physics body in the [PhysicsServer3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsdirectbodystate3d.html  
     */
    class PhysicsDirectBodyState3D extends Object {
        constructor(identifier?: any)
        /** Returns the body's velocity at the given relative position, including both translation and rotation. */
        get_velocity_at_local_position(local_position: Vector3): Vector3
        
        /** Applies a directional impulse without affecting rotation.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  This is equivalent to using [method apply_impulse] at the body's center of mass.  
         */
        apply_central_impulse(impulse: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Applies a positioned impulse to the body.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        apply_impulse(impulse: Vector3, position: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Applies a rotational impulse to the body without affecting the position.  
         *  An impulse is time-independent! Applying an impulse every frame would result in a framerate-dependent force. For this reason, it should only be used when simulating one-time impacts (use the "_force" functions otherwise).  
         *      
         *  **Note:** [member inverse_inertia] is required for this to work. To have [member inverse_inertia], an active [CollisionShape3D] must be a child of the node, or you can manually set [member inverse_inertia].  
         */
        apply_torque_impulse(impulse: Vector3): void
        
        /** Applies a directional force without affecting rotation. A force is time dependent and meant to be applied every physics update.  
         *  This is equivalent to using [method apply_force] at the body's center of mass.  
         */
        apply_central_force(force: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Applies a positioned force to the body. A force is time dependent and meant to be applied every physics update.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        apply_force(force: Vector3, position: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Applies a rotational force without affecting position. A force is time dependent and meant to be applied every physics update.  
         *      
         *  **Note:** [member inverse_inertia] is required for this to work. To have [member inverse_inertia], an active [CollisionShape3D] must be a child of the node, or you can manually set [member inverse_inertia].  
         */
        apply_torque(torque: Vector3): void
        
        /** Adds a constant directional force without affecting rotation that keeps being applied over time until cleared with `constant_force = Vector3(0, 0, 0)`.  
         *  This is equivalent to using [method add_constant_force] at the body's center of mass.  
         */
        add_constant_central_force(force: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Adds a constant positioned force to the body that keeps being applied over time until cleared with `constant_force = Vector3(0, 0, 0)`.  
         *  [param position] is the offset from the body origin in global coordinates.  
         */
        add_constant_force(force: Vector3, position: Vector3 = new Vector3(0, 0, 0)): void
        
        /** Adds a constant rotational force without affecting position that keeps being applied over time until cleared with `constant_torque = Vector3(0, 0, 0)`. */
        add_constant_torque(torque: Vector3): void
        
        /** Sets the body's total constant positional forces applied during each physics update.  
         *  See [method add_constant_force] and [method add_constant_central_force].  
         */
        set_constant_force(force: Vector3): void
        
        /** Returns the body's total constant positional forces applied during each physics update.  
         *  See [method add_constant_force] and [method add_constant_central_force].  
         */
        get_constant_force(): Vector3
        
        /** Sets the body's total constant rotational forces applied during each physics update.  
         *  See [method add_constant_torque].  
         */
        set_constant_torque(torque: Vector3): void
        
        /** Returns the body's total constant rotational forces applied during each physics update.  
         *  See [method add_constant_torque].  
         */
        get_constant_torque(): Vector3
        
        /** Returns the number of contacts this body has with other bodies.  
         *      
         *  **Note:** By default, this returns 0 unless bodies are configured to monitor contacts. See [member RigidBody3D.contact_monitor].  
         */
        get_contact_count(): int64
        
        /** Returns the position of the contact point on the body in the global coordinate system. */
        get_contact_local_position(contact_idx: int64): Vector3
        
        /** Returns the local normal at the contact point. */
        get_contact_local_normal(contact_idx: int64): Vector3
        
        /** Impulse created by the contact. */
        get_contact_impulse(contact_idx: int64): Vector3
        
        /** Returns the local shape index of the collision. */
        get_contact_local_shape(contact_idx: int64): int64
        
        /** Returns the linear velocity vector at the body's contact point. */
        get_contact_local_velocity_at_position(contact_idx: int64): Vector3
        
        /** Returns the collider's [RID]. */
        get_contact_collider(contact_idx: int64): RID
        
        /** Returns the position of the contact point on the collider in the global coordinate system. */
        get_contact_collider_position(contact_idx: int64): Vector3
        
        /** Returns the collider's object id. */
        get_contact_collider_id(contact_idx: int64): int64
        
        /** Returns the collider object. */
        get_contact_collider_object(contact_idx: int64): Object
        
        /** Returns the collider's shape index. */
        get_contact_collider_shape(contact_idx: int64): int64
        
        /** Returns the linear velocity vector at the collider's contact point. */
        get_contact_collider_velocity_at_position(contact_idx: int64): Vector3
        
        /** Updates the body's linear and angular velocity by applying gravity and damping for the equivalent of one physics tick. */
        integrate_forces(): void
        
        /** Returns the current state of the space, useful for queries. */
        get_space_state(): PhysicsDirectSpaceState3D
        
        /** The timestep (delta) used for the simulation. */
        get step(): float64
        
        /** The inverse of the mass of the body. */
        get inverse_mass(): float64
        
        /** The rate at which the body stops rotating, if there are not any other forces moving it. */
        get total_angular_damp(): float64
        
        /** The rate at which the body stops moving, if there are not any other forces moving it. */
        get total_linear_damp(): float64
        
        /** The inverse of the inertia of the body. */
        get inverse_inertia(): Vector3
        
        /** The inverse of the inertia tensor of the body. */
        get inverse_inertia_tensor(): Basis
        
        /** The total gravity vector being currently applied to this body. */
        get total_gravity(): Vector3
        
        /** The body's center of mass position relative to the body's center in the global coordinate system. */
        get center_of_mass(): Vector3
        
        /** The body's center of mass position in the body's local coordinate system. */
        get center_of_mass_local(): Vector3
        get principal_inertia_axes(): Basis
        
        /** The body's rotational velocity in  *radians*  per second. */
        get angular_velocity(): Vector3
        set angular_velocity(value: Vector3)
        
        /** The body's linear velocity in units per second. */
        get linear_velocity(): Vector3
        set linear_velocity(value: Vector3)
        
        /** If `true`, this body is currently sleeping (not active). */
        get sleeping(): boolean
        set sleeping(value: boolean)
        
        /** The body's transformation matrix. */
        get transform(): Transform3D
        set transform(value: Transform3D)
    }
    /** Provides virtual methods that can be overridden to create custom [PhysicsDirectBodyState3D] implementations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsdirectbodystate3dextension.html  
     */
    class PhysicsDirectBodyState3DExtension extends PhysicsDirectBodyState3D {
        constructor(identifier?: any)
        /* gdvirtual */ _get_total_gravity(): Vector3
        /* gdvirtual */ _get_total_linear_damp(): float64
        /* gdvirtual */ _get_total_angular_damp(): float64
        /* gdvirtual */ _get_center_of_mass(): Vector3
        /* gdvirtual */ _get_center_of_mass_local(): Vector3
        /* gdvirtual */ _get_principal_inertia_axes(): Basis
        /* gdvirtual */ _get_inverse_mass(): float64
        /* gdvirtual */ _get_inverse_inertia(): Vector3
        /* gdvirtual */ _get_inverse_inertia_tensor(): Basis
        /* gdvirtual */ _set_linear_velocity(velocity: Vector3): void
        /* gdvirtual */ _get_linear_velocity(): Vector3
        /* gdvirtual */ _set_angular_velocity(velocity: Vector3): void
        /* gdvirtual */ _get_angular_velocity(): Vector3
        /* gdvirtual */ _set_transform(transform: Transform3D): void
        /* gdvirtual */ _get_transform(): Transform3D
        /* gdvirtual */ _get_velocity_at_local_position(local_position: Vector3): Vector3
        /* gdvirtual */ _apply_central_impulse(impulse: Vector3): void
        /* gdvirtual */ _apply_impulse(impulse: Vector3, position: Vector3): void
        /* gdvirtual */ _apply_torque_impulse(impulse: Vector3): void
        /* gdvirtual */ _apply_central_force(force: Vector3): void
        /* gdvirtual */ _apply_force(force: Vector3, position: Vector3): void
        /* gdvirtual */ _apply_torque(torque: Vector3): void
        /* gdvirtual */ _add_constant_central_force(force: Vector3): void
        /* gdvirtual */ _add_constant_force(force: Vector3, position: Vector3): void
        /* gdvirtual */ _add_constant_torque(torque: Vector3): void
        /* gdvirtual */ _set_constant_force(force: Vector3): void
        /* gdvirtual */ _get_constant_force(): Vector3
        /* gdvirtual */ _set_constant_torque(torque: Vector3): void
        /* gdvirtual */ _get_constant_torque(): Vector3
        /* gdvirtual */ _set_sleep_state(enabled: boolean): void
        /* gdvirtual */ _is_sleeping(): boolean
        /* gdvirtual */ _get_contact_count(): int64
        /* gdvirtual */ _get_contact_local_position(contact_idx: int64): Vector3
        /* gdvirtual */ _get_contact_local_normal(contact_idx: int64): Vector3
        /* gdvirtual */ _get_contact_impulse(contact_idx: int64): Vector3
        /* gdvirtual */ _get_contact_local_shape(contact_idx: int64): int64
        /* gdvirtual */ _get_contact_local_velocity_at_position(contact_idx: int64): Vector3
        /* gdvirtual */ _get_contact_collider(contact_idx: int64): RID
        /* gdvirtual */ _get_contact_collider_position(contact_idx: int64): Vector3
        /* gdvirtual */ _get_contact_collider_id(contact_idx: int64): int64
        /* gdvirtual */ _get_contact_collider_object(contact_idx: int64): Object
        /* gdvirtual */ _get_contact_collider_shape(contact_idx: int64): int64
        /* gdvirtual */ _get_contact_collider_velocity_at_position(contact_idx: int64): Vector3
        /* gdvirtual */ _get_step(): float64
        /* gdvirtual */ _integrate_forces(): void
        /* gdvirtual */ _get_space_state(): PhysicsDirectSpaceState3D
    }
    /** Provides direct access to a physics space in the [PhysicsServer2D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsdirectspacestate2d.html  
     */
    class PhysicsDirectSpaceState2D extends Object {
        constructor(identifier?: any)
        /** Checks whether a point is inside any solid shape. Position and other parameters are defined through [PhysicsPointQueryParameters2D]. The shapes the point is inside of are returned in an array containing dictionaries with the following fields:  
         *  `collider`: The colliding object.  
         *  `collider_id`: The colliding object's ID.  
         *  `rid`: The intersecting object's [RID].  
         *  `shape`: The shape index of the colliding shape.  
         *  The number of intersections can be limited with the [param max_results] parameter, to reduce the processing time.  
         *      
         *  **Note:** [ConcavePolygonShape2D]s and [CollisionPolygon2D]s in `Segments` build mode are not solid shapes. Therefore, they will not be detected.  
         */
        intersect_point(parameters: PhysicsPointQueryParameters2D, max_results: int64 = 32): GArray
        
        /** Intersects a ray in a given space. Ray position and other parameters are defined through [PhysicsRayQueryParameters2D]. The returned object is a dictionary with the following fields:  
         *  `collider`: The colliding object.  
         *  `collider_id`: The colliding object's ID.  
         *  `normal`: The object's surface normal at the intersection point, or `Vector2(0, 0)` if the ray starts inside the shape and [member PhysicsRayQueryParameters2D.hit_from_inside] is `true`.  
         *  `position`: The intersection point.  
         *  `rid`: The intersecting object's [RID].  
         *  `shape`: The shape index of the colliding shape.  
         *  If the ray did not intersect anything, then an empty dictionary is returned instead.  
         */
        intersect_ray(parameters: PhysicsRayQueryParameters2D): GDictionary
        
        /** Checks the intersections of a shape, given through a [PhysicsShapeQueryParameters2D] object, against the space. The intersected shapes are returned in an array containing dictionaries with the following fields:  
         *  `collider`: The colliding object.  
         *  `collider_id`: The colliding object's ID.  
         *  `rid`: The intersecting object's [RID].  
         *  `shape`: The shape index of the colliding shape.  
         *  The number of intersections can be limited with the [param max_results] parameter, to reduce the processing time.  
         */
        intersect_shape(parameters: PhysicsShapeQueryParameters2D, max_results: int64 = 32): GArray
        
        /** Checks how far a [Shape2D] can move without colliding. All the parameters for the query, including the shape and the motion, are supplied through a [PhysicsShapeQueryParameters2D] object.  
         *  Returns an array with the safe and unsafe proportions (between 0 and 1) of the motion. The safe proportion is the maximum fraction of the motion that can be made without a collision. The unsafe proportion is the minimum fraction of the distance that must be moved for a collision. If no collision is detected a result of `[1.0, 1.0]` will be returned.  
         *      
         *  **Note:** Any [Shape2D]s that the shape is already colliding with e.g. inside of, will be ignored. Use [method collide_shape] to determine the [Shape2D]s that the shape is already colliding with.  
         */
        cast_motion(parameters: PhysicsShapeQueryParameters2D): PackedFloat32Array
        
        /** Checks the intersections of a shape, given through a [PhysicsShapeQueryParameters2D] object, against the space. The resulting array contains a list of points where the shape intersects another. Like with [method intersect_shape], the number of returned results can be limited to save processing time.  
         *  Returned points are a list of pairs of contact points. For each pair the first one is in the shape passed in [PhysicsShapeQueryParameters2D] object, second one is in the collided shape from the physics space.  
         */
        collide_shape(parameters: PhysicsShapeQueryParameters2D, max_results: int64 = 32): GArray
        
        /** Checks the intersections of a shape, given through a [PhysicsShapeQueryParameters2D] object, against the space. If it collides with more than one shape, the nearest one is selected. If the shape did not intersect anything, then an empty dictionary is returned instead.  
         *      
         *  **Note:** This method does not take into account the `motion` property of the object. The returned object is a dictionary containing the following fields:  
         *  `collider_id`: The colliding object's ID.  
         *  `linear_velocity`: The colliding object's velocity [Vector2]. If the object is an [Area2D], the result is `(0, 0)`.  
         *  `normal`: The collision normal of the query shape at the intersection point, pointing away from the intersecting object.  
         *  `point`: The intersection point.  
         *  `rid`: The intersecting object's [RID].  
         *  `shape`: The shape index of the colliding shape.  
         */
        get_rest_info(parameters: PhysicsShapeQueryParameters2D): GDictionary
    }
    /** Provides virtual methods that can be overridden to create custom [PhysicsDirectSpaceState2D] implementations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsdirectspacestate2dextension.html  
     */
    class PhysicsDirectSpaceState2DExtension extends PhysicsDirectSpaceState2D {
        constructor(identifier?: any)
        /* gdvirtual */ _intersect_ray(from: Vector2, to: Vector2, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, hit_from_inside: boolean, result: int64): boolean
        /* gdvirtual */ _intersect_point(position: Vector2, canvas_instance_id: int64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, results: int64, max_results: int64): int64
        /* gdvirtual */ _intersect_shape(shape_rid: RID, transform: Transform2D, motion: Vector2, margin: float64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, result: int64, max_results: int64): int64
        /* gdvirtual */ _cast_motion(shape_rid: RID, transform: Transform2D, motion: Vector2, margin: float64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, closest_safe: int64, closest_unsafe: int64): boolean
        /* gdvirtual */ _collide_shape(shape_rid: RID, transform: Transform2D, motion: Vector2, margin: float64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, results: int64, max_results: int64, result_count: int64): boolean
        /* gdvirtual */ _rest_info(shape_rid: RID, transform: Transform2D, motion: Vector2, margin: float64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, rest_info: int64): boolean
        is_body_excluded_from_query(body: RID): boolean
    }
    /** Provides direct access to a physics space in the [PhysicsServer3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsdirectspacestate3d.html  
     */
    class PhysicsDirectSpaceState3D extends Object {
        constructor(identifier?: any)
        /** Checks whether a point is inside any solid shape. Position and other parameters are defined through [PhysicsPointQueryParameters3D]. The shapes the point is inside of are returned in an array containing dictionaries with the following fields:  
         *  `collider`: The colliding object.  
         *  `collider_id`: The colliding object's ID.  
         *  `rid`: The intersecting object's [RID].  
         *  `shape`: The shape index of the colliding shape.  
         *  The number of intersections can be limited with the [param max_results] parameter, to reduce the processing time.  
         */
        intersect_point(parameters: PhysicsPointQueryParameters3D, max_results: int64 = 32): GArray
        
        /** Intersects a ray in a given space. Ray position and other parameters are defined through [PhysicsRayQueryParameters3D]. The returned object is a dictionary with the following fields:  
         *  `collider`: The colliding object.  
         *  `collider_id`: The colliding object's ID.  
         *  `normal`: The object's surface normal at the intersection point, or `Vector3(0, 0, 0)` if the ray starts inside the shape and [member PhysicsRayQueryParameters3D.hit_from_inside] is `true`.  
         *  `position`: The intersection point.  
         *  `face_index`: The face index at the intersection point.  
         *      
         *  **Note:** Returns a valid number only if the intersected shape is a [ConcavePolygonShape3D]. Otherwise, `-1` is returned.  
         *  `rid`: The intersecting object's [RID].  
         *  `shape`: The shape index of the colliding shape.  
         *  If the ray did not intersect anything, then an empty dictionary is returned instead.  
         */
        intersect_ray(parameters: PhysicsRayQueryParameters3D): GDictionary
        
        /** Checks the intersections of a shape, given through a [PhysicsShapeQueryParameters3D] object, against the space. The intersected shapes are returned in an array containing dictionaries with the following fields:  
         *  `collider`: The colliding object.  
         *  `collider_id`: The colliding object's ID.  
         *  `rid`: The intersecting object's [RID].  
         *  `shape`: The shape index of the colliding shape.  
         *  The number of intersections can be limited with the [param max_results] parameter, to reduce the processing time.  
         *      
         *  **Note:** This method does not take into account the `motion` property of the object.  
         */
        intersect_shape(parameters: PhysicsShapeQueryParameters3D, max_results: int64 = 32): GArray
        
        /** Checks how far a [Shape3D] can move without colliding. All the parameters for the query, including the shape, are supplied through a [PhysicsShapeQueryParameters3D] object.  
         *  Returns an array with the safe and unsafe proportions (between 0 and 1) of the motion. The safe proportion is the maximum fraction of the motion that can be made without a collision. The unsafe proportion is the minimum fraction of the distance that must be moved for a collision. If no collision is detected a result of `[1.0, 1.0]` will be returned.  
         *      
         *  **Note:** Any [Shape3D]s that the shape is already colliding with e.g. inside of, will be ignored. Use [method collide_shape] to determine the [Shape3D]s that the shape is already colliding with.  
         */
        cast_motion(parameters: PhysicsShapeQueryParameters3D): PackedFloat32Array
        
        /** Checks the intersections of a shape, given through a [PhysicsShapeQueryParameters3D] object, against the space. The resulting array contains a list of points where the shape intersects another. Like with [method intersect_shape], the number of returned results can be limited to save processing time.  
         *  Returned points are a list of pairs of contact points. For each pair the first one is in the shape passed in [PhysicsShapeQueryParameters3D] object, second one is in the collided shape from the physics space.  
         *      
         *  **Note:** This method does not take into account the `motion` property of the object.  
         */
        collide_shape(parameters: PhysicsShapeQueryParameters3D, max_results: int64 = 32): GArray
        
        /** Checks the intersections of a shape, given through a [PhysicsShapeQueryParameters3D] object, against the space. If it collides with more than one shape, the nearest one is selected. The returned object is a dictionary containing the following fields:  
         *  `collider_id`: The colliding object's ID.  
         *  `linear_velocity`: The colliding object's velocity [Vector3]. If the object is an [Area3D], the result is `(0, 0, 0)`.  
         *  `normal`: The collision normal of the query shape at the intersection point, pointing away from the intersecting object.  
         *  `point`: The intersection point.  
         *  `rid`: The intersecting object's [RID].  
         *  `shape`: The shape index of the colliding shape.  
         *  If the shape did not intersect anything, then an empty dictionary is returned instead.  
         *      
         *  **Note:** This method does not take into account the `motion` property of the object.  
         */
        get_rest_info(parameters: PhysicsShapeQueryParameters3D): GDictionary
    }
    /** Provides virtual methods that can be overridden to create custom [PhysicsDirectSpaceState3D] implementations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsdirectspacestate3dextension.html  
     */
    class PhysicsDirectSpaceState3DExtension extends PhysicsDirectSpaceState3D {
        constructor(identifier?: any)
        /* gdvirtual */ _intersect_ray(from: Vector3, to: Vector3, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, hit_from_inside: boolean, hit_back_faces: boolean, pick_ray: boolean, result: int64): boolean
        /* gdvirtual */ _intersect_point(position: Vector3, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, results: int64, max_results: int64): int64
        /* gdvirtual */ _intersect_shape(shape_rid: RID, transform: Transform3D, motion: Vector3, margin: float64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, result_count: int64, max_results: int64): int64
        /* gdvirtual */ _cast_motion(shape_rid: RID, transform: Transform3D, motion: Vector3, margin: float64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, closest_safe: int64, closest_unsafe: int64, info: int64): boolean
        /* gdvirtual */ _collide_shape(shape_rid: RID, transform: Transform3D, motion: Vector3, margin: float64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, results: int64, max_results: int64, result_count: int64): boolean
        /* gdvirtual */ _rest_info(shape_rid: RID, transform: Transform3D, motion: Vector3, margin: float64, collision_mask: int64, collide_with_bodies: boolean, collide_with_areas: boolean, rest_info: int64): boolean
        /* gdvirtual */ _get_closest_point_to_object_volume(object: RID, point: Vector3): Vector3
        is_body_excluded_from_query(body: RID): boolean
    }
    /** Holds physics-related properties of a surface, namely its roughness and bounciness.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsmaterial.html  
     */
    class PhysicsMaterial extends Resource {
        constructor(identifier?: any)
        /** The body's friction. Values range from `0` (frictionless) to `1` (maximum friction). */
        get friction(): float64
        set friction(value: float64)
        
        /** If `true`, the physics engine will use the friction of the object marked as "rough" when two objects collide. If `false`, the physics engine will use the lowest friction of all colliding objects instead. If `true` for both colliding objects, the physics engine will use the highest friction. */
        get rough(): boolean
        set rough(value: boolean)
        
        /** The body's bounciness. Values range from `0` (no bounce) to `1` (full bounciness).  
         *      
         *  **Note:** Even with [member bounce] set to `1.0`, some energy will be lost over time due to linear and angular damping. To have a physics body that preserves all its energy over time, set [member bounce] to `1.0`, the body's linear damp mode to **Replace** (if applicable), its linear damp to `0.0`, its angular damp mode to **Replace** (if applicable), and its angular damp to `0.0`.  
         */
        get bounce(): float64
        set bounce(value: float64)
        
        /** If `true`, subtracts the bounciness from the colliding object's bounciness instead of adding it. */
        get absorbent(): boolean
        set absorbent(value: boolean)
    }
    /** Provides parameters for [method PhysicsDirectSpaceState2D.intersect_point].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicspointqueryparameters2d.html  
     */
    class PhysicsPointQueryParameters2D extends RefCounted {
        constructor(identifier?: any)
        /** The position being queried for, in global coordinates. */
        get position(): Vector2
        set position(value: Vector2)
        
        /** If different from `0`, restricts the query to a specific canvas layer specified by its instance ID. See [method Object.get_instance_id].  
         *  If `0`, restricts the query to the Viewport's default canvas layer.  
         */
        get canvas_instance_id(): int64
        set canvas_instance_id(value: int64)
        
        /** The physics layers the query will detect (as a bitmask). By default, all collision layers are detected. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The list of object [RID]s that will be excluded from collisions. Use [method CollisionObject2D.get_rid] to get the [RID] associated with a [CollisionObject2D]-derived node.  
         *      
         *  **Note:** The returned array is copied and any changes to it will not update the original property value. To update the value you need to modify the returned array, and then assign it to the property again.  
         */
        get exclude(): GArray
        set exclude(value: GArray)
        
        /** If `true`, the query will take [PhysicsBody2D]s into account. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        
        /** If `true`, the query will take [Area2D]s into account. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
    }
    /** Provides parameters for [method PhysicsDirectSpaceState3D.intersect_point].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicspointqueryparameters3d.html  
     */
    class PhysicsPointQueryParameters3D extends RefCounted {
        constructor(identifier?: any)
        /** The position being queried for, in global coordinates. */
        get position(): Vector3
        set position(value: Vector3)
        
        /** The physics layers the query will detect (as a bitmask). By default, all collision layers are detected. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The list of object [RID]s that will be excluded from collisions. Use [method CollisionObject3D.get_rid] to get the [RID] associated with a [CollisionObject3D]-derived node.  
         *      
         *  **Note:** The returned array is copied and any changes to it will not update the original property value. To update the value you need to modify the returned array, and then assign it to the property again.  
         */
        get exclude(): GArray
        set exclude(value: GArray)
        
        /** If `true`, the query will take [PhysicsBody3D]s into account. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        
        /** If `true`, the query will take [Area3D]s into account. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
    }
    /** Provides parameters for [method PhysicsDirectSpaceState2D.intersect_ray].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsrayqueryparameters2d.html  
     */
    class PhysicsRayQueryParameters2D extends RefCounted {
        constructor(identifier?: any)
        /** Returns a new, pre-configured [PhysicsRayQueryParameters2D] object. Use it to quickly create query parameters using the most common options.  
         *    
         */
        static create(from: Vector2, to: Vector2, collision_mask: int64 = 4294967295, exclude: GArray = []): PhysicsRayQueryParameters2D
        
        /** The starting point of the ray being queried for, in global coordinates. */
        get from(): Vector2
        set from(value: Vector2)
        
        /** The ending point of the ray being queried for, in global coordinates. */
        get to(): Vector2
        set to(value: Vector2)
        
        /** The physics layers the query will detect (as a bitmask). By default, all collision layers are detected. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The list of object [RID]s that will be excluded from collisions. Use [method CollisionObject2D.get_rid] to get the [RID] associated with a [CollisionObject2D]-derived node.  
         *      
         *  **Note:** The returned array is copied and any changes to it will not update the original property value. To update the value you need to modify the returned array, and then assign it to the property again.  
         */
        get exclude(): GArray
        set exclude(value: GArray)
        
        /** If `true`, the query will take [PhysicsBody2D]s into account. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        
        /** If `true`, the query will take [Area2D]s into account. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
        
        /** If `true`, the query will detect a hit when starting inside shapes. In this case the collision normal will be `Vector2(0, 0)`. Does not affect concave polygon shapes. */
        get hit_from_inside(): boolean
        set hit_from_inside(value: boolean)
    }
    /** Provides parameters for [method PhysicsDirectSpaceState3D.intersect_ray].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsrayqueryparameters3d.html  
     */
    class PhysicsRayQueryParameters3D extends RefCounted {
        constructor(identifier?: any)
        /** Returns a new, pre-configured [PhysicsRayQueryParameters3D] object. Use it to quickly create query parameters using the most common options.  
         *    
         */
        static create(from: Vector3, to: Vector3, collision_mask: int64 = 4294967295, exclude: GArray = []): PhysicsRayQueryParameters3D
        
        /** The starting point of the ray being queried for, in global coordinates. */
        get from(): Vector3
        set from(value: Vector3)
        
        /** The ending point of the ray being queried for, in global coordinates. */
        get to(): Vector3
        set to(value: Vector3)
        
        /** The physics layers the query will detect (as a bitmask). By default, all collision layers are detected. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The list of object [RID]s that will be excluded from collisions. Use [method CollisionObject3D.get_rid] to get the [RID] associated with a [CollisionObject3D]-derived node.  
         *      
         *  **Note:** The returned array is copied and any changes to it will not update the original property value. To update the value you need to modify the returned array, and then assign it to the property again.  
         */
        get exclude(): GArray
        set exclude(value: GArray)
        
        /** If `true`, the query will take [PhysicsBody3D]s into account. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        
        /** If `true`, the query will take [Area3D]s into account. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
        
        /** If `true`, the query will detect a hit when starting inside shapes. In this case the collision normal will be `Vector3(0, 0, 0)`. Does not affect concave polygon shapes or heightmap shapes. */
        get hit_from_inside(): boolean
        set hit_from_inside(value: boolean)
        
        /** If `true`, the query will hit back faces with concave polygon shapes with back face enabled or heightmap shapes. */
        get hit_back_faces(): boolean
        set hit_back_faces(value: boolean)
    }
    /** Provides virtual methods that can be overridden to create custom [PhysicsServer2D] implementations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsserver2dextension.html  
     */
    class PhysicsServer2DExtension extends PhysicsServer2D {
        constructor(identifier?: any)
        /** Overridable version of [method PhysicsServer2D.world_boundary_shape_create]. */
        /* gdvirtual */ _world_boundary_shape_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.separation_ray_shape_create]. */
        /* gdvirtual */ _separation_ray_shape_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.segment_shape_create]. */
        /* gdvirtual */ _segment_shape_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.circle_shape_create]. */
        /* gdvirtual */ _circle_shape_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.rectangle_shape_create]. */
        /* gdvirtual */ _rectangle_shape_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.capsule_shape_create]. */
        /* gdvirtual */ _capsule_shape_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.convex_polygon_shape_create]. */
        /* gdvirtual */ _convex_polygon_shape_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.concave_polygon_shape_create]. */
        /* gdvirtual */ _concave_polygon_shape_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.shape_set_data]. */
        /* gdvirtual */ _shape_set_data(shape: RID, data: any): void
        
        /** Should set the custom solver bias for the given [param shape]. It defines how much bodies are forced to separate on contact.  
         *  Overridable version of [PhysicsServer2D]'s internal `shape_get_custom_solver_bias` method. Corresponds to [member Shape2D.custom_solver_bias].  
         */
        /* gdvirtual */ _shape_set_custom_solver_bias(shape: RID, bias: float64): void
        
        /** Overridable version of [method PhysicsServer2D.shape_get_type]. */
        /* gdvirtual */ _shape_get_type(shape: RID): PhysicsServer2D.ShapeType
        
        /** Overridable version of [method PhysicsServer2D.shape_get_data]. */
        /* gdvirtual */ _shape_get_data(shape: RID): any
        
        /** Should return the custom solver bias of the given [param shape], which defines how much bodies are forced to separate on contact when this shape is involved.  
         *  Overridable version of [PhysicsServer2D]'s internal `shape_get_custom_solver_bias` method. Corresponds to [member Shape2D.custom_solver_bias].  
         */
        /* gdvirtual */ _shape_get_custom_solver_bias(shape: RID): float64
        
        /** Given two shapes and their parameters, should return `true` if a collision between the two would occur, with additional details passed in [param results].  
         *  Overridable version of [PhysicsServer2D]'s internal `shape_collide` method. Corresponds to [method PhysicsDirectSpaceState2D.collide_shape].  
         */
        /* gdvirtual */ _shape_collide(shape_A: RID, xform_A: Transform2D, motion_A: Vector2, shape_B: RID, xform_B: Transform2D, motion_B: Vector2, results: int64, result_max: int64, result_count: int64): boolean
        
        /** Overridable version of [method PhysicsServer2D.space_create]. */
        /* gdvirtual */ _space_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.space_set_active]. */
        /* gdvirtual */ _space_set_active(space: RID, active: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.space_is_active]. */
        /* gdvirtual */ _space_is_active(space: RID): boolean
        
        /** Overridable version of [method PhysicsServer2D.space_set_param]. */
        /* gdvirtual */ _space_set_param(space: RID, param: PhysicsServer2D.SpaceParameter, value: float64): void
        
        /** Overridable version of [method PhysicsServer2D.space_get_param]. */
        /* gdvirtual */ _space_get_param(space: RID, param: PhysicsServer2D.SpaceParameter): float64
        
        /** Overridable version of [method PhysicsServer2D.space_get_direct_state]. */
        /* gdvirtual */ _space_get_direct_state(space: RID): PhysicsDirectSpaceState2D
        
        /** Used internally to allow the given [param space] to store contact points, up to [param max_contacts]. This is automatically set for the main [World2D]'s space when [member SceneTree.debug_collisions_hint] is `true`, or by checking "Visible Collision Shapes" in the editor. Only works in debug builds.  
         *  Overridable version of [PhysicsServer2D]'s internal `space_set_debug_contacts` method.  
         */
        /* gdvirtual */ _space_set_debug_contacts(space: RID, max_contacts: int64): void
        
        /** Should return the positions of all contacts that have occurred during the last physics step in the given [param space]. See also [method _space_get_contact_count] and [method _space_set_debug_contacts].  
         *  Overridable version of [PhysicsServer2D]'s internal `space_get_contacts` method.  
         */
        /* gdvirtual */ _space_get_contacts(space: RID): PackedVector2Array
        
        /** Should return how many contacts have occurred during the last physics step in the given [param space]. See also [method _space_get_contacts] and [method _space_set_debug_contacts].  
         *  Overridable version of [PhysicsServer2D]'s internal `space_get_contact_count` method.  
         */
        /* gdvirtual */ _space_get_contact_count(space: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.area_create]. */
        /* gdvirtual */ _area_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.area_set_space]. */
        /* gdvirtual */ _area_set_space(area: RID, space: RID): void
        
        /** Overridable version of [method PhysicsServer2D.area_get_space]. */
        /* gdvirtual */ _area_get_space(area: RID): RID
        
        /** Overridable version of [method PhysicsServer2D.area_add_shape]. */
        /* gdvirtual */ _area_add_shape(area: RID, shape: RID, transform: Transform2D, disabled: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.area_set_shape]. */
        /* gdvirtual */ _area_set_shape(area: RID, shape_idx: int64, shape: RID): void
        
        /** Overridable version of [method PhysicsServer2D.area_set_shape_transform]. */
        /* gdvirtual */ _area_set_shape_transform(area: RID, shape_idx: int64, transform: Transform2D): void
        
        /** Overridable version of [method PhysicsServer2D.area_set_shape_disabled]. */
        /* gdvirtual */ _area_set_shape_disabled(area: RID, shape_idx: int64, disabled: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.area_get_shape_count]. */
        /* gdvirtual */ _area_get_shape_count(area: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.area_get_shape]. */
        /* gdvirtual */ _area_get_shape(area: RID, shape_idx: int64): RID
        
        /** Overridable version of [method PhysicsServer2D.area_get_shape_transform]. */
        /* gdvirtual */ _area_get_shape_transform(area: RID, shape_idx: int64): Transform2D
        
        /** Overridable version of [method PhysicsServer2D.area_remove_shape]. */
        /* gdvirtual */ _area_remove_shape(area: RID, shape_idx: int64): void
        
        /** Overridable version of [method PhysicsServer2D.area_clear_shapes]. */
        /* gdvirtual */ _area_clear_shapes(area: RID): void
        
        /** Overridable version of [method PhysicsServer2D.area_attach_object_instance_id]. */
        /* gdvirtual */ _area_attach_object_instance_id(area: RID, id: int64): void
        
        /** Overridable version of [method PhysicsServer2D.area_get_object_instance_id]. */
        /* gdvirtual */ _area_get_object_instance_id(area: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.area_attach_canvas_instance_id]. */
        /* gdvirtual */ _area_attach_canvas_instance_id(area: RID, id: int64): void
        
        /** Overridable version of [method PhysicsServer2D.area_get_canvas_instance_id]. */
        /* gdvirtual */ _area_get_canvas_instance_id(area: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.area_set_param]. */
        /* gdvirtual */ _area_set_param(area: RID, param: PhysicsServer2D.AreaParameter, value: any): void
        
        /** Overridable version of [method PhysicsServer2D.area_set_transform]. */
        /* gdvirtual */ _area_set_transform(area: RID, transform: Transform2D): void
        
        /** Overridable version of [method PhysicsServer2D.area_get_param]. */
        /* gdvirtual */ _area_get_param(area: RID, param: PhysicsServer2D.AreaParameter): any
        
        /** Overridable version of [method PhysicsServer2D.area_get_transform]. */
        /* gdvirtual */ _area_get_transform(area: RID): Transform2D
        
        /** Overridable version of [method PhysicsServer2D.area_set_collision_layer]. */
        /* gdvirtual */ _area_set_collision_layer(area: RID, layer: int64): void
        
        /** Overridable version of [method PhysicsServer2D.area_get_collision_layer]. */
        /* gdvirtual */ _area_get_collision_layer(area: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.area_set_collision_mask]. */
        /* gdvirtual */ _area_set_collision_mask(area: RID, mask: int64): void
        
        /** Overridable version of [method PhysicsServer2D.area_get_collision_mask]. */
        /* gdvirtual */ _area_get_collision_mask(area: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.area_set_monitorable]. */
        /* gdvirtual */ _area_set_monitorable(area: RID, monitorable: boolean): void
        
        /** If set to `true`, allows the area with the given [RID] to detect mouse inputs when the mouse cursor is hovering on it.  
         *  Overridable version of [PhysicsServer2D]'s internal `area_set_pickable` method. Corresponds to [member CollisionObject2D.input_pickable].  
         */
        /* gdvirtual */ _area_set_pickable(area: RID, pickable: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.area_set_monitor_callback]. */
        /* gdvirtual */ _area_set_monitor_callback(area: RID, callback: Callable): void
        
        /** Overridable version of [method PhysicsServer2D.area_set_area_monitor_callback]. */
        /* gdvirtual */ _area_set_area_monitor_callback(area: RID, callback: Callable): void
        
        /** Overridable version of [method PhysicsServer2D.body_create]. */
        /* gdvirtual */ _body_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.body_set_space]. */
        /* gdvirtual */ _body_set_space(body: RID, space: RID): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_space]. */
        /* gdvirtual */ _body_get_space(body: RID): RID
        
        /** Overridable version of [method PhysicsServer2D.body_set_mode]. */
        /* gdvirtual */ _body_set_mode(body: RID, mode: PhysicsServer2D.BodyMode): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_mode]. */
        /* gdvirtual */ _body_get_mode(body: RID): PhysicsServer2D.BodyMode
        
        /** Overridable version of [method PhysicsServer2D.body_add_shape]. */
        /* gdvirtual */ _body_add_shape(body: RID, shape: RID, transform: Transform2D, disabled: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.body_set_shape]. */
        /* gdvirtual */ _body_set_shape(body: RID, shape_idx: int64, shape: RID): void
        
        /** Overridable version of [method PhysicsServer2D.body_set_shape_transform]. */
        /* gdvirtual */ _body_set_shape_transform(body: RID, shape_idx: int64, transform: Transform2D): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_shape_count]. */
        /* gdvirtual */ _body_get_shape_count(body: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.body_get_shape]. */
        /* gdvirtual */ _body_get_shape(body: RID, shape_idx: int64): RID
        
        /** Overridable version of [method PhysicsServer2D.body_get_shape_transform]. */
        /* gdvirtual */ _body_get_shape_transform(body: RID, shape_idx: int64): Transform2D
        
        /** Overridable version of [method PhysicsServer2D.body_set_shape_disabled]. */
        /* gdvirtual */ _body_set_shape_disabled(body: RID, shape_idx: int64, disabled: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.body_set_shape_as_one_way_collision]. */
        /* gdvirtual */ _body_set_shape_as_one_way_collision(body: RID, shape_idx: int64, enable: boolean, margin: float64): void
        
        /** Overridable version of [method PhysicsServer2D.body_remove_shape]. */
        /* gdvirtual */ _body_remove_shape(body: RID, shape_idx: int64): void
        
        /** Overridable version of [method PhysicsServer2D.body_clear_shapes]. */
        /* gdvirtual */ _body_clear_shapes(body: RID): void
        
        /** Overridable version of [method PhysicsServer2D.body_attach_object_instance_id]. */
        /* gdvirtual */ _body_attach_object_instance_id(body: RID, id: int64): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_object_instance_id]. */
        /* gdvirtual */ _body_get_object_instance_id(body: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.body_attach_canvas_instance_id]. */
        /* gdvirtual */ _body_attach_canvas_instance_id(body: RID, id: int64): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_canvas_instance_id]. */
        /* gdvirtual */ _body_get_canvas_instance_id(body: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.body_set_continuous_collision_detection_mode]. */
        /* gdvirtual */ _body_set_continuous_collision_detection_mode(body: RID, mode: PhysicsServer2D.CCDMode): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_continuous_collision_detection_mode]. */
        /* gdvirtual */ _body_get_continuous_collision_detection_mode(body: RID): PhysicsServer2D.CCDMode
        
        /** Overridable version of [method PhysicsServer2D.body_set_collision_layer]. */
        /* gdvirtual */ _body_set_collision_layer(body: RID, layer: int64): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_collision_layer]. */
        /* gdvirtual */ _body_get_collision_layer(body: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.body_set_collision_mask]. */
        /* gdvirtual */ _body_set_collision_mask(body: RID, mask: int64): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_collision_mask]. */
        /* gdvirtual */ _body_get_collision_mask(body: RID): int64
        
        /** Overridable version of [method PhysicsServer2D.body_set_collision_priority]. */
        /* gdvirtual */ _body_set_collision_priority(body: RID, priority: float64): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_collision_priority]. */
        /* gdvirtual */ _body_get_collision_priority(body: RID): float64
        
        /** Overridable version of [method PhysicsServer2D.body_set_param]. */
        /* gdvirtual */ _body_set_param(body: RID, param: PhysicsServer2D.BodyParameter, value: any): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_param]. */
        /* gdvirtual */ _body_get_param(body: RID, param: PhysicsServer2D.BodyParameter): any
        
        /** Overridable version of [method PhysicsServer2D.body_reset_mass_properties]. */
        /* gdvirtual */ _body_reset_mass_properties(body: RID): void
        
        /** Overridable version of [method PhysicsServer2D.body_set_state]. */
        /* gdvirtual */ _body_set_state(body: RID, state: PhysicsServer2D.BodyState, value: any): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_state]. */
        /* gdvirtual */ _body_get_state(body: RID, state: PhysicsServer2D.BodyState): any
        
        /** Overridable version of [method PhysicsServer2D.body_apply_central_impulse]. */
        /* gdvirtual */ _body_apply_central_impulse(body: RID, impulse: Vector2): void
        
        /** Overridable version of [method PhysicsServer2D.body_apply_torque_impulse]. */
        /* gdvirtual */ _body_apply_torque_impulse(body: RID, impulse: float64): void
        
        /** Overridable version of [method PhysicsServer2D.body_apply_impulse]. */
        /* gdvirtual */ _body_apply_impulse(body: RID, impulse: Vector2, position: Vector2): void
        
        /** Overridable version of [method PhysicsServer2D.body_apply_central_force]. */
        /* gdvirtual */ _body_apply_central_force(body: RID, force: Vector2): void
        
        /** Overridable version of [method PhysicsServer2D.body_apply_force]. */
        /* gdvirtual */ _body_apply_force(body: RID, force: Vector2, position: Vector2): void
        
        /** Overridable version of [method PhysicsServer2D.body_apply_torque]. */
        /* gdvirtual */ _body_apply_torque(body: RID, torque: float64): void
        
        /** Overridable version of [method PhysicsServer2D.body_add_constant_central_force]. */
        /* gdvirtual */ _body_add_constant_central_force(body: RID, force: Vector2): void
        
        /** Overridable version of [method PhysicsServer2D.body_add_constant_force]. */
        /* gdvirtual */ _body_add_constant_force(body: RID, force: Vector2, position: Vector2): void
        
        /** Overridable version of [method PhysicsServer2D.body_add_constant_torque]. */
        /* gdvirtual */ _body_add_constant_torque(body: RID, torque: float64): void
        
        /** Overridable version of [method PhysicsServer2D.body_set_constant_force]. */
        /* gdvirtual */ _body_set_constant_force(body: RID, force: Vector2): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_constant_force]. */
        /* gdvirtual */ _body_get_constant_force(body: RID): Vector2
        
        /** Overridable version of [method PhysicsServer2D.body_set_constant_torque]. */
        /* gdvirtual */ _body_set_constant_torque(body: RID, torque: float64): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_constant_torque]. */
        /* gdvirtual */ _body_get_constant_torque(body: RID): float64
        
        /** Overridable version of [method PhysicsServer2D.body_set_axis_velocity]. */
        /* gdvirtual */ _body_set_axis_velocity(body: RID, axis_velocity: Vector2): void
        
        /** Overridable version of [method PhysicsServer2D.body_add_collision_exception]. */
        /* gdvirtual */ _body_add_collision_exception(body: RID, excepted_body: RID): void
        
        /** Overridable version of [method PhysicsServer2D.body_remove_collision_exception]. */
        /* gdvirtual */ _body_remove_collision_exception(body: RID, excepted_body: RID): void
        
        /** Returns the [RID]s of all bodies added as collision exceptions for the given [param body]. See also [method _body_add_collision_exception] and [method _body_remove_collision_exception].  
         *  Overridable version of [PhysicsServer2D]'s internal `body_get_collision_exceptions` method. Corresponds to [method PhysicsBody2D.get_collision_exceptions].  
         */
        /* gdvirtual */ _body_get_collision_exceptions(body: RID): GArray
        
        /** Overridable version of [method PhysicsServer2D.body_set_max_contacts_reported]. */
        /* gdvirtual */ _body_set_max_contacts_reported(body: RID, amount: int64): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_max_contacts_reported]. */
        /* gdvirtual */ _body_get_max_contacts_reported(body: RID): int64
        
        /** Overridable version of [PhysicsServer2D]'s internal `body_set_contacts_reported_depth_threshold` method.  
         *      
         *  **Note:** This method is currently unused by Godot's default physics implementation.  
         */
        /* gdvirtual */ _body_set_contacts_reported_depth_threshold(body: RID, threshold: float64): void
        
        /** Overridable version of [PhysicsServer2D]'s internal `body_get_contacts_reported_depth_threshold` method.  
         *      
         *  **Note:** This method is currently unused by Godot's default physics implementation.  
         */
        /* gdvirtual */ _body_get_contacts_reported_depth_threshold(body: RID): float64
        
        /** Overridable version of [method PhysicsServer2D.body_set_omit_force_integration]. */
        /* gdvirtual */ _body_set_omit_force_integration(body: RID, enable: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.body_is_omitting_force_integration]. */
        /* gdvirtual */ _body_is_omitting_force_integration(body: RID): boolean
        
        /** Assigns the [param body] to call the given [param callable] during the synchronization phase of the loop, before [method _step] is called. See also [method _sync].  
         *  Overridable version of [method PhysicsServer2D.body_set_state_sync_callback].  
         */
        /* gdvirtual */ _body_set_state_sync_callback(body: RID, callable: Callable): void
        
        /** Overridable version of [method PhysicsServer2D.body_set_force_integration_callback]. */
        /* gdvirtual */ _body_set_force_integration_callback(body: RID, callable: Callable, userdata: any): void
        
        /** Given a [param body], a [param shape], and their respective parameters, this method should return `true` if a collision between the two would occur, with additional details passed in [param results].  
         *  Overridable version of [PhysicsServer2D]'s internal `shape_collide` method. Corresponds to [method PhysicsDirectSpaceState2D.collide_shape].  
         */
        /* gdvirtual */ _body_collide_shape(body: RID, body_shape: int64, shape: RID, shape_xform: Transform2D, motion: Vector2, results: int64, result_max: int64, result_count: int64): boolean
        
        /** If set to `true`, allows the body with the given [RID] to detect mouse inputs when the mouse cursor is hovering on it.  
         *  Overridable version of [PhysicsServer2D]'s internal `body_set_pickable` method. Corresponds to [member CollisionObject2D.input_pickable].  
         */
        /* gdvirtual */ _body_set_pickable(body: RID, pickable: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.body_get_direct_state]. */
        /* gdvirtual */ _body_get_direct_state(body: RID): PhysicsDirectBodyState2D
        
        /** Overridable version of [method PhysicsServer2D.body_test_motion]. Unlike the exposed implementation, this method does not receive all of the arguments inside a [PhysicsTestMotionParameters2D]. */
        /* gdvirtual */ _body_test_motion(body: RID, from: Transform2D, motion: Vector2, margin: float64, collide_separation_ray: boolean, recovery_as_collision: boolean, result: int64): boolean
        
        /** Overridable version of [method PhysicsServer2D.joint_create]. */
        /* gdvirtual */ _joint_create(): RID
        
        /** Overridable version of [method PhysicsServer2D.joint_clear]. */
        /* gdvirtual */ _joint_clear(joint: RID): void
        
        /** Overridable version of [method PhysicsServer2D.joint_set_param]. */
        /* gdvirtual */ _joint_set_param(joint: RID, param: PhysicsServer2D.JointParam, value: float64): void
        
        /** Overridable version of [method PhysicsServer2D.joint_get_param]. */
        /* gdvirtual */ _joint_get_param(joint: RID, param: PhysicsServer2D.JointParam): float64
        
        /** Overridable version of [method PhysicsServer2D.joint_disable_collisions_between_bodies]. */
        /* gdvirtual */ _joint_disable_collisions_between_bodies(joint: RID, disable: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.joint_is_disabled_collisions_between_bodies]. */
        /* gdvirtual */ _joint_is_disabled_collisions_between_bodies(joint: RID): boolean
        
        /** Overridable version of [method PhysicsServer2D.joint_make_pin]. */
        /* gdvirtual */ _joint_make_pin(joint: RID, anchor: Vector2, body_a: RID, body_b: RID): void
        
        /** Overridable version of [method PhysicsServer2D.joint_make_groove]. */
        /* gdvirtual */ _joint_make_groove(joint: RID, a_groove1: Vector2, a_groove2: Vector2, b_anchor: Vector2, body_a: RID, body_b: RID): void
        
        /** Overridable version of [method PhysicsServer2D.joint_make_damped_spring]. */
        /* gdvirtual */ _joint_make_damped_spring(joint: RID, anchor_a: Vector2, anchor_b: Vector2, body_a: RID, body_b: RID): void
        
        /** Overridable version of [method PhysicsServer2D.pin_joint_set_flag]. */
        /* gdvirtual */ _pin_joint_set_flag(joint: RID, flag: PhysicsServer2D.PinJointFlag, enabled: boolean): void
        
        /** Overridable version of [method PhysicsServer2D.pin_joint_get_flag]. */
        /* gdvirtual */ _pin_joint_get_flag(joint: RID, flag: PhysicsServer2D.PinJointFlag): boolean
        
        /** Overridable version of [method PhysicsServer2D.pin_joint_set_param]. */
        /* gdvirtual */ _pin_joint_set_param(joint: RID, param: PhysicsServer2D.PinJointParam, value: float64): void
        
        /** Overridable version of [method PhysicsServer2D.pin_joint_get_param]. */
        /* gdvirtual */ _pin_joint_get_param(joint: RID, param: PhysicsServer2D.PinJointParam): float64
        
        /** Overridable version of [method PhysicsServer2D.damped_spring_joint_set_param]. */
        /* gdvirtual */ _damped_spring_joint_set_param(joint: RID, param: PhysicsServer2D.DampedSpringParam, value: float64): void
        
        /** Overridable version of [method PhysicsServer2D.damped_spring_joint_get_param]. */
        /* gdvirtual */ _damped_spring_joint_get_param(joint: RID, param: PhysicsServer2D.DampedSpringParam): float64
        
        /** Overridable version of [method PhysicsServer2D.joint_get_type]. */
        /* gdvirtual */ _joint_get_type(joint: RID): PhysicsServer2D.JointType
        
        /** Overridable version of [method PhysicsServer2D.free_rid]. */
        /* gdvirtual */ _free_rid(rid: RID): void
        
        /** Overridable version of [method PhysicsServer2D.set_active]. */
        /* gdvirtual */ _set_active(active: boolean): void
        
        /** Called when the main loop is initialized and creates a new instance of this physics server. See also [method MainLoop._initialize] and [method _finish].  
         *  Overridable version of [PhysicsServer2D]'s internal `init` method.  
         */
        /* gdvirtual */ _init(): void
        
        /** Called every physics step to process the physics simulation. [param step] is the time elapsed since the last physics step, in seconds. It is usually the same as [method Node.get_physics_process_delta_time].  
         *  Overridable version of [PhysicsServer2D]'s internal [code skip-lint]step` method.  
         */
        /* gdvirtual */ _step(step: float64): void
        
        /** Called to indicate that the physics server is synchronizing and cannot access physics states if running on a separate thread. See also [method _end_sync].  
         *  Overridable version of [PhysicsServer2D]'s internal `sync` method.  
         */
        /* gdvirtual */ _sync(): void
        
        /** Called every physics step before [method _step] to process all remaining queries.  
         *  Overridable version of [PhysicsServer2D]'s internal `flush_queries` method.  
         */
        /* gdvirtual */ _flush_queries(): void
        
        /** Called to indicate that the physics server has stopped synchronizing. It is in the loop's iteration/physics phase, and can access physics objects even if running on a separate thread. See also [method _sync].  
         *  Overridable version of [PhysicsServer2D]'s internal `end_sync` method.  
         */
        /* gdvirtual */ _end_sync(): void
        
        /** Called when the main loop finalizes to shut down the physics server. See also [method MainLoop._finalize] and [method _init].  
         *  Overridable version of [PhysicsServer2D]'s internal `finish` method.  
         */
        /* gdvirtual */ _finish(): void
        
        /** Overridable method that should return `true` when the physics server is processing queries. See also [method _flush_queries].  
         *  Overridable version of [PhysicsServer2D]'s internal `is_flushing_queries` method.  
         */
        /* gdvirtual */ _is_flushing_queries(): boolean
        
        /** Overridable version of [method PhysicsServer2D.get_process_info]. */
        /* gdvirtual */ _get_process_info(process_info: PhysicsServer2D.ProcessInfo): int64
        
        /** Returns `true` if the body with the given [RID] is being excluded from [method _body_test_motion]. See also [method Object.get_instance_id]. */
        body_test_motion_is_excluding_body(body: RID): boolean
        
        /** Returns `true` if the object with the given instance ID is being excluded from [method _body_test_motion]. See also [method Object.get_instance_id]. */
        body_test_motion_is_excluding_object(object: int64): boolean
    }
    /** Provides virtual methods that can be overridden to create custom [PhysicsServer3D] implementations.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsserver3dextension.html  
     */
    class PhysicsServer3DExtension extends PhysicsServer3D {
        constructor(identifier?: any)
        /* gdvirtual */ _world_boundary_shape_create(): RID
        /* gdvirtual */ _separation_ray_shape_create(): RID
        /* gdvirtual */ _sphere_shape_create(): RID
        /* gdvirtual */ _box_shape_create(): RID
        /* gdvirtual */ _capsule_shape_create(): RID
        /* gdvirtual */ _cylinder_shape_create(): RID
        /* gdvirtual */ _convex_polygon_shape_create(): RID
        /* gdvirtual */ _concave_polygon_shape_create(): RID
        /* gdvirtual */ _heightmap_shape_create(): RID
        /* gdvirtual */ _custom_shape_create(): RID
        /* gdvirtual */ _shape_set_data(shape: RID, data: any): void
        /* gdvirtual */ _shape_set_custom_solver_bias(shape: RID, bias: float64): void
        /* gdvirtual */ _shape_set_margin(shape: RID, margin: float64): void
        /* gdvirtual */ _shape_get_margin(shape: RID): float64
        /* gdvirtual */ _shape_get_type(shape: RID): PhysicsServer3D.ShapeType
        /* gdvirtual */ _shape_get_data(shape: RID): any
        /* gdvirtual */ _shape_get_custom_solver_bias(shape: RID): float64
        /* gdvirtual */ _space_create(): RID
        /* gdvirtual */ _space_set_active(space: RID, active: boolean): void
        /* gdvirtual */ _space_is_active(space: RID): boolean
        /* gdvirtual */ _space_set_param(space: RID, param: PhysicsServer3D.SpaceParameter, value: float64): void
        /* gdvirtual */ _space_get_param(space: RID, param: PhysicsServer3D.SpaceParameter): float64
        /* gdvirtual */ _space_get_direct_state(space: RID): PhysicsDirectSpaceState3D
        /* gdvirtual */ _space_set_debug_contacts(space: RID, max_contacts: int64): void
        /* gdvirtual */ _space_get_contacts(space: RID): PackedVector3Array
        /* gdvirtual */ _space_get_contact_count(space: RID): int64
        /* gdvirtual */ _area_create(): RID
        /* gdvirtual */ _area_set_space(area: RID, space: RID): void
        /* gdvirtual */ _area_get_space(area: RID): RID
        /* gdvirtual */ _area_add_shape(area: RID, shape: RID, transform: Transform3D, disabled: boolean): void
        /* gdvirtual */ _area_set_shape(area: RID, shape_idx: int64, shape: RID): void
        /* gdvirtual */ _area_set_shape_transform(area: RID, shape_idx: int64, transform: Transform3D): void
        /* gdvirtual */ _area_set_shape_disabled(area: RID, shape_idx: int64, disabled: boolean): void
        /* gdvirtual */ _area_get_shape_count(area: RID): int64
        /* gdvirtual */ _area_get_shape(area: RID, shape_idx: int64): RID
        /* gdvirtual */ _area_get_shape_transform(area: RID, shape_idx: int64): Transform3D
        /* gdvirtual */ _area_remove_shape(area: RID, shape_idx: int64): void
        /* gdvirtual */ _area_clear_shapes(area: RID): void
        /* gdvirtual */ _area_attach_object_instance_id(area: RID, id: int64): void
        /* gdvirtual */ _area_get_object_instance_id(area: RID): int64
        /* gdvirtual */ _area_set_param(area: RID, param: PhysicsServer3D.AreaParameter, value: any): void
        /* gdvirtual */ _area_set_transform(area: RID, transform: Transform3D): void
        /* gdvirtual */ _area_get_param(area: RID, param: PhysicsServer3D.AreaParameter): any
        /* gdvirtual */ _area_get_transform(area: RID): Transform3D
        /* gdvirtual */ _area_set_collision_layer(area: RID, layer: int64): void
        /* gdvirtual */ _area_get_collision_layer(area: RID): int64
        /* gdvirtual */ _area_set_collision_mask(area: RID, mask: int64): void
        /* gdvirtual */ _area_get_collision_mask(area: RID): int64
        /* gdvirtual */ _area_set_monitorable(area: RID, monitorable: boolean): void
        /* gdvirtual */ _area_set_ray_pickable(area: RID, enable: boolean): void
        /* gdvirtual */ _area_set_monitor_callback(area: RID, callback: Callable): void
        /* gdvirtual */ _area_set_area_monitor_callback(area: RID, callback: Callable): void
        /* gdvirtual */ _body_create(): RID
        /* gdvirtual */ _body_set_space(body: RID, space: RID): void
        /* gdvirtual */ _body_get_space(body: RID): RID
        /* gdvirtual */ _body_set_mode(body: RID, mode: PhysicsServer3D.BodyMode): void
        /* gdvirtual */ _body_get_mode(body: RID): PhysicsServer3D.BodyMode
        /* gdvirtual */ _body_add_shape(body: RID, shape: RID, transform: Transform3D, disabled: boolean): void
        /* gdvirtual */ _body_set_shape(body: RID, shape_idx: int64, shape: RID): void
        /* gdvirtual */ _body_set_shape_transform(body: RID, shape_idx: int64, transform: Transform3D): void
        /* gdvirtual */ _body_set_shape_disabled(body: RID, shape_idx: int64, disabled: boolean): void
        /* gdvirtual */ _body_get_shape_count(body: RID): int64
        /* gdvirtual */ _body_get_shape(body: RID, shape_idx: int64): RID
        /* gdvirtual */ _body_get_shape_transform(body: RID, shape_idx: int64): Transform3D
        /* gdvirtual */ _body_remove_shape(body: RID, shape_idx: int64): void
        /* gdvirtual */ _body_clear_shapes(body: RID): void
        /* gdvirtual */ _body_attach_object_instance_id(body: RID, id: int64): void
        /* gdvirtual */ _body_get_object_instance_id(body: RID): int64
        /* gdvirtual */ _body_set_enable_continuous_collision_detection(body: RID, enable: boolean): void
        /* gdvirtual */ _body_is_continuous_collision_detection_enabled(body: RID): boolean
        /* gdvirtual */ _body_set_collision_layer(body: RID, layer: int64): void
        /* gdvirtual */ _body_get_collision_layer(body: RID): int64
        /* gdvirtual */ _body_set_collision_mask(body: RID, mask: int64): void
        /* gdvirtual */ _body_get_collision_mask(body: RID): int64
        /* gdvirtual */ _body_set_collision_priority(body: RID, priority: float64): void
        /* gdvirtual */ _body_get_collision_priority(body: RID): float64
        /* gdvirtual */ _body_set_user_flags(body: RID, flags: int64): void
        /* gdvirtual */ _body_get_user_flags(body: RID): int64
        /* gdvirtual */ _body_set_param(body: RID, param: PhysicsServer3D.BodyParameter, value: any): void
        /* gdvirtual */ _body_get_param(body: RID, param: PhysicsServer3D.BodyParameter): any
        /* gdvirtual */ _body_reset_mass_properties(body: RID): void
        /* gdvirtual */ _body_set_state(body: RID, state: PhysicsServer3D.BodyState, value: any): void
        /* gdvirtual */ _body_get_state(body: RID, state: PhysicsServer3D.BodyState): any
        /* gdvirtual */ _body_apply_central_impulse(body: RID, impulse: Vector3): void
        /* gdvirtual */ _body_apply_impulse(body: RID, impulse: Vector3, position: Vector3): void
        /* gdvirtual */ _body_apply_torque_impulse(body: RID, impulse: Vector3): void
        /* gdvirtual */ _body_apply_central_force(body: RID, force: Vector3): void
        /* gdvirtual */ _body_apply_force(body: RID, force: Vector3, position: Vector3): void
        /* gdvirtual */ _body_apply_torque(body: RID, torque: Vector3): void
        /* gdvirtual */ _body_add_constant_central_force(body: RID, force: Vector3): void
        /* gdvirtual */ _body_add_constant_force(body: RID, force: Vector3, position: Vector3): void
        /* gdvirtual */ _body_add_constant_torque(body: RID, torque: Vector3): void
        /* gdvirtual */ _body_set_constant_force(body: RID, force: Vector3): void
        /* gdvirtual */ _body_get_constant_force(body: RID): Vector3
        /* gdvirtual */ _body_set_constant_torque(body: RID, torque: Vector3): void
        /* gdvirtual */ _body_get_constant_torque(body: RID): Vector3
        /* gdvirtual */ _body_set_axis_velocity(body: RID, axis_velocity: Vector3): void
        /* gdvirtual */ _body_set_axis_lock(body: RID, axis: PhysicsServer3D.BodyAxis, lock: boolean): void
        /* gdvirtual */ _body_is_axis_locked(body: RID, axis: PhysicsServer3D.BodyAxis): boolean
        /* gdvirtual */ _body_add_collision_exception(body: RID, excepted_body: RID): void
        /* gdvirtual */ _body_remove_collision_exception(body: RID, excepted_body: RID): void
        /* gdvirtual */ _body_get_collision_exceptions(body: RID): GArray
        /* gdvirtual */ _body_set_max_contacts_reported(body: RID, amount: int64): void
        /* gdvirtual */ _body_get_max_contacts_reported(body: RID): int64
        /* gdvirtual */ _body_set_contacts_reported_depth_threshold(body: RID, threshold: float64): void
        /* gdvirtual */ _body_get_contacts_reported_depth_threshold(body: RID): float64
        /* gdvirtual */ _body_set_omit_force_integration(body: RID, enable: boolean): void
        /* gdvirtual */ _body_is_omitting_force_integration(body: RID): boolean
        /* gdvirtual */ _body_set_state_sync_callback(body: RID, callable: Callable): void
        /* gdvirtual */ _body_set_force_integration_callback(body: RID, callable: Callable, userdata: any): void
        /* gdvirtual */ _body_set_ray_pickable(body: RID, enable: boolean): void
        /* gdvirtual */ _body_test_motion(body: RID, from: Transform3D, motion: Vector3, margin: float64, max_collisions: int64, collide_separation_ray: boolean, recovery_as_collision: boolean, result: int64): boolean
        /* gdvirtual */ _body_get_direct_state(body: RID): PhysicsDirectBodyState3D
        /* gdvirtual */ _soft_body_create(): RID
        /* gdvirtual */ _soft_body_update_rendering_server(body: RID, rendering_server_handler: PhysicsServer3DRenderingServerHandler): void
        /* gdvirtual */ _soft_body_set_space(body: RID, space: RID): void
        /* gdvirtual */ _soft_body_get_space(body: RID): RID
        /* gdvirtual */ _soft_body_set_ray_pickable(body: RID, enable: boolean): void
        /* gdvirtual */ _soft_body_set_collision_layer(body: RID, layer: int64): void
        /* gdvirtual */ _soft_body_get_collision_layer(body: RID): int64
        /* gdvirtual */ _soft_body_set_collision_mask(body: RID, mask: int64): void
        /* gdvirtual */ _soft_body_get_collision_mask(body: RID): int64
        /* gdvirtual */ _soft_body_add_collision_exception(body: RID, body_b: RID): void
        /* gdvirtual */ _soft_body_remove_collision_exception(body: RID, body_b: RID): void
        /* gdvirtual */ _soft_body_get_collision_exceptions(body: RID): GArray
        /* gdvirtual */ _soft_body_set_state(body: RID, state: PhysicsServer3D.BodyState, variant: any): void
        /* gdvirtual */ _soft_body_get_state(body: RID, state: PhysicsServer3D.BodyState): any
        /* gdvirtual */ _soft_body_set_transform(body: RID, transform: Transform3D): void
        /* gdvirtual */ _soft_body_set_simulation_precision(body: RID, simulation_precision: int64): void
        /* gdvirtual */ _soft_body_get_simulation_precision(body: RID): int64
        /* gdvirtual */ _soft_body_set_total_mass(body: RID, total_mass: float64): void
        /* gdvirtual */ _soft_body_get_total_mass(body: RID): float64
        /* gdvirtual */ _soft_body_set_linear_stiffness(body: RID, linear_stiffness: float64): void
        /* gdvirtual */ _soft_body_get_linear_stiffness(body: RID): float64
        /* gdvirtual */ _soft_body_set_pressure_coefficient(body: RID, pressure_coefficient: float64): void
        /* gdvirtual */ _soft_body_get_pressure_coefficient(body: RID): float64
        /* gdvirtual */ _soft_body_set_damping_coefficient(body: RID, damping_coefficient: float64): void
        /* gdvirtual */ _soft_body_get_damping_coefficient(body: RID): float64
        /* gdvirtual */ _soft_body_set_drag_coefficient(body: RID, drag_coefficient: float64): void
        /* gdvirtual */ _soft_body_get_drag_coefficient(body: RID): float64
        /* gdvirtual */ _soft_body_set_mesh(body: RID, mesh: RID): void
        /* gdvirtual */ _soft_body_get_bounds(body: RID): AABB
        /* gdvirtual */ _soft_body_move_point(body: RID, point_index: int64, global_position: Vector3): void
        /* gdvirtual */ _soft_body_get_point_global_position(body: RID, point_index: int64): Vector3
        /* gdvirtual */ _soft_body_remove_all_pinned_points(body: RID): void
        /* gdvirtual */ _soft_body_pin_point(body: RID, point_index: int64, pin: boolean): void
        /* gdvirtual */ _soft_body_is_point_pinned(body: RID, point_index: int64): boolean
        /* gdvirtual */ _joint_create(): RID
        /* gdvirtual */ _joint_clear(joint: RID): void
        /* gdvirtual */ _joint_make_pin(joint: RID, body_A: RID, local_A: Vector3, body_B: RID, local_B: Vector3): void
        /* gdvirtual */ _pin_joint_set_param(joint: RID, param: PhysicsServer3D.PinJointParam, value: float64): void
        /* gdvirtual */ _pin_joint_get_param(joint: RID, param: PhysicsServer3D.PinJointParam): float64
        /* gdvirtual */ _pin_joint_set_local_a(joint: RID, local_A: Vector3): void
        /* gdvirtual */ _pin_joint_get_local_a(joint: RID): Vector3
        /* gdvirtual */ _pin_joint_set_local_b(joint: RID, local_B: Vector3): void
        /* gdvirtual */ _pin_joint_get_local_b(joint: RID): Vector3
        /* gdvirtual */ _joint_make_hinge(joint: RID, body_A: RID, hinge_A: Transform3D, body_B: RID, hinge_B: Transform3D): void
        /* gdvirtual */ _joint_make_hinge_simple(joint: RID, body_A: RID, pivot_A: Vector3, axis_A: Vector3, body_B: RID, pivot_B: Vector3, axis_B: Vector3): void
        /* gdvirtual */ _hinge_joint_set_param(joint: RID, param: PhysicsServer3D.HingeJointParam, value: float64): void
        /* gdvirtual */ _hinge_joint_get_param(joint: RID, param: PhysicsServer3D.HingeJointParam): float64
        /* gdvirtual */ _hinge_joint_set_flag(joint: RID, flag: PhysicsServer3D.HingeJointFlag, enabled: boolean): void
        /* gdvirtual */ _hinge_joint_get_flag(joint: RID, flag: PhysicsServer3D.HingeJointFlag): boolean
        /* gdvirtual */ _joint_make_slider(joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, local_ref_B: Transform3D): void
        /* gdvirtual */ _slider_joint_set_param(joint: RID, param: PhysicsServer3D.SliderJointParam, value: float64): void
        /* gdvirtual */ _slider_joint_get_param(joint: RID, param: PhysicsServer3D.SliderJointParam): float64
        /* gdvirtual */ _joint_make_cone_twist(joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, local_ref_B: Transform3D): void
        /* gdvirtual */ _cone_twist_joint_set_param(joint: RID, param: PhysicsServer3D.ConeTwistJointParam, value: float64): void
        /* gdvirtual */ _cone_twist_joint_get_param(joint: RID, param: PhysicsServer3D.ConeTwistJointParam): float64
        /* gdvirtual */ _joint_make_generic_6dof(joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, local_ref_B: Transform3D): void
        /* gdvirtual */ _generic_6dof_joint_set_param(joint: RID, axis: Vector3.Axis, param: PhysicsServer3D.G6DOFJointAxisParam, value: float64): void
        /* gdvirtual */ _generic_6dof_joint_get_param(joint: RID, axis: Vector3.Axis, param: PhysicsServer3D.G6DOFJointAxisParam): float64
        /* gdvirtual */ _generic_6dof_joint_set_flag(joint: RID, axis: Vector3.Axis, flag: PhysicsServer3D.G6DOFJointAxisFlag, enable: boolean): void
        /* gdvirtual */ _generic_6dof_joint_get_flag(joint: RID, axis: Vector3.Axis, flag: PhysicsServer3D.G6DOFJointAxisFlag): boolean
        /* gdvirtual */ _joint_get_type(joint: RID): PhysicsServer3D.JointType
        /* gdvirtual */ _joint_set_solver_priority(joint: RID, priority: int64): void
        /* gdvirtual */ _joint_get_solver_priority(joint: RID): int64
        /* gdvirtual */ _joint_disable_collisions_between_bodies(joint: RID, disable: boolean): void
        /* gdvirtual */ _joint_is_disabled_collisions_between_bodies(joint: RID): boolean
        /* gdvirtual */ _free_rid(rid: RID): void
        /* gdvirtual */ _set_active(active: boolean): void
        /* gdvirtual */ _init(): void
        /* gdvirtual */ _step(step: float64): void
        /* gdvirtual */ _sync(): void
        /* gdvirtual */ _flush_queries(): void
        /* gdvirtual */ _end_sync(): void
        /* gdvirtual */ _finish(): void
        /* gdvirtual */ _is_flushing_queries(): boolean
        /* gdvirtual */ _get_process_info(process_info: PhysicsServer3D.ProcessInfo): int64
        body_test_motion_is_excluding_body(body: RID): boolean
        body_test_motion_is_excluding_object(object: int64): boolean
    }
    /** A class used to provide [method PhysicsServer3DExtension._soft_body_update_rendering_server] with a rendering handler for soft bodies.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsserver3drenderingserverhandler.html  
     */
    class PhysicsServer3DRenderingServerHandler extends Object {
        constructor(identifier?: any)
        /** Called by the [PhysicsServer3D] to set the position for the [SoftBody3D] vertex at the index specified by [param vertex_id].  
         *      
         *  **Note:** The [param vertex] parameter used to be of type `const void*` prior to Godot 4.2.  
         */
        /* gdvirtual */ _set_vertex(vertex_id: int64, vertex: Vector3): void
        
        /** Called by the [PhysicsServer3D] to set the normal for the [SoftBody3D] vertex at the index specified by [param vertex_id].  
         *      
         *  **Note:** The [param normal] parameter used to be of type `const void*` prior to Godot 4.2.  
         */
        /* gdvirtual */ _set_normal(vertex_id: int64, normal: Vector3): void
        
        /** Called by the [PhysicsServer3D] to set the bounding box for the [SoftBody3D]. */
        /* gdvirtual */ _set_aabb(aabb: AABB): void
        
        /** Sets the position for the [SoftBody3D] vertex at the index specified by [param vertex_id]. */
        set_vertex(vertex_id: int64, vertex: Vector3): void
        
        /** Sets the normal for the [SoftBody3D] vertex at the index specified by [param vertex_id]. */
        set_normal(vertex_id: int64, normal: Vector3): void
        
        /** Sets the bounding box for the [SoftBody3D]. */
        set_aabb(aabb: AABB): void
    }
    /** Provides parameters for [method PhysicsDirectSpaceState2D.intersect_shape].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsshapequeryparameters2d.html  
     */
    class PhysicsShapeQueryParameters2D extends RefCounted {
        constructor(identifier?: any)
        /** The physics layers the query will detect (as a bitmask). By default, all collision layers are detected. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The list of object [RID]s that will be excluded from collisions. Use [method CollisionObject2D.get_rid] to get the [RID] associated with a [CollisionObject2D]-derived node.  
         *      
         *  **Note:** The returned array is copied and any changes to it will not update the original property value. To update the value you need to modify the returned array, and then assign it to the property again.  
         */
        get exclude(): GArray
        set exclude(value: GArray)
        
        /** The collision margin for the shape. */
        get margin(): float64
        set margin(value: float64)
        
        /** The motion of the shape being queried for. */
        get motion(): Vector2
        set motion(value: Vector2)
        
        /** The [Shape2D] that will be used for collision/intersection queries. This stores the actual reference which avoids the shape to be released while being used for queries, so always prefer using this over [member shape_rid]. */
        get shape(): Shape2D
        set shape(value: Shape2D)
        
        /** The queried shape's [RID] that will be used for collision/intersection queries. Use this over [member shape] if you want to optimize for performance using the Servers API:  
         *  	  
         */
        get shape_rid(): RID
        set shape_rid(value: RID)
        
        /** The queried shape's transform matrix. */
        get transform(): Transform2D
        set transform(value: Transform2D)
        
        /** If `true`, the query will take [PhysicsBody2D]s into account. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        
        /** If `true`, the query will take [Area2D]s into account. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
    }
    /** Provides parameters for [method PhysicsDirectSpaceState3D.intersect_shape].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicsshapequeryparameters3d.html  
     */
    class PhysicsShapeQueryParameters3D extends RefCounted {
        constructor(identifier?: any)
        /** The physics layers the query will detect (as a bitmask). By default, all collision layers are detected. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** The list of object [RID]s that will be excluded from collisions. Use [method CollisionObject3D.get_rid] to get the [RID] associated with a [CollisionObject3D]-derived node.  
         *      
         *  **Note:** The returned array is copied and any changes to it will not update the original property value. To update the value you need to modify the returned array, and then assign it to the property again.  
         */
        get exclude(): GArray
        set exclude(value: GArray)
        
        /** The collision margin for the shape. */
        get margin(): float64
        set margin(value: float64)
        
        /** The motion of the shape being queried for. */
        get motion(): Vector3
        set motion(value: Vector3)
        
        /** The [Shape3D] that will be used for collision/intersection queries. This stores the actual reference which avoids the shape to be released while being used for queries, so always prefer using this over [member shape_rid]. */
        get shape(): Shape3D
        set shape(value: Shape3D)
        
        /** The queried shape's [RID] that will be used for collision/intersection queries. Use this over [member shape] if you want to optimize for performance using the Servers API:  
         *  	  
         */
        get shape_rid(): RID
        set shape_rid(value: RID)
        
        /** The queried shape's transform matrix. */
        get transform(): Transform3D
        set transform(value: Transform3D)
        
        /** If `true`, the query will take [PhysicsBody3D]s into account. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        
        /** If `true`, the query will take [Area3D]s into account. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
    }
    /** Provides parameters for [method PhysicsServer2D.body_test_motion].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicstestmotionparameters2d.html  
     */
    class PhysicsTestMotionParameters2D extends RefCounted {
        constructor(identifier?: any)
        /** Transform in global space where the motion should start. Usually set to [member Node2D.global_transform] for the current body's transform. */
        get from(): Transform2D
        set from(value: Transform2D)
        
        /** Motion vector to define the length and direction of the motion to test. */
        get motion(): Vector2
        set motion(value: Vector2)
        
        /** Increases the size of the shapes involved in the collision detection. */
        get margin(): float64
        set margin(value: float64)
        
        /** If set to `true`, shapes of type [constant PhysicsServer2D.SHAPE_SEPARATION_RAY] are used to detect collisions and can stop the motion. Can be useful when snapping to the ground.  
         *  If set to `false`, shapes of type [constant PhysicsServer2D.SHAPE_SEPARATION_RAY] are only used for separation when overlapping with other bodies. That's the main use for separation ray shapes.  
         */
        get collide_separation_ray(): boolean
        set collide_separation_ray(value: boolean)
        
        /** Optional array of body [RID] to exclude from collision. Use [method CollisionObject2D.get_rid] to get the [RID] associated with a [CollisionObject2D]-derived node. */
        get exclude_bodies(): GArray
        set exclude_bodies(value: GArray)
        
        /** Optional array of object unique instance ID to exclude from collision. See [method Object.get_instance_id]. */
        get exclude_objects(): GArray
        set exclude_objects(value: GArray)
        
        /** If set to `true`, any depenetration from the recovery phase is reported as a collision; this is used e.g. by [CharacterBody2D] for improving floor detection during floor snapping.  
         *  If set to `false`, only collisions resulting from the motion are reported, which is generally the desired behavior.  
         */
        get recovery_as_collision(): boolean
        set recovery_as_collision(value: boolean)
    }
    /** Provides parameters for [method PhysicsServer3D.body_test_motion].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicstestmotionparameters3d.html  
     */
    class PhysicsTestMotionParameters3D extends RefCounted {
        constructor(identifier?: any)
        /** Transform in global space where the motion should start. Usually set to [member Node3D.global_transform] for the current body's transform. */
        get from(): Transform3D
        set from(value: Transform3D)
        
        /** Motion vector to define the length and direction of the motion to test. */
        get motion(): Vector3
        set motion(value: Vector3)
        
        /** Increases the size of the shapes involved in the collision detection. */
        get margin(): float64
        set margin(value: float64)
        
        /** Maximum number of returned collisions, between `1` and `32`. Always returns the deepest detected collisions. */
        get max_collisions(): int64
        set max_collisions(value: int64)
        
        /** If set to `true`, shapes of type [constant PhysicsServer3D.SHAPE_SEPARATION_RAY] are used to detect collisions and can stop the motion. Can be useful when snapping to the ground.  
         *  If set to `false`, shapes of type [constant PhysicsServer3D.SHAPE_SEPARATION_RAY] are only used for separation when overlapping with other bodies. That's the main use for separation ray shapes.  
         */
        get collide_separation_ray(): boolean
        set collide_separation_ray(value: boolean)
        
        /** Optional array of body [RID] to exclude from collision. Use [method CollisionObject3D.get_rid] to get the [RID] associated with a [CollisionObject3D]-derived node. */
        get exclude_bodies(): GArray
        set exclude_bodies(value: GArray)
        
        /** Optional array of object unique instance ID to exclude from collision. See [method Object.get_instance_id]. */
        get exclude_objects(): GArray
        set exclude_objects(value: GArray)
        
        /** If set to `true`, any depenetration from the recovery phase is reported as a collision; this is used e.g. by [CharacterBody3D] for improving floor detection during floor snapping.  
         *  If set to `false`, only collisions resulting from the motion are reported, which is generally the desired behavior.  
         */
        get recovery_as_collision(): boolean
        set recovery_as_collision(value: boolean)
    }
    /** Describes the motion and collision result from [method PhysicsServer2D.body_test_motion].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicstestmotionresult2d.html  
     */
    class PhysicsTestMotionResult2D extends RefCounted {
        constructor(identifier?: any)
        /** Returns the moving object's travel before collision. */
        get_travel(): Vector2
        
        /** Returns the moving object's remaining movement vector. */
        get_remainder(): Vector2
        
        /** Returns the point of collision in global coordinates, if a collision occurred. */
        get_collision_point(): Vector2
        
        /** Returns the colliding body's shape's normal at the point of collision, if a collision occurred. */
        get_collision_normal(): Vector2
        
        /** Returns the colliding body's velocity, if a collision occurred. */
        get_collider_velocity(): Vector2
        
        /** Returns the unique instance ID of the colliding body's attached [Object], if a collision occurred. See [method Object.get_instance_id]. */
        get_collider_id(): int64
        
        /** Returns the colliding body's [RID] used by the [PhysicsServer2D], if a collision occurred. */
        get_collider_rid(): RID
        
        /** Returns the colliding body's attached [Object], if a collision occurred. */
        get_collider(): Object
        
        /** Returns the colliding body's shape index, if a collision occurred. See [CollisionObject2D]. */
        get_collider_shape(): int64
        
        /** Returns the moving object's colliding shape, if a collision occurred. */
        get_collision_local_shape(): int64
        
        /** Returns the length of overlap along the collision normal, if a collision occurred. */
        get_collision_depth(): float64
        
        /** Returns the maximum fraction of the motion that can occur without a collision, between `0` and `1`. */
        get_collision_safe_fraction(): float64
        
        /** Returns the minimum fraction of the motion needed to collide, if a collision occurred, between `0` and `1`. */
        get_collision_unsafe_fraction(): float64
    }
    /** Describes the motion and collision result from [method PhysicsServer3D.body_test_motion].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_physicstestmotionresult3d.html  
     */
    class PhysicsTestMotionResult3D extends RefCounted {
        constructor(identifier?: any)
        /** Returns the moving object's travel before collision. */
        get_travel(): Vector3
        
        /** Returns the moving object's remaining movement vector. */
        get_remainder(): Vector3
        
        /** Returns the maximum fraction of the motion that can occur without a collision, between `0` and `1`. */
        get_collision_safe_fraction(): float64
        
        /** Returns the minimum fraction of the motion needed to collide, if a collision occurred, between `0` and `1`. */
        get_collision_unsafe_fraction(): float64
        
        /** Returns the number of detected collisions. */
        get_collision_count(): int64
        
        /** Returns the point of collision in global coordinates given a collision index (the deepest collision by default), if a collision occurred. */
        get_collision_point(collision_index: int64 = 0): Vector3
        
        /** Returns the colliding body's shape's normal at the point of collision given a collision index (the deepest collision by default), if a collision occurred. */
        get_collision_normal(collision_index: int64 = 0): Vector3
        
        /** Returns the colliding body's velocity given a collision index (the deepest collision by default), if a collision occurred. */
        get_collider_velocity(collision_index: int64 = 0): Vector3
        
        /** Returns the unique instance ID of the colliding body's attached [Object] given a collision index (the deepest collision by default), if a collision occurred. See [method Object.get_instance_id]. */
        get_collider_id(collision_index: int64 = 0): int64
        
        /** Returns the colliding body's [RID] used by the [PhysicsServer3D] given a collision index (the deepest collision by default), if a collision occurred. */
        get_collider_rid(collision_index: int64 = 0): RID
        
        /** Returns the colliding body's attached [Object] given a collision index (the deepest collision by default), if a collision occurred. */
        get_collider(collision_index: int64 = 0): Object
        
        /** Returns the colliding body's shape index given a collision index (the deepest collision by default), if a collision occurred. See [CollisionObject3D]. */
        get_collider_shape(collision_index: int64 = 0): int64
        
        /** Returns the moving object's colliding shape given a collision index (the deepest collision by default), if a collision occurred. */
        get_collision_local_shape(collision_index: int64 = 0): int64
        
        /** Returns the length of overlap along the collision normal given a collision index (the deepest collision by default), if a collision occurred. */
        get_collision_depth(collision_index: int64 = 0): float64
    }
    /** A physics joint that attaches two 2D physics bodies at a single point, allowing them to freely rotate.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_pinjoint2d.html  
     */
    class PinJoint2D<Map extends Record<string, Node> = Record<string, Node>> extends Joint2D<Map> {
        constructor(identifier?: any)
        /** The higher this value, the more the bond to the pinned partner can flex. */
        get softness(): float64
        set softness(value: float64)
        
        /** If `true`, the pin maximum and minimum rotation, defined by [member angular_limit_lower] and [member angular_limit_upper] are applied. */
        get angular_limit_enabled(): boolean
        set angular_limit_enabled(value: boolean)
        
        /** The minimum rotation. Only active if [member angular_limit_enabled] is `true`. */
        get angular_limit_lower(): float64
        set angular_limit_lower(value: float64)
        
        /** The maximum rotation. Only active if [member angular_limit_enabled] is `true`. */
        get angular_limit_upper(): float64
        set angular_limit_upper(value: float64)
        
        /** When activated, a motor turns the pin. */
        get motor_enabled(): boolean
        set motor_enabled(value: boolean)
        
        /** Target speed for the motor. In radians per second. */
        get motor_target_velocity(): float64
        set motor_target_velocity(value: float64)
    }
    namespace PinJoint3D {
        enum Param {
            /** The force with which the pinned objects stay in positional relation to each other. The higher, the stronger. */
            PARAM_BIAS = 0,
            
            /** The force with which the pinned objects stay in velocity relation to each other. The higher, the stronger. */
            PARAM_DAMPING = 1,
            
            /** If above 0, this value is the maximum value for an impulse that this Joint3D produces. */
            PARAM_IMPULSE_CLAMP = 2,
        }
    }
    /** A physics joint that attaches two 3D physics bodies at a single point, allowing them to freely rotate.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_pinjoint3d.html  
     */
    class PinJoint3D<Map extends Record<string, Node> = Record<string, Node>> extends Joint3D<Map> {
        constructor(identifier?: any)
        /** Sets the value of the specified parameter. */
        set_param(param: PinJoint3D.Param, value: float64): void
        
        /** Returns the value of the specified parameter. */
        get_param(param: PinJoint3D.Param): float64
        
        /** The force with which the pinned objects stay in positional relation to each other. The higher, the stronger. */
        get "params/bias"(): float64
        set "params/bias"(value: float64)
        
        /** The force with which the pinned objects stay in velocity relation to each other. The higher, the stronger. */
        get "params/damping"(): float64
        set "params/damping"(value: float64)
        
        /** If above 0, this value is the maximum value for an impulse that this Joint3D produces. */
        get "params/impulse_clamp"(): float64
        set "params/impulse_clamp"(value: float64)
    }
    /** A [Cubemap] without image data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_placeholdercubemap.html  
     */
    class PlaceholderCubemap extends PlaceholderTextureLayered {
        constructor(identifier?: any)
    }
    /** A [CubemapArray] without image data.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_placeholdercubemaparray.html  
     */
    class PlaceholderCubemapArray extends PlaceholderTextureLayered {
        constructor(identifier?: any)
    }
    /** Placeholder class for a material.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_placeholdermaterial.html  
     */
    class PlaceholderMaterial extends Material {
        constructor(identifier?: any)
    }
    /** Placeholder class for a mesh.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_placeholdermesh.html  
     */
    class PlaceholderMesh extends Mesh {
        constructor(identifier?: any)
        /** The smallest [AABB] enclosing this mesh in local space. */
        get aabb(): AABB
        set aabb(value: AABB)
    }
    /** Placeholder class for a 2-dimensional texture.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_placeholdertexture2d.html  
     */
    class PlaceholderTexture2D extends Texture2D {
        constructor(identifier?: any)
        /** The texture's size (in pixels). */
        get size(): Vector2
        set size(value: Vector2)
    }
    /** Placeholder class for a 2-dimensional texture array.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_placeholdertexture2darray.html  
     */
    class PlaceholderTexture2DArray extends PlaceholderTextureLayered {
        constructor(identifier?: any)
    }
    /** Placeholder class for a 3-dimensional texture.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_placeholdertexture3d.html  
     */
    class PlaceholderTexture3D extends Texture3D {
        constructor(identifier?: any)
        /** The texture's size (in pixels). */
        get size(): Vector3i
        set size(value: Vector3i)
    }
    /** Placeholder class for a 2-dimensional texture array.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_placeholdertexturelayered.html  
     */
    class PlaceholderTextureLayered extends TextureLayered {
        constructor(identifier?: any)
        /** The size of each texture layer (in pixels). */
        get size(): Vector2i
        set size(value: Vector2i)
        
        /** The number of layers in the texture array. */
        get layers(): int64
        set layers(value: int64)
    }
    namespace PlaneMesh {
        enum Orientation {
            /** [PlaneMesh] will face the positive X-axis. */
            FACE_X = 0,
            
            /** [PlaneMesh] will face the positive Y-axis. This matches the behavior of the [PlaneMesh] in Godot 3.x. */
            FACE_Y = 1,
            
            /** [PlaneMesh] will face the positive Z-axis. This matches the behavior of the QuadMesh in Godot 3.x. */
            FACE_Z = 2,
        }
    }
    /** Class representing a planar [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_planemesh.html  
     */
    class PlaneMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** Size of the generated plane. */
        get size(): Vector2
        set size(value: Vector2)
        
        /** Number of subdivision along the X axis. */
        get subdivide_width(): int64
        set subdivide_width(value: int64)
        
        /** Number of subdivision along the Z axis. */
        get subdivide_depth(): int64
        set subdivide_depth(value: int64)
        
        /** Offset of the generated plane. Useful for particles. */
        get center_offset(): Vector3
        set center_offset(value: Vector3)
        
        /** Direction that the [PlaneMesh] is facing. See [enum Orientation] for options. */
        get orientation(): int64
        set orientation(value: int64)
    }
    class PluginConfigDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        readonly plugin_ready: Signal2<string, string>
    }
    /** Positional 2D light source.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_pointlight2d.html  
     */
    class PointLight2D<Map extends Record<string, Node> = Record<string, Node>> extends Light2D<Map> {
        constructor(identifier?: any)
        /** [Texture2D] used for the light's appearance. */
        get texture(): Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/
        set texture(value: Texture2D | any /*-AnimatedTexture*/ | any /*-AtlasTexture*/ | any /*-CameraTexture*/ | any /*-CanvasTexture*/ | any /*-MeshTexture*/ | any /*-Texture2DRD*/ | any /*-ViewportTexture*/)
        
        /** The offset of the light's [member texture]. */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** The [member texture]'s scale factor. */
        get texture_scale(): float64
        set texture_scale(value: float64)
        
        /** The height of the light. Used with 2D normal mapping. The units are in pixels, e.g. if the height is 100, then it will illuminate an object 100 pixels away at a 45° angle to the plane. */
        get height(): float64
        set height(value: float64)
    }
    /** Mesh with a single Point primitive.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_pointmesh.html  
     */
    class PointMesh extends PrimitiveMesh {
        constructor(identifier?: any)
    }
    /** A 2D polygon.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_polygon2d.html  
     */
    class Polygon2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Adds a bone with the specified [param path] and [param weights]. */
        add_bone(path: NodePath | string, weights: PackedFloat32Array | float32[]): void
        
        /** Returns the number of bones in this [Polygon2D]. */
        get_bone_count(): int64
        
        /** Returns the path to the node associated with the specified bone. */
        get_bone_path(index: int64): NodePath
        
        /** Returns the weight values of the specified bone. */
        get_bone_weights(index: int64): PackedFloat32Array
        
        /** Removes the specified bone from this [Polygon2D]. */
        erase_bone(index: int64): void
        
        /** Removes all bones from this [Polygon2D]. */
        clear_bones(): void
        
        /** Sets the path to the node associated with the specified bone. */
        set_bone_path(index: int64, path: NodePath | string): void
        
        /** Sets the weight values for the specified bone. */
        set_bone_weights(index: int64, weights: PackedFloat32Array | float32[]): void
        
        /** The polygon's fill color. If [member texture] is set, it will be multiplied by this color. It will also be the default color for vertices not set in [member vertex_colors]. */
        get color(): Color
        set color(value: Color)
        
        /** The offset applied to each vertex. */
        get offset(): Vector2
        set offset(value: Vector2)
        
        /** If `true`, polygon edges will be anti-aliased. */
        get antialiased(): boolean
        set antialiased(value: boolean)
        
        /** The polygon's fill texture. Use [member uv] to set texture coordinates. */
        get texture(): Texture2D
        set texture(value: Texture2D)
        
        /** Amount to offset the polygon's [member texture]. If set to `Vector2(0, 0)`, the texture's origin (its top-left corner) will be placed at the polygon's position. */
        get texture_offset(): Vector2
        set texture_offset(value: Vector2)
        
        /** Amount to multiply the [member uv] coordinates when using [member texture]. Larger values make the texture smaller, and vice versa. */
        get texture_scale(): Vector2
        set texture_scale(value: Vector2)
        
        /** The texture's rotation in radians. */
        get texture_rotation(): float64
        set texture_rotation(value: float64)
        
        /** Path to a [Skeleton2D] node used for skeleton-based deformations of this polygon. If empty or invalid, skeletal deformations will not be used. */
        get skeleton(): NodePath
        set skeleton(value: NodePath | string)
        
        /** If `true`, the polygon will be inverted, containing the area outside the defined points and extending to the [member invert_border]. */
        get invert_enabled(): boolean
        set invert_enabled(value: boolean)
        
        /** Added padding applied to the bounding box when [member invert_enabled] is set to `true`. Setting this value too small may result in a "Bad Polygon" error. */
        get invert_border(): float64
        set invert_border(value: float64)
        
        /** The polygon's list of vertices. The final point will be connected to the first. */
        get polygon(): PackedVector2Array
        set polygon(value: PackedVector2Array | Vector2[])
        
        /** Texture coordinates for each vertex of the polygon. There should be one UV value per polygon vertex. If there are fewer, undefined vertices will use `Vector2(0, 0)`. */
        get uv(): PackedVector2Array
        set uv(value: PackedVector2Array | Vector2[])
        
        /** Color for each vertex. Colors are interpolated between vertices, resulting in smooth gradients. There should be one per polygon vertex. If there are fewer, undefined vertices will use [member color]. */
        get vertex_colors(): PackedColorArray
        set vertex_colors(value: PackedColorArray | Color[])
        
        /** The list of polygons, in case more than one is being represented. Every individual polygon is stored as a [PackedInt32Array] where each [int] is an index to a point in [member polygon]. If empty, this property will be ignored, and the resulting single polygon will be composed of all points in [member polygon], using the order they are stored in. */
        get polygons(): GArray
        set polygons(value: GArray)
        get bones(): GArray
        set bones(value: GArray)
        
        /** Number of internal vertices, used for UV mapping. */
        get internal_vertex_count(): int64
        set internal_vertex_count(value: int64)
    }
    class Polygon2DEditor<Map extends Record<string, Node> = Record<string, Node>> extends AbstractPolygon2DEditor<Map> {
        constructor(identifier?: any)
        _update_bone_list(): void
        _update_polygon_editing_state(): void
    }
    class Polygon2DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends AbstractPolygon2DEditorPlugin<Map> {
        constructor(identifier?: any)
    }
    class Polygon3DEditor<Map extends Record<string, Node> = Record<string, Node>> extends HBoxContainer<Map> {
        constructor(identifier?: any)
        _polygon_draw(): void
    }
    class Polygon3DEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    /** Flat 2D polygon shape for use with occlusion culling in [OccluderInstance3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_polygonoccluder3d.html  
     */
    class PolygonOccluder3D extends Occluder3D {
        constructor(identifier?: any)
        _has_editable_3d_polygon_no_depth(): boolean
        
        /** The polygon to use for occlusion culling. The polygon can be convex or concave, but it should have as few points as possible to maximize performance.  
         *  The polygon must  *not*  have intersecting lines. Otherwise, triangulation will fail (with an error message printed).  
         */
        get polygon(): PackedVector2Array
        set polygon(value: PackedVector2Array | Vector2[])
    }
    /** @link https://docs.godotengine.org/en/4.4/classes/class_polygonpathfinder.html */
    class PolygonPathFinder extends Resource {
        constructor(identifier?: any)
        /** Sets up [PolygonPathFinder] with an array of points that define the vertices of the polygon, and an array of indices that determine the edges of the polygon.  
         *  The length of [param connections] must be even, returns an error if odd.  
         *    
         */
        setup(points: PackedVector2Array | Vector2[], connections: PackedInt32Array | int32[]): void
        find_path(from: Vector2, to: Vector2): PackedVector2Array
        get_intersections(from: Vector2, to: Vector2): PackedVector2Array
        get_closest_point(point: Vector2): Vector2
        
        /** Returns `true` if [param point] falls inside the polygon area.  
         *    
         */
        is_point_inside(point: Vector2): boolean
        set_point_penalty(idx: int64, penalty: float64): void
        get_point_penalty(idx: int64): float64
        get_bounds(): Rect2
        get data(): GDictionary
        set data(value: GDictionary)
    }
    /** Base class for contextual windows and panels with fixed position.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_popup.html  
     */
    class Popup<Map extends Record<string, Node> = Record<string, Node>> extends Window<Map> {
        constructor(identifier?: any)
        /** Emitted when the popup is hidden. */
        readonly popup_hide: Signal0
    }
    /** A modal window used to display a list of options.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_popupmenu.html  
     */
    class PopupMenu<Map extends Record<string, Node> = Record<string, Node>> extends Popup<Map> {
        constructor(identifier?: any)
        /** Checks the provided [param event] against the [PopupMenu]'s shortcuts and accelerators, and activates the first item with matching events. If [param for_global_only] is `true`, only shortcuts and accelerators with `global` set to `true` will be called.  
         *  Returns `true` if an item was successfully activated.  
         *      
         *  **Note:** Certain [Control]s, such as [MenuButton], will call this method automatically.  
         */
        activate_item_by_event(event: InputEvent, for_global_only: boolean = false): boolean
        
        /** Returns `true` if the system native menu is supported and currently used by this [PopupMenu]. */
        is_native_menu(): boolean
        
        /** Adds a new item with text [param label].  
         *  An [param id] can optionally be provided, as well as an accelerator ([param accel]). If no [param id] is provided, one will be created from the index. If no [param accel] is provided, then the default value of 0 (corresponding to [constant @GlobalScope.KEY_NONE]) will be assigned to the item (which means it won't have any accelerator). See [method get_item_accelerator] for more info on accelerators.  
         *      
         *  **Note:** The provided [param id] is used only in [signal id_pressed] and [signal id_focused] signals. It's not related to the `index` arguments in e.g. [method set_item_checked].  
         */
        add_item(label: string, id: int64 = -1, accel: Key = 0): void
        
        /** Adds a new item with text [param label] and icon [param texture].  
         *  An [param id] can optionally be provided, as well as an accelerator ([param accel]). If no [param id] is provided, one will be created from the index. If no [param accel] is provided, then the default value of 0 (corresponding to [constant @GlobalScope.KEY_NONE]) will be assigned to the item (which means it won't have any accelerator). See [method get_item_accelerator] for more info on accelerators.  
         */
        add_icon_item(texture: Texture2D, label: string, id: int64 = -1, accel: Key = 0): void
        
        /** Adds a new checkable item with text [param label].  
         *  An [param id] can optionally be provided, as well as an accelerator ([param accel]). If no [param id] is provided, one will be created from the index. If no [param accel] is provided, then the default value of 0 (corresponding to [constant @GlobalScope.KEY_NONE]) will be assigned to the item (which means it won't have any accelerator). See [method get_item_accelerator] for more info on accelerators.  
         *      
         *  **Note:** Checkable items just display a checkmark, but don't have any built-in checking behavior and must be checked/unchecked manually. See [method set_item_checked] for more info on how to control it.  
         */
        add_check_item(label: string, id: int64 = -1, accel: Key = 0): void
        
        /** Adds a new checkable item with text [param label] and icon [param texture].  
         *  An [param id] can optionally be provided, as well as an accelerator ([param accel]). If no [param id] is provided, one will be created from the index. If no [param accel] is provided, then the default value of 0 (corresponding to [constant @GlobalScope.KEY_NONE]) will be assigned to the item (which means it won't have any accelerator). See [method get_item_accelerator] for more info on accelerators.  
         *      
         *  **Note:** Checkable items just display a checkmark, but don't have any built-in checking behavior and must be checked/unchecked manually. See [method set_item_checked] for more info on how to control it.  
         */
        add_icon_check_item(texture: Texture2D, label: string, id: int64 = -1, accel: Key = 0): void
        
        /** Adds a new radio check button with text [param label].  
         *  An [param id] can optionally be provided, as well as an accelerator ([param accel]). If no [param id] is provided, one will be created from the index. If no [param accel] is provided, then the default value of 0 (corresponding to [constant @GlobalScope.KEY_NONE]) will be assigned to the item (which means it won't have any accelerator). See [method get_item_accelerator] for more info on accelerators.  
         *      
         *  **Note:** Checkable items just display a checkmark, but don't have any built-in checking behavior and must be checked/unchecked manually. See [method set_item_checked] for more info on how to control it.  
         */
        add_radio_check_item(label: string, id: int64 = -1, accel: Key = 0): void
        
        /** Same as [method add_icon_check_item], but uses a radio check button. */
        add_icon_radio_check_item(texture: Texture2D, label: string, id: int64 = -1, accel: Key = 0): void
        
        /** Adds a new multistate item with text [param label].  
         *  Contrarily to normal binary items, multistate items can have more than two states, as defined by [param max_states]. The default value is defined by [param default_state].  
         *  An [param id] can optionally be provided, as well as an accelerator ([param accel]). If no [param id] is provided, one will be created from the index. If no [param accel] is provided, then the default value of 0 (corresponding to [constant @GlobalScope.KEY_NONE]) will be assigned to the item (which means it won't have any accelerator). See [method get_item_accelerator] for more info on accelerators.  
         *    
         *      
         *  **Note:** Multistate items don't update their state automatically and must be done manually. See [method toggle_item_multistate], [method set_item_multistate] and [method get_item_multistate] for more info on how to control it.  
         */
        add_multistate_item(label: string, max_states: int64, default_state: int64 = 0, id: int64 = -1, accel: Key = 0): void
        
        /** Adds a [Shortcut].  
         *  An [param id] can optionally be provided. If no [param id] is provided, one will be created from the index.  
         *  If [param allow_echo] is `true`, the shortcut can be activated with echo events.  
         */
        add_shortcut(shortcut: Shortcut, id: int64 = -1, global: boolean = false, allow_echo: boolean = false): void
        
        /** Adds a new item and assigns the specified [Shortcut] and icon [param texture] to it. Sets the label of the checkbox to the [Shortcut]'s name.  
         *  An [param id] can optionally be provided. If no [param id] is provided, one will be created from the index.  
         *  If [param allow_echo] is `true`, the shortcut can be activated with echo events.  
         */
        add_icon_shortcut(texture: Texture2D, shortcut: Shortcut, id: int64 = -1, global: boolean = false, allow_echo: boolean = false): void
        
        /** Adds a new checkable item and assigns the specified [Shortcut] to it. Sets the label of the checkbox to the [Shortcut]'s name.  
         *  An [param id] can optionally be provided. If no [param id] is provided, one will be created from the index.  
         *      
         *  **Note:** Checkable items just display a checkmark, but don't have any built-in checking behavior and must be checked/unchecked manually. See [method set_item_checked] for more info on how to control it.  
         */
        add_check_shortcut(shortcut: Shortcut, id: int64 = -1, global: boolean = false): void
        
        /** Adds a new checkable item and assigns the specified [Shortcut] and icon [param texture] to it. Sets the label of the checkbox to the [Shortcut]'s name.  
         *  An [param id] can optionally be provided. If no [param id] is provided, one will be created from the index.  
         *      
         *  **Note:** Checkable items just display a checkmark, but don't have any built-in checking behavior and must be checked/unchecked manually. See [method set_item_checked] for more info on how to control it.  
         */
        add_icon_check_shortcut(texture: Texture2D, shortcut: Shortcut, id: int64 = -1, global: boolean = false): void
        
        /** Adds a new radio check button and assigns a [Shortcut] to it. Sets the label of the checkbox to the [Shortcut]'s name.  
         *  An [param id] can optionally be provided. If no [param id] is provided, one will be created from the index.  
         *      
         *  **Note:** Checkable items just display a checkmark, but don't have any built-in checking behavior and must be checked/unchecked manually. See [method set_item_checked] for more info on how to control it.  
         */
        add_radio_check_shortcut(shortcut: Shortcut, id: int64 = -1, global: boolean = false): void
        
        /** Same as [method add_icon_check_shortcut], but uses a radio check button. */
        add_icon_radio_check_shortcut(texture: Texture2D, shortcut: Shortcut, id: int64 = -1, global: boolean = false): void
        
        /** Adds an item that will act as a submenu of the parent [PopupMenu] node when clicked. The [param submenu] argument must be the name of an existing [PopupMenu] that has been added as a child to this node. This submenu will be shown when the item is clicked, hovered for long enough, or activated using the `ui_select` or `ui_right` input actions.  
         *  An [param id] can optionally be provided. If no [param id] is provided, one will be created from the index.  
         */
        add_submenu_item(label: string, submenu: string, id: int64 = -1): void
        
        /** Adds an item that will act as a submenu of the parent [PopupMenu] node when clicked. This submenu will be shown when the item is clicked, hovered for long enough, or activated using the `ui_select` or `ui_right` input actions.  
         *  [param submenu] must be either child of this [PopupMenu] or has no parent node (in which case it will be automatically added as a child). If the [param submenu] popup has another parent, this method will fail.  
         *  An [param id] can optionally be provided. If no [param id] is provided, one will be created from the index.  
         */
        add_submenu_node_item(label: string, submenu: PopupMenu, id: int64 = -1): void
        
        /** Sets the text of the item at the given [param index]. */
        set_item_text(index: int64, text: string): void
        
        /** Sets item's text base writing direction. */
        set_item_text_direction(index: int64, direction: Control.TextDirection): void
        
        /** Sets language code of item's text used for line-breaking and text shaping algorithms, if left empty current locale is used instead. */
        set_item_language(index: int64, language: string): void
        
        /** Replaces the [Texture2D] icon of the item at the given [param index]. */
        set_item_icon(index: int64, icon: Texture2D): void
        
        /** Sets the maximum allowed width of the icon for the item at the given [param index]. This limit is applied on top of the default size of the icon and on top of [theme_item icon_max_width]. The height is adjusted according to the icon's ratio. */
        set_item_icon_max_width(index: int64, width: int64): void
        
        /** Sets a modulating [Color] of the item's icon at the given [param index]. */
        set_item_icon_modulate(index: int64, modulate: Color): void
        
        /** Sets the checkstate status of the item at the given [param index]. */
        set_item_checked(index: int64, checked: boolean): void
        
        /** Sets the [param id] of the item at the given [param index].  
         *  The [param id] is used in [signal id_pressed] and [signal id_focused] signals.  
         */
        set_item_id(index: int64, id: int64): void
        
        /** Sets the accelerator of the item at the given [param index]. An accelerator is a keyboard shortcut that can be pressed to trigger the menu button even if it's not currently open. [param accel] is generally a combination of [enum KeyModifierMask]s and [enum Key]s using bitwise OR such as `KEY_MASK_CTRL | KEY_A` ([kbd]Ctrl + A[/kbd]). */
        set_item_accelerator(index: int64, accel: Key): void
        
        /** Sets the metadata of an item, which may be of any type. You can later get it with [method get_item_metadata], which provides a simple way of assigning context data to items. */
        set_item_metadata(index: int64, metadata: any): void
        
        /** Enables/disables the item at the given [param index]. When it is disabled, it can't be selected and its action can't be invoked. */
        set_item_disabled(index: int64, disabled: boolean): void
        
        /** Sets the submenu of the item at the given [param index]. The submenu is the name of a child [PopupMenu] node that would be shown when the item is clicked. */
        set_item_submenu(index: int64, submenu: string): void
        
        /** Sets the submenu of the item at the given [param index]. The submenu is a [PopupMenu] node that would be shown when the item is clicked. It must either be a child of this [PopupMenu] or has no parent (in which case it will be automatically added as a child). If the [param submenu] popup has another parent, this method will fail. */
        set_item_submenu_node(index: int64, submenu: PopupMenu): void
        
        /** Mark the item at the given [param index] as a separator, which means that it would be displayed as a line. If `false`, sets the type of the item to plain text. */
        set_item_as_separator(index: int64, enable: boolean): void
        
        /** Sets whether the item at the given [param index] has a checkbox. If `false`, sets the type of the item to plain text.  
         *      
         *  **Note:** Checkable items just display a checkmark, but don't have any built-in checking behavior and must be checked/unchecked manually.  
         */
        set_item_as_checkable(index: int64, enable: boolean): void
        
        /** Sets the type of the item at the given [param index] to radio button. If `false`, sets the type of the item to plain text. */
        set_item_as_radio_checkable(index: int64, enable: boolean): void
        
        /** Sets the [String] tooltip of the item at the given [param index]. */
        set_item_tooltip(index: int64, tooltip: string): void
        
        /** Sets a [Shortcut] for the item at the given [param index]. */
        set_item_shortcut(index: int64, shortcut: Shortcut, global: boolean = false): void
        
        /** Sets the horizontal offset of the item at the given [param index]. */
        set_item_indent(index: int64, indent: int64): void
        
        /** Sets the state of a multistate item. See [method add_multistate_item] for details. */
        set_item_multistate(index: int64, state: int64): void
        
        /** Sets the max states of a multistate item. See [method add_multistate_item] for details. */
        set_item_multistate_max(index: int64, max_states: int64): void
        
        /** Disables the [Shortcut] of the item at the given [param index]. */
        set_item_shortcut_disabled(index: int64, disabled: boolean): void
        
        /** Toggles the check state of the item at the given [param index]. */
        toggle_item_checked(index: int64): void
        
        /** Cycle to the next state of a multistate item. See [method add_multistate_item] for details. */
        toggle_item_multistate(index: int64): void
        
        /** Returns the text of the item at the given [param index]. */
        get_item_text(index: int64): string
        
        /** Returns item's text base writing direction. */
        get_item_text_direction(index: int64): Control.TextDirection
        
        /** Returns item's text language code. */
        get_item_language(index: int64): string
        
        /** Returns the icon of the item at the given [param index]. */
        get_item_icon(index: int64): Texture2D
        
        /** Returns the maximum allowed width of the icon for the item at the given [param index]. */
        get_item_icon_max_width(index: int64): int64
        
        /** Returns a [Color] modulating the item's icon at the given [param index]. */
        get_item_icon_modulate(index: int64): Color
        
        /** Returns `true` if the item at the given [param index] is checked. */
        is_item_checked(index: int64): boolean
        
        /** Returns the ID of the item at the given [param index]. `id` can be manually assigned, while index can not. */
        get_item_id(index: int64): int64
        
        /** Returns the index of the item containing the specified [param id]. Index is automatically assigned to each item by the engine and can not be set manually. */
        get_item_index(id: int64): int64
        
        /** Returns the accelerator of the item at the given [param index]. An accelerator is a keyboard shortcut that can be pressed to trigger the menu button even if it's not currently open. The return value is an integer which is generally a combination of [enum KeyModifierMask]s and [enum Key]s using bitwise OR such as `KEY_MASK_CTRL | KEY_A` ([kbd]Ctrl + A[/kbd]). If no accelerator is defined for the specified [param index], [method get_item_accelerator] returns `0` (corresponding to [constant @GlobalScope.KEY_NONE]). */
        get_item_accelerator(index: int64): Key
        
        /** Returns the metadata of the specified item, which might be of any type. You can set it with [method set_item_metadata], which provides a simple way of assigning context data to items. */
        get_item_metadata(index: int64): any
        
        /** Returns `true` if the item at the given [param index] is disabled. When it is disabled it can't be selected, or its action invoked.  
         *  See [method set_item_disabled] for more info on how to disable an item.  
         */
        is_item_disabled(index: int64): boolean
        
        /** Returns the submenu name of the item at the given [param index]. See [method add_submenu_item] for more info on how to add a submenu. */
        get_item_submenu(index: int64): string
        
        /** Returns the submenu of the item at the given [param index], or `null` if no submenu was added. See [method add_submenu_node_item] for more info on how to add a submenu. */
        get_item_submenu_node(index: int64): PopupMenu
        
        /** Returns `true` if the item is a separator. If it is, it will be displayed as a line. See [method add_separator] for more info on how to add a separator. */
        is_item_separator(index: int64): boolean
        
        /** Returns `true` if the item at the given [param index] is checkable in some way, i.e. if it has a checkbox or radio button.  
         *      
         *  **Note:** Checkable items just display a checkmark or radio button, but don't have any built-in checking behavior and must be checked/unchecked manually.  
         */
        is_item_checkable(index: int64): boolean
        
        /** Returns `true` if the item at the given [param index] has radio button-style checkability.  
         *      
         *  **Note:** This is purely cosmetic; you must add the logic for checking/unchecking items in radio groups.  
         */
        is_item_radio_checkable(index: int64): boolean
        
        /** Returns `true` if the specified item's shortcut is disabled. */
        is_item_shortcut_disabled(index: int64): boolean
        
        /** Returns the tooltip associated with the item at the given [param index]. */
        get_item_tooltip(index: int64): string
        
        /** Returns the [Shortcut] associated with the item at the given [param index]. */
        get_item_shortcut(index: int64): Shortcut
        
        /** Returns the horizontal offset of the item at the given [param index]. */
        get_item_indent(index: int64): int64
        
        /** Returns the max states of the item at the given [param index]. */
        get_item_multistate_max(index: int64): int64
        
        /** Returns the state of the item at the given [param index]. */
        get_item_multistate(index: int64): int64
        
        /** Sets the currently focused item as the given [param index].  
         *  Passing `-1` as the index makes so that no item is focused.  
         */
        set_focused_item(index: int64): void
        
        /** Returns the index of the currently focused item. Returns `-1` if no item is focused. */
        get_focused_item(): int64
        
        /** Moves the scroll view to make the item at the given [param index] visible. */
        scroll_to_item(index: int64): void
        
        /** Removes the item at the given [param index] from the menu.  
         *      
         *  **Note:** The indices of items after the removed item will be shifted by one.  
         */
        remove_item(index: int64): void
        
        /** Adds a separator between items. Separators also occupy an index, which you can set by using the [param id] parameter.  
         *  A [param label] can optionally be provided, which will appear at the center of the separator.  
         */
        add_separator(label: string = '', id: int64 = -1): void
        
        /** Removes all items from the [PopupMenu]. If [param free_submenus] is `true`, the submenu nodes are automatically freed. */
        clear(free_submenus: boolean = false): void
        
        /** Returns `true` if the menu is bound to the special system menu. */
        is_system_menu(): boolean
        
        /** If `true`, hides the [PopupMenu] when an item is selected. */
        get hide_on_item_selection(): boolean
        set hide_on_item_selection(value: boolean)
        
        /** If `true`, hides the [PopupMenu] when a checkbox or radio button is selected. */
        get hide_on_checkable_item_selection(): boolean
        set hide_on_checkable_item_selection(value: boolean)
        
        /** If `true`, hides the [PopupMenu] when a state item is selected. */
        get hide_on_state_item_selection(): boolean
        set hide_on_state_item_selection(value: boolean)
        
        /** Sets the delay time in seconds for the submenu item to popup on mouse hovering. If the popup menu is added as a child of another (acting as a submenu), it will inherit the delay time of the parent menu item. */
        get submenu_popup_delay(): float64
        set submenu_popup_delay(value: float64)
        
        /** If `true`, allows navigating [PopupMenu] with letter keys. */
        get allow_search(): boolean
        set allow_search(value: boolean)
        
        /** If set to one of the values of [enum NativeMenu.SystemMenus], this [PopupMenu] is bound to the special system menu. Only one [PopupMenu] can be bound to each special menu at a time. */
        get system_menu_id(): int64
        set system_menu_id(value: int64)
        
        /** If `true`, [MenuBar] will use native menu when supported.  
         *      
         *  **Note:** If [PopupMenu] is linked to [StatusIndicator], [MenuBar], or another [PopupMenu] item it can use native menu regardless of this property, use [method is_native_menu] to check it.  
         */
        get prefer_native_menu(): boolean
        set prefer_native_menu(value: boolean)
        
        /** The number of items currently in the list. */
        get item_count(): any /*Items,item_*/
        set item_count(value: any /*Items,item_*/)
        
        /** Emitted when an item of some [param id] is pressed or its accelerator is activated.  
         *      
         *  **Note:** If [param id] is negative (either explicitly or due to overflow), this will return the corresponding index instead.  
         */
        readonly id_pressed: Signal1<int64>
        
        /** Emitted when the user navigated to an item of some [param id] using the [member ProjectSettings.input/ui_up] or [member ProjectSettings.input/ui_down] input action. */
        readonly id_focused: Signal1<int64>
        
        /** Emitted when an item of some [param index] is pressed or its accelerator is activated. */
        readonly index_pressed: Signal1<int64>
        
        /** Emitted when any item is added, modified or removed. */
        readonly menu_changed: Signal0
    }
    /** A popup with a panel background.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_popuppanel.html  
     */
    class PopupPanel<Map extends Record<string, Node> = Record<string, Node>> extends Popup<Map> {
        constructor(identifier?: any)
    }
    namespace PortableCompressedTexture2D {
        enum CompressionMode {
            COMPRESSION_MODE_LOSSLESS = 0,
            COMPRESSION_MODE_LOSSY = 1,
            COMPRESSION_MODE_BASIS_UNIVERSAL = 2,
            COMPRESSION_MODE_S3TC = 3,
            COMPRESSION_MODE_ETC2 = 4,
            COMPRESSION_MODE_BPTC = 5,
        }
    }
    /** Provides a compressed texture for disk and/or VRAM in a way that is portable.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_portablecompressedtexture2d.html  
     */
    class PortableCompressedTexture2D extends Texture2D {
        constructor(identifier?: any)
        /** Initializes the compressed texture from a base image. The compression mode must be provided.  
         *  [param normal_map] is recommended to ensure optimum quality if this image will be used as a normal map.  
         *  If lossy compression is requested, the quality setting can optionally be provided. This maps to Lossy WebP compression quality.  
         */
        create_from_image(image: Image, compression_mode: PortableCompressedTexture2D.CompressionMode, normal_map: boolean = false, lossy_quality: float64 = 0.8): void
        
        /** Return the image format used (valid after initialized). */
        get_format(): Image.Format
        
        /** Return the compression mode used (valid after initialized). */
        get_compression_mode(): PortableCompressedTexture2D.CompressionMode
        
        /** Overrides the flag globally for all textures of this type. This is used primarily by the editor. */
        static set_keep_all_compressed_buffers(keep: boolean): void
        
        /** Return whether the flag is overridden for all textures of this type. */
        static is_keeping_all_compressed_buffers(): boolean
        get _data(): PackedByteArray
        set _data(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** Allow overriding the texture size (for 2D only). */
        get size_override(): Vector2
        set size_override(value: Vector2)
        
        /** When running on the editor, this class will keep the source compressed data in memory. Otherwise, the source compressed data is lost after loading and the resource can't be re saved.  
         *  This flag allows to keep the compressed data in memory if you intend it to persist after loading.  
         */
        get keep_compressed_buffer(): boolean
        set keep_compressed_buffer(value: boolean)
    }
    class PostImportPluginSkeletonRenamer extends EditorScenePostImportPlugin {
        constructor(identifier?: any)
    }
    class PostImportPluginSkeletonRestFixer extends EditorScenePostImportPlugin {
        constructor(identifier?: any)
    }
    class PostImportPluginSkeletonTrackOrganizer extends EditorScenePostImportPlugin {
        constructor(identifier?: any)
    }
    /** Base class for all primitive meshes. Handles applying a [Material] to a primitive mesh.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_primitivemesh.html  
     */
    class PrimitiveMesh extends Mesh {
        constructor(identifier?: any)
        /** Override this method to customize how this primitive mesh should be generated. Should return an [Array] where each element is another Array of values required for the mesh (see the [enum Mesh.ArrayType] constants). */
        /* gdvirtual */ _create_mesh_array(): GArray
        
        /** Returns the mesh arrays used to make up the surface of this primitive mesh.  
         *  **Example:** Pass the result to [method ArrayMesh.add_surface_from_arrays] to create a new surface:  
         *    
         */
        get_mesh_arrays(): GArray
        
        /** Request an update of this primitive mesh based on its properties. */
        request_update(): void
        
        /** The current [Material] of the primitive mesh. */
        get material(): BaseMaterial3D | ShaderMaterial
        set material(value: BaseMaterial3D | ShaderMaterial)
        
        /** Overrides the [AABB] with one defined by user for use with frustum culling. Especially useful to avoid unexpected culling when using a shader to offset vertices. */
        get custom_aabb(): AABB
        set custom_aabb(value: AABB)
        
        /** If set, the order of the vertices in each triangle are reversed resulting in the backside of the mesh being drawn.  
         *  This gives the same result as using [constant BaseMaterial3D.CULL_FRONT] in [member BaseMaterial3D.cull_mode].  
         */
        get flip_faces(): boolean
        set flip_faces(value: boolean)
        
        /** If set, generates UV2 UV coordinates applying a padding using the [member uv2_padding] setting. UV2 is needed for lightmapping. */
        get add_uv2(): boolean
        set add_uv2(value: boolean)
        
        /** If [member add_uv2] is set, specifies the padding in pixels applied along seams of the mesh. Lower padding values allow making better use of the lightmap texture (resulting in higher texel density), but may introduce visible lightmap bleeding along edges.  
         *  If the size of the lightmap texture can't be determined when generating the mesh, UV2 is calculated assuming a texture size of 1024x1024.  
         */
        get uv2_padding(): float64
        set uv2_padding(value: float64)
    }
    /** Class representing a prism-shaped [PrimitiveMesh].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_prismmesh.html  
     */
    class PrismMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** Displacement of the upper edge along the X axis. 0.0 positions edge straight above the bottom-left edge. */
        get left_to_right(): float64
        set left_to_right(value: float64)
        
        /** Size of the prism. */
        get size(): Vector3
        set size(value: Vector3)
        
        /** Number of added edge loops along the X axis. */
        get subdivide_width(): int64
        set subdivide_width(value: int64)
        
        /** Number of added edge loops along the Y axis. */
        get subdivide_height(): int64
        set subdivide_height(value: int64)
        
        /** Number of added edge loops along the Z axis. */
        get subdivide_depth(): int64
        set subdivide_depth(value: int64)
    }
    /** A material that defines a simple sky for a [Sky] resource.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_proceduralskymaterial.html  
     */
    class ProceduralSkyMaterial extends Material {
        constructor(identifier?: any)
        /** Color of the sky at the top. Blends with [member sky_horizon_color]. */
        get sky_top_color(): Color
        set sky_top_color(value: Color)
        
        /** Color of the sky at the horizon. Blends with [member sky_top_color]. */
        get sky_horizon_color(): Color
        set sky_horizon_color(value: Color)
        
        /** How quickly the [member sky_horizon_color] fades into the [member sky_top_color]. */
        get sky_curve(): float64
        set sky_curve(value: float64)
        
        /** Multiplier for sky color. A higher value will make the sky brighter. */
        get sky_energy_multiplier(): float64
        set sky_energy_multiplier(value: float64)
        
        /** The sky cover texture to use. This texture must use an equirectangular projection (similar to [PanoramaSkyMaterial]). The texture's colors will be  *added*  to the existing sky color, and will be multiplied by [member sky_energy_multiplier] and [member sky_cover_modulate]. This is mainly suited to displaying stars at night, but it can also be used to display clouds at day or night (with a non-physically-accurate look). */
        get sky_cover(): Texture2D
        set sky_cover(value: Texture2D)
        
        /** The tint to apply to the [member sky_cover] texture. This can be used to change the sky cover's colors or opacity independently of the sky energy, which is useful for day/night or weather transitions. Only effective if a texture is defined in [member sky_cover]. */
        get sky_cover_modulate(): Color
        set sky_cover_modulate(value: Color)
        
        /** Color of the ground at the bottom. Blends with [member ground_horizon_color]. */
        get ground_bottom_color(): Color
        set ground_bottom_color(value: Color)
        
        /** Color of the ground at the horizon. Blends with [member ground_bottom_color]. */
        get ground_horizon_color(): Color
        set ground_horizon_color(value: Color)
        
        /** How quickly the [member ground_horizon_color] fades into the [member ground_bottom_color]. */
        get ground_curve(): float64
        set ground_curve(value: float64)
        
        /** Multiplier for ground color. A higher value will make the ground brighter. */
        get ground_energy_multiplier(): float64
        set ground_energy_multiplier(value: float64)
        
        /** Distance from center of sun where it fades out completely. */
        get sun_angle_max(): float64
        set sun_angle_max(value: float64)
        
        /** How quickly the sun fades away between the edge of the sun disk and [member sun_angle_max]. */
        get sun_curve(): float64
        set sun_curve(value: float64)
        
        /** If `true`, enables debanding. Debanding adds a small amount of noise which helps reduce banding that appears from the smooth changes in color in the sky. */
        get use_debanding(): boolean
        set use_debanding(value: boolean)
        
        /** The sky's overall brightness multiplier. Higher values result in a brighter sky. */
        get energy_multiplier(): float64
        set energy_multiplier(value: float64)
    }
    class ProceduralSkyMaterialConversionPlugin extends EditorResourceConversionPlugin {
        constructor(identifier?: any)
    }
    namespace ProgressBar {
        enum FillMode {
            /** The progress bar fills from begin to end horizontally, according to the language direction. If [method Control.is_layout_rtl] returns `false`, it fills from left to right, and if it returns `true`, it fills from right to left. */
            FILL_BEGIN_TO_END = 0,
            
            /** The progress bar fills from end to begin horizontally, according to the language direction. If [method Control.is_layout_rtl] returns `false`, it fills from right to left, and if it returns `true`, it fills from left to right. */
            FILL_END_TO_BEGIN = 1,
            
            /** The progress fills from top to bottom. */
            FILL_TOP_TO_BOTTOM = 2,
            
            /** The progress fills from bottom to top. */
            FILL_BOTTOM_TO_TOP = 3,
        }
    }
    /** A control used for visual representation of a percentage.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_progressbar.html  
     */
    class ProgressBar<Map extends Record<string, Node> = Record<string, Node>> extends Range<Map> {
        constructor(identifier?: any)
        /** The fill direction. See [enum FillMode] for possible values. */
        get fill_mode(): int64
        set fill_mode(value: int64)
        
        /** If `true`, the fill percentage is displayed on the bar. */
        get show_percentage(): boolean
        set show_percentage(value: boolean)
        
        /** When set to `true`, the progress bar indicates that something is happening with an animation, but does not show the fill percentage or value. */
        get indeterminate(): boolean
        set indeterminate(value: boolean)
        
        /** If `false`, the [member indeterminate] animation will be paused in the editor. */
        get editor_preview_indeterminate(): boolean
        set editor_preview_indeterminate(value: boolean)
    }
    class ProgressDialog<Map extends Record<string, Node> = Record<string, Node>> extends CenterContainer<Map> {
        constructor(identifier?: any)
    }
    class ProjectExportDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        get_current_preset(): EditorExportPreset
        get export_path(): string
        set export_path(value: string)
    }
    class ProjectExportTextureFormatError<Map extends Record<string, Node> = Record<string, Node>> extends HBoxContainer<Map> {
        constructor(identifier?: any)
        readonly texture_format_enabled: Signal0
    }
    class ProjectSettingsEditor<Map extends Record<string, Node> = Record<string, Node>> extends AcceptDialog<Map> {
        constructor(identifier?: any)
        queue_save(): void
        _update_action_map_editor(): void
    }
    class PropertySelector<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        readonly selected: Signal1<string>
    }
    /** Interpolates an [Object]'s property over time.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_propertytweener.html  
     */
    class PropertyTweener extends Tweener {
        constructor(identifier?: any)
        /** Sets a custom initial value to the [PropertyTweener].  
         *  **Example:** Move the node from position `(100, 100)` to `(200, 100)`.  
         *    
         */
        from(value: any): PropertyTweener
        
        /** Makes the [PropertyTweener] use the current property value (i.e. at the time of creating this [PropertyTweener]) as a starting point. This is equivalent of using [method from] with the current value. These two calls will do the same:  
         *    
         */
        from_current(): PropertyTweener
        
        /** When called, the final value will be used as a relative value instead.  
         *  **Example:** Move the node by `100` pixels to the right.  
         *    
         */
        as_relative(): PropertyTweener
        
        /** Sets the type of used transition from [enum Tween.TransitionType]. If not set, the default transition is used from the [Tween] that contains this Tweener. */
        set_trans(trans: Tween.TransitionType): PropertyTweener
        
        /** Sets the type of used easing from [enum Tween.EaseType]. If not set, the default easing is used from the [Tween] that contains this Tweener. */
        set_ease(ease: Tween.EaseType): PropertyTweener
        
        /** Allows interpolating the value with a custom easing function. The provided [param interpolator_method] will be called with a value ranging from `0.0` to `1.0` and is expected to return a value within the same range (values outside the range can be used for overshoot). The return value of the method is then used for interpolation between initial and final value. Note that the parameter passed to the method is still subject to the tweener's own easing.  
         *    
         */
        set_custom_interpolator(interpolator_method: Callable): PropertyTweener
        
        /** Sets the time in seconds after which the [PropertyTweener] will start interpolating. By default there's no delay. */
        set_delay(delay: float64): PropertyTweener
    }
    /** Class representing a square mesh facing the camera.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_quadmesh.html  
     */
    class QuadMesh extends PlaneMesh {
        constructor(identifier?: any)
    }
    /** Flat plane shape for use with occlusion culling in [OccluderInstance3D].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_quadoccluder3d.html  
     */
    class QuadOccluder3D extends Occluder3D {
        constructor(identifier?: any)
        /** The quad's size in 3D units. */
        get size(): Vector2
        set size(value: Vector2)
    }
    class QuickOpenResultContainer<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        readonly result_clicked: Signal0
    }
    /** Attachment format (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdattachmentformat.html  
     */
    class RDAttachmentFormat extends RefCounted {
        constructor(identifier?: any)
        /** The attachment's data format. */
        get format(): int64
        set format(value: int64)
        
        /** The number of samples used when sampling the attachment. */
        get samples(): int64
        set samples(value: int64)
        
        /** The attachment's usage flags, which determine what can be done with it. */
        get usage_flags(): int64
        set usage_flags(value: int64)
    }
    /** Framebuffer pass attachment description (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdframebufferpass.html  
     */
    class RDFramebufferPass extends RefCounted {
        /** Attachment is unused. */
        static readonly ATTACHMENT_UNUSED = -1
        constructor(identifier?: any)
        
        /** Color attachments in order starting from 0. If this attachment is not used by the shader, pass ATTACHMENT_UNUSED to skip. */
        get color_attachments(): PackedInt32Array
        set color_attachments(value: PackedInt32Array | int32[])
        
        /** Used for multipass framebuffers (more than one render pass). Converts an attachment to an input. Make sure to also supply it properly in the [RDUniform] for the uniform set. */
        get input_attachments(): PackedInt32Array
        set input_attachments(value: PackedInt32Array | int32[])
        
        /** If the color attachments are multisampled, non-multisampled resolve attachments can be provided. */
        get resolve_attachments(): PackedInt32Array
        set resolve_attachments(value: PackedInt32Array | int32[])
        
        /** Attachments to preserve in this pass (otherwise they are erased). */
        get preserve_attachments(): PackedInt32Array
        set preserve_attachments(value: PackedInt32Array | int32[])
        
        /** Depth attachment. ATTACHMENT_UNUSED should be used if no depth buffer is required for this pass. */
        get depth_attachment(): int64
        set depth_attachment(value: int64)
    }
    /** Pipeline color blend state (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdpipelinecolorblendstate.html  
     */
    class RDPipelineColorBlendState extends RefCounted {
        constructor(identifier?: any)
        /** If `true`, performs the logic operation defined in [member logic_op]. */
        get enable_logic_op(): boolean
        set enable_logic_op(value: boolean)
        
        /** The logic operation to perform for blending. Only effective if [member enable_logic_op] is `true`. */
        get logic_op(): int64
        set logic_op(value: int64)
        
        /** The constant color to blend with. See also [method RenderingDevice.draw_list_set_blend_constants]. */
        get blend_constant(): Color
        set blend_constant(value: Color)
        
        /** The attachments that are blended together. */
        get attachments(): GArray
        set attachments(value: GArray)
    }
    /** Pipeline color blend state attachment (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdpipelinecolorblendstateattachment.html  
     */
    class RDPipelineColorBlendStateAttachment extends RefCounted {
        constructor(identifier?: any)
        /** Convenience method to perform standard mix blending with straight (non-premultiplied) alpha. This sets [member enable_blend] to `true`, [member src_color_blend_factor] to [constant RenderingDevice.BLEND_FACTOR_SRC_ALPHA], [member dst_color_blend_factor] to [constant RenderingDevice.BLEND_FACTOR_ONE_MINUS_SRC_ALPHA], [member src_alpha_blend_factor] to [constant RenderingDevice.BLEND_FACTOR_SRC_ALPHA] and [member dst_alpha_blend_factor] to [constant RenderingDevice.BLEND_FACTOR_ONE_MINUS_SRC_ALPHA]. */
        set_as_mix(): void
        
        /** If `true`, performs blending between the source and destination according to the factors defined in [member src_color_blend_factor], [member dst_color_blend_factor], [member src_alpha_blend_factor] and [member dst_alpha_blend_factor]. The blend modes [member color_blend_op] and [member alpha_blend_op] are also taken into account, with [member write_r], [member write_g], [member write_b] and [member write_a] controlling the output. */
        get enable_blend(): boolean
        set enable_blend(value: boolean)
        
        /** Controls how the blend factor for the color channels is determined based on the source's fragments. */
        get src_color_blend_factor(): int64
        set src_color_blend_factor(value: int64)
        
        /** Controls how the blend factor for the color channels is determined based on the destination's fragments. */
        get dst_color_blend_factor(): int64
        set dst_color_blend_factor(value: int64)
        
        /** The blend mode to use for the red/green/blue color channels. */
        get color_blend_op(): int64
        set color_blend_op(value: int64)
        
        /** Controls how the blend factor for the alpha channel is determined based on the source's fragments. */
        get src_alpha_blend_factor(): int64
        set src_alpha_blend_factor(value: int64)
        
        /** Controls how the blend factor for the alpha channel is determined based on the destination's fragments. */
        get dst_alpha_blend_factor(): int64
        set dst_alpha_blend_factor(value: int64)
        
        /** The blend mode to use for the alpha channel. */
        get alpha_blend_op(): int64
        set alpha_blend_op(value: int64)
        
        /** If `true`, writes the new red color channel to the final result. */
        get write_r(): boolean
        set write_r(value: boolean)
        
        /** If `true`, writes the new green color channel to the final result. */
        get write_g(): boolean
        set write_g(value: boolean)
        
        /** If `true`, writes the new blue color channel to the final result. */
        get write_b(): boolean
        set write_b(value: boolean)
        
        /** If `true`, writes the new alpha channel to the final result. */
        get write_a(): boolean
        set write_a(value: boolean)
    }
    /** Pipeline depth/stencil state (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdpipelinedepthstencilstate.html  
     */
    class RDPipelineDepthStencilState extends RefCounted {
        constructor(identifier?: any)
        /** If `true`, enables depth testing which allows objects to be automatically occluded by other objects based on their depth. This also allows objects to be partially occluded by other objects. If `false`, objects will appear in the order they were drawn (like in Godot's 2D renderer). */
        get enable_depth_test(): boolean
        set enable_depth_test(value: boolean)
        
        /** If `true`, writes to the depth buffer whenever the depth test returns `true`. Only works when enable_depth_test is also `true`. */
        get enable_depth_write(): boolean
        set enable_depth_write(value: boolean)
        
        /** The method used for comparing the previous and current depth values. */
        get depth_compare_operator(): int64
        set depth_compare_operator(value: int64)
        
        /** If `true`, each depth value will be tested to see if it is between [member depth_range_min] and [member depth_range_max]. If it is outside of these values, it is discarded. */
        get enable_depth_range(): boolean
        set enable_depth_range(value: boolean)
        
        /** The minimum depth that returns `true` for [member enable_depth_range]. */
        get depth_range_min(): float64
        set depth_range_min(value: float64)
        
        /** The maximum depth that returns `true` for [member enable_depth_range]. */
        get depth_range_max(): float64
        set depth_range_max(value: float64)
        
        /** If `true`, enables stencil testing. There are separate stencil buffers for front-facing triangles and back-facing triangles. See properties that begin with "front_op" and properties with "back_op" for each. */
        get enable_stencil(): boolean
        set enable_stencil(value: boolean)
        
        /** The operation to perform on the stencil buffer for front pixels that fail the stencil test. */
        get front_op_fail(): int64
        set front_op_fail(value: int64)
        
        /** The operation to perform on the stencil buffer for front pixels that pass the stencil test. */
        get front_op_pass(): int64
        set front_op_pass(value: int64)
        
        /** The operation to perform on the stencil buffer for front pixels that pass the stencil test but fail the depth test. */
        get front_op_depth_fail(): int64
        set front_op_depth_fail(value: int64)
        
        /** The method used for comparing the previous front stencil value and [member front_op_reference]. */
        get front_op_compare(): int64
        set front_op_compare(value: int64)
        
        /** Selects which bits from the front stencil value will be compared. */
        get front_op_compare_mask(): int64
        set front_op_compare_mask(value: int64)
        
        /** Selects which bits from the front stencil value will be changed. */
        get front_op_write_mask(): int64
        set front_op_write_mask(value: int64)
        
        /** The value the previous front stencil value will be compared to. */
        get front_op_reference(): int64
        set front_op_reference(value: int64)
        
        /** The operation to perform on the stencil buffer for back pixels that fail the stencil test. */
        get back_op_fail(): int64
        set back_op_fail(value: int64)
        
        /** The operation to perform on the stencil buffer for back pixels that pass the stencil test. */
        get back_op_pass(): int64
        set back_op_pass(value: int64)
        
        /** The operation to perform on the stencil buffer for back pixels that pass the stencil test but fail the depth test. */
        get back_op_depth_fail(): int64
        set back_op_depth_fail(value: int64)
        
        /** The method used for comparing the previous back stencil value and [member back_op_reference]. */
        get back_op_compare(): int64
        set back_op_compare(value: int64)
        
        /** Selects which bits from the back stencil value will be compared. */
        get back_op_compare_mask(): int64
        set back_op_compare_mask(value: int64)
        
        /** Selects which bits from the back stencil value will be changed. */
        get back_op_write_mask(): int64
        set back_op_write_mask(value: int64)
        
        /** The value the previous back stencil value will be compared to. */
        get back_op_reference(): int64
        set back_op_reference(value: int64)
    }
    /** Pipeline multisample state (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdpipelinemultisamplestate.html  
     */
    class RDPipelineMultisampleState extends RefCounted {
        constructor(identifier?: any)
        /** The number of MSAA samples (or SSAA samples if [member enable_sample_shading] is `true`) to perform. Higher values result in better antialiasing, at the cost of performance. */
        get sample_count(): int64
        set sample_count(value: int64)
        
        /** If `true`, enables per-sample shading which replaces MSAA by SSAA. This provides higher quality antialiasing that works with transparent (alpha scissor) edges. This has a very high performance cost. See also [member min_sample_shading]. See the [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#primsrast-sampleshading]per-sample shading Vulkan documentation[/url] for more details. */
        get enable_sample_shading(): boolean
        set enable_sample_shading(value: boolean)
        
        /** The multiplier of [member sample_count] that determines how many samples are performed for each fragment. Must be between `0.0` and `1.0` (inclusive). Only effective if [member enable_sample_shading] is `true`. If [member min_sample_shading] is `1.0`, fragment invocation must only read from the coverage index sample. Tile image access must not be used if [member enable_sample_shading] is  *not*  `1.0`. */
        get min_sample_shading(): float64
        set min_sample_shading(value: float64)
        
        /** If `true`, alpha to coverage is enabled. This generates a temporary coverage value based on the alpha component of the fragment's first color output. This allows alpha transparency to make use of multisample antialiasing. */
        get enable_alpha_to_coverage(): boolean
        set enable_alpha_to_coverage(value: boolean)
        
        /** If `true`, alpha is forced to either `0.0` or `1.0`. This allows hardening the edges of antialiased alpha transparencies. Only relevant if [member enable_alpha_to_coverage] is `true`. */
        get enable_alpha_to_one(): boolean
        set enable_alpha_to_one(value: boolean)
        
        /** The sample mask array. See the [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#fragops-samplemask]sample mask Vulkan documentation[/url] for more details. */
        get sample_masks(): GArray
        set sample_masks(value: GArray)
    }
    /** Pipeline rasterization state (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdpipelinerasterizationstate.html  
     */
    class RDPipelineRasterizationState extends RefCounted {
        constructor(identifier?: any)
        /** If `true`, clamps depth values according to the minimum and maximum depth of the associated viewport. */
        get enable_depth_clamp(): boolean
        set enable_depth_clamp(value: boolean)
        
        /** If `true`, primitives are discarded immediately before the rasterization stage. */
        get discard_primitives(): boolean
        set discard_primitives(value: boolean)
        
        /** If `true`, performs wireframe rendering for triangles instead of flat or textured rendering. */
        get wireframe(): boolean
        set wireframe(value: boolean)
        
        /** The cull mode to use when drawing polygons, which determines whether front faces or backfaces are hidden. */
        get cull_mode(): int64
        set cull_mode(value: int64)
        
        /** The winding order to use to determine which face of a triangle is considered its front face. */
        get front_face(): int64
        set front_face(value: int64)
        
        /** If `true`, each generated depth value will by offset by some amount. The specific amount is generated per polygon based on the values of [member depth_bias_slope_factor] and [member depth_bias_constant_factor]. */
        get depth_bias_enabled(): boolean
        set depth_bias_enabled(value: boolean)
        
        /** A constant offset added to each depth value. Applied after [member depth_bias_slope_factor]. */
        get depth_bias_constant_factor(): float64
        set depth_bias_constant_factor(value: float64)
        
        /** A limit for how much each depth value can be offset. If negative, it serves as a minimum value, but if positive, it serves as a maximum value. */
        get depth_bias_clamp(): float64
        set depth_bias_clamp(value: float64)
        
        /** A constant scale applied to the slope of each polygons' depth. Applied before [member depth_bias_constant_factor]. */
        get depth_bias_slope_factor(): float64
        set depth_bias_slope_factor(value: float64)
        
        /** The line width to use when drawing lines (in pixels). Thick lines may not be supported on all hardware. */
        get line_width(): float64
        set line_width(value: float64)
        
        /** The number of control points to use when drawing a patch with tessellation enabled. Higher values result in higher quality at the cost of performance. */
        get patch_control_points(): int64
        set patch_control_points(value: int64)
    }
    /** Pipeline specialization constant (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdpipelinespecializationconstant.html  
     */
    class RDPipelineSpecializationConstant extends RefCounted {
        constructor(identifier?: any)
        /** The specialization constant's value. Only [bool], [int] and [float] types are valid for specialization constants. */
        get value(): any
        set value(value: any)
        
        /** The identifier of the specialization constant. This is a value starting from `0` and that increments for every different specialization constant for a given shader. */
        get constant_id(): int64
        set constant_id(value: int64)
    }
    /** Sampler state (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdsamplerstate.html  
     */
    class RDSamplerState extends RefCounted {
        constructor(identifier?: any)
        /** The sampler's magnification filter. It is the filtering method used when sampling texels that appear bigger than on-screen pixels. */
        get mag_filter(): int64
        set mag_filter(value: int64)
        
        /** The sampler's minification filter. It is the filtering method used when sampling texels that appear smaller than on-screen pixels. */
        get min_filter(): int64
        set min_filter(value: int64)
        
        /** The filtering method to use for mipmaps. */
        get mip_filter(): int64
        set mip_filter(value: int64)
        
        /** The repeat mode to use along the U axis of UV coordinates. This affects the returned values if sampling outside the UV bounds. */
        get repeat_u(): int64
        set repeat_u(value: int64)
        
        /** The repeat mode to use along the V axis of UV coordinates. This affects the returned values if sampling outside the UV bounds. */
        get repeat_v(): int64
        set repeat_v(value: int64)
        
        /** The repeat mode to use along the W axis of UV coordinates. This affects the returned values if sampling outside the UV bounds. Only effective for 3D samplers. */
        get repeat_w(): int64
        set repeat_w(value: int64)
        
        /** The mipmap LOD bias to use. Positive values will make the sampler blurrier at a given distance, while negative values will make the sampler sharper at a given distance (at the risk of looking grainy). Recommended values are between `-0.5` and `0.0`. Only effective if the sampler has mipmaps available. */
        get lod_bias(): float64
        set lod_bias(value: float64)
        
        /** If `true`, perform anisotropic sampling. See [member anisotropy_max]. */
        get use_anisotropy(): boolean
        set use_anisotropy(value: boolean)
        
        /** Maximum anisotropy that can be used when sampling. Only effective if [member use_anisotropy] is `true`. Higher values result in a sharper sampler at oblique angles, at the cost of performance (due to memory bandwidth). This value may be limited by the graphics hardware in use. Most graphics hardware only supports values up to `16.0`.  
         *  If [member anisotropy_max] is `1.0`, forcibly disables anisotropy even if [member use_anisotropy] is `true`.  
         */
        get anisotropy_max(): float64
        set anisotropy_max(value: float64)
        
        /** If `true`, returned values will be based on the comparison operation defined in [member compare_op]. This is a hardware-based approach and is therefore faster than performing this manually in a shader. For example, compare operations are used for shadow map rendering by comparing depth values from a shadow sampler. */
        get enable_compare(): boolean
        set enable_compare(value: boolean)
        
        /** The compare operation to use. Only effective if [member enable_compare] is `true`. */
        get compare_op(): int64
        set compare_op(value: int64)
        
        /** The minimum mipmap LOD bias to display (highest resolution). Only effective if the sampler has mipmaps available. */
        get min_lod(): float64
        set min_lod(value: float64)
        
        /** The maximum mipmap LOD bias to display (lowest resolution). Only effective if the sampler has mipmaps available. */
        get max_lod(): float64
        set max_lod(value: float64)
        
        /** The border color that will be returned when sampling outside the sampler's bounds and the [member repeat_u], [member repeat_v] or [member repeat_w] modes have repeating disabled. */
        get border_color(): int64
        set border_color(value: int64)
        
        /** If `true`, the texture will be sampled with coordinates ranging from 0 to the texture's resolution. Otherwise, the coordinates will be normalized and range from 0 to 1. */
        get unnormalized_uvw(): boolean
        set unnormalized_uvw(value: boolean)
    }
    /** Compiled shader file in SPIR-V form (used by [RenderingDevice]). Not to be confused with Godot's own [Shader].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdshaderfile.html  
     */
    class RDShaderFile extends Resource {
        constructor(identifier?: any)
        /** Sets the SPIR-V [param bytecode] that will be compiled for the specified [param version]. */
        set_bytecode(bytecode: RDShaderSPIRV, version: StringName = ''): void
        
        /** Returns the SPIR-V intermediate representation for the specified shader [param version]. */
        get_spirv(version: StringName = ''): RDShaderSPIRV
        
        /** Returns the list of compiled versions for this shader. */
        get_version_list(): GArray
        get _versions(): GDictionary
        set _versions(value: GDictionary)
        
        /** The base compilation error message, which indicates errors not related to a specific shader stage if non-empty. If empty, shader compilation is not necessarily successful (check [RDShaderSPIRV]'s error message members). */
        get base_error(): string
        set base_error(value: string)
    }
    /** SPIR-V intermediate representation as part of a [RDShaderFile] (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdshaderspirv.html  
     */
    class RDShaderSPIRV extends Resource {
        constructor(identifier?: any)
        /** Sets the SPIR-V [param bytecode] for the given shader [param stage]. Equivalent to setting one of [member bytecode_compute], [member bytecode_fragment], [member bytecode_tesselation_control], [member bytecode_tesselation_evaluation], [member bytecode_vertex]. */
        set_stage_bytecode(stage: RenderingDevice.ShaderStage, bytecode: PackedByteArray | byte[] | ArrayBuffer): void
        
        /** Equivalent to getting one of [member bytecode_compute], [member bytecode_fragment], [member bytecode_tesselation_control], [member bytecode_tesselation_evaluation], [member bytecode_vertex]. */
        get_stage_bytecode(stage: RenderingDevice.ShaderStage): PackedByteArray
        
        /** Sets the compilation error message for the given shader [param stage] to [param compile_error]. Equivalent to setting one of [member compile_error_compute], [member compile_error_fragment], [member compile_error_tesselation_control], [member compile_error_tesselation_evaluation], [member compile_error_vertex]. */
        set_stage_compile_error(stage: RenderingDevice.ShaderStage, compile_error: string): void
        
        /** Returns the compilation error message for the given shader [param stage]. Equivalent to getting one of [member compile_error_compute], [member compile_error_fragment], [member compile_error_tesselation_control], [member compile_error_tesselation_evaluation], [member compile_error_vertex]. */
        get_stage_compile_error(stage: RenderingDevice.ShaderStage): string
        
        /** The SPIR-V bytecode for the vertex shader stage. */
        get bytecode_vertex(): PackedByteArray
        set bytecode_vertex(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** The SPIR-V bytecode for the fragment shader stage. */
        get bytecode_fragment(): PackedByteArray
        set bytecode_fragment(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** The SPIR-V bytecode for the tessellation control shader stage. */
        get bytecode_tesselation_control(): PackedByteArray
        set bytecode_tesselation_control(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** The SPIR-V bytecode for the tessellation evaluation shader stage. */
        get bytecode_tesselation_evaluation(): PackedByteArray
        set bytecode_tesselation_evaluation(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** The SPIR-V bytecode for the compute shader stage. */
        get bytecode_compute(): PackedByteArray
        set bytecode_compute(value: PackedByteArray | byte[] | ArrayBuffer)
        
        /** The compilation error message for the vertex shader stage (set by the SPIR-V compiler and Godot). If empty, shader compilation was successful. */
        get compile_error_vertex(): string
        set compile_error_vertex(value: string)
        
        /** The compilation error message for the fragment shader stage (set by the SPIR-V compiler and Godot). If empty, shader compilation was successful. */
        get compile_error_fragment(): string
        set compile_error_fragment(value: string)
        
        /** The compilation error message for the tessellation control shader stage (set by the SPIR-V compiler and Godot). If empty, shader compilation was successful. */
        get compile_error_tesselation_control(): string
        set compile_error_tesselation_control(value: string)
        
        /** The compilation error message for the tessellation evaluation shader stage (set by the SPIR-V compiler and Godot). If empty, shader compilation was successful. */
        get compile_error_tesselation_evaluation(): string
        set compile_error_tesselation_evaluation(value: string)
        
        /** The compilation error message for the compute shader stage (set by the SPIR-V compiler and Godot). If empty, shader compilation was successful. */
        get compile_error_compute(): string
        set compile_error_compute(value: string)
    }
    /** Shader source code (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdshadersource.html  
     */
    class RDShaderSource extends RefCounted {
        constructor(identifier?: any)
        /** Sets [param source] code for the specified shader [param stage]. Equivalent to setting one of [member source_compute], [member source_fragment], [member source_tesselation_control], [member source_tesselation_evaluation] or [member source_vertex].  
         *      
         *  **Note:** If you set the compute shader source code using this method directly, remember to remove the Godot-specific hint `#[compute]`.  
         */
        set_stage_source(stage: RenderingDevice.ShaderStage, source: string): void
        
        /** Returns source code for the specified shader [param stage]. Equivalent to getting one of [member source_compute], [member source_fragment], [member source_tesselation_control], [member source_tesselation_evaluation] or [member source_vertex]. */
        get_stage_source(stage: RenderingDevice.ShaderStage): string
        
        /** Source code for the shader's vertex stage. */
        get source_vertex(): string
        set source_vertex(value: string)
        
        /** Source code for the shader's fragment stage. */
        get source_fragment(): string
        set source_fragment(value: string)
        
        /** Source code for the shader's tessellation control stage. */
        get source_tesselation_control(): string
        set source_tesselation_control(value: string)
        
        /** Source code for the shader's tessellation evaluation stage. */
        get source_tesselation_evaluation(): string
        set source_tesselation_evaluation(value: string)
        
        /** Source code for the shader's compute stage. */
        get source_compute(): string
        set source_compute(value: string)
        
        /** The language the shader is written in. */
        get language(): int64
        set language(value: int64)
    }
    /** Texture format (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdtextureformat.html  
     */
    class RDTextureFormat extends RefCounted {
        constructor(identifier?: any)
        /** Adds [param format] as a valid format for the corresponding [RDTextureView]'s [member RDTextureView.format_override] property. If any format is added as shareable, then the main [member format] must also be added. */
        add_shareable_format(format: RenderingDevice.DataFormat): void
        
        /** Removes [param format] from the list of valid formats that the corresponding [RDTextureView]'s [member RDTextureView.format_override] property can be set to. */
        remove_shareable_format(format: RenderingDevice.DataFormat): void
        
        /** The texture's pixel data format. */
        get format(): int64
        set format(value: int64)
        
        /** The texture's width (in pixels). */
        get width(): int64
        set width(value: int64)
        
        /** The texture's height (in pixels). */
        get height(): int64
        set height(value: int64)
        
        /** The texture's depth (in pixels). This is always `1` for 2D textures. */
        get depth(): int64
        set depth(value: int64)
        
        /** The number of layers in the texture. Only relevant for 2D texture arrays. */
        get array_layers(): int64
        set array_layers(value: int64)
        
        /** The number of mipmaps available in the texture. */
        get mipmaps(): int64
        set mipmaps(value: int64)
        
        /** The texture type. */
        get texture_type(): int64
        set texture_type(value: int64)
        
        /** The number of samples used when sampling the texture. */
        get samples(): int64
        set samples(value: int64)
        
        /** The texture's usage bits, which determine what can be done using the texture. */
        get usage_bits(): int64
        set usage_bits(value: int64)
        
        /** The texture will be used as the destination of a resolve operation. */
        get is_resolve_buffer(): boolean
        set is_resolve_buffer(value: boolean)
        
        /** If a texture is discardable, its contents do not need to be preserved between frames. This flag is only relevant when the texture is used as target in a draw list.  
         *  This information is used by [RenderingDevice] to figure out if a texture's contents can be discarded, eliminating unnecessary writes to memory and boosting performance.  
         */
        get is_discardable(): boolean
        set is_discardable(value: boolean)
    }
    /** Texture view (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdtextureview.html  
     */
    class RDTextureView extends RefCounted {
        constructor(identifier?: any)
        /** Optional override for the data format to return sampled values in. The corresponding [RDTextureFormat] must have had this added as a shareable format. The default value of [constant RenderingDevice.DATA_FORMAT_MAX] does not override the format. */
        get format_override(): int64
        set format_override(value: int64)
        
        /** The channel to sample when sampling the red color channel. */
        get swizzle_r(): int64
        set swizzle_r(value: int64)
        
        /** The channel to sample when sampling the green color channel. */
        get swizzle_g(): int64
        set swizzle_g(value: int64)
        
        /** The channel to sample when sampling the blue color channel. */
        get swizzle_b(): int64
        set swizzle_b(value: int64)
        
        /** The channel to sample when sampling the alpha channel. */
        get swizzle_a(): int64
        set swizzle_a(value: int64)
    }
    /** Shader uniform (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rduniform.html  
     */
    class RDUniform extends RefCounted {
        constructor(identifier?: any)
        /** Binds the given id to the uniform. The data associated with the id is then used when the uniform is passed to a shader. */
        add_id(id: RID): void
        
        /** Unbinds all ids currently bound to the uniform. */
        clear_ids(): void
        
        /** The uniform's data type. */
        get uniform_type(): int64
        set uniform_type(value: int64)
        
        /** The uniform's binding. */
        get binding(): int64
        set binding(value: int64)
        get _ids(): GArray
        set _ids(value: GArray)
    }
    /** Vertex attribute (used by [RenderingDevice]).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rdvertexattribute.html  
     */
    class RDVertexAttribute extends RefCounted {
        constructor(identifier?: any)
        /** The location in the shader that this attribute is bound to. */
        get location(): int64
        set location(value: int64)
        
        /** The number of bytes between the start of the vertex buffer and the first instance of this attribute. */
        get offset(): int64
        set offset(value: int64)
        
        /** The way that this attribute's data is interpreted when sent to a shader. */
        get format(): int64
        set format(value: int64)
        
        /** The number of bytes between the starts of consecutive instances of this attribute. */
        get stride(): int64
        set stride(value: int64)
        
        /** The rate at which this attribute is pulled from its vertex buffer. */
        get frequency(): int64
        set frequency(value: int64)
    }
    /** Provides methods for generating pseudo-random numbers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_randomnumbergenerator.html  
     */
    class RandomNumberGenerator extends RefCounted {
        constructor(identifier?: any)
        /** Returns a pseudo-random 32-bit unsigned integer between `0` and `4294967295` (inclusive). */
        randi(): int64
        
        /** Returns a pseudo-random float between `0.0` and `1.0` (inclusive). */
        randf(): float64
        
        /** Returns a [url=https://en.wikipedia.org/wiki/Normal_distribution]normally-distributed[/url], pseudo-random floating-point number from the specified [param mean] and a standard [param deviation]. This is also known as a Gaussian distribution.  
         *      
         *  **Note:** This method uses the [url=https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform]Box-Muller transform[/url] algorithm.  
         */
        randfn(mean: float64 = 0, deviation: float64 = 1): float64
        
        /** Returns a pseudo-random float between [param from] and [param to] (inclusive). */
        randf_range(from: float64, to: float64): float64
        
        /** Returns a pseudo-random 32-bit signed integer between [param from] and [param to] (inclusive). */
        randi_range(from: int64, to: int64): int64
        
        /** Returns a random index with non-uniform weights. Prints an error and returns `-1` if the array is empty.  
         *    
         */
        rand_weighted(weights: PackedFloat32Array | float32[]): int64
        
        /** Sets up a time-based seed for this [RandomNumberGenerator] instance. Unlike the [@GlobalScope] random number generation functions, different [RandomNumberGenerator] instances can use different seeds. */
        randomize(): void
        
        /** Initializes the random number generator state based on the given seed value. A given seed will give a reproducible sequence of pseudo-random numbers.  
         *      
         *  **Note:** The RNG does not have an avalanche effect, and can output similar random streams given similar seeds. Consider using a hash function to improve your seed quality if they're sourced externally.  
         *      
         *  **Note:** Setting this property produces a side effect of changing the internal [member state], so make sure to initialize the seed  *before*  modifying the [member state]:  
         *      
         *  **Note:** The default value of this property is pseudo-random, and changes when calling [method randomize]. The `0` value documented here is a placeholder, and not the actual default seed.  
         *    
         */
        get seed(): int64
        set seed(value: int64)
        
        /** The current state of the random number generator. Save and restore this property to restore the generator to a previous state:  
         *    
         *      
         *  **Note:** Do not set state to arbitrary values, since the random number generator requires the state to have certain qualities to behave properly. It should only be set to values that came from the state property itself. To initialize the random number generator with arbitrary input, use [member seed] instead.  
         *      
         *  **Note:** The default value of this property is pseudo-random, and changes when calling [method randomize]. The `0` value documented here is a placeholder, and not the actual default seed.  
         */
        get state(): int64
        set state(value: int64)
    }
    /** Abstract base class for controls that represent a number within a range.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_range.html  
     */
    class Range<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
        /** Called when the [Range]'s value is changed (following the same conditions as [signal value_changed]). */
        /* gdvirtual */ _value_changed(new_value: float64): void
        
        /** Sets the [Range]'s current value to the specified [param value], without emitting the [signal value_changed] signal. */
        set_value_no_signal(value: float64): void
        
        /** Binds two [Range]s together along with any ranges previously grouped with either of them. When any of range's member variables change, it will share the new value with all other ranges in its group. */
        share(with_: Node): void
        
        /** Stops the [Range] from sharing its member variables with any other. */
        unshare(): void
        
        /** Minimum value. Range is clamped if [member value] is less than [member min_value]. */
        get min_value(): float64
        set min_value(value: float64)
        
        /** Maximum value. Range is clamped if [member value] is greater than [member max_value]. */
        get max_value(): float64
        set max_value(value: float64)
        
        /** If greater than 0, [member value] will always be rounded to a multiple of this property's value. If [member rounded] is also `true`, [member value] will first be rounded to a multiple of this property's value, then rounded to the nearest integer. */
        get step(): float64
        set step(value: float64)
        
        /** Page size. Used mainly for [ScrollBar]. A [ScrollBar]'s grabber length is the [ScrollBar]'s size multiplied by [member page] over the difference between [member min_value] and [member max_value]. */
        get page(): float64
        set page(value: float64)
        
        /** Range's current value. Changing this property (even via code) will trigger [signal value_changed] signal. Use [method set_value_no_signal] if you want to avoid it. */
        get value(): float64
        set value(value: float64)
        
        /** The value mapped between 0 and 1. */
        get ratio(): float64
        set ratio(value: float64)
        
        /** If `true`, and [member min_value] is greater than 0, [member value] will be represented exponentially rather than linearly. */
        get exp_edit(): boolean
        set exp_edit(value: boolean)
        
        /** If `true`, [member value] will always be rounded to the nearest integer. */
        get rounded(): boolean
        set rounded(value: boolean)
        
        /** If `true`, [member value] may be greater than [member max_value]. */
        get allow_greater(): boolean
        set allow_greater(value: boolean)
        
        /** If `true`, [member value] may be less than [member min_value]. */
        get allow_lesser(): boolean
        set allow_lesser(value: boolean)
        
        /** Emitted when [member value] changes. When used on a [Slider], this is called continuously while dragging (potentially every frame). If you are performing an expensive operation in a function connected to [signal value_changed], consider using a  *debouncing*  [Timer] to call the function less often.  
         *      
         *  **Note:** Unlike signals such as [signal LineEdit.text_changed], [signal value_changed] is also emitted when [param value] is set directly via code.  
         */
        readonly value_changed: Signal1<float64>
        
        /** Emitted when [member min_value], [member max_value], [member page], or [member step] change. */
        readonly changed: Signal0
    }
    /** A ray in 2D space, used to find the first [CollisionObject2D] it intersects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_raycast2d.html  
     */
    class RayCast2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** Returns whether any object is intersecting with the ray's vector (considering the vector length). */
        is_colliding(): boolean
        
        /** Updates the collision information for the ray immediately, without waiting for the next `_physics_process` call. Use this method, for example, when the ray or its parent has changed state.  
         *      
         *  **Note:** [member enabled] does not need to be `true` for this to work.  
         */
        force_raycast_update(): void
        
        /** Returns the first object that the ray intersects, or `null` if no object is intersecting the ray (i.e. [method is_colliding] returns `false`). */
        get_collider(): Object
        
        /** Returns the [RID] of the first object that the ray intersects, or an empty [RID] if no object is intersecting the ray (i.e. [method is_colliding] returns `false`). */
        get_collider_rid(): RID
        
        /** Returns the shape ID of the first object that the ray intersects, or `0` if no object is intersecting the ray (i.e. [method is_colliding] returns `false`).  
         *  To get the intersected shape node, for a [CollisionObject2D] target, use:  
         *    
         */
        get_collider_shape(): int64
        
        /** Returns the collision point at which the ray intersects the closest object, in the global coordinate system. If [member hit_from_inside] is `true` and the ray starts inside of a collision shape, this function will return the origin point of the ray.  
         *      
         *  **Note:** Check that [method is_colliding] returns `true` before calling this method to ensure the returned point is valid and up-to-date.  
         */
        get_collision_point(): Vector2
        
        /** Returns the normal of the intersecting object's shape at the collision point, or `Vector2(0, 0)` if the ray starts inside the shape and [member hit_from_inside] is `true`.  
         *      
         *  **Note:** Check that [method is_colliding] returns `true` before calling this method to ensure the returned normal is valid and up-to-date.  
         */
        get_collision_normal(): Vector2
        
        /** Adds a collision exception so the ray does not report collisions with the specified [RID]. */
        add_exception_rid(rid: RID): void
        
        /** Adds a collision exception so the ray does not report collisions with the specified [CollisionObject2D] node. */
        add_exception(node: CollisionObject2D): void
        
        /** Removes a collision exception so the ray does report collisions with the specified [RID]. */
        remove_exception_rid(rid: RID): void
        
        /** Removes a collision exception so the ray does report collisions with the specified [CollisionObject2D] node. */
        remove_exception(node: CollisionObject2D): void
        
        /** Removes all collision exceptions for this ray. */
        clear_exceptions(): void
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** If `true`, collisions will be reported. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** If `true`, the parent node will be excluded from collision detection. */
        get exclude_parent(): boolean
        set exclude_parent(value: boolean)
        
        /** The ray's destination point, relative to the RayCast's `position`. */
        get target_position(): Vector2
        set target_position(value: Vector2)
        
        /** The ray's collision mask. Only objects in at least one collision layer enabled in the mask will be detected. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** If `true`, the ray will detect a hit when starting inside shapes. In this case the collision normal will be `Vector2(0, 0)`. Does not affect concave polygon shapes. */
        get hit_from_inside(): boolean
        set hit_from_inside(value: boolean)
        
        /** If `true`, collisions with [Area2D]s will be reported. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
        
        /** If `true`, collisions with [PhysicsBody2D]s will be reported. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
    }
    /** A ray in 3D space, used to find the first object it intersects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_raycast3d.html  
     */
    class RayCast3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** Returns whether any object is intersecting with the ray's vector (considering the vector length). */
        is_colliding(): boolean
        
        /** Updates the collision information for the ray immediately, without waiting for the next `_physics_process` call. Use this method, for example, when the ray or its parent has changed state.  
         *      
         *  **Note:** [member enabled] does not need to be `true` for this to work.  
         */
        force_raycast_update(): void
        
        /** Returns the first object that the ray intersects, or `null` if no object is intersecting the ray (i.e. [method is_colliding] returns `false`).  
         *      
         *  **Note:** This object is not guaranteed to be a [CollisionObject3D]. For example, if the ray intersects a [CSGShape3D] or a [GridMap], the method will return a [CSGShape3D] or [GridMap] instance.  
         */
        get_collider(): Object
        
        /** Returns the [RID] of the first object that the ray intersects, or an empty [RID] if no object is intersecting the ray (i.e. [method is_colliding] returns `false`). */
        get_collider_rid(): RID
        
        /** Returns the shape ID of the first object that the ray intersects, or `0` if no object is intersecting the ray (i.e. [method is_colliding] returns `false`).  
         *  To get the intersected shape node, for a [CollisionObject3D] target, use:  
         *    
         */
        get_collider_shape(): int64
        
        /** Returns the collision point at which the ray intersects the closest object, in the global coordinate system. If [member hit_from_inside] is `true` and the ray starts inside of a collision shape, this function will return the origin point of the ray.  
         *      
         *  **Note:** Check that [method is_colliding] returns `true` before calling this method to ensure the returned point is valid and up-to-date.  
         */
        get_collision_point(): Vector3
        
        /** Returns the normal of the intersecting object's shape at the collision point, or `Vector3(0, 0, 0)` if the ray starts inside the shape and [member hit_from_inside] is `true`.  
         *      
         *  **Note:** Check that [method is_colliding] returns `true` before calling this method to ensure the returned normal is valid and up-to-date.  
         */
        get_collision_normal(): Vector3
        
        /** Returns the collision object's face index at the collision point, or `-1` if the shape intersecting the ray is not a [ConcavePolygonShape3D]. */
        get_collision_face_index(): int64
        
        /** Adds a collision exception so the ray does not report collisions with the specified [RID]. */
        add_exception_rid(rid: RID): void
        
        /** Adds a collision exception so the ray does not report collisions with the specified [CollisionObject3D] node. */
        add_exception(node: CollisionObject3D): void
        
        /** Removes a collision exception so the ray does report collisions with the specified [RID]. */
        remove_exception_rid(rid: RID): void
        
        /** Removes a collision exception so the ray does report collisions with the specified [CollisionObject3D] node. */
        remove_exception(node: CollisionObject3D): void
        
        /** Removes all collision exceptions for this ray. */
        clear_exceptions(): void
        
        /** Based on [param value], enables or disables the specified layer in the [member collision_mask], given a [param layer_number] between 1 and 32. */
        set_collision_mask_value(layer_number: int64, value: boolean): void
        
        /** Returns whether or not the specified layer of the [member collision_mask] is enabled, given a [param layer_number] between 1 and 32. */
        get_collision_mask_value(layer_number: int64): boolean
        
        /** If `true`, collisions will be reported. */
        get enabled(): boolean
        set enabled(value: boolean)
        
        /** If `true`, collisions will be ignored for this RayCast3D's immediate parent. */
        get exclude_parent(): boolean
        set exclude_parent(value: boolean)
        
        /** The ray's destination point, relative to the RayCast's `position`. */
        get target_position(): Vector3
        set target_position(value: Vector3)
        
        /** The ray's collision mask. Only objects in at least one collision layer enabled in the mask will be detected. See [url=https://docs.godotengine.org/en/4.4/tutorials/physics/physics_introduction.html#collision-layers-and-masks]Collision layers and masks[/url] in the documentation for more information. */
        get collision_mask(): int64
        set collision_mask(value: int64)
        
        /** If `true`, the ray will detect a hit when starting inside shapes. In this case the collision normal will be `Vector3(0, 0, 0)`. Does not affect shapes with no volume like concave polygon or heightmap. */
        get hit_from_inside(): boolean
        set hit_from_inside(value: boolean)
        
        /** If `true`, the ray will hit back faces with concave polygon shapes with back face enabled or heightmap shapes. */
        get hit_back_faces(): boolean
        set hit_back_faces(value: boolean)
        
        /** If `true`, collisions with [Area3D]s will be reported. */
        get collide_with_areas(): boolean
        set collide_with_areas(value: boolean)
        
        /** If `true`, collisions with [PhysicsBody3D]s will be reported. */
        get collide_with_bodies(): boolean
        set collide_with_bodies(value: boolean)
        
        /** The custom color to use to draw the shape in the editor and at run-time if **Visible Collision Shapes** is enabled in the **Debug** menu. This color will be highlighted at run-time if the [RayCast3D] is colliding with something.  
         *  If set to `Color(0.0, 0.0, 0.0)` (by default), the color set in [member ProjectSettings.debug/shapes/collision/shape_color] is used.  
         */
        get debug_shape_custom_color(): Color
        set debug_shape_custom_color(value: Color)
        
        /** If set to `1`, a line is used as the debug shape. Otherwise, a truncated pyramid is drawn to represent the [RayCast3D]. Requires **Visible Collision Shapes** to be enabled in the **Debug** menu for the debug shape to be visible at run-time. */
        get debug_shape_thickness(): int64
        set debug_shape_thickness(value: int64)
    }
    class RayCast3DGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** A 2D rectangle shape used for physics collision.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_rectangleshape2d.html  
     */
    class RectangleShape2D extends Shape2D {
        constructor(identifier?: any)
        /** The rectangle's width and height. */
        get size(): Vector2
        set size(value: Vector2)
    }
    /** Base class for reference-counted objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_refcounted.html  
     */
    class RefCounted extends Object {
        constructor(identifier?: any)
        /** Initializes the internal reference counter. Use this only if you really know what you are doing.  
         *  Returns whether the initialization was successful.  
         */
        init_ref(): boolean
        
        /** Increments the internal reference counter. Use this only if you really know what you are doing.  
         *  Returns `true` if the increment was successful, `false` otherwise.  
         */
        reference(): boolean
        
        /** Decrements the internal reference counter. Use this only if you really know what you are doing.  
         *  Returns `true` if the object should be freed after the decrement, `false` otherwise.  
         */
        unreference(): boolean
        
        /** Returns the current reference count. */
        get_reference_count(): int64
    }
    /** A rectangle hint for designing UIs.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_referencerect.html  
     */
    class ReferenceRect<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
        /** Sets the border color of the [ReferenceRect]. */
        get border_color(): Color
        set border_color(value: Color)
        
        /** Sets the border width of the [ReferenceRect]. The border grows both inwards and outwards with respect to the rectangle box. */
        get border_width(): float64
        set border_width(value: float64)
        
        /** If `true`, the [ReferenceRect] will only be visible while in editor. Otherwise, [ReferenceRect] will be visible in the running project. */
        get editor_only(): boolean
        set editor_only(value: boolean)
    }
    namespace ReflectionProbe {
        enum UpdateMode {
            /** Update the probe once on the next frame (recommended for most objects). The corresponding radiance map will be generated over the following six frames. This takes more time to update than [constant UPDATE_ALWAYS], but it has a lower performance cost and can result in higher-quality reflections. The ReflectionProbe is updated when its transform changes, but not when nearby geometry changes. You can force a [ReflectionProbe] update by moving the [ReflectionProbe] slightly in any direction. */
            UPDATE_ONCE = 0,
            
            /** Update the probe every frame. This provides better results for fast-moving dynamic objects (such as cars). However, it has a significant performance cost. Due to the cost, it's recommended to only use one ReflectionProbe with [constant UPDATE_ALWAYS] at most per scene. For all other use cases, use [constant UPDATE_ONCE]. */
            UPDATE_ALWAYS = 1,
        }
        enum AmbientMode {
            /** Do not apply any ambient lighting inside the [ReflectionProbe]'s box defined by its [member size]. */
            AMBIENT_DISABLED = 0,
            
            /** Apply automatically-sourced environment lighting inside the [ReflectionProbe]'s box defined by its [member size]. */
            AMBIENT_ENVIRONMENT = 1,
            
            /** Apply custom ambient lighting inside the [ReflectionProbe]'s box defined by its [member size]. See [member ambient_color] and [member ambient_color_energy]. */
            AMBIENT_COLOR = 2,
        }
    }
    /** Captures its surroundings to create fast, accurate reflections from a given point.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_reflectionprobe.html  
     */
    class ReflectionProbe<Map extends Record<string, Node> = Record<string, Node>> extends VisualInstance3D<Map> {
        constructor(identifier?: any)
        /** Sets how frequently the [ReflectionProbe] is updated. Can be [constant UPDATE_ONCE] or [constant UPDATE_ALWAYS]. */
        get update_mode(): int64
        set update_mode(value: int64)
        
        /** Defines the reflection intensity. Intensity modulates the strength of the reflection. */
        get intensity(): float64
        set intensity(value: float64)
        
        /** Defines the distance in meters over which a probe blends into the scene. */
        get blend_distance(): float64
        set blend_distance(value: float64)
        
        /** The maximum distance away from the [ReflectionProbe] an object can be before it is culled. Decrease this to improve performance, especially when using the [constant UPDATE_ALWAYS] [member update_mode].  
         *      
         *  **Note:** The maximum reflection distance is always at least equal to the probe's extents. This means that decreasing [member max_distance] will not always cull objects from reflections, especially if the reflection probe's box defined by its [member size] is already large.  
         */
        get max_distance(): float64
        set max_distance(value: float64)
        
        /** The size of the reflection probe. The larger the size, the more space covered by the probe, which will lower the perceived resolution. It is best to keep the size only as large as you need it.  
         *      
         *  **Note:** To better fit areas that are not aligned to the grid, you can rotate the [ReflectionProbe] node.  
         */
        get size(): Vector3
        set size(value: Vector3)
        
        /** Sets the origin offset to be used when this [ReflectionProbe] is in [member box_projection] mode. This can be set to a non-zero value to ensure a reflection fits a rectangle-shaped room, while reducing the number of objects that "get in the way" of the reflection. */
        get origin_offset(): Vector3
        set origin_offset(value: Vector3)
        
        /** If `true`, enables box projection. This makes reflections look more correct in rectangle-shaped rooms by offsetting the reflection center depending on the camera's location.  
         *      
         *  **Note:** To better fit rectangle-shaped rooms that are not aligned to the grid, you can rotate the [ReflectionProbe] node.  
         */
        get box_projection(): boolean
        set box_projection(value: boolean)
        
        /** If `true`, reflections will ignore sky contribution. */
        get interior(): boolean
        set interior(value: boolean)
        
        /** If `true`, computes shadows in the reflection probe. This makes the reflection probe slower to render; you may want to disable this if using the [constant UPDATE_ALWAYS] [member update_mode]. */
        get enable_shadows(): boolean
        set enable_shadows(value: boolean)
        
        /** Sets the cull mask which determines what objects are drawn by this probe. Every [VisualInstance3D] with a layer included in this cull mask will be rendered by the probe. It is best to only include large objects which are likely to take up a lot of space in the reflection in order to save on rendering cost.  
         *  This can also be used to prevent an object from reflecting upon itself (for instance, a [ReflectionProbe] centered on a vehicle).  
         */
        get cull_mask(): int64
        set cull_mask(value: int64)
        
        /** Sets the reflection mask which determines what objects have reflections applied from this probe. Every [VisualInstance3D] with a layer included in this reflection mask will have reflections applied from this probe. See also [member cull_mask], which can be used to exclude objects from appearing in the reflection while still making them affected by the [ReflectionProbe]. */
        get reflection_mask(): int64
        set reflection_mask(value: int64)
        
        /** The automatic LOD bias to use for meshes rendered within the [ReflectionProbe] (this is analog to [member Viewport.mesh_lod_threshold]). Higher values will use less detailed versions of meshes that have LOD variations generated. If set to `0.0`, automatic LOD is disabled. Increase [member mesh_lod_threshold] to improve performance at the cost of geometry detail, especially when using the [constant UPDATE_ALWAYS] [member update_mode].  
         *      
         *  **Note:** [member mesh_lod_threshold] does not affect [GeometryInstance3D] visibility ranges (also known as "manual" LOD or hierarchical LOD).  
         */
        get mesh_lod_threshold(): float64
        set mesh_lod_threshold(value: float64)
        
        /** The ambient color to use within the [ReflectionProbe]'s box defined by its [member size]. The ambient color will smoothly blend with other [ReflectionProbe]s and the rest of the scene (outside the [ReflectionProbe]'s box defined by its [member size]). */
        get ambient_mode(): int64
        set ambient_mode(value: int64)
        
        /** The custom ambient color to use within the [ReflectionProbe]'s box defined by its [member size]. Only effective if [member ambient_mode] is [constant AMBIENT_COLOR]. */
        get ambient_color(): Color
        set ambient_color(value: Color)
        
        /** The custom ambient color energy to use within the [ReflectionProbe]'s box defined by its [member size]. Only effective if [member ambient_mode] is [constant AMBIENT_COLOR]. */
        get ambient_color_energy(): float64
        set ambient_color_energy(value: float64)
    }
    class ReflectionProbeGizmoPlugin extends EditorNode3DGizmoPlugin {
        constructor(identifier?: any)
    }
    /** Class for searching text for patterns using regular expressions.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_regex.html  
     */
    class RegEx extends RefCounted {
        constructor(identifier?: any)
        /** Creates and compiles a new [RegEx] object. See also [method compile]. */
        static create_from_string(pattern: string, show_error: boolean = true): RegEx
        
        /** This method resets the state of the object, as if it was freshly created. Namely, it unassigns the regular expression of this object. */
        clear(): void
        
        /** Compiles and assign the search pattern to use. Returns [constant OK] if the compilation is successful. If compilation fails, returns [constant FAILED] and when [param show_error] is `true`, details are printed to standard output. */
        compile(pattern: string, show_error: boolean = true): GError
        
        /** Searches the text for the compiled pattern. Returns a [RegExMatch] container of the first matching result if found, otherwise `null`.  
         *  The region to search within can be specified with [param offset] and [param end]. This is useful when searching for another match in the same [param subject] by calling this method again after a previous success. Note that setting these parameters differs from passing over a shortened string. For example, the start anchor `^` is not affected by [param offset], and the character before [param offset] will be checked for the word boundary `\b`.  
         */
        search(subject: string, offset: int64 = 0, end: int64 = -1): RegExMatch
        
        /** Searches the text for the compiled pattern. Returns an array of [RegExMatch] containers for each non-overlapping result. If no results were found, an empty array is returned instead.  
         *  The region to search within can be specified with [param offset] and [param end]. This is useful when searching for another match in the same [param subject] by calling this method again after a previous success. Note that setting these parameters differs from passing over a shortened string. For example, the start anchor `^` is not affected by [param offset], and the character before [param offset] will be checked for the word boundary `\b`.  
         */
        search_all(subject: string, offset: int64 = 0, end: int64 = -1): GArray
        
        /** Searches the text for the compiled pattern and replaces it with the specified string. Escapes and backreferences such as `$1` and `$name` are expanded and resolved. By default, only the first instance is replaced, but it can be changed for all instances (global replacement).  
         *  The region to search within can be specified with [param offset] and [param end]. This is useful when searching for another match in the same [param subject] by calling this method again after a previous success. Note that setting these parameters differs from passing over a shortened string. For example, the start anchor `^` is not affected by [param offset], and the character before [param offset] will be checked for the word boundary `\b`.  
         */
        sub(subject: string, replacement: string, all: boolean = false, offset: int64 = 0, end: int64 = -1): string
        
        /** Returns whether this object has a valid search pattern assigned. */
        is_valid(): boolean
        
        /** Returns the original search pattern that was compiled. */
        get_pattern(): string
        
        /** Returns the number of capturing groups in compiled pattern. */
        get_group_count(): int64
        
        /** Returns an array of names of named capturing groups in the compiled pattern. They are ordered by appearance. */
        get_names(): PackedStringArray
    }
    /** Contains the results of a [RegEx] search.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_regexmatch.html  
     */
    class RegExMatch extends RefCounted {
        constructor(identifier?: any)
        /** Returns the number of capturing groups. */
        get_group_count(): int64
        
        /** Returns the substring of the match from the source string. Capturing groups can be retrieved by providing its group number as an integer or its string name (if it's a named group). The default value of 0 refers to the whole pattern.  
         *  Returns an empty string if the group did not match or doesn't exist.  
         */
        get_string(name: any = <any> {}): string
        
        /** Returns the starting position of the match within the source string. The starting position of capturing groups can be retrieved by providing its group number as an integer or its string name (if it's a named group). The default value of 0 refers to the whole pattern.  
         *  Returns -1 if the group did not match or doesn't exist.  
         */
        get_start(name: any = <any> {}): int64
        
        /** Returns the end position of the match within the source string. The end position of capturing groups can be retrieved by providing its group number as an integer or its string name (if it's a named group). The default value of 0 refers to the whole pattern.  
         *  Returns -1 if the group did not match or doesn't exist.  
         */
        get_end(name: any = <any> {}): int64
        
        /** The source string used with the search pattern to find this matching result. */
        get subject(): string
        
        /** A dictionary of named groups and its corresponding group number. Only groups that were matched are included. If multiple groups have the same name, that name would refer to the first matching one. */
        get names(): GDictionary
        
        /** An [Array] of the match and its capturing groups. */
        get strings(): GArray
    }
    /** RemoteTransform2D pushes its own [Transform2D] to another [Node2D] derived node in the scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_remotetransform2d.html  
     */
    class RemoteTransform2D<Map extends Record<string, Node> = Record<string, Node>> extends Node2D<Map> {
        constructor(identifier?: any)
        /** [RemoteTransform2D] caches the remote node. It may not notice if the remote node disappears; [method force_update_cache] forces it to update the cache again. */
        force_update_cache(): void
        
        /** The [NodePath] to the remote node, relative to the RemoteTransform2D's position in the scene. */
        get remote_path(): NodePath
        set remote_path(value: NodePath | string)
        
        /** If `true`, global coordinates are used. If `false`, local coordinates are used. */
        get use_global_coordinates(): boolean
        set use_global_coordinates(value: boolean)
        
        /** If `true`, the remote node's position is updated. */
        get update_position(): boolean
        set update_position(value: boolean)
        
        /** If `true`, the remote node's rotation is updated. */
        get update_rotation(): boolean
        set update_rotation(value: boolean)
        
        /** If `true`, the remote node's scale is updated. */
        get update_scale(): boolean
        set update_scale(value: boolean)
    }
    /** RemoteTransform3D pushes its own [Transform3D] to another [Node3D] derived Node in the scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_remotetransform3d.html  
     */
    class RemoteTransform3D<Map extends Record<string, Node> = Record<string, Node>> extends Node3D<Map> {
        constructor(identifier?: any)
        /** [RemoteTransform3D] caches the remote node. It may not notice if the remote node disappears; [method force_update_cache] forces it to update the cache again. */
        force_update_cache(): void
        
        /** The [NodePath] to the remote node, relative to the RemoteTransform3D's position in the scene. */
        get remote_path(): NodePath
        set remote_path(value: NodePath | string)
        
        /** If `true`, global coordinates are used. If `false`, local coordinates are used. */
        get use_global_coordinates(): boolean
        set use_global_coordinates(value: boolean)
        
        /** If `true`, the remote node's position is updated. */
        get update_position(): boolean
        set update_position(value: boolean)
        
        /** If `true`, the remote node's rotation is updated. */
        get update_rotation(): boolean
        set update_rotation(value: boolean)
        
        /** If `true`, the remote node's scale is updated. */
        get update_scale(): boolean
        set update_scale(value: boolean)
    }
    class RenameDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        rename(): void
    }
    class RenderBufferCustomDataRD extends RefCounted {
        constructor(identifier?: any)
    }
    class RenderBufferDataForwardClustered extends RenderBufferCustomDataRD {
        constructor(identifier?: any)
    }
    class RenderBuffersGI extends RenderBufferCustomDataRD {
        constructor(identifier?: any)
    }
    /** Abstract render data object, holds frame data related to rendering a single frame of a viewport.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderdata.html  
     */
    class RenderData extends Object {
        constructor(identifier?: any)
        /** Returns the [RenderSceneBuffers] object managing the scene buffers for rendering this viewport. */
        get_render_scene_buffers(): RenderSceneBuffers
        
        /** Returns the [RenderSceneData] object managing this frames scene data. */
        get_render_scene_data(): RenderSceneData
        
        /** Returns the [RID] of the environment object in the [RenderingServer] being used to render this viewport. */
        get_environment(): RID
        
        /** Returns the [RID] of the camera attributes object in the [RenderingServer] being used to render this viewport. */
        get_camera_attributes(): RID
    }
    /** This class allows for a RenderData implementation to be made in GDExtension.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderdataextension.html  
     */
    class RenderDataExtension extends RenderData {
        constructor(identifier?: any)
        /** Implement this in GDExtension to return the implementation's [RenderSceneBuffers] object. */
        /* gdvirtual */ _get_render_scene_buffers(): RenderSceneBuffers
        
        /** Implement this in GDExtension to return the implementation's [RenderSceneDataExtension] object. */
        /* gdvirtual */ _get_render_scene_data(): RenderSceneData
        
        /** Implement this in GDExtension to return the [RID] of the implementation's environment object. */
        /* gdvirtual */ _get_environment(): RID
        
        /** Implement this in GDExtension to return the [RID] for the implementation's camera attributes object. */
        /* gdvirtual */ _get_camera_attributes(): RID
    }
    /** Render data implementation for the RenderingDevice based renderers.  
     *      
     *  **Note:** This is an internal rendering server object, do not instantiate this from script.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderdatard.html  
     */
    class RenderDataRD extends RenderData {
        constructor(identifier?: any)
    }
    /** Abstract scene buffers object, created for each viewport for which 3D rendering is done.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderscenebuffers.html  
     */
    class RenderSceneBuffers extends RefCounted {
        constructor(identifier?: any)
        /** This method is called by the rendering server when the associated viewports configuration is changed. It will discard the old buffers and recreate the internal buffers used. */
        configure(config: RenderSceneBuffersConfiguration): void
    }
    /** Configuration object used to setup a [RenderSceneBuffers] object.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderscenebuffersconfiguration.html  
     */
    class RenderSceneBuffersConfiguration extends RefCounted {
        constructor(identifier?: any)
        /** The render target associated with these buffer. */
        get render_target(): RID
        set render_target(value: RID)
        
        /** The size of the 3D render buffer used for rendering. */
        get internal_size(): Vector2i
        set internal_size(value: Vector2i)
        
        /** The target (upscale) size if scaling is used. */
        get target_size(): Vector2i
        set target_size(value: Vector2i)
        
        /** The number of views we're rendering. */
        get view_count(): int64
        set view_count(value: int64)
        
        /** The requested scaling mode with which we upscale/downscale if [member internal_size] and [member target_size] are not equal. */
        get scaling_3d_mode(): int64
        set scaling_3d_mode(value: int64)
        
        /** The MSAA mode we're using for 3D rendering. */
        get msaa_3d(): int64
        set msaa_3d(value: int64)
        
        /** The requested screen space AA applied in post processing. */
        get screen_space_aa(): int64
        set screen_space_aa(value: int64)
        
        /** FSR Sharpness applicable if FSR upscaling is used. */
        get fsr_sharpness(): boolean
        set fsr_sharpness(value: boolean)
        
        /** Bias applied to mipmaps. */
        get texture_mipmap_bias(): boolean
        set texture_mipmap_bias(value: boolean)
        
        /** Level of the anisotropic filter. */
        get anisotropic_filtering_level(): int64
        set anisotropic_filtering_level(value: int64)
    }
    /** This class allows for a RenderSceneBuffer implementation to be made in GDExtension.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderscenebuffersextension.html  
     */
    class RenderSceneBuffersExtension extends RenderSceneBuffers {
        constructor(identifier?: any)
        /** Implement this in GDExtension to handle the (re)sizing of a viewport. */
        /* gdvirtual */ _configure(config: RenderSceneBuffersConfiguration): void
        
        /** Implement this in GDExtension to record a new FSR sharpness value. */
        /* gdvirtual */ _set_fsr_sharpness(fsr_sharpness: float64): void
        
        /** Implement this in GDExtension to change the texture mipmap bias. */
        /* gdvirtual */ _set_texture_mipmap_bias(texture_mipmap_bias: float64): void
        
        /** Implement this in GDExtension to change the anisotropic filtering level. */
        /* gdvirtual */ _set_anisotropic_filtering_level(anisotropic_filtering_level: int64): void
        
        /** Implement this in GDExtension to react to the debanding flag changing. */
        /* gdvirtual */ _set_use_debanding(use_debanding: boolean): void
    }
    /** Render scene buffer implementation for the RenderingDevice based renderers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderscenebuffersrd.html  
     */
    class RenderSceneBuffersRD extends RenderSceneBuffers {
        constructor(identifier?: any)
        /** Returns `true` if a cached texture exists for this name. */
        has_texture(context: StringName, name: StringName): boolean
        
        /** Create a new texture with the given definition and cache this under the given name. Will return the existing texture if it already exists. */
        create_texture(context: StringName, name: StringName, data_format: RenderingDevice.DataFormat, usage_bits: int64, texture_samples: RenderingDevice.TextureSamples, size: Vector2i, layers: int64, mipmaps: int64, unique: boolean, discardable: boolean): RID
        
        /** Create a new texture using the given format and view and cache this under the given name. Will return the existing texture if it already exists. */
        create_texture_from_format(context: StringName, name: StringName, format: RDTextureFormat, view: RDTextureView, unique: boolean): RID
        
        /** Create a new texture view for an existing texture and cache this under the given [param view_name]. Will return the existing texture view if it already exists. Will error if the source texture doesn't exist. */
        create_texture_view(context: StringName, name: StringName, view_name: StringName, view: RDTextureView): RID
        
        /** Returns a cached texture with this name. */
        get_texture(context: StringName, name: StringName): RID
        
        /** Returns the texture format information with which a cached texture was created. */
        get_texture_format(context: StringName, name: StringName): RDTextureFormat
        
        /** Returns a specific slice (layer or mipmap) for a cached texture. */
        get_texture_slice(context: StringName, name: StringName, layer: int64, mipmap: int64, layers: int64, mipmaps: int64): RID
        
        /** Returns a specific view of a slice (layer or mipmap) for a cached texture. */
        get_texture_slice_view(context: StringName, name: StringName, layer: int64, mipmap: int64, layers: int64, mipmaps: int64, view: RDTextureView): RID
        
        /** Returns the texture size of a given slice of a cached texture. */
        get_texture_slice_size(context: StringName, name: StringName, mipmap: int64): Vector2i
        
        /** Frees all buffers related to this context. */
        clear_context(context: StringName): void
        
        /** Returns the color texture we are rendering 3D content to. If multiview is used this will be a texture array with all views.  
         *  If [param msaa] is `true` and MSAA is enabled, this returns the MSAA variant of the buffer.  
         */
        get_color_texture(msaa: boolean = false): RID
        
        /** Returns the specified layer from the color texture we are rendering 3D content to.  
         *  If [param msaa] is `true` and MSAA is enabled, this returns the MSAA variant of the buffer.  
         */
        get_color_layer(layer: int64, msaa: boolean = false): RID
        
        /** Returns the depth texture we are rendering 3D content to. If multiview is used this will be a texture array with all views.  
         *  If [param msaa] is `true` and MSAA is enabled, this returns the MSAA variant of the buffer.  
         */
        get_depth_texture(msaa: boolean = false): RID
        
        /** Returns the specified layer from the depth texture we are rendering 3D content to.  
         *  If [param msaa] is `true` and MSAA is enabled, this returns the MSAA variant of the buffer.  
         */
        get_depth_layer(layer: int64, msaa: boolean = false): RID
        
        /** Returns the velocity texture we are rendering 3D content to. If multiview is used this will be a texture array with all views.  
         *  If [param msaa] is **true** and MSAA is enabled, this returns the MSAA variant of the buffer.  
         */
        get_velocity_texture(msaa: boolean = false): RID
        
        /** Returns the specified layer from the velocity texture we are rendering 3D content to. */
        get_velocity_layer(layer: int64, msaa: boolean = false): RID
        
        /** Returns the render target associated with this buffers object. */
        get_render_target(): RID
        
        /** Returns the view count for the associated viewport. */
        get_view_count(): int64
        
        /** Returns the internal size of the render buffer (size before upscaling) with which textures are created by default. */
        get_internal_size(): Vector2i
        
        /** Returns the target size of the render buffer (size after upscaling). */
        get_target_size(): Vector2i
        
        /** Returns the scaling mode used for upscaling. */
        get_scaling_3d_mode(): RenderingServer.ViewportScaling3DMode
        
        /** Returns the FSR sharpness value used while rendering the 3D content (if [method get_scaling_3d_mode] is an FSR mode). */
        get_fsr_sharpness(): float64
        
        /** Returns the applied 3D MSAA mode for this viewport. */
        get_msaa_3d(): RenderingServer.ViewportMSAA
        
        /** Returns the number of MSAA samples used. */
        get_texture_samples(): RenderingDevice.TextureSamples
        
        /** Returns the screen-space antialiasing method applied. */
        get_screen_space_aa(): RenderingServer.ViewportScreenSpaceAA
        
        /** Returns `true` if TAA is enabled. */
        get_use_taa(): boolean
        
        /** Returns `true` if debanding is enabled. */
        get_use_debanding(): boolean
    }
    /** Abstract render data object, holds scene data related to rendering a single frame of a viewport.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderscenedata.html  
     */
    class RenderSceneData extends Object {
        constructor(identifier?: any)
        /** Returns the camera transform used to render this frame.  
         *      
         *  **Note:** If more than one view is rendered, this will return a centered transform.  
         */
        get_cam_transform(): Transform3D
        
        /** Returns the camera projection used to render this frame.  
         *      
         *  **Note:** If more than one view is rendered, this will return a combined projection.  
         */
        get_cam_projection(): Projection
        
        /** Returns the number of views being rendered. */
        get_view_count(): int64
        
        /** Returns the eye offset per view used to render this frame. This is the offset between our camera transform and the eye transform. */
        get_view_eye_offset(view: int64): Vector3
        
        /** Returns the view projection per view used to render this frame.  
         *      
         *  **Note:** If a single view is rendered, this returns the camera projection. If more than one view is rendered, this will return a projection for the given view including the eye offset.  
         */
        get_view_projection(view: int64): Projection
        
        /** Return the [RID] of the uniform buffer containing the scene data as a UBO. */
        get_uniform_buffer(): RID
    }
    /** This class allows for a RenderSceneData implementation to be made in GDExtension.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderscenedataextension.html  
     */
    class RenderSceneDataExtension extends RenderSceneData {
        constructor(identifier?: any)
        /** Implement this in GDExtension to return the camera [Transform3D]. */
        /* gdvirtual */ _get_cam_transform(): Transform3D
        
        /** Implement this in GDExtension to return the camera [Projection]. */
        /* gdvirtual */ _get_cam_projection(): Projection
        
        /** Implement this in GDExtension to return the view count. */
        /* gdvirtual */ _get_view_count(): int64
        
        /** Implement this in GDExtension to return the eye offset for the given [param view]. */
        /* gdvirtual */ _get_view_eye_offset(view: int64): Vector3
        
        /** Implement this in GDExtension to return the view [Projection] for the given [param view]. */
        /* gdvirtual */ _get_view_projection(view: int64): Projection
        
        /** Implement this in GDExtension to return the [RID] of the uniform buffer containing the scene data as a UBO. */
        /* gdvirtual */ _get_uniform_buffer(): RID
    }
    /** Render scene data implementation for the RenderingDevice based renderers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderscenedatard.html  
     */
    class RenderSceneDataRD extends RenderSceneData {
        constructor(identifier?: any)
    }
    namespace RenderingDevice {
        enum DeviceType {
            /** Rendering device type does not match any of the other enum values or is unknown. */
            DEVICE_TYPE_OTHER = 0,
            
            /** Rendering device is an integrated GPU, which is typically  *(but not always)*  slower than dedicated GPUs ([constant DEVICE_TYPE_DISCRETE_GPU]). On Android and iOS, the rendering device type is always considered to be [constant DEVICE_TYPE_INTEGRATED_GPU]. */
            DEVICE_TYPE_INTEGRATED_GPU = 1,
            
            /** Rendering device is a dedicated GPU, which is typically  *(but not always)*  faster than integrated GPUs ([constant DEVICE_TYPE_INTEGRATED_GPU]). */
            DEVICE_TYPE_DISCRETE_GPU = 2,
            
            /** Rendering device is an emulated GPU in a virtual environment. This is typically much slower than the host GPU, which means the expected performance level on a dedicated GPU will be roughly equivalent to [constant DEVICE_TYPE_INTEGRATED_GPU]. Virtual machine GPU passthrough (such as VFIO) will not report the device type as [constant DEVICE_TYPE_VIRTUAL_GPU]. Instead, the host GPU's device type will be reported as if the GPU was not emulated. */
            DEVICE_TYPE_VIRTUAL_GPU = 3,
            
            /** Rendering device is provided by software emulation (such as Lavapipe or [url=https://github.com/google/swiftshader]SwiftShader[/url]). This is the slowest kind of rendering device available; it's typically much slower than [constant DEVICE_TYPE_INTEGRATED_GPU]. */
            DEVICE_TYPE_CPU = 4,
            
            /** Represents the size of the [enum DeviceType] enum. */
            DEVICE_TYPE_MAX = 5,
        }
        enum DriverResource {
            /** Specific device object based on a physical device.  
             *  - Vulkan: Vulkan device driver resource (`VkDevice`). (`rid` argument doesn't apply.)  
             */
            DRIVER_RESOURCE_LOGICAL_DEVICE = 0,
            
            /** Physical device the specific logical device is based on.  
             *  - Vulkan: `VkDevice`. (`rid` argument doesn't apply.)  
             */
            DRIVER_RESOURCE_PHYSICAL_DEVICE = 1,
            
            /** Top-most graphics API entry object.  
             *  - Vulkan: `VkInstance`. (`rid` argument doesn't apply.)  
             */
            DRIVER_RESOURCE_TOPMOST_OBJECT = 2,
            
            /** The main graphics-compute command queue.  
             *  - Vulkan: `VkQueue`. (`rid` argument doesn't apply.)  
             */
            DRIVER_RESOURCE_COMMAND_QUEUE = 3,
            
            /** The specific family the main queue belongs to.  
             *  - Vulkan: the queue family index, an `uint32_t`. (`rid` argument doesn't apply.)  
             */
            DRIVER_RESOURCE_QUEUE_FAMILY = 4,
            
            /** - Vulkan: `VkImage`. */
            DRIVER_RESOURCE_TEXTURE = 5,
            
            /** The view of an owned or shared texture.  
             *  - Vulkan: `VkImageView`.  
             */
            DRIVER_RESOURCE_TEXTURE_VIEW = 6,
            
            /** The native id of the data format of the texture.  
             *  - Vulkan: `VkFormat`.  
             */
            DRIVER_RESOURCE_TEXTURE_DATA_FORMAT = 7,
            
            /** - Vulkan: `VkSampler`. */
            DRIVER_RESOURCE_SAMPLER = 8,
            
            /** - Vulkan: `VkDescriptorSet`. */
            DRIVER_RESOURCE_UNIFORM_SET = 9,
            
            /** Buffer of any kind of (storage, vertex, etc.).  
             *  - Vulkan: `VkBuffer`.  
             */
            DRIVER_RESOURCE_BUFFER = 10,
            
            /** - Vulkan: `VkPipeline`. */
            DRIVER_RESOURCE_COMPUTE_PIPELINE = 11,
            
            /** - Vulkan: `VkPipeline`. */
            DRIVER_RESOURCE_RENDER_PIPELINE = 12,
            DRIVER_RESOURCE_VULKAN_DEVICE = 0,
            DRIVER_RESOURCE_VULKAN_PHYSICAL_DEVICE = 1,
            DRIVER_RESOURCE_VULKAN_INSTANCE = 2,
            DRIVER_RESOURCE_VULKAN_QUEUE = 3,
            DRIVER_RESOURCE_VULKAN_QUEUE_FAMILY_INDEX = 4,
            DRIVER_RESOURCE_VULKAN_IMAGE = 5,
            DRIVER_RESOURCE_VULKAN_IMAGE_VIEW = 6,
            DRIVER_RESOURCE_VULKAN_IMAGE_NATIVE_TEXTURE_FORMAT = 7,
            DRIVER_RESOURCE_VULKAN_SAMPLER = 8,
            DRIVER_RESOURCE_VULKAN_DESCRIPTOR_SET = 9,
            DRIVER_RESOURCE_VULKAN_BUFFER = 10,
            DRIVER_RESOURCE_VULKAN_COMPUTE_PIPELINE = 11,
            DRIVER_RESOURCE_VULKAN_RENDER_PIPELINE = 12,
        }
        enum DataFormat {
            /** 4-bit-per-channel red/green channel data format, packed into 8 bits. Values are in the `[0.0, 1.0]` range.  
             *      
             *  **Note:** More information on all data formats can be found on the [url=https://registry.khronos.org/vulkan/specs/1.1/html/vkspec.html#_identification_of_formats]Identification of formats[/url] section of the Vulkan specification, as well as the [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VkFormat.html]VkFormat[/url] enum.  
             */
            DATA_FORMAT_R4G4_UNORM_PACK8 = 0,
            
            /** 4-bit-per-channel red/green/blue/alpha channel data format, packed into 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R4G4B4A4_UNORM_PACK16 = 1,
            
            /** 4-bit-per-channel blue/green/red/alpha channel data format, packed into 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_B4G4R4A4_UNORM_PACK16 = 2,
            
            /** Red/green/blue channel data format with 5 bits of red, 6 bits of green and 5 bits of blue, packed into 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R5G6B5_UNORM_PACK16 = 3,
            
            /** Blue/green/red channel data format with 5 bits of blue, 6 bits of green and 5 bits of red, packed into 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_B5G6R5_UNORM_PACK16 = 4,
            
            /** Red/green/blue/alpha channel data format with 5 bits of red, 6 bits of green, 5 bits of blue and 1 bit of alpha, packed into 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R5G5B5A1_UNORM_PACK16 = 5,
            
            /** Blue/green/red/alpha channel data format with 5 bits of blue, 6 bits of green, 5 bits of red and 1 bit of alpha, packed into 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_B5G5R5A1_UNORM_PACK16 = 6,
            
            /** Alpha/red/green/blue channel data format with 1 bit of alpha, 5 bits of red, 6 bits of green and 5 bits of blue, packed into 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_A1R5G5B5_UNORM_PACK16 = 7,
            
            /** 8-bit-per-channel unsigned floating-point red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R8_UNORM = 8,
            
            /** 8-bit-per-channel signed floating-point red channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_R8_SNORM = 9,
            
            /** 8-bit-per-channel unsigned floating-point red channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 255.0]` range. */
            DATA_FORMAT_R8_USCALED = 10,
            
            /** 8-bit-per-channel signed floating-point red channel data format with scaled value (value is converted from integer to float). Values are in the `[-127.0, 127.0]` range. */
            DATA_FORMAT_R8_SSCALED = 11,
            
            /** 8-bit-per-channel unsigned integer red channel data format. Values are in the `[0, 255]` range. */
            DATA_FORMAT_R8_UINT = 12,
            
            /** 8-bit-per-channel signed integer red channel data format. Values are in the `[-127, 127]` range. */
            DATA_FORMAT_R8_SINT = 13,
            
            /** 8-bit-per-channel unsigned floating-point red channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R8_SRGB = 14,
            
            /** 8-bit-per-channel unsigned floating-point red/green channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R8G8_UNORM = 15,
            
            /** 8-bit-per-channel signed floating-point red/green channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_R8G8_SNORM = 16,
            
            /** 8-bit-per-channel unsigned floating-point red/green channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 255.0]` range. */
            DATA_FORMAT_R8G8_USCALED = 17,
            
            /** 8-bit-per-channel signed floating-point red/green channel data format with scaled value (value is converted from integer to float). Values are in the `[-127.0, 127.0]` range. */
            DATA_FORMAT_R8G8_SSCALED = 18,
            
            /** 8-bit-per-channel unsigned integer red/green channel data format. Values are in the `[0, 255]` range. */
            DATA_FORMAT_R8G8_UINT = 19,
            
            /** 8-bit-per-channel signed integer red/green channel data format. Values are in the `[-127, 127]` range. */
            DATA_FORMAT_R8G8_SINT = 20,
            
            /** 8-bit-per-channel unsigned floating-point red/green channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R8G8_SRGB = 21,
            
            /** 8-bit-per-channel unsigned floating-point red/green/blue channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R8G8B8_UNORM = 22,
            
            /** 8-bit-per-channel signed floating-point red/green/blue channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_R8G8B8_SNORM = 23,
            
            /** 8-bit-per-channel unsigned floating-point red/green/blue channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 255.0]` range. */
            DATA_FORMAT_R8G8B8_USCALED = 24,
            
            /** 8-bit-per-channel signed floating-point red/green/blue channel data format with scaled value (value is converted from integer to float). Values are in the `[-127.0, 127.0]` range. */
            DATA_FORMAT_R8G8B8_SSCALED = 25,
            
            /** 8-bit-per-channel unsigned integer red/green/blue channel data format. Values are in the `[0, 255]` range. */
            DATA_FORMAT_R8G8B8_UINT = 26,
            
            /** 8-bit-per-channel signed integer red/green/blue channel data format. Values are in the `[-127, 127]` range. */
            DATA_FORMAT_R8G8B8_SINT = 27,
            
            /** 8-bit-per-channel unsigned floating-point red/green/blue/blue channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R8G8B8_SRGB = 28,
            
            /** 8-bit-per-channel unsigned floating-point blue/green/red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_B8G8R8_UNORM = 29,
            
            /** 8-bit-per-channel signed floating-point blue/green/red channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_B8G8R8_SNORM = 30,
            
            /** 8-bit-per-channel unsigned floating-point blue/green/red channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 255.0]` range. */
            DATA_FORMAT_B8G8R8_USCALED = 31,
            
            /** 8-bit-per-channel signed floating-point blue/green/red channel data format with scaled value (value is converted from integer to float). Values are in the `[-127.0, 127.0]` range. */
            DATA_FORMAT_B8G8R8_SSCALED = 32,
            
            /** 8-bit-per-channel unsigned integer blue/green/red channel data format. Values are in the `[0, 255]` range. */
            DATA_FORMAT_B8G8R8_UINT = 33,
            
            /** 8-bit-per-channel signed integer blue/green/red channel data format. Values are in the `[-127, 127]` range. */
            DATA_FORMAT_B8G8R8_SINT = 34,
            
            /** 8-bit-per-channel unsigned floating-point blue/green/red data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_B8G8R8_SRGB = 35,
            
            /** 8-bit-per-channel unsigned floating-point red/green/blue/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R8G8B8A8_UNORM = 36,
            
            /** 8-bit-per-channel signed floating-point red/green/blue/alpha channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_R8G8B8A8_SNORM = 37,
            
            /** 8-bit-per-channel unsigned floating-point red/green/blue/alpha channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 255.0]` range. */
            DATA_FORMAT_R8G8B8A8_USCALED = 38,
            
            /** 8-bit-per-channel signed floating-point red/green/blue/alpha channel data format with scaled value (value is converted from integer to float). Values are in the `[-127.0, 127.0]` range. */
            DATA_FORMAT_R8G8B8A8_SSCALED = 39,
            
            /** 8-bit-per-channel unsigned integer red/green/blue/alpha channel data format. Values are in the `[0, 255]` range. */
            DATA_FORMAT_R8G8B8A8_UINT = 40,
            
            /** 8-bit-per-channel signed integer red/green/blue/alpha channel data format. Values are in the `[-127, 127]` range. */
            DATA_FORMAT_R8G8B8A8_SINT = 41,
            
            /** 8-bit-per-channel unsigned floating-point red/green/blue/alpha channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R8G8B8A8_SRGB = 42,
            
            /** 8-bit-per-channel unsigned floating-point blue/green/red/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_B8G8R8A8_UNORM = 43,
            
            /** 8-bit-per-channel signed floating-point blue/green/red/alpha channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_B8G8R8A8_SNORM = 44,
            
            /** 8-bit-per-channel unsigned floating-point blue/green/red/alpha channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 255.0]` range. */
            DATA_FORMAT_B8G8R8A8_USCALED = 45,
            
            /** 8-bit-per-channel signed floating-point blue/green/red/alpha channel data format with scaled value (value is converted from integer to float). Values are in the `[-127.0, 127.0]` range. */
            DATA_FORMAT_B8G8R8A8_SSCALED = 46,
            
            /** 8-bit-per-channel unsigned integer blue/green/red/alpha channel data format. Values are in the `[0, 255]` range. */
            DATA_FORMAT_B8G8R8A8_UINT = 47,
            
            /** 8-bit-per-channel signed integer blue/green/red/alpha channel data format. Values are in the `[-127, 127]` range. */
            DATA_FORMAT_B8G8R8A8_SINT = 48,
            
            /** 8-bit-per-channel unsigned floating-point blue/green/red/alpha channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_B8G8R8A8_SRGB = 49,
            
            /** 8-bit-per-channel unsigned floating-point alpha/red/green/blue channel data format with normalized value, packed in 32 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_A8B8G8R8_UNORM_PACK32 = 50,
            
            /** 8-bit-per-channel signed floating-point alpha/red/green/blue channel data format with normalized value, packed in 32 bits. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_A8B8G8R8_SNORM_PACK32 = 51,
            
            /** 8-bit-per-channel unsigned floating-point alpha/red/green/blue channel data format with scaled value (value is converted from integer to float), packed in 32 bits. Values are in the `[0.0, 255.0]` range. */
            DATA_FORMAT_A8B8G8R8_USCALED_PACK32 = 52,
            
            /** 8-bit-per-channel signed floating-point alpha/red/green/blue channel data format with scaled value (value is converted from integer to float), packed in 32 bits. Values are in the `[-127.0, 127.0]` range. */
            DATA_FORMAT_A8B8G8R8_SSCALED_PACK32 = 53,
            
            /** 8-bit-per-channel unsigned integer alpha/red/green/blue channel data format, packed in 32 bits. Values are in the `[0, 255]` range. */
            DATA_FORMAT_A8B8G8R8_UINT_PACK32 = 54,
            
            /** 8-bit-per-channel signed integer alpha/red/green/blue channel data format, packed in 32 bits. Values are in the `[-127, 127]` range. */
            DATA_FORMAT_A8B8G8R8_SINT_PACK32 = 55,
            
            /** 8-bit-per-channel unsigned floating-point alpha/red/green/blue channel data format with normalized value and non-linear sRGB encoding, packed in 32 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_A8B8G8R8_SRGB_PACK32 = 56,
            
            /** Unsigned floating-point alpha/red/green/blue channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of red, 10 bits of green and 10 bits of blue. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_A2R10G10B10_UNORM_PACK32 = 57,
            
            /** Signed floating-point alpha/red/green/blue channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of red, 10 bits of green and 10 bits of blue. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_A2R10G10B10_SNORM_PACK32 = 58,
            
            /** Unsigned floating-point alpha/red/green/blue channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of red, 10 bits of green and 10 bits of blue. Values are in the `[0.0, 1023.0]` range for red/green/blue and `[0.0, 3.0]` for alpha. */
            DATA_FORMAT_A2R10G10B10_USCALED_PACK32 = 59,
            
            /** Signed floating-point alpha/red/green/blue channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of red, 10 bits of green and 10 bits of blue. Values are in the `[-511.0, 511.0]` range for red/green/blue and `[-1.0, 1.0]` for alpha. */
            DATA_FORMAT_A2R10G10B10_SSCALED_PACK32 = 60,
            
            /** Unsigned integer alpha/red/green/blue channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of red, 10 bits of green and 10 bits of blue. Values are in the `[0, 1023]` range for red/green/blue and `[0, 3]` for alpha. */
            DATA_FORMAT_A2R10G10B10_UINT_PACK32 = 61,
            
            /** Signed integer alpha/red/green/blue channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of red, 10 bits of green and 10 bits of blue. Values are in the `[-511, 511]` range for red/green/blue and `[-1, 1]` for alpha. */
            DATA_FORMAT_A2R10G10B10_SINT_PACK32 = 62,
            
            /** Unsigned floating-point alpha/blue/green/red channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of blue, 10 bits of green and 10 bits of red. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_A2B10G10R10_UNORM_PACK32 = 63,
            
            /** Signed floating-point alpha/blue/green/red channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of blue, 10 bits of green and 10 bits of red. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_A2B10G10R10_SNORM_PACK32 = 64,
            
            /** Unsigned floating-point alpha/blue/green/red channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of blue, 10 bits of green and 10 bits of red. Values are in the `[0.0, 1023.0]` range for blue/green/red and `[0.0, 3.0]` for alpha. */
            DATA_FORMAT_A2B10G10R10_USCALED_PACK32 = 65,
            
            /** Signed floating-point alpha/blue/green/red channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of blue, 10 bits of green and 10 bits of red. Values are in the `[-511.0, 511.0]` range for blue/green/red and `[-1.0, 1.0]` for alpha. */
            DATA_FORMAT_A2B10G10R10_SSCALED_PACK32 = 66,
            
            /** Unsigned integer alpha/blue/green/red channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of blue, 10 bits of green and 10 bits of red. Values are in the `[0, 1023]` range for blue/green/red and `[0, 3]` for alpha. */
            DATA_FORMAT_A2B10G10R10_UINT_PACK32 = 67,
            
            /** Signed integer alpha/blue/green/red channel data format with normalized value, packed in 32 bits. Format contains 2 bits of alpha, 10 bits of blue, 10 bits of green and 10 bits of red. Values are in the `[-511, 511]` range for blue/green/red and `[-1, 1]` for alpha. */
            DATA_FORMAT_A2B10G10R10_SINT_PACK32 = 68,
            
            /** 16-bit-per-channel unsigned floating-point red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R16_UNORM = 69,
            
            /** 16-bit-per-channel signed floating-point red channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_R16_SNORM = 70,
            
            /** 16-bit-per-channel unsigned floating-point red channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 65535.0]` range. */
            DATA_FORMAT_R16_USCALED = 71,
            
            /** 16-bit-per-channel signed floating-point red channel data format with scaled value (value is converted from integer to float). Values are in the `[-32767.0, 32767.0]` range. */
            DATA_FORMAT_R16_SSCALED = 72,
            
            /** 16-bit-per-channel unsigned integer red channel data format. Values are in the `[0.0, 65535]` range. */
            DATA_FORMAT_R16_UINT = 73,
            
            /** 16-bit-per-channel signed integer red channel data format. Values are in the `[-32767, 32767]` range. */
            DATA_FORMAT_R16_SINT = 74,
            
            /** 16-bit-per-channel signed floating-point red channel data format with the value stored as-is. */
            DATA_FORMAT_R16_SFLOAT = 75,
            
            /** 16-bit-per-channel unsigned floating-point red/green channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R16G16_UNORM = 76,
            
            /** 16-bit-per-channel signed floating-point red/green channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_R16G16_SNORM = 77,
            
            /** 16-bit-per-channel unsigned floating-point red/green channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 65535.0]` range. */
            DATA_FORMAT_R16G16_USCALED = 78,
            
            /** 16-bit-per-channel signed floating-point red/green channel data format with scaled value (value is converted from integer to float). Values are in the `[-32767.0, 32767.0]` range. */
            DATA_FORMAT_R16G16_SSCALED = 79,
            
            /** 16-bit-per-channel unsigned integer red/green channel data format. Values are in the `[0.0, 65535]` range. */
            DATA_FORMAT_R16G16_UINT = 80,
            
            /** 16-bit-per-channel signed integer red/green channel data format. Values are in the `[-32767, 32767]` range. */
            DATA_FORMAT_R16G16_SINT = 81,
            
            /** 16-bit-per-channel signed floating-point red/green channel data format with the value stored as-is. */
            DATA_FORMAT_R16G16_SFLOAT = 82,
            
            /** 16-bit-per-channel unsigned floating-point red/green/blue channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R16G16B16_UNORM = 83,
            
            /** 16-bit-per-channel signed floating-point red/green/blue channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_R16G16B16_SNORM = 84,
            
            /** 16-bit-per-channel unsigned floating-point red/green/blue channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 65535.0]` range. */
            DATA_FORMAT_R16G16B16_USCALED = 85,
            
            /** 16-bit-per-channel signed floating-point red/green/blue channel data format with scaled value (value is converted from integer to float). Values are in the `[-32767.0, 32767.0]` range. */
            DATA_FORMAT_R16G16B16_SSCALED = 86,
            
            /** 16-bit-per-channel unsigned integer red/green/blue channel data format. Values are in the `[0.0, 65535]` range. */
            DATA_FORMAT_R16G16B16_UINT = 87,
            
            /** 16-bit-per-channel signed integer red/green/blue channel data format. Values are in the `[-32767, 32767]` range. */
            DATA_FORMAT_R16G16B16_SINT = 88,
            
            /** 16-bit-per-channel signed floating-point red/green/blue channel data format with the value stored as-is. */
            DATA_FORMAT_R16G16B16_SFLOAT = 89,
            
            /** 16-bit-per-channel unsigned floating-point red/green/blue/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R16G16B16A16_UNORM = 90,
            
            /** 16-bit-per-channel signed floating-point red/green/blue/alpha channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. */
            DATA_FORMAT_R16G16B16A16_SNORM = 91,
            
            /** 16-bit-per-channel unsigned floating-point red/green/blue/alpha channel data format with scaled value (value is converted from integer to float). Values are in the `[0.0, 65535.0]` range. */
            DATA_FORMAT_R16G16B16A16_USCALED = 92,
            
            /** 16-bit-per-channel signed floating-point red/green/blue/alpha channel data format with scaled value (value is converted from integer to float). Values are in the `[-32767.0, 32767.0]` range. */
            DATA_FORMAT_R16G16B16A16_SSCALED = 93,
            
            /** 16-bit-per-channel unsigned integer red/green/blue/alpha channel data format. Values are in the `[0.0, 65535]` range. */
            DATA_FORMAT_R16G16B16A16_UINT = 94,
            
            /** 16-bit-per-channel signed integer red/green/blue/alpha channel data format. Values are in the `[-32767, 32767]` range. */
            DATA_FORMAT_R16G16B16A16_SINT = 95,
            
            /** 16-bit-per-channel signed floating-point red/green/blue/alpha channel data format with the value stored as-is. */
            DATA_FORMAT_R16G16B16A16_SFLOAT = 96,
            
            /** 32-bit-per-channel unsigned integer red channel data format. Values are in the `[0, 2^32 - 1]` range. */
            DATA_FORMAT_R32_UINT = 97,
            
            /** 32-bit-per-channel signed integer red channel data format. Values are in the `[2^31 + 1, 2^31 - 1]` range. */
            DATA_FORMAT_R32_SINT = 98,
            
            /** 32-bit-per-channel signed floating-point red channel data format with the value stored as-is. */
            DATA_FORMAT_R32_SFLOAT = 99,
            
            /** 32-bit-per-channel unsigned integer red/green channel data format. Values are in the `[0, 2^32 - 1]` range. */
            DATA_FORMAT_R32G32_UINT = 100,
            
            /** 32-bit-per-channel signed integer red/green channel data format. Values are in the `[2^31 + 1, 2^31 - 1]` range. */
            DATA_FORMAT_R32G32_SINT = 101,
            
            /** 32-bit-per-channel signed floating-point red/green channel data format with the value stored as-is. */
            DATA_FORMAT_R32G32_SFLOAT = 102,
            
            /** 32-bit-per-channel unsigned integer red/green/blue channel data format. Values are in the `[0, 2^32 - 1]` range. */
            DATA_FORMAT_R32G32B32_UINT = 103,
            
            /** 32-bit-per-channel signed integer red/green/blue channel data format. Values are in the `[2^31 + 1, 2^31 - 1]` range. */
            DATA_FORMAT_R32G32B32_SINT = 104,
            
            /** 32-bit-per-channel signed floating-point red/green/blue channel data format with the value stored as-is. */
            DATA_FORMAT_R32G32B32_SFLOAT = 105,
            
            /** 32-bit-per-channel unsigned integer red/green/blue/alpha channel data format. Values are in the `[0, 2^32 - 1]` range. */
            DATA_FORMAT_R32G32B32A32_UINT = 106,
            
            /** 32-bit-per-channel signed integer red/green/blue/alpha channel data format. Values are in the `[2^31 + 1, 2^31 - 1]` range. */
            DATA_FORMAT_R32G32B32A32_SINT = 107,
            
            /** 32-bit-per-channel signed floating-point red/green/blue/alpha channel data format with the value stored as-is. */
            DATA_FORMAT_R32G32B32A32_SFLOAT = 108,
            
            /** 64-bit-per-channel unsigned integer red channel data format. Values are in the `[0, 2^64 - 1]` range. */
            DATA_FORMAT_R64_UINT = 109,
            
            /** 64-bit-per-channel signed integer red channel data format. Values are in the `[2^63 + 1, 2^63 - 1]` range. */
            DATA_FORMAT_R64_SINT = 110,
            
            /** 64-bit-per-channel signed floating-point red channel data format with the value stored as-is. */
            DATA_FORMAT_R64_SFLOAT = 111,
            
            /** 64-bit-per-channel unsigned integer red/green channel data format. Values are in the `[0, 2^64 - 1]` range. */
            DATA_FORMAT_R64G64_UINT = 112,
            
            /** 64-bit-per-channel signed integer red/green channel data format. Values are in the `[2^63 + 1, 2^63 - 1]` range. */
            DATA_FORMAT_R64G64_SINT = 113,
            
            /** 64-bit-per-channel signed floating-point red/green channel data format with the value stored as-is. */
            DATA_FORMAT_R64G64_SFLOAT = 114,
            
            /** 64-bit-per-channel unsigned integer red/green/blue channel data format. Values are in the `[0, 2^64 - 1]` range. */
            DATA_FORMAT_R64G64B64_UINT = 115,
            
            /** 64-bit-per-channel signed integer red/green/blue channel data format. Values are in the `[2^63 + 1, 2^63 - 1]` range. */
            DATA_FORMAT_R64G64B64_SINT = 116,
            
            /** 64-bit-per-channel signed floating-point red/green/blue channel data format with the value stored as-is. */
            DATA_FORMAT_R64G64B64_SFLOAT = 117,
            
            /** 64-bit-per-channel unsigned integer red/green/blue/alpha channel data format. Values are in the `[0, 2^64 - 1]` range. */
            DATA_FORMAT_R64G64B64A64_UINT = 118,
            
            /** 64-bit-per-channel signed integer red/green/blue/alpha channel data format. Values are in the `[2^63 + 1, 2^63 - 1]` range. */
            DATA_FORMAT_R64G64B64A64_SINT = 119,
            
            /** 64-bit-per-channel signed floating-point red/green/blue/alpha channel data format with the value stored as-is. */
            DATA_FORMAT_R64G64B64A64_SFLOAT = 120,
            
            /** Unsigned floating-point blue/green/red data format with the value stored as-is, packed in 32 bits. The format's precision is 10 bits of blue channel, 11 bits of green channel and 11 bits of red channel. */
            DATA_FORMAT_B10G11R11_UFLOAT_PACK32 = 121,
            
            /** Unsigned floating-point exposure/blue/green/red data format with the value stored as-is, packed in 32 bits. The format's precision is 5 bits of exposure, 9 bits of blue channel, 9 bits of green channel and 9 bits of red channel. */
            DATA_FORMAT_E5B9G9R9_UFLOAT_PACK32 = 122,
            
            /** 16-bit unsigned floating-point depth data format with normalized value. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_D16_UNORM = 123,
            
            /** 24-bit unsigned floating-point depth data format with normalized value, plus 8 unused bits, packed in 32 bits. Values for depth are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_X8_D24_UNORM_PACK32 = 124,
            
            /** 32-bit signed floating-point depth data format with the value stored as-is. */
            DATA_FORMAT_D32_SFLOAT = 125,
            
            /** 8-bit unsigned integer stencil data format. */
            DATA_FORMAT_S8_UINT = 126,
            
            /** 16-bit unsigned floating-point depth data format with normalized value, plus 8 bits of stencil in unsigned integer format. Values for depth are in the `[0.0, 1.0]` range. Values for stencil are in the `[0, 255]` range. */
            DATA_FORMAT_D16_UNORM_S8_UINT = 127,
            
            /** 24-bit unsigned floating-point depth data format with normalized value, plus 8 bits of stencil in unsigned integer format. Values for depth are in the `[0.0, 1.0]` range. Values for stencil are in the `[0, 255]` range. */
            DATA_FORMAT_D24_UNORM_S8_UINT = 128,
            
            /** 32-bit signed floating-point depth data format with the value stored as-is, plus 8 bits of stencil in unsigned integer format. Values for stencil are in the `[0, 255]` range. */
            DATA_FORMAT_D32_SFLOAT_S8_UINT = 129,
            
            /** VRAM-compressed unsigned red/green/blue channel data format with normalized value. Values are in the `[0.0, 1.0]` range. The format's precision is 5 bits of red channel, 6 bits of green channel and 5 bits of blue channel. Using BC1 texture compression (also known as S3TC DXT1). */
            DATA_FORMAT_BC1_RGB_UNORM_BLOCK = 130,
            
            /** VRAM-compressed unsigned red/green/blue channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. The format's precision is 5 bits of red channel, 6 bits of green channel and 5 bits of blue channel. Using BC1 texture compression (also known as S3TC DXT1). */
            DATA_FORMAT_BC1_RGB_SRGB_BLOCK = 131,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. The format's precision is 5 bits of red channel, 6 bits of green channel, 5 bits of blue channel and 1 bit of alpha channel. Using BC1 texture compression (also known as S3TC DXT1). */
            DATA_FORMAT_BC1_RGBA_UNORM_BLOCK = 132,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. The format's precision is 5 bits of red channel, 6 bits of green channel, 5 bits of blue channel and 1 bit of alpha channel. Using BC1 texture compression (also known as S3TC DXT1). */
            DATA_FORMAT_BC1_RGBA_SRGB_BLOCK = 133,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. The format's precision is 5 bits of red channel, 6 bits of green channel, 5 bits of blue channel and 4 bits of alpha channel. Using BC2 texture compression (also known as S3TC DXT3). */
            DATA_FORMAT_BC2_UNORM_BLOCK = 134,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. The format's precision is 5 bits of red channel, 6 bits of green channel, 5 bits of blue channel and 4 bits of alpha channel. Using BC2 texture compression (also known as S3TC DXT3). */
            DATA_FORMAT_BC2_SRGB_BLOCK = 135,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. The format's precision is 5 bits of red channel, 6 bits of green channel, 5 bits of blue channel and 8 bits of alpha channel. Using BC3 texture compression (also known as S3TC DXT5). */
            DATA_FORMAT_BC3_UNORM_BLOCK = 136,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. The format's precision is 5 bits of red channel, 6 bits of green channel, 5 bits of blue channel and 8 bits of alpha channel. Using BC3 texture compression (also known as S3TC DXT5). */
            DATA_FORMAT_BC3_SRGB_BLOCK = 137,
            
            /** VRAM-compressed unsigned red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. The format's precision is 8 bits of red channel. Using BC4 texture compression. */
            DATA_FORMAT_BC4_UNORM_BLOCK = 138,
            
            /** VRAM-compressed signed red channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. The format's precision is 8 bits of red channel. Using BC4 texture compression. */
            DATA_FORMAT_BC4_SNORM_BLOCK = 139,
            
            /** VRAM-compressed unsigned red/green channel data format with normalized value. Values are in the `[0.0, 1.0]` range. The format's precision is 8 bits of red channel and 8 bits of green channel. Using BC5 texture compression (also known as S3TC RGTC). */
            DATA_FORMAT_BC5_UNORM_BLOCK = 140,
            
            /** VRAM-compressed signed red/green channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. The format's precision is 8 bits of red channel and 8 bits of green channel. Using BC5 texture compression (also known as S3TC RGTC). */
            DATA_FORMAT_BC5_SNORM_BLOCK = 141,
            
            /** VRAM-compressed unsigned red/green/blue channel data format with the floating-point value stored as-is. The format's precision is between 10 and 13 bits for the red/green/blue channels. Using BC6H texture compression (also known as BPTC HDR). */
            DATA_FORMAT_BC6H_UFLOAT_BLOCK = 142,
            
            /** VRAM-compressed signed red/green/blue channel data format with the floating-point value stored as-is. The format's precision is between 10 and 13 bits for the red/green/blue channels. Using BC6H texture compression (also known as BPTC HDR). */
            DATA_FORMAT_BC6H_SFLOAT_BLOCK = 143,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. The format's precision is between 4 and 7 bits for the red/green/blue channels and between 0 and 8 bits for the alpha channel. Also known as BPTC LDR. */
            DATA_FORMAT_BC7_UNORM_BLOCK = 144,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. The format's precision is between 4 and 7 bits for the red/green/blue channels and between 0 and 8 bits for the alpha channel. Also known as BPTC LDR. */
            DATA_FORMAT_BC7_SRGB_BLOCK = 145,
            
            /** VRAM-compressed unsigned red/green/blue channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Using ETC2 texture compression. */
            DATA_FORMAT_ETC2_R8G8B8_UNORM_BLOCK = 146,
            
            /** VRAM-compressed unsigned red/green/blue channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. Using ETC2 texture compression. */
            DATA_FORMAT_ETC2_R8G8B8_SRGB_BLOCK = 147,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Red/green/blue use 8 bit of precision each, with alpha using 1 bit of precision. Using ETC2 texture compression. */
            DATA_FORMAT_ETC2_R8G8B8A1_UNORM_BLOCK = 148,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. Red/green/blue use 8 bit of precision each, with alpha using 1 bit of precision. Using ETC2 texture compression. */
            DATA_FORMAT_ETC2_R8G8B8A1_SRGB_BLOCK = 149,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Red/green/blue use 8 bits of precision each, with alpha using 8 bits of precision. Using ETC2 texture compression. */
            DATA_FORMAT_ETC2_R8G8B8A8_UNORM_BLOCK = 150,
            
            /** VRAM-compressed unsigned red/green/blue/alpha channel data format with normalized value and non-linear sRGB encoding. Values are in the `[0.0, 1.0]` range. Red/green/blue use 8 bits of precision each, with alpha using 8 bits of precision. Using ETC2 texture compression. */
            DATA_FORMAT_ETC2_R8G8B8A8_SRGB_BLOCK = 151,
            
            /** 11-bit VRAM-compressed unsigned red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Using ETC2 texture compression. */
            DATA_FORMAT_EAC_R11_UNORM_BLOCK = 152,
            
            /** 11-bit VRAM-compressed signed red channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. Using ETC2 texture compression. */
            DATA_FORMAT_EAC_R11_SNORM_BLOCK = 153,
            
            /** 11-bit VRAM-compressed unsigned red/green channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Using ETC2 texture compression. */
            DATA_FORMAT_EAC_R11G11_UNORM_BLOCK = 154,
            
            /** 11-bit VRAM-compressed signed red/green channel data format with normalized value. Values are in the `[-1.0, 1.0]` range. Using ETC2 texture compression. */
            DATA_FORMAT_EAC_R11G11_SNORM_BLOCK = 155,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 4×4 blocks (highest quality). Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_4x4_UNORM_BLOCK = 156,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 4×4 blocks (highest quality). Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_4x4_SRGB_BLOCK = 157,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 5×4 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_5x4_UNORM_BLOCK = 158,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 5×4 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_5x4_SRGB_BLOCK = 159,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 5×5 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_5x5_UNORM_BLOCK = 160,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 5×5 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_5x5_SRGB_BLOCK = 161,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 6×5 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_6x5_UNORM_BLOCK = 162,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 6×5 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_6x5_SRGB_BLOCK = 163,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 6×6 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_6x6_UNORM_BLOCK = 164,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 6×6 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_6x6_SRGB_BLOCK = 165,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 8×5 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_8x5_UNORM_BLOCK = 166,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 8×5 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_8x5_SRGB_BLOCK = 167,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 8×6 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_8x6_UNORM_BLOCK = 168,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 8×6 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_8x6_SRGB_BLOCK = 169,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 8×8 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_8x8_UNORM_BLOCK = 170,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 8×8 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_8x8_SRGB_BLOCK = 171,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 10×5 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_10x5_UNORM_BLOCK = 172,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 10×5 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_10x5_SRGB_BLOCK = 173,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 10×6 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_10x6_UNORM_BLOCK = 174,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 10×6 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_10x6_SRGB_BLOCK = 175,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 10×8 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_10x8_UNORM_BLOCK = 176,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 10×8 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_10x8_SRGB_BLOCK = 177,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 10×10 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_10x10_UNORM_BLOCK = 178,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 10×10 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_10x10_SRGB_BLOCK = 179,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 12×10 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_12x10_UNORM_BLOCK = 180,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 12×10 blocks. Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_12x10_SRGB_BLOCK = 181,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value, packed in 12 blocks (lowest quality). Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_12x12_UNORM_BLOCK = 182,
            
            /** VRAM-compressed unsigned floating-point data format with normalized value and non-linear sRGB encoding, packed in 12 blocks (lowest quality). Values are in the `[0.0, 1.0]` range. Using ASTC compression. */
            DATA_FORMAT_ASTC_12x12_SRGB_BLOCK = 183,
            
            /** 8-bit-per-channel unsigned floating-point green/blue/red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G8B8G8R8_422_UNORM = 184,
            
            /** 8-bit-per-channel unsigned floating-point blue/green/red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_B8G8R8G8_422_UNORM = 185,
            
            /** 8-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, stored across 3 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal and vertical resolution (i.e. 2×2 adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G8_B8_R8_3PLANE_420_UNORM = 186,
            
            /** 8-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, stored across 2 separate planes (green + blue/red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal and vertical resolution (i.e. 2×2 adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G8_B8R8_2PLANE_420_UNORM = 187,
            
            /** 8-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, stored across 2 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G8_B8_R8_3PLANE_422_UNORM = 188,
            
            /** 8-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, stored across 2 separate planes (green + blue/red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G8_B8R8_2PLANE_422_UNORM = 189,
            
            /** 8-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, stored across 3 separate planes. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_G8_B8_R8_3PLANE_444_UNORM = 190,
            
            /** 10-bit-per-channel unsigned floating-point red channel data with normalized value, plus 6 unused bits, packed in 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R10X6_UNORM_PACK16 = 191,
            
            /** 10-bit-per-channel unsigned floating-point red/green channel data with normalized value, plus 6 unused bits after each channel, packed in 2×16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R10X6G10X6_UNORM_2PACK16 = 192,
            
            /** 10-bit-per-channel unsigned floating-point red/green/blue/alpha channel data with normalized value, plus 6 unused bits after each channel, packed in 4×16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R10X6G10X6B10X6A10X6_UNORM_4PACK16 = 193,
            
            /** 10-bit-per-channel unsigned floating-point green/blue/green/red channel data with normalized value, plus 6 unused bits after each channel, packed in 4×16 bits. Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). The green channel is listed twice, but contains different values to allow it to be represented at full resolution. */
            DATA_FORMAT_G10X6B10X6G10X6R10X6_422_UNORM_4PACK16 = 194,
            
            /** 10-bit-per-channel unsigned floating-point blue/green/red/green channel data with normalized value, plus 6 unused bits after each channel, packed in 4×16 bits. Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). The green channel is listed twice, but contains different values to allow it to be represented at full resolution. */
            DATA_FORMAT_B10X6G10X6R10X6G10X6_422_UNORM_4PACK16 = 195,
            
            /** 10-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 2 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal and vertical resolution (i.e. 2×2 adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G10X6_B10X6_R10X6_3PLANE_420_UNORM_3PACK16 = 196,
            
            /** 10-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 2 separate planes (green + blue/red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal and vertical resolution (i.e. 2×2 adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G10X6_B10X6R10X6_2PLANE_420_UNORM_3PACK16 = 197,
            
            /** 10-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 3 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G10X6_B10X6_R10X6_3PLANE_422_UNORM_3PACK16 = 198,
            
            /** 10-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 3 separate planes (green + blue/red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G10X6_B10X6R10X6_2PLANE_422_UNORM_3PACK16 = 199,
            
            /** 10-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 3 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_G10X6_B10X6_R10X6_3PLANE_444_UNORM_3PACK16 = 200,
            
            /** 12-bit-per-channel unsigned floating-point red channel data with normalized value, plus 6 unused bits, packed in 16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R12X4_UNORM_PACK16 = 201,
            
            /** 12-bit-per-channel unsigned floating-point red/green channel data with normalized value, plus 6 unused bits after each channel, packed in 2×16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R12X4G12X4_UNORM_2PACK16 = 202,
            
            /** 12-bit-per-channel unsigned floating-point red/green/blue/alpha channel data with normalized value, plus 6 unused bits after each channel, packed in 4×16 bits. Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_R12X4G12X4B12X4A12X4_UNORM_4PACK16 = 203,
            
            /** 12-bit-per-channel unsigned floating-point green/blue/green/red channel data with normalized value, plus 6 unused bits after each channel, packed in 4×16 bits. Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). The green channel is listed twice, but contains different values to allow it to be represented at full resolution. */
            DATA_FORMAT_G12X4B12X4G12X4R12X4_422_UNORM_4PACK16 = 204,
            
            /** 12-bit-per-channel unsigned floating-point blue/green/red/green channel data with normalized value, plus 6 unused bits after each channel, packed in 4×16 bits. Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). The green channel is listed twice, but contains different values to allow it to be represented at full resolution. */
            DATA_FORMAT_B12X4G12X4R12X4G12X4_422_UNORM_4PACK16 = 205,
            
            /** 12-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 2 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal and vertical resolution (i.e. 2×2 adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G12X4_B12X4_R12X4_3PLANE_420_UNORM_3PACK16 = 206,
            
            /** 12-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 2 separate planes (green + blue/red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal and vertical resolution (i.e. 2×2 adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G12X4_B12X4R12X4_2PLANE_420_UNORM_3PACK16 = 207,
            
            /** 12-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 3 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G12X4_B12X4_R12X4_3PLANE_422_UNORM_3PACK16 = 208,
            
            /** 12-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 3 separate planes (green + blue/red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G12X4_B12X4R12X4_2PLANE_422_UNORM_3PACK16 = 209,
            
            /** 12-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Packed in 3×16 bits and stored across 3 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_G12X4_B12X4_R12X4_3PLANE_444_UNORM_3PACK16 = 210,
            
            /** 16-bit-per-channel unsigned floating-point green/blue/red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G16B16G16R16_422_UNORM = 211,
            
            /** 16-bit-per-channel unsigned floating-point blue/green/red channel data format with normalized value. Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_B16G16R16G16_422_UNORM = 212,
            
            /** 16-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Stored across 2 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal and vertical resolution (i.e. 2×2 adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G16_B16_R16_3PLANE_420_UNORM = 213,
            
            /** 16-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Stored across 2 separate planes (green + blue/red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal and vertical resolution (i.e. 2×2 adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G16_B16R16_2PLANE_420_UNORM = 214,
            
            /** 16-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Stored across 3 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G16_B16_R16_3PLANE_422_UNORM = 215,
            
            /** 16-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Stored across 3 separate planes (green + blue/red). Values are in the `[0.0, 1.0]` range. Blue and red channel data is stored at halved horizontal resolution (i.e. 2 horizontally adjacent pixels will share the same value for the blue/red channel). */
            DATA_FORMAT_G16_B16R16_2PLANE_422_UNORM = 216,
            
            /** 16-bit-per-channel unsigned floating-point green/blue/red channel data with normalized value, plus 6 unused bits after each channel. Stored across 3 separate planes (green + blue + red). Values are in the `[0.0, 1.0]` range. */
            DATA_FORMAT_G16_B16_R16_3PLANE_444_UNORM = 217,
            DATA_FORMAT_ASTC_4x4_SFLOAT_BLOCK = 218,
            DATA_FORMAT_ASTC_5x4_SFLOAT_BLOCK = 219,
            DATA_FORMAT_ASTC_5x5_SFLOAT_BLOCK = 220,
            DATA_FORMAT_ASTC_6x5_SFLOAT_BLOCK = 221,
            DATA_FORMAT_ASTC_6x6_SFLOAT_BLOCK = 222,
            DATA_FORMAT_ASTC_8x5_SFLOAT_BLOCK = 223,
            DATA_FORMAT_ASTC_8x6_SFLOAT_BLOCK = 224,
            DATA_FORMAT_ASTC_8x8_SFLOAT_BLOCK = 225,
            DATA_FORMAT_ASTC_10x5_SFLOAT_BLOCK = 226,
            DATA_FORMAT_ASTC_10x6_SFLOAT_BLOCK = 227,
            DATA_FORMAT_ASTC_10x8_SFLOAT_BLOCK = 228,
            DATA_FORMAT_ASTC_10x10_SFLOAT_BLOCK = 229,
            DATA_FORMAT_ASTC_12x10_SFLOAT_BLOCK = 230,
            DATA_FORMAT_ASTC_12x12_SFLOAT_BLOCK = 231,
            
            /** Represents the size of the [enum DataFormat] enum. */
            DATA_FORMAT_MAX = 232,
        }
        enum BarrierMask {
            /** Vertex shader barrier mask. */
            BARRIER_MASK_VERTEX = 1,
            
            /** Fragment shader barrier mask. */
            BARRIER_MASK_FRAGMENT = 8,
            
            /** Compute barrier mask. */
            BARRIER_MASK_COMPUTE = 2,
            
            /** Transfer barrier mask. */
            BARRIER_MASK_TRANSFER = 4,
            
            /** Raster barrier mask (vertex and fragment). Equivalent to `BARRIER_MASK_VERTEX | BARRIER_MASK_FRAGMENT`. */
            BARRIER_MASK_RASTER = 9,
            
            /** Barrier mask for all types (vertex, fragment, compute, transfer). */
            BARRIER_MASK_ALL_BARRIERS = 32767,
            
            /** No barrier for any type. */
            BARRIER_MASK_NO_BARRIER = 32768,
        }
        enum TextureType {
            /** 1-dimensional texture. */
            TEXTURE_TYPE_1D = 0,
            
            /** 2-dimensional texture. */
            TEXTURE_TYPE_2D = 1,
            
            /** 3-dimensional texture. */
            TEXTURE_TYPE_3D = 2,
            
            /** [Cubemap] texture. */
            TEXTURE_TYPE_CUBE = 3,
            
            /** Array of 1-dimensional textures. */
            TEXTURE_TYPE_1D_ARRAY = 4,
            
            /** Array of 2-dimensional textures. */
            TEXTURE_TYPE_2D_ARRAY = 5,
            
            /** Array of [Cubemap] textures. */
            TEXTURE_TYPE_CUBE_ARRAY = 6,
            
            /** Represents the size of the [enum TextureType] enum. */
            TEXTURE_TYPE_MAX = 7,
        }
        enum TextureSamples {
            /** Perform 1 texture sample (this is the fastest but lowest-quality for antialiasing). */
            TEXTURE_SAMPLES_1 = 0,
            
            /** Perform 2 texture samples. */
            TEXTURE_SAMPLES_2 = 1,
            
            /** Perform 4 texture samples. */
            TEXTURE_SAMPLES_4 = 2,
            
            /** Perform 8 texture samples. Not supported on mobile GPUs (including Apple Silicon). */
            TEXTURE_SAMPLES_8 = 3,
            
            /** Perform 16 texture samples. Not supported on mobile GPUs and many desktop GPUs. */
            TEXTURE_SAMPLES_16 = 4,
            
            /** Perform 32 texture samples. Not supported on most GPUs. */
            TEXTURE_SAMPLES_32 = 5,
            
            /** Perform 64 texture samples (this is the slowest but highest-quality for antialiasing). Not supported on most GPUs. */
            TEXTURE_SAMPLES_64 = 6,
            
            /** Represents the size of the [enum TextureSamples] enum. */
            TEXTURE_SAMPLES_MAX = 7,
        }
        enum TextureUsageBits {
            /** Texture can be sampled. */
            TEXTURE_USAGE_SAMPLING_BIT = 1,
            
            /** Texture can be used as a color attachment in a framebuffer. */
            TEXTURE_USAGE_COLOR_ATTACHMENT_BIT = 2,
            
            /** Texture can be used as a depth/stencil attachment in a framebuffer. */
            TEXTURE_USAGE_DEPTH_STENCIL_ATTACHMENT_BIT = 4,
            
            /** Texture can be used as a [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#descriptorsets-storageimage]storage image[/url]. */
            TEXTURE_USAGE_STORAGE_BIT = 8,
            
            /** Texture can be used as a [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#descriptorsets-storageimage]storage image[/url] with support for atomic operations. */
            TEXTURE_USAGE_STORAGE_ATOMIC_BIT = 16,
            
            /** Texture can be read back on the CPU using [method texture_get_data] faster than without this bit, since it is always kept in the system memory. */
            TEXTURE_USAGE_CPU_READ_BIT = 32,
            
            /** Texture can be updated using [method texture_update]. */
            TEXTURE_USAGE_CAN_UPDATE_BIT = 64,
            
            /** Texture can be a source for [method texture_copy]. */
            TEXTURE_USAGE_CAN_COPY_FROM_BIT = 128,
            
            /** Texture can be a destination for [method texture_copy]. */
            TEXTURE_USAGE_CAN_COPY_TO_BIT = 256,
            
            /** Texture can be used as a [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#descriptorsets-inputattachment]input attachment[/url] in a framebuffer. */
            TEXTURE_USAGE_INPUT_ATTACHMENT_BIT = 512,
        }
        enum TextureSwizzle {
            /** Return the sampled value as-is. */
            TEXTURE_SWIZZLE_IDENTITY = 0,
            
            /** Always return `0.0` when sampling. */
            TEXTURE_SWIZZLE_ZERO = 1,
            
            /** Always return `1.0` when sampling. */
            TEXTURE_SWIZZLE_ONE = 2,
            
            /** Sample the red color channel. */
            TEXTURE_SWIZZLE_R = 3,
            
            /** Sample the green color channel. */
            TEXTURE_SWIZZLE_G = 4,
            
            /** Sample the blue color channel. */
            TEXTURE_SWIZZLE_B = 5,
            
            /** Sample the alpha channel. */
            TEXTURE_SWIZZLE_A = 6,
            
            /** Represents the size of the [enum TextureSwizzle] enum. */
            TEXTURE_SWIZZLE_MAX = 7,
        }
        enum TextureSliceType {
            /** 2-dimensional texture slice. */
            TEXTURE_SLICE_2D = 0,
            
            /** Cubemap texture slice. */
            TEXTURE_SLICE_CUBEMAP = 1,
            
            /** 3-dimensional texture slice. */
            TEXTURE_SLICE_3D = 2,
        }
        enum SamplerFilter {
            /** Nearest-neighbor sampler filtering. Sampling at higher resolutions than the source will result in a pixelated look. */
            SAMPLER_FILTER_NEAREST = 0,
            
            /** Bilinear sampler filtering. Sampling at higher resolutions than the source will result in a blurry look. */
            SAMPLER_FILTER_LINEAR = 1,
        }
        enum SamplerRepeatMode {
            /** Sample with repeating enabled. */
            SAMPLER_REPEAT_MODE_REPEAT = 0,
            
            /** Sample with mirrored repeating enabled. When sampling outside the `[0.0, 1.0]` range, return a mirrored version of the sampler. This mirrored version is mirrored again if sampling further away, with the pattern repeating indefinitely. */
            SAMPLER_REPEAT_MODE_MIRRORED_REPEAT = 1,
            
            /** Sample with repeating disabled. When sampling outside the `[0.0, 1.0]` range, return the color of the last pixel on the edge. */
            SAMPLER_REPEAT_MODE_CLAMP_TO_EDGE = 2,
            
            /** Sample with repeating disabled. When sampling outside the `[0.0, 1.0]` range, return the specified [member RDSamplerState.border_color]. */
            SAMPLER_REPEAT_MODE_CLAMP_TO_BORDER = 3,
            
            /** Sample with mirrored repeating enabled, but only once. When sampling in the `[-1.0, 0.0]` range, return a mirrored version of the sampler. When sampling outside the `[-1.0, 1.0]` range, return the color of the last pixel on the edge. */
            SAMPLER_REPEAT_MODE_MIRROR_CLAMP_TO_EDGE = 4,
            
            /** Represents the size of the [enum SamplerRepeatMode] enum. */
            SAMPLER_REPEAT_MODE_MAX = 5,
        }
        enum SamplerBorderColor {
            /** Return a floating-point transparent black color when sampling outside the `[0.0, 1.0]` range. Only effective if the sampler repeat mode is [constant SAMPLER_REPEAT_MODE_CLAMP_TO_BORDER]. */
            SAMPLER_BORDER_COLOR_FLOAT_TRANSPARENT_BLACK = 0,
            
            /** Return a integer transparent black color when sampling outside the `[0.0, 1.0]` range. Only effective if the sampler repeat mode is [constant SAMPLER_REPEAT_MODE_CLAMP_TO_BORDER]. */
            SAMPLER_BORDER_COLOR_INT_TRANSPARENT_BLACK = 1,
            
            /** Return a floating-point opaque black color when sampling outside the `[0.0, 1.0]` range. Only effective if the sampler repeat mode is [constant SAMPLER_REPEAT_MODE_CLAMP_TO_BORDER]. */
            SAMPLER_BORDER_COLOR_FLOAT_OPAQUE_BLACK = 2,
            
            /** Return a integer opaque black color when sampling outside the `[0.0, 1.0]` range. Only effective if the sampler repeat mode is [constant SAMPLER_REPEAT_MODE_CLAMP_TO_BORDER]. */
            SAMPLER_BORDER_COLOR_INT_OPAQUE_BLACK = 3,
            
            /** Return a floating-point opaque white color when sampling outside the `[0.0, 1.0]` range. Only effective if the sampler repeat mode is [constant SAMPLER_REPEAT_MODE_CLAMP_TO_BORDER]. */
            SAMPLER_BORDER_COLOR_FLOAT_OPAQUE_WHITE = 4,
            
            /** Return a integer opaque white color when sampling outside the `[0.0, 1.0]` range. Only effective if the sampler repeat mode is [constant SAMPLER_REPEAT_MODE_CLAMP_TO_BORDER]. */
            SAMPLER_BORDER_COLOR_INT_OPAQUE_WHITE = 5,
            
            /** Represents the size of the [enum SamplerBorderColor] enum. */
            SAMPLER_BORDER_COLOR_MAX = 6,
        }
        enum VertexFrequency {
            /** Vertex attribute addressing is a function of the vertex. This is used to specify the rate at which vertex attributes are pulled from buffers. */
            VERTEX_FREQUENCY_VERTEX = 0,
            
            /** Vertex attribute addressing is a function of the instance index. This is used to specify the rate at which vertex attributes are pulled from buffers. */
            VERTEX_FREQUENCY_INSTANCE = 1,
        }
        enum IndexBufferFormat {
            /** Index buffer in 16-bit unsigned integer format. This limits the maximum index that can be specified to `65535`. */
            INDEX_BUFFER_FORMAT_UINT16 = 0,
            
            /** Index buffer in 32-bit unsigned integer format. This limits the maximum index that can be specified to `4294967295`. */
            INDEX_BUFFER_FORMAT_UINT32 = 1,
        }
        enum StorageBufferUsage {
            STORAGE_BUFFER_USAGE_DISPATCH_INDIRECT = 1,
        }
        enum BufferCreationBits {
            /** Optionally, set this flag if you wish to use [method buffer_get_device_address] functionality. You must first check the GPU supports it:  
             *    
             */
            BUFFER_CREATION_DEVICE_ADDRESS_BIT = 1,
            
            /** Set this flag so that it is created as storage. This is useful if Compute Shaders need access (for reading or writing) to the buffer, e.g. skeletal animations are processed in Compute Shaders which need access to vertex buffers, to be later consumed by vertex shaders as part of the regular rasterization pipeline. */
            BUFFER_CREATION_AS_STORAGE_BIT = 2,
        }
        enum UniformType {
            /** Sampler uniform. */
            UNIFORM_TYPE_SAMPLER = 0,
            
            /** Sampler uniform with a texture. */
            UNIFORM_TYPE_SAMPLER_WITH_TEXTURE = 1,
            
            /** Texture uniform. */
            UNIFORM_TYPE_TEXTURE = 2,
            
            /** Image uniform. */
            UNIFORM_TYPE_IMAGE = 3,
            
            /** Texture buffer uniform. */
            UNIFORM_TYPE_TEXTURE_BUFFER = 4,
            
            /** Sampler uniform with a texture buffer. */
            UNIFORM_TYPE_SAMPLER_WITH_TEXTURE_BUFFER = 5,
            
            /** Image buffer uniform. */
            UNIFORM_TYPE_IMAGE_BUFFER = 6,
            
            /** Uniform buffer uniform. */
            UNIFORM_TYPE_UNIFORM_BUFFER = 7,
            
            /** [url=https://vkguide.dev/docs/chapter-4/storage_buffers/]Storage buffer[/url] uniform. */
            UNIFORM_TYPE_STORAGE_BUFFER = 8,
            
            /** Input attachment uniform. */
            UNIFORM_TYPE_INPUT_ATTACHMENT = 9,
            
            /** Represents the size of the [enum UniformType] enum. */
            UNIFORM_TYPE_MAX = 10,
        }
        enum RenderPrimitive {
            /** Point rendering primitive (with constant size, regardless of distance from camera). */
            RENDER_PRIMITIVE_POINTS = 0,
            
            /** Line list rendering primitive. Lines are drawn separated from each other. */
            RENDER_PRIMITIVE_LINES = 1,
            
            /** [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#drawing-line-lists-with-adjacency]Line list rendering primitive with adjacency.[/url]  
             *      
             *  **Note:** Adjacency is only useful with geometry shaders, which Godot does not expose.  
             */
            RENDER_PRIMITIVE_LINES_WITH_ADJACENCY = 2,
            
            /** Line strip rendering primitive. Lines drawn are connected to the previous vertex. */
            RENDER_PRIMITIVE_LINESTRIPS = 3,
            
            /** [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#drawing-line-strips-with-adjacency]Line strip rendering primitive with adjacency.[/url]  
             *      
             *  **Note:** Adjacency is only useful with geometry shaders, which Godot does not expose.  
             */
            RENDER_PRIMITIVE_LINESTRIPS_WITH_ADJACENCY = 4,
            
            /** Triangle list rendering primitive. Triangles are drawn separated from each other. */
            RENDER_PRIMITIVE_TRIANGLES = 5,
            
            /** [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#drawing-triangle-lists-with-adjacency]Triangle list rendering primitive with adjacency.[/url]  
             *       
             *  **Note:** Adjacency is only useful with geometry shaders, which Godot does not expose.  
             */
            RENDER_PRIMITIVE_TRIANGLES_WITH_ADJACENCY = 6,
            
            /** Triangle strip rendering primitive. Triangles drawn are connected to the previous triangle. */
            RENDER_PRIMITIVE_TRIANGLE_STRIPS = 7,
            
            /** [url=https://registry.khronos.org/vulkan/specs/1.3-extensions/html/vkspec.html#drawing-triangle-strips-with-adjacency]Triangle strip rendering primitive with adjacency.[/url]  
             *      
             *  **Note:** Adjacency is only useful with geometry shaders, which Godot does not expose.  
             */
            RENDER_PRIMITIVE_TRIANGLE_STRIPS_WITH_AJACENCY = 8,
            
            /** Triangle strip rendering primitive with  *primitive restart*  enabled. Triangles drawn are connected to the previous triangle, but a primitive restart index can be specified before drawing to create a second triangle strip after the specified index.  
             *      
             *  **Note:** Only compatible with indexed draws.  
             */
            RENDER_PRIMITIVE_TRIANGLE_STRIPS_WITH_RESTART_INDEX = 9,
            
            /** Tessellation patch rendering primitive. Only useful with tessellation shaders, which can be used to deform these patches. */
            RENDER_PRIMITIVE_TESSELATION_PATCH = 10,
            
            /** Represents the size of the [enum RenderPrimitive] enum. */
            RENDER_PRIMITIVE_MAX = 11,
        }
        enum PolygonCullMode {
            /** Do not use polygon front face or backface culling. */
            POLYGON_CULL_DISABLED = 0,
            
            /** Use polygon frontface culling (faces pointing towards the camera are hidden). */
            POLYGON_CULL_FRONT = 1,
            
            /** Use polygon backface culling (faces pointing away from the camera are hidden). */
            POLYGON_CULL_BACK = 2,
        }
        enum PolygonFrontFace {
            /** Clockwise winding order to determine which face of a polygon is its front face. */
            POLYGON_FRONT_FACE_CLOCKWISE = 0,
            
            /** Counter-clockwise winding order to determine which face of a polygon is its front face. */
            POLYGON_FRONT_FACE_COUNTER_CLOCKWISE = 1,
        }
        enum StencilOperation {
            /** Keep the current stencil value. */
            STENCIL_OP_KEEP = 0,
            
            /** Set the stencil value to `0`. */
            STENCIL_OP_ZERO = 1,
            
            /** Replace the existing stencil value with the new one. */
            STENCIL_OP_REPLACE = 2,
            
            /** Increment the existing stencil value and clamp to the maximum representable unsigned value if reached. Stencil bits are considered as an unsigned integer. */
            STENCIL_OP_INCREMENT_AND_CLAMP = 3,
            
            /** Decrement the existing stencil value and clamp to the minimum value if reached. Stencil bits are considered as an unsigned integer. */
            STENCIL_OP_DECREMENT_AND_CLAMP = 4,
            
            /** Bitwise-invert the existing stencil value. */
            STENCIL_OP_INVERT = 5,
            
            /** Increment the stencil value and wrap around to `0` if reaching the maximum representable unsigned. Stencil bits are considered as an unsigned integer. */
            STENCIL_OP_INCREMENT_AND_WRAP = 6,
            
            /** Decrement the stencil value and wrap around to the maximum representable unsigned if reaching the minimum. Stencil bits are considered as an unsigned integer. */
            STENCIL_OP_DECREMENT_AND_WRAP = 7,
            
            /** Represents the size of the [enum StencilOperation] enum. */
            STENCIL_OP_MAX = 8,
        }
        enum CompareOperator {
            /** "Never" comparison (opposite of [constant COMPARE_OP_ALWAYS]). */
            COMPARE_OP_NEVER = 0,
            
            /** "Less than" comparison. */
            COMPARE_OP_LESS = 1,
            
            /** "Equal" comparison. */
            COMPARE_OP_EQUAL = 2,
            
            /** "Less than or equal" comparison. */
            COMPARE_OP_LESS_OR_EQUAL = 3,
            
            /** "Greater than" comparison. */
            COMPARE_OP_GREATER = 4,
            
            /** "Not equal" comparison. */
            COMPARE_OP_NOT_EQUAL = 5,
            
            /** "Greater than or equal" comparison. */
            COMPARE_OP_GREATER_OR_EQUAL = 6,
            
            /** "Always" comparison (opposite of [constant COMPARE_OP_NEVER]). */
            COMPARE_OP_ALWAYS = 7,
            
            /** Represents the size of the [enum CompareOperator] enum. */
            COMPARE_OP_MAX = 8,
        }
        enum LogicOperation {
            /** Clear logic operation (result is always `0`). See also [constant LOGIC_OP_SET]. */
            LOGIC_OP_CLEAR = 0,
            
            /** AND logic operation. */
            LOGIC_OP_AND = 1,
            
            /** AND logic operation with the  *destination*  operand being inverted. See also [constant LOGIC_OP_AND_INVERTED]. */
            LOGIC_OP_AND_REVERSE = 2,
            
            /** Copy logic operation (keeps the  *source*  value as-is). See also [constant LOGIC_OP_COPY_INVERTED] and [constant LOGIC_OP_NO_OP]. */
            LOGIC_OP_COPY = 3,
            
            /** AND logic operation with the  *source*  operand being inverted. See also [constant LOGIC_OP_AND_REVERSE]. */
            LOGIC_OP_AND_INVERTED = 4,
            
            /** No-op logic operation (keeps the  *destination*  value as-is). See also [constant LOGIC_OP_COPY]. */
            LOGIC_OP_NO_OP = 5,
            
            /** Exclusive or (XOR) logic operation. */
            LOGIC_OP_XOR = 6,
            
            /** OR logic operation. */
            LOGIC_OP_OR = 7,
            
            /** Not-OR (NOR) logic operation. */
            LOGIC_OP_NOR = 8,
            
            /** Not-XOR (XNOR) logic operation. */
            LOGIC_OP_EQUIVALENT = 9,
            
            /** Invert logic operation. */
            LOGIC_OP_INVERT = 10,
            
            /** OR logic operation with the  *destination*  operand being inverted. See also [constant LOGIC_OP_OR_REVERSE]. */
            LOGIC_OP_OR_REVERSE = 11,
            
            /** NOT logic operation (inverts the value). See also [constant LOGIC_OP_COPY]. */
            LOGIC_OP_COPY_INVERTED = 12,
            
            /** OR logic operation with the  *source*  operand being inverted. See also [constant LOGIC_OP_OR_REVERSE]. */
            LOGIC_OP_OR_INVERTED = 13,
            
            /** Not-AND (NAND) logic operation. */
            LOGIC_OP_NAND = 14,
            
            /** SET logic operation (result is always `1`). See also [constant LOGIC_OP_CLEAR]. */
            LOGIC_OP_SET = 15,
            
            /** Represents the size of the [enum LogicOperation] enum. */
            LOGIC_OP_MAX = 16,
        }
        enum BlendFactor {
            /** Constant `0.0` blend factor. */
            BLEND_FACTOR_ZERO = 0,
            
            /** Constant `1.0` blend factor. */
            BLEND_FACTOR_ONE = 1,
            
            /** Color blend factor is `source color`. Alpha blend factor is `source alpha`. */
            BLEND_FACTOR_SRC_COLOR = 2,
            
            /** Color blend factor is `1.0 - source color`. Alpha blend factor is `1.0 - source alpha`. */
            BLEND_FACTOR_ONE_MINUS_SRC_COLOR = 3,
            
            /** Color blend factor is `destination color`. Alpha blend factor is `destination alpha`. */
            BLEND_FACTOR_DST_COLOR = 4,
            
            /** Color blend factor is `1.0 - destination color`. Alpha blend factor is `1.0 - destination alpha`. */
            BLEND_FACTOR_ONE_MINUS_DST_COLOR = 5,
            
            /** Color and alpha blend factor is `source alpha`. */
            BLEND_FACTOR_SRC_ALPHA = 6,
            
            /** Color and alpha blend factor is `1.0 - source alpha`. */
            BLEND_FACTOR_ONE_MINUS_SRC_ALPHA = 7,
            
            /** Color and alpha blend factor is `destination alpha`. */
            BLEND_FACTOR_DST_ALPHA = 8,
            
            /** Color and alpha blend factor is `1.0 - destination alpha`. */
            BLEND_FACTOR_ONE_MINUS_DST_ALPHA = 9,
            
            /** Color blend factor is `blend constant color`. Alpha blend factor is `blend constant alpha` (see [method draw_list_set_blend_constants]). */
            BLEND_FACTOR_CONSTANT_COLOR = 10,
            
            /** Color blend factor is `1.0 - blend constant color`. Alpha blend factor is `1.0 - blend constant alpha` (see [method draw_list_set_blend_constants]). */
            BLEND_FACTOR_ONE_MINUS_CONSTANT_COLOR = 11,
            
            /** Color and alpha blend factor is `blend constant alpha` (see [method draw_list_set_blend_constants]). */
            BLEND_FACTOR_CONSTANT_ALPHA = 12,
            
            /** Color and alpha blend factor is `1.0 - blend constant alpha` (see [method draw_list_set_blend_constants]). */
            BLEND_FACTOR_ONE_MINUS_CONSTANT_ALPHA = 13,
            
            /** Color blend factor is `min(source alpha, 1.0 - destination alpha)`. Alpha blend factor is `1.0`. */
            BLEND_FACTOR_SRC_ALPHA_SATURATE = 14,
            
            /** Color blend factor is `second source color`. Alpha blend factor is `second source alpha`. Only relevant for dual-source blending. */
            BLEND_FACTOR_SRC1_COLOR = 15,
            
            /** Color blend factor is `1.0 - second source color`. Alpha blend factor is `1.0 - second source alpha`. Only relevant for dual-source blending. */
            BLEND_FACTOR_ONE_MINUS_SRC1_COLOR = 16,
            
            /** Color and alpha blend factor is `second source alpha`. Only relevant for dual-source blending. */
            BLEND_FACTOR_SRC1_ALPHA = 17,
            
            /** Color and alpha blend factor is `1.0 - second source alpha`. Only relevant for dual-source blending. */
            BLEND_FACTOR_ONE_MINUS_SRC1_ALPHA = 18,
            
            /** Represents the size of the [enum BlendFactor] enum. */
            BLEND_FACTOR_MAX = 19,
        }
        enum BlendOperation {
            /** Additive blending operation (`source + destination`). */
            BLEND_OP_ADD = 0,
            
            /** Subtractive blending operation (`source - destination`). */
            BLEND_OP_SUBTRACT = 1,
            
            /** Reverse subtractive blending operation (`destination - source`). */
            BLEND_OP_REVERSE_SUBTRACT = 2,
            
            /** Minimum blending operation (keep the lowest value of the two). */
            BLEND_OP_MINIMUM = 3,
            
            /** Maximum blending operation (keep the highest value of the two). */
            BLEND_OP_MAXIMUM = 4,
            
            /** Represents the size of the [enum BlendOperation] enum. */
            BLEND_OP_MAX = 5,
        }
        enum PipelineDynamicStateFlags {
            /** Allows dynamically changing the width of rendering lines. */
            DYNAMIC_STATE_LINE_WIDTH = 1,
            
            /** Allows dynamically changing the depth bias. */
            DYNAMIC_STATE_DEPTH_BIAS = 2,
            DYNAMIC_STATE_BLEND_CONSTANTS = 4,
            DYNAMIC_STATE_DEPTH_BOUNDS = 8,
            DYNAMIC_STATE_STENCIL_COMPARE_MASK = 16,
            DYNAMIC_STATE_STENCIL_WRITE_MASK = 32,
            DYNAMIC_STATE_STENCIL_REFERENCE = 64,
        }
        enum InitialAction {
            /** Load the previous contents of the framebuffer. */
            INITIAL_ACTION_LOAD = 0,
            
            /** Clear the whole framebuffer or its specified region. */
            INITIAL_ACTION_CLEAR = 1,
            
            /** Ignore the previous contents of the framebuffer. This is the fastest option if you'll overwrite all of the pixels and don't need to read any of them. */
            INITIAL_ACTION_DISCARD = 2,
            
            /** Represents the size of the [enum InitialAction] enum. */
            INITIAL_ACTION_MAX = 3,
            INITIAL_ACTION_CLEAR_REGION = 1,
            INITIAL_ACTION_CLEAR_REGION_CONTINUE = 1,
            INITIAL_ACTION_KEEP = 0,
            INITIAL_ACTION_DROP = 2,
            INITIAL_ACTION_CONTINUE = 0,
        }
        enum FinalAction {
            /** Store the result of the draw list in the framebuffer. This is generally what you want to do. */
            FINAL_ACTION_STORE = 0,
            
            /** Discard the contents of the framebuffer. This is the fastest option if you don't need to use the results of the draw list. */
            FINAL_ACTION_DISCARD = 1,
            
            /** Represents the size of the [enum FinalAction] enum. */
            FINAL_ACTION_MAX = 2,
            FINAL_ACTION_READ = 0,
            FINAL_ACTION_CONTINUE = 0,
        }
        enum ShaderStage {
            /** Vertex shader stage. This can be used to manipulate vertices from a shader (but not create new vertices). */
            SHADER_STAGE_VERTEX = 0,
            
            /** Fragment shader stage (called "pixel shader" in Direct3D). This can be used to manipulate pixels from a shader. */
            SHADER_STAGE_FRAGMENT = 1,
            
            /** Tessellation control shader stage. This can be used to create additional geometry from a shader. */
            SHADER_STAGE_TESSELATION_CONTROL = 2,
            
            /** Tessellation evaluation shader stage. This can be used to create additional geometry from a shader. */
            SHADER_STAGE_TESSELATION_EVALUATION = 3,
            
            /** Compute shader stage. This can be used to run arbitrary computing tasks in a shader, performing them on the GPU instead of the CPU. */
            SHADER_STAGE_COMPUTE = 4,
            
            /** Represents the size of the [enum ShaderStage] enum. */
            SHADER_STAGE_MAX = 5,
            
            /** Vertex shader stage bit (see also [constant SHADER_STAGE_VERTEX]). */
            SHADER_STAGE_VERTEX_BIT = 1,
            
            /** Fragment shader stage bit (see also [constant SHADER_STAGE_FRAGMENT]). */
            SHADER_STAGE_FRAGMENT_BIT = 2,
            
            /** Tessellation control shader stage bit (see also [constant SHADER_STAGE_TESSELATION_CONTROL]). */
            SHADER_STAGE_TESSELATION_CONTROL_BIT = 4,
            
            /** Tessellation evaluation shader stage bit (see also [constant SHADER_STAGE_TESSELATION_EVALUATION]). */
            SHADER_STAGE_TESSELATION_EVALUATION_BIT = 8,
            
            /** Compute shader stage bit (see also [constant SHADER_STAGE_COMPUTE]). */
            SHADER_STAGE_COMPUTE_BIT = 16,
        }
        enum ShaderLanguage {
            /** Khronos' GLSL shading language (used natively by OpenGL and Vulkan). This is the language used for core Godot shaders. */
            SHADER_LANGUAGE_GLSL = 0,
            
            /** Microsoft's High-Level Shading Language (used natively by Direct3D, but can also be used in Vulkan). */
            SHADER_LANGUAGE_HLSL = 1,
        }
        enum PipelineSpecializationConstantType {
            /** Boolean specialization constant. */
            PIPELINE_SPECIALIZATION_CONSTANT_TYPE_BOOL = 0,
            
            /** Integer specialization constant. */
            PIPELINE_SPECIALIZATION_CONSTANT_TYPE_INT = 1,
            
            /** Floating-point specialization constant. */
            PIPELINE_SPECIALIZATION_CONSTANT_TYPE_FLOAT = 2,
        }
        enum Features {
            /** Features support for buffer device address extension. */
            SUPPORTS_BUFFER_DEVICE_ADDRESS = 6,
        }
        enum Limit {
            /** Maximum number of uniform sets that can be bound at a given time. */
            LIMIT_MAX_BOUND_UNIFORM_SETS = 0,
            
            /** Maximum number of color framebuffer attachments that can be used at a given time. */
            LIMIT_MAX_FRAMEBUFFER_COLOR_ATTACHMENTS = 1,
            
            /** Maximum number of textures that can be used per uniform set. */
            LIMIT_MAX_TEXTURES_PER_UNIFORM_SET = 2,
            
            /** Maximum number of samplers that can be used per uniform set. */
            LIMIT_MAX_SAMPLERS_PER_UNIFORM_SET = 3,
            
            /** Maximum number of [url=https://vkguide.dev/docs/chapter-4/storage_buffers/]storage buffers[/url] per uniform set. */
            LIMIT_MAX_STORAGE_BUFFERS_PER_UNIFORM_SET = 4,
            
            /** Maximum number of storage images per uniform set. */
            LIMIT_MAX_STORAGE_IMAGES_PER_UNIFORM_SET = 5,
            
            /** Maximum number of uniform buffers per uniform set. */
            LIMIT_MAX_UNIFORM_BUFFERS_PER_UNIFORM_SET = 6,
            
            /** Maximum index for an indexed draw command. */
            LIMIT_MAX_DRAW_INDEXED_INDEX = 7,
            
            /** Maximum height of a framebuffer (in pixels). */
            LIMIT_MAX_FRAMEBUFFER_HEIGHT = 8,
            
            /** Maximum width of a framebuffer (in pixels). */
            LIMIT_MAX_FRAMEBUFFER_WIDTH = 9,
            
            /** Maximum number of texture array layers. */
            LIMIT_MAX_TEXTURE_ARRAY_LAYERS = 10,
            
            /** Maximum supported 1-dimensional texture size (in pixels on a single axis). */
            LIMIT_MAX_TEXTURE_SIZE_1D = 11,
            
            /** Maximum supported 2-dimensional texture size (in pixels on a single axis). */
            LIMIT_MAX_TEXTURE_SIZE_2D = 12,
            
            /** Maximum supported 3-dimensional texture size (in pixels on a single axis). */
            LIMIT_MAX_TEXTURE_SIZE_3D = 13,
            
            /** Maximum supported cubemap texture size (in pixels on a single axis of a single face). */
            LIMIT_MAX_TEXTURE_SIZE_CUBE = 14,
            
            /** Maximum number of textures per shader stage. */
            LIMIT_MAX_TEXTURES_PER_SHADER_STAGE = 15,
            
            /** Maximum number of samplers per shader stage. */
            LIMIT_MAX_SAMPLERS_PER_SHADER_STAGE = 16,
            
            /** Maximum number of [url=https://vkguide.dev/docs/chapter-4/storage_buffers/]storage buffers[/url] per shader stage. */
            LIMIT_MAX_STORAGE_BUFFERS_PER_SHADER_STAGE = 17,
            
            /** Maximum number of storage images per shader stage. */
            LIMIT_MAX_STORAGE_IMAGES_PER_SHADER_STAGE = 18,
            
            /** Maximum number of uniform buffers per uniform set. */
            LIMIT_MAX_UNIFORM_BUFFERS_PER_SHADER_STAGE = 19,
            
            /** Maximum size of a push constant. A lot of devices are limited to 128 bytes, so try to avoid exceeding 128 bytes in push constants to ensure compatibility even if your GPU is reporting a higher value. */
            LIMIT_MAX_PUSH_CONSTANT_SIZE = 20,
            
            /** Maximum size of a uniform buffer. */
            LIMIT_MAX_UNIFORM_BUFFER_SIZE = 21,
            
            /** Maximum vertex input attribute offset. */
            LIMIT_MAX_VERTEX_INPUT_ATTRIBUTE_OFFSET = 22,
            
            /** Maximum number of vertex input attributes. */
            LIMIT_MAX_VERTEX_INPUT_ATTRIBUTES = 23,
            
            /** Maximum number of vertex input bindings. */
            LIMIT_MAX_VERTEX_INPUT_BINDINGS = 24,
            
            /** Maximum vertex input binding stride. */
            LIMIT_MAX_VERTEX_INPUT_BINDING_STRIDE = 25,
            
            /** Minimum uniform buffer offset alignment. */
            LIMIT_MIN_UNIFORM_BUFFER_OFFSET_ALIGNMENT = 26,
            
            /** Maximum shared memory size for compute shaders. */
            LIMIT_MAX_COMPUTE_SHARED_MEMORY_SIZE = 27,
            
            /** Maximum number of workgroups for compute shaders on the X axis. */
            LIMIT_MAX_COMPUTE_WORKGROUP_COUNT_X = 28,
            
            /** Maximum number of workgroups for compute shaders on the Y axis. */
            LIMIT_MAX_COMPUTE_WORKGROUP_COUNT_Y = 29,
            
            /** Maximum number of workgroups for compute shaders on the Z axis. */
            LIMIT_MAX_COMPUTE_WORKGROUP_COUNT_Z = 30,
            
            /** Maximum number of workgroup invocations for compute shaders. */
            LIMIT_MAX_COMPUTE_WORKGROUP_INVOCATIONS = 31,
            
            /** Maximum workgroup size for compute shaders on the X axis. */
            LIMIT_MAX_COMPUTE_WORKGROUP_SIZE_X = 32,
            
            /** Maximum workgroup size for compute shaders on the Y axis. */
            LIMIT_MAX_COMPUTE_WORKGROUP_SIZE_Y = 33,
            
            /** Maximum workgroup size for compute shaders on the Z axis. */
            LIMIT_MAX_COMPUTE_WORKGROUP_SIZE_Z = 34,
            
            /** Maximum viewport width (in pixels). */
            LIMIT_MAX_VIEWPORT_DIMENSIONS_X = 35,
            
            /** Maximum viewport height (in pixels). */
            LIMIT_MAX_VIEWPORT_DIMENSIONS_Y = 36,
            
            /** Returns the smallest value for [member ProjectSettings.rendering/scaling_3d/scale] when using the MetalFX temporal upscaler.  
             *      
             *  **Note:** The returned value is multiplied by a factor of `1000000` to preserve 6 digits of precision. It must be divided by `1000000.0` to convert the value to a floating point number.  
             */
            LIMIT_METALFX_TEMPORAL_SCALER_MIN_SCALE = 46,
            
            /** Returns the largest value for [member ProjectSettings.rendering/scaling_3d/scale] when using the MetalFX temporal upscaler.  
             *      
             *  **Note:** The returned value is multiplied by a factor of `1000000` to preserve 6 digits of precision. It must be divided by `1000000.0` to convert the value to a floating point number.  
             */
            LIMIT_METALFX_TEMPORAL_SCALER_MAX_SCALE = 47,
        }
        enum MemoryType {
            /** Memory taken by textures. */
            MEMORY_TEXTURES = 0,
            
            /** Memory taken by buffers. */
            MEMORY_BUFFERS = 1,
            
            /** Total memory taken. This is greater than the sum of [constant MEMORY_TEXTURES] and [constant MEMORY_BUFFERS], as it also includes miscellaneous memory usage. */
            MEMORY_TOTAL = 2,
        }
        enum BreadcrumbMarker {
            NONE = 0,
            REFLECTION_PROBES = 65536,
            SKY_PASS = 131072,
            LIGHTMAPPER_PASS = 196608,
            SHADOW_PASS_DIRECTIONAL = 262144,
            SHADOW_PASS_CUBE = 327680,
            OPAQUE_PASS = 393216,
            ALPHA_PASS = 458752,
            TRANSPARENT_PASS = 524288,
            POST_PROCESSING_PASS = 589824,
            BLIT_PASS = 655360,
            UI_PASS = 720896,
            DEBUG_PASS = 786432,
        }
        enum DrawFlags {
            /** Do not clear or ignore any attachments. */
            DRAW_DEFAULT_ALL = 0,
            
            /** Clear the first color attachment. */
            DRAW_CLEAR_COLOR_0 = 1,
            
            /** Clear the second color attachment. */
            DRAW_CLEAR_COLOR_1 = 2,
            
            /** Clear the third color attachment. */
            DRAW_CLEAR_COLOR_2 = 4,
            
            /** Clear the fourth color attachment. */
            DRAW_CLEAR_COLOR_3 = 8,
            
            /** Clear the fifth color attachment. */
            DRAW_CLEAR_COLOR_4 = 16,
            
            /** Clear the sixth color attachment. */
            DRAW_CLEAR_COLOR_5 = 32,
            
            /** Clear the seventh color attachment. */
            DRAW_CLEAR_COLOR_6 = 64,
            
            /** Clear the eighth color attachment. */
            DRAW_CLEAR_COLOR_7 = 128,
            
            /** Mask for clearing all color attachments. */
            DRAW_CLEAR_COLOR_MASK = 255,
            
            /** Clear all color attachments. */
            DRAW_CLEAR_COLOR_ALL = 255,
            
            /** Ignore the previous contents of the first color attachment. */
            DRAW_IGNORE_COLOR_0 = 256,
            
            /** Ignore the previous contents of the second color attachment. */
            DRAW_IGNORE_COLOR_1 = 512,
            
            /** Ignore the previous contents of the third color attachment. */
            DRAW_IGNORE_COLOR_2 = 1024,
            
            /** Ignore the previous contents of the fourth color attachment. */
            DRAW_IGNORE_COLOR_3 = 2048,
            
            /** Ignore the previous contents of the fifth color attachment. */
            DRAW_IGNORE_COLOR_4 = 4096,
            
            /** Ignore the previous contents of the sixth color attachment. */
            DRAW_IGNORE_COLOR_5 = 8192,
            
            /** Ignore the previous contents of the seventh color attachment. */
            DRAW_IGNORE_COLOR_6 = 16384,
            
            /** Ignore the previous contents of the eighth color attachment. */
            DRAW_IGNORE_COLOR_7 = 32768,
            
            /** Mask for ignoring all the previous contents of the color attachments. */
            DRAW_IGNORE_COLOR_MASK = 65280,
            
            /** Ignore the previous contents of all color attachments. */
            DRAW_IGNORE_COLOR_ALL = 65280,
            
            /** Clear the depth attachment. */
            DRAW_CLEAR_DEPTH = 65536,
            
            /** Ignore the previous contents of the depth attachment. */
            DRAW_IGNORE_DEPTH = 131072,
            
            /** Clear the stencil attachment. */
            DRAW_CLEAR_STENCIL = 262144,
            
            /** Ignore the previous contents of the stencil attachment. */
            DRAW_IGNORE_STENCIL = 524288,
            
            /** Clear all attachments. */
            DRAW_CLEAR_ALL = 327935,
            
            /** Ignore the previous contents of all attachments. */
            DRAW_IGNORE_ALL = 720640,
        }
    }
    /** Abstraction for working with modern low-level graphics APIs.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_renderingdevice.html  
     */
    class RenderingDevice extends Object {
        /** Returned by functions that return an ID if a value is invalid. */
        static readonly INVALID_ID = -1
        
        /** Returned by functions that return a format ID if a value is invalid. */
        static readonly INVALID_FORMAT_ID = -1
        constructor(identifier?: any)
        
        /** Creates a new texture. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         *      
         *  **Note:** Not to be confused with [method RenderingServer.texture_2d_create], which creates the Godot-specific [Texture2D] resource as opposed to the graphics API's own texture type.  
         */
        texture_create(format: RDTextureFormat, view: RDTextureView, data: GArray = []): RID
        
        /** Creates a shared texture using the specified [param view] and the texture information from [param with_texture]. */
        texture_create_shared(view: RDTextureView, with_texture: RID): RID
        
        /** Creates a shared texture using the specified [param view] and the texture information from [param with_texture]'s [param layer] and [param mipmap]. The number of included mipmaps from the original texture can be controlled using the [param mipmaps] parameter. Only relevant for textures with multiple layers, such as 3D textures, texture arrays and cubemaps. For single-layer textures, use [method texture_create_shared].  
         *  For 2D textures (which only have one layer), [param layer] must be `0`.  
         *      
         *  **Note:** Layer slicing is only supported for 2D texture arrays, not 3D textures or cubemaps.  
         */
        texture_create_shared_from_slice(view: RDTextureView, with_texture: RID, layer: int64, mipmap: int64, mipmaps: int64 = 1, slice_type: RenderingDevice.TextureSliceType = 0): RID
        
        /** Returns an RID for an existing [param image] (`VkImage`) with the given [param type], [param format], [param samples], [param usage_flags], [param width], [param height], [param depth], and [param layers]. This can be used to allow Godot to render onto foreign images. */
        texture_create_from_extension(type: RenderingDevice.TextureType, format: RenderingDevice.DataFormat, samples: RenderingDevice.TextureSamples, usage_flags: RenderingDevice.TextureUsageBits, image: int64, width: int64, height: int64, depth: int64, layers: int64): RID
        
        /** Updates texture data with new data, replacing the previous data in place. The updated texture data must have the same dimensions and format. For 2D textures (which only have one layer), [param layer] must be `0`. Returns [constant @GlobalScope.OK] if the update was successful, [constant @GlobalScope.ERR_INVALID_PARAMETER] otherwise.  
         *      
         *  **Note:** Updating textures is forbidden during creation of a draw or compute list.  
         *      
         *  **Note:** The existing [param texture] can't be updated while a draw list that uses it as part of a framebuffer is being created. Ensure the draw list is finalized (and that the color/depth texture using it is not set to [constant FINAL_ACTION_CONTINUE]) to update this texture.  
         *      
         *  **Note:** The existing [param texture] requires the [constant TEXTURE_USAGE_CAN_UPDATE_BIT] to be updatable.  
         */
        texture_update(texture: RID, layer: int64, data: PackedByteArray | byte[] | ArrayBuffer): GError
        
        /** Returns the [param texture] data for the specified [param layer] as raw binary data. For 2D textures (which only have one layer), [param layer] must be `0`.  
         *      
         *  **Note:** [param texture] can't be retrieved while a draw list that uses it as part of a framebuffer is being created. Ensure the draw list is finalized (and that the color/depth texture using it is not set to [constant FINAL_ACTION_CONTINUE]) to retrieve this texture. Otherwise, an error is printed and a empty [PackedByteArray] is returned.  
         *      
         *  **Note:** [param texture] requires the [constant TEXTURE_USAGE_CAN_COPY_FROM_BIT] to be retrieved. Otherwise, an error is printed and a empty [PackedByteArray] is returned.  
         *      
         *  **Note:** This method will block the GPU from working until the data is retrieved. Refer to [method texture_get_data_async] for an alternative that returns the data in more performant way.  
         */
        texture_get_data(texture: RID, layer: int64): PackedByteArray
        
        /** Asynchronous version of [method texture_get_data]. RenderingDevice will call [param callback] in a certain amount of frames with the data the texture had at the time of the request.  
         *      
         *  **Note:** At the moment, the delay corresponds to the amount of frames specified by [member ProjectSettings.rendering/rendering_device/vsync/frame_queue_size].  
         *      
         *  **Note:** Downloading large textures can have a prohibitive cost for real-time even when using the asynchronous method due to hardware bandwidth limitations. When dealing with large resources, you can adjust settings such as [member ProjectSettings.rendering/rendering_device/staging_buffer/texture_download_region_size_px] and [member ProjectSettings.rendering/rendering_device/staging_buffer/block_size_kb] to improve the transfer speed at the cost of extra memory.  
         *    
         */
        texture_get_data_async(texture: RID, layer: int64, callback: Callable): GError
        
        /** Returns `true` if the specified [param format] is supported for the given [param usage_flags], `false` otherwise. */
        texture_is_format_supported_for_usage(format: RenderingDevice.DataFormat, usage_flags: RenderingDevice.TextureUsageBits): boolean
        
        /** Returns `true` if the [param texture] is shared, `false` otherwise. See [RDTextureView]. */
        texture_is_shared(texture: RID): boolean
        
        /** Returns `true` if the [param texture] is valid, `false` otherwise. */
        texture_is_valid(texture: RID): boolean
        
        /** Updates the discardable property of [param texture].  
         *  If a texture is discardable, its contents do not need to be preserved between frames. This flag is only relevant when the texture is used as target in a draw list.  
         *  This information is used by [RenderingDevice] to figure out if a texture's contents can be discarded, eliminating unnecessary writes to memory and boosting performance.  
         */
        texture_set_discardable(texture: RID, discardable: boolean): void
        
        /** Returns `true` if the [param texture] is discardable, `false` otherwise. See [RDTextureFormat] or [method texture_set_discardable]. */
        texture_is_discardable(texture: RID): boolean
        
        /** Copies the [param from_texture] to [param to_texture] with the specified [param from_pos], [param to_pos] and [param size] coordinates. The Z axis of the [param from_pos], [param to_pos] and [param size] must be `0` for 2-dimensional textures. Source and destination mipmaps/layers must also be specified, with these parameters being `0` for textures without mipmaps or single-layer textures. Returns [constant @GlobalScope.OK] if the texture copy was successful or [constant @GlobalScope.ERR_INVALID_PARAMETER] otherwise.  
         *      
         *  **Note:** [param from_texture] texture can't be copied while a draw list that uses it as part of a framebuffer is being created. Ensure the draw list is finalized (and that the color/depth texture using it is not set to [constant FINAL_ACTION_CONTINUE]) to copy this texture.  
         *      
         *  **Note:** [param from_texture] texture requires the [constant TEXTURE_USAGE_CAN_COPY_FROM_BIT] to be retrieved.  
         *      
         *  **Note:** [param to_texture] can't be copied while a draw list that uses it as part of a framebuffer is being created. Ensure the draw list is finalized (and that the color/depth texture using it is not set to [constant FINAL_ACTION_CONTINUE]) to copy this texture.  
         *      
         *  **Note:** [param to_texture] requires the [constant TEXTURE_USAGE_CAN_COPY_TO_BIT] to be retrieved.  
         *      
         *  **Note:** [param from_texture] and [param to_texture] must be of the same type (color or depth).  
         */
        texture_copy(from_texture: RID, to_texture: RID, from_pos: Vector3, to_pos: Vector3, size: Vector3, src_mipmap: int64, dst_mipmap: int64, src_layer: int64, dst_layer: int64): GError
        
        /** Clears the specified [param texture] by replacing all of its pixels with the specified [param color]. [param base_mipmap] and [param mipmap_count] determine which mipmaps of the texture are affected by this clear operation, while [param base_layer] and [param layer_count] determine which layers of a 3D texture (or texture array) are affected by this clear operation. For 2D textures (which only have one layer by design), [param base_layer] must be `0` and [param layer_count] must be `1`.  
         *      
         *  **Note:** [param texture] can't be cleared while a draw list that uses it as part of a framebuffer is being created. Ensure the draw list is finalized (and that the color/depth texture using it is not set to [constant FINAL_ACTION_CONTINUE]) to clear this texture.  
         */
        texture_clear(texture: RID, color: Color, base_mipmap: int64, mipmap_count: int64, base_layer: int64, layer_count: int64): GError
        
        /** Resolves the [param from_texture] texture onto [param to_texture] with multisample antialiasing enabled. This must be used when rendering a framebuffer for MSAA to work. Returns [constant @GlobalScope.OK] if successful, [constant @GlobalScope.ERR_INVALID_PARAMETER] otherwise.  
         *      
         *  **Note:** [param from_texture] and [param to_texture] textures must have the same dimension, format and type (color or depth).  
         *      
         *  **Note:** [param from_texture] can't be copied while a draw list that uses it as part of a framebuffer is being created. Ensure the draw list is finalized (and that the color/depth texture using it is not set to [constant FINAL_ACTION_CONTINUE]) to resolve this texture.  
         *      
         *  **Note:** [param from_texture] requires the [constant TEXTURE_USAGE_CAN_COPY_FROM_BIT] to be retrieved.  
         *      
         *  **Note:** [param from_texture] must be multisampled and must also be 2D (or a slice of a 3D/cubemap texture).  
         *      
         *  **Note:** [param to_texture] can't be copied while a draw list that uses it as part of a framebuffer is being created. Ensure the draw list is finalized (and that the color/depth texture using it is not set to [constant FINAL_ACTION_CONTINUE]) to resolve this texture.  
         *      
         *  **Note:** [param to_texture] texture requires the [constant TEXTURE_USAGE_CAN_COPY_TO_BIT] to be retrieved.  
         *      
         *  **Note:** [param to_texture] texture must **not** be multisampled and must also be 2D (or a slice of a 3D/cubemap texture).  
         */
        texture_resolve_multisample(from_texture: RID, to_texture: RID): GError
        
        /** Returns the data format used to create this texture. */
        texture_get_format(texture: RID): RDTextureFormat
        
        /** Returns the internal graphics handle for this texture object. For use when communicating with third-party APIs mostly with GDExtension.  
         *      
         *  **Note:** This function returns a `uint64_t` which internally maps to a `GLuint` (OpenGL) or `VkImage` (Vulkan).  
         */
        texture_get_native_handle(texture: RID): int64
        
        /** Creates a new framebuffer format with the specified [param attachments] and [param view_count]. Returns the new framebuffer's unique framebuffer format ID.  
         *  If [param view_count] is greater than or equal to `2`, enables multiview which is used for VR rendering. This requires support for the Vulkan multiview extension.  
         */
        framebuffer_format_create(attachments: GArray, view_count: int64 = 1): int64
        
        /** Creates a multipass framebuffer format with the specified [param attachments], [param passes] and [param view_count] and returns its ID. If [param view_count] is greater than or equal to `2`, enables multiview which is used for VR rendering. This requires support for the Vulkan multiview extension. */
        framebuffer_format_create_multipass(attachments: GArray, passes: GArray, view_count: int64 = 1): int64
        
        /** Creates a new empty framebuffer format with the specified number of [param samples] and returns its ID. */
        framebuffer_format_create_empty(samples: RenderingDevice.TextureSamples = 0): int64
        
        /** Returns the number of texture samples used for the given framebuffer [param format] ID (returned by [method framebuffer_get_format]). */
        framebuffer_format_get_texture_samples(format: int64, render_pass: int64 = 0): RenderingDevice.TextureSamples
        
        /** Creates a new framebuffer. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        framebuffer_create(textures: GArray, validate_with_format: int64 = -1, view_count: int64 = 1): RID
        
        /** Creates a new multipass framebuffer. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        framebuffer_create_multipass(textures: GArray, passes: GArray, validate_with_format: int64 = -1, view_count: int64 = 1): RID
        
        /** Creates a new empty framebuffer. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        framebuffer_create_empty(size: Vector2i, samples: RenderingDevice.TextureSamples = 0, validate_with_format: int64 = -1): RID
        
        /** Returns the format ID of the framebuffer specified by the [param framebuffer] RID. This ID is guaranteed to be unique for the same formats and does not need to be freed. */
        framebuffer_get_format(framebuffer: RID): int64
        
        /** Returns `true` if the framebuffer specified by the [param framebuffer] RID is valid, `false` otherwise. */
        framebuffer_is_valid(framebuffer: RID): boolean
        
        /** Creates a new sampler. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        sampler_create(state: RDSamplerState): RID
        
        /** Returns `true` if implementation supports using a texture of [param format] with the given [param sampler_filter]. */
        sampler_is_format_supported_for_filter(format: RenderingDevice.DataFormat, sampler_filter: RenderingDevice.SamplerFilter): boolean
        
        /** It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        vertex_buffer_create(size_bytes: int64, data: PackedByteArray | byte[] | ArrayBuffer = [], creation_bits: RenderingDevice.BufferCreationBits = 0): RID
        
        /** Creates a new vertex format with the specified [param vertex_descriptions]. Returns a unique vertex format ID corresponding to the newly created vertex format. */
        vertex_format_create(vertex_descriptions: GArray): int64
        
        /** Creates a vertex array based on the specified buffers. Optionally, [param offsets] (in bytes) may be defined for each buffer. */
        vertex_array_create(vertex_count: int64, vertex_format: int64, src_buffers: GArray, offsets: PackedInt64Array | int64[] = []): RID
        
        /** Creates a new index buffer. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        index_buffer_create(size_indices: int64, format: RenderingDevice.IndexBufferFormat, data: PackedByteArray | byte[] | ArrayBuffer = [], use_restart_indices: boolean = false, creation_bits: RenderingDevice.BufferCreationBits = 0): RID
        
        /** Creates a new index array. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        index_array_create(index_buffer: RID, index_offset: int64, index_count: int64): RID
        
        /** Compiles a SPIR-V from the shader source code in [param shader_source] and returns the SPIR-V as a [RDShaderSPIRV]. This intermediate language shader is portable across different GPU models and driver versions, but cannot be run directly by GPUs until compiled into a binary shader using [method shader_compile_binary_from_spirv].  
         *  If [param allow_cache] is `true`, make use of the shader cache generated by Godot. This avoids a potentially lengthy shader compilation step if the shader is already in cache. If [param allow_cache] is `false`, Godot's shader cache is ignored and the shader will always be recompiled.  
         */
        shader_compile_spirv_from_source(shader_source: RDShaderSource, allow_cache: boolean = true): RDShaderSPIRV
        
        /** Compiles a binary shader from [param spirv_data] and returns the compiled binary data as a [PackedByteArray]. This compiled shader is specific to the GPU model and driver version used; it will not work on different GPU models or even different driver versions. See also [method shader_compile_spirv_from_source].  
         *  [param name] is an optional human-readable name that can be given to the compiled shader for organizational purposes.  
         */
        shader_compile_binary_from_spirv(spirv_data: RDShaderSPIRV, name: string = ''): PackedByteArray
        
        /** Creates a new shader instance from SPIR-V intermediate code. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method. See also [method shader_compile_spirv_from_source] and [method shader_create_from_bytecode].  
         */
        shader_create_from_spirv(spirv_data: RDShaderSPIRV, name: string = ''): RID
        
        /** Creates a new shader instance from a binary compiled shader. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method. See also [method shader_compile_binary_from_spirv] and [method shader_create_from_spirv].  
         */
        shader_create_from_bytecode(binary_data: PackedByteArray | byte[] | ArrayBuffer, placeholder_rid: RID = new RID()): RID
        
        /** Create a placeholder RID by allocating an RID without initializing it for use in [method shader_create_from_bytecode]. This allows you to create an RID for a shader and pass it around, but defer compiling the shader to a later time. */
        shader_create_placeholder(): RID
        
        /** Returns the internal vertex input mask. Internally, the vertex input mask is an unsigned integer consisting of the locations (specified in GLSL via. `layout(location = ...)`) of the input variables (specified in GLSL by the `in` keyword). */
        shader_get_vertex_input_attribute_mask(shader: RID): int64
        
        /** Creates a new uniform buffer. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        uniform_buffer_create(size_bytes: int64, data: PackedByteArray | byte[] | ArrayBuffer = [], creation_bits: RenderingDevice.BufferCreationBits = 0): RID
        
        /** Creates a [url=https://vkguide.dev/docs/chapter-4/storage_buffers/]storage buffer[/url] with the specified [param data] and [param usage]. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        storage_buffer_create(size_bytes: int64, data: PackedByteArray | byte[] | ArrayBuffer = [], usage: RenderingDevice.StorageBufferUsage = 0, creation_bits: RenderingDevice.BufferCreationBits = 0): RID
        
        /** Creates a new texture buffer. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        texture_buffer_create(size_bytes: int64, format: RenderingDevice.DataFormat, data: PackedByteArray | byte[] | ArrayBuffer = []): RID
        
        /** Creates a new uniform set. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        uniform_set_create(uniforms: GArray, shader: RID, shader_set: int64): RID
        
        /** Checks if the [param uniform_set] is valid, i.e. is owned. */
        uniform_set_is_valid(uniform_set: RID): boolean
        
        /** Copies [param size] bytes from the [param src_buffer] at [param src_offset] into [param dst_buffer] at [param dst_offset].  
         *  Prints an error if:  
         *  - [param size] exceeds the size of either [param src_buffer] or [param dst_buffer] at their corresponding offsets  
         *  - a draw list is currently active (created by [method draw_list_begin])  
         *  - a compute list is currently active (created by [method compute_list_begin])  
         */
        buffer_copy(src_buffer: RID, dst_buffer: RID, src_offset: int64, dst_offset: int64, size: int64): GError
        
        /** Updates a region of [param size_bytes] bytes, starting at [param offset], in the buffer, with the specified [param data].  
         *  Prints an error if:  
         *  - the region specified by [param offset] + [param size_bytes] exceeds the buffer  
         *  - a draw list is currently active (created by [method draw_list_begin])  
         *  - a compute list is currently active (created by [method compute_list_begin])  
         */
        buffer_update(buffer: RID, offset: int64, size_bytes: int64, data: PackedByteArray | byte[] | ArrayBuffer): GError
        
        /** Clears the contents of the [param buffer], clearing [param size_bytes] bytes, starting at [param offset].  
         *  Prints an error if:  
         *  - the size isn't a multiple of four  
         *  - the region specified by [param offset] + [param size_bytes] exceeds the buffer  
         *  - a draw list is currently active (created by [method draw_list_begin])  
         *  - a compute list is currently active (created by [method compute_list_begin])  
         */
        buffer_clear(buffer: RID, offset: int64, size_bytes: int64): GError
        
        /** Returns a copy of the data of the specified [param buffer], optionally [param offset_bytes] and [param size_bytes] can be set to copy only a portion of the buffer.  
         *      
         *  **Note:** This method will block the GPU from working until the data is retrieved. Refer to [method buffer_get_data_async] for an alternative that returns the data in more performant way.  
         */
        buffer_get_data(buffer: RID, offset_bytes: int64 = 0, size_bytes: int64 = 0): PackedByteArray
        
        /** Asynchronous version of [method buffer_get_data]. RenderingDevice will call [param callback] in a certain amount of frames with the data the buffer had at the time of the request.  
         *      
         *  **Note:** At the moment, the delay corresponds to the amount of frames specified by [member ProjectSettings.rendering/rendering_device/vsync/frame_queue_size].  
         *      
         *  **Note:** Downloading large buffers can have a prohibitive cost for real-time even when using the asynchronous method due to hardware bandwidth limitations. When dealing with large resources, you can adjust settings such as [member ProjectSettings.rendering/rendering_device/staging_buffer/block_size_kb] to improve the transfer speed at the cost of extra memory.  
         *    
         */
        buffer_get_data_async(buffer: RID, callback: Callable, offset_bytes: int64 = 0, size_bytes: int64 = 0): GError
        
        /** Returns the address of the given [param buffer] which can be passed to shaders in any way to access underlying data. Buffer must have been created with this feature enabled.  
         *      
         *  **Note:** You must check that the GPU supports this functionality by calling [method has_feature] with [constant SUPPORTS_BUFFER_DEVICE_ADDRESS] as a parameter.  
         */
        buffer_get_device_address(buffer: RID): int64
        
        /** Creates a new render pipeline. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        render_pipeline_create(shader: RID, framebuffer_format: int64, vertex_format: int64, primitive: RenderingDevice.RenderPrimitive, rasterization_state: RDPipelineRasterizationState, multisample_state: RDPipelineMultisampleState, stencil_state: RDPipelineDepthStencilState, color_blend_state: RDPipelineColorBlendState, dynamic_state_flags: RenderingDevice.PipelineDynamicStateFlags = 0, for_render_pass: int64 = 0, specialization_constants: GArray = []): RID
        
        /** Returns `true` if the render pipeline specified by the [param render_pipeline] RID is valid, `false` otherwise. */
        render_pipeline_is_valid(render_pipeline: RID): boolean
        
        /** Creates a new compute pipeline. It can be accessed with the RID that is returned.  
         *  Once finished with your RID, you will want to free the RID using the RenderingDevice's [method free_rid] method.  
         */
        compute_pipeline_create(shader: RID, specialization_constants: GArray = []): RID
        
        /** Returns `true` if the compute pipeline specified by the [param compute_pipeline] RID is valid, `false` otherwise. */
        compute_pipeline_is_valid(compute_pipeline: RID): boolean
        
        /** Returns the window width matching the graphics API context for the given window ID (in pixels). Despite the parameter being named [param screen], this returns the  *window*  size. See also [method screen_get_height].  
         *      
         *  **Note:** Only the main [RenderingDevice] returned by [method RenderingServer.get_rendering_device] has a width. If called on a local [RenderingDevice], this method prints an error and returns [constant INVALID_ID].  
         */
        screen_get_width(screen: int64 = 0): int64
        
        /** Returns the window height matching the graphics API context for the given window ID (in pixels). Despite the parameter being named [param screen], this returns the  *window*  size. See also [method screen_get_width].  
         *      
         *  **Note:** Only the main [RenderingDevice] returned by [method RenderingServer.get_rendering_device] has a height. If called on a local [RenderingDevice], this method prints an error and returns [constant INVALID_ID].  
         */
        screen_get_height(screen: int64 = 0): int64
        
        /** Returns the framebuffer format of the given screen.  
         *      
         *  **Note:** Only the main [RenderingDevice] returned by [method RenderingServer.get_rendering_device] has a format. If called on a local [RenderingDevice], this method prints an error and returns [constant INVALID_ID].  
         */
        screen_get_framebuffer_format(screen: int64 = 0): int64
        
        /** High-level variant of [method draw_list_begin], with the parameters automatically being adjusted for drawing onto the window specified by the [param screen] ID.  
         *      
         *  **Note:** Cannot be used with local RenderingDevices, as these don't have a screen. If called on a local RenderingDevice, [method draw_list_begin_for_screen] returns [constant INVALID_ID].  
         */
        draw_list_begin_for_screen(screen: int64 = 0, clear_color: Color = new Color(0, 0, 0, 1)): int64
        
        /** Starts a list of raster drawing commands created with the `draw_*` methods. The returned value should be passed to other `draw_list_*` functions.  
         *  Multiple draw lists cannot be created at the same time; you must finish the previous draw list first using [method draw_list_end].  
         *  A simple drawing operation might look like this (code is not a complete example):  
         *    
         *  The [param draw_flags] indicates if the texture attachments of the framebuffer should be cleared or ignored. Only one of the two flags can be used for each individual attachment. Ignoring an attachment means that any contents that existed before the draw list will be completely discarded, reducing the memory bandwidth used by the render pass but producing garbage results if the pixels aren't replaced. The default behavior allows the engine to figure out the right operation to use if the texture is discardable, which can result in increased performance. See [RDTextureFormat] or [method texture_set_discardable].  
         *  The [param breadcrumb] parameter can be an arbitrary 32-bit integer that is useful to diagnose GPU crashes. If Godot is built in dev or debug mode; when the GPU crashes Godot will dump all shaders that were being executed at the time of the crash and the breadcrumb is useful to diagnose what passes did those shaders belong to.  
         *  It does not affect rendering behavior and can be set to 0. It is recommended to use [enum BreadcrumbMarker] enumerations for consistency but it's not required. It is also possible to use bitwise operations to add extra data. e.g.  
         *    
         */
        draw_list_begin(framebuffer: RID, draw_flags: RenderingDevice.DrawFlags = 0, clear_color_values: PackedColorArray | Color[] = [], clear_depth_value: float64 = 1, clear_stencil_value: int64 = 0, region: Rect2 = new Rect2(0, 0, 0, 0), breadcrumb: int64 = 0): int64
        
        /** This method does nothing and always returns an empty [PackedInt64Array]. */
        draw_list_begin_split(framebuffer: RID, splits: int64, initial_color_action: RenderingDevice.InitialAction, final_color_action: RenderingDevice.FinalAction, initial_depth_action: RenderingDevice.InitialAction, final_depth_action: RenderingDevice.FinalAction, clear_color_values: PackedColorArray | Color[] = [], clear_depth: float64 = 1, clear_stencil: int64 = 0, region: Rect2 = new Rect2(0, 0, 0, 0), storage_textures: GArray = []): PackedInt64Array
        
        /** Sets blend constants for the specified [param draw_list] to [param color]. Blend constants are used only if the graphics pipeline is created with [constant DYNAMIC_STATE_BLEND_CONSTANTS] flag set. */
        draw_list_set_blend_constants(draw_list: int64, color: Color): void
        
        /** Binds [param render_pipeline] to the specified [param draw_list]. */
        draw_list_bind_render_pipeline(draw_list: int64, render_pipeline: RID): void
        
        /** Binds [param uniform_set] to the specified [param draw_list]. A [param set_index] must also be specified, which is an identifier starting from `0` that must match the one expected by the draw list. */
        draw_list_bind_uniform_set(draw_list: int64, uniform_set: RID, set_index: int64): void
        
        /** Binds [param vertex_array] to the specified [param draw_list]. */
        draw_list_bind_vertex_array(draw_list: int64, vertex_array: RID): void
        
        /** Binds [param index_array] to the specified [param draw_list]. */
        draw_list_bind_index_array(draw_list: int64, index_array: RID): void
        
        /** Sets the push constant data to [param buffer] for the specified [param draw_list]. The shader determines how this binary data is used. The buffer's size in bytes must also be specified in [param size_bytes] (this can be obtained by calling the [method PackedByteArray.size] method on the passed [param buffer]). */
        draw_list_set_push_constant(draw_list: int64, buffer: PackedByteArray | byte[] | ArrayBuffer, size_bytes: int64): void
        
        /** Submits [param draw_list] for rendering on the GPU. This is the raster equivalent to [method compute_list_dispatch]. */
        draw_list_draw(draw_list: int64, use_indices: boolean, instances: int64, procedural_vertex_count: int64 = 0): void
        
        /** Submits [param draw_list] for rendering on the GPU with the given parameters stored in the [param buffer] at [param offset]. Parameters being integers: vertex count, instance count, first vertex, first instance. And when using indices: index count, instance count, first index, vertex offset, first instance. Buffer must have been created with [constant STORAGE_BUFFER_USAGE_DISPATCH_INDIRECT] flag. */
        draw_list_draw_indirect(draw_list: int64, use_indices: boolean, buffer: RID, offset: int64 = 0, draw_count: int64 = 1, stride: int64 = 0): void
        
        /** Creates a scissor rectangle and enables it for the specified [param draw_list]. Scissor rectangles are used for clipping by discarding fragments that fall outside a specified rectangular portion of the screen. See also [method draw_list_disable_scissor].  
         *      
         *  **Note:** The specified [param rect] is automatically intersected with the screen's dimensions, which means it cannot exceed the screen's dimensions.  
         */
        draw_list_enable_scissor(draw_list: int64, rect: Rect2 = new Rect2(0, 0, 0, 0)): void
        
        /** Removes and disables the scissor rectangle for the specified [param draw_list]. See also [method draw_list_enable_scissor]. */
        draw_list_disable_scissor(draw_list: int64): void
        
        /** Switches to the next draw pass. */
        draw_list_switch_to_next_pass(): int64
        
        /** This method does nothing and always returns an empty [PackedInt64Array]. */
        draw_list_switch_to_next_pass_split(splits: int64): PackedInt64Array
        
        /** Finishes a list of raster drawing commands created with the `draw_*` methods. */
        draw_list_end(): void
        
        /** Starts a list of compute commands created with the `compute_*` methods. The returned value should be passed to other `compute_list_*` functions.  
         *  Multiple compute lists cannot be created at the same time; you must finish the previous compute list first using [method compute_list_end].  
         *  A simple compute operation might look like this (code is not a complete example):  
         *    
         */
        compute_list_begin(): int64
        
        /** Tells the GPU what compute pipeline to use when processing the compute list. If the shader has changed since the last time this function was called, Godot will unbind all descriptor sets and will re-bind them inside [method compute_list_dispatch]. */
        compute_list_bind_compute_pipeline(compute_list: int64, compute_pipeline: RID): void
        
        /** Sets the push constant data to [param buffer] for the specified [param compute_list]. The shader determines how this binary data is used. The buffer's size in bytes must also be specified in [param size_bytes] (this can be obtained by calling the [method PackedByteArray.size] method on the passed [param buffer]). */
        compute_list_set_push_constant(compute_list: int64, buffer: PackedByteArray | byte[] | ArrayBuffer, size_bytes: int64): void
        
        /** Binds the [param uniform_set] to this [param compute_list]. Godot ensures that all textures in the uniform set have the correct Vulkan access masks. If Godot had to change access masks of textures, it will raise a Vulkan image memory barrier. */
        compute_list_bind_uniform_set(compute_list: int64, uniform_set: RID, set_index: int64): void
        
        /** Submits the compute list for processing on the GPU. This is the compute equivalent to [method draw_list_draw]. */
        compute_list_dispatch(compute_list: int64, x_groups: int64, y_groups: int64, z_groups: int64): void
        
        /** Submits the compute list for processing on the GPU with the given group counts stored in the [param buffer] at [param offset]. Buffer must have been created with [constant STORAGE_BUFFER_USAGE_DISPATCH_INDIRECT] flag. */
        compute_list_dispatch_indirect(compute_list: int64, buffer: RID, offset: int64): void
        
        /** Raises a Vulkan compute barrier in the specified [param compute_list]. */
        compute_list_add_barrier(compute_list: int64): void
        
        /** Finishes a list of compute commands created with the `compute_*` methods. */
        compute_list_end(): void
        
        /** Tries to free an object in the RenderingDevice. To avoid memory leaks, this should be called after using an object as memory management does not occur automatically when using RenderingDevice directly. */
        free_rid(rid: RID): void
        
        /** Creates a timestamp marker with the specified [param name]. This is used for performance reporting with the [method get_captured_timestamp_cpu_time], [method get_captured_timestamp_gpu_time] and [method get_captured_timestamp_name] methods. */
        capture_timestamp(name: string): void
        
        /** Returns the total number of timestamps (rendering steps) available for profiling. */
        get_captured_timestamps_count(): int64
        
        /** Returns the index of the last frame rendered that has rendering timestamps available for querying. */
        get_captured_timestamps_frame(): int64
        
        /** Returns the timestamp in GPU time for the rendering step specified by [param index] (in microseconds since the engine started). See also [method get_captured_timestamp_cpu_time] and [method capture_timestamp]. */
        get_captured_timestamp_gpu_time(index: int64): int64
        
        /** Returns the timestamp in CPU time for the rendering step specified by [param index] (in microseconds since the engine started). See also [method get_captured_timestamp_gpu_time] and [method capture_timestamp]. */
        get_captured_timestamp_cpu_time(index: int64): int64
        
        /** Returns the timestamp's name for the rendering step specified by [param index]. See also [method capture_timestamp]. */
        get_captured_timestamp_name(index: int64): string
        
        /** Returns `true` if the [param feature] is supported by the GPU. */
        has_feature(feature: RenderingDevice.Features): boolean
        
        /** Returns the value of the specified [param limit]. This limit varies depending on the current graphics hardware (and sometimes the driver version). If the given limit is exceeded, rendering errors will occur.  
         *  Limits for various graphics hardware can be found in the [url=https://vulkan.gpuinfo.org/]Vulkan Hardware Database[/url].  
         */
        limit_get(limit: RenderingDevice.Limit): int64
        
        /** Returns the frame count kept by the graphics API. Higher values result in higher input lag, but with more consistent throughput. For the main [RenderingDevice], frames are cycled (usually 3 with triple-buffered V-Sync enabled). However, local [RenderingDevice]s only have 1 frame. */
        get_frame_delay(): int64
        
        /** Pushes the frame setup and draw command buffers then marks the local device as currently processing (which allows calling [method sync]).  
         *      
         *  **Note:** Only available in local RenderingDevices.  
         */
        submit(): void
        
        /** Forces a synchronization between the CPU and GPU, which may be required in certain cases. Only call this when needed, as CPU-GPU synchronization has a performance cost.  
         *      
         *  **Note:** Only available in local RenderingDevices.  
         *      
         *  **Note:** [method sync] can only be called after a [method submit].  
         */
        sync(): void
        
        /** This method does nothing. */
        barrier(from: RenderingDevice.BarrierMask = 32767, to: RenderingDevice.BarrierMask = 32767): void
        
        /** This method does nothing. */
        full_barrier(): void
        
        /** Create a new local [RenderingDevice]. This is most useful for performing compute operations on the GPU independently from the rest of the engine. */
        create_local_device(): RenderingDevice
        
        /** Sets the resource name for [param id] to [param name]. This is used for debugging with third-party tools such as [url=https://renderdoc.org/]RenderDoc[/url].  
         *  The following types of resources can be named: texture, sampler, vertex buffer, index buffer, uniform buffer, texture buffer, storage buffer, uniform set buffer, shader, render pipeline and compute pipeline. Framebuffers cannot be named. Attempting to name an incompatible resource type will print an error.  
         *      
         *  **Note:** Resource names are only set when the engine runs in verbose mode ([method OS.is_stdout_verbose] = `true`), or when using an engine build compiled with the `dev_mode=yes` SCons option. The graphics driver must also support the `VK_EXT_DEBUG_UTILS_EXTENSION_NAME` Vulkan extension for named resources to work.  
         */
        set_resource_name(id: RID, name: string): void
        
        /** Create a command buffer debug label region that can be displayed in third-party tools such as [url=https://renderdoc.org/]RenderDoc[/url]. All regions must be ended with a [method draw_command_end_label] call. When viewed from the linear series of submissions to a single queue, calls to [method draw_command_begin_label] and [method draw_command_end_label] must be matched and balanced.  
         *  The `VK_EXT_DEBUG_UTILS_EXTENSION_NAME` Vulkan extension must be available and enabled for command buffer debug label region to work. See also [method draw_command_end_label].  
         */
        draw_command_begin_label(name: string, color: Color): void
        
        /** This method does nothing. */
        draw_command_insert_label(name: string, color: Color): void
        
        /** Ends the command buffer debug label region started by a [method draw_command_begin_label] call. */
        draw_command_end_label(): void
        
        /** Returns the vendor of the video adapter (e.g. "NVIDIA Corporation"). Equivalent to [method RenderingServer.get_video_adapter_vendor]. See also [method get_device_name]. */
        get_device_vendor_name(): string
        
        /** Returns the name of the video adapter (e.g. "GeForce GTX 1080/PCIe/SSE2"). Equivalent to [method RenderingServer.get_video_adapter_name]. See also [method get_device_vendor_name]. */
        get_device_name(): string
        
        /** Returns the universally unique identifier for the pipeline cache. This is used to cache shader files on disk, which avoids shader recompilations on subsequent engine runs. This UUID varies depending on the graphics card model, but also the driver version. Therefore, updating graphics drivers will invalidate the shader cache. */
        get_device_pipeline_cache_uuid(): string
        
        /** Returns the memory usage in bytes corresponding to the given [param type]. When using Vulkan, these statistics are calculated by [url=https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator]Vulkan Memory Allocator[/url]. */
        get_memory_usage(type: RenderingDevice.MemoryType): int64
        
        /** Returns the unique identifier of the driver [param resource] for the specified [param rid]. Some driver resource types ignore the specified [param rid] (see [enum DriverResource] descriptions). [param index] is always ignored but must be specified anyway. */
        get_driver_resource(resource: RenderingDevice.DriverResource, rid: RID, index: int64): int64
        
        /** Returns a string with a performance report from the past frame. Updates every frame. */
        get_perf_report(): string
        
        /** Returns string report in CSV format using the following methods:  
         *  - [method get_tracked_object_name]  
         *  - [method get_tracked_object_type_count]  
         *  - [method get_driver_total_memory]  
         *  - [method get_driver_allocation_count]  
         *  - [method get_driver_memory_by_object_type]  
         *  - [method get_driver_allocs_by_object_type]  
         *  - [method get_device_total_memory]  
         *  - [method get_device_allocation_count]  
         *  - [method get_device_memory_by_object_type]  
         *  - [method get_device_allocs_by_object_type]  
         *  This is only used by Vulkan in debug builds. Godot must also be started with the `--extra-gpu-memory-tracking` [url=https://docs.godotengine.org/en/4.4/tutorials/editor/command_line_tutorial.html]command line argument[/url].  
         */
        get_driver_and_device_memory_report(): string
        
        /** Returns the name of the type of object for the given [param type_index]. This value must be in range `[0; get_tracked_object_type_count - 1]`. If [method get_tracked_object_type_count] is 0, then type argument is ignored and always returns the same string.  
         *  The return value is important because it gives meaning to the types passed to [method get_driver_memory_by_object_type], [method get_driver_allocs_by_object_type], [method get_device_memory_by_object_type], and [method get_device_allocs_by_object_type]. Examples of strings it can return (not exhaustive):  
         *  - DEVICE_MEMORY  
         *  - PIPELINE_CACHE  
         *  - SWAPCHAIN_KHR  
         *  - COMMAND_POOL  
         *  Thus if e.g. `get_tracked_object_name(5)` returns "COMMAND_POOL", then `get_device_memory_by_object_type(5)` returns the bytes used by the GPU for command pools.  
         *  This is only used by Vulkan in debug builds. Godot must also be started with the `--extra-gpu-memory-tracking` [url=https://docs.godotengine.org/en/4.4/tutorials/editor/command_line_tutorial.html]command line argument[/url].  
         */
        get_tracked_object_name(type_index: int64): string
        
        /** Returns how many types of trackable objects are.  
         *  This is only used by Vulkan in debug builds. Godot must also be started with the `--extra-gpu-memory-tracking` [url=https://docs.godotengine.org/en/4.4/tutorials/editor/command_line_tutorial.html]command line argument[/url].  
         */
        get_tracked_object_type_count(): int64
        
        /** Returns how much bytes the GPU driver is using for internal driver structures.  
         *  This is only used by Vulkan in debug builds and can return 0 when this information is not tracked or unknown.  
         */
        get_driver_total_memory(): int64
        
        /** Returns how many allocations the GPU driver has performed for internal driver structures.  
         *  This is only used by Vulkan in debug builds and can return 0 when this information is not tracked or unknown.  
         */
        get_driver_allocation_count(): int64
        
        /** Same as [method get_driver_total_memory] but filtered for a given object type.  
         *  The type argument must be in range `[0; get_tracked_object_type_count - 1]`. If [method get_tracked_object_type_count] is 0, then type argument is ignored and always returns 0.  
         *  This is only used by Vulkan in debug builds and can return 0 when this information is not tracked or unknown.  
         */
        get_driver_memory_by_object_type(type: int64): int64
        
        /** Same as [method get_driver_allocation_count] but filtered for a given object type.  
         *  The type argument must be in range `[0; get_tracked_object_type_count - 1]`. If [method get_tracked_object_type_count] is 0, then type argument is ignored and always returns 0.  
         *  This is only used by Vulkan in debug builds and can return 0 when this information is not tracked or unknown.  
         */
        get_driver_allocs_by_object_type(type: int64): int64
        
        /** Returns how much bytes the GPU is using.  
         *  This is only used by Vulkan in debug builds and can return 0 when this information is not tracked or unknown.  
         */
        get_device_total_memory(): int64
        
        /** Returns how many allocations the GPU has performed for internal driver structures.  
         *  This is only used by Vulkan in debug builds and can return 0 when this information is not tracked or unknown.  
         */
        get_device_allocation_count(): int64
        
        /** Same as [method get_device_total_memory] but filtered for a given object type.  
         *  The type argument must be in range `[0; get_tracked_object_type_count - 1]`. If [method get_tracked_object_type_count] is 0, then type argument is ignored and always returns 0.  
         *  This is only used by Vulkan in debug builds and can return 0 when this information is not tracked or unknown.  
         */
        get_device_memory_by_object_type(type: int64): int64
        
        /** Same as [method get_device_allocation_count] but filtered for a given object type.  
         *  The type argument must be in range `[0; get_tracked_object_type_count - 1]`. If [method get_tracked_object_type_count] is 0, then type argument is ignored and always returns 0.  
         *  This is only used by Vulkan in debug builds and can return 0 when this information is not tracked or unknown.  
         */
        get_device_allocs_by_object_type(type: int64): int64
    }
    class ReparentDialog<Map extends Record<string, Node> = Record<string, Node>> extends ConfirmationDialog<Map> {
        constructor(identifier?: any)
        _cancel(): void
        readonly reparent: Signal2<NodePath | string, boolean>
    }
    class ReplicationEditor<Map extends Record<string, Node> = Record<string, Node>> extends VBoxContainer<Map> {
        constructor(identifier?: any)
        _update_config(): void
        _update_value(property: NodePath | string, column: int64, value: int64): void
    }
    /** Base class for serializable objects.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resource.html  
     */
    class Resource extends RefCounted {
        constructor(identifier?: any)
        /** Override this method to customize the newly duplicated resource created from [method PackedScene.instantiate], if the original's [member resource_local_to_scene] is set to `true`.  
         *  **Example:** Set a random `damage` value to every local resource from an instantiated scene:  
         *    
         */
        /* gdvirtual */ _setup_local_to_scene(): void
        
        /** Override this method to return a custom [RID] when [method get_rid] is called. */
        /* gdvirtual */ _get_rid(): RID
        
        /** For resources that use a variable number of properties, either via [method Object._validate_property] or [method Object._get_property_list], this method should be implemented to correctly clear the resource's state. */
        /* gdvirtual */ _reset_state(): void
        
        /** Sets the resource's path to [param path] without involving the resource cache. */
        /* gdvirtual */ _set_path_cache(path: string): void
        
        /** Sets the [member resource_path] to [param path], potentially overriding an existing cache entry for this path. Further attempts to load an overridden resource by path will instead return this resource. */
        take_over_path(path: string): void
        
        /** Sets the resource's path to [param path] without involving the resource cache. */
        set_path_cache(path: string): void
        
        /** Returns the [RID] of this resource (or an empty RID). Many resources (such as [Texture2D], [Mesh], and so on) are high-level abstractions of resources stored in a specialized server ([DisplayServer], [RenderingServer], etc.), so this function will return the original [RID]. */
        get_rid(): RID
        
        /** If [member resource_local_to_scene] is set to `true` and the resource has been loaded from a [PackedScene] instantiation, returns the root [Node] of the scene where this resource is used. Otherwise, returns `null`. */
        get_local_scene(): Node
        
        /** Calls [method _setup_local_to_scene]. If [member resource_local_to_scene] is set to `true`, this method is automatically called from [method PackedScene.instantiate] by the newly duplicated resource within the scene instance. */
        setup_local_to_scene(): void
        
        /** For resources that use a variable number of properties, either via [method Object._validate_property] or [method Object._get_property_list], override [method _reset_state] to correctly clear the resource's state. */
        reset_state(): void
        
        /** Sets the unique identifier to [param id] for the resource with the given [param path] in the resource cache. If the unique identifier is empty, the cache entry using [param path] is removed if it exists.  
         *      
         *  **Note:** This method is only implemented when running in an editor context.  
         */
        set_id_for_path(path: string, id: string): void
        
        /** Returns the unique identifier for the resource with the given [param path] from the resource cache. If the resource is not loaded and cached, an empty string is returned.  
         *      
         *  **Note:** This method is only implemented when running in an editor context. At runtime, it returns an empty string.  
         */
        get_id_for_path(path: string): string
        
        /** Returns `true` if the resource is built-in (from the engine) or `false` if it is user-defined. */
        is_built_in(): boolean
        
        /** Generates a unique identifier for a resource to be contained inside a [PackedScene], based on the current date, time, and a random value. The returned string is only composed of letters (`a` to `y`) and numbers (`0` to `8`). See also [member resource_scene_unique_id]. */
        static generate_scene_unique_id(): string
        
        /** Emits the [signal changed] signal. This method is called automatically for some built-in resources.  
         *      
         *  **Note:** For custom resources, it's recommended to call this method whenever a meaningful change occurs, such as a modified property. This ensures that custom [Object]s depending on the resource are properly updated.  
         *    
         */
        emit_changed(): void
        
        /** Duplicates this resource, returning a new resource with its `export`ed or [constant PROPERTY_USAGE_STORAGE] properties copied from the original.  
         *  If [param subresources] is `false`, a shallow copy is returned; nested resources within subresources are not duplicated and are shared with the original resource (with one exception; see below). If [param subresources] is `true`, a deep copy is returned; nested subresources will be duplicated and are not shared (with two exceptions; see below).  
         *  [param subresources] is usually respected, with the following exceptions:  
         *  - Subresource properties with the [constant PROPERTY_USAGE_ALWAYS_DUPLICATE] flag are always duplicated.  
         *  - Subresource properties with the [constant PROPERTY_USAGE_NEVER_DUPLICATE] flag are never duplicated.  
         *  - Subresources inside [Array] and [Dictionary] properties are never duplicated.  
         *      
         *  **Note:** For custom resources, this method will fail if [method Object._init] has been defined with required parameters.  
         */
        duplicate(subresources: boolean = false): Resource
        
        /** If `true`, the resource is duplicated for each instance of all scenes using it. At run-time, the resource can be modified in one scene without affecting other instances (see [method PackedScene.instantiate]).  
         *      
         *  **Note:** Changing this property at run-time has no effect on already created duplicate resources.  
         */
        get resource_local_to_scene(): boolean
        set resource_local_to_scene(value: boolean)
        
        /** The unique path to this resource. If it has been saved to disk, the value will be its filepath. If the resource is exclusively contained within a scene, the value will be the [PackedScene]'s filepath, followed by a unique identifier.  
         *      
         *  **Note:** Setting this property manually may fail if a resource with the same path has already been previously loaded. If necessary, use [method take_over_path].  
         */
        get resource_path(): string
        set resource_path(value: string)
        
        /** An optional name for this resource. When defined, its value is displayed to represent the resource in the Inspector dock. For built-in scripts, the name is displayed as part of the tab name in the script editor.  
         *      
         *  **Note:** Some resource formats do not support resource names. You can still set the name in the editor or via code, but it will be lost when the resource is reloaded. For example, only built-in scripts can have a resource name, while scripts stored in separate files cannot.  
         */
        get resource_name(): string
        set resource_name(value: string)
        
        /** An unique identifier relative to the this resource's scene. If left empty, the ID is automatically generated when this resource is saved inside a [PackedScene]. If the resource is not inside a scene, this property is empty by default.  
         *      
         *  **Note:** When the [PackedScene] is saved, if multiple resources in the same scene use the same ID, only the earliest resource in the scene hierarchy keeps the original ID. The other resources are assigned new IDs from [method generate_scene_unique_id].  
         *      
         *  **Note:** Setting this property does not emit the [signal changed] signal.  
         *  **Warning:** When setting, the ID must only consist of letters, numbers, and underscores. Otherwise, it will fail and default to a randomly generated ID.  
         */
        get resource_scene_unique_id(): string
        set resource_scene_unique_id(value: string)
        
        /** Emitted when the resource changes, usually when one of its properties is modified. See also [method emit_changed].  
         *      
         *  **Note:** This signal is not emitted automatically for properties of custom resources. If necessary, a setter needs to be created to emit the signal.  
         */
        readonly changed: Signal0
        
        /** Emitted by a newly duplicated resource with [member resource_local_to_scene] set to `true`. */
        readonly setup_local_to_scene_requested: Signal0
    }
    class ResourceFormatImporterSaver extends ResourceFormatSaver {
        constructor(identifier?: any)
    }
    namespace ResourceFormatLoader {
        enum CacheMode {
            /** Neither the main resource (the one requested to be loaded) nor any of its subresources are retrieved from cache nor stored into it. Dependencies (external resources) are loaded with [constant CACHE_MODE_REUSE]. */
            CACHE_MODE_IGNORE = 0,
            
            /** The main resource (the one requested to be loaded), its subresources, and its dependencies (external resources) are retrieved from cache if present, instead of loaded. Those not cached are loaded and then stored into the cache. The same rules are propagated recursively down the tree of dependencies (external resources). */
            CACHE_MODE_REUSE = 1,
            
            /** Like [constant CACHE_MODE_REUSE], but the cache is checked for the main resource (the one requested to be loaded) as well as for each of its subresources. Those already in the cache, as long as the loaded and cached types match, have their data refreshed from storage into the already existing instances. Otherwise, they are recreated as completely new objects. */
            CACHE_MODE_REPLACE = 2,
            
            /** Like [constant CACHE_MODE_IGNORE], but propagated recursively down the tree of dependencies (external resources). */
            CACHE_MODE_IGNORE_DEEP = 3,
            
            /** Like [constant CACHE_MODE_REPLACE], but propagated recursively down the tree of dependencies (external resources). */
            CACHE_MODE_REPLACE_DEEP = 4,
        }
    }
    /** Loads a specific resource type from a file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceformatloader.html  
     */
    class ResourceFormatLoader extends RefCounted {
        constructor(identifier?: any)
        /** Gets the list of extensions for files this loader is able to read. */
        /* gdvirtual */ _get_recognized_extensions(): PackedStringArray
        
        /** Tells whether or not this loader should load a resource from its resource path for a given type.  
         *  If it is not implemented, the default behavior returns whether the path's extension is within the ones provided by [method _get_recognized_extensions], and if the type is within the ones provided by [method _get_resource_type].  
         */
        /* gdvirtual */ _recognize_path(path: string, type: StringName): boolean
        
        /** Tells which resource class this loader can load.  
         *      
         *  **Note:** Custom resource types defined by scripts aren't known by the [ClassDB], so you might just handle `"Resource"` for them.  
         */
        /* gdvirtual */ _handles_type(type: StringName): boolean
        
        /** Gets the class name of the resource associated with the given path. If the loader cannot handle it, it should return `""`.  
         *      
         *  **Note:** Custom resource types defined by scripts aren't known by the [ClassDB], so you might just return `"Resource"` for them.  
         */
        /* gdvirtual */ _get_resource_type(path: string): string
        
        /** Returns the script class name associated with the [Resource] under the given [param path]. If the resource has no script or the script isn't a named class, it should return `""`. */
        /* gdvirtual */ _get_resource_script_class(path: string): string
        
        /** Should return the unique ID for the resource associated with the given path. If this method is not overridden, a `.uid` file is generated along with the resource file, containing the unique ID. */
        /* gdvirtual */ _get_resource_uid(path: string): int64
        
        /** If implemented, gets the dependencies of a given resource. If [param add_types] is `true`, paths should be appended `::TypeName`, where `TypeName` is the class name of the dependency.  
         *      
         *  **Note:** Custom resource types defined by scripts aren't known by the [ClassDB], so you might just return `"Resource"` for them.  
         */
        /* gdvirtual */ _get_dependencies(path: string, add_types: boolean): PackedStringArray
        
        /** If implemented, renames dependencies within the given resource and saves it. [param renames] is a dictionary `{ String => String }` mapping old dependency paths to new paths.  
         *  Returns [constant OK] on success, or an [enum Error] constant in case of failure.  
         */
        /* gdvirtual */ _rename_dependencies(path: string, renames: GDictionary): GError
        /* gdvirtual */ _exists(path: string): boolean
        /* gdvirtual */ _get_classes_used(path: string): PackedStringArray
        
        /** Loads a resource when the engine finds this loader to be compatible. If the loaded resource is the result of an import, [param original_path] will target the source file. Returns a [Resource] object on success, or an [enum Error] constant in case of failure.  
         *  The [param cache_mode] property defines whether and how the cache should be used or updated when loading the resource. See [enum CacheMode] for details.  
         */
        /* gdvirtual */ _load(path: string, original_path: string, use_sub_threads: boolean, cache_mode: int64): any
    }
    /** Saves a specific resource type to a file.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceformatsaver.html  
     */
    class ResourceFormatSaver extends RefCounted {
        constructor(identifier?: any)
        /** Saves the given resource object to a file at the target [param path]. [param flags] is a bitmask composed with [enum ResourceSaver.SaverFlags] constants.  
         *  Returns [constant OK] on success, or an [enum Error] constant in case of failure.  
         */
        /* gdvirtual */ _save(resource: Resource, path: string, flags: int64): GError
        
        /** Sets a new UID for the resource at the given [param path]. Returns [constant OK] on success, or an [enum Error] constant in case of failure. */
        /* gdvirtual */ _set_uid(path: string, uid: int64): GError
        
        /** Returns whether the given resource object can be saved by this saver. */
        /* gdvirtual */ _recognize(resource: Resource): boolean
        
        /** Returns the list of extensions available for saving the resource object, provided it is recognized (see [method _recognize]). */
        /* gdvirtual */ _get_recognized_extensions(resource: Resource): PackedStringArray
        
        /** Returns `true` if this saver handles a given save path and `false` otherwise.  
         *  If this method is not implemented, the default behavior returns whether the path's extension is within the ones provided by [method _get_recognized_extensions].  
         */
        /* gdvirtual */ _recognize_path(resource: Resource, path: string): boolean
    }
    namespace ResourceImporter {
        enum ImportOrder {
            /** The default import order. */
            IMPORT_ORDER_DEFAULT = 0,
            
            /** The import order for scenes, which ensures scenes are imported  *after*  all other core resources such as textures. Custom importers should generally have an import order lower than `100` to avoid issues when importing scenes that rely on custom resources. */
            IMPORT_ORDER_SCENE = 100,
        }
    }
    /** Base class for resource importers.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporter.html  
     */
    class ResourceImporter extends RefCounted {
        constructor(identifier?: any)
    }
    /** Imports a bitmap font in the BMFont (`.fnt`) format.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterbmfont.html  
     */
    class ResourceImporterBMFont extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports a [BitMap] resource (2D array of boolean values).  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterbitmap.html  
     */
    class ResourceImporterBitMap extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports comma-separated values  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimportercsvtranslation.html  
     */
    class ResourceImporterCSVTranslation extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports a TTF, TTC, OTF, OTC, WOFF or WOFF2 font file for font rendering that adapts to any size.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterdynamicfont.html  
     */
    class ResourceImporterDynamicFont extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports a image for use in scripting, with no rendering capabilities.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterimage.html  
     */
    class ResourceImporterImage extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports a bitmap font where all glyphs have the same width and height.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterimagefont.html  
     */
    class ResourceImporterImageFont extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports a 3-dimensional texture ([Texture3D]), a [Texture2DArray], a [Cubemap] or a [CubemapArray].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterlayeredtexture.html  
     */
    class ResourceImporterLayeredTexture extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports an MP3 audio file for playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimportermp3.html  
     */
    class ResourceImporterMP3 extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports an OBJ 3D model as an independent [Mesh] or scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterobj.html  
     */
    class ResourceImporterOBJ extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports an Ogg Vorbis audio file for playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporteroggvorbis.html  
     */
    class ResourceImporterOggVorbis extends ResourceImporter {
        constructor(identifier?: any)
        /** Creates a new [AudioStreamOggVorbis] instance from the given buffer. The buffer must contain Ogg Vorbis data. */
        static load_from_buffer(stream_data: PackedByteArray | byte[] | ArrayBuffer): AudioStreamOggVorbis
        
        /** Creates a new [AudioStreamOggVorbis] instance from the given file path. The file must be in Ogg Vorbis format. */
        static load_from_file(path: string): AudioStreamOggVorbis
    }
    /** Imports a glTF, FBX, Collada or Blender 3D scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterscene.html  
     */
    class ResourceImporterScene extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports native GLSL shaders (not Godot shaders) as a [RDShaderFile].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimportershaderfile.html  
     */
    class ResourceImporterShaderFile extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports an image for use in 2D or 3D rendering.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimportertexture.html  
     */
    class ResourceImporterTexture extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports a collection of textures from a PNG image into an optimized [AtlasTexture] for 2D rendering.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimportertextureatlas.html  
     */
    class ResourceImporterTextureAtlas extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** Imports a WAV audio file for playback.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourceimporterwav.html  
     */
    class ResourceImporterWAV extends ResourceImporter {
        constructor(identifier?: any)
    }
    /** A node used to preload sub-resources inside a scene.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_resourcepreloader.html  
     */
    class ResourcePreloader<Map extends Record<string, Node> = Record<string, Node>> extends Node<Map> {
        constructor(identifier?: any)
        /** Adds a resource to the preloader with the given [param name]. If a resource with the given [param name] already exists, the new resource will be renamed to "[param name] N" where N is an incrementing number starting from 2. */
        add_resource(name: StringName, resource: Resource): void
        
        /** Removes the resource associated to [param name] from the preloader. */
        remove_resource(name: StringName): void
        
        /** Renames a resource inside the preloader from [param name] to [param newname]. */
        rename_resource(name: StringName, newname: StringName): void
        
        /** Returns `true` if the preloader contains a resource associated to [param name]. */
        has_resource(name: StringName): boolean
        
        /** Returns the resource associated to [param name]. */
        get_resource(name: StringName): Resource
        
        /** Returns the list of resources inside the preloader. */
        get_resource_list(): PackedStringArray
        get resources(): GArray
        set resources(value: GArray)
    }
    class ResourcePreloaderEditor<Map extends Record<string, Node> = Record<string, Node>> extends PanelContainer<Map> {
        constructor(identifier?: any)
        _update_library(): void
        _remove_resource(to_remove: string): void
    }
    class ResourcePreloaderEditorPlugin<Map extends Record<string, Node> = Record<string, Node>> extends EditorPlugin<Map> {
        constructor(identifier?: any)
    }
    namespace RetargetModifier3D {
        enum TransformFlag {
            /** If set, allows to retarget the position. */
            TRANSFORM_FLAG_POSITION = 1,
            
            /** If set, allows to retarget the rotation. */
            TRANSFORM_FLAG_ROTATION = 2,
            
            /** If set, allows to retarget the scale. */
            TRANSFORM_FLAG_SCALE = 4,
            
            /** If set, allows to retarget the position/rotation/scale. */
            TRANSFORM_FLAG_ALL = 7,
        }
    }
    /** A modifier to transfer parent skeleton poses (or global poses) to child skeletons in model space with different rests.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_retargetmodifier3d.html  
     */
    class RetargetModifier3D<Map extends Record<string, Node> = Record<string, Node>> extends SkeletonModifier3D<Map> {
        constructor(identifier?: any)
        /** Sets [constant TRANSFORM_FLAG_POSITION] into [member enable]. */
        set_position_enabled(enabled: boolean): void
        
        /** Returns `true` if [member enable] has [constant TRANSFORM_FLAG_POSITION]. */
        is_position_enabled(): boolean
        
        /** Sets [constant TRANSFORM_FLAG_ROTATION] into [member enable]. */
        set_rotation_enabled(enabled: boolean): void
        
        /** Returns `true` if [member enable] has [constant TRANSFORM_FLAG_ROTATION]. */
        is_rotation_enabled(): boolean
        
        /** Sets [constant TRANSFORM_FLAG_SCALE] into [member enable]. */
        set_scale_enabled(enabled: boolean): void
        
        /** Returns `true` if [member enable] has [constant TRANSFORM_FLAG_SCALE]. */
        is_scale_enabled(): boolean
        
        /** [SkeletonProfile] for retargeting bones with names matching the bone list. */
        get profile(): SkeletonProfile
        set profile(value: SkeletonProfile)
        
        /** If `false`, in case the target skeleton has fewer bones than the source skeleton, the source bone parent's transform will be ignored.  
         *  Instead, it is possible to retarget between models with different body shapes, and position, rotation, and scale can be retargeted separately.  
         *  If `true`, retargeting is performed taking into account global pose.  
         *  In case the target skeleton has fewer bones than the source skeleton, the source bone parent's transform is taken into account. However, bone length between skeletons must match exactly, if not, the bones will be forced to expand or shrink.  
         *  This is useful for using dummy bone with length `0` to match postures when retargeting between models with different number of bones.  
         */
        get use_global_pose(): boolean
        set use_global_pose(value: boolean)
        
        /** Flags to control the process of the transform elements individually when [member use_global_pose] is disabled. */
        get enable(): int64
        set enable(value: int64)
    }
    namespace RibbonTrailMesh {
        enum Shape {
            /** Gives the mesh a single flat face. */
            SHAPE_FLAT = 0,
            
            /** Gives the mesh two perpendicular flat faces, making a cross shape. */
            SHAPE_CROSS = 1,
        }
    }
    /** Represents a straight ribbon-shaped [PrimitiveMesh] with variable width.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_ribbontrailmesh.html  
     */
    class RibbonTrailMesh extends PrimitiveMesh {
        constructor(identifier?: any)
        /** Determines the shape of the ribbon. */
        get shape(): int64
        set shape(value: int64)
        
        /** The baseline size of the ribbon. The size of a particular section segment is obtained by multiplying this size by the value of the [member curve] at the given distance. */
        get size(): float64
        set size(value: float64)
        
        /** The total number of sections on the ribbon. */
        get sections(): int64
        set sections(value: int64)
        
        /** The length of a section of the ribbon. */
        get section_length(): float64
        set section_length(value: float64)
        
        /** The number of segments in a section. The [member curve] is sampled on each segment to determine its size. Higher values result in a more detailed ribbon at the cost of performance. */
        get section_segments(): int64
        set section_segments(value: int64)
        
        /** Determines the size of the ribbon along its length. The size of a particular section segment is obtained by multiplying the baseline [member size] by the value of this curve at the given distance. For values smaller than `0`, the faces will be inverted. Should be a unit [Curve]. */
        get curve(): Curve
        set curve(value: Curve)
    }
    /** A custom effect for a [RichTextLabel].  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_richtexteffect.html  
     */
    class RichTextEffect extends Resource {
        constructor(identifier?: any)
        /** Override this method to modify properties in [param char_fx]. The method must return `true` if the character could be transformed successfully. If the method returns `false`, it will skip transformation to avoid displaying broken text. */
        /* gdvirtual */ _process_custom_fx(char_fx: CharFXTransform): boolean
    }
    namespace RichTextLabel {
        enum ListType {
            /** Each list item has a number marker. */
            LIST_NUMBERS = 0,
            
            /** Each list item has a letter marker. */
            LIST_LETTERS = 1,
            
            /** Each list item has a roman number marker. */
            LIST_ROMAN = 2,
            
            /** Each list item has a filled circle marker. */
            LIST_DOTS = 3,
        }
        enum MenuItems {
            /** Copies the selected text. */
            MENU_COPY = 0,
            
            /** Selects the whole [RichTextLabel] text. */
            MENU_SELECT_ALL = 1,
            
            /** Represents the size of the [enum MenuItems] enum. */
            MENU_MAX = 2,
        }
        enum MetaUnderline {
            /** Meta tag does not display an underline, even if [member meta_underlined] is `true`. */
            META_UNDERLINE_NEVER = 0,
            
            /** If [member meta_underlined] is `true`, meta tag always display an underline. */
            META_UNDERLINE_ALWAYS = 1,
            
            /** If [member meta_underlined] is `true`, meta tag display an underline when the mouse cursor is over it. */
            META_UNDERLINE_ON_HOVER = 2,
        }
        enum ImageUpdateMask {
            /** If this bit is set, [method update_image] changes image texture. */
            UPDATE_TEXTURE = 1,
            
            /** If this bit is set, [method update_image] changes image size. */
            UPDATE_SIZE = 2,
            
            /** If this bit is set, [method update_image] changes image color. */
            UPDATE_COLOR = 4,
            
            /** If this bit is set, [method update_image] changes image inline alignment. */
            UPDATE_ALIGNMENT = 8,
            
            /** If this bit is set, [method update_image] changes image texture region. */
            UPDATE_REGION = 16,
            
            /** If this bit is set, [method update_image] changes image padding. */
            UPDATE_PAD = 32,
            
            /** If this bit is set, [method update_image] changes image tooltip. */
            UPDATE_TOOLTIP = 64,
            
            /** If this bit is set, [method update_image] changes image width from/to percents. */
            UPDATE_WIDTH_IN_PERCENT = 128,
        }
    }
    /** A control for displaying text that can contain different font styles, images, and basic formatting.  
     *  	  
     *  @link https://docs.godotengine.org/en/4.4/classes/class_richtextlabel.html  
     */
    class RichTextLabel<Map extends Record<string, Node> = Record<string, Node>> extends Control<Map> {
        constructor(identifier?: any)
        /** Returns the text without BBCode mark-up. */
        get_parsed_text(): string
        
        /** Adds raw non-BBCode-parsed text to the tag stack. */
        add_text(text: string): void
        
        /** Adds an image's opening and closing tags to the tag stack, optionally providing a [param width] and [param height] to resize the image, a [param color] to tint the image and a [param region] to only use parts of the image.  
         *  If [param width] or [param height] is set to 0, the image size will be adjusted in order to keep the original aspect ratio.  
         *  If [param width] and [param height] are not set, but [param region] is, the region's rect will be used.  
         *  [param key] is an optional identifier, that can be used to modify the image via [method update_image].  
         *  If [param pad] is set, and the image is smaller than the size specified by [param width] and [param height], the image padding is added to match the size instead of upscaling.  
         *  If [param size_in_percent] is set, [param width] and [param height] values are percentages of the control width instead of pixels.  
         */
        add_image(image: Texture2D, width: int64 = 0, height: int64 = 0, color: Color = new Color(1, 1, 1, 1), inline_align: InlineAlignment = 5, region: Rect2 = new Rect2(0, 0, 0, 0), key: any = <any> {}, pad: boolean = false, tooltip: string = '', size_in_percent: boolean = false): void
        
        /** Updates the existing images with the key [param key]. Only properties specified by [param mask] bits are updated. See [method add_image]. */
        update_image(key: any, mask: RichTextLabel.ImageUpdateMask, image: Texture2D, width: int64 = 0, height: int64 = 0, color: Color = new Color(1, 1, 1, 1), inline_align: InlineAlignment = 5, region: Rect2 = new Rect2(0, 0, 0, 0), pad: boolean = false, tooltip: string = '', size_in_percent: boolean = false): void
        
        /** Adds a newline tag to the tag stack. */
        newline(): void
        
        /** Removes a paragraph of content from the label. Returns `true` if the paragraph exists.  
         *  The [param paragraph] argument is the index of the paragraph to remove, it can take values in the interval `[0, get_paragraph_count() - 1]`.  
         *  If [param no_invalidate] is set to `true`, cache for the subsequent paragraphs is not invalidated. Use it for faster updates if deleted paragraph is fully self-contained (have no unclosed tags), or this call is part of the complex edit operation and [method invalidate_paragraph] will be called at the end of operation.  
         */
        remove_paragraph(paragraph: int64, no_invalidate: boolean = false): boolean
        
        /** Invalidates [param paragraph] and all subsequent paragraphs cache. */
        invalidate_paragraph(paragraph: int64): boolean
        
        /** Adds a [code skip-lint][font]` tag to the tag stack. Overrides default fonts for its duration.  
         *  Passing `0` to [param font_size] will use the existing default font size.  
         */
        push_font(font: Font, font_size: int64 = 0): void
        
        /** Adds a [code skip-lint][font_size]` tag to the tag stack. Overrides default font size for its duration. */
        push_font_size(font_size: int64): void
        
        /** Adds a [code skip-lint][font]` tag with a normal font to the tag stack. */
        push_normal(): void
        
        /** Adds a [code skip-lint][font]` tag with a bold font to the tag stack. This is the same as adding a [code skip-lint]**` tag if not currently in a [code skip-lint] *` tag. */
        push_bold(): void
        
        /** Adds a [code skip-lint][font]` tag with a bold italics font to the tag stack. */
        push_bold_italics(): void
        
        /** Adds a [code skip-lint][font]` tag with an italics font to the tag stack. This is the same as adding an [code skip-lint] *` tag if not currently in a [code skip-lint]**` tag. */
        push_italics(): void
        
        /** Adds a [code skip-lint][font]` tag with a monospace font to the tag stack. */
        push_mono(): void
        
        /** Adds a [code skip-lint][color]` tag to the tag stack. */
        push_color(color: Color): void
        
        /** Adds a [code skip-lint][outline_size]` tag to the tag stack. Overrides default text outline size for its duration. */
        push_outline_size(outline_size: int64): void
        
        /** Adds a [code skip-lint][outline_color]` tag to the tag stack. Adds text outline for its duration. */
        push_outline_color(color: Color): void
        
        /** Adds a [code skip-lint][p]` tag to the tag stack. */
        push_paragraph(alignment: HorizontalAlignment, base_direction: Control.TextDirection = 0, language: string = '', st_parser: TextServer.StructuredTextParser = 0, justification_flags: TextServer.JustificationFlag = 163, tab_stops: PackedFloat32Array | float32[] = []): void
        
        /** Adds an [code skip-lint][indent]` tag to the tag stack. Multiplies [param level] by current [member tab_size] to determine new margin length. */
        push_indent(level: int64): void
        
        /** Adds [code skip-lint][ol]` or [code skip-lint][ul]` tag to the tag stack. Multiplies [param level] by current [member tab_size] to determine new margin length. */
        push_list(level: int64, type: RichTextLabel.ListType, capitalize: boolean, bullet: string = '•'): void
        
        /** Adds a meta tag to the tag stack. Similar to the BBCode [code skip-lint][url=something]{text}[/url]`, but supports non-[String] metadata types.  
         *  If [member meta_underlined] is `true`, meta tags display an underline. This behavior can be customized with [param underline_mode].  
         *      
         *  **Note:** Meta tags do nothing by default when clicked. To assign behavior when clicked, connect [signal meta_clicked] to a function that is called when the meta tag is clicked.  
         */
        push_meta(data: any, underline_mode: RichTextLabel.MetaUnderline = 1, tooltip: string = ''): void
        
        /** Adds a [code skip-lint][hint]` tag to the tag stack. Same as BBCode [code skip-lint][hint=something]{text}[/hint]`. */
        push_hint(description: string): void
        
        /** Adds language code used for text shaping algorithm and Open-Type font features. */
        push_language(language: string): void
        
        /** Adds a [code skip-lint][u]` tag to the tag stack. */
        push_underline(): void
        
        /** Adds a [code skip-lint][s]` tag to the tag stack. */
        push_strikethrough(): void
        
        /** Adds a [code skip-lint][table=columns,inline_align]` tag to the tag stack. Use [method set_table_column_expand] to set column expansion ratio. Use [method push_cell] to add cells. */
        push_table(columns: int64, inline_align: InlineAlignment = 0, align_to_row: int64 = -1): void
        
        /** Adds a [code skip-lint][dropcap]` tag to the tag stack. Drop cap (dropped capital) is a decorative element at the beginning of a paragraph that is larger than the rest of the text. */
        push_dropcap(string_: string, font: Font, size: int64, dropcap_margins: Rect2 = new Rect2(0, 0, 0, 0), color: Color = new Color(1, 1, 1, 1), outline_size: int64 = 0, outline_color: Color = new Color(0, 0, 0, 0)): void
        
        /** Edits the selected column's expansion options. If [param expand] is `true`, the column expands in proportion to its expansion ratio versus the other columns' ratios.  
         *  For example, 2 columns with ratios 3 and 4 plus 70 pixels in available width would expand 30 and 40 pixels, respectively.  
         *  If [param expand] is `false`, the column will not contribute to the total ratio.  
         */
        set_table_column_expand(column: int64, expand: boolean, ratio: int64 = 1, shrink: boolean = true): void
        
        /** Sets color of a table cell. Separate colors for alternating rows can be specified. */
        set_cell_row_background_color(odd_row_bg: Color, even_row_bg: Color): void
        
        /** Sets color of a table cell border. */
        set_cell_border_color(color: Color): void
        
        /** Sets minimum and maximum size overrides for a table cell. */
        set_cell_size_override(min_size: Vector2, max_size: Vector2): void
        
        /** Sets inner padding of a table cell. */
        set_cell_padding(padding: Rect2): void
        
        /** Adds a [code skip-lint][cell]` tag to the tag stack. Must be inside a [code skip-lint][table]` tag. See [method push_table] for details. Use [method set_table_column_expand] to set column expansion ratio, [method set_cell_border_color] to set cell border, [method set_cell_row_background_color] to set cell background, [method set_cell_size_override] to override cell size, and [method set_cell_padding] to set padding. */
        push_cell(): void
        
        /** Adds a [code skip-lint][fgcolor]` tag to the tag stack. */
        push_fgcolor(fgcolor: Color): void
        
        /** Adds a [code skip-lint][bgcolor]` tag to the tag stack. */
        push_bgcolor(bgcolor: Color): void
        
        /** Adds a custom effect tag to the tag stack. The effect does not need to be in [member custom_effects]. The environment is directly passed to the effect. */
        push_customfx(effect: RichTextEffect, env: GDictionary): void
        
        /** Adds a context marker to the tag stack. See [method pop_context]. */
        push_context(): void
        
        /** Terminates tags opened after the last [method push_context] call (including context marker), or all tags if there's no context marker on the stack. */
        pop_context(): void
        
        /** Terminates the current tag. Use after `push_*` methods to close BBCodes manually. Does not need to follow `add_*` methods. */
        pop(): void
        
        /** Terminates all tags opened by `push_*` methods. */
        pop_all(): void
        
        /** Clears the tag stack, causing the label to display nothing.  
         *      
         *  **Note:** This method does not affect [member text], and its contents will show again if the label is redrawn. However, setting [member text] to an empty [String] also clears the stack.  
         */
        clear(): void
        
        /** Returns the vertical scrollbar.  
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member CanvasItem.visible] property.  
         */
        get_v_scroll_bar(): VScrollBar
        
        /** Scrolls the window's top line to match [param line]. */
        scroll_to_line(line: int64): void
        
        /** Scrolls the window's top line to match first line of the [param paragraph]. */
        scroll_to_paragraph(paragraph: int64): void
        
        /** Scrolls to the beginning of the current selection. */
        scroll_to_selection(): void
        
        /** Returns the current selection first character index if a selection is active, `-1` otherwise. Does not include BBCodes. */
        get_selection_from(): int64
        
        /** Returns the current selection last character index if a selection is active, `-1` otherwise. Does not include BBCodes. */
        get_selection_to(): int64
        
        /** Returns the current selection vertical line offset if a selection is active, `-1.0` otherwise. */
        get_selection_line_offset(): float64
        
        /** Select all the text.  
         *  If [member selection_enabled] is `false`, no selection will occur.  
         */
        select_all(): void
        
        /** Returns the current selection text. Does not include BBCodes. */
        get_selected_text(): string
        
        /** Clears the current selection. */
        deselect(): void
        
        /** The assignment version of [method append_text]. Clears the tag stack and inserts the new content. */
        parse_bbcode(bbcode: string): void
        
        /** Parses [param bbcode] and adds tags to the tag stack as needed.  
         *      
         *  **Note:** Using this method, you can't close a tag that was opened in a previous [method append_text] call. This is done to improve performance, especially when updating large RichTextLabels since rebuilding the whole BBCode every time would be slower. If you absolutely need to close a tag in a future method call, append the [member text] instead of using [method append_text].  
         */
        append_text(bbcode: string): void
        
        /** If [member threaded] is enabled, returns `true` if the background thread has finished text processing, otherwise always return `true`. */
        is_ready(): boolean
        
        /** If [member threaded] is enabled, returns `true` if the background thread has finished text processing, otherwise always return `true`. */
        is_finished(): boolean
        
        /** Returns the line number of the character position provided. Line and character numbers are both zero-indexed.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_character_line(character: int64): int64
        
        /** Returns the paragraph number of the character position provided. Paragraph and character numbers are both zero-indexed.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_character_paragraph(character: int64): int64
        
        /** Returns the total number of characters from text tags. Does not include BBCodes. */
        get_total_character_count(): int64
        
        /** Returns the total number of lines in the text. Wrapped text is counted as multiple lines.  
         *      
         *  **Note:** If [member visible_characters_behavior] is set to [constant TextServer.VC_CHARS_BEFORE_SHAPING] only visible wrapped lines are counted.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_line_count(): int64
        
        /** Returns the indexes of the first and last visible characters for the given [param line], as a [Vector2i].  
         *      
         *  **Note:** If [member visible_characters_behavior] is set to [constant TextServer.VC_CHARS_BEFORE_SHAPING] only visible wrapped lines are counted.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_line_range(line: int64): Vector2i
        
        /** Returns the number of visible lines.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_visible_line_count(): int64
        
        /** Returns the total number of paragraphs (newlines or `p` tags in the tag stack's text tags). Considers wrapped text as one paragraph. */
        get_paragraph_count(): int64
        
        /** Returns the number of visible paragraphs. A paragraph is considered visible if at least one of its lines is visible.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_visible_paragraph_count(): int64
        
        /** Returns the height of the content.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_content_height(): int64
        
        /** Returns the width of the content.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_content_width(): int64
        
        /** Returns the vertical offset of the line found at the provided index.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_line_offset(line: int64): float64
        
        /** Returns the vertical offset of the paragraph found at the provided index.  
         *      
         *  **Note:** If [member threaded] is enabled, this method returns a value for the loaded part of the document. Use [method is_finished] or [signal finished] to determine whether document is fully loaded.  
         */
        get_paragraph_offset(paragraph: int64): float64
        
        /** Parses BBCode parameter [param expressions] into a dictionary. */
        parse_expressions_for_values(expressions: PackedStringArray | string[]): GDictionary
        
        /** Installs a custom effect. This can also be done in the Inspector through the [member custom_effects] property. [param effect] should be a valid [RichTextEffect].  
         *  **Example:** With the following script extending from [RichTextEffect]:  
         *    
         *  The above effect can be installed in [RichTextLabel] from a script:  
         *    
         */
        install_effect(effect: any): void
        
        /** Returns the [PopupMenu] of this [RichTextLabel]. By default, this menu is displayed when right-clicking on the [RichTextLabel].  
         *  You can add custom menu items or remove standard ones. Make sure your IDs don't conflict with the standard ones (see [enum MenuItems]). For example:  
         *    
         *  **Warning:** This is a required internal node, removing and freeing it may cause a crash. If you wish to hide it or any of its children, use their [member Window.visible] property.  
         */
        get_menu(): PopupMenu
        
        /** Returns whether the menu is visible. Use this instead of `get_menu().visible` to improve performance (so the creation of the menu is avoided). */
        is_menu_visible(): boolean
        
        /** Executes a given action as defined in the [enum MenuItems] enum. */
        menu_option(option: int64): void
        
        /** If `true`, the label uses BBCode formatting.  
         *      
         *  **Note:** This only affects the contents of [member text], not the tag stack.  
         */
        get bbcode_enabled(): boolean
        set bbcode_enabled(value: boolean)
        
        /** The label's text in BBCode format. Is not representative of manual modifications to the internal tag stack. Erases changes made by other methods when edited.  
         *      
         *  **Note:** If [member bbcode_enabled] is `true`, it is unadvised to use the `+=` operator with [member text] (e.g. `text += "some string"`) as it replaces the whole text and can cause slowdowns. It will also erase all BBCode that was added to stack using `push_*` methods. Use [method append_text] for adding text instead, unless you absolutely need to close a tag that was opened in an earlier method call.  
         */
        get text(): string
        set text(value: string)
        
        /** If `true`, the label's minimum size will be automatically updated to fit its content, matching the behavior of [Label]. */
        get fit_content(): boolean
        set fit_content(value: boolean)
        
        /** If `true`, the scrollbar is visible. Setting this to `false` does not block scrolling completely. See [method scroll_to_line]. */
        get scroll_active(): boolean
        set scroll_active(value: boolean)
        
        /** If `true`, the window scrolls down to display new content automatically. */
        get scroll_following(): boolean
        set scroll_following(value: boolean)
        
        /** If set to something other than [constant TextServer.AUTOWRAP_OFF], the text gets wrapped inside the node's bounding rectangle. To see how each mode behaves, see [enum TextServer.AutowrapMode]. */
        get autowrap_mode(): int64
        set autowrap_mode(value: int64)
        
        /** The number of spaces associated with a single tab length. Does not affect `\t` in text tags, only indent tags. */
        get tab_size(): int64
        set tab_size(value: int64)
        
        /** If `true`, a right-click displays the context menu. */
        get context_menu_enabled(): boolean
        set context_menu_enabled(value: boolean)
        
        /** If `true`, shortcut keys for context menu items are enabled, even if the context menu is disabled. */
        get shortcut_keys_enabled(): boolean
        set shortcut_keys_enabled(value: boolean)
        
        /** Controls the text's horizontal alignment. Supports left, center, right, and fill, or justify. Set it to one of the [enum HorizontalAlignment] constants. */
        get horizontal_alignment(): int64
        set horizontal_alignment(value: int64)
        
        /** Controls the text's vertical alignment. Supports top, center, bottom, and fill. Set it to one of the [enum VerticalAlignment] constants. */
        get vertical_alignment(): int64
        set vertical_alignment(value: int64)
        
        /** Line fill alignment rules. See [enum TextServer.JustificationFlag] for more information. */
        get justification_flags(): int64
        set justification_flags(value: int64)
        
        /** Aligns text to the given tab-stops. */
        get tab_stops(): PackedFloat32Array
        set tab_stops(value: PackedFloat32Array | float32[])
        
        /** The currently installed custom effects. This is an array of [RichTextEffect]s.  
         *  To add a custom effect, it's more convenient to use [method install_effect].  
         */
        get custom_effects(): GArray
        set custom_effects(value: GArray)
        
        /** If `true`, the label underlines meta tags such as [code skip-lint][url]{text}[/url]`. These tags can call a function when clicked if [signal meta_clicked] is connected to a function. */
        get meta_underlined(): boolean
        set meta_underlined(value: boolean)
        
        /** If `true`, the label underlines hint tags such as [code skip-lint][hint=description]{text}[/hint]`. */
        get hint_underlined(): boolean
        set hint_underlined(value: boolean)
        
        /** If `true`, text processing is done in a background thread. */
        get threaded(): boolean
        set threaded(value: boolean)
        
        /** The delay after which the loading progress bar is displayed, in milliseconds. Set to `-1` to disable progress bar entirely.  
         *      
         *  **Note:** Progress bar is displayed only if [member threaded] is enabled.  
         */
        get progress_bar_delay(): int64
        set progress_bar_delay(value: int64)
        
        /** If `true`, the label allows text selection. */
        get selection_enabled(): boolean
        set selection_enabled(value: boolean)
        
        /** If `true`, the selected text will be deselected when focus is lost. */
        get deselect_on_focus_loss_enabled(): boolean
        set deselect_on_focus_loss_enabled(value: boolean)
        
        /** If `true`, allow drag and drop of selected text. */
        get drag_and_drop_selection_enabled(): boolean
        set drag_and_drop_selection_enabled(value: boolean)
        
        /** The number of characters to display. If set to `-1`, all characters are displayed. This can be useful when animating the text appearing in a dialog box.  
         *      
         *  **Note:** Setting this property updates [member visible_ratio] accordingly.  
         */
        get visible_characters(): int64
        set visible_characters(value: int64)
        
        /** Sets the clipping behavior when [member visible_characters] or [member visible_ratio] is set. See [enum TextServer.VisibleCharactersBehavior] for more info. */
        get visible_characters_behavior(): int64
        set visible_characters_behavior(value: int64)
        
        /** The fraction of characters to display, relative to the total number of characters (see [method get_total_character_count]). If set to `1.0`, all characters are displayed. If set to `0.5`, only half of the characters will be displayed. This can be useful when animating the text appearing in a dialog box.  
         *      
         *  **Note:** Setting this property updates [member visible_characters] accordingly.  
         */
        get visible_ratio(): float64
        set visible_ratio(value: float64)
        
        /** Base text writing direction. */
        get text_direction(): int64
        set text_direction(value: int64)
        
        /** Language code used for line-breaking and text shaping algorithms, if left empty current locale is used instead. */
        get language(): string
        set language(value: string)
        
        /** Set BiDi algorithm override for the structured text. */
        get structured_text_bidi_override(): int64
        set structured_text_bidi_override(value: int64)
        
        /** Set additional options for BiDi override. */
        get structured_text_bidi_override_options(): GArray
        set structured_text_bidi_override_options(value: GArray)
        
        /** Triggered when the user clicks on content between meta (URL) tags. If the meta is defined in BBCode, e.g. [code skip-lint][url={"key": "value"}]Text[/url]`, then the parameter for this signal will always be a [String] type. If a particular type or an object is desired, the [method push_meta] method must be used to manually insert the data into the tag stack. Alternatively, you can convert the [String] input to the desired type based on its contents (such as calling [method JSON.parse] on it).  
         *  For example, the following method can be connected to [signal meta_clicked] to open clicked URLs using the user's default web browser:  
         *    
         */
        readonly meta_clicked: Signal1<any>
        
        /** Triggers when the mouse enters a meta tag. */
        readonly meta_hover_started: Signal1<any>
        
        /** Triggers when the mouse exits a meta tag. */
        readonly meta_hover_ended: Signal1<any>
        
        /** Triggered when the document is fully loaded.  
         *      
         *  **Note:** This can happen before the text is processed for drawing. Scrolling values may not be valid until the document is drawn for the first time after this signal.  
         */
        readonly finished: Signal0
    }
}
