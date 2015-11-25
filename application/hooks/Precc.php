<?php

/**
 * Description of PRE_C
 *
 * @package CarbonCopy
 * @subpackage core
 * @author Cristian Riffo <criffoh@gmail.com>
 */
class Precc {

    protected $_ci;

    public function __construct()
    {
        $this->_ci = &get_instance();
    }

    /**
     * Set CC account as default if no one is seted.
     */
    public function current_accoount()
    {
        if ($this->_ci->session->userdata('current_account') === NULL) {
            $this->_ci->session->set_userdata('current_account', 'cc');
        }
    }

    /**
     * Get user language to set in frontend.
     */
    public function user_language()
    {
        $user_info = user_info();
        $language = 'english';

        if ( ! is_null($user_info) && isset($user_info['info']['language'])) {
            $language = $user_info['info']['language'];
        }

        $this->_ci->lang->load('cc', $language);
    }

    public function template()
    {
        $this->_ci->load->library('user_agent');
        
        if ($this->_ci->agent->is_mobile()) {
            define('_TEMPLATE', 'mob_2015');
        }
        else {
            define('_TEMPLATE', 'pc_2015');
        }
    }

}
